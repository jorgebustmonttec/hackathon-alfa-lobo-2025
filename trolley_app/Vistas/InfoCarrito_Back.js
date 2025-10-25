// Vistas/InfoCarrito_Back.js
import React, { useEffect, useState, useCallback } from 'react';
import InfoCarrito_Front from './InfoCarrito_Front';

// Resolver local (sin API): devuelve un carrito demo según cartId
const resolveCart = async (cartId) => {
  // Simula latencia
  await new Promise(r => setTimeout(r, 500));

  const base = {
    'CARRITO-001': {
      id: 'CARRITO-001',
      cliente: 'Andrea',
      total: 1299.50,
      moneda: 'MXN',
      items: [
        { sku: 'A100', nombre: 'Audífonos BT', qty: 1, precio: 799.5 },
        { sku: 'C230', nombre: 'Cable USB-C', qty: 2, precio: 250.0 },
      ],
      actualizado: new Date().toISOString(),
    },
    'CARRITO-XYZ': {
      id: 'CARRITO-XYZ',
      cliente: 'Invitado',
      total: 349.00,
      moneda: 'MXN',
      items: [{ sku: 'M010', nombre: 'Mouse Inalámbrico', qty: 1, precio: 349.0 }],
      actualizado: new Date().toISOString(),
    },
  };

  // si no existe, crea algo básico con el cartId
  if (!base[cartId]) {
    return {
      id: cartId || 'SIN-ID',
      cliente: 'Desconocido',
      total: 0,
      moneda: 'MXN',
      items: [],
      actualizado: new Date().toISOString(),
    };
  }
  return base[cartId];
};

export default function InfoCarrito_Back({ cartId, onBack }) {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await resolveCart((cartId || '').trim());
      setCart(data);
    } catch (e) {
      setError(e?.message || 'No fue posible obtener el carrito.');
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [cartId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <InfoCarrito_Front
      loading={loading}
      error={error}
      cart={cart}
      onRetry={load}
      onBack={onBack}
    />
  );
}
