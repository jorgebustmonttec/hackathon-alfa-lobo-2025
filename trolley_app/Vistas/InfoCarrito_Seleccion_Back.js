// Vistas/InfoCarrito_Seleccion_Back.js
import React, { useEffect, useState, useCallback } from 'react';
import InfoCarrito_Seleccion_Front from './InfoCarrito_Seleccion_Front';

// Función para extraer los productos de un basket específico desde la configuración de la API
const resolveUbicacion = async (ubicacionId, configData) => {
 // Simular latencia para mantener la experiencia de usuario
 await new Promise(r => setTimeout(r, 400));
 
 if (!configData || !configData.baskets) {
  return { id: ubicacionId || 'Error', items: [] };
 }

 // Buscar el basket que corresponde al ubicacionId
 const basket = configData.baskets.find(b => b.position_identifier === ubicacionId);
 
 if (!basket || !basket.products) {
  return { id: ubicacionId, items: [] };
 }

 // Transformar los productos de la API al formato esperado por el frontend
 const items = basket.products.map(product => ({
  sku: product.product_id, // Usar product_id como SKU
  cantidad: product.expected_quantity || 0,
  nombre: product.name || 'Unknown Product',
  barcode: product.barcode || ''
 }));

 return {
  id: ubicacionId,
  items: items
 };
};

// ▼▼▼ CAMBIO 1: Aceptar 'configData' y 'onConfirm' en las props ▼▼▼
export default function InfoCarrito_Seleccion_Back({ ubicacionId, configData, onBack, onConfirm }) {
 const [loading, setLoading] = useState(true);
 const [data, setData] = useState(null);
 const [error, setError] = useState('');
 const [cantidades, setCantidades] = useState({});

 const load = useCallback(async () => {
  try {
   setLoading(true);
   setError('');
   
   console.log(`Loading items for location: ${ubicacionId}`);
   console.log('Config data available:', !!configData);
   
   const result = await resolveUbicacion(ubicacionId, configData);
   setData(result);
   
   // Inicializar cantidades con los valores esperados de la API
   const initialCantidades = Object.fromEntries(
    result.items.map(item => [item.sku, item.cantidad.toString()])
   );
   setCantidades(initialCantidades);
   
   console.log(`Loaded ${result.items.length} items for ${ubicacionId}`);
  } catch (e) {
   console.error('Error loading items:', e);
   setError(e?.message || 'No fue posible obtener los items.');
   setData(null);
  } finally {
   setLoading(false);
  }
 }, [ubicacionId, configData]);

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