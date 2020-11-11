const common = require('./common');
const { Agency } = require('../modules/agency/agency.controllers');

const payload = {
  name: 'Test agency',
  phone: '9801101234',
  email: 'rahat_test@mailinator.com',
  address: 'Kathmandu',
  token: {
    name: 'Test Token',
    symbol: 'TKN',
    supply: 100000,
  },
};

describe('Agency', () => {
  beforeAll(async () => {
    await common.connectDatabase();
    await Agency.add({
      name: 'First Agency',
    });
  });
  afterAll(async () => {
    await common.closeDatabase();
  });

  let agency;
  it('can be created correctly', async () => {
    agency = await Agency.add(payload);
    expect(agency._id).toBeDefined();
    expect(typeof agency).toBe('object');
    expect(agency.name).toBe(payload.name);
  });
  it('is approved', async () => {
    agency = await Agency.approve(agency._id);
    expect(agency).toBeDefined();
    expect(agency.is_approved).toBe(true);
  });
  it('can list agencies', async () => {
    const agencies = await Agency.list();
    expect(agencies).toBeDefined();
    expect(agencies.length).toBe(2);
  });

  it('can get agency by id', async () => {
    agency = await Agency.getById(agency._id);
    expect(agency).toBeDefined();
    expect(typeof agency).toBe('object');
    expect(agency.name).toBe(payload.name);
    expect(agency.email).toBe(payload.email);
  });
});
