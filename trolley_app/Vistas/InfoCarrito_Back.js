// Vistas/InfoCarrito_Back.js
import React, { useEffect, useState, useCallback } from 'react';
import InfoCarrito_Front from './InfoCarrito_Front';

const resolveCart = async (cartId) => {
 // ... (función resolveCart sin cambios) ...
 await new Promise((r) => setTimeout(r, 500));
 const base = {
  'CARRITO-001': {
   id: 'CARRITO-001', cliente: 'Andrea', total: 1299.50, moneda: 'MXN',
   trabajadorNombre: 'Juan Pérez', trabajadorId: 'EMP-1029', numVuelo: 'AMX-452',
   origen: 'Ciudad de México (MEX)', destino: 'Monterrey (MTY)',
   ubicaciones: {
    columnaA: ['A1', 'A2', 'A3', 'A4', 'A5'],
    columnaB: ['B1', 'B2', 'B3'],
   },
   actualizado: new Date().toISOString(),
  },
 };
 if (!base[cartId]) {
  return { /* ... default empty cart ... */
   id: cartId || 'SIN-ID', cliente: 'Desconocido', total: 0, moneda: 'MXN',
   trabajadorNombre: '—', trabajadorId: '—', numVuelo: '—', origen: '—', destino: '—',
   ubicaciones: { columnaA: [], columnaB: [] },
   actualizado: new Date().toISOString(),
  };
 }
 return base[cartId];
};

export default function InfoCarrito_Back({
 cartId, // <-- Recibe el ID escaneado
 onBack,
 onNavigateToSeleccion,
 completedLocations
}) {
 const [loading, setLoading] = useState(true);
 const [cart, setCart] = useState(null);
 const [error, setError] = useState('');

 const load = useCallback(async () => {
  try {
   setLoading(true); setError('');
   // ▼▼▼ MODIFICACIÓN AQUÍ ▼▼▼
   // Forzamos cargar 'CARRITO-001' en lugar de usar el 'cartId' escaneado
   const data = await resolveCart('CARRITO-001');
   // const data = await resolveCart(cartId || 'CARRITO-001'); // <-- Línea Original
   // ▲▲▲ FIN MODIFICACIÓN ▲▲▲
   setCart(data);
  } catch (e) {
   setError(e?.message || 'Failed to load cart.');
   setCart(null);
  } finally {
   setLoading(false);
  }
  // Quitamos [cartId] de las dependencias ya que lo estamos ignorando
 }, []); // <-- Dependencia [cartId] eliminada

 useEffect(() => { load(); }, [load]);

 const handleSelectUbicacion = (ubicacionId) => {
  console.log(`[InfoCarrito_Back] Clicked location: ${ubicacionId}. Notifying LogIn_Back.`);
  onNavigateToSeleccion?.(ubicacionId);
 };

 const handleConfirmCarrito = () => { /* ... sin cambios ... */
  console.log('Confirm cart (BACK):', { /* ... cart data ... */ });
 };

 return (
  <InfoCarrito_Front
   loading={loading}
   error={error}
   cart={cart}
   onRetry={load}
   onBack={onBack}
   onSelectUbicacion={handleSelectUbicacion}
   onConfirmCarrito={handleConfirmCarrito}
   completedLocations={completedLocations}
  />
 );
}