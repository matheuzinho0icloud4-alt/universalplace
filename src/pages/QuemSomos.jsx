import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const QuemSomos = () => {
  return (
    <Layout>
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-900">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">Quem Somos</h2>
        <p className="mb-4">
          Criamos este site com um objetivo claro: oferecer uma experiência simples, segura e eficiente para você encontrar exatamente o que precisa.
        </p>
        <p className="mb-4">
          Aqui, cada detalhe foi pensado com cuidado — desde a organização dos produtos até a rapidez no carregamento das páginas. Trabalhamos para unir qualidade, transparência e praticidade em um único lugar.
        </p>
        <p className="font-semibold mb-2">Nosso compromisso é com:</p>
        <ul className="list-disc list-inside mb-4">
          <li>Produtos selecionados com critério</li>
          <li>Informações claras e objetivas</li>
          <li>Processo de compra rápido e seguro</li>
          <li>Atendimento acessível e humano</li>
          <li>Atualizações constantes para melhorar sua experiência</li>
        </ul>
        <p className="mb-4">
          Acreditamos que tecnologia deve facilitar, não complicar. Por isso, investimos em uma estrutura moderna e segura para garantir estabilidade, desempenho e confiança em cada acesso.
        </p>
        <p className="mb-4">
          Mais do que vender, queremos construir uma relação duradoura baseada em credibilidade e satisfação.
        </p>
        <p className="mb-8">Seja muito bem-vindo(a). Explore, descubra e aproveite.</p>

        <Link to="/" className="inline-block text-primary hover:underline">
          ← Voltar às Ofertas
        </Link>
      </section>
    </Layout>
  );
};

export default QuemSomos;
