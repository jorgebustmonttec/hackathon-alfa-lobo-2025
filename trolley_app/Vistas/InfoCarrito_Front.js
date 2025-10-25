// Vistas/InfoCarrito_Front.js
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';

export default function InfoCarrito_Front({
  loading,
  error,
  cart,                 // { id, cliente, total, moneda, ubicaciones, actualizado }
  onRetry,
  onBack,
  onSelectUbicacion, // <-- Prop para manejar clic en A1, B1, etc.
}) {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Cargando carrito...</Text>
      </View>
    );
  }

  if (error || !cart) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'tomato', marginBottom: 12 }}>{error || 'Carrito no disponible'}</Text>
        <TouchableOpacity style={styles.btn} onPress={onRetry}>
          <Text style={styles.btnText}>Reintentar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: '#6c757d', marginTop: 10 }]} onPress={onBack}>
          <Text style={styles.btnText}>← Escanear otro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    // Usamos ScrollView por si el contenido crece
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Carrito: {cart.id}</Text>
        <Text style={styles.meta}>Cliente: {cart.cliente}</Text>
        <Text style={styles.meta}>Total: {cart.total.toFixed(2)} {cart.moneda}</Text>
        <Text style={styles.metaSmall}>Actualizado: {new Date(cart.actualizado).toLocaleString()}</Text>
      </View>

      {/* ▼▼ SECCIÓN DE BOTONES DE UBICACIÓN ▼▼ */}
      <View style={styles.columnsContainer}>
        
        {/* Columna A */}
        <View style={styles.column}>
          {cart.ubicaciones?.columnaA?.map((id) => (
            <TouchableOpacity 
              key={id} 
              style={styles.btnUbicacion} 
              onPress={() => onSelectUbicacion(id)}
            >
              <Text style={styles.btnUbicacionText}>{id}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Columna B */}
        <View style={styles.column}>
          {cart.ubicaciones?.columnaB?.map((id) => (
            <TouchableOpacity 
              key={id} 
              style={styles.btnUbicacion} 
              onPress={() => onSelectUbicacion(id)}
            >
              <Text style={styles.btnUbicacionText}>{id}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {/* ▲▲ FIN DE SECCIÓN DE BOTONES ▲▲ */}

      {/* Botón 'Escanear otro' al final */}
      <TouchableOpacity 
        style={[styles.btn, { backgroundColor: '#6c757d', marginTop: 20, marginHorizontal: 10 }]} 
        onPress={onBack}
      >
        <Text style={styles.btnText}>← Escanear otro</Text>
      </TouchableOpacity>
    
    </ScrollView>
  );
}

// ▼▼▼ BLOQUE DE ESTILOS 100% LIMPIO ▼▼▼
const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  container: { flex: 1, padding: 16, backgroundColor: '#f7f8fa' },
  headerCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2, marginBottom: 12, marginHorizontal: 10 },
  title: { fontSize: 20, fontWeight: '800', color: '#222' },
  meta: { color: '#444', marginTop: 4 },
  metaSmall: { color: '#777', marginTop: 4, fontSize: 12 },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 5,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'stretch',
  },
  btnUbicacion: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 1,
  },
  btnUbicacionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  btn: { backgroundColor: '#0d6efd', padding: 12, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: '800', textAlign: 'center' }
});