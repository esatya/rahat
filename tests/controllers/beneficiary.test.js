const {connectDatabase, closeDatabase, clearDatabase} = require('../common');
const {Vendor, User, Project, Beneficiary} = require('../../modules');
const {
    TokenDistributionModel
} = require('../../modules/models');

const userData = {
    name: 'Manjik',
    email: 'man@gmail.com',
    phone: '9841602388',
    wallet_address: '0x7c0179776BB143a36C9d338F3Fa6149F40BaAc30',
    agency: '5f770576880d16420eaedefb'
};

var projectPayload = {

    name: "Flood Collection",
    end_date: "2023-01-03",
    location: "kathmandu",
    description: "Rescue mission"

}

let currentUser;
    var payload = {
        name: "Disabled Beneficiary",
        phone: "9097879",
        wallet_address: "0x7c0179776BB143a36C9d338F3Fa6149F40BaAc30",
        email: "san@gamil.com",
        address: "kathmandu",
        address_temporary: "kathmandu",
        gender: 'M',
        govt_id: "78945",
        agency: '5f770576880d16420eaedefb',
        projects: "5f6b2f815685931cbfe4dad8"

    }





describe('Beneficiary CRUD', () => {
    let benf;
    let token
    beforeAll(async () => {
        await connectDatabase();
        currentUser = await User.create(userData);
        payload.currentUser = currentUser;
        projectPayload.currentUser = currentUser;
        projectPayload.project_manager = currentUser.id;
        project = await Project.add(projectPayload);
        payload.projects = project.id;
        token= TokenDistributionModel(payload);
    });
    afterAll(async () => {
        await closeDatabase();
    });

    it ('beneficiary can be created correctly', async() => {
        benf = await Beneficiary.add(payload);
        expect(benf._id).toBeDefined();
        expect(benf.name).toBe(payload.name);
    });

    it('can get Vendor by id', async () => {
        const data = await Beneficiary.getbyId(benf._id);
        expect(data).toBeDefined();
        expect(typeof data).toBe('object');
        expect(data.name).toBe(payload.name);
    });

    it('should list all the Beneficiary', async () => {
        const data = await Beneficiary.list({}, currentUser);
        expect(data.data.length).toEqual(1);
    });

    it('should update Beneficiary details', async () => {
        const dataToUpdate = {
            name: 'mountain',
            address: 'harisiddhi'
        };
        const updatedData = await Beneficiary.update(benf._id, dataToUpdate);

        expect(updatedData.name).toBe(dataToUpdate.name);
        expect(updatedData.address).toBe(dataToUpdate.address);
    });


    it('should archive a benf', async () => {
        const archivedData = await Beneficiary.remove(benf._id, currentUser._id);

        expect(archivedData.is_archived).toBe(true);
    });


    it('should add benef to project', async () => {
        const proj = await Beneficiary.addToProjectByBenfId(benf._id,'5f6b2f815685931cbfe4dad9' );
        expect(proj.projects.length).toBe(1);
    });

    it('should check benef by Phone', async () => {
        const proj = await Beneficiary.checkBeneficiary(payload.phone );
        expect(proj.message).toBe("Beneficiary Exists");
    });

    it('should check benef by Phone', async () => {
        const proj = await Beneficiary.checkBeneficiary(payload.phone );
        expect(proj.message).toBe("Beneficiary Exists");
    });

    it('should get the reports by benef', async () => {
        query = {
            from:"2021",
            to: "2022",
            projectId :payload.projects[0]
        }
        const proj = await Beneficiary.getReportingData(query);

        expect(proj.beneficiaryByGroup.totalCount).toBe(1);
    });

});
