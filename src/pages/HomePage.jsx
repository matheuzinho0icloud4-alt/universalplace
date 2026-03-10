import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { fetchStoreConfig } from '@/services/storeConfig';
import { fetchFeaturedProducts, fetchRecentProducts } from '@/services/products';
import { fetchCategories, fetchCategoriesForHome } from '@/services/categories';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import RecentCarousel from '@/components/RecentCarousel';
import CategoryCarousel from '@/components/CategoryCarousel';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [storeConfig, setStoreConfig] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      // Configuração da loja
      const cfg = await fetchStoreConfig();
      const fullCfg = {
        name: cfg?.name || 'Ofertas Universal Place',
        logo: cfg?.logo_url || cfg?.logo || '',
        banner: cfg?.banner_url || cfg?.banner || '',
        socialMedia: cfg?.socialMedia || { instagram: '', facebook: '', whatsapp: '' }
      };
      setStoreConfig(fullCfg);

      // Produtos em destaque (máx 6)
      const featured = await fetchFeaturedProducts();
      setFeaturedProducts(Array.isArray(featured) ? featured : []);

      // Produtos recentes (máx 8)
      const recent = await fetchRecentProducts();
      setRecentProducts(Array.isArray(recent) ? recent : []);

      // Categorias com produtos (show_home=true, com produtos)
      const cats = await fetchCategoriesForHome();
      setCategories(Array.isArray(cats) ? cats : []);

      // Todas as categorias para menu
      const allCats = await fetchCategories();
      const menuCats = allCats.filter(cat => cat.show_home).sort((a, b) => a.home_order - b.home_order);
      setAllCategories(menuCats);
    } catch (err) {
      toast({ title: 'Erro', description: err?.message || 'Falha ao carregar dados', variant: 'destructive' });
      setFeaturedProducts([]);
      setRecentProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        <title>{storeConfig.name} - As Melhores Ofertas</title>
        <meta name="description" content={`Descubra as melhores ofertas e promoções em ${storeConfig.name}. Produtos selecionados com os melhores preços do mercado.`} />
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
              className="text-xl text-white mb-8"
            >
              Encontre as melhores promoções e ofertas exclusivas
            </motion.p>
          </div>
        </section>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Seção 0: Menu de Categorias */}
              {allCategories.length > 0 && (
                <section className="mb-8 md:mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Categorias</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                    {allCategories.map((category) => (
                      <Link key={category.id} to={`/categoria/${category.slug}`}>
                        <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-lg transition-shadow duration-200 text-center">
                          <h3 className="font-semibold text-sm md:text-base lg:text-lg mb-2 line-clamp-2">{category.name}</h3>
                          <p className="text-xs md:text-sm text-gray-600">Ver produtos</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Seção 1: Produtos em Destaque */}
              {featuredProducts.length > 0 && (
                <section className="mb-8 md:mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Produtos em Destaque</h2>
                  <FeaturedCarousel products={featuredProducts} />
                </section>
              )}

              {/* Seção 2: Produtos Recém Adicionados */}
              {recentProducts.length > 0 && (
                <section className="mb-8 md:mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Produtos Recém Adicionados</h2>
                  <RecentCarousel products={recentProducts} />
                </section>
              )}

              {/* Seção 3: Categorias */}
              {categories.map((category) => (
                <section key={category.id} className="mb-12">
                  <CategoryCarousel category={category} />
                </section>
              ))}
            </>
          )}
        </div>
      </Layout>
    </>
  );
};

export default HomePage;
