// Vistas/InfoCarrito_Back.js
import React, { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import InfoCarrito_Front from './InfoCarrito_Front';
import { API_BASE_URL } from './apiConfig';

export default function InfoCarrito_Back({
 flightData, // <-- Recibe los datos del vuelo (incluye qrData, selectedCity, etc.)
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

   // Determinar la ubicación basada en la selección del usuario
   // El location debe ser el código IATA (DFW, LHR, etc.)
   let location;
   if (flightData.selectedCity === 'origen') {
    // Si el usuario seleccionó origen, usar el código IATA de origen
    location = flightData.flightInfo?.origin || 'DFW';
   } else {
    // Si el usuario seleccionó destino, usar el código IATA de destino
    location = flightData.flightInfo?.destination || 'LHR';
   }

   const qrId = flightData.qrData.data.trim();
   
   console.log(`Fetching cart config for QR ID: ${qrId}, location: ${location}`);

   // Llamar a la API para obtener la configuración del carrito
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

   // Transformar los datos de la API al formato esperado por el frontend
   const transformedCart = {
    id: qrId,
    trabajadorNombre: 'Current User', // Podríamos obtener esto de otro endpoint
    trabajadorId: 'USR-001',
    numVuelo: flightData.flightInfo?.route_number || qrId, // Usar el route number de la API
    origen: `${flightData.ciudadOrigen} (${flightData.flightInfo?.origin || ''})`,
    destino: `${flightData.ciudadDestino} (${flightData.flightInfo?.destination || ''})`,
    ubicaciones: {
     columnaA: [],
     columnaB: []
    },
    configData: configData // Guardar la configuración original para uso posterior
   };

   // Extraer las posiciones de los baskets y organizarlas en columnas
   if (configData.baskets && Array.isArray(configData.baskets)) {
    configData.baskets.forEach(basket => {
     const position = basket.position_identifier;
     if (position.startsWith('A')) {
      transformedCart.ubicaciones.columnaA.push(position);
     } else if (position.startsWith('B')) {
      transformedCart.ubicaciones.columnaB.push(position);
     }
    });
    
    // Ordenar las posiciones
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
  // Pasar tanto el ubicacionId como los datos de configuración necesarios
  onNavigateToSeleccion?.(ubicacionId, cart?.configData);
 };

 const handleConfirmCarrito = () => {
  console.log('Confirm cart (BACK):', {
   qrId: cart?.id,
   flightData: flightData,
   completedLocations: Array.from(completedLocations || [])
  });
  Alert.alert('Cart Confirmed', 'Cart configuration has been confirmed successfully.');
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