module.exports = {
	migrations_directory: './contracts/src/migrations',
	contracts_build_directory: './build',
	contracts_directory: './contracts/src/contracts',
	networks: {
		development: {
			host: 'localhost',
			port: 7545,
			gas: 7000000,
			network_id: '*'
		}
	},
	compilers: {
		solc: {
			version: '0.6.4' // Fetch exact version from solc-bin (default: truffle's version)
		}
	}
};
