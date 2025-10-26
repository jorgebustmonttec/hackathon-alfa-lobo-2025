// screens/InfoVuelo_Front.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function InfoVuelo_Front({
  ciudadOrigen,           // string
  ciudadDestino,          // string
  selectedOption,         // 'origen' | 'destino' | ''
  onOptionSelect,         // (option: string) => void
  onContinue,             // () => void
  onBack,                 // () => void
  hasSelection,           // boolean
}) {

  const OptionRow = ({ label, value }) => (
    <TouchableOpacity
      style={[
        styles.optionRow,
        selectedOption === value && styles.optionRowActive
      ]}
      onPress={() => onOptionSelect(value)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.radioCircle,
          selectedOption === value && styles.radioCircleSelected
        ]}
      >
        {selectedOption === value && <View style={styles.radioInner} />}
      </View>
      <Text
        style={[
          styles.optionText,
          selectedOption === value && styles.optionTextActive
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>City Confirmation</Text>
        </View>

        {/* ÚNICO CUADRO */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Select the city you are coming from</Text>

          <View style={styles.optionsGroup}>
            <OptionRow label={ciudadOrigen} value="origen" />
            <OptionRow label={ciudadDestino} value="destino" />
          </View>
        </View>
      </ScrollView>

      {/* Botón inferior */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            hasSelection ? styles.continueButtonActive : styles.continueButtonDisabled
          ]}
          onPress={() => {
            if (hasSelection) onContinue();
          }}
          disabled={!hasSelection}
          activeOpacity={hasSelection ? 0.7 : 1}
        >
          <Text
            style={[
              styles.continueButtonText,
              hasSelection ? styles.continueButtonTextActive : styles.continueButtonTextDisabled
            ]}
          >
            {hasSelection ? 'Continue to Cart' : 'Select a City'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollView: { flex: 1, paddingHorizontal: 20 },

  header: { paddingTop: 20, paddingBottom: 30 },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e9ecef',
    borderRadius: 20,
    marginBottom: 20,
  },
  backButtonText: { color: '#495057', fontWeight: '600' },
  title: {
    fontSize: 28, fontWeight: '700', color: '#212529',
    marginBottom: 8, textAlign: 'center'
  },
  subtitle: { fontSize: 16, color: '#6c757d', textAlign: 'center' },

  // Card con sombra
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 12,
  },

  optionsGroup: { gap: 12 },

  // Fila de opción con botón circular
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dee2e6',
    backgroundColor: '#f8f9fa',
  },
  optionRowActive: {
    borderColor: '#3F8DD1',
    backgroundColor: '#e7f3ff',
  },
  radioCircle: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: '#dee2e6',
    marginRight: 12, alignItems: 'center', justifyContent: 'center',
  },
  radioCircleSelected: { borderColor: '#3F8DD1' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0d6efd' },

  optionText: { fontSize: 16, fontWeight: '600', color: '#495057' },
  optionTextActive: { color: '#020873' },

  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  continueButtonActive: { backgroundColor: '#020873' },
  continueButtonDisabled: { backgroundColor: '#e9ecef' },
  continueButtonText: { fontSize: 18, fontWeight: '700' },
  continueButtonTextActive: { color: '#ffffff' },
  continueButtonTextDisabled: { color: '#adb5bd' },
});
