module.exports = {
	ENV: {
		PRODUCTION: 'production',
		DEVELOPMENT: 'development',
		TEST: 'test'
	},
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
		Rahat_ERC20: 'rahat_erc20',
		Rahat_ERC1155: 'rahat_erc1155'
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
	}
};
