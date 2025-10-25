import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState(null);
  const [showQrResult, setShowQrResult] = useState(false);

  const handleLogin = () => {
    // Navegar a la segunda vista cuando se presione el botón
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Regresar al login
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setScannedData(null);
    setShowQrResult(false);
  };

  const handleBarcodeScanned = ({ type, data }) => {
    console.log('QR Escaneado:', { type, data }); // Debug
    const qrData = { type, data };
    setScannedData(qrData);
    
    // Mostrar Alert y navegar directamente después de un pequeño delay
    Alert.alert(
      'QR Escaneado',
      `Tipo: ${type}\nDatos: ${data}`,
      [{ 
        text: 'OK', 
        onPress: () => {
          console.log('Botón OK presionado, navegando a tercera vista'); // Debug
          setShowQrResult(true);
        }
      }],
      { 
        onDismiss: () => {
          console.log('Alert dismissed'); // Debug
          setShowQrResult(true);
        }
      }
    );
  };

  const handleBackToCamera = () => {
    setShowQrResult(false);
    setScannedData(null);
  };

  // Si está logueado, verificar qué vista mostrar
  if (isLoggedIn) {
    console.log('Estados actuales:', { showQrResult, scannedData }); // Debug
    
    // Tercera vista: Mostrar resultado del QR
    if (showQrResult && scannedData) {
      console.log('Mostrando tercera vista'); // Debug
      return (
        <View style={styles.container}>
          <View style={styles.qrResultContainer}>
            <Text style={styles.qrResultTitle}>QR Detectado ✅</Text>
            
            <View style={styles.qrDataContainer}>
              <Text style={styles.qrDataLabel}>Tipo de Código:</Text>
              <Text style={styles.qrDataValue}>{scannedData.type}</Text>
              
              <Text style={styles.qrDataLabel}>Información:</Text>
              <Text style={styles.qrDataValue}>{scannedData.data}</Text>
            </View>

            <View style={styles.qrButtonsContainer}>
              <TouchableOpacity style={styles.backToCameraButton} onPress={handleBackToCamera}>
                <Text style={styles.backToCameraButtonText}>📷 Escanear Otro</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>🏠 Ir al Login</Text>
              </TouchableOpacity>
            </View>
          </View>
          <StatusBar style="auto" />
        </View>
      );
    }

    // Segunda vista con cámara
    // Verificar permisos de cámara
    if (!permission) {
      // Los permisos aún se están cargando
      return (
        <View style={styles.container}>
          <Text>Cargando...</Text>
        </View>
      );
    }

    if (!permission.granted) {
      // No se han concedido permisos de cámara
      return (
        <View style={styles.container}>
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionTitle}>Permisos de Cámara</Text>
            <Text style={styles.permissionMessage}>
              Necesitamos acceso a tu cámara para escanear códigos QR
            </Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>Conceder Permiso</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Volver al Login</Text>
            </TouchableOpacity>
          </View>
          <StatusBar style="auto" />
        </View>
      );
    }

    // Vista de cámara para escanear QR
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scannedData ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417', 'code128'],
          }}
        />
        
        {/* Overlay con información */}
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <Text style={styles.scanInstruction}>
              Apunta la cámara hacia un código QR
            </Text>
          </View>
        </View>

        {/* Botones de control */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cameraButton} onPress={handleLogout}>
            <Text style={styles.cameraButtonText}>← Volver</Text>
          </TouchableOpacity>
          
          {scannedData && (
            <TouchableOpacity 
              style={styles.scanAgainButton} 
              onPress={() => setScannedData(null)}
            >
              <Text style={styles.scanAgainButtonText}>Escanear Nuevo</Text>
            </TouchableOpacity>
          )}
        </View>

        <StatusBar style="light" />
      </View>
    );
  }

  // Vista de Login (por defecto)
  return (
    <View style={styles.container}>
      <View style={styles.loginCard}>
        {/* Título de la aplicación */}
        <Text style={styles.title}>Iniciar Sesión</Text>
        <Text style={styles.subtitle}>Bienvenido de nuevo</Text>
        
        {/* Campo de Usuario */}
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

        {/* Campo de Contraseña */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>

        {/* Botón de Login */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        {/* Texto adicional */}
        <Text style={styles.footerText}>¿Olvidaste tu contraseña?</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loginCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 30,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  loginButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#007bff',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  // Estilos para permisos de cámara
  permissionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 30,
    width: '90%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 15,
  },
  permissionMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    minWidth: 200,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Estilos para la vista de cámara
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scanInstruction: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  cameraButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 25,
    padding: 15,
    minWidth: 100,
  },
  cameraButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scanAgainButton: {
    backgroundColor: 'rgba(0, 123, 255, 0.8)',
    borderRadius: 25,
    padding: 15,
    minWidth: 120,
  },
  scanAgainButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#6c757d',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    minWidth: 200,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Estilos para la tercera vista (resultado del QR)
  qrResultContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  qrResultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#28a745',
    textAlign: 'center',
    marginBottom: 25,
  },
  qrDataContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
  },
  qrDataLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 5,
    marginTop: 10,
  },
  qrDataValue: {
    fontSize: 16,
    color: '#212529',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    fontFamily: 'monospace',
  },
  qrButtonsContainer: {
    width: '100%',
    gap: 15,
  },
  backToCameraButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  backToCameraButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
