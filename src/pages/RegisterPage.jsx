import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title>Registro Desabilitado - Ofertas Universal Place</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Registro Desabilitado</CardTitle>
            <p className="text-sm text-gray-600">Este sistema é fechado. O registro público foi desabilitado. Contate o administrador para criar contas.</p>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-700">Se você é o administrador e precisa acessar o painel, faça login na página de administração.</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link to="/admin/login" className="text-sm text-primary hover:underline">Ir para Login</Link>
            <Link to="/" className="text-sm">Voltar para Home</Link>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
