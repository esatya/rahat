import PRIVATE_KEYS_ADMIN from '../config/privateKeys/admin.json';
import PRIVATE_KEYS_DEPLOYER from '../config/privateKeys/deployer.json';
import PRIVATE_KEYS_DONOR from '../config/privateKeys/donor.json';
import PRIVATE_KEYS_SERVER from '../config/privateKeys/server.json';

export const PORT = process.env.PORT || '5400';

export {
  PRIVATE_KEYS_ADMIN,
  PRIVATE_KEYS_DEPLOYER,
  PRIVATE_KEYS_DONOR,
  PRIVATE_KEYS_SERVER,
};

export enum ROLES {
  ADMIN = 'admin',
  User = 'user',
}

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}
