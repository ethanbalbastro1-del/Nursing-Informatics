import { Patient, Nurse, AuditEntry } from './types';

export interface MedInventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  threshold: number;
}

export const mockInventory: MedInventoryItem[] = [
  { id: 'INV-100', name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 1450, threshold: 500 },
  { id: 'INV-101', name: 'Lisinopril 10mg', category: 'Antihypertensive', stock: 820, threshold: 300 },
  { id: 'INV-102', name: 'Metformin 500mg', category: 'Antidiabetic', stock: 120, threshold: 400 },
  { id: 'INV-103', name: 'Epinephrine 1mg', category: 'Emergency', stock: 12, threshold: 20 },
  { id: 'INV-104', name: 'Atorvastatin 20mg', category: 'Statin', stock: 650, threshold: 200 },
  { id: 'INV-105', name: 'Albuterol Sulfate', category: 'Bronchodilator', stock: 45, threshold: 50 },
  { id: 'INV-106', name: 'Ibuprofen 400mg', category: 'NSAID', stock: 2400, threshold: 1000 },
];

export const mockNurses: Nurse[] = [
  { id: 'N1', name: 'Nurse Joy', nfcId: 'S-JOY-123', role: 'Head Nurse' },
  { id: 'N2', name: 'Nurse Florence', nfcId: 'S-FLO-456', role: 'Staff Nurse' },
  { id: 'N3', name: 'Nurse Nightingale', nfcId: 'S-NGT-789', role: 'Staff Nurse' },
];

export const initialPatients: Patient[] = [
  {
    id: 'P1',
    name: 'Juan Dela Cruz',
    room: 'Ward 301-A',
    nfcId: 'SIM-A1B2C3',
    diagnoses: ['Hypertension', 'Type 2 Diabetes'],
    allergies: ['Penicillin'],
    medications: [
      {
        id: 'M1',
        name: 'Amlodipine',
        dose: '5mg',
        route: 'Oral',
        barcode: 'BC-AML-001',
        nfcTag: 'NFC-AML-001',
        time: '08:00',
        frequency: 'Once Daily',
        status: 'Due now',
      },
      {
        id: 'M2',
        name: 'Metformin',
        dose: '500mg',
        route: 'Oral',
        barcode: 'BC-MET-002',
        nfcTag: 'NFC-MET-002',
        time: '12:00',
        frequency: 'Twice Daily',
        status: 'Scheduled',
      },
    ],
  },
  {
    id: 'P2',
    name: 'Maria Santos',
    room: 'Ward 302-B',
    nfcId: 'SIM-X9Y8Z7',
    diagnoses: ['Post-Op Appendectomy'],
    allergies: ['Latex'],
    medications: [
      {
        id: 'M3',
        name: 'Paracetamol',
        dose: '500mg',
        route: 'Oral',
        barcode: 'BC-PAR-003',
        nfcTag: 'NFC-PAR-003',
        time: '08:00',
        frequency: 'Every 4 hours PRN',
        status: 'Due now',
      },
      {
        id: 'M4',
        name: 'Cefuroxime',
        dose: '750mg',
        route: 'IV',
        barcode: 'BC-CEF-004',
        nfcTag: 'NFC-CEF-004',
        time: '10:00',
        frequency: 'Every 12 hours',
        status: 'Scheduled',
      },
    ],
  },
  {
    id: 'P3',
    name: 'Liza Reyes',
    room: 'ICU-105',
    nfcId: 'SIM-M5N6O7',
    diagnoses: ['Pneumonia', 'Asthma'],
    allergies: ['Sulfa Drugs', 'Dust Mites'],
    medications: [
      {
        id: 'M5',
        name: 'Salbutamol Nebule',
        dose: '2.5mg',
        route: 'Inhalation',
        barcode: 'BC-SAL-005',
        nfcTag: 'NFC-SAL-005',
        time: '09:00',
        frequency: 'Every 6 hours',
        status: 'Due now',
      },
      {
        id: 'M6',
        name: 'Levofloxacin',
        dose: '500mg',
        route: 'IV',
        barcode: 'BC-LEV-006',
        nfcTag: 'NFC-LEV-006',
        time: '08:00',
        frequency: 'Once Daily',
        status: 'Overdue',
      },
    ],
  },
];

export const initialAuditLogs: AuditEntry[] = [
  {
    id: 'L1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    nurseName: 'Nurse Joy',
    patientName: 'System',
    medication: 'N/A',
    action: 'Application initialized',
    type: 'info',
  },
];
