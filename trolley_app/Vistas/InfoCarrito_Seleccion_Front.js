// Vistas/InfoCarrito_Seleccion_Front.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';

/* ========== Cabecera de la tabla ========== */
const ListHeader = () => (
  <View style={[styles.itemRow, styles.listHeader]}>
    <Text style={[styles.itemCell, styles.listHeaderCell, { flex: 5 }]}>
      Producto
    </Text>
    <Text
      style={[
        styles.itemCell,
        styles.listHeaderCell,
        { flex: 4, textAlign: 'center' },
      ]}
    >
      Cantidad
    </Text>
  </View>
);

/* ========== Item de la lista ========== */
const ListItem = ({ item, cantidadActual, onSetCantidad }) => {
  const valorNum = parseInt(cantidadActual, 10) || 0;
  const onIncrement = () => onSetCantidad(item.sku, valorNum + 1);
  const onDecrement = () => onSetCantidad(item.sku, valorNum - 1); // back valida < 0
  const onChangeText = (texto) => onSetCantidad(item.sku, texto);

  return (
    <View style={styles.itemRow}>
      {/* Nombre */}
      <Text style={[styles.itemCell, { flex: 5, fontWeight: '600' }]}>
        {item.nombre}
      </Text>

      {/* Controles de cantidad */}
      <View style={[styles.itemCell, styles.inputContainer, { flex: 4 }]}>
        <TouchableOpacity style={styles.btnQty} onPress={onDecrement}>
          <Text style={styles.btnQtyText}>-</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.inputQty}
          value={cantidadActual}
          onChangeText={onChangeText}
          keyboardType="number-pad"
          maxLength={3}
          textAlign="center"
        />

        <TouchableOpacity style={styles.btnQty} onPress={onIncrement}>
          <Text style={styles.btnQtyText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function InfoCarrito_Seleccion_Front({
  loading,
  error,
  data, // { id, items[] }
  onBack,
  onConfirm,
  cantidades,
  onSetCantidad,
  isConfirmDisabled,
}) {
  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>Cargando items...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={{ color: 'tomato', marginBottom: 12 }}>
            {error || 'Items no disponibles'}
          </Text>
          <TouchableOpacity
            style={[styles.btnSecondary, { marginTop: 4 }]}
            onPress={onBack}
          >
            <Text style={styles.btnSecondaryText}>← Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Contenido principal */}
      <View style={styles.pageContent}>
        {/* Botón tipo píldora */}
        <TouchableOpacity style={styles.backPillButton} onPress={onBack} activeOpacity={0.8}>
          <Text style={styles.backPillButtonText}>← Volver</Text>
        </TouchableOpacity>

        {/* Header card (bajado un poco respecto al botón volver) */}
        <View style={styles.headerCard}>
          <Text style={styles.title}>Cajón: {data.id}</Text>
          <Text style={styles.meta}>
            Inspeccionando {data.items.length} tipo(s) de producto.
          </Text>
        </View>

        {/* Lista */}
        <FlatList
          data={data.items}
          keyExtractor={(item) => item.sku}
          ListHeaderComponent={ListHeader}
          renderItem={({ item }) => (
            <ListItem
              item={item}
              cantidadActual={cantidades[item.sku]}
              onSetCantidad={onSetCantidad}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Text style={styles.emptyListText}>Este cajón está vacío.</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Footer: sin cuadro blanco, usando el mismo fondo de la pantalla */}
      <View style={styles.footerBar}>
        <TouchableOpacity
          style={[styles.btnPrimary, isConfirmDisabled && styles.btnDisabled]}
          onPress={onConfirm}
          disabled={isConfirmDisabled}
          activeOpacity={0.8}
        >
          <Text style={styles.btnPrimaryText}>CONFIRMAR</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ===================== ESTILOS ===================== */
const PAGE_PADDING_H = 16;
const CARD_RADIUS = 14;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f6f7f9',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },

  pageContent: {
    flex: 1,
    paddingHorizontal: PAGE_PADDING_H,
    paddingTop: 12,
    paddingBottom: 12,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f6f7f9',
  },

  /* === Botón tipo píldora (con sombra y gris más oscuro) === */
  backPillButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E2E5',
    borderRadius: 30,
    paddingVertical: 9,
    paddingHorizontal: 20,
    marginBottom: 16,            // ⬅️ más espacio para separar del card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4.5,
    elevation: 4,
  },
  backPillButtonText: {
    color: '#666363ff',
    fontSize: 12,
    fontWeight: '700',
  },

  /* Header card */
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: CARD_RADIUS,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#1f2937' },
  meta: { color: '#4b5563', marginTop: 6, fontSize: 14 },

  /* Tabla */
  listHeader: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1.5,
    borderColor: '#e5e7eb',
    marginBottom: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  listHeaderCell: {
    color: '#6b7280',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  itemRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  itemCell: { fontSize: 16, color: '#111827' },

  /* Cantidad */
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnQty: {
    backgroundColor: '#f0f3f8',
    borderRadius: 10,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  btnQtyText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
    lineHeight: 22,
  },
  inputQty: {
    borderBottomWidth: 1.6,
    borderColor: '#3F8DD1',
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    minWidth: 56,
    flex: 1,
    marginHorizontal: 10,
  },

  /* Lista vacía */
  emptyList: {
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyListText: { fontSize: 16, color: '#6b7280' },

  /* Botones */
  btnPrimary: {
    backgroundColor: '#1638BD',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  btnSecondary: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  btnSecondaryText: { color: '#fff', fontWeight: '800', textAlign: 'center' },
  btnDisabled: { backgroundColor: '#a0a0a0', elevation: 0 },

  /* Footer sin cuadro blanco (transparente, sin sombra) */
  footerBar: {
    paddingHorizontal: PAGE_PADDING_H,
    paddingTop: 10,
    paddingBottom: 18 + 6, // un poco más por el área segura
    backgroundColor: 'transparent', // ⬅️ ya no hay fondo blanco
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowOpacity: 0,               // sin sombra
    elevation: 0,                   // sin sombra Android
  },
});
