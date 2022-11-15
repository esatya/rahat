const {connectDatabase, closeDatabase, clearDatabase} = require('../common');
const {Vendor, User, Project} = require('../../modules');

const userData = {
  name: 'Manjik',
  email: 'man@gmail.com',
  phone: '9841602388',
  wallet_address: '0x7c0179776BB143a36C9d338F3Fa6149F40BaAc30',
  agency: '5f770576880d16420eaedefb'
};
const payload = {
  name: 'Alice Vendor',
  wallet_address: '0xasdfyiuy',
  phone: '90909',
  email: 'san@gamil.com',
  address: 'kupondole',
  govt_id: '12454',
    projects: "5f6b2f815685931cbfe4dad8"
};

var projectPayload = {
    name: "Flood Collection",
    end_date: "2023-01-03",
    location: "kathmandu",
    description: "Rescue mission",
    allocations: [
        {
            date: "2022-01-01",
            amount: 100,
            txhash: "0x7c0179776BB143a36C9d338F3Fa6149F40BaAc30",
            success: true
        }
    ]

}

let currentUser;
let projects;

describe('Vendor CRUD', () => {
  let vendor;
  beforeAll(async () => {
    await connectDatabase();
    currentUser = await User.create(userData);
    payload.currentUser = currentUser;
      projectPayload.currentUser = currentUser;
      projectPayload.project_manager = currentUser.id;
      projects = await Project.add(projectPayload);
      payload.projects = projects.project.id
      console.log('payloads are,<><><><><><><>',payload,projects)
      console.log(payload)
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
    const data = await Vendor.list({}, currentUser);
    delete payload.currentUser;
    delete payload.agencies;
    delete payload.photo;
    delete payload.projects;
    expect(data.data).toEqual(expect.arrayContaining([expect.objectContaining(payload)]));
  });


    it('should get report by Vendor', async () => {
        let
            query = {
                from:"2021-01-01",
                to: "2023-01-01",
                projectId :projects.project.id
            }
        const reportData = await Vendor.getReportingData(query);

        expect(reportData.vendorExportData[0].Name).toBe(payload.name);
    });


  it('should update vendor details', async () => {
    const dataToUpdate = {
      name: 'mountain',
      address: 'harisiddhi'
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
