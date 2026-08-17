export interface SubscriptionResponse {
  id: number | null;
  planName: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  maxTasks: number;
}

export interface PlanResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  maxTasks: number;
  isActive: boolean;
}