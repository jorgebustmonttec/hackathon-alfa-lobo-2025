// Vistas/InfoCarrito_Seleccion_Back.js
import React, { useEffect, useState, useCallback } from 'react';
import InfoCarrito_Seleccion_Front from './InfoCarrito_Seleccion_Front';

// Simula la búsqueda de los items.
// 'cantidad' ahora es la cantidad *sugerida* o *inicial*.
const resolveUbicacion = async (ubicacionId) => {
 // Simula latencia
 await new Promise(r => setTimeout(r, 400));

 // Base de datos estática
 const base = {
  'A1': {
   id: 'A1',
   items: [
    { sku: 'SKU-COKE-01', cantidad: 15, nombre: 'Coca Cola 600ml' },
   ],
  },
  'A2': {
   id: 'A2',
   items: [
    { sku: 'SKU-GANS-01', cantidad: 10, nombre: 'Gansito' },
    { sku: 'SKU-CHOK-01', cantidad: 12, nombre: 'Chokis' },
   ],
  },
  'A3': { // El de tu mockup
   id: 'A3',
   items: [
    { sku: 'SKU-COKE-02', cantidad: 15, nombre: 'Coca Cola' },
    { sku: 'SKU-CIEL-01', cantidad: 3, nombre: 'Agua Ciel' },
   ],
  },
    // ...otros cajones...
  'B1': { id: 'B1', items: [{ sku: 'SKU-JUMX-01', cantidad: 8, nombre: 'Jumex Mango' }] },
  'B2': { id: 'B2', items: [{ sku: 'SKU-VALLE-01', cantidad: 7, nombre: 'Jugo Del Valle' }] },
  'B3': { id: 'B3', items: [{ sku: 'SKU-REDI-01', cantidad: 5, nombre: 'Red Bull' }] },
  'A4': { id: 'A4', items: [] },
 };

 if (!base[ubicacionId]) {
  return { id: ubicacionId || 'Error', items: [] };
 }
  // OJO: Hacemos una copia profunda para no modificar la 'base' original
 return JSON.parse(JSON.stringify(base[ubicacionId]));
};

export default function InfoCarrito_Seleccion_Back({ ubicacionId, onBack }) {
 const [loading, setLoading] = useState(true);
 const [data, setData] = useState(null); // { id, items[] } (Datos estáticos)
 const [error, setError] = useState('');

  // ▼▼▼ NUEVO ESTADO: Almacena las cantidades que el usuario ingresa ▼▼▼
  // Guardará: { 'SKU-COKE-02': '15', 'SKU-CIEL-01': '3' }
 const [cantidades, setCantidades] = useState({});
  // ▲▲▲

 const load = useCallback(async () => {
  try {
   setLoading(true);
   setError('');
   const result = await resolveUbicacion(ubicacionId);
   setData(result);

      // ▼▼▼ INICIALIZAR ESTADO DE CANTIDADES ▼▼▼
      // Usamos los valores 'cantidad' de la base como el estado inicial
      // Los guardamos como string para el TextInput
      const initialCantidades = Object.fromEntries(
        result.items.map(item => [item.sku, item.cantidad.toString()])
      );
      setCantidades(initialCantidades);
      // ▲▲▲

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

  // ▼▼▼ NUEVA FUNCIÓN: Maneja los cambios del TextInput y botones +/- ▼▼▼
  const handleSetCantidad = (sku, valor) => {
    let valorNumerico;
    let valorString;

    // Si 'valor' es un string (del TextInput), limpiarlo.
    if (typeof valor === 'string') {
      valorString = valor.replace(/[^0-9]/g, ''); // Solo enteros positivos
      valorNumerico = parseInt(valorString, 10);
    } else {
      // Si 'valor' es un número (de los botones +/-)
      valorNumerico = valor;
      valorString = valor.toString();
    }

    // No permitir negativos
    if (valorNumerico < 0) {
      valorString = '0';
    }
    
    // Dejar campo vacío si el usuario borró todo (solo desde TextInput)
    if (typeof valor === 'string' && valor === '') {
      valorString = '';
    }

    setCantidades(prevState => ({
      ...prevState,
      [sku]: valorString,
    }));
  };
  // ▲▲▲

  // ▼▼▼ NUEVA LÓGICA: Habilita el botón de confirmar ▼▼▼
  // El botón se deshabilita si CUALQUIER item tiene un campo vacío.
  const isConfirmDisabled = !data?.items || data.items.some(item => {
    const cantidad = cantidades[item.sku];
    return cantidad === undefined || cantidad === ''; // Campo obligatorio
  });
  // ▲▲▲

 const handleConfirm = () => {
  console.log("Confirmar selección para:", ubicacionId);
    console.log("Cantidades finales (como strings):", cantidades);
    // Próximamente: navegar a la siguiente vista
 };

 return (
  <InfoCarrito_Seleccion_Front
   loading={loading}
   error={error}
   data={data}
   onBack={onBack}
   onConfirm={handleConfirm}
      // ▼▼▼ PASAR NUEVAS PROPS AL FRONT ▼▼▼
      cantidades={cantidades}
      onSetCantidad={handleSetCantidad}
      isConfirmDisabled={isConfirmDisabled}
      // ▲▲▲
  />
 );
}