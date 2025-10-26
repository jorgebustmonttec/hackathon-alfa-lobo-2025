// Vistas/LogIn_Back.js
import React, { useState, useCallback } from 'react'; // Added useCallback
import { StyleSheet } from 'react-native';

import LogIn_Front from './LogIn_Front';
import InicioQr_Back from './InicioQr_Back';
import InfoCarrito_Back from './InfoCarrito_Back';
import InfoCarrito_Seleccion_Back from './InfoCarrito_Seleccion_Back';
import InfoCarrito_Producto_Back from './InfoCarrito_Producto_Back';
import InfoVuelo_Back from './InfoVuelo_Back';

// ▼▼▼ DUPLICATED/IMPORTED HELPER: Needed for the empty check ▼▼▼
// (Ideally, move this to a shared utils file)
const resolveUbicacion = async (ubicacionId) => {
 await new Promise(r => setTimeout(r, 100)); // Short delay for check
 const base = {
  'A1': { id: 'A1', items: [{ sku: 'SKU-COKE-01', cantidad: 15, nombre: 'Coca Cola 600ml' }] },
  'A2': { id: 'A2', items: [{ sku: 'SKU-GANS-01', cantidad: 10, nombre: 'Gansito' }, { sku: 'SKU-CHOK-01', cantidad: 12, nombre: 'Chokis' }] },
  'A3': { id: 'A3', items: [{ sku: 'SKU-COKE-02', cantidad: 15, nombre: 'Coca Cola' }, { sku: 'SKU-CIEL-01', cantidad: 3, nombre: 'Agua Ciel' }] },
  'A4': { id: 'A4', items: [] }, // Empty location
  'B1': { id: 'B1', items: [{ sku: 'SKU-JUMX-01', cantidad: 8, nombre: 'Jumex Mango' }] },
  'B2': { id: 'B2', items: [{ sku: 'SKU-VALLE-01', cantidad: 7, nombre: 'Jugo Del Valle' }] },
  'B3': { id: 'B3', items: [{ sku: 'SKU-REDI-01', cantidad: 5, nombre: 'Red Bull' }] },
 };
 if (!base[ubicacionId]) {
  return { id: ubicacionId || 'Error', items: [] }; // Return empty if not found
 }
 return JSON.parse(JSON.stringify(base[ubicacionId]));
};
// ▲▲▲ END HELPER ▲▲▲

export default function LogIn_Back() {
 // --- Estados ---
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [scannedData, setScannedData] = useState(null);
 const [showQrResult, setShowQrResult] = useState(false); // Controls InfoCarrito visibility
 const [showSeleccion, setShowSeleccion] = useState(false);
 const [ubicacionId, setUbicacionId] = useState(null); // Current location being processed
 const [showProducto, setShowProducto] = useState(false);
 const [cantidadesConfirmadas, setCantidadesConfirmadas] = useState({});
 const [showInfoVuelo, setShowInfoVuelo] = useState(false);

 // ▼▼▼ NUEVO ESTADO: Set to store completed location IDs ▼▼▼
 const [completedLocations, setCompletedLocations] = useState(new Set());
 // ▲▲▲

 // --- Handlers ---
 const handleLogin = () => setIsLoggedIn(true);

 const handleLogout = () => {
  setIsLoggedIn(false);
  setUsername(''); setPassword(''); setScannedData(null);
  setShowQrResult(false); setShowSeleccion(false); setUbicacionId(null);
  setShowProducto(false); setCantidadesConfirmadas({}); setShowInfoVuelo(false);
  setCompletedLocations(new Set()); // Limpiar completados
 };

 const handleBackToCamera = () => {
  setShowQrResult(false); setScannedData(null); setShowSeleccion(false);
  setUbicacionId(null); setShowProducto(false); setCantidadesConfirmadas({});
  setShowInfoVuelo(false);
  setCompletedLocations(new Set()); // Limpiar completados al volver a escanear
 };

 // ▼▼▼ MODIFICADO: Navigate to Seleccion (checks completion & emptiness) ▼▼▼
 const handleNavigateToSeleccion = useCallback(async (idUbicacion) => {
  console.log(`[NAV] Attempting to select location: ${idUbicacion}`);
  // 1. Check if already completed
  if (completedLocations.has(idUbicacion)) {
   console.log(`[NAV] Location ${idUbicacion} already completed. Ignoring.`);
   return; // Do nothing if already green
  }

  // 2. Check if the location is empty BEFORE navigating
  try {
   const dataCajon = await resolveUbicacion(idUbicacion);
   if (!dataCajon || !dataCajon.items || dataCajon.items.length === 0) {
    console.log(`[NAV] Location ${idUbicacion} is empty. Marking as complete.`);
    // Mark as complete directly and stay on InfoCarrito screen
    setCompletedLocations(prev => new Set(prev).add(idUbicacion));
    return; // Do not navigate
   }
  } catch (error) {
   console.error(`[NAV] Error checking location ${idUbicacion}:`, error);
   // Optionally show an error message to the user
   return; // Prevent navigation on error
  }

  // 3. If not completed and not empty, proceed to navigate
  console.log(`[NAV] Navigating to Seleccion for location: ${idUbicacion}`);
  setUbicacionId(idUbicacion);
  setShowSeleccion(true);
 }, [completedLocations]); // Depend on completedLocations
 // ▲▲▲

 // ▼▼▼ MODIFICADO: Back to Carrito (Marks location as complete) ▼▼▼
 const handleBackToCarrito = useCallback(() => {
  console.log(`[NAV] Back to Carrito from location: ${ubicacionId}. Marking as complete.`);
  if (ubicacionId) {
   // Add the just-finished location to the completed set
   setCompletedLocations(prev => new Set(prev).add(ubicacionId));
  }
  // Reset states for Seleccion and Producto
  setUbicacionId(null);
  setShowSeleccion(false);
  setShowProducto(false);
  // Keep showQrResult = true to stay on InfoCarrito
 }, [ubicacionId]); // Depend on ubicacionId to mark it complete
 // ▲▲▲

 const handleNavigateToProducto = (idUbicacion, cantidades) => {
  console.log('[NAV] to Producto with:', idUbicacion, cantidades);
  setCantidadesConfirmadas(cantidades);
  setUbicacionId(idUbicacion); // Keep track of current location
  setShowProducto(true);
  // Keep setShowSeleccion(true) so it returns here
 };

 const handleBackToSeleccion = () => {
     console.log('[NAV] Back to Seleccion');
     setShowProducto(false); // Just hide the Producto view
  };

 // --- Render ---
 if (isLoggedIn) {
  // 1) Vista Producto
  if (showProducto && ubicacionId) {
   return (
    <InfoCarrito_Producto_Back
     ubicacionId={ubicacionId}
     cantidadesConfirmadas={cantidadesConfirmadas}
     onBack={handleBackToSeleccion}
     onCompleteAll={handleBackToCarrito} // Use the modified handler
    />
   );
  }

  // 2) Vista Seleccion
  if (showSeleccion && ubicacionId) {
   return (
    <InfoCarrito_Seleccion_Back
     ubicacionId={ubicacionId}
     onBack={handleBackToCarrito} // Back from here *also* marks complete
     onConfirm={handleNavigateToProducto}
    />
   );
  }

  // 3) Vista InfoVuelo (sin cambios)
  if (showInfoVuelo && scannedData) {
   return ( <InfoVuelo_Back /* ... props ... */
            qrData={scannedData}
            onBack={handleBackToCamera}
            onContinue={(flightData) => {
              console.log('[InfoVuelo] continue:', flightData);
              setShowInfoVuelo(false);
              setShowQrResult(true); // Proceed to cart
            }}
       /> );
  }

  // 4) Vista Carrito
  if (showQrResult && scannedData) {
   return (
    <InfoCarrito_Back
     cartId={(scannedData.data || '').trim()}
     onBack={handleBackToCamera}
     onNavigateToSeleccion={handleNavigateToSeleccion}
     // ▼▼▼ Pass completed state down ▼▼▼
     completedLocations={completedLocations}
     // ▲▲▲
    />
   );
  }

  // 5) Vista Cámara (sin cambios)
  return ( <InicioQr_Back /* ... props ... */
        onBack={handleLogout}
        onScanned={({ type, data }) => {
          console.log('[QR] scanned ok:', { type, data });
          setScannedData({ type, data });
          setShowInfoVuelo(true); // Show flight info first
        }}
    /> );
 }

  // Vista LogIn (sin cambios)
  return ( <LogIn_Front /* ... props ... */
      username={username}
      password={password}
      onChangeUsername={setUsername}
      onChangePassword={setPassword}
      onSubmit={handleLogin}
  /> );
}

// Styles can be removed if not used locally
const styles = StyleSheet.create({});