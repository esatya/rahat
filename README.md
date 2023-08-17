# Rahat - Blockchain-based Aid Distribution

Rahat is a blockchain-based digital relief distribution management platform for humanitarian agencies to support marginalized communities. It issues, manages and monitors relief distribution in the form of digital tokens. It creates a transparent, efficient and cheaper way to distribute cash or goods. It mobilizes the local community encouraging financial resilience and freedom. For more information please visit https://rahat.io . 

Rahat’s main features are:
- Dashboard for aid agencies to issue relief tokens to recipients & to onboard local community vendors. Agencies can audit all transactional information real-time. 
- Mobile based wallet app for local vendors to initiate & record relief token transaction in a blockchain network & cash transfer from banks.
- A SMS feature for recipients to receive their token and/or assigned digital card with QR code to buy relief products from participating local merchants.
- Transaction data in blockchain network to verify the flow of tokens.
- A platform for local authorities & aid agencies to connect.

# Getting started

This is a web-based application with node-js as backend with nest-js framework.
It uses Postgres as a database for regular non-blockchain data persistence and solidity smart contract to execute transactions on Ethereum blockchain.

## Pre-requisite
To run Rahat in your system please make user you have following app and libraries installed.

- ```Node-js --version >= 16.x.x```
- ```Yarn --version >= 1.22.x```
- ```Postgresql --version >= 14.6```


## Complete Rahat Package
Currently, Rahat consists four applications. For complete aid distribution process all four applications have to be installed and setup.

1. **Rahat Server**: 

This is the main server (this project) which provides API services for other applications. It also contains source code for solidity smart contracts that needs to be compliled and deployed to Ethereum network of your choice. Please deploy this application before deploying other projects.

2. **Agency Dashboard** (https://github.com/esatya/rahat-agency): 

This project is react-based dashboard for managing Rahat for agencies. It utilizes API to connect to the server and can directly communicate with Ethereum network using Metamask. After installing the server, you can use this app to setup Rahat in user-friendly way.

3. **OTP Server** (https://github.com/esatya/rahat-otp): 

It is a stand alone server to manage OTP that it sent to beneficiary phone during a transaction. This service adds hash of OTP to the smart-contract that should match with the OTP sent by the vendor to complete the transaction. Use your favorite SMS service like Twilio, GOIP as plugins to send SMS.

4. **Vendor Web-based App** (https://github.com/esatya/rahat-vendor) 

This is a mobile friendly vendor user interface that can request fund from beneficiary account after beneficiary provide OTP to the vendor. It is a fully functioning mobile wallet that vendor can use to transfer fund to the bank or back to the agency to redeem local currency.

5. **Mobilizer Web-based App** (https://github.com/esatya/rahat-mobilizer) 

This is a mobile friendly mobilizer user interface that can onboard beneficiries to the agency. It is a fully functioning mobile wallet that mobilizer can use to register beneficiaries and issue token to them.

6. **Mobile-based vendor app** (https://github.com/esatya/rahat-vendor-app) 

Rahat Vendor app is a wallet-based mobile app for the vendors of Rahat. It is used by the vendors, who provides aid material to beneficiaries in exchange of token, to receive and redeem token.

7. **Rahat Documentation** (https://github.com/esatya/rahat-documentation) 

This is a documentation website of Rahat built using [Docusaurus 2](https://docusaurus.io/). It is mainly focused on the technical documents of Rahat. 

8. **Rahat UAT** (https://github.com/esatya/rahat-uat) 

This includes the UI/UX User Acceptance Testing of Rahat Applications. 

9. **Rumsan wallet**

This is the wallet used by agencies to login and sign transactions in agency app.


![Rahat - System Workflow](https://pbs.twimg.com/media/Erl_kZdUUAActLM?format=jpg&name=medium)

## Installation

Install the dependencies and devDependencies of the server.
```bash
$ yarn install
```

Generate the database migration files and run the migration.
```bash
npx generate
```

Copy the .env.example file to .env and update the values accordingly.
```bash
$ cp .env.example .env
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Coding Styles
This repository uses eslint to enforce air-bnb coding styles. Please make sure you have eslint installed in your IDE and follow the coding styles.

# Contributing
Everyone is very welcome to contribute on the codebase of Rahat. Please reach us in [Discord](https://discord.gg/AV5j2T94VR) in case of any query/feedback/suggestion.

For more information on the contributing procedure, see [Contribution](https://docs.rahat.io/docs/next/Contribution-Guidelines).

## License

Rahat is built under AGPL 3.0 License
