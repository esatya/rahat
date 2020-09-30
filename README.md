# Rahat - Blockchain-based Aid Distribution

Rahat is a blockchain-based digital relief distribution management platform for humanitarian agencies to support marginalized communities. It issues, manages and monitors relief distribution in the form of digital tokens. It creates a transparent, efficient and cheaper way to distribute cash or goods. It mobilizes the local community encouraging financial resilience and freedom. For more information please visit https://rahat.esatya.io.

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

## Installing
To setup this software on your machine locally, first clone this repository to your local machine and create a folder named ‘config’ on root of this repository and add local.json file. Click the link to see the sample.

- [local.json](https://gist.github.com/esatya/f873746ef1eb1daed7c280c976b8d392)
    
_If you are trying this in your local machine, please install [Ganache](https://www.trufflesuite.com/ganache)_

1.  Install required dependencies and compile smart contracts
     ```yarn setup```

3. Start the server
    ```yarn start```
    
4. Now, in your browser go to http://localhost:3800/documentation to see API endpoints that are available.

5. Please install Rahat Agency (https://github.com/esatya/rahat-agency) to manage using User Interface.

## Coding Styles
This repository uses eslint to enforce air-bnb coding styles.

# Important: for Production
When you deploy Rahat for production. Please make sure you backup the server's private key securely in an offline wallet, as it will contain some Ethers to perform various server tasks tasks.

# Contributing
Everyone is very welcome to contribute on the codebase of Rahat. Please reach us in Gitter in case of any query/feedback/suggestion.

For more information on the contributing procedure, see [Contribution](https://github.com/esatya/rahat-agency/blob/master/CONTRIBUTING.md)
