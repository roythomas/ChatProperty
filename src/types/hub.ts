export interface FloorPlanPin {
  id: string;
  x: number;
  y: number;
  title: string;
  description?: string;
  status: 'Pending' | 'Done';
  category: 'Electrical' | 'Plumbing' | 'Civil' | 'Finish' | 'HVAC' | 'Other';
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
  category: 'Keys' | 'Utilities' | 'Appliances' | 'Paint' | 'Cleaning' | 'Inspection';
}

export type ApartmentStatus = 'Completed' | 'In Progress' | 'Overdue' | 'Vacant';

export interface Apartment {
  id: string;
  name: string;
  building: string;
  buildingCode: string;
  type: string;
  status: ApartmentStatus;
  progress: number;
  budget: { total: number; spent: number };
  tenantName?: string;
  moveInDate?: string;
  handoverDate?: string;
  shortCode?: string;
  lastRenovatedDate?: string;
  floor: number;
  bedrooms: number;
  furnished: boolean;
  floorPlanPins?: FloorPlanPin[];
  checklist?: ChecklistItem[];
  notes?: string;
}

export type PRStatus = 'Draft' | 'Approved' | 'Ordered' | 'Delivered' | 'Closed';

export interface ProcurementItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface ProcurementRecord {
  id: string;
  type: 'PR' | 'PO' | 'LPO';
  refCode: string;
  apartmentId?: string;
  buildingCode: string;
  description: string;
  vendor: string;
  manager: string;
  status: PRStatus;
  items: ProcurementItem[];
  totalValue: number;
  capex: boolean;
  raisedDate: string;
  approvedDate?: string;
  deliveryDate?: string;
  notes?: string;
}

export interface GanttTask {
  id: string;
  apartmentId: string;
  unitName: string;
  building: string;
  taskName: string;
  startDate: string;
  endDate: string;
  progress: number;
  overdue: boolean;
  contractor: string;
  color: string;
}
