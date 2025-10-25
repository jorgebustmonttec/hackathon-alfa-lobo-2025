// Vistas/InfoCarrito_Seleccion_Back.js
import React, { useEffect, useState, useCallback } from 'react';
import InfoCarrito_Seleccion_Front from './InfoCarrito_Seleccion_Front';

// Simula la búsqueda de los items para una ubicación (cajón) específica
const resolveUbicacion = async (ubicacionId) => {
  // Simula latencia
  await new Promise(r => setTimeout(r, 400));

  // Base de datos estática de todos los cajones
  const base = {
    'A1': {
      id: 'A1',
      items: [
        { sku: 'SKU-COKE-01', cantidad: 15, nombre: 'Coca Cola 600ml', verificado: true },
      ],
    },
    'A2': {
      id: 'A2',
      items: [
        { sku: 'SKU-GANS-01', cantidad: 10, nombre: 'Gansito', verificado: true },
        { sku: 'SKU-CHOK-01', cantidad: 12, nombre: 'Chokis', verificado: false },
      ],
    },
    'A3': { // Este es el de tu mockup
      id: 'A3',
      items: [
        { sku: 'SKU-COKE-02', cantidad: 15, nombre: 'Coca Cola', verificado: false },
        { sku: 'SKU-CIEL-01', cantidad: 3, nombre: 'Agua Ciel', verificado: true },
      ],
    },
    'A4': { id: 'A4', items: [] }, // Un cajón vacío
    'A5': {
      id: 'A5',
      items: [
        { sku: 'SKU-RITO-01', cantidad: 20, nombre: 'Doritos Nacho', verificado: true },
      ],
    },
    'B1': {
      id: 'B1',
      items: [
        { sku: 'SKU-JUMX-01', cantidad: 8, nombre: 'Jumex Mango', verificado: true },
      ],
    },
    'B2': {
      id: 'B2',
      items: [
        { sku: 'SKU-VALLE-01', cantidad: 7, nombre: 'Jugo Del Valle', verificado: false },
      ],
    },
    'B3': {
      id: 'B3',
      items: [
        { sku: 'SKU-REDI-01', cantidad: 5, nombre: 'Red Bull', verificado: true },
      ],
    },
  };

  // si no existe, crea algo básico
  if (!base[ubicacionId]) {
    return {
      id: ubicacionId || 'Error',
      items: [],
    };
  }
  return base[ubicacionId];
};

export default function InfoCarrito_Seleccion_Back({ ubicacionId, onBack }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null); // { id, items[] } (Datos estáticos)
  const [error, setError] = useState('');

  // ▼▼▼ CAMBIO 1: Estado para guardar las selecciones (Sí/No) ▼▼▼
  // Guardará algo como: { 'SKU-COKE-02': false, 'SKU-CIEL-01': true }
  const [verificaciones, setVerificaciones] = useState({});
  // ▲▲▲ FIN CAMBIO 1 ▲▲▲

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const result = await resolveUbicacion(ubicacionId);
      setData(result);

      // ▼▼▼ CAMBIO 2: Inicializar el estado de 'verificaciones' ▼▼▼
      // Usamos los valores 'verificado' de la base como el estado inicial
      const initialState = Object.fromEntries(
        result.items.map(item => [item.sku, item.verificado])
      );
      setVerificaciones(initialState);
      // ▲▲▲ FIN CAMBIO 2 ▲▲▲

    } catch (e) {
      setError(e?.message || 'No fue posible obtener los items.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [ubicacionId]);

  useEffect(() => {
    load();
  }, [load]);

  // ▼▼▼ CAMBIO 3: Función para que el Front actualice el estado ▼▼▼
  const handleToggleVerificacion = (sku, nuevoValor) => {
    setVerificaciones(prevState => ({
      ...prevState,
      [sku]: nuevoValor,
    }));
  };
  // ▲▲▲ FIN CAMBIO 3 ▲▲▲

  const handleConfirm = () => {
    // Ahora podemos ver las selecciones finales del usuario
    console.log("Confirmar selección para:", ubicacionId);
    console.log("Valores seleccionados:", verificaciones); 
  };

  return (
    <InfoCarrito_Seleccion_Front
      loading={loading}
      error={error}
      data={data}
      onBack={onBack}
      onConfirm={handleConfirm}
      // ▼▼▼ CAMBIO 4: Pasar el estado y la función al Front ▼▼▼
      verificaciones={verificaciones}
      onToggleVerificacion={handleToggleVerificacion}
      // ▲▲▲ FIN CAMBIO 4 ▲▲▲
    />
  );
}