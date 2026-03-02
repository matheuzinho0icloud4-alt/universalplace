
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { useToast } from '@/hooks/use-toast';

const ProductForm = ({ isOpen, onClose, onSubmit, product = null }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    imagePreview: '',
    name: '',
    link_oferta: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        imagePreview: product.image ? encodeURI(product.image) : '',
        name: product.name || '',
        link_oferta: product.link_oferta || ''
      });
    } else {
      setFormData({
        imagePreview: '',
        name: '',
        link_oferta: ''
      });
    }
    setImageFile(null);
    setErrors({});
  }, [product, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imagePreview: url }));
      setImageFile(file);
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!imageFile && !formData.imagePreview) {
      newErrors.image = 'Product image is required';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (formData.link_oferta && !isValidUrl(formData.link_oferta)) {
      newErrors.link_oferta = 'Invalid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      const payload = { name: formData.name, link_oferta: formData.link_oferta };
      onSubmit(payload, imageFile);
      toast({
        title: product ? 'Product updated' : 'Product added',
        description: product ? 'Product has been updated successfully.' : 'New product has been added successfully.',
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Update the product information below.' : 'Fill in the details below to add a new product to your store.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="image">Product Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1"
            />
            {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}
            {formData.imagePreview && (
              <img 
                src={formData.imagePreview} 
                alt="Preview" 
                className="mt-2 w-full h-32 object-cover rounded-md"
              />
            )}
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter product name"
              className="mt-1 text-gray-900"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="link_oferta">Link da Oferta (opcional)</Label>
            <Input
              id="link_oferta"
              type="url"
              value={formData.link_oferta}
              onChange={(e) => setFormData(prev => ({ ...prev, link_oferta: e.target.value }))}
              placeholder="https://exemplo.com/oferta"
              className="mt-1 text-gray-900"
            />
            {errors.link_oferta && <p className="text-sm text-red-500 mt-1">{errors.link_oferta}</p>}
            {formData.link_oferta && (
              <p className="text-xs text-green-600 mt-1">✓ URL válida</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {product ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
