const {connectDatabase, closeDatabase, clearDatabase} = require('../common');
const {Vendor, User, Beneficiary, Project} = require('../../modules');

const userData = {
    name: 'Manjik',
    email: 'man@gmail.com',
    phone: '9841602388',
    wallet_address: '0x7c0179776BB143a36C9d338F3Fa6149F40BaAc30',
    agency: '5f770576880d16420eaedefb'
};

let currentUser;
var payload = {
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





describe('Project CRUD', () => {
    let benf;
    let token
    beforeAll(async () => {
        await connectDatabase();
        currentUser = await User.create(userData);
        payload.currentUser = currentUser;
        payload.project_manager = currentUser.id;
    });
    afterAll(async () => {
        await closeDatabase();
    });

    it ('project can be created correctly', async() => {
        benf = await Project.add(payload);
        expect(benf.project._id).toBeDefined();
        expect(benf.project.name).toBe(payload.name);
    });
});
