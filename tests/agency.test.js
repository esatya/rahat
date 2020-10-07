const { connectDatabase, closeDatabase } = require('./common');
const { Agency } = require('../modules/agency/agency.controllers');

const payload = {
  name: 'Santosh Agency',
  phone: '98989',
  email: 'san@gamil.com',
  address: 'kupondole',
  token: {
    name: 'SAN',
    symbol: 'SN',
    suppply: '1000000000',
  },
  contracts: {
    rahat: '0xrahat',
    rahat_admin: '0xrahat-admin',
    token: '0xtoken',
  },
};

beforeAll(async () => {
  await connectDatabase();
});
afterAll(async () => {
  await closeDatabase();
});

describe('Agency CRUD ', () => {
  let agency;
  it('can be created correctly', async () => {
    agency = await Agency.add(payload);
    expect(agency._id).toBeDefined();
    expect(agency.name).toBe(payload.name);
  });

  it('can get agency by id', async () => {
    const data = await Agency.getById(agency._id);
    expect(data).toBeDefined();
    expect(typeof data).toBe('object');
    expect(data.name).toBe(payload.name);
  });

  it('should approve agency', async () => {
    const beforeApproved = await Agency.getById(agency._id);
    await Agency.approve(agency._id);
    const afterApproved = await Agency.getById(agency._id);

    expect(beforeApproved.is_approved).toBe(false);
    expect(afterApproved.is_approved).toBe(true);
  });

  it('should update agency details', async () => {
    const dataToUpdate = {
      name: 'Manjik',
      address: 'harisiddhi',
    };
    const updatedData = await Agency.update(agency._id, dataToUpdate);

    expect(updatedData.name).toBe(dataToUpdate.name);
    expect(updatedData.address).toBe(dataToUpdate.address);
  });
});
