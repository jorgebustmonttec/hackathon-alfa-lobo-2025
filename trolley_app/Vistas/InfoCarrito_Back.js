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
  	  ubicaciones: {
  	 	 columnaA: ['A1', 'A2', 'A3', 'A4', 'A5'],
  	 	 columnaB: ['B1', 'B2', 'B3'],
  	  },
  	  actualizado: new Date().toISOString(),
  	},
  	'CARRITO-XYZ': {
  	  id: 'CARRITO-XYZ',
  	  cliente: 'Invitado',
  	  total: 349.00,
  	  moneda: 'MXN',
  	  ubicaciones: {
  	 	 columnaA: ['A1'],
  	 	 columnaB: ['B1', 'B2'],
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
  	  ubicaciones: {
  	 	 columnaA: [],
  	 	 columnaB: [],
  	  },
  	  actualizado: new Date().toISOString(),
  	};
  }
  return base[cartId];
};

// ▼▼▼ CAMBIO 1: Añadir 'onNavigateToSeleccion' a las props ▼▼▼
export default function InfoCarrito_Back({ cartId, onBack, onNavigateToSeleccion }) {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
  	try {
  	  setLoading(true);
  	  setError('');
  	  const data = await resolveCart('CARRITO-001');
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

  // ▼▼▼ CAMBIO 2: Modificar esta función para que llame a la nueva prop ▼▼▼
  const handleSelectUbicacion = (ubicacionId) => {
  	console.log("Notificando para navegar a:", ubicacionId);
    // Si la prop 'onNavigateToSeleccion' existe, la llamamos
    if (onNavigateToSeleccion) {
      onNavigateToSeleccion(ubicacionId); // <-- Esto le dirá a App.js que navegue
    } else {
      console.warn("onNavigateToSeleccion no fue proveído a InfoCarrito_Back");
    }
  };
  // ▲▲▲ FIN DE CAMBIOS ▲▲▲

  return (
  	<InfoCarrito_Front
  	  loading={loading}
  	  error={error}
  	  cart={cart}
  	  onRetry={load}
  	  onBack={onBack}
  	  onSelectUbicacion={handleSelectUbicacion} // Esto ya estaba correcto
  	/>
  );
}