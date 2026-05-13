import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/server.js';
import User from '../src/models/User.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.disconnect(); // Disconnect from real DB if connected
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Auth API Tests', () => {
  const testUser = {
    username: 'testadmin',
    password: 'password123',
    email: 'admin@test.com',
    fullName: 'Test Admin'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: testUser.username,
        password: testUser.password
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('should fail with incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: testUser.username,
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });
});

describe('Log Ingestion API Tests', () => {
  it('should ingest a log entry', async () => {
    const sampleLog = {
      ts: new Date().toISOString(),
      identity: {
        user_email: 'tester@leco.lk',
        company_name: 'LECO',
        category: 'GB',
        account_manager: 'Kasun',
        user_type: 'external',
        access_method: 'Web'
      },
      action: {
        module: 'Complaints',
        sub_module: 'Bill Complaints',
        status: 'success',
        latency_ms: 50
      },
      data_snapshot: {
        cr: 'CR-TEST'
      }
    };

    const res = await request(app)
      .post('/api/logs/ingest')
      .send(sampleLog);
    
    expect(res.statusCode).toEqual(202);
    expect(res.body.success).toBe(true);
  });
});
