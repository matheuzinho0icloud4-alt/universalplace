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
    logo: '',
    banner: '',
    socialMedia: {
      instagram: '',
      facebook: '',
      whatsapp: ''
    }
  });
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load store config on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const loaded = await fetchStoreConfig();
        if (mounted && loaded && typeof loaded === 'object') {
          setFormData(loaded);
        }
      } catch (err) {
        console.warn('Failed to load store config:', err?.message);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleImageUpload = (e, field) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    if (file && typeof file.size === 'number' && file.size > 5_000_000) {
      setErrors(prev => ({
        ...prev,
        [field]: 'Image size must be less than 5MB'
      }));
      return;
    }

    const url = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, [field]: url }));

    if (field === 'logo') {
      setLogoFile(file);
    } else if (field === 'banner') {
      setBannerFile(file);
    }

    setErrors(prev => ({ ...prev, [field]: '' }));
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

      // If there are files, send as multipart/form-data
      if (logoFile || bannerFile) {
        const fd = new FormData();
        fd.append('name', formData.name || '');
        fd.append('instagram', formData.socialMedia.instagram || '');
        fd.append('facebook', formData.socialMedia.facebook || '');
        fd.append('whatsapp', formData.socialMedia.whatsapp || '');
        // preserve existing remote URLs if no new file was uploaded
        if (formData.logo && !logoFile) fd.append('logo', formData.logo);
        if (formData.banner && !bannerFile) fd.append('banner', formData.banner);
        if (logoFile) fd.append('logo', logoFile, logoFile.name);
        if (bannerFile) fd.append('banner', bannerFile, bannerFile.name);

        updated = await updateStoreConfig(fd);
      } else {
        // JSON path
        const payload = {
          name: formData.name,
          logo: formData.logo,
          banner: formData.banner,
          socialMedia: formData.socialMedia
        };
        updated = await updateStoreConfig(payload);
      }

      if (!updated || typeof updated !== 'object') {
        console.warn('updateStoreConfig returned unexpected value:', updated);
      }

      // Call parent callback with updated config
      try {
        if (typeof onUpdate === 'function') {
          onUpdate(updated);
        }
      } catch (err) {
        console.warn('StoreSettingsForm: onUpdate raised error', err);
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
          logo: updated.logo || prev.logo,
          banner: updated.banner || prev.banner,
          socialMedia: updated.socialMedia || prev.socialMedia
        }))
      }

      // Clear file objects
      setLogoFile(null);
      setBannerFile(null);
    } catch (err) {
      console.error('Failed to save settings:', err);
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

          {/* Logo */}
          <div>
            <Label htmlFor="logo">Logo</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'logo')}
              className="mt-1"
              disabled={loading}
            />
            {errors.logo && (
              <p className="text-sm text-red-500 mt-1">{errors.logo}</p>
            )}
            {formData.logo && (
              <div className="mt-3">
                <img
                  src={formData.logo}
                  alt="Logo preview"
                  className="h-20 object-contain"
                />
              </div>
            )}
          </div>

          {/* Banner */}
          <div>
            <Label htmlFor="banner">Banner Image</Label>
            <Input
              id="banner"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'banner')}
              className="mt-1"
              disabled={loading}
            />
            {errors.banner && (
              <p className="text-sm text-red-500 mt-1">{errors.banner}</p>
            )}
            {formData.banner && (
              <div className="mt-3">
                <img
                  src={formData.banner}
                  alt="Banner preview"
                  className="w-full h-32 object-cover rounded-md"
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
