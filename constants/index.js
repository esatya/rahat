module.exports = {
  ENV: {
    PRODUCTION: 'production',
    DEVELOPMENT: 'development',
    TEST: 'test',
  },
  Model: {
    Test: 'test',
    Agent: 'agent',
    Agency: 'agency',
    Beneficiary: 'beneficiary',
    Vendor: 'vendor',
    Project: 'project',
  },
  Contract: {
    RahatAdmin: 'RahatAdmin',
    Rahat: 'Rahat',
    AidToken: 'AidToken',
  },
  ProjectConstants: {
    status: {
      Draft: 'draft',
      Active: 'active',
      Suspended: 'suspended',
      Closed: 'closed',
    },
  },
  VendorConstants: {
    status: {
      New: 'new',
      Active: 'active',
      Suspended: 'suspended',
    },
  },
  TransactionConstants: {
    status: {
      New: 'new', Signed: 'signed', Pending: 'pending', Rejected: 'rejected', Error: 'error', Complete: 'complete',
    },
  },
  RowType: {
    Example: 'EXAMPLE',
    Response: 'RESPONSE',
  },
};
