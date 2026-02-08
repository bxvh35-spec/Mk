
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home, 
  History, 
  Bell, 
  User as UserIcon, 
  PlusCircle, 
  ChevronLeft, 
  LogOut, 
  Settings as SettingsIcon,
  CheckCircle2,
  Clock,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Smartphone,
  Mail,
  Lock,
  MessageCircle,
  Globe,
  Camera,
  ArrowRightLeft,
  ChevronRight
} from 'lucide-react';
import { 
  User, 
  Order, 
  Notification as AppNotification, 
  ExchangeType, 
  ServiceProvider, 
  PaymentMethod,
  OrderStatus
} from './types';
import { 
  SERVICES, 
  PAYMENT_METHODS, 
  INITIAL_BUY_RATE, 
  INITIAL_SELL_RATE, 
  MOCK_ORDERS, 
  MOCK_NOTIFICATIONS 
} from './constants';

// --- Components ---

const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}> = ({ children, onClick, variant = 'primary', fullWidth, disabled, className = '', type = 'button' }) => {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
    secondary: "bg-slate-800 text-white hover:bg-slate-900",
    outline: "border-2 border-slate-200 text-slate-700 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const Input: React.FC<{
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
  error?: string;
}> = ({ label, type = 'text', placeholder, value, onChange, icon, error }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-sm font-medium text-slate-700 ml-1">{label}</label>
    <div className="relative group">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500">{icon}</div>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:outline-none transition-colors ${error ? 'border-red-500' : ''}`}
      />
    </div>
    {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
  </div>
);

const Navbar: React.FC<{ currentTab: string; setTab: (t: string) => void }> = ({ currentTab, setTab }) => {
  const tabs = [
    { id: 'dashboard', icon: <Home size={22} />, label: 'Home' },
    { id: 'history', icon: <History size={22} />, label: 'Orders' },
    { id: 'form', icon: <PlusCircle size={32} className="text-blue-600 mb-1" />, label: 'Exchange' },
    { id: 'notifications', icon: <Bell size={22} />, label: 'Alerts' },
    { id: 'profile', icon: <UserIcon size={22} />, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.03)] flex justify-around items-end h-20 px-2 z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setTab(tab.id)}
          className={`flex flex-col items-center justify-center py-2 px-1 transition-all ${
            currentTab === tab.id ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          {tab.icon}
          <span className={`text-[10px] font-medium mt-1 ${tab.id === 'form' ? 'mb-1' : ''}`}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('login'); // login, signup, otp, dashboard, form, confirmation, details, edit-profile, change-password, support, settings
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [formType, setFormType] = useState<ExchangeType>('Buy');
  const [buyRate] = useState(INITIAL_BUY_RATE);
  const [sellRate] = useState(INITIAL_SELL_RATE);

  // Transitions
  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setCurrentPage(tab);
  };

  // Auth States
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [otp, setOtp] = useState('');

  // Form States
  const [service, setService] = useState<ServiceProvider>(SERVICES[0]);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PAYMENT_METHODS[0]);

  // Handle Login
  const handleLogin = () => {
    // Basic mock login
    if (loginPhone.length > 5) {
      setUser({
        id: 'u123',
        name: 'John Doe',
        email: 'john@example.com',
        phone: loginPhone,
        isVerified: true,
        totalOrders: 5,
        completedOrders: 3
      });
      setIsAuthenticated(true);
      navigateTo('dashboard');
      setCurrentTab('dashboard');
    }
  };

  const handleOrderSubmit = () => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      type: formType,
      service: service,
      usdAmount: parseFloat(amount),
      bdtAmount: parseFloat(amount) * (formType === 'Buy' ? buyRate : sellRate),
      rate: formType === 'Buy' ? buyRate : sellRate,
      paymentMethod: paymentMethod,
      status: 'Pending',
      date: new Date().toLocaleString(),
    };
    setOrders([newOrder, ...orders]);
    setSelectedOrder(newOrder);
    navigateTo('confirmation');
  };

  // --- Screens ---

  const LoginScreen = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col px-6 pt-20 pb-10">
      <div className="mb-10 text-center">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
          <ArrowRightLeft size={40} className="text-white -rotate-3" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
        <p className="text-slate-500">Login to manage your dollar exchange securely</p>
      </div>

      <div className="space-y-5">
        <Input 
          label="Phone Number" 
          placeholder="+880 1XXX XXXXXX" 
          value={loginPhone} 
          onChange={setLoginPhone} 
          icon={<Smartphone size={20} />} 
        />
        <Input 
          label="Password" 
          type="password" 
          placeholder="••••••••" 
          value={loginPass} 
          onChange={setLoginPass} 
          icon={<Lock size={20} />} 
        />
        
        <div className="flex justify-end">
          <button className="text-sm font-semibold text-blue-600">Forgot Password?</button>
        </div>

        <Button fullWidth onClick={handleLogin}>Login</Button>
        <Button fullWidth variant="outline" onClick={() => navigateTo('signup')}>Login with OTP</Button>
      </div>

      <div className="mt-auto text-center pt-8">
        <p className="text-slate-500">
          Don't have an account? {' '}
          <button onClick={() => navigateTo('signup')} className="font-bold text-blue-600">Create New Account</button>
        </p>
      </div>
    </div>
  );

  const SignUpScreen = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col px-6 pt-12 pb-10">
      <button onClick={() => navigateTo('login')} className="p-2 -ml-2 mb-6 w-fit text-slate-600">
        <ChevronLeft size={24} />
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
        <p className="text-slate-500">Start your currency exchange journey</p>
      </div>

      <div className="space-y-4">
        <Input label="Full Name" placeholder="Enter your name" value="" onChange={() => {}} icon={<UserIcon size={20} />} />
        <Input label="Phone Number" placeholder="+880 1XXX XXXXXX" value="" onChange={() => {}} icon={<Smartphone size={20} />} />
        <Input label="Email Address" placeholder="name@email.com" value="" onChange={() => {}} icon={<Mail size={20} />} />
        <Input label="Password" type="password" placeholder="Create password" value="" onChange={() => {}} icon={<Lock size={20} />} />
        <Input label="Confirm Password" type="password" placeholder="Repeat password" value="" onChange={() => {}} icon={<Lock size={20} />} />

        <div className="flex items-start gap-3 py-2">
          <input type="checkbox" id="terms" className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
          <label htmlFor="terms" className="text-sm text-slate-500 leading-tight">
            I agree to the <span className="text-blue-600 font-medium">Terms & Conditions</span> and <span className="text-blue-600 font-medium">Privacy Policy</span>
          </label>
        </div>

        <Button fullWidth onClick={() => navigateTo('otp')}>Create Account</Button>
      </div>
    </div>
  );

  const OTPScreen = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col px-6 pt-20 pb-10 text-center">
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShieldCheck size={32} />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Verify Phone</h1>
      <p className="text-slate-500 mb-8">We sent a 6-digit verification code to your phone number <span className="font-bold text-slate-900">+880 1712-XXXXXX</span></p>

      <div className="flex justify-between gap-3 mb-10">
        {[1,2,3,4,5,6].map(i => (
          <input key={i} type="text" maxLength={1} className="w-full h-14 bg-white border-2 border-slate-100 rounded-xl text-center text-xl font-bold focus:border-blue-500 focus:outline-none" />
        ))}
      </div>

      <div className="space-y-4">
        <Button fullWidth onClick={handleLogin}>Verify & Continue</Button>
        <button className="text-sm font-semibold text-blue-600">Resend Code (45s)</button>
      </div>
    </div>
  );

  const DashboardScreen = () => (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-blue-600 pt-12 pb-24 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-20 -mt-20 opacity-30"></div>
        <div className="relative flex justify-between items-center mb-6">
          <div className="text-white">
            <h2 className="text-lg opacity-80">Hello,</h2>
            <p className="text-2xl font-bold">{user?.name}</p>
          </div>
          <button onClick={() => navigateTo('notifications')} className="relative p-2 bg-blue-500/30 rounded-xl text-white">
            <Bell size={24} />
            {notifications.some(n => !n.isRead) && <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-blue-600"></div>}
          </button>
        </div>
        
        {/* Live Rates Card */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 text-white">
            <span className="text-xs uppercase font-bold tracking-wider opacity-60">Buy Rate</span>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-2xl font-bold">৳{buyRate.toFixed(2)}</span>
            </div>
            <p className="text-[10px] mt-2 opacity-60 flex items-center gap-1">
              <Clock size={10} /> Last updated: 5m ago
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 text-white">
            <span className="text-xs uppercase font-bold tracking-wider opacity-60">Sell Rate</span>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-2xl font-bold">৳{sellRate.toFixed(2)}</span>
            </div>
            <p className="text-[10px] mt-2 opacity-60 flex items-center gap-1">
              <Clock size={10} /> Last updated: 5m ago
            </p>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="px-6 -mt-10">
        <div className="bg-white p-6 rounded-3xl shadow-xl flex gap-4">
          <button 
            onClick={() => { setFormType('Buy'); navigateTo('form'); }}
            className="flex-1 flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105">
              <PlusCircle size={28} />
            </div>
            <span className="text-sm font-bold text-slate-700">Buy Dollar</span>
          </button>
          <div className="w-px bg-slate-100 my-2"></div>
          <button 
            onClick={() => { setFormType('Sell'); navigateTo('form'); }}
            className="flex-1 flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105">
              <ArrowRightLeft size={28} />
            </div>
            <span className="text-sm font-bold text-slate-700">Sell Dollar</span>
          </button>
          <div className="w-px bg-slate-100 my-2"></div>
          <button 
            onClick={() => handleTabChange('history')}
            className="flex-1 flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105">
              <History size={28} />
            </div>
            <span className="text-sm font-bold text-slate-700">History</span>
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="px-6 mt-10">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="font-bold text-slate-900 text-lg">Recent Orders</h3>
          <button onClick={() => handleTabChange('history')} className="text-sm font-bold text-blue-600">See All</button>
        </div>
        
        <div className="space-y-4">
          {orders.slice(0, 3).map((order) => (
            <div 
              key={order.id} 
              onClick={() => { setSelectedOrder(order); navigateTo('details'); }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 active:scale-[0.98] transition-all"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                order.type === 'Buy' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
              }`}>
                {order.type === 'Buy' ? <PlusCircle size={24} /> : <ArrowRightLeft size={24} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-slate-900">{order.service}</span>
                  <span className="text-sm font-bold">${order.usdAmount}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">{order.date}</span>
                  <span className={`font-medium ${
                    order.status === 'Approved' ? 'text-emerald-600' : 
                    order.status === 'Pending' ? 'text-blue-600' : 'text-red-600'
                  }`}>{order.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const RequestFormScreen = () => {
    const calculatedAmount = amount ? (parseFloat(amount) * (formType === 'Buy' ? buyRate : sellRate)).toFixed(2) : '0.00';
    
    return (
      <div className="pb-28">
        <div className="bg-white pt-12 pb-6 px-6 sticky top-0 z-40 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <button onClick={() => navigateTo('dashboard')} className="p-2 -ml-2 text-slate-600">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-900">{formType} USD</h1>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Type Selector Toggle */}
          <div className="bg-slate-100 p-1.5 rounded-2xl flex">
            <button 
              onClick={() => setFormType('Buy')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${formType === 'Buy' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              Buy USD
            </button>
            <button 
              onClick={() => setFormType('Sell')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${formType === 'Sell' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}
            >
              Sell USD
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 ml-1">Select Service</label>
              <div className="grid grid-cols-2 gap-3">
                {SERVICES.map(s => (
                  <button 
                    key={s} 
                    onClick={() => setService(s)}
                    className={`py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all ${service === s ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 bg-white text-slate-600'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-2">
              <div className="flex justify-between items-center text-sm font-medium text-blue-800">
                <span>Current Rate</span>
                <span>1 USD = {formType === 'Buy' ? buyRate : sellRate} BDT</span>
              </div>
            </div>

            <Input 
              label="Amount in USD" 
              placeholder="0.00" 
              value={amount} 
              onChange={setAmount} 
              type="number"
              icon={<span className="font-bold">$</span>}
            />

            <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">You {formType === 'Buy' ? 'Pay' : 'Receive'}</span>
                <span className="text-xl font-black text-slate-900">৳{calculatedAmount}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 ml-1">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {PAYMENT_METHODS.map(m => (
                  <button 
                    key={m} 
                    onClick={() => setPaymentMethod(m)}
                    className={`py-3 rounded-xl text-xs font-bold border-2 transition-all ${paymentMethod === m ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 bg-white text-slate-600'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 ml-1">Payment Screenshot</label>
              <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-400 bg-white group hover:border-blue-300 transition-all">
                <Camera size={32} className="mb-2" />
                <span className="text-sm font-medium">Upload Payment Proof</span>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <p className="text-[10px] text-slate-400 text-center">Supported: JPG, PNG (Max 5MB)</p>
            </div>

            <Button fullWidth className="mt-4" onClick={handleOrderSubmit}>Submit {formType} Request</Button>
          </div>
        </div>
      </div>
    );
  };

  const ConfirmationScreen = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col px-6 pt-20 pb-10 text-center">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
        <CheckCircle2 size={56} />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-3">Order Submitted!</h1>
      <p className="text-slate-500 mb-10 px-6">Your request has been submitted successfully. Our team will review it shortly.</p>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-10 text-left space-y-4">
        <div className="flex justify-between items-center border-b border-slate-50 pb-3">
          <span className="text-slate-400 text-sm">Order ID</span>
          <span className="font-bold text-slate-900">{selectedOrder?.id}</span>
        </div>
        <div className="flex justify-between items-center border-b border-slate-50 pb-3">
          <span className="text-slate-400 text-sm">Service</span>
          <span className="font-bold text-slate-900">{selectedOrder?.service}</span>
        </div>
        <div className="flex justify-between items-center border-b border-slate-50 pb-3">
          <span className="text-slate-400 text-sm">Amount</span>
          <span className="font-bold text-slate-900">${selectedOrder?.usdAmount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Status</span>
          <span className="font-bold text-blue-600 px-3 py-1 bg-blue-50 rounded-full text-xs">Pending</span>
        </div>
      </div>

      <div className="space-y-4">
        <Button fullWidth onClick={() => navigateTo('details')}>View Order Details</Button>
        <Button fullWidth variant="outline" onClick={() => { setCurrentTab('dashboard'); navigateTo('dashboard'); }}>Back to Dashboard</Button>
      </div>
    </div>
  );

  const HistoryScreen = () => {
    const [filter, setFilter] = useState<string>('All');
    const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

    return (
      <div className="pb-24">
        <div className="bg-white pt-12 pb-4 px-6 sticky top-0 z-40 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Order History</h1>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {['All', 'Pending', 'Approved', 'Rejected'].map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  filter === t ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <History size={32} />
              </div>
              <p className="text-slate-400 font-medium">No {filter !== 'All' ? filter.toLowerCase() : ''} orders found</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div 
                key={order.id} 
                onClick={() => { setSelectedOrder(order); navigateTo('details'); }}
                className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 active:scale-[0.98] transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  order.type === 'Buy' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  {order.type === 'Buy' ? <PlusCircle size={28} /> : <ArrowRightLeft size={28} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-bold text-slate-900">{order.service}</h4>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{order.id}</p>
                    </div>
                    <span className="font-black text-slate-900">${order.usdAmount}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[11px] text-slate-400">{order.date}</span>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-lg ${
                      order.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                      order.status === 'Pending' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                    }`}>{order.status}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const DetailsScreen = () => {
    if (!selectedOrder) return null;

    return (
      <div className="pb-28">
        <div className="bg-white pt-12 pb-6 px-6 sticky top-0 z-40 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigateTo('history')} className="p-2 -ml-2 text-slate-600">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-900">Order Details</h1>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            selectedOrder.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
            selectedOrder.status === 'Pending' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
          }`}>{selectedOrder.status}</span>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6 space-y-6">
            <div className="flex flex-col items-center py-4 border-b border-slate-50">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-4 ${
                selectedOrder.type === 'Buy' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {selectedOrder.type === 'Buy' ? <PlusCircle size={40} /> : <ArrowRightLeft size={40} />}
              </div>
              <h2 className="text-2xl font-black text-slate-900">${selectedOrder.usdAmount}</h2>
              <p className="text-slate-400 font-medium">Order ID: {selectedOrder.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Service</p>
                <p className="font-bold text-slate-800">{selectedOrder.service}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Exchange Type</p>
                <p className="font-bold text-slate-800">{selectedOrder.type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Rate Applied</p>
                <p className="font-bold text-slate-800">৳{selectedOrder.rate.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Total BDT</p>
                <p className="font-bold text-slate-800">৳{selectedOrder.bdtAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Payment Method</p>
                <p className="font-bold text-slate-800">{selectedOrder.paymentMethod}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Date & Time</p>
                <p className="font-bold text-slate-800">{selectedOrder.date}</p>
              </div>
            </div>

            {selectedOrder.adminNote && (
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100 mt-4">
                <p className="text-xs font-bold text-red-700 mb-1">Admin Note</p>
                <p className="text-sm text-red-600 font-medium">{selectedOrder.adminNote}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Button fullWidth onClick={() => navigateTo('support')} variant="secondary" className="bg-slate-100 !text-slate-800 border-2 border-slate-200">
              <MessageCircle size={20} /> Contact Support
            </Button>
            <Button fullWidth onClick={() => navigateTo('history')} variant="outline">
              Back to History
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const NotificationsScreen = () => (
    <div className="pb-24">
      <div className="bg-white pt-12 pb-6 px-6 sticky top-0 z-40 border-b border-slate-100 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <button className="text-sm font-bold text-blue-600">Clear All</button>
      </div>

      <div className="p-4 space-y-3">
        {notifications.map(n => (
          <div key={n.id} className={`p-4 rounded-3xl border transition-all ${n.isRead ? 'bg-white border-slate-100' : 'bg-blue-50/50 border-blue-100 shadow-sm'}`}>
            <div className="flex gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                n.type === 'order' ? 'bg-emerald-100 text-emerald-600' : 
                n.type === 'rate' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {n.type === 'order' ? <CheckCircle2 size={24} /> : n.type === 'rate' ? <ArrowRightLeft size={24} /> : <Bell size={24} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{n.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ProfileScreen = () => (
    <div className="pb-24">
      <div className="bg-blue-600 pt-16 pb-32 px-6 rounded-b-[40px] text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-10 -mt-10"></div>
        <div className="relative">
          <div className="w-24 h-24 bg-white/20 rounded-full p-1 mx-auto mb-4 border-2 border-white/30 backdrop-blur-md">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-blue-600 overflow-hidden">
              <UserIcon size={48} />
            </div>
          </div>
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <div className="flex items-center justify-center gap-1.5 mt-1 opacity-80 text-sm">
            <CheckCircle2 size={14} className="text-emerald-300" /> Account Verified
          </div>
        </div>
      </div>

      <div className="px-6 -mt-16">
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex divide-x divide-slate-100 mb-8">
          <div className="flex-1 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Orders</p>
            <p className="text-xl font-black text-slate-900">{user?.totalOrders}</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Completed</p>
            <p className="text-xl font-black text-emerald-600">{user?.completedOrders}</p>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => navigateTo('edit-profile')}
            className="w-full bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group active:bg-slate-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
                <UserIcon size={20} />
              </div>
              <span className="font-bold text-slate-700">Edit Profile</span>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>

          <button 
            onClick={() => navigateTo('change-password')}
            className="w-full bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group active:bg-slate-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
                <Lock size={20} />
              </div>
              <span className="font-bold text-slate-700">Change Password</span>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>

          <button 
            onClick={() => navigateTo('settings')}
            className="w-full bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group active:bg-slate-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
                <SettingsIcon size={20} />
              </div>
              <span className="font-bold text-slate-700">Settings</span>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>

          <button 
            onClick={() => navigateTo('support')}
            className="w-full bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group active:bg-slate-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
                <HelpCircle size={20} />
              </div>
              <span className="font-bold text-slate-700">Support Center</span>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>

          <button 
            onClick={() => navigateTo('logout')}
            className="w-full bg-white p-5 rounded-3xl shadow-sm border border-red-50 flex items-center justify-between group active:bg-red-50"
          >
            <div className="flex items-center gap-4 text-red-600">
              <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center">
                <LogOut size={20} />
              </div>
              <span className="font-bold">Log Out</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const EditProfileScreen = () => (
    <div className="pb-10">
      <div className="bg-white pt-12 pb-6 px-6 sticky top-0 z-40 border-b border-slate-100 flex items-center gap-4">
        <button onClick={() => navigateTo('profile')} className="p-2 -ml-2 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Edit Profile</h1>
      </div>
      <div className="p-6 space-y-6">
        <Input label="Full Name" value={user?.name || ''} onChange={() => {}} icon={<UserIcon size={20} />} />
        <Input label="Email Address" value={user?.email || ''} onChange={() => {}} icon={<Mail size={20} />} />
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Phone Number</label>
          <p className="font-bold text-slate-800">{user?.phone}</p>
          <p className="text-[10px] text-slate-400 mt-1 italic">Phone number cannot be changed once verified.</p>
        </div>
        <Button fullWidth onClick={() => navigateTo('profile')}>Save Changes</Button>
      </div>
    </div>
  );

  const ChangePasswordScreen = () => (
    <div className="pb-10">
      <div className="bg-white pt-12 pb-6 px-6 sticky top-0 z-40 border-b border-slate-100 flex items-center gap-4">
        <button onClick={() => navigateTo('profile')} className="p-2 -ml-2 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Change Password</h1>
      </div>
      <div className="p-6 space-y-6">
        <Input label="Current Password" type="password" value="" onChange={() => {}} icon={<Lock size={20} />} />
        <Input label="New Password" type="password" value="" onChange={() => {}} icon={<Lock size={20} />} />
        <Input label="Confirm New Password" type="password" value="" onChange={() => {}} icon={<Lock size={20} />} />
        <Button fullWidth onClick={() => navigateTo('profile')}>Update Password</Button>
      </div>
    </div>
  );

  const SupportScreen = () => (
    <div className="pb-10">
      <div className="bg-white pt-12 pb-6 px-6 sticky top-0 z-40 border-b border-slate-100 flex items-center gap-4">
        <button onClick={() => navigateTo('profile')} className="p-2 -ml-2 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Support Center</h1>
      </div>
      <div className="p-6">
        <div className="bg-blue-600 p-8 rounded-[32px] text-white text-center mb-10 shadow-xl shadow-blue-200">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30 backdrop-blur-md">
            <MessageCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">How can we help?</h2>
          <p className="text-white/80 text-sm">Our team is available 24/7 to assist with your exchange.</p>
        </div>

        <div className="space-y-4">
          <a href="https://wa.me/8801712345678" className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-3xl shadow-sm active:bg-slate-50 transition-all">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
              <MessageCircle size={28} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">WhatsApp Support</h4>
              <p className="text-xs text-slate-400">Instant response (Recommended)</p>
            </div>
            <ChevronRight size={20} className="text-slate-300 ml-auto" />
          </a>

          <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-3xl shadow-sm active:bg-slate-50 transition-all">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <Mail size={28} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Email Support</h4>
              <p className="text-xs text-slate-400">support@exchange.com</p>
            </div>
            <ChevronRight size={20} className="text-slate-300 ml-auto" />
          </div>

          <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-3xl shadow-sm active:bg-slate-50 transition-all">
            <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center">
              <Globe size={28} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Live Web Chat</h4>
              <p className="text-xs text-slate-400">Chat with an agent now</p>
            </div>
            <ChevronRight size={20} className="text-slate-300 ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsScreen = () => {
    const [notificationsOn, setNotificationsOn] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [lang, setLang] = useState('English');

    const SettingRow: React.FC<{ icon: React.ReactNode; label: string; right: React.ReactNode }> = ({ icon, label, right }) => (
      <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <span className="font-bold text-slate-700">{label}</span>
        </div>
        {right}
      </div>
    );

    return (
      <div className="pb-10">
        <div className="bg-white pt-12 pb-6 px-6 sticky top-0 z-40 border-b border-slate-100 flex items-center gap-4">
          <button onClick={() => navigateTo('profile')} className="p-2 -ml-2 text-slate-600">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        </div>
        <div className="p-6 space-y-4">
          <SettingRow 
            icon={<Bell size={20} />} 
            label="Push Notifications" 
            right={
              <button 
                onClick={() => setNotificationsOn(!notificationsOn)}
                className={`w-12 h-6 rounded-full relative transition-colors ${notificationsOn ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notificationsOn ? 'right-1' : 'left-1'}`}></div>
              </button>
            } 
          />
          <SettingRow 
            icon={<Globe size={20} />} 
            label="App Language" 
            right={
              <button onClick={() => setLang(lang === 'English' ? 'Bangla' : 'English')} className="text-sm font-bold text-blue-600 px-3 py-1 bg-blue-50 rounded-lg">
                {lang}
              </button>
            } 
          />
          <SettingRow 
            icon={<ShieldCheck size={20} />} 
            label="Dark Mode" 
            right={
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? 'right-1' : 'left-1'}`}></div>
              </button>
            } 
          />
        </div>
      </div>
    );
  };

  const LogoutConfirmation = () => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-6">
      <div className="bg-white w-full max-w-sm rounded-[32px] p-8 text-center animate-in slide-in-from-bottom duration-300">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <LogOut size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Are you sure?</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">You are about to log out from your account. You will need to login again to manage orders.</p>
        <div className="space-y-3">
          <Button fullWidth variant="danger" onClick={() => { setIsAuthenticated(false); navigateTo('login'); }}>Yes, Logout</Button>
          <Button fullWidth variant="outline" onClick={() => navigateTo('profile')}>Cancel</Button>
        </div>
      </div>
    </div>
  );

  // --- Render Logic ---

  if (!isAuthenticated) {
    if (currentPage === 'signup') return <SignUpScreen />;
    if (currentPage === 'otp') return <OTPScreen />;
    return <LoginScreen />;
  }

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen relative">
      <main>
        {currentPage === 'dashboard' && <DashboardScreen />}
        {currentPage === 'form' && <RequestFormScreen />}
        {currentPage === 'confirmation' && <ConfirmationScreen />}
        {currentPage === 'history' && <HistoryScreen />}
        {currentPage === 'details' && <DetailsScreen />}
        {currentPage === 'notifications' && <NotificationsScreen />}
        {currentPage === 'profile' && <ProfileScreen />}
        {currentPage === 'edit-profile' && <EditProfileScreen />}
        {currentPage === 'change-password' && <ChangePasswordScreen />}
        {currentPage === 'support' && <SupportScreen />}
        {currentPage === 'settings' && <SettingsScreen />}
        {currentPage === 'logout' && <LogoutConfirmation />}
      </main>
      
      {['dashboard', 'history', 'notifications', 'profile', 'form'].includes(currentPage) && (
        <Navbar currentTab={currentTab} setTab={handleTabChange} />
      )}
    </div>
  );
}
