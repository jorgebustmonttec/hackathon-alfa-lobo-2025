// Vistas/InfoCarrito_Seleccion_Back.js
import React, { useEffect, useState, useCallback } from 'react';
import InfoCarrito_Seleccion_Front from './InfoCarrito_Seleccion_Front';

// Simula la búsqueda de los items (sin cambios en esta función)
const resolveUbicacion = async (ubicacionId) => {
 // Simula latencia
 await new Promise(r => setTimeout(r, 400));
 // Base de datos estática
 const base = {
  'A1': {
   id: 'A1',
   items: [
    { sku: 'SKU-COKE-01', cantidad: 15, nombre: 'Coca Cola 600ml' },
   ],
  },
  'A2': {
   id: 'A2',
   items: [
    { sku: 'SKU-GANS-01', cantidad: 10, nombre: 'Gansito' },
    { sku: 'SKU-CHOK-01', cantidad: 12, nombre: 'Chokis' },
   ],
  },
  'A3': { // El de tu mockup
   id: 'A3',
   items: [
    { sku: 'SKU-COKE-02', cantidad: 15, nombre: 'Coca Cola' },
    { sku: 'SKU-CIEL-01', cantidad: 3, nombre: 'Agua Ciel' },
   ],
  },
  'A4': { id: 'A4', items: [] },
  'B1': { id: 'B1', items: [{ sku: 'SKU-JUMX-01', cantidad: 8, nombre: 'Jumex Mango' }] },
  'B2': { id: 'B2', items: [{ sku: 'SKU-VALLE-01', cantidad: 7, nombre: 'Jugo Del Valle' }] },
  'B3': { id: 'B3', items: [{ sku: 'SKU-REDI-01', cantidad: 5, nombre: 'Red Bull' }] },
 };
 if (!base[ubicacionId]) {
  return { id: ubicacionId || 'Error', items: [] };
 }
 return JSON.parse(JSON.stringify(base[ubicacionId]));
};

// ▼▼▼ CAMBIO 1: Aceptar 'onConfirm' en las props ▼▼▼
export default function InfoCarrito_Seleccion_Back({ ubicacionId, onBack, onConfirm }) {
 const [loading, setLoading] = useState(true);
 const [data, setData] = useState(null);
 const [error, setError] = useState('');
 const [cantidades, setCantidades] = useState({});

 const load = useCallback(async () => {
  try {
   setLoading(true);
   setError('');
   const result = await resolveUbicacion(ubicacionId);
   setData(result);
   const initialCantidades = Object.fromEntries(
    result.items.map(item => [item.sku, item.cantidad.toString()])
   );
   setCantidades(initialCantidades);
  } catch (e) {
   setError(e?.message || 'No fue posible obtener los items.');
   setData(null);
  } finally {
   setLoading(false);
  }
 }, [ubicacionId]);

 useEffect(() => {
  load();
 }, [load]);

 // Función para manejar el TextInput (sin cambios)
 const handleSetCantidad = (sku, valor) => {
  let valorNumerico;
  let valorString;
  if (typeof valor === 'string') {
   valorString = valor.replace(/[^0-9]/g, '');
   valorNumerico = parseInt(valorString, 10);
  } else {
   valorNumerico = valor;
   valorString = valor.toString();
  }
  if (valorNumerico < 0) {
   valorString = '0';
}
  if (typeof valor === 'string' && valor === '') {
   valorString = '';
  }
  setCantidades(prevState => ({
   ...prevState,
   [sku]: valorString,
  }));
 };

 // Lógica para deshabilitar el botón (sin cambios)
 const isConfirmDisabled = !data?.items || data.items.some(item => {
  const cantidad = cantidades[item.sku];
  return cantidad === undefined || cantidad === '';
 });

  // ▼▼▼ CAMBIO 2: Crear una función local que llame a la prop 'onConfirm' ▼▼▼
 const handleConfirmLocal = () => {
  if (!isConfirmDisabled) {
   console.log("Confirmado en Seleccion_Back. Pasando datos a LogIn_Back...");
      // Llamamos a la función 'onConfirm' (que viene de LogIn_Back)
      // y le pasamos los datos que LogIn_Back necesita: el cajón (ubicacionId)
      // y el objeto de cantidades.
   onConfirm(ubicacionId, cantidades);
  }
 };
  // ▲▲▲ FIN CAMBIO 2 ▲▲▲

 return (
  <InfoCarrito_Seleccion_Front
   loading={loading}
   error={error}
   data={data}
   onBack={onBack}
      // ▼▼▼ CAMBIO 3: Pasar la *nueva* función local al Front ▼▼▼
   onConfirm={handleConfirmLocal}
   cantidades={cantidades}
   onSetCantidad={handleSetCantidad}
   isConfirmDisabled={isConfirmDisabled}
  />
 );
}