export type ServiceStatus = "aguardando" | "em_andamento" | "concluido" | "cancelado";

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // em minutos
  description?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  color: string; // para identificação visual na agenda
}

export interface Appointment {
  id: string;
  date: string; // ISO date string
  time: string; // HH:mm
  clientName: string;
  carPlate: string;
  carModel: string;
  serviceId: string;
  employeeId: string;
  status: ServiceStatus;
  notes?: string;
  createdAt: string;
  completedAt?: string;
}
