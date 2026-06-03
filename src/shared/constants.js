// --- CONFIGURACIONES GLOBALES (CONSTANTES) ---
var CURRENT_APP_VERSION = 'v113';
var SB_URL = 'https://txnecdeccianklqqyrav.supabase.co';
var SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bmVjZGVjY2lhbmtscXF5cmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDQzMDIsImV4cCI6MjA5MTk4MDMwMn0.e2ybyt2Y8yHsZwRC-MZqi_qK525-CWpk-huQcQy-icM";

// --- MATRIZ DE RANGOS 2026 ---
const MATRIZ_RANGOS = {
  '3-4': [
    { start: 1, end: 10, label: 'Matemáticas' },
    { start: 11, end: 20, label: 'Ciencias Sociales' },
    { start: 21, end: 30, label: 'Lenguaje' },
    { start: 31, end: 40, label: 'Biología' },
    { start: 41, end: 45, label: 'Inglés' }
  ],
  '5': [
    { start: 1, end: 20, label: 'Matemáticas' },
    { start: 21, end: 40, label: 'Ciencias Sociales' },
    { start: 41, end: 60, label: 'Lenguaje' },
    { start: 61, end: 80, label: 'Biología' },
    { start: 81, end: 90, label: 'Inglés' }
  ],
  '6-9': [
    { start: 1, end: 20, label: 'Matemáticas' },
    { start: 21, end: 40, label: 'Competencias Ciudadanas' },
    { start: 41, end: 60, label: 'Ciencias Sociales' },
    { start: 61, end: 80, label: 'Lenguaje' },
    { start: 81, end: 100, label: 'Biología' },
    { start: 101, end: 120, label: 'Inglés' }
  ],
  '10-11': [
    { start: 1, end: 20, label: 'Matemáticas' },
    { start: 21, end: 30, label: 'Competencias Ciudadanas' },
    { start: 31, end: 50, label: 'Ciencias Sociales' },
    { start: 51, end: 70, label: 'Lenguaje' },
    { start: 71, end: 80, label: 'Biología' },
    { start: 81, end: 90, label: 'Física' },
    { start: 91, end: 100, label: 'Química' },
    { start: 101, end: 120, label: 'Inglés' }
  ]
};
