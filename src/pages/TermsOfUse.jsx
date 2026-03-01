import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const TermsOfUse = () => {
  return (
    <Layout>
      <section className="container mx-auto px-4 py-12 text-gray-900">
        <h2 className="text-3xl font-bold mb-6">Termos de Uso</h2>
        
        <p className="mb-4">
          Ao acessar o site Ofertas Universal Place, o usuário concorda com os seguintes termos:
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8">1. Objetivo da Plataforma</h3>
        <p className="mb-4">
          O Ofertas Universal Place é um agregador de ofertas, reunindo produtos e promoções de lojas parceiras.
        </p>
        <ul className="list-disc list-inside mb-4 ml-4">
          <li>Não realizamos vendas diretas.</li>
          <li>As transações ocorrem exclusivamente no site da loja de destino.</li>
        </ul>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8">2. Responsabilidade sobre Ofertas</h3>
        <p className="mb-4">
          Os preços, disponibilidade e condições dos produtos podem variar sem aviso prévio.
        </p>
        <p className="mb-2 font-semibold">Não nos responsabilizamos por:</p>
        <ul className="list-disc list-inside mb-4 ml-4">
          <li>Alterações de preço</li>
          <li>Produto fora de estoque</li>
          <li>Problemas na entrega</li>
          <li>Questões relacionadas ao site parceiro</li>
        </ul>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8">3. Propriedade Intelectual</h3>
        <p className="mb-4">
          Todo o conteúdo do site, incluindo layout, textos e marca, é protegido por direitos autorais.
        </p>
        <p className="mb-4">
          É proibida a reprodução sem autorização.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8">4. Modificações</h3>
        <p className="mb-8">
          Reservamo-nos o direito de modificar estes termos a qualquer momento.
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

export default TermsOfUse;
