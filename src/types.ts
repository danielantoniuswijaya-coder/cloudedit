export type OrderStatus = 'pending' | 'processing' | 'completed';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface ServicePackage {
  name: string;
  price: number;
}

export interface ServiceOffering {
  serviceId: string;
  name: string;
  description: string;
  icon: string;
  packages: ServicePackage[];
}

export interface Order {
  orderId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  whatsapp: string;
  serviceName: string;
  packageName: string;
  notes: string;
  fileUrl: string;
  resultUrl?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
