// Vistas/LogIn_Back.js
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

import LogIn_Front from './LogIn_Front';
import InicioQr_Back from './InicioQr_Back';
import InfoCarrito_Back from './InfoCarrito_Back';
import InfoCarrito_Seleccion_Back from './InfoCarrito_Seleccion_Back';
import InfoCarrito_Producto_Back from './InfoCarrito_Producto_Back';
import InfoVuelo_Back from './InfoVuelo_Back';

export default function LogIn_Back() {
  // --- Estados de LogIn y flujo ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [scannedData, setScannedData] = useState(null);
  const [showQrResult, setShowQrResult] = useState(false);

  const [showSeleccion, setShowSeleccion] = useState(false);
  const [ubicacionId, setUbicacionId] = useState(null);

  const [showProducto, setShowProducto] = useState(false);
  const [cantidadesConfirmadas, setCantidadesConfirmadas] = useState({});

  // NUEVO: InfoVuelo antes del carrito
  const [showInfoVuelo, setShowInfoVuelo] = useState(false);

  // --- Autenticación mínima ---
  const handleLogin = () => setIsLoggedIn(true);

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
    setShowInfoVuelo(false);
  };

  // --- Navegación principal ---
  const handleBackToCamera = () => {
    setShowQrResult(false);
    setScannedData(null);
    setShowSeleccion(false);
    setUbicacionId(null);
    setShowProducto(false);
    setCantidadesConfirmadas({});
    setShowInfoVuelo(false);
  };

  const handleNavigateToSeleccion = (idUbicacion) => {
    setUbicacionId(idUbicacion);
    setShowSeleccion(true);
  };

  // --- Navegación secundaria (selección/producto) ---
  const handleBackToCarrito = () => {
    setUbicacionId(null);
    setShowSeleccion(false);
    setShowProducto(false);
  };

  const handleNavigateToProducto = (idUbicacion, cantidades) => {
    console.log('[NAV] a Producto con:', idUbicacion, cantidades);
    setCantidadesConfirmadas(cantidades);
    setUbicacionId(idUbicacion);
    setShowProducto(true);
    setShowSeleccion(true);
  };

  const handleBackToSeleccion = () => setShowProducto(false);

  // --- Render protegido por login ---
  if (isLoggedIn) {
    // 1) Vista más profunda: Producto
    if (showProducto && ubicacionId) {
      return (
        <InfoCarrito_Producto_Back
          ubicacionId={ubicacionId}
          cantidadesConfirmadas={cantidadesConfirmadas}
          onBack={handleBackToSeleccion}      // vuelve a Selección
          onCompleteAll={handleBackToCarrito} // termina y regresa al Carrito
        />
      );
    }

    // 2) Vista de Selección
    if (showSeleccion && ubicacionId) {
      return (
        <InfoCarrito_Seleccion_Back
          ubicacionId={ubicacionId}
          onBack={handleBackToCarrito}         // vuelve al Carrito
          onConfirm={handleNavigateToProducto}  // pasa a Producto
        />
      );
    }

    // 3) NUEVO: Vista de InfoVuelo (antes del carrito)
    if (showInfoVuelo && scannedData) {
      return (
        <InfoVuelo_Back
          qrData={scannedData}
          onBack={handleBackToCamera}           // regresar a la cámara si cancela
          onContinue={(flightData) => {
            // Aquí podrías guardar flightData si quieres usarlo después
            console.log('[InfoVuelo] continuar:', flightData);
            setShowInfoVuelo(false);
            setShowQrResult(true);              // ahora sí, pasar al carrito
          }}
        />
      );
    }

    // 4) Vista de Carrito (principal) después de InfoVuelo
    if (showQrResult && scannedData) {
      return (
        <InfoCarrito_Back
          cartId={(scannedData.data || '').trim()}
          onBack={handleBackToCamera}
          onNavigateToSeleccion={handleNavigateToSeleccion}
        />
      );
    }

    // 5) Vista de Cámara (por defecto)
    return (
      <InicioQr_Back
        onBack={handleLogout}
        onScanned={({ type, data }) => {
          console.log('[QR] scanned ok:', { type, data });
          setScannedData({ type, data });
          // MOSTRAR INFOVUELO primero:
          setShowInfoVuelo(true);
          // No activamos showQrResult aún; se activa al continuar en InfoVuelo
        }}
      />
    );
  }

  // Vista de LogIn (cuando no has iniciado sesión)
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

const styles = StyleSheet.create({});
