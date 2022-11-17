const fs = require('fs');
const mongoose = require('mongoose');
const config = require('config');
const {Role, App} = require('../modules');

const agencyData = {
  name: 'XYZ Org.',
  phone: '123456789',
  email: 'admin@test.com',
  address: 'Kathmandu',
  admin: {
    name: 'John Doe',
    phone: '123456789',
    email: 'admin@test.com',
    wallet_address: '0x4f58b4B9edDb5Bae7F487e022B45398a136816d0'
  },
  token: {
    name: 'RAHAT',
    symbol: 'RTH',
    supply: 100000000
  }
};

const setupRoles = async () => {
  try {
    await mongoose.connection.collection('roles').drop();
  } catch (e) {}
  const roles = await Role.getValidRoles();
  console.log(roles);
  if (!roles.includes('Admin')) {
    await Role.add({
      name: 'Admin',
      permissions: [
        'agency_read',
        'agency_write',
        'agency_remove',
        'agency_admin',
        'beneficiary_read',
        'beneficiary_write',
        'beneficiary_remove',
        'beneficiary_admin',
        'project_read',
        'project_write',
        'project_remove',
        'project_admin',
        'vendor_read',
        'vendor_write',
        'vendor_remove',
        'vendor_admin',
        'institution_read',
        'institution_write',
        'institution_remove',
        'institution_admin',
        'app_admin',
        'role_admin',
        'user_read',
        'user_write',
        'user_remove',
        'user_admin',
        'mobilizer_read',
        'mobilizer_write',
        'mobilizer_remove',
        'mobilizer_admin'
      ],
      is_system: true
    });
    console.log('super admin role created');
  } else {
    console.log('super admin Role already Created');
  }

  if (!roles.includes('Manager')) {
    await Role.add({
      name: 'Manager',
      permissions: [
        'agency_read',
        'agency_write',
        'agency_remove',
        'agency_admin',
        'project_read',
        'project_write',
        'project_remove',
        'project_admin',
        'beneficiary_read',
        'beneficiary_write',
        'beneficiary_remove',
        'beneficiary_admin',
        'institution_read',
        'institution_write',
        'institution_remove',
        'institution_admin',
        'vendor_read',
        'vendor_write',
        'vendor_remove',
        'vendor_admin',
        'mobilizer_read',
        'mobilizer_write',
        'mobilizer_remove',
        'mobilizer_admin'
      ],
      is_system: true
    });
    console.log('Manager Role Created');
  } else {
    console.log('Manager Role already Created');
  }

  if (!roles.includes('Mobilizer')) {
    await Role.add({
      name: 'Mobilizer',
      permissions: [
        'agency_read',
        'agency_write',
        'agency_remove',
        'agency_admin',
        'project_read',
        'project_write',
        'project_remove',
        'project_admin',
        'beneficiary_read',
        'beneficiary_write',
        'beneficiary_remove',
        'beneficiary_admin',
        'institution_read',
        'institution_write',
        'institution_remove',
        'institution_admin',
        'vendor_read',
        'vendor_write',
        'vendor_remove',
        'vendor_admin'
      ],
      is_system: true
    });
    console.log('Mobilizer Role Created');
  } else {
    console.log('Mobilizer Role already Created');
  }

  console.log('All roles setup Completed');
};

const runSetup = async () => {
  mongoose.connect(config.get('app.db'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });

  await setupRoles();
  console.log('Setting up your app');
  await App.setup(agencyData);
  console.log('Setup Completed');
};

runSetup()
  .then()
  .catch(e => console.log('ERROR: ', e.message));
