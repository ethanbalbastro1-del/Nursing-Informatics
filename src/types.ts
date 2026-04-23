export type MedStatus = 'Due now' | 'Administered' | 'Overdue' | 'Scheduled';

export interface Medication {
  id: string;
  name: string;
  dose: string;
  route: string;
  barcode: string;
  nfcTag?: string;
  time: string;
  frequency: string;
  status: MedStatus;
  administeredAt?: string;
}

export interface Patient {
  id: string;
  name: string;
  room: string;
  nfcId: string;
  diagnoses: string[];
  allergies: string[];
  medications: Medication[];
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  nurseName: string;
  patientName: string;
  medication: string;
  action: string;
  type: 'success' | 'failure' | 'info';
}

export interface Nurse {
  id: string;
  name: string;
  nfcId: string;
  role: string;
}
