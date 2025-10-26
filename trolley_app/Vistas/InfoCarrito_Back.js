// Vistas/InfoCarrito_Back.js
import React, { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import InfoCarrito_Front from './InfoCarrito_Front';
import { API_BASE_URL } from './apiConfig';

export default function InfoCarrito_Back({
  flightData,
  onBack,
  onNavigateToSeleccion,
  completedLocations
}) {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      if (!API_BASE_URL) {
        throw new Error("API_BASE_URL is not defined in apiConfig.js!");
      }

      if (!flightData?.qrData?.data) {
        throw new Error("No QR data available to fetch cart config.");
      }

      let location;
      if (flightData.selectedCity === 'origen') {
        location = flightData.flightInfo?.origin || 'DFW';
      } else {
        location = flightData.flightInfo?.destination || 'LHR';
      }

      const qrId = flightData.qrData.data.trim();
      console.log(`Fetching cart config for QR ID: ${qrId}, location: ${location}`);

      const response = await fetch(`${API_BASE_URL}/trolley/${qrId}/config?location=${location}`);

      if (response.status === 404) {
        throw new Error(`Cart configuration not found for trolley ${qrId} at location ${location}.`);
      }

      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Invalid location ${location} for trolley ${qrId}.`);
      }

      if (!response.ok) {
        let errorBody = '';
        try { errorBody = await response.text(); } catch (_) {}
        throw new Error(`HTTP error! status: ${response.status} Body: ${errorBody}`);
      }

      const configData = await response.json();
      console.log("Cart config received:", configData);

      const transformedCart = {
        id: qrId,
        trabajadorNombre: 'Current User',
        trabajadorId: 'USR-001',
        numVuelo: flightData.flightInfo?.route_number || qrId,
        origen: `${flightData.ciudadOrigen} (${flightData.flightInfo?.origin || ''})`,
        destino: `${flightData.ciudadDestino} (${flightData.flightInfo?.destination || ''})`,
        ubicaciones: {
          columnaA: [],
          columnaB: []
        },
        configData: configData
      };

      if (configData.baskets && Array.isArray(configData.baskets)) {
        configData.baskets.forEach(basket => {
          const position = basket.position_identifier;
          if (position.startsWith('A')) {
            transformedCart.ubicaciones.columnaA.push(position);
          } else if (position.startsWith('B')) {
            transformedCart.ubicaciones.columnaB.push(position);
          }
        });
        
        transformedCart.ubicaciones.columnaA.sort();
        transformedCart.ubicaciones.columnaB.sort();
      }

      setCart(transformedCart);

    } catch (e) {
      console.error("Error loading cart config:", e);
      setError(e?.message || 'Failed to load cart configuration.');
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [flightData]);

  useEffect(() => { load(); }, [load]);

  const handleSelectUbicacion = (ubicacionId) => {
    console.log(`[InfoCarrito_Back] Clicked location: ${ubicacionId}. Notifying LogIn_Back.`);
    onNavigateToSeleccion?.(ubicacionId, cart?.configData);
  };

  // ✅ Aquí agregamos la redirección sin tocar nada más
  const handleConfirmCarrito = () => {
    console.log('Confirm cart (BACK):', {
      qrId: cart?.id,
      flightData: flightData,
      completedLocations: Array.from(completedLocations || [])
    });

    Alert.alert('Carrito confirmado', 'La configuración del carrito ha sido confirmada exitosamente.');

    // 👉 Redirigir automáticamente a la cámara (InicioQr_Back)
    if (onBack) {
      console.log("Redirigiendo a InicioQr_Back...");
      onBack(); // Usa el mismo handler que ya tienes para volver al escáner
    }
  };

  return (
    <InfoCarrito_Front
      loading={loading}
      error={error}
      cart={cart}
      onRetry={load}
      onBack={onBack}
      onSelectUbicacion={handleSelectUbicacion}
      onConfirmCarrito={handleConfirmCarrito}
      completedLocations={completedLocations}
    />
  );
}
