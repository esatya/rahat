const { connectDatabase, closeDatabase } = require('./common');
const { Beneficiary, User } = require('../modules');

const userData = {
  name: 'Manjik',
  email: 'man@gmail.com',
  phone: '9841602388',
  wallet_address: '0x7c0179776BB143a36C9d338F3Fa6149F40BaAc30',
  agency: '5f770576880d16420eaedefb',
};
const payload = {
  name: 'Alice Beneficiary',
  wallet_address: '0xasdfyiuy',
  phone: '90909',
  email: 'san@gamil.com',
  address: 'kupondole',
  address_temporary: 'jhasikhel',
  govt_id: '12454',
  project_id: '5f7bdb391c01bfbb1a6b5965',
};
let currentUser;

beforeAll(async () => {
  await connectDatabase();
  currentUser = await User.create(userData);
  payload.currentUser = currentUser;
});
afterAll(async () => {
  await closeDatabase();
});

describe('Beneficiary CRUD', () => {
  let beneficiary;
  it('can be created correctly', async () => {
    beneficiary = await Beneficiary.add(payload);
    expect(beneficiary._id).toBeDefined();
    expect(beneficiary.name).toBe(payload.name);
  });

  it('can get Beneficiary by id', async () => {
    const data = await Beneficiary.getbyId(beneficiary._id);
    expect(data).toBeDefined();
    expect(typeof data).toBe('object');
    expect(data.name).toBe(payload.name);
  });

  it('can get Beneficiary by wallet', async () => {
    const data = await Beneficiary.getbyWallet(beneficiary.wallet_address);
    expect(data).toBeDefined();
    expect(typeof data).toBe('object');
    expect(data.name).toBe(payload.name);
  });

  it('should list all the beneficiary', async () => {
    const data = await Beneficiary.list({ }, currentUser);
    delete payload.project_id;
    delete payload.currentUser;
    delete payload.projects;
    expect(data.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining(payload),
      ]),
    );
  });
  it('should update beneficiary details', async () => {
    const dataToUpdate = {
      name: 'mountain',
      address: 'harisiddhi',
    };
    const updatedData = await Beneficiary.update(beneficiary._id, dataToUpdate);

    expect(updatedData.name).toBe(dataToUpdate.name);
    expect(updatedData.address).toBe(dataToUpdate.address);
  });

  it('should archive a beneficiary', async () => {
    const archivedData = await Beneficiary.remove(beneficiary._id, currentUser._id);

    expect(archivedData.is_archived).toBe(true);
  });
});
