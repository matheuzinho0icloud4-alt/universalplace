import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const FeaturedCarousel = ({ products }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        className="flex gap-3 md:gap-4 overflow-x-auto pb-4 px-2 md:px-0 scroll-smooth snap-x snap-mandatory scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {(products || []).slice(0, 6).map((product) => (
          <Card key={product.id} className="min-w-[calc(50vw-20px)] sm:min-w-[calc(33.333%-10px)] md:min-w-[180px] lg:min-w-[200px] max-w-[200px] overflow-hidden flex-shrink-0 snap-start transition hover:scale-[1.03] hover:shadow-lg">
            <img
              loading="lazy"
              decoding="async"
              src={product.image || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
            <CardContent className="p-3 md:p-4 flex flex-col">
              <h3 className="font-semibold text-xs md:text-sm line-clamp-2 mb-2">{product.name}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-grow">{product.description}</p>
              <Button asChild size="sm" className="w-full">
                <a href={product.product_link} target="_blank" rel="noopener noreferrer">
                  Ver Oferta
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Setas de navegação - apenas desktop */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white shadow-lg hover:bg-gray-100 hidden md:flex"
        onClick={scrollLeft}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white shadow-lg hover:bg-gray-100 hidden md:flex"
        onClick={scrollRight}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FeaturedCarousel;