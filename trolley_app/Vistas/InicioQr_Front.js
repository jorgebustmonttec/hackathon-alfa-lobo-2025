// screens/InicioQr_Front.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { CameraView } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';

export default function InicioQr_Front({
  hasPermission,               // null | boolean
  onRequestPermission,         // () => void
  scanned,                     // boolean
  onBarcodeScanned,            // ({type, data}) => void
  onBack,                      // () => void
  onResetScanner,              // () => void
}) {
  // 1) Estado inicial: cargando permiso
  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text>Cargando permisos...</Text>
      </View>
    );
  }

  // 2) Sin permiso aún
  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Permisos de Cámara</Text>
        <Text style={styles.text}>Necesitamos acceso a tu cámara para escanear códigos QR.</Text>
        <TouchableOpacity style={styles.btnPrimary} onPress={onRequestPermission}>
          <Text style={styles.btnText}>Conceder permiso</Text>
        </TouchableOpacity>
        {!!onBack && (
          <TouchableOpacity style={styles.btnSecondary} onPress={onBack}>
            <Text style={styles.btnText}>Volver</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // 3) Cámara + overlay
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : onBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      {/* Overlay */}
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.scanArea}>
          <Text style={styles.scanText}>Apunta al código QR</Text>
        </View>
      </View>

      {/* Controles */}
      <View style={styles.controls}>
        {!!onBack && (
          <TouchableOpacity style={styles.btnSecondary} onPress={onBack}>
            <Text style={styles.btnText}>← Volver</Text>
          </TouchableOpacity>
        )}
        {scanned && (
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
          </View>
        )}
      </View>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  text: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 16 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  scanArea: {
    width: 240, height: 240, borderWidth: 2, borderColor: '#fff', borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.25)'
  },
  scanText: { color: '#fff', fontWeight: '700' },
  controls: { position: 'absolute', bottom: 36, left: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  btnPrimary: { backgroundColor: '#0d6efd', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, minWidth: 150, alignItems: 'center' },
  btnSecondary: { backgroundColor: 'rgba(0,0,0,0.7)', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, minWidth: 120, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  badge: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  badgeText: { color: '#fff', fontWeight: '600' }
});