import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import LogEntry from './models/LogEntry.js';

const companies = [
  { name: 'LECO', cat: 'GB', am: 'Kasun Sameera' },
  { name: 'NWS&DB', cat: 'GB', am: 'Nadun Thiwanka' },
  { name: 'Pizza Hut', cat: 'LB', am: 'Amal Perera' },
  { name: 'KY Biz', cat: 'SME', am: 'Dilan Imesh' },
  { name: 'Dialog', cat: 'LB', am: 'Saman Silva' }
];

const modules = [
  { mod: 'Service Lineup', sub: ['View List', 'Search Service'] },
  { mod: 'Intelligent Solutions', sub: ['Cloud PBX', 'Hosting'] },
  { mod: 'Complaints', sub: ['Service Complaints', 'Status Check'] },
  { mod: 'Billing', sub: ['View Bill', 'Payment'] },
  { mod: 'Service Request', sub: ['New Connection', 'Upgrade'] }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/myslt_business';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    await LogEntry.deleteMany({});
    console.log('Cleared existing logs');

    const logs = [];
    const now = new Date();

    for (let i = 0; i < 100; i++) {
      const company = companies[Math.floor(Math.random() * companies.length)];
      const moduleSet = modules[Math.floor(Math.random() * modules.length)];
      const subModule = moduleSet.sub[Math.floor(Math.random() * moduleSet.sub.length)];
      
      const ts = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);

      logs.push({
        ts,
        identity: {
          user_email: `user${i}@${company.name.toLowerCase().replace(/[^a-z]/g, '')}.lk`,
          company_name: company.name,
          category: company.cat,
          account_manager: company.am,
          user_type: Math.random() > 0.2 ? 'external' : 'internal',
          access_method: Math.random() > 0.3 ? 'Web' : 'Mobile'
        },
        action: {
          module: moduleSet.mod,
          sub_module: subModule,
          status: Math.random() > 0.1 ? 'success' : 'failed',
          latency_ms: Math.floor(Math.random() * 500)
        },
        data_snapshot: {
          cr: `CR${1000 + i}`,
          service_id: `SID${2000 + i}`,
          account_no: `ACC${3000 + i}`,
          username: `user${i}`
        }
      });
    }

    await LogEntry.insertMany(logs);
    console.log('Successfully seeded 100 log entries');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
