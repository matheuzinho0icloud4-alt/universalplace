
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

import { useToast } from '@/hooks/use-toast';
import { fetchCategories } from '@/services/categories';

const ProductForm = ({ isOpen, onClose, onSubmit, product = null }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    image: '',
    name: '',
    product_link: '',
    description: '',
    category_id: '',
    is_featured: false
  });
  
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        image: product.image ? product.image : '',
        name: product.name || '',
        product_link: product.product_link || product.link_oferta || '',
        description: product.description || '',
        category_id: product.category_id || '',
        is_featured: product.is_featured || false
      });
    } else {
      setFormData({ image: '', name: '', product_link: '', description: '', category_id: '', is_featured: false });
    }
    setErrors({});
  }, [product, isOpen]);

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

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
        product_link: formData.product_link,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        is_featured: formData.is_featured
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-2xl">{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription className="text-xs md:text-sm">
            {product ? 'Update the product information below.' : 'Fill in the details below to add a new product to your store.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="image" className="text-sm">Product Image URL</Label>
            <Input
              id="image"
              type="text"
              placeholder="Cole a URL da imagem"
              value={formData.image}
              onChange={handleImageUrlChange}
              className="mt-1 text-gray-900 text-sm"
            />
            {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
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
            <Label htmlFor="name" className="text-sm">Name</Label>
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

          <div>
            <Label htmlFor="category">Categoria</Label>
            <select
              id="category"
              value={formData.category_id}
              onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
              disabled={loadingCategories}
            >
              <option value="">Selecionar categoria</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
            />
            <Label htmlFor="is_featured">Produto em destaque</Label>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {product ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
