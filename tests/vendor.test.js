const { connectDatabase, closeDatabase, clearDatabase } = require('./common');
const { Vendor, User } = require('../modules');

const userData = {
  name: 'Manjik',
  email: 'man@gmail.com',
  phone: '9841602388',
  wallet_address: '0x7c0179776BB143a36C9d338F3Fa6149F40BaAc30',
  agency: '5f770576880d16420eaedefb',
};
const payload = {
  name: 'Alice Vendor',
  wallet_address: '0xasdfyiuy',
  phone: '90909',
  email: 'san@gamil.com',
  address: 'kupondole',
  govt_id: '12454',

};
let currentUser;

describe('Vendor CRUD', () => {
  let vendor;
  beforeAll(async () => {
    await connectDatabase();
    currentUser = await User.create(userData);
    payload.currentUser = currentUser;
  });
  afterAll(async () => {
    await closeDatabase();
  });
  it('can be created correctly', async () => {
    vendor = await Vendor.add(payload);
    expect(vendor._id).toBeDefined();
    expect(vendor.name).toBe(payload.name);
  });

  it('can get Vendor by id', async () => {
    const data = await Vendor.getbyId(vendor._id);
    expect(data).toBeDefined();
    expect(typeof data).toBe('object');
    expect(data.name).toBe(payload.name);
  });

  it('can get Vendor by wallet', async () => {
    const data = await Vendor.getbyWallet(vendor.wallet_address);
    expect(data).toBeDefined();
    expect(typeof data).toBe('object');
    expect(data.name).toBe(payload.name);
  });

  it('should list all the vendor', async () => {
    const data = await Vendor.list({ }, currentUser);

    delete payload.currentUser;
    delete payload.agencies;
    expect(data.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining(payload),
      ]),
    );
  });
  it('should update vendor details', async () => {
    const dataToUpdate = {
      name: 'mountain',
      address: 'harisiddhi',
    };
    const updatedData = await Vendor.update(vendor._id, dataToUpdate);

    expect(updatedData.name).toBe(dataToUpdate.name);
    expect(updatedData.address).toBe(dataToUpdate.address);
  });

  it('should archive a vendor', async () => {
    const archivedData = await Vendor.remove(vendor._id, currentUser._id);

    expect(archivedData.is_archived).toBe(true);
  });
});
