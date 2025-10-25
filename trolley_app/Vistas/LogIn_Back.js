// Vistas/LogIn_Back.js
import React, { useState } from 'react';
import LogIn_Front from './LogIn_Front';
import InicioQr_Back from './InicioQr_Back';
import InfoCarrito_Back from './InfoCarrito_Back';

// ADDED: import de la nueva vista de selección
import InfoCarrito_Seleccion_Back from './InfoCarrito_Seleccion_Back';

export default function LogIn_Back() {
  // Estado del LogIn
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Orquesta de vistas
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scannedData, setScannedData] = useState(null);   // { type, data }
  const [showQrResult, setShowQrResult] = useState(false);

  // ADDED: estados para la vista de selección (equivalente a 'vistaLogueada' y 'ubicacionId' de App.js)
  const [showSeleccion, setShowSeleccion] = useState(false);
  const [ubicacionId, setUbicacionId] = useState(null); // ej. 'A1', 'A3', etc.

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
    // ADDED: limpiar estados adicionales
    setShowSeleccion(false);
    setUbicacionId(null);
  };

  // Navegación entre cámara y carrito
  const handleBackToCamera = () => {
    setShowQrResult(false);
    setScannedData(null);
    // ADDED: por si se vuelve desde selección → cámara
    setShowSeleccion(false);
    setUbicacionId(null);
  };

  // ADDED: handlers para navegar a selección y volver al carrito
  const handleNavigateToSeleccion = (idUbicacion) => {
    setUbicacionId(idUbicacion);
    setShowSeleccion(true);
  };
  const handleBackToCarrito = () => {
    setUbicacionId(null);
    setShowSeleccion(false);
  };

  // --- RENDER ---
  // Si está logueado, decidir qué vista mostrar
  if (isLoggedIn) {
    // ADDED: Vista 4 — Selección (tiene prioridad para no tocar tu bloque original)
    if (showSeleccion && ubicacionId) {
      return (
        <InfoCarrito_Seleccion_Back
          ubicacionId={ubicacionId}
          onBack={handleBackToCarrito}
        />
      );
    }

    // ADDED: Vista 3 — Carrito (misma condición que tu bloque original, pero adelantada para inyectar onNavigateToSeleccion)
    if (showQrResult && scannedData) {
      return (
        <InfoCarrito_Back
          cartId={(scannedData.data || '').trim()} // texto leído del QR
          onBack={handleBackToCamera}              // volver a la cámara
          onNavigateToSeleccion={handleNavigateToSeleccion} // ← NUEVO
        />
      );
    }

    // (TU BLOQUE ORIGINAL SIGUE INTACTO; quedará “eclipsado” por el retorno anterior si hay showQrResult)
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
      // Nota: no añadí props opcionales (isLoading, errorMessage, onForgotPassword)
      // porque pediste no modificar el Front; si quieres, las activo después.
    />
  );
}

