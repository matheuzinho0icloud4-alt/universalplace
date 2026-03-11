import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchStoreConfig } from '@/services/storeConfig';

function Layout({ children }) {
  const [storeConfig, setStoreConfig] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cfg = await fetchStoreConfig();
        // Ensure cfg has all required properties with defaults
        const fullCfg = {
          name: cfg?.name || 'Ofertas Universal Place',
          logo: cfg?.logo_url || cfg?.logo || '',
          banner: cfg?.banner_url || cfg?.banner || '',
          socialMedia: cfg?.socialMedia || { instagram: '', facebook: '', youtube: '' }
        };
        if (mounted) setStoreConfig(fullCfg);
      } catch {
        // fallback defaults when config fails to load
        if (mounted) {
          setStoreConfig({ 
            name: 'Ofertas Universal Place', 
            logo: '', 
            banner: '', 
            socialMedia: { instagram: '', facebook: '', youtube: '' } 
          });
        }
      }
    })();
    return () => { mounted = false; };
  }, [toast]);

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
        <title>{storeConfig.name}</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-background border-b border-border shadow-md sticky top-0 z-50">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 md:gap-4 flex-1">
                {storeConfig.logo && (
                  <img src={storeConfig.logo} alt={`${storeConfig.name} logo`} className="h-12 sm:h-14 md:h-16 lg:h-20 object-contain flex-shrink-0" />
                )}
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground truncate">{storeConfig.name}</h1>
              </div>

              <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto">
                {/* Social Media Links */}
                <div className="flex items-center gap-2 md:gap-3">
                  {storeConfig.socialMedia.instagram && (
                    <a 
                      href={storeConfig.socialMedia.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-pink-400 hover:text-pink-300 transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                    </a>
                  )}
                  {storeConfig.socialMedia.facebook && (
                    <a 
                      href={storeConfig.socialMedia.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Facebook className="w-4 h-4 md:w-5 md:h-5" />
                    </a>
                  )}
                  {storeConfig.socialMedia.youtube && (
                    <a 
                      href={storeConfig.socialMedia.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-red-500 hover:text-red-400 transition-colors"
                      title="YouTube"
                    >
                      <Play className="w-4 h-4 md:w-5 md:h-5" />
                    </a>
                  )}
                </div>

                {/* Admin Button */}
                <Link to="/admin/login" className="sm:w-auto">
                  <button className="border border-border text-foreground rounded px-3 py-1 text-xs md:text-sm hover:bg-accent hover:text-accent-foreground transition w-auto">Admin</button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* page content */}
        {children}

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 md:py-12">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-8">
              {/* Brand Section */}
              <div>
                <p className="text-lg font-semibold">{storeConfig.name}</p>
                <p className="text-gray-400 text-sm">As melhores ofertas em um só lugar.</p>
              </div>

              {/* Institutional Section */}
              <div>
                <p className="font-semibold mb-3">Institucional</p>
                <ul className="space-y-2">
                  <li>
                    <Link to="/quem-somos" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                      Quem Somos
                    </Link>
                  </li>
                  <li>
                    <Link to="/politica-de-privacidade" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                      Política de Privacidade
                    </Link>
                  </li>
                  <li>
                    <Link to="/termos-de-uso" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                      Termos de Uso
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Social Media Section */}
              <div>
                <p className="font-semibold mb-3">Siga-nos</p>
                <div className="flex items-center space-x-4">
                  {storeConfig.socialMedia.instagram && (
                    <a 
                      href={storeConfig.socialMedia.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-pink-400 transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {storeConfig.socialMedia.facebook && (
                    <a 
                      href={storeConfig.socialMedia.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-400 transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {storeConfig.socialMedia.youtube && (
                    <a 
                      href={storeConfig.socialMedia.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-red-400 transition-colors"
                      title="YouTube"
                    >
                      <Play className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="border-t border-gray-800 pt-6 mb-6">
              <p className="text-gray-400 text-sm leading-relaxed">
                O Ofertas Universal Place reúne ofertas de lojas parceiras.
                <br />
                Os preços e a disponibilidade podem variar conforme o site de destino.
              </p>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 pt-6 text-center">
              <p className="text-gray-400 text-sm">© 2026 {storeConfig.name}. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Layout;
