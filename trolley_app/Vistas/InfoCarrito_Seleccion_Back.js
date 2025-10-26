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
  expectedQuantity: product.expected_quantity || 0, // Cantidad esperada
  countedQuantity: product.counted_quantity || 0,   // Cantidad contada (inicialmente 0)
  nombre: product.name || 'Unknown Product',
  barcode: product.barcode || ''
 }));

 return {
  id: ubicacionId,
  items: items
 };
};

// ▼▼▼ CAMBIO 1: Aceptar 'configData' y 'onConfirm' en las props ▼▼▼
export default function InfoCarrito_Seleccion_Back({ ubicacionId, configData, onBack, onConfirm, updatedQuantities = null }) {
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
   
   // Inicializar cantidades con los valores contados de la API (inicialmente 0)
   let initialCantidades = Object.fromEntries(
    result.items.map(item => [item.sku, item.countedQuantity.toString()])
   );
   
   // Si hay cantidades actualizadas desde la verificación, aplicarlas
   if (updatedQuantities) {
    console.log("Aplicando cantidades actualizadas:", updatedQuantities);
    initialCantidades = { ...initialCantidades, ...Object.fromEntries(
     Object.entries(updatedQuantities).map(([sku, quantity]) => [sku, quantity.toString()])
    )};
   }
   
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

 // Efecto para actualizar cantidades cuando regresan de verificación
 useEffect(() => {
  if (updatedQuantities && Object.keys(updatedQuantities).length > 0) {
   console.log("Recibidas cantidades actualizadas:", updatedQuantities);
   setCantidades(prevCantidades => ({
    ...prevCantidades,
    ...Object.fromEntries(
     Object.entries(updatedQuantities).map(([sku, quantity]) => [sku, quantity.toString()])
    )
   }));
  }
 }, [updatedQuantities]);

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

  // Función para validar si algún producto necesita verificación
 const findProductsNeedingVerification = () => {
  if (!data?.items) return [];
  
  return data.items.filter(item => {
   const countedQuantity = parseInt(cantidades[item.sku], 10) || 0;
   const expectedQuantity = item.expectedQuantity || 0;
   return countedQuantity !== expectedQuantity;
  });
 };

  // ▼▼▼ CAMBIO 2: Crear una función local que valide y navegue según sea necesario ▼▼▼
 const handleConfirmLocal = () => {
  if (!isConfirmDisabled) {
   console.log("Confirmado en Seleccion_Back. Validando cantidades...");
   
   // Verificar si hay productos que necesitan verificación
   const productsNeedingVerification = findProductsNeedingVerification();
   
   if (productsNeedingVerification.length > 0) {
    console.log("Productos que necesitan verificación:", productsNeedingVerification);
    // Navegar a InfoCarrito_Producto para el primer producto que necesita verificación
    onConfirm(ubicacionId, cantidades, productsNeedingVerification[0]);
   } else {
    console.log("Todas las cantidades coinciden. Confirmando...");
    // Todas las cantidades están correctas, proceder normalmente
    onConfirm(ubicacionId, cantidades);
   }
  }
 };
  // ▲▲▲ FIN CAMBIO 2 ▲▲▲

 // Verificar si hay productos que necesitan verificación para mostrar el botón correcto
 const hasProductsNeedingVerification = findProductsNeedingVerification().length > 0;

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
   hasProductsNeedingVerification={hasProductsNeedingVerification}
  />
 );
}