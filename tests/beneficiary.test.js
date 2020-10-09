const { connectDatabase, closeDatabase, clearDatabase } = require('./common');
const { Beneficiary, User, Project } = require('../modules');

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
jest.useFakeTimers();
describe('Beneficiary CRUD', () => {
  let beneficiary;

  beforeAll(async () => {
    await connectDatabase();
    currentUser = await User.create(userData);
    payload.currentUser = currentUser;
  }, 10000);
  afterAll(async () => {
    await closeDatabase();
  });
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

  it('should add beneficiary to new project', async () => {
    const projectData = {
      name: 'rahat',
      end_date: '2020-10-07',
    };
    projectData.currentUser = currentUser;
    const project = await Project.add(projectData);

    const beforeAddingProject = await Beneficiary.getbyId(beneficiary._id);
    await Beneficiary.addToProject({ id: beneficiary._id, project_id: project._id });

    const afterAddingProject = await Beneficiary.getbyId(beneficiary._id);

    expect(beforeAddingProject.projects).not.toContain(project._id);
    expect(afterAddingProject.projects).toContainEqual(project._id);
  });

  it('should archive a beneficiary', async () => {
    const archivedData = await Beneficiary.remove(beneficiary._id, currentUser._id);

    expect(archivedData.is_archived).toBe(true);
  });
});
