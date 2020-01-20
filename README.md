# MemeVote (Developer Notes)
This is a descentralized application of the
[aeternity](https://github.com/aeternity) blockchain (daepp) that allows to
register, tag, comment and vote user memes referenced by url. This daepp is the
result of the Aeternity Development 101 course from
[dacade.org](https://dacade.org/) platform, which is a great community that
enforces people to learn about this exciting technology.

## About this repo
My intend of writing this readme, is to share my experience with the development
workflow and the tooling that allowed me to reach and understand the daepp
architecture and the interactions with the aeternity blockchain.

## Motivation
The aeternity ecosystem is fullfilled of a great toolset like sdk's for many
languages and online tools wich makes possible the interaction with the
blockchain and the development of descentralized apps. Some of these
applications are the [Base Aepp](https://base.aepps.com/) which has a lot of
functionalities like wallet management, token transactions, and identity
provider for embedded applications. On the other hand we have the contract
editor that allows to compile, deploy and test [sophia smart
contracts](http://aeternity.com/documentation-hub/protocol/contracts/sophia/).

The Base Aepp is a great tool for testing applicactions convined with the [smart
contract editor](https://testnet.contracts.aepps.com/), however, the development
workflow over these online aepps tends to be very slow, as the code either the contract
needs to be tested many times until they reaches the desired functional state.
For this reason is recommended to enable a local development environment that
allows to interact with the blockchain, deploy contracts and test the
applications in our local machine.

## Toolset
*note:* the scope of this doc is focused on the development of the MemeVote
daepp, as this can be applied to other projects, the procedure may vary
depending on the technological approach.

### Aeproject
[Aeproject](https://github.com/aeternity/aepp-aeproject-js) is an amazing
project that provides a command line interface to deploy, compile and
test smart contracts. The most interesting feature is that it provides the
infraestructure through docker containers to deploy an aeternity node locally
which allows to interact with the network.

### Git
Make control version to the source code is a good practice that keeps track of
the changes during development. As this daepp is deployed as Github page, changes
are pushed only when its state of is functional.

### Http server
As MemeVote daepp design is browser based, which means that its javascript
modules like the aepps SDK, vue.js libraries and so forth are loaded by html
script tags, it should be deployed with an http-server in a predefined port
instead of loading the index.html file in the browser.

## Aepp Architecture
This Aepp has two main components: 1) the identity provider and 2) the Aeep
itself. The first one implements the wallet and connects to the network and the
second uses the [Web Aepp
flavor](https://github.com/aeternity/aepp-sdk-js/blob/develop/docs/api/ae/aepp.md)
to interact with whe deployed contract. These components are integrated via RPC,
so all methods from the Aepp are confirmed by the wallet.

For this deployment we will use aepp-aeproject-shape-vue project, as it
implements an identity provider which and configure it accordingly to our needs

TODO: Components diagram
TODO: Sequence diagram

## Running the project 

* Create an empty directory which will hold the node infraestructure, the
  identity provider and the MemeVote Aepp:
  
  ```
  mkdir MemeVote-aeproject
  ``` 
  
* Install aeproject globally

  ```
  npm install -g aeproject
  ```

* Initialize aeproject

  ```
  cd MemeVote-aeproject
  aeproject init
  ```

* Clone the MemeVote daepp

  ```
  git clone https://github.com/aeternity/aepp-aeproject-js

  ```
  
* Clone aepp-aeproject-shape-vue

I have forked this [awesome
project](https://github.com/aeternity/aepp-aeproject-shape-vue) because it
includes the base functionality of the identity provider, which is in other
words a configurable wallet. This fork udd some UI improvements that facilitates
the configuration and conntection to the network. Try it out!

  ```
  git clone https://github.com/snaphuman/aepp-aeproject-shape-vue.git 

  ```
