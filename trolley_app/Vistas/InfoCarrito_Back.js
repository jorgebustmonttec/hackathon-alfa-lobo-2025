// Vistas/InfoCarrito_Back.js
import React, { useEffect, useState, useCallback } from 'react';
import InfoCarrito_Front from './InfoCarrito_Front';

// Resolver local (sin API): devuelve un carrito demo según cartId
const resolveCart = async (cartId) => {
  // Simula latencia
  await new Promise((r) => setTimeout(r, 500));

  const base = {
    'CARRITO-001': {
      id: 'CARRITO-001',
      cliente: 'Andrea',
      total: 1299.50,
      moneda: 'MXN',
      trabajadorNombre: 'Juan Pérez',
      trabajadorId: 'EMP-1029',
      numVuelo: 'AMX-452',
      origen: 'Ciudad de México (MEX)',
      destino: 'Monterrey (MTY)',
      ubicaciones: {
        columnaA: ['A1', 'A2', 'A3', 'A4', 'A5'],
        columnaB: ['B1', 'B2', 'B3'],
      },
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
      trabajadorNombre: '—',
      trabajadorId: '—',
      numVuelo: '—',
      origen: '—',
      destino: '—',
      ubicaciones: {
        columnaA: [],
        columnaB: [],
      },
      actualizado: new Date().toISOString(),
    };
  }
  return base[cartId];
};

export default function InfoCarrito_Back({ cartId, onBack, onNavigateToSeleccion }) {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await resolveCart('CARRITO-001'); // carga dummy
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

  const handleSelectUbicacion = (ubicacionId) => {
    console.log("Notificando para navegar a:", ubicacionId);
    if (onNavigateToSeleccion) {
      onNavigateToSeleccion(ubicacionId);
    } else {
      console.warn("onNavigateToSeleccion no fue proveído a InfoCarrito_Back");
    }
  };

  // >>> ÚNICO AGREGADO: función para el botón "Confirmar carrito"
  const handleConfirmCarrito = () => {
    // Por ahora solo demo/local: imprime el carrito actual.
    // Aquí conectarás tu API/DB cuando exista.
    console.log('Confirmar carrito (BACK):', {
      cartId: cart?.id,
      cliente: cart?.cliente,
      total: cart?.total,
      moneda: cart?.moneda,
      trabajadorNombre: cart?.trabajadorNombre,
      trabajadorId: cart?.trabajadorId,
      numVuelo: cart?.numVuelo,
      origen: cart?.origen,
      destino: cart?.destino,
      ubicaciones: cart?.ubicaciones,
      timestamp: new Date().toISOString(),
    });
  };
  // <<< FIN DEL AGREGADO

  return (
    <InfoCarrito_Front
      loading={loading}
      error={error}
      cart={cart}
      onRetry={load}
      onBack={onBack}
      onSelectUbicacion={handleSelectUbicacion}
      onConfirmCarrito={handleConfirmCarrito}  // <<-- se pasa al front
    />
  );
}
