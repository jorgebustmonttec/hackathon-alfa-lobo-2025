// Vistas/InfoCarrito_Seleccion_Front.js
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, TextInput } from 'react-native';

// Componente para la cabecera de la lista (Texto actualizado)
const ListHeader = () => (
 <View style={[styles.itemRow, styles.listHeader]}>
  <Text style={[styles.itemCell, styles.listHeaderCell, { flex: 5 }]}>Producto</Text>
  <Text style={[styles.itemCell, styles.listHeaderCell, { flex: 4, textAlign: 'center' }]}>Cantidad</Text>
 </View>
);

// ▼▼▼ Componente ListItem TOTALMENTE NUEVO ▼▼▼
const ListItem = ({ item, cantidadActual, onSetCantidad }) => {

  // Convertir el valor (string) a número para poder sumar/restar
  const valorNum = parseInt(cantidadActual, 10) || 0;

  // Funciones para los botones +/-
  const onIncrement = () => onSetCantidad(item.sku, valorNum + 1);
  const onDecrement = () => onSetCantidad(item.sku, valorNum - 1); // El Back maneja que no sea < 0

  // Función para el TextInput
  const onChangeText = (texto) => onSetCantidad(item.sku, texto);

 return (
  <View style={styles.itemRow}>
   {/* Nombre del Producto */}
   <Text style={[styles.itemCell, { flex: 5, fontWeight: '600' }]}>{item.nombre}</Text>

   {/* Contenedor de Input */}
   <View style={[styles.itemCell, styles.inputContainer, { flex: 4 }]}>
        {/* Botón Menos (-) */}
    <TouchableOpacity style={styles.btnQty} onPress={onDecrement}>
     <Text style={styles.btnQtyText}>-</Text>
    </TouchableOpacity>

        {/* Input Numérico */}
    <TextInput
          style={styles.inputQty}
          value={cantidadActual}      // Recibe el valor (string) del Back
          onChangeText={onChangeText} // Envía el texto (string) al Back
          keyboardType="number-pad"   // Muestra teclado numérico
          maxLength={3}               // Límite de 3 dígitos
          textAlign="center"
        />

        {/* Botón Más (+) */}
    <TouchableOpacity style={styles.btnQty} onPress={onIncrement}>
     <Text style={styles.btnQtyText}>+</Text>
    </TouchableOpacity>
   </View>
  </View>
 );
};
// ▲▲▲


export default function InfoCarrito_Seleccion_Front({
 loading,
 error,
 data,    // { id, items[] }
 onBack,
 onConfirm,
  // ▼▼▼ RECIBIR NUEVAS PROPS ▼▼▼
  cantidades,
  onSetCantidad,
  isConfirmDisabled,
  // ▲▲▲
}) {
 if (loading) {
    // ... (sin cambios)
  return (
   <View style={styles.center}>
    <ActivityIndicator />
    <Text style={{ marginTop: 8 }}>Cargando items...</Text>
   </View>
  );
 }

 if (error || !data) {
    // ... (sin cambios)
  return (
   <View style={styles.center}>
    <Text style={{ color: 'tomato', marginBottom: 12 }}>{error || 'Items no disponibles'}</Text>
    <TouchableOpacity style={[styles.btn, { backgroundColor: '#6c757d' }]} onPress={onBack}>
     <Text style={styles.btnText}>← Volver</Text>
    </TouchableOpacity>
   </View>
  );
 }

 return (
  <View style={styles.container}>
   {/* --- BOTÓN DE REGRESO (Sin cambios) --- */}
   <TouchableOpacity style={styles.backButton} onPress={onBack}>
    <Text style={styles.backButtonText}>← Volver al Carrito</Text>
   </TouchableOpacity>

   {/* --- CABECERA DEL CAJÓN (Sin cambios) --- */}
   <View style={styles.headerCard}>
    <Text style={styles.title}>Cajón: {data.id}</Text>
    <Text style={styles.meta}>Inspeccionando {data.items.length} tipo(s) de producto.</Text>
   </View>

   {/* --- LISTA DE ITEMS --- */}
   <FlatList
    data={data.items}
    keyExtractor={(item) => item.sku}
    ListHeaderComponent={ListHeader}
        // ▼▼▼ PASAR NUEVAS PROPS A ListItem ▼▼▼
    renderItem={({ item }) => (
     <ListItem 
      item={item} 
      cantidadActual={cantidades[item.sku]} // Pasa el string de la cantidad
      onSetCantidad={onSetCantidad}       // Pasa la función controladora
     />
    )}
        // ▲▲▲
    ListEmptyComponent={
     <View style={styles.emptyList}>
      <Text style={styles.emptyListText}>Este cajón está vacío.</Text>
     </View>
    }
        // ▼▼▼ BOTÓN CONFIRMAR AHORA ES CONDICIONAL ▼▼▼
    ListFooterComponent={
     <TouchableOpacity 
            style={[styles.btn, isConfirmDisabled && styles.btnDisabled]} // Estilo deshabilitado
            onPress={onConfirm}
            disabled={isConfirmDisabled} // Prop deshabilitado
          >
      <Text style={styles.btnText}>CONFIRMAR</Text>
     </TouchableOpacity>
    }
        // ▲▲▲
    contentContainerStyle={{ paddingBottom: 40 }}
   />
  </View>
 );
}

// ▼▼▼ ESTILOS ACTUALIZADOS ▼▼▼
const styles = StyleSheet.create({
 center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
 container: { flex: 1, padding: 16, backgroundColor: '#f7f8fa' },
 backButton: {
  paddingVertical: 8,
  paddingHorizontal: 4,
  marginBottom: 8,
  alignSelf: 'flex-start',
 },
 backButtonText: {
  color: '#0d6efd',
  fontSize: 16,
  fontWeight: '700',
 },
 headerCard: { 
  backgroundColor: '#fff', 
  borderRadius: 12, 
  padding: 16, 
  elevation: 2, 
  marginBottom: 16 
 },
 title: { fontSize: 22, fontWeight: '800', color: '#222' },
 meta: { color: '#555', marginTop: 4, fontSize: 14 },
 listHeader: {
  backgroundColor: 'transparent',
  borderBottomWidth: 1.5,
  borderColor: '#ddd',
  elevation: 0,
  marginBottom: 6,
  paddingVertical: 8,
    paddingHorizontal: 14, // Alinea con el padding de itemRow
 },
 listHeaderCell: {
  color: '#666',
  fontWeight: '800',
  fontSize: 13,
  textTransform: 'uppercase',
 },
 itemRow: {
  backgroundColor: '#fff', 
  borderRadius: 10, 
  paddingHorizontal: 14,
  paddingVertical: 10,
  marginVertical: 5,
  flexDirection: 'row', 
  alignItems: 'center', 
  elevation: 1,
 },
 itemCell: {
  fontSize: 16,
  color: '#333',
  alignItems: 'center',
 },

  // --- Estilos de 'bool' eliminados ---

  // ▼▼▼ NUEVOS ESTILOS PARA INPUT DE CANTIDAD ▼▼▼
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnQty: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  btnQtyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  inputQty: {
    borderBottomWidth: 1.5,
    borderColor: '#0d6efd',
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    minWidth: 50, // Ancho mínimo
    flex: 1, // Ocupa el espacio restante
    marginHorizontal: 8,
  },
  // ▲▲▲

 emptyList: {
  padding: 20,
  alignItems: 'center',
  marginTop: 20,
  backgroundColor: '#fff',
  borderRadius: 10,
 },
 emptyListText: {
  fontSize: 16,
  color: '#777',
 },
 btn: { 
  backgroundColor: '#0d6efd', 
  padding: 14,
 borderRadius: 8,
  elevation: 1,
    marginTop: 24, // Espacio arriba
 },
  btnDisabled: {
    backgroundColor: '#a0a0a0', // Color gris cuando está deshabilitado
    elevation: 0,
  },
 btnText: { 
  color: '#fff', 
  fontWeight: '800', 
  textAlign: 'center',
  fontSize: 16,
 }
});