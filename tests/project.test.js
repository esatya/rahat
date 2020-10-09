const { connectDatabase, closeDatabase, clearDatabase } = require('./common');
const { User, Project } = require('../modules');
const { ProjectConstants } = require('../constants/index');

const userData = {
  name: 'Manjik',
  email: 'man@gmail.com',
  phone: '9841602388',
  wallet_address: '0x7c0179776BB143a36C9d338F3Fa6149F40BaAc30',
  agency: '5f770576880d16420eaedefb',
};
const payload = {

  name: 'rahat',
  end_date: '2020-10-07',

};
let currentUser;
jest.useFakeTimers();

describe('Project CRUD', () => {
  let project;
  beforeAll(async () => {
    await connectDatabase();
    currentUser = await User.create(userData);
    payload.currentUser = currentUser;
  }, 10000);
  afterAll(async () => {
    await closeDatabase();
  });
  it('can be created correctly', async () => {
    project = await Project.add(payload);
    expect(project._id).toBeDefined();
    expect(project.name).toBe(payload.name);
  });

  it('can get Project by id', async () => {
    const data = await Project.getById(project._id);
    expect(data).toBeDefined();
    expect(typeof data).toBe('object');
    expect(data.name).toBe(payload.name);
  });

  it('should list all the project', async () => {
    const data = await Project.list({ }, currentUser);
    delete payload.currentUser;
    delete payload.end_date;
    expect(data.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining(payload),
      ]),
    );
  });
  it('should update project details', async () => {
    const dataToUpdate = {
      name: 'mountain',
    };
    const updatedData = await Project.update(project._id, dataToUpdate);

    expect(updatedData.name).toBe(dataToUpdate.name);
    expect(updatedData.address).toBe(dataToUpdate.address);
  });

  it('should update project status', async () => {
    const statusToUpdate = {
      status: ProjectConstants.status.Active,
    };

    const beforeUpdate = await Project.getById(project._id);
    await Project.changeStatus(project._id, statusToUpdate);
    const afterUpdate = await Project.getById(project._id);

    expect(beforeUpdate.status).toBe(ProjectConstants.status.Draft);
    expect(afterUpdate.status).toBe(ProjectConstants.status.Active);
  });

  it('should archive a project', async () => {
    const archivedData = await Project.remove(project._id, currentUser._id);

    expect(archivedData.is_archived).toBe(true);
  });
});
