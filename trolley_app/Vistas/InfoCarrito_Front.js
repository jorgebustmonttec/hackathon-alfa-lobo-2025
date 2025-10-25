// Vistas/InfoCarrito_Front.js
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';

export default function InfoCarrito_Front({
  loading,
  error,
  cart,                 // { id, cliente, total, moneda, items[], actualizado }
  onRetry,
  onBack,
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
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Carrito: {cart.id}</Text>
        <Text style={styles.meta}>Cliente: {cart.cliente}</Text>
        <Text style={styles.meta}>Total: {cart.total.toFixed(2)} {cart.moneda}</Text>
        <Text style={styles.metaSmall}>Actualizado: {new Date(cart.actualizado).toLocaleString()}</Text>
      </View>

      <FlatList
        data={cart.items}
        keyExtractor={(item, idx) => `${item.sku}-${idx}`}
        contentContainerStyle={{ paddingVertical: 8 }}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.nombre}</Text>
              <Text style={styles.itemSku}>SKU: {item.sku}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.itemQty}>x{item.qty}</Text>
              <Text style={styles.itemPrice}>${item.precio.toFixed(2)}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={{ marginTop: 8 }}>
            <TouchableOpacity style={styles.btn}>
              <Text style={styles.btnText}>Acciones</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { backgroundColor: '#6c757d', marginTop: 10 }]} onPress={onBack}>
              <Text style={styles.btnText}>← Escanear otro</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  container: { flex: 1, padding: 16, backgroundColor: '#f7f8fa' },
  headerCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '800', color: '#222' },
  meta: { color: '#444', marginTop: 4 },
  metaSmall: { color: '#777', marginTop: 4, fontSize: 12 },
  itemRow: {
    backgroundColor: '#fff', borderRadius: 10, padding: 12, marginHorizontal: 2, marginVertical: 6,
    flexDirection: 'row', alignItems: 'center', elevation: 1
  },
  itemName: { fontWeight: '700', color: '#222' },
  itemSku: { color: '#777', marginTop: 2, fontSize: 12 },
  itemQty: { fontWeight: '700', color: '#222' },
  itemPrice: { color: '#0d6efd', fontWeight: '700', marginTop: 4 },
  btn: { backgroundColor: '#0d6efd', padding: 12, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: '800', textAlign: 'center' }
});
