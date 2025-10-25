// Vistas/LogIn_Back.js
import React, { useState } from 'react';
// ▼▼▼ MODIFICADO: Ya no necesitamos View/Text/StyleSheet aquí ▼▼▼
import { StyleSheet } from 'react-native'; 
// ▲▲▲
import LogIn_Front from './LogIn_Front';
import InicioQr_Back from './InicioQr_Back';
import InfoCarrito_Back from './InfoCarrito_Back';
import InfoCarrito_Seleccion_Back from './InfoCarrito_Seleccion_Back';
// ▼▼▼ CAMBIO 1: Importar el nuevo componente real ▼▼▼
import InfoCarrito_Producto_Back from './InfoCarrito_Producto_Back';
// ▲▲▲ FIN CAMBIO 1 ▲▲▲

export default function LogIn_Back() {
// ... (estados de LogIn, orquesta de vistas, etc. SIN CAMBIOS) ...
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [scannedData, setScannedData] = useState(null);
const [showQrResult, setShowQrResult] = useState(false);
const [showSeleccion, setShowSeleccion] = useState(false);
const [ubicacionId, setUbicacionId] = useState(null);
const [showProducto, setShowProducto] = useState(false);
const [cantidadesConfirmadas, setCantidadesConfirmadas] = useState({});

// ... (handleLogin, handleLogout SIN CAMBIOS) ...
const handleLogin = () => {
 setIsLoggedIn(true);
};
const handleLogout = () => {
 setIsLoggedIn(false);
 setUsername('');
 setPassword('');
 setScannedData(null);
 setShowQrResult(false);
 setShowSeleccion(false);
 setUbicacionId(null);
 setShowProducto(false);
 setCantidadesConfirmadas({});
};

// ... (handleBackToCamera, handleNavigateToSeleccion SIN CAMBIOS) ...
const handleBackToCamera = () => {
 setShowQrResult(false);
 setScannedData(null);
 setShowSeleccion(false);
 setUbicacionId(null);
 setShowProducto(false);
};
const handleNavigateToSeleccion = (idUbicacion) => {
 setUbicacionId(idUbicacion);
 setShowSeleccion(true);
};

// --- ESTAS FUNCIONES AHORA SON LAS PROPS PARA NAVEGACIÓN ---

// handleBackToCarrito: Vuelve a la vista de Carrito (A1, A2...)
const handleBackToCarrito = () => {
 setUbicacionId(null);
 setShowSeleccion(false);
 setShowProducto(false); // Asegurarse de cerrar todo
};

// handleNavigateToProducto: Va a la vista de Producto
const handleNavigateToProducto = (idUbicacion, cantidades) => {
 console.log("Navegando a PRODUCTO con:", idUbicacion, cantidades);
 setCantidadesConfirmadas(cantidades);
 setUbicacionId(idUbicacion);
 setShowProducto(true); // <-- Muestra la vista de Producto
 setShowSeleccion(true); // <-- Mantenemos Seleccion "debajo" por si acaso
};

// handleBackToSeleccion: Vuelve a la vista de Selección (lista de productos)
const handleBackToSeleccion = () => {
 setShowProducto(false); // <-- Oculta la vista de Producto
};
// --- FIN DE FUNCIONES DE NAVEGACIÓN ---


// --- RENDER ---
if (isLoggedIn) {

  // ▼▼▼ CAMBIO 2: Reemplazar el Placeholder por el componente real ▼▼▼
  // Esta es la vista más "profunda", la checamos primero.
 if (showProducto && ubicacionId) {
 return (
  <InfoCarrito_Producto_Back
  ubicacionId={ubicacionId}
  cantidadesConfirmadas={cantidadesConfirmadas}
  onBack={handleBackToSeleccion}  // Botón "Volver" (a Selección)
  onCompleteAll={handleBackToCarrito} // Cuando se acaban los productos (a Carrito)
  />
 );
 }
  // ▲▲▲ FIN CAMBIO 2 ▲▲▲

 // Vista de Selección (Cajones A1, A2...)
 if (showSeleccion && ubicacionId) {
 return (
  <InfoCarrito_Seleccion_Back
  ubicacionId={ubicacionId}
  onBack={handleBackToCarrito} // El "Volver" de aquí SÍ va al Carrito
  onConfirm={handleNavigateToProducto}
  />
 );
 }

 // Vista de Carrito (Principal)
 if (showQrResult && scannedData) {
 return (
  <InfoCarrito_Back
  cartId={(scannedData.data || '').trim()}
  onBack={handleBackToCamera}
  onNavigateToSeleccion={handleNavigateToSeleccion}
  />
 );
 }
 
 // Vista de Cámara (Default)
 return (
 <InicioQr_Back
  onBack={handleLogout}
  onScanned={({ type, data }) => {
  setScannedData({ type, data });
  setShowQrResult(true);
  }}
 />
 );
}

// Vista de LogIn (Front puro)
return (
 <LogIn_Front
 username={username}
 password={password}
 onChangeUsername={setUsername}
 onChangePassword={setPassword}
 onSubmit={handleLogin}
 />
);
}

// ▼▼▼ CAMBIO 3: Eliminar los estilos del placeholder ▼▼▼
const styles = StyleSheet.create({
 // ¡Estilos del placeholder eliminados!
});
// ▲▲▲ FIN CAMBIO 3 ▲▲▲