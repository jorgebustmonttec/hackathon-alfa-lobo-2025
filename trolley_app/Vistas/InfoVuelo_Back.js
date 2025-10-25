// screens/InfoVuelo_Back.js
import React, { useState } from 'react';
import { Alert } from 'react-native';
import InfoVuelo_Front from './InfoVuelo_Front';

export default function InfoVuelo_Back({ 
  qrData, 
  onBack, 
  onContinue 
}) {
  const [selectedOption, setSelectedOption] = useState('');
  const [ciudadOrigen, setCiudadOrigen] = useState('');
  const [ciudadDestino, setCiudadDestino] = useState('');

  // Procesar datos del QR para extraer información de ciudades
  React.useEffect(() => {
    if (qrData?.data) {
      // Simular datos de ciudades basados en el QR
      setCiudadOrigen('Ciudad de México');
      setCiudadDestino('Miami');
    }
  }, [qrData]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (!selectedOption) {
      Alert.alert(
        'Selección Requerida',
        'Por favor selecciona de qué ciudad vienes para continuar.',
        [{ 
          text: 'OK',
          onPress: () => {} // Callback vacío para evitar problemas
        }]
      );
      return;
    }

    const flightData = {
      qrData,
      selectedCity: selectedOption,
      ciudadOrigen: ciudadOrigen,
      ciudadDestino: ciudadDestino,
      selectedCityInfo: selectedOption === 'origen' ? ciudadOrigen : ciudadDestino
    };

    // Ejecutar inmediatamente sin delay
    setTimeout(() => {
      onContinue?.(flightData);
    }, 0);
  };

  return (
    <InfoVuelo_Front
      ciudadOrigen={ciudadOrigen}
      ciudadDestino={ciudadDestino}
      selectedOption={selectedOption}
      onOptionSelect={handleOptionSelect}
      onContinue={handleContinue}
      onBack={onBack}
      hasSelection={!!selectedOption}
    />
  );
}
