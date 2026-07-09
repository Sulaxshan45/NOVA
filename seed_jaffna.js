import fs from 'fs';
import crypto from 'crypto';

function generateUUID() {
  return crypto.randomUUID();
}

const filepath = 'data/user_google_105289010162932220366.json';
const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));

const projectId = generateUUID();
const project = {
  id: projectId,
  name: 'Jaffna Housing Project',
  client: 'Jaffna Housing Authority',
  location: 'Jaffna',
  startDate: '2026-07-01',
  description: 'Construction of new residential complex in Jaffna',
  masonRate: 3500,
  labourRate: 2000,
  profitMargin: 20,
  createdAt: Date.now()
};
data.projects.push(project);

// Inventory
const materialsData = [
  { name: 'Cement (OPC)', unit: 'Bags', qty: 5000, cost: 2500 },
  { name: 'Sand', unit: 'm³', qty: 2000, cost: 12000 },
  { name: 'Bricks', unit: 'Nos', qty: 200000, cost: 25 },
  { name: 'Steel 10mm', unit: 'MT', qty: 50, cost: 350000 },
  { name: 'Gravel', unit: 'm³', qty: 1500, cost: 9500 },
  { name: 'Paint (White)', unit: 'L', qty: 400, cost: 3200 },
  { name: 'Tiles 2x2', unit: 'Sq.ft', qty: 5000, cost: 150 },
];

const inventory = materialsData.map(m => ({
  id: generateUUID(),
  projectId: projectId,
  name: m.name,
  unit: m.unit,
  quantity: m.qty,
  costPerUnit: m.cost
}));
if (!data.materials) data.materials = [];
data.materials.push(...inventory);

// Expenses
const expensesData = [
  { desc: 'Initial Site Survey', cat: 'Others', amount: 150000 },
  { desc: 'Excavator Rental (Week 1)', cat: 'Tool Rental', amount: 350000 },
  { desc: 'Labour Food Allowance (Week 1)', cat: 'Food', amount: 75000 },
  { desc: 'Transport of Steel', cat: 'Transport', amount: 45000 },
  { desc: 'Water Tank Installation', cat: 'Others', amount: 120000 },
];

const expenses = expensesData.map(e => ({
  id: generateUUID(),
  projectId: projectId,
  description: e.desc,
  category: e.cat,
  date: '2026-07-02',
  amount: e.amount
}));
if (!data.expenses) data.expenses = [];
data.expenses.push(...expenses);

// 500 Tasks
const tasks = [];
let currentDate = new Date('2026-07-01');
for (let i = 1; i <= 500; i++) {
  const duration = Math.floor(Math.random() * 5) + 1; // 1 to 5 days
  const masons = Math.floor(Math.random() * 5);
  const labourers = Math.floor(Math.random() * 10) + 2;
  
  // Randomly assign some materials
  const matCount = Math.floor(Math.random() * 3);
  const taskMaterials = [];
  for (let j=0; j<matCount; j++) {
     const mat = inventory[Math.floor(Math.random() * inventory.length)];
     if (!taskMaterials.find(m => m.materialId === mat.id)) {
        taskMaterials.push({ materialId: mat.id, quantity: Math.floor(Math.random() * 100) + 1 });
     }
  }

  let phase = 'Foundation';
  if (i > 50) phase = 'Superstructure';
  if (i > 150) phase = 'Roofing';
  if (i > 250) phase = 'Plumbing & Electrical';
  if (i > 350) phase = 'Finishing';
  if (i > 450) phase = 'Handover & Review';

  tasks.push({
    id: generateUUID(),
    projectId: projectId,
    name: `Task ${i} - ${phase} works`,
    startDate: currentDate.toISOString().split('T')[0],
    duration: duration,
    masons: masons,
    labourers: labourers,
    status: i < 50 ? 'Completed' : i < 60 ? 'In Progress' : 'Pending',
    materials: taskMaterials
  });
  
  // advance date slightly to stagger them
  if (i % 5 === 0) {
     currentDate.setDate(currentDate.getDate() + 2);
  }
}
if (!data.tasks) data.tasks = [];
data.tasks.push(...tasks);

fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
console.log('Jaffna project successfully generated with 500 tasks, inventory, and expenses!');
