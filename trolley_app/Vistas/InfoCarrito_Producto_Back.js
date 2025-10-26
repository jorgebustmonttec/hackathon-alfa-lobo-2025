// Vistas/InfoCarrito_Producto_Back.js
import React, { useState, useEffect, useCallback } from 'react';
import { useCameraPermissions } from 'expo-camera';
import InfoCarrito_Producto_Front from './InfoCarrito_Producto_Front';

// Función resolveUbicacion (Sin cambios, la necesitamos para la cantidad REQUERIDA)
const resolveUbicacion = async (ubicacionId) => {
 await new Promise(r => setTimeout(r, 400));
 const base = {
  'A1': { id: 'A1', items: [{ sku: 'SKU-COKE-01', cantidad: 15, nombre: 'Coca Cola 600ml' }] },
  'A2': { id: 'A2', items: [{ sku: 'SKU-GANS-01', cantidad: 10, nombre: 'Gansito' }, { sku: 'SKU-CHOK-01', cantidad: 12, nombre: 'Chokis' }] },
  'A3': { id: 'A3', items: [{ sku: 'SKU-COKE-02', cantidad: 15, nombre: 'Coca Cola' }, { sku: 'SKU-CIEL-01', cantidad: 3, nombre: 'Agua Ciel' }] },
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


export default function InfoCarrito_Producto_Back({
 ubicacionId,
 cantidadesConfirmadas, // Objeto: { 'SKU-XXX': '10', 'SKU-YYY': '2', _productToVerify?: product } <- Cantidad INICIAL
 onBack,        // handleBackToSeleccion
 onCompleteAll,    // handleBackToCarrito
}) {
 // --- Estados de Cámara (sin cambios) ---
 const [permission, requestPermission] = useCameraPermissions();
 const [showCamera, setShowCamera] = useState(false);
 const hasPermission = permission === null ? null : !!permission?.granted;

 // --- Estados de Lógica (sin cambios en estructura, sí en inicialización) ---
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [productosPorChecar, setProductosPorChecar] = useState([]);
 const [productoActual, setProductoActual] = useState(null);
 const [cantidadActualScan, setCantidadActualScan] = useState(0); // <-- Empezará con la inicial
 const [isCompleto, setIsCompleto] = useState(false);

 // 1. Cargar y preparar la lista de productos
 const loadProductos = useCallback(async () => {
  try {
   setLoading(true);
   setError('');
   
   // Verificar si venimos de una validación automática
   const productToVerify = cantidadesConfirmadas._productToVerify;
   
   if (productToVerify) {
    // Caso especial: solo verificar un producto específico
    console.log("Modo verificación: solo verificando producto", productToVerify.sku);
    const cantidadInicial = parseInt(cantidadesConfirmadas[productToVerify.sku], 10) || 0;
    
    const productoParaVerificar = {
     sku: productToVerify.sku,
     nombre: productToVerify.nombre,
     cantidadInicial: cantidadInicial,
     cantidadRequerida: productToVerify.expectedQuantity
    };
    
    setProductosPorChecar([productoParaVerificar]);
    setProductoActual(productoParaVerificar);
    setCantidadActualScan(cantidadInicial);
   } else {
    // Lógica original para todos los productos
    const dataCajon = await resolveUbicacion(ubicacionId); // Trae la cantidad REQUERIDA original
    
    // Combinar datos: cantidadInicial de 'cantidadesConfirmadas' y cantidadRequerida de 'dataCajon'
    const listaCombinada = dataCajon.items
     .filter(item => cantidadesConfirmadas[item.sku] !== undefined) // Solo los que estaban en la pantalla anterior
     .map(item => {
           const cantidadInicial = parseInt(cantidadesConfirmadas[item.sku], 10) || 0;
           // Usamos la 'cantidad' original de la base como la requerida
           const cantidadRequerida = item.cantidad; 
           
           return {
        sku: item.sku,
        nombre: item.nombre,
             cantidadInicial: cantidadInicial,     // <-- La que pusimos en Seleccion
        cantidadRequerida: cantidadRequerida, // <-- La original de la base de datos
       };
         });
    
    setProductosPorChecar(listaCombinada);
    
    if (listaCombinada.length === 0) {
     console.log("No hay productos en esta selección. Volviendo...");
     onCompleteAll();
    } else {
         // Establecer el primer producto y SU cantidad inicial
     setProductoActual(listaCombinada[0]);
         setCantidadActualScan(listaCombinada[0].cantidadInicial); // <-- Iniciar conteo con la cantidad inicial
    }
   }
  } catch (e) {
   setError(e?.message || 'No fue posible cargar los productos.');
  } finally {
   setLoading(false);
  }
 }, [ubicacionId, cantidadesConfirmadas, onCompleteAll]);

 useEffect(() => {
  loadProductos();
 }, [loadProductos]);

 // 2. Observador de Completado (sin cambios en la lógica, compara con 'cantidadRequerida')
 useEffect(() => {
  if (!productoActual) return;
  if (cantidadActualScan >= productoActual.cantidadRequerida) {
      // Evitar que el contador se pase si se hace clic muy rápido
      if (cantidadActualScan > productoActual.cantidadRequerida) {
         setCantidadActualScan(productoActual.cantidadRequerida);
      }
   setIsCompleto(true);
   setShowCamera(false);
  }
 }, [cantidadActualScan, productoActual]);
 
 // --- Handlers de UI (sin cambios lógicos) ---

 const handleComienzaScan = async () => {
  let perm = permission;
  if (!perm || !perm.granted) { perm = await requestPermission(); }
  if (perm.granted) { setShowCamera(true); } 
    else { alert("Se necesita permiso de la cámara para continuar."); }
 };

 const handleScanClick = () => {
    // Solo sumar si no hemos llegado al límite
  if (!isCompleto && cantidadActualScan < productoActual.cantidadRequerida) {
    setCantidadActualScan(prev => prev + 1);
    }
 };

 const handleNextProduct = () => {
  // Si estamos en modo verificación (solo un producto), regresar a selección
  if (cantidadesConfirmadas._productToVerify) {
   console.log("Producto verificado. Regresando a selección.");
   
   // Preparar las cantidades actualizadas para enviar de vuelta
   const updatedQuantities = {
    [productoActual.sku]: cantidadActualScan
   };
   
   onBack(updatedQuantities); // Regresar a InfoCarrito_Seleccion con cantidades actualizadas
   return;
  }
  
  // Lógica original para múltiples productos
  const currentIndex = productosPorChecar.findIndex(p => p.sku === productoActual.sku);
  const nextProduct = productosPorChecar[currentIndex + 1] || null;

  if (nextProduct) {
   setProductoActual(nextProduct);
      // Iniciar el conteo del siguiente producto con SU cantidad inicial
   setCantidadActualScan(nextProduct.cantidadInicial); 
   setIsCompleto(false); // Resetear estado de completado
   setShowCamera(false); // Asegurar cámara cerrada
  } else {
   console.log("Todos los productos completados. Volviendo a InfoCarrito_Front (A1, A2...).");
   onCompleteAll(); 
  }
 };

 return (
  <InfoCarrito_Producto_Front
   loading={loading}
   error={error}
   hasPermission={hasPermission}
   onRequestPermission={handleComienzaScan} 
   producto={productoActual}
   cantidadActual={cantidadActualScan} // La cantidad actual del *conteo*
   isCompleto={isCompleto}
   showCamera={showCamera}
   onBack={onBack}
   onComienzaScan={handleComienzaScan}
   onScanClick={handleScanClick}
   onOK={handleNextProduct}
  />
 );
}