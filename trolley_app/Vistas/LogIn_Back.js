// Vistas/LogIn_Back.js
import React, { useState } from 'react';
import LogIn_Front from './LogIn_Front';
import InicioQr_Back from './InicioQr_Back';
import InfoCarrito_Back from './InfoCarrito_Back';

export default function LogIn_Back() {
  // Estado del LogIn
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Orquesta de vistas
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scannedData, setScannedData] = useState(null);   // { type, data }
  const [showQrResult, setShowQrResult] = useState(false);

  // Acciones de LogIn
  const handleLogin = () => {
    // aquí podrías validar campos o llamar a tu backend
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setScannedData(null);
    setShowQrResult(false);
  };

  // Navegación entre cámara y carrito
  const handleBackToCamera = () => {
    setShowQrResult(false);
    setScannedData(null);
  };

  // --- RENDER ---
  // Si está logueado, decidir qué vista mostrar
  if (isLoggedIn) {
    // Tercera vista: InfoCarrito (tras escanear)
    if (showQrResult && scannedData) {
      return (
        <InfoCarrito_Back
          cartId={(scannedData.data || '').trim()} // texto leído del QR
          onBack={handleBackToCamera}              // volver a la cámara
        />
      );
    }

    // Segunda vista: Cámara (delegada al Back de InicioQr)
    return (
      <InicioQr_Back
        onBack={handleLogout} // ← botón "Volver" desde la cámara (regresa al login)
        onScanned={({ type, data }) => {
          // En cuanto lea, pasamos a InfoCarrito
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

