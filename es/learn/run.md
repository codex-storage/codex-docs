---
outline: [2, 4]
---
# Run Codex

As for now, Codex is implemented only in [Nim](https://nim-lang.org) and can be found in [nim-codex](https://github.com/codex-storage/nim-codex) repository.

It is a command-line application which may be run in a different ways:
 - [Using binary](#using-binary)
 - [Run as a service in Linux](#run-as-a-service-in-linux)
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
 -a, --nat                  NAT traversal method for determining the public address. 
                            Options: any, none, upnp, pmp, extip:<IP> [any]
 -u, --disc-port            Discovery (UDP) port [=8090].
     --net-privkey          Source of network (secp256k1) private key file path or name [=key].
 -b, --bootstrap-node       Specifies one or more bootstrap nodes to use when connecting to the network.
     --max-peers            The maximum number of peers to connect to [=160].
     --num-threads          Number of worker threads (\"0\" = use as many threads as there are CPU cores available).
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

     --eth-provider             The URL of the JSON-RPC API of the Ethereum node [=ws://localhost:8545].
     --eth-account              The Ethereum account that is used for storage contracts.
     --eth-private-key          File containing Ethereum private key for storage contracts.
     --marketplace-address      Address of deployed Marketplace contract.
     --validator                Enables validator, requires an Ethereum node [=false].
     --validator-max-slots      Maximum number of slots that the validator monitors [=1000].
     --reward-recipient         Address to send payouts to (eg rewards and refunds).
     --request-cache-size       Maximum number of StorageRequests kept in memory. Reduces fetching of StorageRequest data from the contract. [=128].
     --max-priority-fee-per-gas Sets the default maximum priority fee per gas for Ethereum EIP-1559 transactions, in wei, when not provided by the network.

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

Please check [Run as a service in Linux](#run-as-a-service-in-linux) for a full example of configuration file.

## Run

### Using binary

#### Codex node

We can run Codex in a simple way like following:
```shell
codex
```

But, it will use a default `data-dir` value and we can pass a custom one:
```shell
codex --data-dir=datadir
```

This will run Codex as an isolated instance, and if we would like to join an existing network, it is required to pass a [bootstrap node](#codex-bootstrap-node). We can pass multiple nodes as well:
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
  --nat=any
```

> [!TIP]
> We can set public IP using curl and IP lookup service, like [ip.codex.storage](https://ip.codex.storage).
> In this case, you can override the IP by which your node annouces itself like this: `--nat=extip:1.2.3.4`

After that, node will announce itself using your public IP, default UDP ([discovery](https://docs.libp2p.io/concepts/discovery-routing/overview/)) and dynamic TCP port ([data transfer](https://docs.libp2p.io/concepts/transports/overview/)), which can be adjusted in the following way:
```shell
codex \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --nat=any \
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
| # | Protocol | Function                                                                 | CLI option       | Example                                |
| - | -------- | ------------------------------------------------------------------------ | ---------------- | -------------------------------------- |
| 1 | UDP      | [Discovery](https://docs.libp2p.io/concepts/discovery-routing/overview/) | `--disc-port`    | `--disc-port=8090`                     |
| 2 | TCP      | [Transport](https://docs.libp2p.io/concepts/transports/overview/)        | `--listen-addrs` | `--listen-addrs=/ip4/0.0.0.0/tcp/8070` |

And, also it is required to setup [port-forwarding](#port-forwarding) on your Internet router, to make your node accessible for participants.

So, a fully working basic configuration will looks like following:
```shell
codex \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --nat=any \
  --disc-port=8090 \
  --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
  --api-cors-origin="*"
```

After node is up and running and port-forwarding configurations was done, we should be able to [Upload a file](/learn/using#upload-a-file)/[Download a file](/learn/using#download-a-file) in the network using [API](/developers/api).

You also can use [Codex App UI](https://app.codex.storage) for files upload/download.

#### Codex bootstrap node

If you need an SPR to bootstrap your own node, go to [network](/networks/networks) and select which network you'd like to join.

Bootstrap nodes are used just to help peers with the initial nodes discovery and we need to run Codex with just some basic options:
```shell
codex \
  --data-dir=datadir \
  --nat=any \
  --disc-port=8090
```

To get bootstrap node SPR from your local node, we can use [API](https://api.codex.storage/#tag/Debug/operation/getDebugInfo) call:
```shell
curl -s localhost:8080/api/codex/v1/debug/info | jq -r '.spr'
```
```shell
spr:CiUIAhIhApd79-AxPqwRDmu7Pk-berTDtoIoMz0ovKjo85Tz8CUdEgIDARo8CicAJQgCEiECl3v34DE-rBEOa7s-T5t6tMO2gigzPSi8qOjzlPPwJR0Qjv_WtwYaCwoJBFxzjbKRAh-aKkYwRAIgCiTq5jBTaJJb6lUxN-0uNCj8lkV9AGY682D21kIAMiICIE1yxrjbDdiSCiARnS7I2zqJpXC2hOvjB4JoL9SAAk67
```

That SPR record then can be used then by other peers for initial nodes discovery.

We should keep in mind some important things about SPR record (see [ENR](https://eips.ethereum.org/EIPS/eip-778)):
- It uses nodes public IP, discovery port (`--disc-port`) and private key (`--net-privkey`) for record creation
- Specified data is signed on each run and will be changed but still contain specified node data when decoded
- You can decode it by passing to the Codex node at run and with `--log-level=trace`

For bootstrap node, it is required to forward just discovery port on your Internet router.

### Run as a service in Linux

We can run Codex as a service via [systemd](https://systemd.io) using following steps

 1. Create an user for Codex
    ```shell
    sudo useradd \
      --system \
      --home-dir /opt/codex \
      --shell /usr/sbin/nologin \
      codex
    ```
    In case you would like to run commands using a created user, you could do it like following `sudo -u codex ls -la /opt/codex`.

 2. Install Codex [using a script](https://github.com/codex-storage/get-codex) or [build from sources](/learn/build)
    ```shell
    # codex with cirdl
    curl -s https://get.codex.storage/install.sh | INSTALL_DIR=/usr/local/bin CIRDL=true bash
    ```

 3. Create directories
    ```shell
    sudo mkdir -p /opt/codex/data
    sudo mkdir -p /opt/codex/logs
    ```

 4. Create a configuration file
    ```shell
    sudo vi /opt/codex/codex.conf
    ```
    ```toml
    data-dir       = "/opt/codex/data"
    listen-addrs   = ["/ip4/0.0.0.0/tcp/8070"]
    nat            = "extip:<Public IP>"
    disc-port      = 8090
    api-port       = 8080
    bootstrap-node = [
      "spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P",
      "spr:CiUIAhIhAyUvcPkKoGE7-gh84RmKIPHJPdsX5Ugm_IHVJgF-Mmu_EgIDARo8CicAJQgCEiEDJS9w-QqgYTv6CHzhGYog8ck92xflSCb8gdUmAX4ya78QoemesAYaCwoJBES39Q2RAnVOKkYwRAIgLi3rouyaZFS_Uilx8k99ySdQCP1tsmLR21tDb9p8LcgCIG30o5YnEooQ1n6tgm9fCT7s53k6XlxyeSkD_uIO9mb3",
      "spr:CiUIAhIhA6_j28xa--PvvOUxH10wKEm9feXEKJIK3Z9JQ5xXgSD9EgIDARo8CicAJQgCEiEDr-PbzFr74--85TEfXTAoSb195cQokgrdn0lDnFeBIP0QzOGesAYaCwoJBK6Kf1-RAnVEKkcwRQIhAPUH5nQrqG4OW86JQWphdSdnPA98ErQ0hL9OZH9a4e5kAiBBZmUl9KnhSOiDgU3_hvjXrXZXoMxhGuZ92_rk30sNDA",
      "spr:CiUIAhIhA7E4DEMer8nUOIUSaNPA4z6x0n9Xaknd28Cfw9S2-cCeEgIDARo8CicAJQgCEiEDsTgMQx6vydQ4hRJo08DjPrHSf1dqSd3bwJ_D1Lb5wJ4Qt_CesAYaCwoJBEDhWZORAnVYKkYwRAIgFNzhnftocLlVHJl1onuhbSUM7MysXPV6dawHAA0DZNsCIDRVu9gnPTH5UkcRXLtt7MLHCo4-DL-RCMyTcMxYBXL0",
      "spr:CiUIAhIhAzZn3JmJab46BNjadVnLNQKbhnN3eYxwqpteKYY32SbOEgIDARo8CicAJQgCEiEDNmfcmYlpvjoE2Np1Wcs1ApuGc3d5jHCqm14phjfZJs4QrvWesAYaCwoJBKpA-TaRAnViKkcwRQIhANuMmZDD2c25xzTbKSirEpkZYoxbq-FU_lpI0K0e4mIVAiBfQX4yR47h1LCnHznXgDs6xx5DLO5q3lUcicqUeaqGeg",
      "spr:CiUIAhIhAuN-P1D0HrJdwBmrRlZZzg6dqllRNNcQyMDUMuRtg3paEgIDARpJCicAJQgCEiEC434_UPQesl3AGatGVlnODp2qWVE01xDIwNQy5G2DeloQm_L2vQYaCwoJBI_0zSiRAnVsGgsKCQSP9M0okQJ1bCpHMEUCIQDgEVjUp1RJGb59eRPs7RPYMSGAI_fo1yv70iBtnTqefQIgVoXszc87EGFVO3aaqorEYZ21OGRko5ho_Pybdyqa6AI",
      "spr:CiUIAhIhAsi_hgxFppWjHiKRwnYPX_qkB28dLtwK9c7apnlBanFuEgIDARpJCicAJQgCEiECyL-GDEWmlaMeIpHCdg9f-qQHbx0u3Ar1ztqmeUFqcW4Q2O32vQYaCwoJBNEmoCiRAnV2GgsKCQTRJqAokQJ1dipHMEUCIQDpC1isFfdRqNmZBfz9IGoEq7etlypB6N1-9Z5zhvmRMAIgIOsleOPr5Ra_Nk7BXmXGhe-YlLosH9jo83JtfWCy3-o"
    ]
    storage-quota  = "8gb"
    block-ttl      = "24h"
    log-level      = "info"
    ```

    Make sure to use bootstrap nodes for the [network](/networks/networks) you would like to join, update `nat` variable with a node Public IP and adjust other settings by your needs.

 5. Change folders ownership and permissions
    ```shell
    sudo chown -R codex:codex /opt/codex
    ```

 6. Create systemd unit file
    ```shell
    sudo vi /lib/systemd/system/codex.service
    ```
    ```shell
    [Unit]
    Description=Codex service
    Documentation=https://docs.codex.storage
    After=local-fs.target network-online.target

    [Service]
    MemorySwapMax=0
    TimeoutStartSec=infinity
    Type=exec
    User=codex
    Group=codex
    StateDirectory=codex
    ExecStart=/usr/local/bin/codex --config-file="/opt/codex/codex.conf"
    Restart=always
    RestartSec=3
    StandardOutput=append:/opt/codex/logs/codex.log
    StandardError=append:/opt/codex/logs/codex.log

    [Install]
    WantedBy=multi-user.target
    ```
    Check `man systemd`, `man systemd.service` and `man systemd.directives` for additional details.

 7. Enable and start Codex service 
    ```shell
    sudo systemctl enable codex
    sudo systemctl start codex
    ```

 8. Check service status
    ```shell
    sudo systemctl status codex
    ```

 9. Enable logs rotation using logrotate
    ```shell
    sudo vi /etc/logrotate.d/codex
    ```
    ```logrotate
    /opt/codex/logs/*.log {
      daily
      missingok
      rotate 5
      copytruncate
      nocreate
      nomail
      dateext
      dateyesterday
    }
    ```

 1. Check the logs
    ```shell
    tail -f /opt/codex/logs/codex.log
    ```

### Run as a service in Windows

This functionality is not supported yet :construction:

### Using Docker

We also ship Codex in Docker containers, which can be run on `amd64` and `arm64` platforms.

#### Docker entrypoint

[Docker entrypoint](https://github.com/codex-storage/nim-codex/blob/master/docker/docker-entrypoint.sh), supports some additional options, which can be used for easier configuration:

- `ENV_PATH` - path to the file, in form `env=value` which will be sourced and available for Codex at run. That is useful for Kubernetes Pods configuration.
- `NAT_IP_AUTO` - when set to `true`, will set `CODEX_NAT` variable with container internal IP address. It also is useful for Kubernetes Pods configuration, when we perform automated tests.
- `NAT_PUBLIC_IP_AUTO` - used to set `CODEX_NAT` to public IP address using lookup services, like [ip.codex.storage](https://ip.codex.storage). Can be used for Docker/Kubernetes to set public IP in auto mode.
- When we set `prover` sub-command, entrypoint will run `cirdl` tool to download ceremony files, required by [Codex storage node](#codex-storage-node).
- `BOOTSTRAP_NODE_URL` - Codex node API URL in form of `http://bootstrap:8080`, to be used to get it's SPR as a bootstrap node. That is useful for Docker and Kubernetes configuration.
- `NETWORK` - is a helper variable to simply a specific network join. It helps to automate `BOOTSTRAP_NODE_FROM_URL` variable.
- `BOOTSTRAP_NODE_FROM_URL` - can be used to pass SPR nodes from an URL like [spr.codex.storage/testnet](https://spr.codex.storage/testnet).

#### Docker network

When we are running Codex using Docker with default [bridge network](https://docs.docker.com/engine/network/drivers/bridge/), it will create a double NAT:
 - One on the Docker side
 - Second on your Internet router

If your Internet router does not support [Full Cone NAT](https://learningnetwork.cisco.com/s/question/0D56e0000CWxJ9sCQF/lets-explain-in-details-full-cone-nat-restricted-cone-nat-and-symmetric-nat-terminologies-vs-cisco-nat-terminologies), you might have an issue and peer discovery and data transport will not work or might work unexpected.

In that case, we should consider the following solutions:
- Use [host network](https://docs.docker.com/engine/network/drivers/host/) for Docker, which is supported only in Linux
- Run [Using binary](#using-binary)
- Use VM/VPS in the Cloud to run Docker with bridge or host network

#### Run using Docker

And we basically can use same options we [used for binary](#using-binary) and additionally it is required to mount volumes and map the ports.

1. Run Codex:
```shell
docker run \
  --rm \
  -v $PWD/datadir:/datadir \
  -p 8070:8070 \
  -p 8080:8080 \
  -p 8090:8090/udp \
  codexstorage/nim-codex:latest \
  codex \
    --data-dir=/datadir \
    --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
    --nat=any \
    --disc-port=8090 \
    --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
    --api-cors-origin="*" \
    --api-bindaddr=0.0.0.0 \
    --api-port=8080
```

> [!NOTE]
> You would need to pass a bootstrap nodes based on the [network](/networks/networks) you would like to join.

### Using Docker Compose

For Docker Compose, it is more suitable to use [environment variables](#environment-variables) for Codex configuration and we can reuse commands from example above, for Docker.

1. Create `docker-compose.yaml` file:
    ```yaml
    services:
      codex:
        image: codexstorage/nim-codex:latest
        container_name: codex
        command:
          - codex
          - --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P
          - --bootstrap-node=spr:CiUIAhIhAyUvcPkKoGE7-gh84RmKIPHJPdsX5Ugm_IHVJgF-Mmu_EgIDARo8CicAJQgCEiEDJS9w-QqgYTv6CHzhGYog8ck92xflSCb8gdUmAX4ya78QoemesAYaCwoJBES39Q2RAnVOKkYwRAIgLi3rouyaZFS_Uilx8k99ySdQCP1tsmLR21tDb9p8LcgCIG30o5YnEooQ1n6tgm9fCT7s53k6XlxyeSkD_uIO9mb3
          - --bootstrap-node=spr:CiUIAhIhA6_j28xa--PvvOUxH10wKEm9feXEKJIK3Z9JQ5xXgSD9EgIDARo8CicAJQgCEiEDr-PbzFr74--85TEfXTAoSb195cQokgrdn0lDnFeBIP0QzOGesAYaCwoJBK6Kf1-RAnVEKkcwRQIhAPUH5nQrqG4OW86JQWphdSdnPA98ErQ0hL9OZH9a4e5kAiBBZmUl9KnhSOiDgU3_hvjXrXZXoMxhGuZ92_rk30sNDA
          - --bootstrap-node=spr:CiUIAhIhA7E4DEMer8nUOIUSaNPA4z6x0n9Xaknd28Cfw9S2-cCeEgIDARo8CicAJQgCEiEDsTgMQx6vydQ4hRJo08DjPrHSf1dqSd3bwJ_D1Lb5wJ4Qt_CesAYaCwoJBEDhWZORAnVYKkYwRAIgFNzhnftocLlVHJl1onuhbSUM7MysXPV6dawHAA0DZNsCIDRVu9gnPTH5UkcRXLtt7MLHCo4-DL-RCMyTcMxYBXL0
          - --bootstrap-node=spr:CiUIAhIhAzZn3JmJab46BNjadVnLNQKbhnN3eYxwqpteKYY32SbOEgIDARo8CicAJQgCEiEDNmfcmYlpvjoE2Np1Wcs1ApuGc3d5jHCqm14phjfZJs4QrvWesAYaCwoJBKpA-TaRAnViKkcwRQIhANuMmZDD2c25xzTbKSirEpkZYoxbq-FU_lpI0K0e4mIVAiBfQX4yR47h1LCnHznXgDs6xx5DLO5q3lUcicqUeaqGeg
          - --bootstrap-node=spr:CiUIAhIhAuN-P1D0HrJdwBmrRlZZzg6dqllRNNcQyMDUMuRtg3paEgIDARpJCicAJQgCEiEC434_UPQesl3AGatGVlnODp2qWVE01xDIwNQy5G2DeloQm_L2vQYaCwoJBI_0zSiRAnVsGgsKCQSP9M0okQJ1bCpHMEUCIQDgEVjUp1RJGb59eRPs7RPYMSGAI_fo1yv70iBtnTqefQIgVoXszc87EGFVO3aaqorEYZ21OGRko5ho_Pybdyqa6AI
          - --bootstrap-node=spr:CiUIAhIhAsi_hgxFppWjHiKRwnYPX_qkB28dLtwK9c7apnlBanFuEgIDARpJCicAJQgCEiECyL-GDEWmlaMeIpHCdg9f-qQHbx0u3Ar1ztqmeUFqcW4Q2O32vQYaCwoJBNEmoCiRAnV2GgsKCQTRJqAokQJ1dipHMEUCIQDpC1isFfdRqNmZBfz9IGoEq7etlypB6N1-9Z5zhvmRMAIgIOsleOPr5Ra_Nk7BXmXGhe-YlLosH9jo83JtfWCy3-o
        environment:
          - CODEX_DATA_DIR=/datadir
          - NAT_PUBLIC_IP_AUTO=https://ip.codex.storage
          - CODEX_DISC_PORT=8090
          - CODEX_LISTEN_ADDRS=/ip4/0.0.0.0/tcp/8070
          - CODEX_API_CORS_ORIGIN="*"
          - CODEX_API_PORT=8080
          - CODEX_API_BINDADDR=0.0.0.0
        ports:
          - 8080:8080/tcp # API
          - 8090:8090/udp # Discovery
          - 8070:8070/tcp # Transport
        volumes:
          - ./datadir:/datadir
        logging:
          driver: json-file
          options:
            max-size: 100m
            max-file: 5
    ```

3. Run Codex:
   ```shell
   docker compose up
   ```

> [!NOTE]
> You would need to pass a bootstrap nodes based on the [network](/networks/networks) you would like to join.

### On Kubernetes

Helm chart code is available in [helm-charts](https://github.com/codex-storage/helm-charts) repository, but chart was not published yet.

## How-tos

### NAT Configuration 

Use the `--nat` CLI flag to specify how your codex node should handle NAT traversal. Below are the available options:

**any**(default): This option will automatically try to detect your public IP by checking the routing table or using UPnP/PMP NAT traversal techniques. If successful, it will use the detected public IP and port for the announce address.

**upnp**: This option exclusively uses [UPnP](https://en.wikipedia.org/wiki/Universal_Plug_and_Play) to detect the public IP and create a port mapping entry, if your device supports UPnP.

**pmp**: This option uses only [NAT-PMP](https://en.wikipedia.org/wiki/NAT_Port_Mapping_Protocol) to detect the public IP and create a port mapping entry, if your device supports NAT-PMP.

**extIP:[Your Public IP]**:Use this option if you want to manually specify an external IP address and port for the announce address. When selecting this option, you'll need to configure **port forwarding** on your router to ensure that incoming traffic is directed to the correct internal IP and port.

### Port Forwarding 

If you're running on a private network, you'll need to set up port forwarding to ensure seamless communication between the codex node and its peers. It's also recommended to configure appropriate firewall rules for TCP and UDP traffic.
While the specific steps required vary based on your router, they can be summarised as follows:
1. Find your public IP address by either visiting [ip-codex](https://ip.codex.storage/) or running `curl ip.codex.storage`
2. Identify your [private](#determine-your-private-ip) IP address 
3. Access your router's settings by entering its IP address (typically [http://192.168.1.1](http://192.168.1.1/)) in your web browser
4. Sign in with administrator credentials and locate the port forwarding settings
5. Set up the discovery port forwarding rule with these settings:
    - External Port: 8090
    - Internal Port: 8090
    - Protocol: UDP
    - IP Address: Your device's private IP address
6. Set up the libp2p port forwarding rule with these settings:
    - External Port: 8070
    - Internal Port: 8070
    - Protocol: TCP
    - IP Address: Your device's private IP address

#### Determine your private IP

To determine your private IP address, run the appropriate command for your OS:

**Linux**: 
```shell
ip addr show | grep "inet " | grep -v 127.0.0.1
```

**Windows**: 
```shell
ipconfig | findstr /i "IPv4 Address"
```

**MacOs**: 
```shell
ifconfig | grep "inet " | grep -v 127.0.0.1
```

## Known issues

[^multivalue-env-var]: Environment variables like `CODEX_BOOTSTRAP_NODE` and `CODEX_LISTEN_ADDRS` does not support multiple values. Please check [[Feature request] Support multiple SPR records via environment variable #525](https://github.com/codex-storage/nim-codex/issues/525), for more information.
[^sub-commands]: Sub-commands `persistence` and `persistence prover` can't be set via environment variables.
[^eth-account]: Please ignore `--eth-account` CLI option - [Drop support for --eth-account #727](https://github.com/codex-storage/nim-codex/issues/727).
