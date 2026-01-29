'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font
} from '@react-pdf/renderer';
import type { Patient, Visit, Prescription, PrescriptionItem } from '@/types/database';

// Register fonts (optional - use system fonts for simplicity)
// Font.register({ family: 'Noto Sans', src: '/fonts/NotoSans-Regular.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #000',
    paddingBottom: 15
  },
  clinicName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  doctorName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2
  },
  qualification: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2
  },
  clinicAddress: {
    fontSize: 9,
    color: '#666'
  },
  patientSection: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5'
  },
  patientRow: {
    flexDirection: 'row',
    marginBottom: 4
  },
  patientLabel: {
    width: 80,
    fontWeight: 'bold'
  },
  patientValue: {
    flex: 1
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15,
    borderBottom: '1 solid #ccc',
    paddingBottom: 4
  },
  rxSymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  medicationTable: {
    marginTop: 10
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    padding: 6,
    fontWeight: 'bold',
    fontSize: 10
  },
  tableRow: {
    flexDirection: 'row',
    padding: 6,
    borderBottom: '1 solid #eee'
  },
  colSerial: { width: '5%' },
  colMedicine: { width: '30%' },
  colDose: { width: '15%' },
  colFrequency: { width: '20%' },
  colDuration: { width: '15%' },
  colInstructions: { width: '15%' },
  hindiText: {
    fontSize: 9,
    color: '#666',
    marginTop: 2
  },
  diagnosis: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#fff9e6',
    borderLeft: '3 solid #f0c000'
  },
  diagnosisLabel: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  advice: {
    marginTop: 15
  },
  adviceText: {
    fontSize: 10,
    lineHeight: 1.5
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: '1 solid #ccc',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  signature: {
    textAlign: 'right'
  },
  signatureLine: {
    marginTop: 30,
    borderTop: '1 solid #000',
    width: 150,
    paddingTop: 4
  },
  date: {
    fontSize: 10,
    color: '#666'
  }
});

interface PrescriptionPDFProps {
  patient: Patient;
  visit: Visit;
  prescription: Prescription;
  items: PrescriptionItem[];
  doctorName?: string;
  qualification?: string;
  clinicName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
}

export function PrescriptionPDF({
  patient,
  visit,
  prescription,
  items,
  doctorName = 'Dr. Doctor Name',
  qualification = 'MBBS, MD',
  clinicName = 'Clinic Name',
  clinicAddress = 'Clinic Address',
  clinicPhone = ''
}: PrescriptionPDFProps) {
  const visitDate = new Date(visit.visit_date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.clinicName}>{clinicName}</Text>
          <Text style={styles.doctorName}>{doctorName}</Text>
          <Text style={styles.qualification}>{qualification}</Text>
          <Text style={styles.clinicAddress}>
            {clinicAddress} {clinicPhone && `| ${clinicPhone}`}
          </Text>
        </View>

        {/* Patient Info */}
        <View style={styles.patientSection}>
          <View style={styles.patientRow}>
            <Text style={styles.patientLabel}>Patient:</Text>
            <Text style={styles.patientValue}>
              {patient.first_name} {patient.last_name || ''}
            </Text>
            <Text style={styles.patientLabel}>UHID:</Text>
            <Text style={styles.patientValue}>{patient.uhid}</Text>
          </View>
          <View style={styles.patientRow}>
            <Text style={styles.patientLabel}>Age/Sex:</Text>
            <Text style={styles.patientValue}>
              {patient.age ? `${patient.age} years` : '-'} / {patient.sex?.charAt(0).toUpperCase() || '-'}
            </Text>
            <Text style={styles.patientLabel}>Date:</Text>
            <Text style={styles.patientValue}>{visitDate}</Text>
          </View>
          {patient.phone && (
            <View style={styles.patientRow}>
              <Text style={styles.patientLabel}>Phone:</Text>
              <Text style={styles.patientValue}>{patient.phone}</Text>
            </View>
          )}
        </View>

        {/* Diagnosis */}
        {visit.diagnosis && (
          <View style={styles.diagnosis}>
            <Text style={styles.diagnosisLabel}>Diagnosis:</Text>
            <Text>{visit.diagnosis}</Text>
          </View>
        )}

        {/* Prescription */}
        <Text style={styles.rxSymbol}>℞</Text>

        <View style={styles.medicationTable}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.colSerial}>#</Text>
            <Text style={styles.colMedicine}>Medicine</Text>
            <Text style={styles.colDose}>Dose</Text>
            <Text style={styles.colFrequency}>Frequency</Text>
            <Text style={styles.colDuration}>Duration</Text>
            <Text style={styles.colInstructions}>Instructions</Text>
          </View>

          {/* Table Rows */}
          {items.map((item, index) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.colSerial}>{index + 1}</Text>
              <View style={styles.colMedicine}>
                <Text>{item.brand}</Text>
                {item.salt && (
                  <Text style={styles.hindiText}>({item.salt})</Text>
                )}
              </View>
              <Text style={styles.colDose}>{item.dose || '-'}</Text>
              <View style={styles.colFrequency}>
                <Text>{item.pattern || item.frequency || '-'}</Text>
                {item.instructions_hindi && (
                  <Text style={styles.hindiText}>{item.instructions_hindi}</Text>
                )}
              </View>
              <Text style={styles.colDuration}>{item.duration || '-'}</Text>
              <Text style={styles.colInstructions}>{item.instructions || '-'}</Text>
            </View>
          ))}
        </View>

        {/* Advice */}
        {visit.plan && (
          <View style={styles.advice}>
            <Text style={styles.sectionTitle}>Advice</Text>
            <Text style={styles.adviceText}>{visit.plan}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.date}>Generated on: {new Date().toLocaleDateString('en-IN')}</Text>
          </View>
          <View style={styles.signature}>
            <View style={styles.signatureLine}>
              <Text>{doctorName}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
