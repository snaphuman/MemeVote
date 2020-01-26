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
are pushed only when its functional state is stable.

### Http server
As MemeVote daepp design is browser based, which means that its javascript
modules like the aepps SDK, vue.js libraries and so forth are loaded by html
script tags, it should be deployed with an http-server in a predefined port
instead of loading the index.html file directly in the browser.

## Aepp Architecture
This Aepp has two main components: 1) the identity provider and 2) the Aeep
itself. The first one implements the wallet and connects to the network and the
second uses the [Web Aepp
flavor](https://github.com/aeternity/aepp-sdk-js/blob/develop/docs/api/ae/aepp.md)
to interact with whe deployed contract. These components are integrated via RPC,
so all methods from the Aepp are confirmed by the wallet.

For this deployment we will use
[aepp-aeproject-shape-vue](https://github.com/aeternity/aepp-aeproject-shape-vue)
project, as it implements an identity provider which may be configured
accordingly to our needs.

TODO: Components diagram

TODO: Sequence diagram

## Running the project 

* Create an empty directory which will hold the node infraestructure, the
  identity provider and the MemeVote Aepp:
  
  ``` shell
  mkdir MemeVote-aeproject
  ``` 
  
* Install aeproject globally

  ``` shell
  npm install -g aeproject
  ```

* Initialize aeproject

  ``` shell
  cd MemeVote-aeproject
  aeproject init
  ```

* Clone the MemeVote daepp

  ``` shell
  git clone https://github.com/aeternity/aepp-aeproject-js

  ```
  
* Clone aepp-aeproject-shape-vue

  I have forked this [awesome
  project](https://github.com/aeternity/aepp-aeproject-shape-vue) because it
  includes the base functionality of the identity provider, which is in other
  words a configurable wallet. This fork add some UI improvements that
  facilitates the configuration and conntection to the network. Try it out!

  ``` shell
  git clone https://github.com/snaphuman/aepp-aeproject-shape-vue.git 

  ```

  On each cloned repository folder (MemeVote and aepp-aeproject) fetch all their
  dependencies.

  ``` shell
  npm install

  ```

* Run both applications

  ``` shell
  # In Meme vote folder run:
  npm start

  # In aepp-aeproject-shape-vue run:
  npm run serve

  ```

  At this point both applications can be accessed in the browser at
  http://localhost:8080 abd http://localhost:8081 respectively. 

## Enable blockchain interaction

Both applications are running, but there are some tasks to be completed to make
them work properly: 1) Initialize aeternity nodes and compiler, 2) deploy the
contract, 3) configure the wallet, 4) setup the contract address in MemeVote
daepp.

### Intitialize aeternity nodes and compiler

As described before, AEproject was installed globally in our local machine and
initialized inside the MemeVote-aeproject folder. This initialization created
many files and folders related to docker and smart contract interactions. This
means that all operations with the nodes and contract should be executed at that
path level.

*note:* To run aeternity nodes make sure to have docker service up and running.

* Initialize aeternity nodes
  ``` shell
  aeproject node

  ```

  At the end of this process, the nodes should be successfully started and the
  default wallets should be successfully funded.

  ``` shell
  ===== Starting Node =====
  Creating network "memevote-aeproject_default" with the default driver

  Creating memevote-aeproject_node1_1 ... done
  Creating memevote-aeproject_proxy_1 ... done
  Creating memevote-aeproject_node3_1 ... done
  Creating memevote-aeproject_node2_1 ... done

  .................
  ===== Node was successfully started! =====
  ===== Funding default wallets! =====
  Miner ------------------------------------------------------------
  public key: ak_2mwRmUeYmfuW93ti9HMSUJzCk1EYcQEfikVSzgo6k2VghsWhgU
  private key: bb9f0b01c8c9553cfbaf7ef81a50f977b1326801ebf7294d1c2cbccdedf27476e9bbf604e611b5460a3b3999e9771b6f60417d73ce7c5519e12f7e127a1225ca
  Wallet's balance is 750440000000000000000
  ...
  ...
  ...
  ```
  
  *note:* If you are running docker within a machine with selinux enabled, you
  should run containers in privileged mode. This can be achieved adding the
  `privileged: true` option for each container in the services block in the
  `docker-compose.yml` file as follows: 
  
  ``` shell
  node1:
    image: aeternity/aeternity:v5.0.2
    hostname: node1
    privileged: true
    environment:
      AETERNITY_CONFIG: /home/aeternity/aeternity.yaml
    command: >
       bin/aeternity console -noinput -aehttp enable_debug_endpoints true
    volumes:
      - ./docker/aeternity_node1_mean15.yaml:/home/aeternity/aeternity.yaml
      - ./docker/keys/node1:/home/aeternity/node/keys
    ....
    ....
    ....
  
  ```

* Initialize aesophia compiler
  ``` shell
  aeproject compiler

  ```

  At the end of this procees the compiler should be successfully started

  ``` shell
  ===== Starting Compiler =====

  Creating memevote-aeproject_compiler_1 ...
  Creating memevote-aeproject_compiler_1 ... done
  .
  ..................
  ===== Compiler was successfully started! =====

  ```

  Finally you can list existing docker containers

  ``` shell
  docker ps

  CONTAINER ID        IMAGE                            COMMAND                  CREATED             STATUS                    PORTS                                      NAMES
  e3e1b576a07a        aeternity/aesophia_http:v4.0.0   "/docker-entrypoin..."   2 minutes ago       Up 2 minutes (healthy)    0.0.0.0:3080->3080/tcp                     memevote-aeproject_compiler_1
  2f0e9a20415c        aeternity/aeternity:v5.0.2       "bin/aeternity con..."   11 minutes ago      Up 11 minutes (healthy)   3013-3015/tcp, 3113/tcp                    memevote-aeproject_node3_1
  e4793f9841f8        aeternity/aeternity:v5.0.2       "bin/aeternity con..."   11 minutes ago      Up 11 minutes (healthy)   3013-3015/tcp, 3113/tcp                    memevote-aeproject_node2_1
  ae58970cad24        nginx:1.13.8                     "nginx -g 'daemon ..."   11 minutes ago      Up 11 minutes             80/tcp, 0.0.0.0:3001-3003->3001-3003/tcp   memevote-aeproject_proxy_1
  7a93a030c23c        aeternity/aeternity:v5.0.2       "bin/aeternity con..."   11 minutes ago      Up 11 minutes (healthy)   3013-3015/tcp, 3113/tcp                    memevote-aeproject_node1_1

  ```

### Deploy sophia smart contract

* First we need to add the MemeVote contract to the Deployer configuration in
the `./deployment/deploy.js` file. Note that during initialization, aeproject
created an example contract which can be keeped or replaced for the new one.

  ``` javascript
    const Deployer = require('aeproject-lib').Deployer;

    const deploy = async (network, privateKey, compiler, networkId) => {
        let deployer = new Deployer(network, privateKey, compiler, networkId)

        await deployer.deploy("./contracts/ExampleContract.aes")
        await deployer.deploy("./MemeVote/contracts/MemeVote.aes")
    };

    module.exports = {
        deploy
    };

  ```

* Run the deploy operation

  ``` shell
  aeproject deploy

  ===== Contract: ExampleContract.aes has been deployed at ct_2TjCTxSiLyQ3ADMTiozZPYkYnLQ1NSXaLp9GD7jX7tpJGoaJsd =====
  ===== Contract: MemeVote.aes has been deployed at ct_2n1MVAiBLWi7zK4dm4UvAfrziu4xK1AKE9zcYC99TKeiPw2LKN =====
  Your deployment script finished successfully!

  ```
  
  This operation by default deploys the contract on the local network. We can
  use the following options to deploy the contract in the testnet:

  ``` shell
  aeproject deploy --network "https://sdk-testnet.aepps.com" --networkId "ae_uat" --compiler "https://compiler.aepps.com"

  ```
  
* Verify the deployed contract

  Once the contract is deployed it can be verified in the network
  
  ``` shell
  aeproject history
  
  | Event Time    | 25 Jan, 07:31:15                                      |
  |---------------|-------------------------------------------------------|
  │ Public Key    │ ak_2mwRmUeYmfuW93ti9HMSUJzCk1EYcQEfikVSzgo6k2VghsWhgU │
  |---------------|-------------------------------------------------------|
  │ Executor      │ Deployer                                              │
  |---------------|-------------------------------------------------------|
  │ Name or Label │ MemeVote                                              │
  |---------------|-------------------------------------------------------|
  │ Tx Hash       │ th_2Ly2WUuQ4dJwbNuCc6PmUQ5jVva9AgVRB7T1nA91xACvtgqnGQ │
  |---------------|-------------------------------------------------------|
  | Status        │ Success                                               │
  |---------------|-------------------------------------------------------|
  │ Gas Price     │ 1000000000                                            │
  |---------------|-------------------------------------------------------|
  │ Gas Used      │ 110                                                   │
  |---------------|-------------------------------------------------------|
  │ Result        │ ct_ptyi4G4GehmMYNM1gwDTVKGrUesgbVthZgp2762dTyhoEX188  │
  |---------------|-------------------------------------------------------|
  │ Network ID    │ ae_devnet                                             │
  |---------------|-------------------------------------------------------|

  ```
  Note that if you deploy the contract on the testnet or the local network, it
  appears referenced in the Network ID field of the returned table.
  
  Also, if the contract was deployed on the testnet, it can be verified
  online in the aeternity network explorer at https://explorer.testnet.aeternity.io/

### Configure wallet

As I mentioned before, I have forked the aepp-aeproject-shape-vue that adds a
ConfigClient component which provides a form that allows to input the public and
private key of the wallet account, select the network to connect to, and input
the url of the MemeVote aepp.

https://i.imgur.com/7WEWDEF.gif

Instead of use this fork we can use the original aepp-aeproject-shape-vue but it
has to be configured directly in the source code replacing the values in the
`./src/account.js` and `./src/components/Home.vue` files in the
identity-provider folder. 
