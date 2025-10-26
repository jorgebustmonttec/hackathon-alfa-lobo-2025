// Vistas/LogIn_Back.js
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';

// Import the shared API URL
import { API_BASE_URL } from './apiConfig'; // Adjust path if needed

import LogIn_Front from './LogIn_Front';
import InicioQr_Back from './InicioQr_Back';
import InfoCarrito_Back from './InfoCarrito_Back';
import InfoCarrito_Seleccion_Back from './InfoCarrito_Seleccion_Back';
import InfoCarrito_Producto_Back from './InfoCarrito_Producto_Back';
import InfoVuelo_Back from './InfoVuelo_Back';

// Helper function (remains static for now)
const resolveUbicacion = async (ubicacionId) => { /* ... */ };

export default function LogIn_Back() {
 // --- States ---
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [isLoadingLogin, setIsLoadingLogin] = useState(false);
 const [loginError, setLoginError] = useState('');
 const [apiStatus, setApiStatus] = useState('Checking API status...');

 // Navigation States
 const [scannedData, setScannedData] = useState(null);
 const [flightData, setFlightData] = useState(null); // Store flight data from InfoVuelo
 const [showInfoVuelo, setShowInfoVuelo] = useState(false);
 const [showQrResult, setShowQrResult] = useState(false);
 const [showSeleccion, setShowSeleccion] = useState(false);
 const [ubicacionId, setUbicacionId] = useState(null);
 const [configData, setConfigData] = useState(null); // Store config data for selections
 const [showProducto, setShowProducto] = useState(false);
 const [cantidadesConfirmadas, setCantidadesConfirmadas] = useState({});
 const [completedLocations, setCompletedLocations] = useState(new Set());


 // --- API Health Check ---
 useEffect(() => {
  const checkApiHealth = async () => {
   if (!API_BASE_URL) {
    console.error("API_BASE_URL is not defined in apiConfig.js!");
    setApiStatus("API URL missing in apiConfig.js");
    return;
   }
   setApiStatus('Checking API status...'); // Reset on check start
   try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
     const data = await response.json();
     console.log('API Health Check: Status Running', data);
     setApiStatus(`API Status: Running`); // Simpler success message
    } else {
     console.error(`API Health Check: Failed - Status ${response.status}`);
     setApiStatus(`API Health Check Failed: Status ${response.status}`);
    }
   } catch (error) {
    console.error('API Health Check: Network Error', error);
    setApiStatus(`API Health Check Failed: Network Error\n(Check URL: ${API_BASE_URL})`);
   }
  };
  checkApiHealth();
 }, []); // Runs once on mount


 // --- Login Handler ---
 const handleLogin = async () => {
  if (!API_BASE_URL) {
   setLoginError("API URL is not configured.");
   return;
  }
  setLoginError('');
  setIsLoadingLogin(true);

  console.log(`Attempting login for user: ${username}`); // Log attempt

  try {
   const response = await fetch(`${API_BASE_URL}/users`); // GET /api/users

   if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
   }
   const users = await response.json();

   // Simple check: Does the username exist in the list?
   const userExists = users.some(user => user.username === username.trim());

   if (userExists) {
    console.log(`Login successful for user: ${username}`);
    setIsLoggedIn(true); // <<<<<<<<<<<< LOGIN SUCCESSFUL >>>>>>>>>>>>
   } else {
    console.log(`Login failed: Username '${username}' not found in API response.`);
    setLoginError('Invalid username or password.');
   }
  } catch (error) {
   console.error("Login API call failed:", error);
   setLoginError('Login failed. Check connection.');
   Alert.alert('Login Error', 'Could not connect to the server.');
  } finally {
   setIsLoadingLogin(false);
  }
 };

 // --- Logout Handler ---
 const handleLogout = () => {
  setIsLoggedIn(false);
  setUsername(''); setPassword(''); setScannedData(null); setFlightData(null);
  setShowQrResult(false); setShowSeleccion(false); setUbicacionId(null);
  setConfigData(null); setShowProducto(false); setCantidadesConfirmadas({}); setShowInfoVuelo(false);
  setCompletedLocations(new Set());
  setLoginError('');
 };

 // --- Navigation Handlers (Static data beyond this point) ---
 const handleBackToCamera = () => {
  setShowQrResult(false); setScannedData(null); setFlightData(null); setShowSeleccion(false);
  setUbicacionId(null); setConfigData(null); setShowProducto(false); setCantidadesConfirmadas({});
  setShowInfoVuelo(false);
  setCompletedLocations(new Set());
 };

 const handleNavigateToSeleccion = useCallback(async (idUbicacion, configDataFromCarrito) => {
  // Check if location is already completed
  if (completedLocations.has(idUbicacion)) return;
  
  // Store config data for the selection view
  if (configDataFromCarrito) {
   setConfigData(configDataFromCarrito);
  }
  
  setUbicacionId(idUbicacion);
  setShowSeleccion(true);
 }, [completedLocations]);

 const handleBackToCarrito = useCallback(() => {
  if (ubicacionId) { setCompletedLocations(prev => new Set(prev).add(ubicacionId)); }
  setUbicacionId(null); setConfigData(null); setShowSeleccion(false); setShowProducto(false);
 }, [ubicacionId]);

 const handleNavigateToProducto = (idUbicacion, cantidades) => {
  // Logic remains static
  setCantidadesConfirmadas(cantidades); setUbicacionId(idUbicacion); setShowProducto(true);
 };

 const handleBackToSeleccion = () => setShowProducto(false);


 // --- Render Logic ---
 if (isLoggedIn) {
  // 1) Show Producto View (Static Data Logic)
  if (showProducto && ubicacionId) {
   return ( <InfoCarrito_Producto_Back ubicacionId={ubicacionId} cantidadesConfirmadas={cantidadesConfirmadas} onBack={handleBackToSeleccion} onCompleteAll={handleBackToCarrito} /> );
  }

  // 2) Show Seleccion View (Now uses API config data)
  if (showSeleccion && ubicacionId) {
   return ( 
    <InfoCarrito_Seleccion_Back 
     ubicacionId={ubicacionId} 
     configData={configData}
     onBack={handleBackToCarrito} 
     onConfirm={handleNavigateToProducto} 
    /> 
   );
  }

  // 3) Show Flight Info View (Uses API for flight data)
  if (showInfoVuelo && scannedData) {
   return (
    <InfoVuelo_Back
     qrData={scannedData}
     onBack={handleBackToCamera} // Go back to QR scanner
     onContinue={(receivedFlightData) => {
      // User confirmed flight, store flight data and proceed to show cart
      console.log('[InfoVuelo] continue:', receivedFlightData);
      setFlightData(receivedFlightData); // Store the flight data for InfoCarrito
      setShowInfoVuelo(false);
      setShowQrResult(true); // Show cart view with API integration
     }}
    /> );
  }

  // 4) Show Cart View (Now uses API integration with flight data)
  if (showQrResult && flightData) {
   return (
    <InfoCarrito_Back
     flightData={flightData} // Pass complete flight data instead of just cartId
     onBack={handleBackToCamera}
     onNavigateToSeleccion={handleNavigateToSeleccion}
     completedLocations={completedLocations}
    />
   );
  }

  // 5) Show QR Scanner View (Default after login)
  return (
   <InicioQr_Back
    onBack={handleLogout} // Logout goes back to Login screen
    onScanned={({ type, data }) => {
     // QR code scanned, save data and show Flight Info screen
     console.log('[QR] scanned ok:', { type, data });
     setScannedData({ type, data });
     setShowInfoVuelo(true); // <<<<<<<<<<<< SHOW FLIGHT INFO VIEW >>>>>>>>>>>>
    }}
   /> );
 }

 // --- Render Login View ---
 return (
  <LogIn_Front
   username={username}
   password={password}
   onChangeUsername={setUsername}
   onChangePassword={setPassword}
   onSubmit={handleLogin}
   isLoading={isLoadingLogin}
   errorMessage={loginError}
   apiStatus={apiStatus} // Pass health check status
  />
 );
}

const styles = StyleSheet.create({});