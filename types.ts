
export type OrderStatus = 'Pending' | 'Approved' | 'Rejected';
export type ExchangeType = 'Buy' | 'Sell';
export type PaymentMethod = 'Bkash' | 'Nagad' | 'Bank';
export type ServiceProvider = 'PayPal' | 'Payoneer' | 'Skrill' | 'Binance' | 'Bybit';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  totalOrders: number;
  completedOrders: number;
}

export interface Order {
  id: string;
  type: ExchangeType;
  service: ServiceProvider;
  usdAmount: number;
  bdtAmount: number;
  rate: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  date: string;
  screenshot?: string;
  adminNote?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'order' | 'rate' | 'system';
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  orders: Order[];
  notifications: Notification[];
  buyRate: number;
  sellRate: number;
  lastUpdated: string;
}
