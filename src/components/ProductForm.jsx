
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
    image: '',
    name: '',
    product_link: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        image: product.image ? product.image : '',
        name: product.name || '',
        product_link: product.product_link || product.link_oferta || '',
        description: product.description || ''
      });
    } else {
      setFormData({ image: '', name: '', product_link: '', description: '' });
    }
    setErrors({});
  }, [product, isOpen]);

  const handleImageUrlChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.value }));
    if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
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
    if (!formData.image || !isValidUrl(formData.image)) {
      newErrors.image = 'Valid product image URL is required';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (formData.product_link && !isValidUrl(formData.product_link)) {
      newErrors.product_link = 'Invalid product link URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      const payload = {
        name: formData.name,
        image: formData.image,
        description: formData.description,
        product_link: formData.product_link
      };
      onSubmit(payload);
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
            <Label htmlFor="image">Product Image URL</Label>
            <Input
              id="image"
              type="text"
              placeholder="Cole a URL da imagem"
              value={formData.image}
              onChange={handleImageUrlChange}
              className="mt-1 text-gray-900"
            />
            {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-2 w-full h-32 object-cover rounded-md"
                onError={(e) => { e.target.style.display = 'none' }}
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
            <Label htmlFor="product_link">Link do produto (opcional)</Label>
            <Input
              id="product_link"
              type="url"
              value={formData.product_link}
              onChange={(e) => setFormData(prev => ({ ...prev, product_link: e.target.value }))}
              placeholder="https://exemplo.com/produto"
              className="mt-1 text-gray-900"
            />
            {errors.product_link && <p className="text-sm text-red-500 mt-1">{errors.product_link}</p>}
          </div>

          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição do produto"
              className="mt-1 text-gray-900"
            />
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
