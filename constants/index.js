const CONSTANTS = {
  ENV: {
    PRODUCTION: 'production',
    DEVELOPMENT: 'development',
    TEST: 'test'
  },
  ROLES: {ADMIN: 'Admin', MANAGER: 'Manager', MOBILIZER: 'Mobilizer'},
  Model: {
    Test: 'test',
    Agent: 'agent',
    Agency: 'agency',
    Beneficiary: 'beneficiary',
    Vendor: 'vendor',
    Project: 'project',
    Institution: 'institution'
  },
  Contract: {
    RahatAdmin: 'RahatAdmin',
    Rahat: 'Rahat',
    AidToken: 'AidToken',
    RahatERC20: 'RahatERC20',
    RahatERC1155: 'RahatERC1155'
  },
  ProjectConstants: {
    status: {
      Draft: 'draft',
      Active: 'active',
      Suspended: 'suspended',
      Closed: 'closed'
    }
  },
  InstitutionConstants: {
    status: {
      Active: 'active',
      Suspended: 'suspended',
      Closed: 'closed'
    }
  },
  VendorConstants: {
    status: {
      New: 'new',
      Active: 'active',
      Suspended: 'suspended'
    }
  },
  MobilizerConstants: {
    status: {
      New: 'new',
      Active: 'active',
      Suspended: 'suspended'
    }
  },
  TransactionConstants: {
    status: {
      New: 'new',
      Signed: 'signed',
      Pending: 'pending',
      Rejected: 'rejected',
      Error: 'error',
      Complete: 'complete'
    }
  },
  RowType: {
    Example: 'EXAMPLE',
    Response: 'RESPONSE'
  },
  BROADCAST_TYPE: {
    vendor_registered: (name = '', date = '') => ({
      title: 'New Vendor Registered',
      notificationType: 'Vendor Registered',
      message: `${name} registered as a Vendor at ${date}`
    }),

    mobilizer_registered: (name = '', date = '') => ({
      title: 'New Mobilizer Registered',
      notificationType: 'Mobilizer Registered',
      message: `${name} registered as a Mobilizer at ${date}`
    })
  },
  NOTIFICATION_ENUMS: () => {
    const enums = [
      ...Object.keys(CONSTANTS.BROADCAST_TYPE).map(
        item => CONSTANTS.BROADCAST_TYPE[item]().notificationType
      )
    ];
    return enums;
  }
};

module.exports = CONSTANTS;
