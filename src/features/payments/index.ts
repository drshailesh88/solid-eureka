// API functions
export {
  createPayment,
  getPaymentsByDate,
  getDailyCollection,
  updatePaymentStatus,
  getPayment,
  getFeeSchedule,
  updateFeeSchedule,
  getFeeByType,
  getPaymentsByPatient
} from './api/payments';

// Components
export { PaymentForm } from './components/payment-form';
export { UPIQRCode } from './components/upi-qr-code';
export { PaymentBadge } from './components/payment-badge';
export { DailyCollectionCard } from './components/daily-collection-card';
export { FeeScheduleSettings } from './components/fee-schedule-settings';
export { QuickCollectButton } from './components/quick-collect-button';
export { VisitPaymentSection } from './components/visit-payment-section';
