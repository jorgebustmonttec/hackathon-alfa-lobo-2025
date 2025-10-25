// screens/InicioQr_Back.js
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import InicioQr_Front from './InicioQr_Front';

export default function InicioQr_Back({ onBack, onScanned }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // Normaliza el estado de permiso para el Front
  const hasPermission = permission === null ? null : !!permission?.granted;

  const handleRequestPermission = () => {
    requestPermission?.();
  };

  const handleResetScanner = () => {
    setScanned(false);
  };

  const handleBarcodeScanned = ({ type, data }) => {
    if (scanned) return;
    
    const value = (data || '').trim();
    
    // Navegar inmediatamente sin Alert
    setScanned(true);
    onScanned?.({ type, data: value });
  };

  return (
    <InicioQr_Front
      hasPermission={hasPermission}
      onRequestPermission={handleRequestPermission}
      scanned={scanned}
      onBarcodeScanned={handleBarcodeScanned}
      onResetScanner={handleResetScanner}
      onBack={onBack}
    />
  );
}
