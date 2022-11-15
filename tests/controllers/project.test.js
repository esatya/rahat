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

    // it ('multiple beneficiary can be created correctly', async() => {
    //     paylist = [];
    //     payload.currentUser = currentUser;
    //     paylist.push(payload);
    //     benf = await Beneficiary.addMany(paylist);
    //     expect(benf[0]._id).toBeDefined();
    //     expect(benf[0].name).toBe(payload.name);
    // });

    // it('can get Vendor by id', async () => {
    //     const data = await Beneficiary.getbyId(benf._id);
    //     expect(data).toBeDefined();
    //     expect(typeof data).toBe('object');
    //     expect(data.name).toBe(payload.name);
    // });
    //
    // it('should list all the Beneficiary', async () => {
    //     const data = await Beneficiary.list({}, currentUser);
    //     expect(data.data.length).toEqual(1);
    // });
    //
    // it('should update Beneficiary details', async () => {
    //     const dataToUpdate = {
    //         name: 'mountain',
    //         address: 'harisiddhi'
    //     };
    //     const updatedData = await Beneficiary.update(benf._id, dataToUpdate);
    //
    //     expect(updatedData.name).toBe(dataToUpdate.name);
    //     expect(updatedData.address).toBe(dataToUpdate.address);
    // });
    //
    //
    // it('should archive a benf', async () => {
    //     const archivedData = await Beneficiary.remove(benf._id, currentUser._id);
    //
    //     expect(archivedData.is_archived).toBe(true);
    // });
    //
    //
    // it('should add benef to project', async () => {
    //     const proj = await Beneficiary.addToProjectByBenfId(benf._id,'5f6b2f815685931cbfe4dad9' );
    //     expect(proj.projects.length).toBe(2);
    // });
    //
    // ////   checkBeneficiary: req => Beneficiary.checkBeneficiary(req.params.phone),
    // it('should check benef by Phone', async () => {
    //     const proj = await Beneficiary.checkBeneficiary(payload.phone );
    //     expect(proj.message).toBe("Beneficiary Exists");
    // });
    // // //   getReportingData: req => Beneficiary.getReportingData(req.query),
    // it('should get the reports by benef', async () => {
    //     query = {
    //         from:"2021",
    //         to: "2022",
    //         projectId :payload.projects[0]
    //     }
    //     const proj = await Beneficiary.getReportingData(query);
    //     console.log(proj);
    //     expect(proj.message).toBe("Beneficiary Exists");
    // });
    // // //   listBeneficiaryPhones: req => Beneficiary.listBeneficiaryphones(req.query)
    // it('should check benef by Phone', async () => {
    //     const proj = await Beneficiary.checkBeneficiary(payload.phone );
    //     expect(proj.message).toBe("Beneficiary Exists");
    // });
});
