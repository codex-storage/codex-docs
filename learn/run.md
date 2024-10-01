---
outline: [2, 4]
---
# Run Codex

As for now, Codex is implemented only in [Nim](https://nim-lang.org) and can be found in [nim-codex](https://github.com/codex-storage/nim-codex) repository.

It is a command-line application which may be run in a different ways:
 - [Using binary](#using-binary)
 - [Run as a daemon in Linux](#run-as-a-daemon-in-linux) (not supported yet)
 - [Run as a service in Windows](#run-as-a-service-in-windows) (not supported yet)
 - [Using Docker](#using-docker)
 - [Using Docker Compose](#using-docker-compose)
 - [On Kubernetes](#on-kubernetes)

During the run, it is required to pass [configuration](#configuration) option to the application, which can be done in a different ways.

## Configuration

It is possible to configure Codex node in several ways:
 1. [CLI options](#cli-options)
 2. [Environment variables](#environment-variables)
 3. [Configuration file](#configuration-file)

The order of priority is the same as above:  
[CLI options](#cli-options) --> [Environment variables](#environment-variables) --> [Configuration file](#configuration-file).

### Common information

#### Units

For some configuration options, we can pass values in common units like following:
```shell
--cache-size=1m/1M/1mb/1MB
--storage-quota=2m/2M/2mb/2MB

--block-mi=1s/1S/1m/1M/1h/1H/1d/1D/1w/1W
--block-ttl=2s/2S/2m/2M/2h/2H/2d/2D/2w/2W
```

#### Logging

Codex uses [Chronicles](https://github.com/status-im/nim-chronicles) logging library, which allows great flexibility in working with logs.
Chronicles has the concept of topics, which categorize log entries into semantic groups.

Using the `log-level` parameter, you can set the top-level log level like `--log-level="trace"`, but more importantly,
you can set log levels for specific topics like `--log-level="info; trace: marketplace,node; error: blockexchange"`,
which sets the top-level log level to `info` and then for topics `marketplace` and `node` sets the level to `trace` and so on.

### CLI options

```shell
codex --help

Usage:

codex [OPTIONS]... command

The following options are available:

     --config-file          Loads the configuration from a TOML file [=none].
     --log-level            Sets the log level [=info].
     --metrics              Enable the metrics server [=false].
     --metrics-address      Listening address of the metrics server [=127.0.0.1].
     --metrics-port         Listening HTTP port of the metrics server [=8008].
 -d, --data-dir             The directory where codex will store configuration and data
                            [=/root/.cache/codex].
 -i, --listen-addrs         Multi Addresses to listen on [=/ip4/0.0.0.0/tcp/0].
 -a, --nat                  IP Addresses to announce behind a NAT [=127.0.0.1].
 -e, --disc-ip              Discovery listen address [=0.0.0.0].
 -u, --disc-port            Discovery (UDP) port [=8090].
     --net-privkey          Source of network (secp256k1) private key file path or name [=key].
 -b, --bootstrap-node       Specifies one or more bootstrap nodes to use when connecting to the network.
     --max-peers            The maximum number of peers to connect to [=160].
     --agent-string         Node agent string which is used as identifier in network [=Codex].
     --api-bindaddr         The REST API bind address [=127.0.0.1].
 -p, --api-port             The REST Api port [=8080].
     --api-cors-origin      The REST Api CORS allowed origin for downloading data. '*' will allow all
                            origins, '' will allow none. [=Disallow all cross origin requests to download
                            data].
     --repo-kind            Backend for main repo store (fs, sqlite, leveldb) [=fs].
 -q, --storage-quota        The size of the total storage quota dedicated to the node [=$DefaultQuotaBytes].
 -t, --block-ttl            Default block timeout in seconds - 0 disables the ttl [=$DefaultBlockTtl].
     --block-mi             Time interval in seconds - determines frequency of block maintenance cycle: how
                            often blocks are checked for expiration and cleanup
                            [=$DefaultBlockMaintenanceInterval].
     --block-mn             Number of blocks to check every maintenance cycle [=1000].
 -c, --cache-size           The size of the block cache, 0 disables the cache - might help on slow hardrives
                            [=0].

Available sub-commands:

codex persistence [OPTIONS]... command

The following options are available:

     --eth-provider         The URL of the JSON-RPC API of the Ethereum node [=ws://localhost:8545].
     --eth-account          The Ethereum account that is used for storage contracts.
     --eth-private-key      File containing Ethereum private key for storage contracts.
     --marketplace-address  Address of deployed Marketplace contract.
     --validator            Enables validator, requires an Ethereum node [=false].
     --validator-max-slots  Maximum number of slots that the validator monitors [=1000].
     --reward-recipient     Address to send payouts to (eg rewards and refunds).

Available sub-commands:

codex persistence prover [OPTIONS]...

The following options are available:

 -cd, --circuit-dir          Directory where Codex will store proof circuit data
                            [=/root/.cache/codex/circuits].
     --circom-r1cs          The r1cs file for the storage circuit
                            [=/root/.cache/codex/circuits/proof_main.r1cs].
     --circom-wasm          The wasm file for the storage circuit
                            [=/root/.cache/codex/circuits/proof_main.wasm].
     --circom-zkey          The zkey file for the storage circuit
                            [=/root/.cache/codex/circuits/proof_main.zkey].
     --circom-no-zkey       Ignore the zkey file - use only for testing! [=false].
     --proof-samples        Number of samples to prove [=5].
     --max-slot-depth       The maximum depth of the slot tree [=32].
     --max-dataset-depth    The maximum depth of the dataset tree [=8].
     --max-block-depth      The maximum depth of the network block merkle tree [=5].
     --max-cell-elements    The maximum number of elements in a cell [=67].
```

### Environment variables

In order to set a configuration option using environment variables, first find the desired [CLI option](#cli-options)
and then transform it in the following way:

 1. prepend it with `CODEX_`
 2. make it uppercase
 3. replace `-` with `_`

For example, to configure `--log-level`, use `CODEX_LOG_LEVEL` as the environment variable name.

> [!WARNING]
> Some options can't be configured via environment variables for now [^multivalue-env-var] [^sub-commands].

### Configuration file

A [TOML](https://toml.io/en/) configuration file can also be used to set configuration values. Configuration option names and corresponding values are placed in the file, separated by `=`. Configuration option names can be obtained from the [`codex --help`](#cli-options) command, and should not include the `--` prefix. For example, a node's log level (`--log-level`) can be configured using TOML as follows:

```toml
log-level = "trace"
```

For option, like `bootstrap-node` and `listen-addrs` which accept multiple values we can specify data as an array
```toml
listen-addrs = [
  "/ip4/0.0.0.0/tcp/1234",
  "/ip4/0.0.0.0/tcp/5678"
]
```

The Codex node can then read the configuration from this file using the `--config-file` CLI parameter, like:
```shell
codex --config-file=/path/to/your/config.toml
```

## Run

Basically, we can run Codex in three different modes:
 - [Codex node](#codex-node) - useful for local testing/development and basic/files sharing.
 - [Codex node with marketplace support](#codex-node-with-marketplace-support) - you can share files and buy the storage, this is the main mode and should be used by the end users.
 - [Codex storage node](#codex-storage-node) - should be used by storage providers or if you would like to sell your local storage.

 We also will touch in some words [Codex bootstrap node](#codex-bootstrap-node).

### Using binary

#### Codex node

We can run Codex in a simple way like following:
```shell
codex
```
> [!WARNING]
> This command may not work properly when we use GitHub releases [^data-dir].

But, it will use a default `data-dir` value and we can pass a custom one:
```shell
codex --data-dir=datadir
```

This will run Codex as an isolated instance, and if we would like to join an existing network, it is required to pass a [bootstrap node](architecture#network-architecture). We can pass multiple nodes as well:
```shell
codex \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --bootstrap-node=spr:CiUIAhIhAyUvcPkKoGE7-gh84RmKIPHJPdsX5Ugm_IHVJgF-Mmu_EgIDARo8CicAJQgCEiEDJS9w-QqgYTv6CHzhGYog8ck92xflSCb8gdUmAX4ya78QoemesAYaCwoJBES39Q2RAnVOKkYwRAIgLi3rouyaZFS_Uilx8k99ySdQCP1tsmLR21tDb9p8LcgCIG30o5YnEooQ1n6tgm9fCT7s53k6XlxyeSkD_uIO9mb3
```

> [!IMPORTANT]
> Make sure you are using a proper value for the [network](/networks/networks) you would like to join.

Also, to make your Codex node accessible for other network participants, it is required to specify a public IP address which can be used to access your node:
```shell
codex \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --nat=<your public IP>
```

> [!TIP]
> We can set public IP using curl and IP lookup service, like [ip.codex.storage](https://ip.codex.storage).

After that, node will announce itself using your public IP, default UDP ([discovery](https://docs.libp2p.io/concepts/discovery-routing/overview/)) and dynamic TCP port ([data transfer](https://docs.libp2p.io/concepts/transports/overview/)), which can be adjusted in the following way:
```shell
codex \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --nat=`curl -s https://ip.codex.storage` \
  --disc-port=8090 \
  --listen-addrs=/ip4/0.0.0.0/tcp/8070
```

In that way, node will announce itself using specified [multiaddress](https://docs.libp2p.io/concepts/fundamentals/addressing/) and we can check that via [API](https://api.codex.storage/#tag/Debug/operation/getDebugInfo) call:
```shell
curl -s localhost:8080/api/codex/v1/debug/info | jq -r '.announceAddresses'
```
```json
[
  "/ip4/<your public IP>/tcp/8070"
]
```
Basically, for P2P communication we should specify and configure two ports:
| # | Protocol function                                                        | CLI option       | Example                                |
| - | ------------------------------------------------------------------------ | ---------------- | -------------------------------------- |
| 1 | [Discovery](https://docs.libp2p.io/concepts/discovery-routing/overview/) | `--disc-port`    | `--disc-port=8090`                     |
| 2 | [Transport](https://docs.libp2p.io/concepts/transports/overview/)        | `--listen-addrs` | `--listen-addrs=/ip4/0.0.0.0/tcp/8070` |

And, also it is required to setup port-forwarding on your Internet router, to make your node accessible for participants [^port-forwarding].

So, a fully working basic configuration will looks like following:
```shell
codex \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --nat=`curl -s https://ip.codex.storage` \
  --disc-port=8090 \
  --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
  --api-cors-origin="*"
```

After node is up and running and port-forwarding configurations was done, we should be able to [Upload a file](/learn/using#upload-a-file)/[Download a file](/learn/using#download-a-file) in the network using [API](/developers/api).

We also can use [Codex Marketplace UI](https://marketplace.codex.storage) for files upload/download.

And to be able to purchase a storage, we should run [Codex node with marketplace support](#codex-node-with-marketplace-support).

#### Codex node with marketplace support

[Marketplace](/learn/architecture.md#marketplace-architecture) support permits to purchase the storage in Codex network. Basically, we should add just a `persistence` sub-command and required [CLI options](#cli-options) to the [previous run](#codex-node).

> [!NOTE]
> Please ignore `--eth-account` CLI option, as it is obsolete [^eth-account].

1. For a daily use, we should consider to run a local blockchain node based on the [network](/networks/networks) you would like to join. That process is described in the [Join Codex Testnet](/networks/testnet) guide, but for a quick start we can use a public RPC endpoint.

2. Create a file with ethereum private key and set a proper permissions:
   > [!CAUTION]
   > Please use key generation service for demo purpose only.

   ```shell
   response=$(curl -s https://key.codex.storage)
   awk -F ': ' '/private/ {print $2}' <<<"${response}" > eth.key
   awk -F ': ' '/address/ {print $2}' <<<"${response}" > eth.address
   chmod 600 eth.key
   ```
   Show your ethereum address:
   ```shell
   cat eth.address
   ```
   ```
   0x412665aFAb17768cd9aACE6E00537Cc6D5524Da9
   ```

3. Fill-up your ethereum address with ETH and Tokens based on the the [network](/networks/networks) you would like to join.

4. Specify bootstrap nodes and marketplace address based on the [network](/networks/networks) you would like to join.

5. Run the node:
   ```shell
   codex \
     --data-dir=datadir \
     --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
     --nat=`curl -s https://ip.codex.storage` \
     --disc-port=8090 \
     --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
     --api-cors-origin="*" \
     persistence \
     --eth-provider=https://rpc.testnet.codex.storage \
     --eth-private-key=eth.key \
     --marketplace-address=0xCDef8d6884557be4F68dC265b6bB2E3e52a6C9d6
   ```

After node is up and running, and your address has founds, you should be able to [Purchase storage](/learn/using#purchase-storage) using [API](/developers/api).

We also can use [Codex Marketplace UI](https://marketplace.codex.storage) for storage purchase.

#### Codex storage node

Codex [storage node](architecture#network-architecture) should be run by storage providers or in case you would like to sell your local storage.

For that, additionally to the [Codex node with marketplace support](#codex-node-with-marketplace-support) we should use `prover` sub-command and required [CLI options](#cli-options).

That sub-command will make Codex to listen for a proof requests on the blockchain and answer them. To compute an answer for the proof request, Codex will use stored data and circuit files generated by the code in the [codex-storage-proofs-circuits](https://github.com/codex-storage/codex-storage-proofs-circuits) repository.

Every [network](/networks/networks) uses its own generated set of the files which are stored in the [codex-contracts-eth](https://github.com/codex-storage/codex-contracts-eth/tree/master/verifier/networks) repository and also uploaded to the CDN. Hash of the files set is also known by the [marketplace smart contract](/learn/architecture#smart-contract).

To download circuit files and make them available to Codex app, we have a stand-alone utility - `cirdl`. It can be [compiled from the sources](/learn/build#circuit-download-tool) or downloaded from the [GitHub release page](https://github.com/codex-storage/nim-codex/releases).

1. Create ethereum key

2. To download circuit files, we should pass directory, RPC endpoint and marketplace address to the circuit downloader:
   ```shell
   # Create circuit files folder
   mkdir -p datadir/circuits
   chmod 700 datadir/circuits

   # Download circuit files
   cirdl \
     datadir/circuits \
     https://rpc.testnet.codex.storage \
     0xCDef8d6884557be4F68dC265b6bB2E3e52a6C9d6
   ```

2. Start Codex storage node
   ```shell
   codex \
     --data-dir=datadir \
     --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
     --nat=`curl -s https://ip.codex.storage` \
     --disc-port=8090 \
     --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
     persistence \
     --eth-provider=https://rpc.testnet.codex.storage \
     --eth-private-key=eth.key \
     --marketplace-address=0xCDef8d6884557be4F68dC265b6bB2E3e52a6C9d6 \
     prover \
     --circom-r1cs=datadir/circuits/proof_main.r1cs \
     --circom-wasm=datadir/circuits/proof_main.wasm \
     --circom-zkey=datadir/circuits/proof_main.zkey
   ```

> [!NOTE]
> You would need to pass a bootstrap nodes, blockchain RPC endpoint and marketplace address based on the [network](/networks/networks) you would like to join.


After node is up and running, and your address has founds, you should be able to [sell the storage](/learn/using#create-storage-availability) using [API](/developers/api).

We also can use [Codex Marketplace UI](https://marketplace.codex.storage) to sell the storage.

#### Codex bootstrap node

Bootstrap nodes are used just to help peers with the initial nodes discovery and we need to run Codex with just some basic options:
```shell
codex \
  --data-dir=datadir \
  --nat=`curl -s https://ip.codex.storage` \
  --disc-port=8090
```

And we can get bootstrap node SPR via [API](https://api.codex.storage/#tag/Debug/operation/getDebugInfo) call:
```shell
curl -s localhost:8080/api/codex/v1/debug/info | jq -r '.spr'
```
```shell
spr:CiUIAhIhApd79-AxPqwRDmu7Pk-berTDtoIoMz0ovKjo85Tz8CUdEgIDARo8CicAJQgCEiECl3v34DE-rBEOa7s-T5t6tMO2gigzPSi8qOjzlPPwJR0Qjv_WtwYaCwoJBFxzjbKRAh-aKkYwRAIgCiTq5jBTaJJb6lUxN-0uNCj8lkV9AGY682D21kIAMiICIE1yxrjbDdiSCiARnS7I2zqJpXC2hOvjB4JoL9SAAk67
```

That SPR record then can be used then by other peers for initial nodes discovery.

We should keep in mind some important things about SPR record (see [ENR](https://eips.ethereum.org/EIPS/eip-778)):
- It uses node IP (`--nat`), discovery port (`--disc-port`) and private key (`--net-privkey`) for record creation
- Specified data is signed on each run and will be changed but still contain specified node data when decoded
- You can decode it by passing to the Codex node at run and with `--log-level=trace`

For bootstrap node, it is required to forward just discovery port on your Internet router.

### Run as a daemon in Linux

This functionality is not supported yet :construction:

### Run as a service in Windows

This functionality is not supported yet :construction:

### Using Docker

We also ship Codex in Docker containers, which can be run on `amd64` and `arm64` platforms.

#### Docker entrypoint

[Docker entrypoint](https://github.com/codex-storage/nim-codex/blob/master/docker/docker-entrypoint.sh), supports some additional options, which can be used for easier configuration:

- `ENV_PATH` - path to the file, in form `env=value` which will be sourced and available for Codex at run. That is useful for Kubernetes Pods configuration.
- `NAT_IP_AUTO` - when set to `true`, will set `CODEX_NAT` variable with container internal IP address. It also is useful for Kubernetes Pods configuration, when we perform automated tests.
- `NAT_PUBLIC_IP_AUTO` - used to set `CODEX_NAT` to public IP address using lookup services, like [ip.codex.storage](https://ip.codex.storage). Can be used for Docker/Kubernetes, and binary as well, to set public IP in auto mode.
- `PRIV_KEY` - can be used to pass ethereum private key, which will be saved and passed as a value of the `CODEX_ETH_PRIVATE_KEY` variable. It should be considered as unsafe option and used for testing purposes only.
- When we set `prover` sub-command, entrypoint will run `cirdl` tool to download ceremony files, required by [Codex storage node](#codex-storage-node).

#### Docker network

When we are running Codex using Docker with default [bridge network](https://docs.docker.com/engine/network/drivers/bridge/), it will create a double NAT:
 - One on the Docker side
 - Second on your Internet router

If your Internet router does not support [Full Cone NAT](https://learningnetwork.cisco.com/s/question/0D56e0000CWxJ9sCQF/lets-explain-in-details-full-cone-nat-restricted-cone-nat-and-symmetric-nat-terminologies-vs-cisco-nat-terminologies), you might have an issue and peer discovery and data transport will not work or might work unexpected.

In that case, we should consider the following solutions:
- Use [host network](https://docs.docker.com/engine/network/drivers/host/) which is supported only in Linux
- Run [Using binary](#using-binary)
- Use VM/VPS in the Cloud to run Docker with bridge or host network

#### Run using Docker

And we basically can use same options we [used for binary](#using-binary) and additionally it is required to mount volumes and map the ports.

[Codex storage node](#codex-storage-node)

1. Create ethereum key file

2. Run Codex:
```shell
docker run \
  --rm \
  -v $PWD/datadir:/datadir \
  -v $PWD/eth.key:/opt/eth.key \
  -p 8070:8070 \
  -p 8080:8080 \
  -p 8090:8090/udp \
  -e CODEX_DATA_DIR=/datadir \
  -e CODEX_ETH_PROVIDER=https://rpc.testnet.codex.storage \
  -e CODEX_MARKETPLACE_ADDRESS=0xCDef8d6884557be4F68dC265b6bB2E3e52a6C9d6 \
  codexstorage/nim-codex:latest \
  codex \
    --data-dir=/datadir \
    --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
    --nat=`curl -s https://ip.codex.storage` \
    --disc-port=8090 \
    --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
    --api-cors-origin="*" \
    --api-bindaddr=0.0.0.0 \
    --api-port=8080 \
    persistence \
    --eth-provider=https://rpc.testnet.codex.storage \
    --eth-private-key=/opt/eth.key \
    --marketplace-address=0xCDef8d6884557be4F68dC265b6bB2E3e52a6C9d6 \
    prover \
     --circom-r1cs=/datadir/circuits/proof_main.r1cs \
     --circom-wasm=/datadir/circuits/proof_main.wasm \
     --circom-zkey=/datadir/circuits/proof_main.zkey
```

> [!NOTE]
> You would need to pass a bootstrap nodes, blockchain RPC endpoint and marketplace address based on the [network](/networks/networks) you would like to join.

> [!NOTE]
> Currently, [Docker entrypoint](#docker-entrypoint) support just environment variables to download circuit files. We will update it soon, so we can get rid of the duplicate options.

### Using Docker Compose

For Docker Compose, it is more suitable to use [environment variables](#environment-variables) for Codex configuration and we can reuse commands from example above, for Docker.

[Codex storage node](#codex-storage-node)

1. Create ethereum key file

2. Create `docker-compose.yaml` file:
    ```yaml
    services:
      codex:
        image: codexstorage/nim-codex:latest
        container_name: codex
        command:
          - codex
          - persistence
          - prover
          - --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P
          - --bootstrap-node=spr:CiUIAhIhAyUvcPkKoGE7-gh84RmKIPHJPdsX5Ugm_IHVJgF-Mmu_EgIDARo8CicAJQgCEiEDJS9w-QqgYTv6CHzhGYog8ck92xflSCb8gdUmAX4ya78QoemesAYaCwoJBES39Q2RAnVOKkYwRAIgLi3rouyaZFS_Uilx8k99ySdQCP1tsmLR21tDb9p8LcgCIG30o5YnEooQ1n6tgm9fCT7s53k6XlxyeSkD_uIO9mb3
          - --bootstrap-node=spr:CiUIAhIhA6_j28xa--PvvOUxH10wKEm9feXEKJIK3Z9JQ5xXgSD9EgIDARo8CicAJQgCEiEDr-PbzFr74--85TEfXTAoSb195cQokgrdn0lDnFeBIP0QzOGesAYaCwoJBK6Kf1-RAnVEKkcwRQIhAPUH5nQrqG4OW86JQWphdSdnPA98ErQ0hL9OZH9a4e5kAiBBZmUl9KnhSOiDgU3_hvjXrXZXoMxhGuZ92_rk30sNDA
          - --bootstrap-node=spr:CiUIAhIhA7E4DEMer8nUOIUSaNPA4z6x0n9Xaknd28Cfw9S2-cCeEgIDARo8CicAJQgCEiEDsTgMQx6vydQ4hRJo08DjPrHSf1dqSd3bwJ_D1Lb5wJ4Qt_CesAYaCwoJBEDhWZORAnVYKkYwRAIgFNzhnftocLlVHJl1onuhbSUM7MysXPV6dawHAA0DZNsCIDRVu9gnPTH5UkcRXLtt7MLHCo4-DL-RCMyTcMxYBXL0
          - --bootstrap-node=spr:CiUIAhIhAzZn3JmJab46BNjadVnLNQKbhnN3eYxwqpteKYY32SbOEgIDARo8CicAJQgCEiEDNmfcmYlpvjoE2Np1Wcs1ApuGc3d5jHCqm14phjfZJs4QrvWesAYaCwoJBKpA-TaRAnViKkcwRQIhANuMmZDD2c25xzTbKSirEpkZYoxbq-FU_lpI0K0e4mIVAiBfQX4yR47h1LCnHznXgDs6xx5DLO5q3lUcicqUeaqGeg
          - --bootstrap-node=spr:CiUIAhIhAgybmRwboqDdUJjeZrzh43sn5mp8jt6ENIb08tLn4x01EgIDARo8CicAJQgCEiECDJuZHBuioN1QmN5mvOHjeyfmanyO3oQ0hvTy0ufjHTUQh4ifsAYaCwoJBI_0zSiRAnVsKkcwRQIhAJCb_z0E3RsnQrEePdJzMSQrmn_ooHv6mbw1DOh5IbVNAiBbBJrWR8eBV6ftzMd6ofa5khNA2h88OBhMqHCIzSjCeA
          - --bootstrap-node=spr:CiUIAhIhAntGLadpfuBCD9XXfiN_43-V3L5VWgFCXxg4a8uhDdnYEgIDARo8CicAJQgCEiECe0Ytp2l-4EIP1dd-I3_jf5XcvlVaAUJfGDhry6EN2dgQsIufsAYaCwoJBNEmoCiRAnV2KkYwRAIgXO3bzd5VF8jLZG8r7dcLJ_FnQBYp1BcxrOvovEa40acCIDhQ14eJRoPwJ6GKgqOkXdaFAsoszl-HIRzYcXKeb7D9
        environment:
          - CODEX_DATA_DIR=/datadir
          - NAT_PUBLIC_IP_AUTO=https://ip.codex.storage
          - CODEX_DISC_PORT=8090
          - CODEX_LISTEN_ADDRS=/ip4/0.0.0.0/tcp/8070
          - CODEX_API_CORS_ORIGIN="*"
          - CODEX_API_PORT=8080
          - CODEX_API_BINDADDR=0.0.0.0
          - CODEX_ETH_PROVIDER=https://rpc.testnet.codex.storage
          - CODEX_ETH_PRIVATE_KEY=/opt/eth.key
          - CODEX_MARKETPLACE_ADDRESS=0xCDef8d6884557be4F68dC265b6bB2E3e52a6C9d6
          - CODEX_CIRCOM_R1CS=/datadir/circuits/proof_main.r1cs
          - CODEX_CIRCOM_WASM=/datadir/circuits/proof_main.wasm
          - CODEX_CIRCOM_ZKEY=/datadir/circuits/proof_main.zkey
        ports:
          - 8080:8080/tcp # API
          - 8090:8090/udp # Discovery
          - 8070:8070/tcp # Transport
        volumes:
          - ./datadir:/datadir
          - ./eth.key:/opt/eth.key
        logging:
          driver: json-file
          options:
            max-size: 100m
            max-file: 5
    ```

3. Run Codex:
   ```shell
   docker compose up -d
   ```

> [!NOTE]
> You would need to pass a bootstrap nodes, blockchain RPC endpoint and marketplace address based on the [network](/networks/networks) you would like to join.

### On Kubernetes

Helm chart code is available in [helm-charts](https://github.com/codex-storage/helm-charts) repository, but chart was not published yet.

## Known issues

[^multivalue-env-var]: Environment variables like `CODEX_BOOTSTRAP_NODE` and `CODEX_LISTEN_ADDRS` does not support multiple values. Please check [[Feature request] Support multiple SPR records via environment variable #525](https://github.com/codex-storage/nim-codex/issues/525), for more information.
[^sub-commands]: Sub-commands configuration like `persistence` and `persistence prover` can't be done via environment variables for now.
[^data-dir]: We should set data-dir explicitly when we use GitHub releases - [[BUG] Change codex default datadir from compile-time to run-time #923](https://github.com/codex-storage/nim-codex/issues/923)
[^port-forwarding]: [NAT traversal #753](https://github.com/codex-storage/nim-codex/issues/753) is not implemented yet and we would need to setup port-forwarding for discovery and transport protocols.
[^eth-account]: Please ignore `--eth-account` CLI option - [Drop support for --eth-account #727](https://github.com/codex-storage/nim-codex/issues/727).
