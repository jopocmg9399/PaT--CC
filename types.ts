
export type Currency = 'CUP' | 'USD';
export type PaymentMethod = 'Efectivo' | 'Transferencia';
export type ReceptionType = 'Consignación' | 'Compra Directa';
export type UserRole = 'Propietario' | 'Administrador' | 'Dependiente' | 'Cliente' | 'Afiliado';

export interface GroupingPrice {
  id: string;
  label: string;
  quantity: number; // Unidades que contiene la agrupación (ej: 12 unidades en una caja)
  price: number;    // Precio por unidad dentro de esta agrupación
  currency: Currency;
  minOrderQuantity: number; // Mínimo de agrupaciones a comprar (ej: mínimo 3 cajas)
}

export interface Offer {
  id: string;
  label: string;
  price: number;
  currency: Currency;
  startDate: string;
  endDate: string;
}

export interface StoreConfig {
  id: string;
  logoUrl: string;
  bannerUrl?: string;
  storeName: string;
  aboutText: string;
  address: string;
  phone: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  websiteUrl: string;
  ownerId: string;
  status: 'pending' | 'active' | 'suspended';
  isVerified?: boolean;
  commissionRate: number; // Commission paid to the platform (%)
  affiliateConfig: {
    enabled: boolean;
    defaultCommissionType: 'percentage' | 'fixed';
    defaultCommissionValue: number;
  };
}

export interface Affiliate {
  id: string;
  userId: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  commissionType: 'percentage' | 'fixed';
  commissionValue: number;
  totalEarnedCup: number;
  totalEarnedUsd: number;
  status: 'active' | 'inactive';
}

export interface ReceptionLot {
  id: string;
  date: string;
  supplierId: string;
  receptionType: ReceptionType;
  quantityReceived: number;
  currentStock: number;
  unitCost: number;
  transportCost: number;
  totalInvestment: number; 
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  categoryId: string;
  supplierId: string;
  receptionType: ReceptionType;
  unitPrice: number;
  unitCurrency: Currency;
  costPrice: number; 
  groupings: GroupingPrice[];
  offers: Offer[];
  stock: number;
  minStock: number;
  expiryDate: string;
  receivedDate: string;
  isOffer?: boolean;
  lots: ReceptionLot[];
  affiliateCommission?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
}

export interface Contact {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  type: 'Proveedor' | 'Cliente' | 'Afiliado';
  isConsignee?: boolean;
  pendingBalanceCup: number;
  pendingBalanceUsd: number;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  groupingId?: string; 
  groupingLabel?: string;
  quantity: number; // Cantidad de agrupaciones (ej: 3 cajas)
  price: number;    // Precio por unidad
  total: number;    // (quantity * unitsPerGrouping * price)
  currency: Currency;
  unitQuantity: number; // Unidades totales descontadas
}

export interface Transaction {
  id: string;
  date: string;
  clientId: string;
  clientName: string;
  affiliateId?: string;
  items: SaleItem[];
  totalCup: number;
  totalUsd: number;
  paymentMethod: PaymentMethod;
  status: 'Solicitud' | 'Despachado' | 'Anulado';
  invoiceNumber: string;
  finalCustomerData?: {
    name: string;
    phone: string;
    address: string;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'error' | 'success';
  date: string;
  read: boolean;
}

export interface StoreRequest {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  authKey?: string;
  password?: string;
  date: string;
}

export interface PlatformConfig {
  name: string;
  about: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  credentials: {
    adminEmail: string;
    adminPass: string; // For demo purposes
  };
}
