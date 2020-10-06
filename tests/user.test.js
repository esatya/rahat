const common = require('./common');
const { User } = require('../modules/user/user.controllers');

const userData = {
  name: 'Test User',
  email: 'rahat-test@mailinator.com',
  phone: '9801234567',
  wallet_address: '0x7c0179776BB143a36C9d338F3Fa6149F40BaAc30',
  agency: '5f770576880d16420eaedefb',
};

describe('User Model Test', () => {
  beforeAll(() => common.connectDatabase(), 90000);
  afterAll(() => common.closeDatabase());

  it('create & save user successfully', async () => {
    const savedUser = await User.create(userData);

    expect(savedUser._id).toBeDefined();
    expect(savedUser.phone).toBe(userData.phone);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.wallet_address).toBe(userData.wallet_address);
  });
});
