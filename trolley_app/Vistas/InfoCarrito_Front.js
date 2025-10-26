// Vistas/InfoCarrito_Front.js
import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';

export default function InfoCarrito_Front({
  loading,
  error,
  cart,
  onRetry,
  onBack,
  onSelectUbicacion,
  onConfirmCarrito, // <-- el back provee la función real
}) {
  const [completed, setCompleted] = useState(() => new Set());

  const allIds = useMemo(() => {
    const a = cart?.ubicaciones?.columnaA ?? [];
    const b = cart?.ubicaciones?.columnaB ?? [];
    return [...a, ...b];
  }, [cart]);

  const carritoCompleto = useMemo(() => {
    if (!allIds.length) return false;
    for (const id of allIds) {
      if (!completed.has(id)) return false;
    }
    return true;
  }, [allIds, completed]);

  const toggleUbicacion = useCallback(
    (id) => {
      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      onSelectUbicacion?.(id);
    },
    [onSelectUbicacion]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>Cargando carrito...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !cart) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={{ color: 'tomato', marginBottom: 12 }}>
            {error || 'Carrito no disponible'}
          </Text>
          <TouchableOpacity style={styles.btnPrimary} onPress={onRetry}>
            <Text style={styles.btnPrimaryText}>Reintentar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnSecondary, { marginTop: 12 }]}
            onPress={onBack}
          >
            <Text style={styles.btnSecondaryText}>← Escanear otro</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card encabezado */}
        <View style={styles.headerCard}>
          <Text style={styles.title}>Carrito: {cart.id}</Text>

          {/* === CAMPOS NUEVOS DEL BACK (solo visual) === */}
          <View style={styles.row}>
            <Text style={styles.metaLabel}>Trabajador: </Text>
            <Text style={styles.meta}>{cart.trabajadorNombre}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.metaLabel}>ID Trabajador: </Text>
            <Text style={styles.meta}>{cart.trabajadorId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.metaLabel}>Num. de vuelo: </Text>
            <Text style={styles.meta}>{cart.numVuelo}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.metaLabel}>Origen: </Text>
            <Text style={styles.meta}>{cart.origen}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.metaLabel}>Destino: </Text>
            <Text style={styles.meta}>{cart.destino}</Text>
          </View>
        </View>

        {/* Grid de ubicaciones */}
        <View style={styles.grid}>
          {/* Columna A */}
          <View style={styles.gridCol}>
            {cart.ubicaciones?.columnaA?.map((id) => {
              const isDone = completed.has(id);
              return (
                <TouchableOpacity
                  key={id}
                  style={[
                    styles.gridBtn,
                    isDone ? styles.gridBtnActive : styles.gridBtnDefault,
                  ]}
                  onPress={() => toggleUbicacion(id)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.gridBtnText,
                      isDone && styles.gridBtnTextActive,
                    ]}
                  >
                    {id}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Columna B */}
          <View style={styles.gridCol}>
            {cart.ubicaciones?.columnaB?.map((id) => {
              const isDone = completed.has(id);
              return (
                <TouchableOpacity
                  key={id}
                  style={[
                    styles.gridBtn,
                    isDone ? styles.gridBtnActive : styles.gridBtnDefault,
                  ]}
                  onPress={() => toggleUbicacion(id)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.gridBtnText,
                      isDone && styles.gridBtnTextActive,
                    ]}
                  >
                    {id}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Botones inferiores */}
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              carritoCompleto && styles.confirmButtonComplete,
            ]}
            onPress={() => onConfirmCarrito?.()}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>Confirmar carrito</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ====== ESTILOS ====== */
const PAGE_PADDING_H = 16;
const CARD_RADIUS = 14;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f6f7f9',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: PAGE_PADDING_H,
    paddingTop: 16,
    paddingBottom: 28,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f6f7f9',
  },

  headerCard: {
    backgroundColor: '#fff',
    borderRadius: CARD_RADIUS,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 6,
  },
  meta: { fontSize: 16, color: '#374151', marginTop: 2 },
  metaSmall: { fontSize: 12, color: '#6b7280', marginTop: 4 },

  // NUEVOS estilos mínimos para filas en el card
  row: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4 },
  metaLabel: { fontSize: 16, color: '#111827', fontWeight: '700' },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4b5563',
    marginBottom: 10,
    marginLeft: 2,
  },

  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  gridCol: { flex: 1 },

  gridBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  gridBtnDefault: { backgroundColor: '#a3c9eaff', borderColor: '#a0a7c9ff' },
  gridBtnActive: { backgroundColor: '#2563EB', borderColor: '#1E3A8A' },
  gridBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
    letterSpacing: 0.3,
  },
  gridBtnTextActive: { color: '#FFFFFF' },

  btnPrimary: {
    backgroundColor: '#0d6efd',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  btnPrimaryText: { color: '#fff', fontWeight: '800', textAlign: 'center' },

  btnSecondary: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  btnSecondaryText: { color: '#fff', fontWeight: '800', textAlign: 'center' },

  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 6,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    paddingVertical: 16,
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: { color: '#fff', fontWeight: '800', fontSize: 16 },

  confirmButton: {
    flex: 1,
    backgroundColor: '#78b2f8ff',
    paddingVertical: 16,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  confirmButtonComplete: { backgroundColor: '#0d6efd' },
  confirmButtonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
