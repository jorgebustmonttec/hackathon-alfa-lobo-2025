// Vistas/InfoCarrito_Front.js
import React, { useMemo } from 'react';
import {
 View, Text, StyleSheet, ActivityIndicator, ScrollView,
 TouchableOpacity, SafeAreaView, Platform, StatusBar as RNStatusBar,
} from 'react-native';

export default function InfoCarrito_Front({
 loading,
 error,
 cart,
 onRetry,
 onBack,
 onSelectUbicacion,
 onConfirmCarrito,
 completedLocations, // <-- Receives the Set of completed IDs
}) {

 // Calculate all location IDs from the cart data
 const allLocationIds = useMemo(() => {
  if (!cart?.ubicaciones) return [];
  const a = cart.ubicaciones.columnaA ?? [];
  const b = cart.ubicaciones.columnaB ?? [];
  return [...a, ...b];
 }, [cart?.ubicaciones]);

 // Determine if all locations are marked as complete
 const allLocationsComplete = useMemo(() => {
  if (!allLocationIds.length) return false; // Can't complete if there are no locations
  if (!completedLocations) return false; // Safety check if prop is missing
  return allLocationIds.every(id => completedLocations.has(id));
 }, [allLocationIds, completedLocations]);

 // Handler for location button press
 const handleLocationPress = (id) => {
  // The check for completion is now handled in LogIn_Back
  onSelectUbicacion?.(id);
 };

 // --- Render states ---
 if (loading) {
  return (
   <SafeAreaView style={styles.safe}>
    <View style={styles.center}>
     <ActivityIndicator size="large" color="#0d6efd" />
     <Text style={styles.centerText}>Loading Cart...</Text>
    </View>
   </SafeAreaView>
  );
 }
 if (error || !cart) {
  return (
   <SafeAreaView style={styles.safe}>
    <View style={styles.center}>
     <Text style={styles.errorText}>{error || 'Cart not available'}</Text>
     <TouchableOpacity style={styles.btnPrimary} onPress={onRetry}>
      <Text style={styles.btnPrimaryText}>Retry</Text>
     </TouchableOpacity>
     <TouchableOpacity style={[styles.btnSecondary, { marginTop: 12 }]} onPress={onBack}>
      <Text style={styles.btnSecondaryText}>← Scan Another</Text>
     </TouchableOpacity>
    </View>
   </SafeAreaView>
  );
 }

 // --- Main Render ---
 return (
  <SafeAreaView style={styles.safe}>
   <ScrollView
    style={styles.scroll}
    contentContainerStyle={styles.scrollContent}
    showsVerticalScrollIndicator={false}
   >
    {/* Header Card */}
    <View style={styles.headerCard}>
     <Text style={styles.title}>Cart: {cart.id}</Text>
     {/* Worker/Flight Details ARE displayed */}
     <View style={styles.row}><Text style={styles.metaLabel}>Worker: </Text><Text style={styles.meta}>{cart.trabajadorNombre}</Text></View>
     <View style={styles.row}><Text style={styles.metaLabel}>Worker ID: </Text><Text style={styles.meta}>{cart.trabajadorId}</Text></View>
     <View style={styles.row}><Text style={styles.metaLabel}>Flight Number: </Text><Text style={styles.meta}>{cart.numVuelo}</Text></View>
     <View style={styles.row}><Text style={styles.metaLabel}>Origin: </Text><Text style={styles.meta}>{cart.origen}</Text></View>
     <View style={styles.row}><Text style={styles.metaLabel}>Destination: </Text><Text style={styles.meta}>{cart.destino}</Text></View>
    </View>

    {/* Location Grid */}
    <View style={styles.grid}>
     {/* Column A */}
     <View style={styles.gridCol}>
      {cart.ubicaciones?.columnaA?.map((id) => {
       const isCompleted = completedLocations?.has(id);
       return (
        <TouchableOpacity
         key={id}
         style={[ styles.gridBtn, isCompleted ? styles.gridBtnCompleted : styles.gridBtnDefault ]}
         onPress={() => handleLocationPress(id)}
         activeOpacity={isCompleted ? 1 : 0.7}
         disabled={isCompleted}
        >
         <Text style={[ styles.gridBtnText, isCompleted && styles.gridBtnTextCompleted ]}>{id}</Text>
        </TouchableOpacity>
       );
      })}
     </View>
     {/* Column B */}
     <View style={styles.gridCol}>
       {cart.ubicaciones?.columnaB?.map((id) => {
       const isCompleted = completedLocations?.has(id);
       return (
        <TouchableOpacity
         key={id}
         style={[ styles.gridBtn, isCompleted ? styles.gridBtnCompleted : styles.gridBtnDefault ]}
         onPress={() => handleLocationPress(id)}
         activeOpacity={isCompleted ? 1 : 0.7}
         disabled={isCompleted}
        >
         <Text style={[ styles.gridBtnText, isCompleted && styles.gridBtnTextCompleted ]}>{id}</Text>
        </TouchableOpacity>
       );
      })}
     </View>
    </View>

    {/* Footer Buttons */}
    <View style={styles.footerContainer}>
     <TouchableOpacity style={styles.cancelButton} onPress={onBack} activeOpacity={0.8}>
      <Text style={styles.cancelButtonText}>Cancel</Text>
     </TouchableOpacity>
     <TouchableOpacity
      style={[ styles.confirmButton, allLocationsComplete && styles.confirmButtonEnabled ]}
      onPress={onConfirmCarrito}
      disabled={!allLocationsComplete}
      activeOpacity={0.8}
     >
      <Text style={styles.confirmButtonText}>Confirm Cart</Text>
     </TouchableOpacity>
    </View>
   </ScrollView>
  </SafeAreaView>
 );
}

// --- Styles ---
const styles = StyleSheet.create({
 safe: { flex: 1, backgroundColor: '#f6f7f9', paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 },
 scroll: { flex: 1 },
 scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 28 },
 center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#f6f7f9' },
 centerText: { fontSize: 16, color: '#333', textAlign: 'center' },
 errorText: { color: 'tomato', marginBottom: 12, fontSize: 16, textAlign: 'center' },
 headerCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 3 },
 title: { fontSize: 22, fontWeight: '800', color: '#1f2937', marginBottom: 6 },
 row: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4 },
 metaLabel: { fontSize: 16, color: '#111827', fontWeight: '700' },
 meta: { fontSize: 16, color: '#374151', flexShrink: 1 },
 grid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
 gridCol: { flex: 1 },
 gridBtn: { borderWidth: 1.5, borderRadius: 12, height: 72, alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
 gridBtnDefault: { backgroundColor: '#E0E7FF', borderColor: '#C7D2FE' },
 gridBtnText: { fontSize: 18, fontWeight: '700', color: '#3730A3', letterSpacing: 0.3 },
 gridBtnCompleted: { backgroundColor: '#D1FAE5', borderColor: '#A7F3D0' },
 gridBtnTextCompleted: { color: '#065F46' },
 footerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingHorizontal: 6, gap: 16 },
 cancelButton: { flex: 1, backgroundColor: '#EF4444', paddingVertical: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
 cancelButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
 confirmButton: { flex: 1, backgroundColor: '#A5B4FC', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
 confirmButtonEnabled: { backgroundColor: '#4F46E5', elevation: 2 },
 confirmButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
 btnPrimary: { backgroundColor: '#4F46E5', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10 },
 btnPrimaryText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
 btnSecondary: { backgroundColor: '#6B7280', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10 },
 btnSecondaryText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});