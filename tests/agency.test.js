const dbHandler = require('./db-handler');
const agency = require('../modules/agency/agency.controllers');

const payload = {
  name: 'Santosh Agency',
};

beforeAll(() => dbHandler.connect());
afterAll(() => dbHandler.closeDatabase());

test('adds 1 + 2 to equal 3', () => {
  expect(true).toBe(true);
});

describe('product ', () => {
  it('can be created correctly', async () => {
    expect(() => agency.add({ payload }))
      .not
      .toThrow();
  });
});
