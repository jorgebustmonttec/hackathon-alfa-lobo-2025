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
  
  const renderFlightCard = (title, flightInfo, value, icon) => (
    <View style={styles.flightCard}>
      <View style={styles.flightHeader}>
        <Text style={styles.flightIcon}>{icon}</Text>
        <Text style={styles.flightTitle}>{title}</Text>
      </View>
      <Text style={styles.flightInfo}>{flightInfo}</Text>
      
      <TouchableOpacity
        style={[
          styles.selectButton,
          selectedOption === value && styles.selectButtonActive
        ]}
        onPress={() => {
          setTimeout(() => onOptionSelect(value), 0);
        }}
        activeOpacity={0.7}
      >
        <View style={[
          styles.radioCircle,
          selectedOption === value && styles.radioCircleSelected
        ]}>
          {selectedOption === value && <View style={styles.radioInner} />}
        </View>
        <Text style={[
          styles.selectButtonText,
          selectedOption === value && styles.selectButtonTextActive
        ]}>
          Vengo de esta ciudad
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => {
              setTimeout(() => onBack(), 0);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Confirmación de Ciudad</Text>
          <Text style={styles.subtitle}>Selecciona de qué ciudad vienes</Text>
        </View>

        {/* City Cards */}
        <View style={styles.flightsContainer}>
          {renderFlightCard(
            'Ciudad de Origen', 
            ciudadOrigen, 
            'origen',
            '🏙️'
          )}
          
          {renderFlightCard(
            'Ciudad Destino', 
            ciudadDestino, 
            'destino',
            '🌆'
          )}
        </View>

        {/* Selection Status */}
        {hasSelection && (
          <View style={styles.selectionStatus}>
            <Text style={styles.selectionIcon}>✅</Text>
            <Text style={styles.selectionText}>
              Has seleccionado: {selectedOption === 'origen' ? 'Ciudad de Origen' : 'Ciudad Destino'}
            </Text>
          </View>
        )}

        {/* Warning if no selection */}
        {!hasSelection && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              Debes seleccionar una ciudad para continuar
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            hasSelection ? styles.continueButtonActive : styles.continueButtonDisabled
          ]}
          onPress={() => {
            if (hasSelection) {
              setTimeout(() => onContinue(), 0);
            }
          }}
          disabled={!hasSelection}
          activeOpacity={hasSelection ? 0.7 : 1}
        >
          <Text style={[
            styles.continueButtonText,
            hasSelection ? styles.continueButtonTextActive : styles.continueButtonTextDisabled
          ]}>
            {hasSelection ? 'Continuar al Carrito' : 'Selecciona una Ciudad'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e9ecef',
    borderRadius: 20,
    marginBottom: 20,
  },
  backButtonText: {
    color: '#495057',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  flightsContainer: {
    gap: 20,
    paddingBottom: 20,
  },
  flightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  flightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  flightIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  flightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  flightInfo: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 20,
    lineHeight: 24,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dee2e6',
    backgroundColor: '#f8f9fa',
  },
  selectButtonActive: {
    borderColor: '#0d6efd',
    backgroundColor: '#e7f3ff',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#dee2e6',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#0d6efd',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0d6efd',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  selectButtonTextActive: {
    color: '#0d6efd',
  },
  selectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d1edff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  selectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  selectionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0c5aa6',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff3cd',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  warningText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#0d6efd',
  },
  continueButtonDisabled: {
    backgroundColor: '#e9ecef',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  continueButtonTextActive: {
    color: '#ffffff',
  },
  continueButtonTextDisabled: {
    color: '#adb5bd',
  },
});
