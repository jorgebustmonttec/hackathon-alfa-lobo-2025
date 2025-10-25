// Vistas/App.js
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import InicioQr_Back from './InicioQr_Back';
import InfoCarrito_Back from './InfoCarrito_Back';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scannedData, setScannedData] = useState(null);   // { type, data }
  const [showQrResult, setShowQrResult] = useState(false); // ahora controla InfoCarrito

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setScannedData(null);
    setShowQrResult(false);
  };

  const handleBackToCamera = () => {
    setShowQrResult(false);
    setScannedData(null);
  };

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

    // Segunda vista: Cámara (delegada al Back)
    return (
      <InicioQr_Back
        onBack={handleLogout} // ← botón "Volver" desde la cámara
        onScanned={({ type, data }) => {
          // En cuanto lea, pasamos a InfoCarrito
          setScannedData({ type, data });
          setShowQrResult(true);
        }}
      />
    );
  }

  // Vista de Login (por defecto)
  return (
    <View style={styles.container}>
      <View style={styles.loginCard}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <Text style={styles.subtitle}>Bienvenido de nuevo</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu usuario"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>¿Olvidaste tu contraseña?</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  loginCard: {
    backgroundColor: '#ffffff', borderRadius: 15, padding: 30, width: '100%', maxWidth: 350,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
  },
  title: {
    fontSize: 28, fontWeight: 'bold', color: '#333333', textAlign: 'center', marginBottom: 8,
  },
  subtitle: {
    fontSize: 16, color: '#666666', textAlign: 'center', marginBottom: 30,
  },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333333', marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#dddddd', borderRadius: 8, padding: 15, fontSize: 16, backgroundColor: '#f9f9f9',
  },
  loginButton: {
    backgroundColor: '#007bff', borderRadius: 8, padding: 15, marginTop: 10, marginBottom: 20,
  },
  loginButtonText: {
    color: '#ffffff', fontSize: 18, fontWeight: 'bold', textAlign: 'center',
  },
  footerText: {
    fontSize: 14, color: '#007bff', textAlign: 'center', textDecorationLine: 'underline',
  },
});

