import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchProductsByCategory } from '@/services/products';

const CategoryPage = () => {
  const { slug } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const productsPerPage = 12;

  const fetchData = React.useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const data = await fetchProductsByCategory(slug, page, productsPerPage);
      setCategoryData(data);
      setCurrentPage(page);
    } catch (err) {
      toast({ title: 'Error', description: err?.message || 'Failed to fetch category products', variant: 'destructive' });
      setCategoryData({ products: [], total: 0, page: 1, limit: productsPerPage, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  }, [slug, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (page) => {
    fetchData(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!categoryData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const { products, total, totalPages } = categoryData;
  const categoryName = products[0]?.category_name || 'Categoria';

  return (
    <>
      <Helmet>
        <title>{categoryName} - Universal Place</title>
        <meta name="description" content={`Explore produtos da categoria ${categoryName} na Universal Place`} />
      </Helmet>

      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="outline" asChild className="mb-4">
              <Link to="/">
                Voltar à página principal
              </Link>
            </Button>
            <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
            <p className="text-muted-foreground">
              {total} produto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="aspect-square mb-3 overflow-hidden rounded-lg">
                        <img
                          src={product.image || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
                      <Button asChild size="sm" className="w-full">
                        <a href={product.product_link} target="_blank" rel="noopener noreferrer">
                          Ver Oferta
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Próximo
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Layout>
    </>
  );
};

export default CategoryPage;