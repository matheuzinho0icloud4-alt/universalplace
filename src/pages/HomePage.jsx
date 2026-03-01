
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchStoreConfig } from '@/services/storeConfig';
import { fetchProducts } from '@/services/products';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [storeConfig, setStoreConfig] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const productsPerPage = 12;

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const cfg = await fetchStoreConfig();
      setStoreConfig(cfg && typeof cfg === 'object' ? cfg : {});
    } catch (err) {
      // fallback to default if API fails
      setStoreConfig({ name: 'Ofertas Universal Place', logo: '', banner: '', socialMedia: {} });
    }
    try {
      const prods = await fetchProducts();
      setProducts(Array.isArray(prods) ? prods : []);
    } catch (err) {
      toast({ title: 'Error', description: err?.message || 'Failed to fetch products', variant: 'destructive' });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!storeConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{storeConfig.name} - Las Mejores Ofertas</title>
        <meta name="description" content={`Descubre las mejores ofertas y promociones en ${storeConfig.name}. Productos seleccionados con los mejores precios del mercado.`} />
      </Helmet>

      <Layout>


        {/* Hero Banner */}
        <section 
          className="relative h-[400px] bg-cover bg-center"
          style={{ backgroundImage: `url(${storeConfig.banner})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4"
            >
              Bem-vindo à Central de Ofertas
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-white max-w-2xl"
            >
              Reunimos as melhores ofertas dos mercados online em um só lugar para você economizar tempo e dinheiro. Compare, descubra promoções e aproveite oportunidades.
            </motion.p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-600">No hay ofertas disponibles en este momento</p>
              <p className="text-gray-500 mt-2">¡Vuelve pronto para descubrir nuevas promociones!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="h-64 overflow-hidden">
                        <img 
                          src={product.image ? encodeURI(product.image) : ''} 
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <p className="text-gray-700 mb-4 font-semibold">{product.name}</p>
                        <Button
                          className="w-full"
                          onClick={() => {
                            if (product.link_oferta) {
                              window.open(product.link_oferta, '_blank');
                            } else {
                              toast({
                                title: product.name,
                                description: `Ver detalhes`,
                              });
                            }
                          }}
                        >
                          Ver Oferta
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index + 1}
                      variant={currentPage === index + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

        </Layout>
    </>
  );
};

export default HomePage;
