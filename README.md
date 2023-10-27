<p align="center">
   <a href="https://coveralls.io/github/esatya/rahat?branch=master">
    <img src="https://coveralls.io/repos/github/esatya/rahat/badge.svg?branch=master" alt="Coverage" />
  </a>
  <a href="https://github.com/esatya/rahat/blob/main/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
  <a href="https://github.com/esatya/rahat/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-AGPL_v3-blue.svg" alt="License" />
  </a>
</p>

> **Latest Updates:** The content of this repository has been moved to the [rahat-backend repository](https://github.com/rahataid/rahat-backend) due to significant breaking changes. To access the most recent releases, please visit the [rahat-backend releases page](https://github.com/esatya/rahat-backend/releases).

# Rahat - Blockchain-based Aid Distribution

Rahat is a blockchain-based digital relief distribution management platform for humanitarian agencies to support marginalized communities. It issues, manages and monitors relief distribution in the form of digital tokens. It creates a transparent, efficient and cheaper way to distribute cash or goods. It mobilizes the local community encouraging financial resilience and freedom. For more information please visit https://rahat.io . 

Rahat’s main features are:
- Dashboard for aid agencies to issue relief tokens to recipients & to onboard local community vendors. Agencies can audit all transactional information real-time. 
- Mobile based wallet app for local vendors to initiate & record relief token transaction in a blockchain network & cash transfer from banks.
- A SMS feature for recipients to receive their token and/or assigned digital card with QR code to buy relief products from participating local merchants.
- Transaction data in blockchain network to verify the flow of tokens.
- A platform for local authorities & aid agencies to connect.

# Getting started

This is a web-based application with node-js as backend and uses truffle as a tool to compile.
It uses MongoDB as a database for regular non-blockchain data persistence and solidity smart contract to execute transactions on Ethereum blockchain.

## Pre-requisite
To run Rahat in your system please make user you have following app and libraries installed.

- ```Node-js --version == 10.18.1```
- ```Yarn --version == 1.21.1```
- ```MongoDB --version >= 4.2.8```
- ```Truffle --version == 5.1.22```

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

## Installing Rahat Server
To setup this software on your machine locally, first clone this repository to your local machine and create a folder named ‘config’ on root of this repository and add local.json file. Click the link to see the sample.

- [local.json](https://gist.github.com/esatya/f873746ef1eb1daed7c280c976b8d392)
    
_If you are trying this in your local machine, please install [Ganache](https://www.trufflesuite.com/ganache)_

1.  Install required dependencies and compile smart contracts
     ```yarn setup```

2. Start the server
    ```yarn start```
    
3. Now, in your browser go to http://localhost:3800/documentation to see API endpoints that are available.

4. Please install Rahat Agency (https://github.com/esatya/rahat-agency) to manage using User Interface.

## Coding Styles
This repository uses eslint to enforce air-bnb coding styles.

# Important: for Production
When you deploy Rahat for production. Please make sure you backup the server's private key securely in an offline wallet, as it will contain some Ethers to perform various server tasks tasks.

# Contributing
Everyone is very welcome to contribute on the codebase of Rahat. Please reach us in [Discord](https://discord.gg/AV5j2T94VR) in case of any query/feedback/suggestion.

For more information on the contributing procedure, see [Contribution](https://docs.rahat.io/docs/next/Contribution-Guidelines).
