# Run Codex

As for now, Codex is implemented only in [Nim](https://nim-lang.org) and can be found in [nim-codex](https://github.com/codex-storage/nim-codex) repository.

It is a command-line application which may be run in a different ways:
 - [Using binary](#using-binary)
 - [Run as a daemon in Linux](#run-as-a-daemon-in-linux) (not supported yet)
 - [Run as a service in Windows](#run-as-a-service-in-windows) (not supported yet)
 - [Using Docker](#using-docker)
 - [Using Docker Compose](#using-docker-compose)
 - [Using Ansible](#using-ansible)
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

For some configuration options, we can pass values in common units like:
```shell
--storage-quota=2m/2M/2mb/2MB
--cache-size

--block-ttl=2s/2S/2m/2M/2h/2H/2d/2D/2w/2W
--block-mi
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

Available sub-commands:

codex persistence prover [OPTIONS]...

The following options are available:

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
> Some options can't be configured via environment variables for now. Please read [Known issues](#known-issues) for more details.

### Configuration file

A [TOML](https://toml.io/en/) configuration file can also be used to set configuration values. Configuration option names and corresponding values are placed in the file, separated by `=`. Configuration option names can be obtained from the [`codex --help`](#cli-options) command, and should not include the `--` prefix. For example, a node's log level (`--log-level`) can be configured using TOML as follows:

```toml
log-level = "trace"
```

For option, like `bootstrap-node` and `listen-addrs` which accept multiple values we can specify data as an array
```toml
listen-addrs = [
  "/ip4/0.0.0.0/tcp/7777",
  "/ip4/0.0.0.0/tcp/8888"
]
```

The Codex node can then read the configuration from this file using the `--config-file` CLI parameter, like `codex --config-file=/path/to/your/config.toml`.

## Run

Basically, we can run Codex in three different modes
 - [Codex node](#codex-node) - useful for local testing/development and basic/files sharing
 - [Codex node with marketplace support](#codex-node-with-marketplace-support) - main mode and should be used by the end users
 - [Codex storage node](#codex-storage-node) - should be used by storage providers or if you would like to sell your local storage

### Using binary

#### Codex node

We can run Codex in a simple way like following:
```shell
codex
```

But, it will use a default `data-dir` value and we can pass a custom one:
```shell
codex --data-dir=./datadir
```

This will run Codex as an isolated instance, and if we would like to join an existing network, it is required to pass a [bootstrap node](architecture#network-architecture). We can pass multiple nodes as well:
```shell
codex \
  --data-dir=./datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --bootstrap-node=spr:CiUIAhIhAyUvcPkKoGE7-gh84RmKIPHJPdsX5Ugm_IHVJgF-Mmu_EgIDARo8CicAJQgCEiEDJS9w-QqgYTv6CHzhGYog8ck92xflSCb8gdUmAX4ya78QoemesAYaCwoJBES39Q2RAnVOKkYwRAIgLi3rouyaZFS_Uilx8k99ySdQCP1tsmLR21tDb9p8LcgCIG30o5YnEooQ1n6tgm9fCT7s53k6XlxyeSkD_uIO9mb3
```

> [!IMPORTANT]
> Make sure you are using a proper value for the [network](/networks/networks) you would like to join.

Also, to make your Codex node accessible for other network participants, it is required to specify a public IP address which can be used to access your node:
```shell
codex \
  --data-dir=./datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --nat=<your public IP>
```

> [!TIP]
> We can set public IP using curl and IP lookup service, like [ip.codex.storage](https://ip.codex.storage).

After that, node will announce itself using your public IP and dynamic TCP port for [libp2p transport](https://docs.libp2p.io/concepts/transports/overview/) (data transfer), which can be adjusted in the following way:
```shell
codex \
  --data-dir=./datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --nat=`curl -s https://ip.codex.storage` \
  --listen-addrs=/ip4/0.0.0.0/tcp/8070
```

In that way, node will announce itself using the following [multiaddress](https://docs.libp2p.io/concepts/fundamentals/addressing/):

`/ip4/<your public IP>/tcp/8070`

and we can check that via [API](https://api.codex.storage/#tag/Debug/operation/getDebugInfo) call:
```shell
curl -s localhost:8080/api/codex/v1/debug/info | jq -r '.announceAddresses'
```
```json
[
  "/ip4/<your public IP>/tcp/8070"
]
```
Basically, for P2P communication we should set/adjust two ports:
| # | Protocol function                                                        | CLI option       | Example                                |
| - | ------------------------------------------------------------------------ | ---------------- | -------------------------------------- |
| 1 | [Discovery](https://docs.libp2p.io/concepts/discovery-routing/overview/) | `--disc-port`    | `--disc-port=8090`                     |
| 2 | [Transport](https://docs.libp2p.io/concepts/transports/overview/)        | `--listen-addrs` | `--listen-addrs=/ip4/0.0.0.0/tcp/8070` |

And, also it is required to setup port-forwarding on your Internet device, please read [Known issues](#known-issues) for more details.

So, a fully working basic configuration will looks like following:
```shell
codex \
  --data-dir=./datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --nat=`curl -s https://ip.codex.storage` \
  --disc-port=8090 \
  --listen-addrs=/ip4/0.0.0.0/tcp/8070
```

After node is up and running and port-forwarding configurations was done, we should be able to [Upload a file](https://github.com/codex-storage/codex-testnet-starter/blob/master/USINGCODEX.md#upload-a-file)/[Download a file](https://github.com/codex-storage/codex-testnet-starter/blob/master/USINGCODEX.md#download-a-file) in the network. And to be able to purchase storage, we should run [Codex node with marketplace support](#codex-node-with-marketplace-support).

#### Codex node with marketplace support

[Marketplace](marketplace) support permits to purchase the storage in Codex network. Basically, we should add just a `persistence` sub-command and required CLI options to the [previous run](#codex-node).

> [!NOTE]
> Please ignore `--eth-account` CLI option, read [Known issues](#known-issues) for more details.

1. For a daily use, we should consider to run a local blockchain node based on the [network](/networks/networks) you would like to join. That process is described in the [Join Testnet](/networks/testnet)(:construction:), but for quick start we can use a public RPC endpoint.

2. Create a file with ethereum private key and set a proper permissions.
   ```shell
   key=$(curl -s https://key.codex.storage)
   echo $key | awk -F ':' '/address/ {print $2}' >eth.address
   echo $key | awk -F ':' '/private/ {print $2}' >eth.key
   chmod 600 eth.key
   ```
   > [!CAUTION]
   > Please use mentioned key generation service for demo purpose only.

3. Specify marketplace address based on the [network](/networks/networks) you would like to join.

4. Run the node
   ```shell
   codex \
     persistence \
     --data-dir=./datadir \
     --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
     --nat=`curl -s https://ip.codex.storage` \
     --disc-port=8090 \
     --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
     --eth-provider=https://rpc.testnet.codex.storage \
     --eth-private-key=eth.key \
     --marketplace-address=0xB119d28d3A1bFD281b23A0890B4c1B626EE8F6F0
   ```

After node is up and running, you just need to fill-up your ethereum address (`cat eth.address`) with the tokens and then you should be able to [Purchase storage](https://github.com/codex-storage/codex-testnet-starter/blob/master/USINGCODEX.md#purchase-storage).

#### Codex storage node

 To be added :construction:

### Run as a daemon in Linux

 This functionality is not supported yet :construction:

### Run as a service in Windows

 This functionality is not supported yet :construction:

### Using Docker

 To be added :construction:

### Using Docker Compose

 To be added :construction:

### Using Ansible

 Planning :construction:

### On Kubernetes

 To be added :construction:

 Helm chart code is available in [helm-charts](https://github.com/codex-storage/helm-charts) repository, but chart was not published yet.


## Known issues

 1. Environment variables like `CODEX_BOOTSTRAP_NODE` and `CODEX_LISTEN_ADDRS` does not support multiple values. Please check [[Feature request] Support multiple SPR records via environment variable #525](https://github.com/codex-storage/nim-codex/issues/525), for more information.
 2. Sub-commands configuration like `persistence` and `persistence prover` can't be done via environment variables for now.
 3. [NAT traversal #753](https://github.com/codex-storage/nim-codex/issues/753) is not implemented yet and we would need to setup port-forwarding for discovery and transport protocols.
 4. Please ignore `--eth-account` CLI option - [Drop support for --eth-account #727](https://github.com/codex-storage/nim-codex/issues/727).
