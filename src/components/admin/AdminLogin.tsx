import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { verifyPin } from '../../services/storage';

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const valid = await verifyPin(pin);
    setLoading(false);
    if (valid) {
      sessionStorage.setItem('pudu_admin_auth', 'true');
      onSuccess();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-pudu-yellow rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
          🦌
        </div>
        <h1 className="font-display font-bold text-xl text-pudu-earth mb-1">Panel Administrativo</h1>
        <p className="text-sm text-gray-500 mb-6">Ingresa tu PIN para acceder</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              value={pin}
              onChange={e => { setPin(e.target.value); setError(false); }}
              placeholder="PIN"
              autoFocus
              className={`w-full text-center text-2xl tracking-[0.5em] font-mono py-3 px-4 rounded-xl border-2 outline-none transition-colors ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-pudu-green'}`}
            />
            {error && <p className="text-red-500 text-sm mt-2">PIN incorrecto</p>}
          </div>
          <button
            type="submit"
            disabled={pin.length < 4 || loading}
            className="w-full py-3 bg-pudu-green hover:bg-pudu-green-dark disabled:opacity-50 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>

        <a href="#/" className="inline-block mt-6 text-sm text-gray-400 hover:text-pudu-earth transition-colors">
          Volver a la tienda
        </a>
      </div>
    </div>
  );
}
