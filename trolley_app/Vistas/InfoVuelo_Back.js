// screens/InfoVuelo_Back.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import InfoVuelo_Front from './InfoVuelo_Front';

const OPTIONS = { ORIGEN: 'origen', DESTINO: 'destino' };

export default function InfoVuelo_Back({ qrData, onBack, onContinue }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [ciudadOrigen, setCiudadOrigen] = useState('');
  const [ciudadDestino, setCiudadDestino] = useState('');

  // Toma ciudades desde el QR (placeholder local). No mostramos alerta si faltan.
  useEffect(() => {
    if (qrData?.data) {
      // Guíate por esta info pequeña que ya tienes:
      setCiudadOrigen('Ciudad de México');
      setCiudadDestino('Miami');
    }
  }, [qrData]);

  const handleOptionSelect = useCallback((option) => {
    if (option === OPTIONS.ORIGEN || option === OPTIONS.DESTINO) {
      setSelectedOption(option);
    } else {
      // Solo control defensivo por si algún touch raro manda algo distinto
      Alert.alert('Opción inválida', 'Selecciona origen o destino.');
    }
  }, []);

  const hasSelection = useMemo(() => !!selectedOption, [selectedOption]);

  const selectedCityInfo = useMemo(() => {
    return selectedOption === OPTIONS.ORIGEN ? ciudadOrigen
         : selectedOption === OPTIONS.DESTINO ? ciudadDestino
         : '';
  }, [selectedOption, ciudadOrigen, ciudadDestino]);

  const handleContinue = useCallback(() => {
    if (!hasSelection) {
      Alert.alert('Selección requerida', 'Por favor selecciona de qué ciudad vienes para continuar.');
      return;
    }
    const flightData = {
      qrData,
      selectedCity: selectedOption,     // 'origen' | 'destino'
      ciudadOrigen,                     // del QR (placeholder)
      ciudadDestino,                    // del QR (placeholder)
      selectedCityInfo                  // nombre de la ciudad elegida
    };
    onContinue?.(flightData);
  }, [hasSelection, selectedOption, ciudadOrigen, ciudadDestino, selectedCityInfo, qrData, onContinue]);

  return (
    <InfoVuelo_Front
      ciudadOrigen={ciudadOrigen}
      ciudadDestino={ciudadDestino}
      selectedOption={selectedOption}
      onOptionSelect={handleOptionSelect}
      onContinue={handleContinue}
      onBack={onBack}
      hasSelection={hasSelection}
    />
  );
}
