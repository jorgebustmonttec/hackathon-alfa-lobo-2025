// Vistas/InfoCarrito_Seleccion_Front.js
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';

// Componente para la cabecera de la lista
const ListHeader = () => (
  <View style={[styles.itemRow, styles.listHeader]}>
    <Text style={[styles.itemCell, styles.listHeaderCell, { flex: 1.5 }]}>Cant.</Text>
    <Text style={[styles.itemCell, styles.listHeaderCell, { flex: 5 }]}>Producto</Text>
    <Text style={[styles.itemCell, styles.listHeaderCell, { flex: 3, textAlign: 'center' }]}>¿OK?</Text>
  </View>
);

// Componente para cada item de la lista (interactivo)
const ListItem = ({ item, valorVerificado, onToggle }) => {
  const onSelectSi = () => onToggle(item.sku, true);
  const onSelectNo = () => onToggle(item.sku, false);

  return (
    <View style={styles.itemRow}>
      {/* Cantidad */}
      <Text style={[styles.itemCell, { flex: 1.5, fontWeight: 'bold' }]}>{item.cantidad}</Text>
      {/* Nombre */}
      <Text style={[styles.itemCell, { flex: 5 }]}>{item.nombre}</Text>
      {/* Botones Sí/No */}
      <View style={[styles.itemCell, styles.botonesBoolContainer, { flex: 3 }]}>
        <TouchableOpacity
          style={[
            styles.botonBool,
            styles.botonBoolSi,
            valorVerificado === true && styles.botonBoolSiActivo,
          ]}
          onPress={onSelectSi}
        >
          <Text style={[
            styles.botonBoolTexto,
            valorVerificado === true && styles.botonBoolTextoActivo,
          ]}>Sí</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.botonBool,
            styles.botonBoolNo,
            valorVerificado === false && styles.botonBoolNoActivo,
          ]}
          onPress={onSelectNo}
        >
          <Text style={[
            styles.botonBoolTexto,
            valorVerificado === false && styles.botonBoolTextoActivo,
          ]}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default function InfoCarrito_Seleccion_Front({
  loading,
  error,
  data,       // { id, items[] }
  onBack,
  onConfirm,
  verificaciones,
  onToggleVerificacion,
}) {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Cargando items...</Text>
      </View>
    );
  }

  if (error || !data) {
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
      {/* --- BOTÓN DE REGRESO --- */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Volver al Carrito</Text>
      </TouchableOpacity>

      {/* --- CABECERA DEL CAJÓN --- */}
      <View style={styles.headerCard}>
        <Text style={styles.title}>Cajón: {data.id}</Text>
        <Text style={styles.meta}>Inspeccionando {data.items.length} tipo(s) de producto.</Text>
      </View>

      {/* --- LISTA DE ITEMS --- */}
      <FlatList
        data={data.items}
        keyExtractor={(item) => item.sku}
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => (
          <ListItem 
            item={item} 
            valorVerificado={verificaciones[item.sku]} 
            onToggle={onToggleVerificacion}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyListText}>Este cajón está vacío.</Text>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity style={[styles.btn, { marginTop: 24 }]} onPress={onConfirm}>
            <Text style={styles.btnText}>CONFIRMAR</Text>
          </TouchableOpacity>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

// ▼▼▼ BLOQUE DE ESTILOS 100% LIMPIO ▼▼▼
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
  botonesBoolContainer: {
  	flexDirection: 'row',
  	justifyContent: 'flex-end',
  },
  botonBool: {
  	paddingVertical: 6,
  	paddingHorizontal: 12,
  	borderRadius: 6,
  	borderWidth: 1.5,
  	marginLeft: 8,
  	minWidth: 45,
  	alignItems: 'center',
 },
  botonBoolSi: {
  	borderColor: '#198754', // Verde
  },
  botonBoolNo: {
  	borderColor: '#dc3545', // Rojo
  },
  botonBoolSiActivo: {
  	backgroundColor: '#198754', // Relleno Verde
  },
  botonBoolNoActivo: {
  	backgroundColor: '#dc3545', // Relleno Rojo
  },
  botonBoolTexto: {
  	fontWeight: '700',
  	fontSize: 14,
  	color: '#555',
  },
  botonBoolTextoActivo: {
  	color: '#fff',
  }, 
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
  },
  btnText: { 
  	color: '#fff', 
  	fontWeight: '800', 
  	textAlign: 'center',
  	fontSize: 16,
  } 
});