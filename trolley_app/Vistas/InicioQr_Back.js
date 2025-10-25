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

  const handleBarcodeScanned = ({ type, data }) => {
    if (scanned) return;
    setScanned(true);

    const value = (data || '').trim();

    Alert.alert(
      'QR Escaneado',
      `Tipo: ${type}\nDatos: ${value}`,
      [
        { 
          text: 'Cancelar', 
          style: 'cancel', 
          onPress: () => {
            setTimeout(() => setScanned(false), 100);
          }
        },
        { 
          text: 'Continuar', 
          onPress: () => {
            setTimeout(() => {
              onScanned?.({ type, data: value });
            }, 100);
          }
        }
      ],
      { 
        cancelable: false
      }
    );
  };

  return (
    <InicioQr_Front
      hasPermission={hasPermission}
      onRequestPermission={handleRequestPermission}
      scanned={scanned}
      onBarcodeScanned={handleBarcodeScanned}
      onBack={onBack}
    />
  );
}
