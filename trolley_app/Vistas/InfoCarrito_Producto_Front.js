// Vistas/InfoCarrito_Producto_Front.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { CameraView } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';

/* ================== Cámara ================== */
const CameraDisplay = ({ onScanClick, cantidadActual, cantidadRequerida }) => (
  <View style={styles.cameraContainer}>
    <CameraView style={styles.camera} facing="back" />

    {/* Overlay */}
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.scanArea} />
      <Text style={styles.cameraCounterText}>
        {cantidadActual} / {cantidadRequerida}
      </Text>
    </View>

    {/* Botón escanear */}
    <View style={styles.cameraControls}>
      <TouchableOpacity style={styles.btnPrimary} onPress={onScanClick} activeOpacity={0.85}>
        <Text style={styles.btnText}>Escanear (+1)</Text>
      </TouchableOpacity>
    </View>
  </View>
);

/* =========== Tarjeta de información =========== */
const ProductInfo = ({ producto, cantidadActual, isCompleto, onComienzaScan, onOK }) => (
  <View style={styles.infoCard}>
    <Text style={styles.productName}>{producto.nombre}</Text>
    <Text style={styles.productSku}>SKU: {producto.sku}</Text>

    <Text style={styles.qtyLabel}>Cantidad registrada:</Text>
    <Text style={[styles.qtyCounter, isCompleto && styles.qtyCompleto]}>
      {cantidadActual} / {producto.cantidadRequerida}
    </Text>

    {isCompleto ? (
      <View style={styles.completionContainer}>
        <Text style={styles.completionText}>Cantidad completada</Text>
        <TouchableOpacity style={[styles.btnPrimary, styles.btnOK]} onPress={onOK} activeOpacity={0.85}>
          <Text style={styles.btnText}>Next Product</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <TouchableOpacity style={styles.btnPrimary} onPress={onComienzaScan} activeOpacity={0.85}>
        <Text style={styles.btnText}>Comenzar escaneo</Text>
      </TouchableOpacity>
    )}
  </View>
);

/* ================== Vista Principal ================== */
export default function InfoCarrito_Producto_Front({
  loading,
  error,
  // Permisos
  hasPermission,
  onRequestPermission,
  // Lógica
  producto,
  cantidadActual,
  isCompleto,
  showCamera,
  // Handlers
  onBack,
  onComienzaScan,
  onScanClick,
  onOK,
}) {
  /* Estados de carga / error */
  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0d6efd" />
          <Text style={styles.centerText}>Cargando productos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={[styles.centerText, { color: 'tomato', marginBottom: 20 }]}>{error}</Text>
          <TouchableOpacity style={styles.btnSecondary} onPress={onBack} activeOpacity={0.85}>
            <Text style={styles.btnText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false && !loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.centerText}>Se necesita permiso de cámara para escanear.</Text>
          <TouchableOpacity style={styles.btnPrimary} onPress={onRequestPermission} activeOpacity={0.85}>
            <Text style={styles.btnText}>Conceder permiso</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnSecondary, { marginTop: 15 }]} onPress={onBack} activeOpacity={0.85}>
            <Text style={styles.btnText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!producto && !loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.centerText}>No hay productos para verificar en este cajón.</Text>
          <TouchableOpacity style={[styles.btnSecondary, { marginTop: 15 }]} onPress={onBack} activeOpacity={0.85}>
            <Text style={styles.btnText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!producto) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0d6efd" />
        </View>
      </SafeAreaView>
    );
  }

  /* Contenido normal */
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      <View style={styles.pageContent}>
        {/* Botón volver tipo píldora */}
        <TouchableOpacity style={styles.backPillButton} onPress={onBack} activeOpacity={0.85}>
          <Text style={styles.backPillButtonText}>← Regresar al Cajón</Text>
        </TouchableOpacity>

        {/* Contenido: cámara o tarjeta */}
        {showCamera ? (
          <View style={{ flex: 1 }}>
            <CameraDisplay
              onScanClick={onScanClick}
              cantidadActual={cantidadActual}
              cantidadRequerida={producto.cantidadRequerida}
            />
          </View>
        ) : (
          <ProductInfo
            producto={producto}
            cantidadActual={cantidadActual}
            isCompleto={isCompleto}
            onComienzaScan={onComienzaScan}
            onOK={onOK}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

/* ================== Estilos ================== */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f6f7f9',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },

  pageContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  centerText: { fontSize: 16, color: '#333', textAlign: 'center', marginTop: 8 },

  /* Botón volver tipo píldora (gris + sombra) */
  backPillButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E2E5',
    borderRadius: 30,
    paddingVertical: 9,
    paddingHorizontal: 20,
    marginBottom: 16,                 // deja respirar la tarjeta
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4.5,
    elevation: 4,
  },
  backPillButtonText: {
    color: '#565454ff',
    fontSize: 12,
    fontWeight: '700',
  },

  /* Tarjeta de información del producto */
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginTop: 4,
    width: '100%',

    // sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,

    alignItems: 'center',
  },
  productName: { fontSize: 26, fontWeight: '800', color: '#222', textAlign: 'center' },
  productSku: { fontSize: 14, color: '#777', marginBottom: 20, textAlign: 'center' },
  qtyLabel: { fontSize: 16, color: '#555' },
  qtyCounter: { fontSize: 48, fontWeight: 'bold', color: '#dc3545', marginVertical: 10 },
  qtyCompleto: { color: '#198754' },

  completionContainer: { alignItems: 'center', width: '100%', marginTop: 12 },
  completionText: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  btnOK: { backgroundColor: '#1638BD' },

  /* Cámara */
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  camera: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanArea: {
    width: '80%',
    height: '50%',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    borderStyle: 'dashed',
  },
  cameraCounterText: {
    position: 'absolute',
    top: '15%',
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    alignItems: 'center',
  },

  /* Botones genéricos */
  btnPrimary: {
    backgroundColor: '#0d6efd',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 2,
    marginTop: 16,
    width: '90%',
    alignSelf: 'center',
  },
  btnSecondary: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
});
