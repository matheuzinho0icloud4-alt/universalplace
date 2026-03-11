import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchCategories } from '@/services/categories';
import { useToast } from '@/hooks/use-toast';
import { Menu } from 'lucide-react';

const CategoriesMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      loadCategories();
    }
  }, [isOpen, categories.length]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const allCats = await fetchCategories();
      const menuCats = allCats
        .filter(cat => cat.show_home)
        .sort((a, b) => a.home_order - b.home_order);
      setCategories(menuCats);
    } catch (err) {
      toast({
        title: 'Erro',
        description: err?.message || 'Falha ao carregar categorias',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (slug) => {
    setIsOpen(false);
    navigate(`/categoria/${slug}`);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="gap-2 text-sm md:text-base"
      >
        <Menu className="w-4 h-4" />
        Categorias
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Categorias</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Nenhuma categoria disponível</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className="block w-full bg-card border border-border rounded-lg p-3 md:p-4 hover:shadow-lg hover:border-primary transition-all duration-200 text-left"
                >
                  <h3 className="font-semibold text-sm md:text-base text-foreground mb-1 line-clamp-2">
                    {category.name}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Ver produtos
                  </p>
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoriesMenu;
