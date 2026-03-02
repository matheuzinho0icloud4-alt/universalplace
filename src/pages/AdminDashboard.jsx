
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { getStoreConfig } from '@/utils/config';
import { fetchProducts, createProduct, updateProductApi, deleteProductApi } from '@/services/products';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Plus, Edit, Trash2, Package, Settings } from 'lucide-react';
import ProductForm from '@/components/ProductForm';
import StoreSettingsForm from '@/components/StoreSettingsForm';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [storeConfig, setStoreConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // make the loader stable so child components can depend on it without
  // accidentally being replaced by a primitive value (boolean, etc.)
  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const cfg = getStoreConfig();
      setStoreConfig(cfg);

      const prods = await fetchProducts();
      setProducts(Array.isArray(prods) ? prods : []);
    } catch (err) {
      toast({ title: 'Error', description: err?.message || 'Failed to fetch data', variant: 'destructive' });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // exposed to child components (e.g. StoreSettingsForm)
  const handleSettingsUpdate = React.useCallback(() => {
    if (typeof fetchData === 'function') {
      fetchData();
    }
  }, [fetchData]);

  const handleLogout = React.useCallback(() => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
    navigate('/');
  }, [logout, navigate, toast]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleProductSubmit = async (productData, file) => {
    setLoading(true);
    try {
      if (editingProduct) {
        await updateProductApi(editingProduct.id, productData, file);
        toast({
          title: 'Product updated',
          description: 'Product has been updated successfully.',
        });
      } else {
        await createProduct(productData, file);
        toast({
          title: 'Product added',
          description: 'New product has been added successfully.',
        });
      }
      // refresh list after modify
      fetchData();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Operation failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      setLoading(true);
      try {
        await deleteProductApi(productToDelete.id);
        fetchData();
        toast({
          title: 'Product deleted',
          description: 'Product has been removed successfully.',
        });
      } catch (err) {
        toast({
          title: 'Error',
          description: err.message || 'Failed to delete',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  if (!storeConfig || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - {storeConfig.name}</title>
        <meta name="description" content="Admin dashboard for managing products and store settings" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{storeConfig.name}</h1>
                <p className="text-sm text-gray-600">Admin Dashboard</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {currentUser?.email || currentUser?.id}</span>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="products">
                <Package className="w-4 h-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2" />
                Store Settings
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Product Management</CardTitle>
                  <Button onClick={handleAddProduct} disabled={loading}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Product
                  </Button>
                </CardHeader>
                <CardContent>
                  {products.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 text-lg">No products yet</p>
                      <p className="text-gray-500 text-sm mb-4">Start by adding your first product</p>
                      <Button onClick={handleAddProduct}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <img 
                                src={product.image ? encodeURI(product.image) : ''} 
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <p className="line-clamp-2 font-semibold">{product.name}</p>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteClick(product)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <StoreSettingsForm onUpdate={handleSettingsUpdate} />
            </TabsContent>
          </Tabs>
        </main>

        {/* Product Form Dialog */}
        <ProductForm
          isOpen={isProductFormOpen}
          onClose={() => {
            setIsProductFormOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={handleProductSubmit}
          product={editingProduct}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default AdminDashboard;
