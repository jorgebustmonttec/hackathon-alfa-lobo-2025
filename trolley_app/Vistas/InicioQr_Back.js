// screens/InicioQr_Back.js
import React, { useState, useRef } from 'react';
import { Alert } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import InicioQr_Front from './InicioQr_Front';

export default function InicioQr_Back({ onBack, onScanned }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const processingRef = useRef(false);

  // Normaliza el estado de permiso para el Front
  const hasPermission = permission === null ? null : !!permission?.granted;

  const handleRequestPermission = () => {
    requestPermission?.();
  };

  const resetScanner = () => {
    processingRef.current = false;
    setScanned(false);
  };

  const handleBarcodeScanned = ({ type, data }) => {
    // Prevenir múltiples procesados
    if (scanned || processingRef.current) return;
    
    processingRef.current = true;
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
            processingRef.current = false;
            setScanned(false);
          }
        },
        { 
          text: 'Continuar', 
          onPress: () => {
            processingRef.current = false;
            // Pequeño delay para asegurar que el estado se resetea antes de navegar
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
      onResetScanner={resetScanner}
    />
  );
}
