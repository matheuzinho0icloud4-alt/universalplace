import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-900">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">Política de Privacidade</h2>
        
        <p className="mb-4">
          A sua privacidade é importante para nós. Esta Política de Privacidade descreve como o Ofertas Universal Place funciona em relação às informações dos usuários.
        </p>
        
        <p className="mb-4">
          O Ofertas Universal Place não coleta, armazena ou vende dados pessoais dos usuários.
        </p>
        
        <p className="mb-4">
          Nosso site atua apenas como agregador de ofertas, reunindo promoções e produtos de lojas parceiras.
        </p>
        
        <p className="mb-4">
          Ao clicar em uma oferta, o usuário é redirecionado para o site da loja parceira, que possui sua própria Política de Privacidade e seus próprios termos.
        </p>
        
        <p className="mb-4">
          Recomendamos que o usuário consulte a política de privacidade do site de destino antes de realizar qualquer compra.
        </p>
        
        <p className="mb-8">
          Esta política pode ser atualizada a qualquer momento para refletir melhorias na plataforma.
        </p>
        
        <p className="text-sm text-gray-600 mb-8">
          Última atualização: 2026.
        </p>

        <Link to="/" className="inline-block text-primary hover:underline">
          ← Voltar às Ofertas
        </Link>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
