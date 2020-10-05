const dbHandler = require('./db-handler');
const { Agency } = require('../modules/agency/agency.controllers');
const { getExpectedBodyHash } = require('twilio/lib/webhooks/webhooks');

const payload = {
  name: 'Santosh Agency',
};

beforeAll(() => dbHandler.connect());
afterAll(() => dbHandler.closeDatabase());

describe('Agency CRUD ', () => {
  let agencyId;
  it('can be created correctly', async () => {

    let agency = await Agency.add(payload);
    agencyId = agency._id;
    expect(agencyId).toBeDefined();
    expect(agency.name).toBe(payload.name);
  });

  it('can get agency by id', async () => {


    let agency = await Agency.getById(agencyId);

    expect(agency).toBeDefined();
    expect(typeof agency).toBe('object');
    expect(agency.name).toBe(payload.name);

  })

});
