// screens/InfoVuelo_Front.js
import React from 'react';
import {
 View, Text, TouchableOpacity, StyleSheet, ScrollView,
 SafeAreaView, ActivityIndicator // Added ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function InfoVuelo_Front({
 ciudadOrigen,
 ciudadDestino,
 selectedOption,
 onOptionSelect,
 onContinue,
 onBack,
 hasSelection,
 isLoading = false, // <-- New prop
}) {

 const OptionRow = ({ label, value, disabled }) => ( // Added disabled prop
  <TouchableOpacity
   style={[
    styles.optionRow,
    selectedOption === value && styles.optionRowActive,
    disabled && styles.optionRowDisabled // Style for disabled
   ]}
   onPress={() => onOptionSelect(value)}
   activeOpacity={disabled ? 1 : 0.7} // No feedback if disabled
   disabled={disabled} // Disable touch
  >
   <View style={[ styles.radioCircle, selectedOption === value && styles.radioCircleSelected ]}>
    {selectedOption === value && <View style={styles.radioInner} />}
   </View>
   <Text style={[ styles.optionText, selectedOption === value && styles.optionTextActive ]}>
    {/* Show ActivityIndicator instead of text if loading */}
    {isLoading ? <ActivityIndicator size="small" color="#adb5bd" /> : label}
   </Text>
  </TouchableOpacity>
 );

 return (
  <SafeAreaView style={styles.container}>
   <StatusBar style="dark" />

   <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
    {/* Header */}
    <View style={styles.header}>
     <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7} disabled={isLoading}>
      <Text style={styles.backButtonText}>← Back</Text>
     </TouchableOpacity>
     <Text style={styles.title}>City Confirmation</Text>
    </View>

    {/* Card */}
    <View style={styles.card}>
     <Text style={styles.cardTitle}>Select the city you are coming from</Text>
     <View style={styles.optionsGroup}>
       {/* Pass isLoading to disable options while fetching */}
      <OptionRow label={ciudadOrigen} value="origen" disabled={isLoading} />
      <OptionRow label={ciudadDestino} value="destino" disabled={isLoading} />
     </View>
    </View>
   </ScrollView>

   {/* Bottom Button */}
   <View style={styles.bottomContainer}>
    <TouchableOpacity
     style={[
      styles.continueButton,
      // Disable appearance if loading OR no selection
      (isLoading || !hasSelection) ? styles.continueButtonDisabled : styles.continueButtonActive
     ]}
     onPress={() => { if (hasSelection) onContinue(); }}
     disabled={isLoading || !hasSelection} // Disable touch if loading or no selection
     activeOpacity={(isLoading || !hasSelection) ? 1 : 0.7}
    >
     <Text style={[ styles.continueButtonText, (isLoading || !hasSelection) ? styles.continueButtonTextDisabled : styles.continueButtonTextActive ]}>
      {isLoading ? 'Loading Flight...' : (hasSelection ? 'Continue to Cart' : 'Select a City')}
     </Text>
    </TouchableOpacity>
   </View>
  </SafeAreaView>
 );
}

// --- Styles ---
const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: '#f8f9fa' },
 scrollView: { flex: 1, paddingHorizontal: 20 },
 header: { paddingTop: 20, paddingBottom: 30 },
 backButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#e9ecef', borderRadius: 20, marginBottom: 20 },
 backButtonText: { color: '#495057', fontWeight: '600' },
 title: { fontSize: 28, fontWeight: '700', color: '#212529', marginBottom: 8, textAlign: 'center' },
 card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 6 },
 cardTitle: { fontSize: 16, fontWeight: '700', color: '#212529', marginBottom: 12 },
 optionsGroup: { gap: 12 },
 optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, borderWidth: 2, borderColor: '#dee2e6', backgroundColor: '#f8f9fa' },
 optionRowActive: { borderColor: '#3F8DD1', backgroundColor: '#e7f3ff' },
 optionRowDisabled: { backgroundColor: '#f1f3f5', borderColor: '#e9ecef' }, // Added disabled style
 radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#adb5bd', marginRight: 12, alignItems: 'center', justifyContent: 'center' }, // Slightly darker border
 radioCircleSelected: { borderColor: '#3F8DD1' },
 radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0d6efd' },
 optionText: { fontSize: 16, fontWeight: '600', color: '#495057' },
 optionTextActive: { color: '#020873' },
 bottomContainer: { paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 8 },
 continueButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
 continueButtonActive: { backgroundColor: '#020873' },
 continueButtonDisabled: { backgroundColor: '#e9ecef' },
 continueButtonText: { fontSize: 18, fontWeight: '700' },
 continueButtonTextActive: { color: '#ffffff' },
 continueButtonTextDisabled: { color: '#adb5bd' },
});