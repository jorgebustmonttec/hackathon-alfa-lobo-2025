// Vistas/InfoCarrito_Producto_Front.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { CameraView } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';

// --- Componente de Cámara ---
// Muestra la cámara y el botón de "Escaneo (+1)" con el contador
const CameraDisplay = ({ onScanClick, cantidadActual, cantidadRequerida }) => (
 <View style={styles.cameraContainer}>
  <CameraView style={styles.camera} facing="back" />
  
  {/* Overlay */}
  <View style={styles.overlay} pointerEvents="none">
   <View style={styles.scanArea} />
      {/* Contador dentro de la cámara */}
      <Text style={styles.cameraCounterText}>
        {cantidadActual} / {cantidadRequerida}
      </Text>
  </View>

  {/* Botón de Escaneo Manual */}
  <View style={styles.cameraControls}>
   <TouchableOpacity style={styles.btnPrimary} onPress={onScanClick}>
    <Text style={styles.btnText}>Escaneo (+1)</Text>
   </TouchableOpacity>
  </View>
 </View>
);

// --- Componente de Información del Producto ---
// Muestra los detalles del producto y el botón "Comienza Scan" o el mensaje de "Completo" con el botón "OK"
const ProductInfo = ({ producto, cantidadActual, isCompleto, onComienzaScan, onOK }) => (
 <View style={styles.infoCard}>
  <Text style={styles.productName}>{producto.nombre}</Text>
  <Text style={styles.productSku}>SKU: {producto.sku}</Text>
  
  <Text style={styles.qtyLabel}>Cantidad Registrada:</Text>
  <Text style={[styles.qtyCounter, isCompleto && styles.qtyCompleto]}>
      {/* Muestra el progreso actual vs el requerido */}
   {cantidadActual} / {producto.cantidadRequerida} 
  </Text>

  {isCompleto ? (
   // --- Estado Completo ---
   <View style={styles.completionContainer}>
    <Text style={styles.completionText}>¡Cantidad completada!</Text>
    <Text style={styles.completionSubText}>Al dar OK se pasa al siguiente producto.</Text>
    <TouchableOpacity style={[styles.btnPrimary, styles.btnOK]} onPress={onOK}>
     <Text style={styles.btnText}>OK</Text>
    </TouchableOpacity>
   </View>
  ) : (
   // --- Estado Pendiente ---
   <TouchableOpacity style={styles.btnPrimary} onPress={onComienzaScan}>
    <Text style={styles.btnText}>Comienza Scan</Text>
   </TouchableOpacity>
  )}
 </View>
);

// --- Componente Principal ---
export default function InfoCarrito_Producto_Front({
 loading,
 error,
 // Permisos
 hasPermission,
 onRequestPermission,
 // Lógica
 producto,
 cantidadActual, // La cantidad que se está contando actualmente
 isCompleto,
 showCamera,
 // Handlers
 onBack, // Para volver a la pantalla de Selección de Cajón
 onComienzaScan, // Para abrir la cámara
 onScanClick, // Para sumar +1 al contador
 onOK, // Para pasar al siguiente producto
}) {
 // 1. Cargando
 if (loading) {
  return (
   <View style={styles.center}>
    <ActivityIndicator size="large" color="#0d6efd" />
    <Text style={styles.centerText}>Cargando productos...</Text>
   </View>
  );
 }

 // 2. Error
 if (error) {
  return (
   <View style={styles.center}>
    <Text style={[styles.centerText, { color: 'tomato', marginBottom: 20 }]}>{error}</Text>
    <TouchableOpacity style={styles.btnSecondary} onPress={onBack}>
     <Text style={styles.btnText}>Volver</Text>
    </TouchableOpacity>
   </View>
  );
 }

 // 3. Sin Permiso de Cámara
 if (hasPermission === false && !loading) { // Asegurarse que no sea el estado inicial null
  return (
   <View style={styles.center}>
    <Text style={styles.centerText}>Se necesita permiso de la cámara para escanear.</Text>
    <TouchableOpacity style={styles.btnPrimary} onPress={onRequestPermission}>
     <Text style={styles.btnText}>Conceder Permiso</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.btnSecondary, {marginTop: 15}]} onPress={onBack}>
     <Text style={styles.btnText}>Volver</Text>
    </TouchableOpacity>
   </View>
  );
 }
 
 // 4. Sin producto (lista vacía o terminada - manejado por Back, pero por si acaso)
 if (!producto && !loading) {
  return (
   <View style={styles.center}>
    <Text style={styles.centerText}>No hay productos para verificar en este cajón.</Text>
         <TouchableOpacity style={[styles.btnSecondary, {marginTop: 15}]} onPress={onBack}>
     <Text style={styles.btnText}>Volver</Text>
    </TouchableOpacity>
   </View>
  );
 }

  // Esperar a que producto esté listo si no estamos cargando
  if (!producto) {
     return <View style={styles.center}><ActivityIndicator size="large" color="#0d6efd" /></View>;
  }

 // 5. Vista Principal
 return (
  <View style={styles.container}>
   <StatusBar style="auto" />
   <TouchableOpacity style={styles.backButton} onPress={onBack}>
    <Text style={styles.backButtonText}>← Volver a Selección de Cajón</Text>
   </TouchableOpacity>

   {/* Muestra la cámara o la info del producto */}
   {showCamera ? (
    <CameraDisplay 
          onScanClick={onScanClick} 
          cantidadActual={cantidadActual}
          cantidadRequerida={producto.cantidadRequerida} 
        />
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
 );
}

// --- Estilos ---
const styles = StyleSheet.create({
 // Contenedores
 container: { flex: 1, backgroundColor: '#f7f8fa', padding: 16, paddingTop: 40 },
 center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
 centerText: { fontSize: 16, color: '#333', textAlign: 'center', marginBottom: 16 },

 // Botón Volver
 backButton: { paddingVertical: 8, paddingHorizontal: 4, marginBottom: 8, alignSelf: 'flex-start' },
 backButtonText: { color: '#0d6efd', fontSize: 16, fontWeight: '700' },

 // Card de Info
 infoCard: {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 20,
  elevation: 3, // Sombra sutil
  shadowColor: '#000', // Sombra para iOS
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 1.41,
  alignItems: 'center',
  marginTop: 20,
  width: '100%', // Ocupa todo el ancho disponible
 },
 productName: { fontSize: 24, fontWeight: 'bold', color: '#222', textAlign: 'center' },
 productSku: { fontSize: 14, color: '#777', marginBottom: 24, textAlign: 'center' },
 qtyLabel: { fontSize: 16, color: '#555' },
 qtyCounter: {
  fontSize: 48,
  fontWeight: 'bold',
  color: '#dc3545', // Rojo (pendiente)
  marginVertical: 10,
 },
 qtyCompleto: {
  color: '#198754', // Verde (completo)
 },
 
 // Estado Completo
 completionContainer: { alignItems: 'center', width: '100%', marginTop: 16 },
 completionText: { fontSize: 18, fontWeight: 'bold', color: '#198754', marginBottom: 4 },
 completionSubText: { fontSize: 14, color: '#555', marginBottom: 20, textAlign: 'center' },
 btnOK: { backgroundColor: '#198754' }, // Botón OK verde

 // Cámara
 cameraContainer: {
  flex: 1, // Ocupa el espacio disponible
  backgroundColor: '#000',
  borderRadius: 16,
  overflow: 'hidden', // Para redondear la cámara
  position: 'relative', // Para posicionar elementos encima
 },
 camera: { flex: 1 }, // La cámara ocupa todo el contenedor
 overlay: { 
    position: 'absolute', 
    top: 0, left: 0, right: 0, bottom: 0, 
    alignItems: 'center', 
    justifyContent: 'center', // Centra el área de escaneo
  },
 scanArea: { // El borde visual
  width: '80%', 
  height: '50%', 
  borderWidth: 2, 
  borderColor: 'rgba(255, 255, 255, 0.7)', // Blanco semitransparente
  borderRadius: 16,
  borderStyle: 'dashed', // Línea punteada
 },
  cameraCounterText: { // El contador X/Y
    position: 'absolute',
    top: '15%', // Ajusta esta posición como prefieras
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscuro semitransparente
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
 cameraControls: { // Contenedor del botón "Escaneo"
  position: 'absolute', 
  bottom: 24, 
  left: 24, 
  right: 24, 
  alignItems: 'center', // Centra el botón horizontalmente
 },

 // Botones Genéricos
 btnPrimary: { 
  backgroundColor: '#0d6efd', 
  paddingVertical: 14, 
    paddingHorizontal: 20, // Un poco más de padding horizontal
  borderRadius: 10, // Más redondeado
  elevation: 2,
  marginTop: 16,
  width: '90%', // Ligeramente menos ancho
  alignSelf: 'center', // Asegura centrado si el padre es flex
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
 btnText: { 
  color: '#fff', 
  fontWeight: 'bold', // 'bold' es más estándar que '800'
  textAlign: 'center',
  fontSize: 16,
 }
});