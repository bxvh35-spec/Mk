
import { ServiceProvider, PaymentMethod } from './types';

export const SERVICES: ServiceProvider[] = ['PayPal', 'Payoneer', 'Skrill', 'Binance', 'Bybit'];
export const PAYMENT_METHODS: PaymentMethod[] = ['Bkash', 'Nagad', 'Bank'];

export const INITIAL_BUY_RATE = 122.50;
export const INITIAL_SELL_RATE = 118.20;

export const MOCK_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Order Approved',
    message: 'Your PayPal buy request #ORD-8821 has been approved.',
    time: '2 hours ago',
    isRead: false,
    type: 'order' as const
  },
  {
    id: 'n2',
    title: 'Rate Update',
    message: 'Dollar buy rate increased to 122.50 BDT.',
    time: '5 hours ago',
    isRead: true,
    type: 'rate' as const
  }
];

export const MOCK_ORDERS = [
  {
    id: 'ORD-8821',
    type: 'Buy' as const,
    service: 'PayPal' as const,
    usdAmount: 100,
    bdtAmount: 12250,
    rate: 122.5,
    paymentMethod: 'Bkash' as const,
    status: 'Approved' as const,
    date: '2024-05-20 10:30 AM'
  },
  {
    id: 'ORD-7742',
    type: 'Sell' as const,
    service: 'Binance' as const,
    usdAmount: 50,
    bdtAmount: 5910,
    rate: 118.2,
    paymentMethod: 'Nagad' as const,
    status: 'Pending' as const,
    date: '2024-05-21 02:15 PM'
  }
];
