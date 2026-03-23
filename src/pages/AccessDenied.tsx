import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <ShieldOff className="h-10 w-10 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso negado</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        Você não tem permissão para acessar esta página.
      </p>
      <Button onClick={() => navigate(-1)} variant="outline">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>
    </div>
  );
}
