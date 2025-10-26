// Vistas/InfoVuelo_Back.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import InfoVuelo_Front from './InfoVuelo_Front';

// Import the shared API URL
import { API_BASE_URL } from './apiConfig'; // Adjust path if needed

const OPTIONS = { ORIGEN: 'origen', DESTINO: 'destino' };

export default function InfoVuelo_Back({ qrData, onBack, onContinue }) {
 const [selectedOption, setSelectedOption] = useState('');
 const [ciudadOrigen, setCiudadOrigen] = useState('');
 const [ciudadDestino, setCiudadDestino] = useState('');
 const [flightInfo, setFlightInfo] = useState(null); // Store complete flight info from API
 const [isLoadingFlight, setIsLoadingFlight] = useState(true);

 // --- Fetch Flight Data via API ---
 useEffect(() => {
  const fetchFlightData = async () => {
   if (!API_BASE_URL) {
    console.error("API_BASE_URL is not defined in apiConfig.js!");
    Alert.alert("Config Error", "API URL is missing.", [{ text: "OK", onPress: onBack }]);
    setIsLoadingFlight(false);
    return;
   }
   if (!qrData?.data) {
    console.error("No QR data available to fetch flight info.");
    Alert.alert("Error", "Invalid QR code scanned.", [{ text: "OK", onPress: onBack }]);
    setIsLoadingFlight(false);
    return;
   }

   const qrId = qrData.data.trim();
   console.log(`Fetching flight info for QR ID: ${qrId}`);
   setIsLoadingFlight(true);
   setCiudadOrigen(''); // Clear previous values while loading
   setCiudadDestino('');
   setFlightInfo(null);

   try {
    const response = await fetch(`${API_BASE_URL}/trolley/${qrId}/flight`); // GET /api/trolley/{qrId}/flight

    if (response.status === 404) {
     console.error(`Flight info not found for QR ID: ${qrId}`);
     Alert.alert("Not Found", `No flight information found for trolley ${qrId}.`, [{ text: "OK", onPress: onBack }]);
     setCiudadOrigen('Not Found');
     setCiudadDestino('Not Found');
     setFlightInfo(null);
     return; // Stop processing
    }
    if (!response.ok) {
     // Try to get error details from response if possible
     let errorBody = '';
     try { errorBody = await response.text(); } catch (_) {}
     throw new Error(`HTTP error! status: ${response.status} Body: ${errorBody}`);
    }

    const flightInfo = await response.json(); // Expect { origin: '...', destination: '...' }
    console.log("Flight info received:", flightInfo);

    // Update state with data from API - store full flight info
    setCiudadOrigen(flightInfo.origin_city || 'Unknown Origin');
    setCiudadDestino(flightInfo.destination_city || 'Unknown Destination');
    
    // Store the complete flight info for later use
    setFlightInfo(flightInfo);

   } catch (error) {
    console.error("Flight API call failed:", error);
    Alert.alert('Network Error', 'Could not fetch flight information. Please check connection.', [{ text: "OK", onPress: onBack }]);
    setCiudadOrigen('Error');
    setCiudadDestino('Error');
    setFlightInfo(null);
   } finally {
    setIsLoadingFlight(false);
   }
  };

  fetchFlightData();
 }, [qrData?.data, onBack]); // Dependencies


 // --- Handlers (remain the same) ---
 const handleOptionSelect = useCallback((option) => {
    if (option === OPTIONS.ORIGEN || option === OPTIONS.DESTINO) {
      setSelectedOption(option);
    } else {
      Alert.alert('Invalid Option', 'Please select origin or destination.');
    }
 }, []);

 const hasSelection = useMemo(() => !!selectedOption, [selectedOption]);

 const selectedCityInfo = useMemo(() => {
    return selectedOption === OPTIONS.ORIGEN ? ciudadOrigen
           : selectedOption === OPTIONS.DESTINO ? ciudadDestino
           : '';
 }, [selectedOption, ciudadOrigen, ciudadDestino]);

 const handleContinue = useCallback(() => {
    if (!hasSelection) {
      Alert.alert('Selection Required', 'Please select which city you are coming from to continue.');
      return;
    }
    // Pass collected data, including API-fetched cities and IATA codes
    const flightData = {
      qrData,
      selectedCity: selectedOption,
      ciudadOrigen, // From API (city names)
      ciudadDestino, // From API (city names)
      selectedCityInfo,
      flightInfo // Complete flight info including IATA codes
    };
    onContinue?.(flightData);
 }, [hasSelection, selectedOption, ciudadOrigen, ciudadDestino, selectedCityInfo, qrData, onContinue]);

 // --- Render ---
 return (
  <InfoVuelo_Front
   // Show loading indicators while fetching
   ciudadOrigen={isLoadingFlight ? 'Loading...' : ciudadOrigen}
   ciudadDestino={isLoadingFlight ? 'Loading...' : ciudadDestino}
   selectedOption={selectedOption}
   onOptionSelect={handleOptionSelect}
   onContinue={handleContinue}
   onBack={onBack}
   hasSelection={hasSelection}
   // Pass loading state to potentially disable UI elements
   isLoading={isLoadingFlight}
  />
 );
}