import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchStoreConfig, updateStoreConfig } from '@/services/storeConfig';
import { useToast } from '@/hooks/use-toast';

const StoreSettingsForm = ({ onUpdate = () => {} }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    banner_url: '',
    socialMedia: {
      instagram: '',
      facebook: '',
      whatsapp: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load store config on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const loaded = await fetchStoreConfig();
        if (mounted && loaded && typeof loaded === 'object') {
          // normalize older keys (logo/banner) to logo_url/banner_url
          const normalized = {
            ...loaded,
            logo_url: loaded.logo_url || loaded.logo || '',
            banner_url: loaded.banner_url || loaded.banner || '',
          }
          setFormData(normalized);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleNameChange = (e) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Store name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (!validate()) {
      toast({
        title: 'Validation error',
        description: 'Please check all required fields',
        variant: 'destructive'
      });
      return;
    }

    if (!formData || typeof formData !== 'object') {
      toast({
        title: 'Error',
        description: 'Invalid configuration object',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      let updated;

      const payload = {
        name: formData.name,
        logo_url: formData.logo_url,
        banner_url: formData.banner_url,
        socialMedia: formData.socialMedia
      }

      updated = await updateStoreConfig(payload);

      if (!updated || typeof updated !== 'object') {
        return;
      }

      // Call parent callback with updated config
      try {
        if (typeof onUpdate === 'function') {
          onUpdate(updated);
        }
      } catch {
        // ignore callback errors
      }

      toast({
        title: 'Settings saved',
        description: 'Store settings have been updated successfully.'
      });

      // update local state with server-returned URLs (do not persist blob URLs)
      if (updated && typeof updated === 'object') {
        setFormData(prev => ({
          ...prev,
          name: updated.name || prev.name,
          logo_url: updated.logo_url || updated.logo || prev.logo_url,
          banner_url: updated.banner_url || updated.banner || prev.banner_url,
          socialMedia: updated.socialMedia || prev.socialMedia
        }))
      }
      // no files to clear
    } catch (err) {
      toast({
        title: 'Error',
        description: err?.message || 'Failed to save settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Store Name */}
          <div>
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Enter store name"
              className="mt-1 text-gray-900"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Logo URL */}
          <div>
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              type="text"
              placeholder="Cole a URL da logo"
              value={formData.logo_url}
              onChange={(e) => handleInputChange('logo_url', e.target.value)}
              className="mt-1 text-gray-900"
              disabled={loading}
            />
            {errors.logo_url && (
              <p className="text-sm text-red-500 mt-1">{errors.logo_url}</p>
            )}
            {formData.logo_url && (
              <div className="mt-3">
                <img
                  src={formData.logo_url}
                  alt="Logo preview"
                  className="h-20 object-contain"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
            )}
          </div>

          {/* Banner URL */}
          <div>
            <Label htmlFor="banner_url">Banner URL</Label>
            <Input
              id="banner_url"
              type="text"
              placeholder="Cole a URL do banner"
              value={formData.banner_url}
              onChange={(e) => handleInputChange('banner_url', e.target.value)}
              className="mt-1 text-gray-900"
              disabled={loading}
            />
            {errors.banner_url && (
              <p className="text-sm text-red-500 mt-1">{errors.banner_url}</p>
            )}
            {formData.banner_url && (
              <div className="mt-3">
                <img
                  src={formData.banner_url}
                  alt="Banner preview"
                  className="w-full h-32 object-cover rounded-md"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
            )}
          </div>

          {/* Social Media Links */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-semibold text-lg">Social Media Links</h3>

            <div>
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input
                id="instagram"
                type="url"
                value={formData.socialMedia.instagram}
                onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                placeholder="https://instagram.com/yourstore"
                className="mt-1 text-gray-900"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input
                id="facebook"
                type="url"
                value={formData.socialMedia.facebook}
                onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                placeholder="https://facebook.com/yourstore"
                className="mt-1 text-gray-900"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp URL</Label>
              <Input
                id="whatsapp"
                type="url"
                value={formData.socialMedia.whatsapp}
                onChange={(e) => handleSocialMediaChange('whatsapp', e.target.value)}
                placeholder="https://wa.me/1234567890"
                className="mt-1 text-gray-900"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StoreSettingsForm;
