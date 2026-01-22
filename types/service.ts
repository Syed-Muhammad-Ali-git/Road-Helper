export type ServiceStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface ServiceRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  serviceType: string;
  location: string;
  vehicleDetails: string;
  issueDescription: string;
  status: ServiceStatus;
  helperId?: string;
  helperName?: string;
  helperPhone?: string;
  createdAt: any;
  updatedAt?: any;
  acceptedAt?: any;
  completedAt?: any;
  rating?: number;
  ratedAt?: any;
  price?: number;
}
