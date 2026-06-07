export interface Room {
  id: string;
  name: string;
  width: number;
  length: number;
  height: number;
  area: number;
  flooringType: 'Tiles' | 'Marble' | 'Wood' | 'Carpet' | 'Concrete' | 'Porcelain';
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  hasAC: boolean;
  notes?: string;
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  email: string;
  nationality: string;
  idNumber: string;
}

export interface Lease {
  id: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: 'Active' | 'Expired' | 'Terminated';
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  floor: number;
  type: 'Studio' | '1BR' | '2BR' | '3BR' | '4BR' | 'Villa';
  internalArea: number;
  externalArea: number;
  status: 'Occupied' | 'Vacant' | 'Under Renovation' | 'Reserved';
  acUnits: number;
  backGarden: boolean;
  backGardenArea?: number;
  interlockWorks: boolean;
  interlockStatus?: 'Completed' | 'In Progress' | 'Planned' | 'Not Started';
  rooms: Room[];
  tenant?: Tenant;
  lease?: Lease;
  monthlyRent: number;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'Villa' | 'Apartment' | 'Townhouse' | 'Commercial';
  yearBuilt: number;
  totalUnits: number;
  totalArea: number;
  backGarden: boolean;
  backGardenArea?: number;
  interlockWorks: boolean;
  interlockStatus?: 'Completed' | 'In Progress' | 'Planned' | 'Not Started';
  totalACUnits: number;
  units: Unit[];
  description?: string;
}

export interface LPOItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface LPO {
  lpoNumber: string;
  issuedDate: string;
  amount: number;
  vendorName: string;
  vendorContact: string;
  validUntil: string;
  items: LPOItem[];
}

export interface ScopeItem {
  id: string;
  description: string;
  area?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  notes?: string;
}

export type RenovationType =
  | 'AC Installation'
  | 'Painting'
  | 'Flooring'
  | 'Interlock Works'
  | 'Plumbing'
  | 'Electrical'
  | 'General Maintenance'
  | 'Back Garden'
  | 'Tiling'
  | 'Carpentry'
  | 'HVAC';

export type RenovationStatus = 'Planned' | 'In Progress' | 'Completed' | 'On Hold';

export interface Renovation {
  id: string;
  propertyId: string;
  unitId: string;
  unitNumber: string;
  propertyName: string;
  type: RenovationType;
  contractor: string;
  contractorPhone: string;
  scopeOfWork: string;
  lpo: LPO;
  estimatedCost: number;
  actualCost?: number;
  startDate: string;
  completionDate: string;
  actualCompletionDate?: string;
  status: RenovationStatus;
  progress: number;
  notes?: string;
  items: ScopeItem[];
}
