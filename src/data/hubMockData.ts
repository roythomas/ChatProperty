import { Apartment, ProcurementRecord, GanttTask } from '../types/hub';

const checklistTemplate = (furnished: boolean) => [
  { id: 'c1', label: 'Main door keys & spare set', done: false, category: 'Keys' as const },
  { id: 'c2', label: 'Mailbox key', done: false, category: 'Keys' as const },
  { id: 'c3', label: 'KAHRAMAA meter reading verified', done: false, category: 'Utilities' as const },
  { id: 'c4', label: 'Water supply connected & tested', done: false, category: 'Utilities' as const },
  { id: 'c5', label: 'All AC units operational', done: false, category: 'Appliances' as const },
  { id: 'c6', label: 'Kitchen appliances tested', done: furnished, category: 'Appliances' as const },
  { id: 'c7', label: 'Interior walls – no cracks or stains', done: false, category: 'Paint' as const },
  { id: 'c8', label: 'Ceiling paint uniform finish', done: false, category: 'Paint' as const },
  { id: 'c9', label: 'Deep clean completed', done: false, category: 'Cleaning' as const },
  { id: 'c10', label: 'Windows clean & locks functional', done: false, category: 'Cleaning' as const },
  { id: 'c11', label: 'Final inspection sign-off', done: false, category: 'Inspection' as const },
  { id: 'c12', label: 'Snagging list resolved', done: false, category: 'Inspection' as const },
];

const pinsTemplate = () => [
  { id: 'p1', x: 25, y: 35, title: 'Bathroom leak', description: 'Slow drip under vanity basin', status: 'Pending' as const, category: 'Plumbing' as const },
  { id: 'p2', x: 68, y: 20, title: 'Outlet not working', description: 'Bedroom socket – no power', status: 'Pending' as const, category: 'Electrical' as const },
  { id: 'p3', x: 50, y: 65, title: 'Drywall chip', description: 'Living area corner damage', status: 'Done' as const, category: 'Finish' as const },
];

export const mockApartments: Apartment[] = [
  // ─── SERDAL TOWER ─────────────────────────────────────
  { id: 'ST-101', name: '101', building: 'Serdal Tower', buildingCode: 'ST', type: '1 BR UF', status: 'Completed', progress: 100, budget: { total: 18000, spent: 16800 }, tenantName: 'Mohammed Al-Kuwari', moveInDate: '2024-02-01', shortCode: 'ST-101', floor: 1, bedrooms: 1, furnished: false, lastRenovatedDate: '2024-01-15', checklist: checklistTemplate(false).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'ST-102', name: '102', building: 'Serdal Tower', buildingCode: 'ST', type: '1 BR UF', status: 'Completed', progress: 100, budget: { total: 18000, spent: 17200 }, tenantName: 'Fatima Al-Jaber', moveInDate: '2024-02-15', shortCode: 'ST-102', floor: 1, bedrooms: 1, furnished: false, lastRenovatedDate: '2024-01-20', checklist: checklistTemplate(false).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'ST-201', name: '201', building: 'Serdal Tower', buildingCode: 'ST', type: '2 BR UF', status: 'In Progress', progress: 72, budget: { total: 32000, spent: 21500 }, tenantName: '', shortCode: 'ST-201', floor: 2, bedrooms: 2, furnished: false, lastRenovatedDate: '', checklist: checklistTemplate(false).map((i, idx) => ({ ...i, done: idx < 6 })), floorPlanPins: pinsTemplate(), notes: 'Bathroom tiling 60% complete. AC installation pending.' },
  { id: 'ST-202', name: '202', building: 'Serdal Tower', buildingCode: 'ST', type: '2 BR UF', status: 'Completed', progress: 100, budget: { total: 32000, spent: 30500 }, tenantName: 'Khalid Al-Thani', moveInDate: '2024-03-01', shortCode: 'ST-202', floor: 2, bedrooms: 2, furnished: false, lastRenovatedDate: '2024-02-10', checklist: checklistTemplate(false).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'ST-203', name: '203', building: 'Serdal Tower', buildingCode: 'ST', type: '2 BR UF', status: 'Overdue', progress: 45, budget: { total: 32000, spent: 14800 }, shortCode: 'ST-203', floor: 2, bedrooms: 2, furnished: false, checklist: checklistTemplate(false).map((i, idx) => ({ ...i, done: idx < 4 })), floorPlanPins: pinsTemplate(), notes: 'Contractor delayed. Electrical rewiring incomplete.' },
  { id: 'ST-301', name: '301', building: 'Serdal Tower', buildingCode: 'ST', type: '3 BR SF', status: 'In Progress', progress: 85, budget: { total: 55000, spent: 44000 }, shortCode: 'ST-301', floor: 3, bedrooms: 3, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 9 })), floorPlanPins: pinsTemplate().slice(0, 1), notes: 'Final snag list in review.' },
  { id: 'ST-302', name: '302', building: 'Serdal Tower', buildingCode: 'ST', type: '3 BR SF', status: 'Completed', progress: 100, budget: { total: 55000, spent: 52000 }, tenantName: 'Ahmed Al-Marri', moveInDate: '2024-04-01', shortCode: 'ST-302', floor: 3, bedrooms: 3, furnished: true, lastRenovatedDate: '2024-03-10', checklist: checklistTemplate(true).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'ST-303', name: '303', building: 'Serdal Tower', buildingCode: 'ST', type: '3 BR UF', status: 'Vacant', progress: 0, budget: { total: 48000, spent: 0 }, shortCode: 'ST-303', floor: 3, bedrooms: 3, furnished: false, checklist: checklistTemplate(false), floorPlanPins: [] },
  { id: 'ST-401', name: '401', building: 'Serdal Tower', buildingCode: 'ST', type: '3 BR SF', status: 'In Progress', progress: 60, budget: { total: 58000, spent: 32000 }, shortCode: 'ST-401', floor: 4, bedrooms: 3, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 7 })), floorPlanPins: pinsTemplate() },
  { id: 'ST-402', name: '402', building: 'Serdal Tower', buildingCode: 'ST', type: '2 BR UF', status: 'Completed', progress: 100, budget: { total: 33000, spent: 31200 }, tenantName: 'Sara Al-Dosari', moveInDate: '2024-03-20', shortCode: 'ST-402', floor: 4, bedrooms: 2, furnished: false, lastRenovatedDate: '2024-02-28', checklist: checklistTemplate(false).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'ST-501', name: '501', building: 'Serdal Tower', buildingCode: 'ST', type: '3 BR SF', status: 'Overdue', progress: 30, budget: { total: 56000, spent: 16500 }, shortCode: 'ST-501', floor: 5, bedrooms: 3, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 3 })), floorPlanPins: pinsTemplate() },
  { id: 'ST-601', name: '601', building: 'Serdal Tower', buildingCode: 'ST', type: '3 BR SF + STUDY', status: 'In Progress', progress: 78, budget: { total: 72000, spent: 55000 }, shortCode: 'ST-601', floor: 6, bedrooms: 3, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 9 })), floorPlanPins: pinsTemplate().slice(0, 2) },
  { id: 'ST-701', name: '701', building: 'Serdal Tower', buildingCode: 'ST', type: '4 BR SF', status: 'Completed', progress: 100, budget: { total: 88000, spent: 85500 }, tenantName: 'Hamad Al-Attiyah', moveInDate: '2024-05-01', shortCode: 'ST-701', floor: 7, bedrooms: 4, furnished: true, lastRenovatedDate: '2024-04-10', checklist: checklistTemplate(true).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'ST-801', name: '801', building: 'Serdal Tower', buildingCode: 'ST', type: '4 BR SF + STUDY', status: 'In Progress', progress: 55, budget: { total: 95000, spent: 51000 }, shortCode: 'ST-801', floor: 8, bedrooms: 4, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 6 })), floorPlanPins: pinsTemplate() },
  { id: 'ST-901', name: '901', building: 'Serdal Tower', buildingCode: 'ST', type: '4 BR SF + STUDY', status: 'Vacant', progress: 0, budget: { total: 95000, spent: 0 }, shortCode: 'ST-901', floor: 9, bedrooms: 4, furnished: true, checklist: checklistTemplate(true), floorPlanPins: [] },

  // ─── DAREEN BUILDING ──────────────────────────────────
  { id: 'DT-16A01', name: 'Unit 01', building: 'Dareen Building', buildingCode: 'DT', type: '2 BR SF', status: 'Completed', progress: 100, budget: { total: 28000, spent: 26500 }, tenantName: 'Nasser Al-Naimi', moveInDate: '2024-03-15', shortCode: 'DT-16A01', floor: 1, bedrooms: 2, furnished: true, lastRenovatedDate: '2024-02-20', checklist: checklistTemplate(true).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'DT-16A02', name: 'Unit 02', building: 'Dareen Building', buildingCode: 'DT', type: '2 BR SF', status: 'In Progress', progress: 65, budget: { total: 28000, spent: 17000 }, shortCode: 'DT-16A02', floor: 1, bedrooms: 2, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 7 })), floorPlanPins: pinsTemplate().slice(0, 2) },
  { id: 'DT-16A03', name: 'Unit 03', building: 'Dareen Building', buildingCode: 'DT', type: '3 BR SF', status: 'Overdue', progress: 40, budget: { total: 45000, spent: 17500 }, shortCode: 'DT-16A03', floor: 1, bedrooms: 3, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 4 })), floorPlanPins: pinsTemplate() },
  { id: 'DT-16A04', name: 'Unit 04', building: 'Dareen Building', buildingCode: 'DT', type: '3 BR SF', status: 'Completed', progress: 100, budget: { total: 45000, spent: 43000 }, tenantName: 'Maryam Al-Sulaiti', moveInDate: '2024-04-10', shortCode: 'DT-16A04', floor: 1, bedrooms: 3, furnished: true, lastRenovatedDate: '2024-03-18', checklist: checklistTemplate(true).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'DT-16A05', name: 'Unit 05', building: 'Dareen Building', buildingCode: 'DT', type: '4 BR SF + STUDY', status: 'In Progress', progress: 88, budget: { total: 78000, spent: 68000 }, shortCode: 'DT-16A05', floor: 2, bedrooms: 4, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 10 })), floorPlanPins: pinsTemplate().slice(0, 1) },
  { id: 'DT-16A06', name: 'Unit 06', building: 'Dareen Building', buildingCode: 'DT', type: '4 BR SF + STUDY', status: 'Completed', progress: 100, budget: { total: 78000, spent: 75000 }, tenantName: 'Jassim Al-Mannai', moveInDate: '2024-05-20', shortCode: 'DT-16A06', floor: 2, bedrooms: 4, furnished: true, lastRenovatedDate: '2024-04-25', checklist: checklistTemplate(true).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'DT-16A07', name: 'Unit 07', building: 'Dareen Building', buildingCode: 'DT', type: '3 BR SF', status: 'Vacant', progress: 0, budget: { total: 45000, spent: 0 }, shortCode: 'DT-16A07', floor: 2, bedrooms: 3, furnished: true, checklist: checklistTemplate(true), floorPlanPins: [] },
  { id: 'DT-16A08', name: 'Unit 08', building: 'Dareen Building', buildingCode: 'DT', type: '2 BR SF', status: 'In Progress', progress: 50, budget: { total: 28000, spent: 13500 }, shortCode: 'DT-16A08', floor: 3, bedrooms: 2, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 5 })), floorPlanPins: pinsTemplate().slice(1) },
  { id: 'DT-16A09', name: 'Unit 09', building: 'Dareen Building', buildingCode: 'DT', type: '2 BR SF', status: 'Overdue', progress: 20, budget: { total: 28000, spent: 5500 }, shortCode: 'DT-16A09', floor: 3, bedrooms: 2, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 2 })), floorPlanPins: pinsTemplate() },
  { id: 'DT-16A10', name: 'Unit 10', building: 'Dareen Building', buildingCode: 'DT', type: '4 BR SF', status: 'Completed', progress: 100, budget: { total: 68000, spent: 65000 }, tenantName: 'Abdulla Al-Shamari', moveInDate: '2024-06-01', shortCode: 'DT-16A10', floor: 4, bedrooms: 4, furnished: true, lastRenovatedDate: '2024-05-10', checklist: checklistTemplate(true).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'DT-16A11', name: 'Unit 11', building: 'Dareen Building', buildingCode: 'DT', type: '3 BR SF + STUDY', status: 'In Progress', progress: 70, budget: { total: 52000, spent: 35500 }, shortCode: 'DT-16A11', floor: 4, bedrooms: 3, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 8 })), floorPlanPins: pinsTemplate().slice(0, 2) },
  { id: 'DT-16A12', name: 'Unit 12', building: 'Dareen Building', buildingCode: 'DT', type: '4 BR SF + STUDY', status: 'Vacant', progress: 0, budget: { total: 80000, spent: 0 }, shortCode: 'DT-16A12', floor: 5, bedrooms: 4, furnished: true, checklist: checklistTemplate(true), floorPlanPins: [] },

  // ─── AREEN RESIDENCE ──────────────────────────────────
  { id: 'AR-101', name: '101', building: 'Areen Residence', buildingCode: 'AR', type: 'Studio UF', status: 'Completed', progress: 100, budget: { total: 12000, spent: 11500 }, tenantName: 'Tariq Hassan', moveInDate: '2024-01-10', shortCode: 'AR-101', floor: 1, bedrooms: 0, furnished: false, lastRenovatedDate: '2024-01-01', checklist: checklistTemplate(false).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'AR-102', name: '102', building: 'Areen Residence', buildingCode: 'AR', type: 'Studio UF', status: 'In Progress', progress: 80, budget: { total: 12000, spent: 9200 }, shortCode: 'AR-102', floor: 1, bedrooms: 0, furnished: false, checklist: checklistTemplate(false).map((i, idx) => ({ ...i, done: idx < 9 })), floorPlanPins: pinsTemplate().slice(2) },
  { id: 'AR-201', name: '201', building: 'Areen Residence', buildingCode: 'AR', type: '1 BR UF', status: 'Completed', progress: 100, budget: { total: 20000, spent: 18900 }, tenantName: 'Priya Nair', moveInDate: '2024-02-20', shortCode: 'AR-201', floor: 2, bedrooms: 1, furnished: false, lastRenovatedDate: '2024-02-05', checklist: checklistTemplate(false).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'AR-202', name: '202', building: 'Areen Residence', buildingCode: 'AR', type: '1 BR UF', status: 'Overdue', progress: 35, budget: { total: 20000, spent: 7000 }, shortCode: 'AR-202', floor: 2, bedrooms: 1, furnished: false, checklist: checklistTemplate(false).map((i, idx) => ({ ...i, done: idx < 4 })), floorPlanPins: pinsTemplate() },
  { id: 'AR-301', name: '301', building: 'Areen Residence', buildingCode: 'AR', type: '2 BR UF', status: 'In Progress', progress: 62, budget: { total: 30000, spent: 18500 }, shortCode: 'AR-301', floor: 3, bedrooms: 2, furnished: false, checklist: checklistTemplate(false).map((i, idx) => ({ ...i, done: idx < 7 })), floorPlanPins: pinsTemplate().slice(0, 2) },
  { id: 'AR-302', name: '302', building: 'Areen Residence', buildingCode: 'AR', type: '2 BR SF', status: 'Completed', progress: 100, budget: { total: 36000, spent: 34200 }, tenantName: 'James Okafor', moveInDate: '2024-04-01', shortCode: 'AR-302', floor: 3, bedrooms: 2, furnished: true, lastRenovatedDate: '2024-03-12', checklist: checklistTemplate(true).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'AR-401', name: '401', building: 'Areen Residence', buildingCode: 'AR', type: '2 BR SF', status: 'Vacant', progress: 0, budget: { total: 36000, spent: 0 }, shortCode: 'AR-401', floor: 4, bedrooms: 2, furnished: true, checklist: checklistTemplate(true), floorPlanPins: [] },
  { id: 'AR-402', name: '402', building: 'Areen Residence', buildingCode: 'AR', type: '2 BR UF', status: 'In Progress', progress: 48, budget: { total: 30000, spent: 14000 }, shortCode: 'AR-402', floor: 4, bedrooms: 2, furnished: false, checklist: checklistTemplate(false).map((i, idx) => ({ ...i, done: idx < 5 })), floorPlanPins: pinsTemplate() },
  { id: 'AR-501', name: '501', building: 'Areen Residence', buildingCode: 'AR', type: '3 BR SF', status: 'Completed', progress: 100, budget: { total: 48000, spent: 46500 }, tenantName: 'Layla Al-Rashid', moveInDate: '2024-05-15', shortCode: 'AR-501', floor: 5, bedrooms: 3, furnished: true, lastRenovatedDate: '2024-04-20', checklist: checklistTemplate(true).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'AR-601', name: '601', building: 'Areen Residence', buildingCode: 'AR', type: '3 BR SF + STUDY', status: 'Overdue', progress: 25, budget: { total: 62000, spent: 15000 }, shortCode: 'AR-601', floor: 6, bedrooms: 3, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 3 })), floorPlanPins: pinsTemplate() },

  // ─── CASTLE GARDEN ────────────────────────────────────
  { id: 'CG-V01', name: 'Villa 01', building: 'Castle Garden', buildingCode: 'CG', type: '4 BR Villa SF', status: 'Completed', progress: 100, budget: { total: 120000, spent: 115000 }, tenantName: 'Sultan Al-Hajri', moveInDate: '2024-03-01', shortCode: 'CG-V01', floor: 1, bedrooms: 4, furnished: true, lastRenovatedDate: '2024-02-01', checklist: checklistTemplate(true).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'CG-V02', name: 'Villa 02', building: 'Castle Garden', buildingCode: 'CG', type: '4 BR Villa SF', status: 'In Progress', progress: 90, budget: { total: 120000, spent: 106000 }, shortCode: 'CG-V02', floor: 1, bedrooms: 4, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 11 })), floorPlanPins: pinsTemplate().slice(0, 1) },
  { id: 'CG-V03', name: 'Villa 03', building: 'Castle Garden', buildingCode: 'CG', type: '5 BR Villa SF', status: 'Overdue', progress: 50, budget: { total: 155000, spent: 76000 }, shortCode: 'CG-V03', floor: 1, bedrooms: 5, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 6 })), floorPlanPins: pinsTemplate() },
  { id: 'CG-TH01', name: 'TH 01', building: 'Castle Garden', buildingCode: 'CG', type: '3 BR Townhouse UF', status: 'Completed', progress: 100, budget: { total: 68000, spent: 65000 }, tenantName: 'Reem Al-Fardan', moveInDate: '2024-04-15', shortCode: 'CG-TH01', floor: 1, bedrooms: 3, furnished: false, lastRenovatedDate: '2024-03-20', checklist: checklistTemplate(false).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'CG-TH02', name: 'TH 02', building: 'Castle Garden', buildingCode: 'CG', type: '3 BR Townhouse SF', status: 'In Progress', progress: 73, budget: { total: 82000, spent: 59000 }, shortCode: 'CG-TH02', floor: 1, bedrooms: 3, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 8 })), floorPlanPins: pinsTemplate().slice(1) },
  { id: 'CG-TH03', name: 'TH 03', building: 'Castle Garden', buildingCode: 'CG', type: '4 BR Townhouse SF', status: 'Vacant', progress: 0, budget: { total: 100000, spent: 0 }, shortCode: 'CG-TH03', floor: 1, bedrooms: 4, furnished: true, checklist: checklistTemplate(true), floorPlanPins: [] },
  { id: 'CG-V04', name: 'Villa 04', building: 'Castle Garden', buildingCode: 'CG', type: '5 BR Villa SF + STUDY', status: 'In Progress', progress: 38, budget: { total: 175000, spent: 65000 }, shortCode: 'CG-V04', floor: 1, bedrooms: 5, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 4 })), floorPlanPins: pinsTemplate() },
  { id: 'CG-V05', name: 'Villa 05', building: 'Castle Garden', buildingCode: 'CG', type: '4 BR Villa UF', status: 'Completed', progress: 100, budget: { total: 98000, spent: 95000 }, tenantName: 'Hessa Al-Muftah', moveInDate: '2024-06-01', shortCode: 'CG-V05', floor: 1, bedrooms: 4, furnished: false, lastRenovatedDate: '2024-05-05', checklist: checklistTemplate(false).map(i => ({ ...i, done: true })), floorPlanPins: [] },

  // ─── THE VILLAGE ──────────────────────────────────────
  { id: 'TV-201', name: 'Unit 201', building: 'The Village', buildingCode: 'TV', type: '2 BR TH UF', status: 'Completed', progress: 100, budget: { total: 35000, spent: 33500 }, tenantName: 'Omar Abdullah', moveInDate: '2024-02-10', shortCode: 'TV-201', floor: 2, bedrooms: 2, furnished: false, lastRenovatedDate: '2024-01-25', checklist: checklistTemplate(false).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'TV-202', name: 'Unit 202', building: 'The Village', buildingCode: 'TV', type: '2 BR TH UF', status: 'In Progress', progress: 68, budget: { total: 35000, spent: 23500 }, shortCode: 'TV-202', floor: 2, bedrooms: 2, furnished: false, checklist: checklistTemplate(false).map((i, idx) => ({ ...i, done: idx < 8 })), floorPlanPins: pinsTemplate().slice(0, 2) },
  { id: 'TV-301', name: 'Unit 301', building: 'The Village', buildingCode: 'TV', type: '3 BR TH SF', status: 'Overdue', progress: 42, budget: { total: 58000, spent: 24000 }, shortCode: 'TV-301', floor: 3, bedrooms: 3, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 5 })), floorPlanPins: pinsTemplate() },
  { id: 'TV-302', name: 'Unit 302', building: 'The Village', buildingCode: 'TV', type: '3 BR TH SF', status: 'Completed', progress: 100, budget: { total: 58000, spent: 56000 }, tenantName: 'Noora Al-Obaidly', moveInDate: '2024-05-01', shortCode: 'TV-302', floor: 3, bedrooms: 3, furnished: true, lastRenovatedDate: '2024-04-05', checklist: checklistTemplate(true).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'TV-401', name: 'Unit 401', building: 'The Village', buildingCode: 'TV', type: '4 BR Villa SF', status: 'In Progress', progress: 82, budget: { total: 88000, spent: 71000 }, shortCode: 'TV-401', floor: 4, bedrooms: 4, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 10 })), floorPlanPins: pinsTemplate().slice(0, 1) },
  { id: 'TV-402', name: 'Unit 402', building: 'The Village', buildingCode: 'TV', type: '4 BR Villa SF', status: 'Vacant', progress: 0, budget: { total: 88000, spent: 0 }, shortCode: 'TV-402', floor: 4, bedrooms: 4, furnished: true, checklist: checklistTemplate(true), floorPlanPins: [] },
  { id: 'TV-501', name: 'Unit 501', building: 'The Village', buildingCode: 'TV', type: '3 BR TH UF', status: 'Completed', progress: 100, budget: { total: 48000, spent: 46000 }, tenantName: 'Ibrahim Al-Said', moveInDate: '2024-06-10', shortCode: 'TV-501', floor: 5, bedrooms: 3, furnished: false, lastRenovatedDate: '2024-05-15', checklist: checklistTemplate(false).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'TV-502', name: 'Unit 502', building: 'The Village', buildingCode: 'TV', type: '3 BR TH UF', status: 'In Progress', progress: 55, budget: { total: 48000, spent: 26000 }, shortCode: 'TV-502', floor: 5, bedrooms: 3, furnished: false, checklist: checklistTemplate(false).map((i, idx) => ({ ...i, done: idx < 6 })), floorPlanPins: pinsTemplate() },
  { id: 'TV-601', name: 'Unit 601', building: 'The Village', buildingCode: 'TV', type: '4 BR Villa SF + STUDY', status: 'Overdue', progress: 28, budget: { total: 105000, spent: 29000 }, shortCode: 'TV-601', floor: 6, bedrooms: 4, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 3 })), floorPlanPins: pinsTemplate() },
  { id: 'TV-602', name: 'Unit 602', building: 'The Village', buildingCode: 'TV', type: '2 BR TH SF', status: 'Completed', progress: 100, budget: { total: 42000, spent: 40500 }, tenantName: 'Dana Al-Kawari', moveInDate: '2024-05-25', shortCode: 'TV-602', floor: 6, bedrooms: 2, furnished: true, lastRenovatedDate: '2024-05-01', checklist: checklistTemplate(true).map(i => ({ ...i, done: true })), floorPlanPins: [] },
  { id: 'TV-701', name: 'Unit 701', building: 'The Village', buildingCode: 'TV', type: '3 BR TH SF', status: 'In Progress', progress: 76, budget: { total: 62000, spent: 46500 }, shortCode: 'TV-701', floor: 7, bedrooms: 3, furnished: true, checklist: checklistTemplate(true).map((i, idx) => ({ ...i, done: idx < 9 })), floorPlanPins: pinsTemplate().slice(0, 2) },
  { id: 'TV-702', name: 'Unit 702', building: 'The Village', buildingCode: 'TV', type: '3 BR TH UF', status: 'Vacant', progress: 0, budget: { total: 50000, spent: 0 }, shortCode: 'TV-702', floor: 7, bedrooms: 3, furnished: false, checklist: checklistTemplate(false), floorPlanPins: [] },
];

export const mockProcurement: ProcurementRecord[] = [
  {
    id: 'pr-001', type: 'LPO', refCode: 'LPO-2024-ST-0042', apartmentId: 'ST-301', buildingCode: 'ST',
    description: 'Wardrobe installation & carpentry works – ST Block floors 3-4', vendor: 'Al Amal Carpentry LLC', manager: 'Eng. Khaled Mahmoud',
    status: 'Delivered', capex: true, raisedDate: '2024-02-10', approvedDate: '2024-02-12', deliveryDate: '2024-03-01',
    totalValue: 42500,
    items: [
      { id: 'i1', description: 'Built-in wardrobe (3-door sliding) – Master', quantity: 2, unit: 'unit', unitPrice: 8500, total: 17000 },
      { id: 'i2', description: 'Built-in wardrobe (2-door) – Secondary Bdm', quantity: 2, unit: 'unit', unitPrice: 6000, total: 12000 },
      { id: 'i3', description: 'Kitchen cabinet upgrade with soft-close', quantity: 1, unit: 'lot', unitPrice: 9500, total: 9500 },
      { id: 'i4', description: 'Labour & installation', quantity: 1, unit: 'lot', unitPrice: 4000, total: 4000 },
    ],
  },
  {
    id: 'pr-002', type: 'LPO', refCode: 'LPO-2024-DT-0058', apartmentId: 'DT-16A05', buildingCode: 'DT',
    description: 'Copper pipe network – water supply full replacement', vendor: 'Gulf Plumbing Solutions', manager: 'Eng. Samir Haddad',
    status: 'Ordered', capex: true, raisedDate: '2024-03-05', approvedDate: '2024-03-07',
    totalValue: 31800,
    items: [
      { id: 'i5', description: 'Copper pipe 22mm (supply)', quantity: 120, unit: 'meters', unitPrice: 85, total: 10200 },
      { id: 'i6', description: 'Copper pipe 15mm (distribution)', quantity: 80, unit: 'meters', unitPrice: 65, total: 5200 },
      { id: 'i7', description: 'Fittings, valves & isolators', quantity: 1, unit: 'lot', unitPrice: 4800, total: 4800 },
      { id: 'i8', description: 'Sanitary fixtures (3 bathrooms)', quantity: 3, unit: 'set', unitPrice: 2800, total: 8400 },
      { id: 'i9', description: 'Labour & pressure testing', quantity: 1, unit: 'lot', unitPrice: 3200, total: 3200 },
    ],
  },
  {
    id: 'pr-003', type: 'PO', refCode: 'PO-2024-CG-0019', apartmentId: 'CG-V03', buildingCode: 'CG',
    description: 'HVAC system overhaul – Castle Garden Villa 03 complete replacement', vendor: 'Nordic Cool HVAC', manager: 'Eng. Fatima Al-Dosari',
    status: 'Approved', capex: true, raisedDate: '2024-03-20', approvedDate: '2024-03-22',
    totalValue: 88500,
    items: [
      { id: 'i10', description: 'Ceiling cassette AC units 3-ton', quantity: 4, unit: 'unit', unitPrice: 12000, total: 48000 },
      { id: 'i11', description: 'Split AC units 2.5-ton (bedrooms)', quantity: 3, unit: 'unit', unitPrice: 6500, total: 19500 },
      { id: 'i12', description: 'Ductwork fabrication & installation', quantity: 1, unit: 'lot', unitPrice: 14000, total: 14000 },
      { id: 'i13', description: 'Controls & thermostat panels', quantity: 7, unit: 'unit', unitPrice: 1000, total: 7000 },
    ],
  },
  {
    id: 'pr-004', type: 'PR', refCode: 'PR-2024-AR-0031', apartmentId: 'AR-601', buildingCode: 'AR',
    description: 'General renovation & paint – Areen Block 6th floor', vendor: 'Al Noor Maintenance', manager: 'Eng. Omar Saleh',
    status: 'Draft', capex: false, raisedDate: '2024-04-01',
    totalValue: 28000,
    items: [
      { id: 'i14', description: 'Interior emulsion paint – all rooms', quantity: 480, unit: 'sqm', unitPrice: 22, total: 10560 },
      { id: 'i15', description: 'Ceiling paint – white matte', quantity: 180, unit: 'sqm', unitPrice: 15, total: 2700 },
      { id: 'i16', description: 'Floor tiling – porcelain 60×60', quantity: 120, unit: 'sqm', unitPrice: 95, total: 11400 },
      { id: 'i17', description: 'Grouting & sealant', quantity: 1, unit: 'lot', unitPrice: 3340, total: 3340 },
    ],
  },
  {
    id: 'pr-005', type: 'LPO', refCode: 'LPO-2024-TV-0067', apartmentId: 'TV-301', buildingCode: 'TV',
    description: 'Electrical upgrade – DB panels & full rewire', vendor: 'Emirates Electro Works', manager: 'Eng. Hana Khalil',
    status: 'Closed', capex: true, raisedDate: '2024-01-15', approvedDate: '2024-01-17', deliveryDate: '2024-02-20',
    totalValue: 19500,
    items: [
      { id: 'i18', description: 'MCB distribution board (3-phase)', quantity: 1, unit: 'unit', unitPrice: 4500, total: 4500 },
      { id: 'i19', description: 'Electrical cable 2.5mm² (supply)', quantity: 400, unit: 'meters', unitPrice: 12, total: 4800 },
      { id: 'i20', description: 'LED downlights 12W supply & fix', quantity: 32, unit: 'unit', unitPrice: 180, total: 5760 },
      { id: 'i21', description: 'Socket outlets & switching', quantity: 24, unit: 'unit', unitPrice: 95, total: 2280 },
      { id: 'i22', description: 'DEWA inspection & commissioning', quantity: 1, unit: 'lot', unitPrice: 2160, total: 2160 },
    ],
  },
  {
    id: 'pr-006', type: 'LPO', refCode: 'LPO-2024-ST-0055', buildingCode: 'ST',
    description: 'Common area upgrade – Serdal Tower lobby & corridors', vendor: 'Premium Interiors Co.', manager: 'Eng. Khaled Mahmoud',
    status: 'Ordered', capex: true, raisedDate: '2024-04-10', approvedDate: '2024-04-12',
    totalValue: 65000,
    items: [
      { id: 'i23', description: 'Marble flooring – lobby (imported)', quantity: 85, unit: 'sqm', unitPrice: 380, total: 32300 },
      { id: 'i24', description: 'Feature wall cladding', quantity: 40, unit: 'sqm', unitPrice: 220, total: 8800 },
      { id: 'i25', description: 'LED strip lighting & fixtures', quantity: 1, unit: 'lot', unitPrice: 12500, total: 12500 },
      { id: 'i26', description: 'Signage & wayfinding', quantity: 1, unit: 'lot', unitPrice: 11400, total: 11400 },
    ],
  },
];

export const mockGanttTasks: GanttTask[] = [
  { id: 'g1', apartmentId: 'ST-201', unitName: 'ST-201', building: 'Serdal Tower', taskName: 'Tiling & Flooring', startDate: '2024-04-01', endDate: '2024-04-22', progress: 60, overdue: false, contractor: 'Premium Tiles LLC', color: '#4F46E5' },
  { id: 'g2', apartmentId: 'ST-201', unitName: 'ST-201', building: 'Serdal Tower', taskName: 'AC Installation', startDate: '2024-04-18', endDate: '2024-04-30', progress: 20, overdue: false, contractor: 'Nordic Cool HVAC', color: '#0EA5E9' },
  { id: 'g3', apartmentId: 'ST-203', unitName: 'ST-203', building: 'Serdal Tower', taskName: 'Electrical Rewire', startDate: '2024-03-15', endDate: '2024-04-10', progress: 45, overdue: true, contractor: 'Emirates Electro', color: '#DC2626' },
  { id: 'g4', apartmentId: 'DT-16A05', unitName: 'DT-16A05', building: 'Dareen Building', taskName: 'Plumbing & Pipe Work', startDate: '2024-04-05', endDate: '2024-04-28', progress: 88, overdue: false, contractor: 'Gulf Plumbing Solutions', color: '#059669' },
  { id: 'g5', apartmentId: 'DT-16A02', unitName: 'DT-16A02', building: 'Dareen Building', taskName: 'Carpentry & Fit-out', startDate: '2024-03-25', endDate: '2024-04-20', progress: 65, overdue: false, contractor: 'Al Amal Carpentry', color: '#D97706' },
  { id: 'g6', apartmentId: 'CG-V03', unitName: 'CG-Villa 03', building: 'Castle Garden', taskName: 'HVAC Full Overhaul', startDate: '2024-03-10', endDate: '2024-04-15', progress: 50, overdue: true, contractor: 'Nordic Cool HVAC', color: '#DC2626' },
  { id: 'g7', apartmentId: 'CG-TH02', unitName: 'CG-TH02', building: 'Castle Garden', taskName: 'Interior Painting', startDate: '2024-04-10', endDate: '2024-04-25', progress: 73, overdue: false, contractor: 'Al Noor Maintenance', color: '#8B5CF6' },
  { id: 'g8', apartmentId: 'AR-202', unitName: 'AR-202', building: 'Areen Residence', taskName: 'General Renovation', startDate: '2024-03-20', endDate: '2024-04-18', progress: 35, overdue: true, contractor: 'Al Noor Maintenance', color: '#DC2626' },
  { id: 'g9', apartmentId: 'TV-301', unitName: 'TV-301', building: 'The Village', taskName: 'Full Fit-out Works', startDate: '2024-03-28', endDate: '2024-04-28', progress: 42, overdue: true, contractor: 'Premium Interiors Co.', color: '#DC2626' },
  { id: 'g10', apartmentId: 'TV-701', unitName: 'TV-701', building: 'The Village', taskName: 'Finishing & Snag', startDate: '2024-04-12', endDate: '2024-04-30', progress: 76, overdue: false, contractor: 'Al Noor Maintenance', color: '#059669' },
];
