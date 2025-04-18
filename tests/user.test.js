const request = require('supertest');
const app = require('../server');
const sequelize = require('../config/database');
const User = require('../models/user');
const Office = require('../models/office');
const Admin = require('../models/admin');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await Office.create({ name: 'Head Office', email: 'office@example.com', phone_number: '1234567890', address: '123 Main St' });
  await Admin.create({ email: 'admin@example.com', password: await require('bcrypt').hash('admin123', 10) });
});

afterAll(async () => {
  await sequelize.close();
});

describe('User API', () => {
  it('should create a new user', async () => {
    // First, log in as admin to get token
    const loginRes = await request(app)
      .post('/api/auth/admin/login')
      .send({ email: 'admin@example.com', password: 'admin123' });
    const token = loginRes.body.token;

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        rank: 'Officer',
        blood_group: 'O+',
        mobile_number: '9876543210',
        email: 'user@example.com',
        password: 'password123',
        date_of_birth: '1990-01-01',
        service_start_date: '2015-01-01',
        residential_address: '456 Elm St',
        office_id: 1,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('login_id');
  });
});