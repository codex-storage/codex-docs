---
outline: [2, 4]
---
# Codex Testnet

The Codex Testnet has been launched and is ready to be used for testing.

Your participation in the Codex Testnet is subject to the [Codex Testnet Terms and Conditions](https://github.com/codex-storage/codex-testnet-starter/blob/master/Codex%20Testnet%20Terms%20and%20Conditions.pdf) and [Codex Testnet Privacy Policy](https://github.com/codex-storage/codex-testnet-starter/blob/master/Codex%20Testnet%20Privacy%20Policy.pdf).

**Guides.** We have basic guides covering how to set up a Storage Client which can be used to upload and persist files by buying storage in the Codex network. We recommend that you start with those.

Running a Storage Provider is more involved and is covered as a separate guide which demonstrates the storage sales side, as well as how to run Codex with its own local Ethereum execution client.

Guides are available either on Discord, as step-by-step, interactive guides, or here as simple instructions that you can follow:

- **Basic: running a storage client.** [[Discord](#sc-guide-discord) | [web](#sc-guide-web)]
- **Advanced: Running a storage provider.** [[web](#sp-guide-web)]

The guides were tested on the following operating systems:

 - Linux: Ubuntu 24.04, Debian 12, Fedora 40
 - macOS: 15
 - Windows: 11, Server 2022

## Running a Storage Client (Discord Version) {#sc-guide-discord}

You can join [Codex Discord server](https://discord.gg/codex-storage) and jump into the [#:tv:|join-testnet](https://discord.com/channels/895609329053474826/1289923125928001702) channel.

It is mostly the same as a [Web guide](#sc-guide-web), but uses Discord capabilities so you can have an interactive, step-by-step guide, and you also can get a support in the [#:sos:|node-help](https://discord.com/channels/895609329053474826/1286205545837105224) channel.

## Running a Storage Client (Web Version) {#sc-guide-web}

**Prerequisites**

 - Access to your Internet router so you can [configure port forwarding](#basic-common)

Steps for [Linux/macOS](#basic-linux-macos) and [Windows](#basic-windows) are slightly different, so please use ones for your OS.

<hr>

### Linux/macOS {#basic-linux-macos}

1. Install Codex binaries from GitHub releases:
   ```shell
   curl -s https://get.codex.storage/install.sh | bash
   ```

2. Install dependencies when required:
   ```shell
   # Debian-based Linux
   sudo apt update && sudo apt install libgomp1
   ```

3. Generate an ethereum keypair:
   ```shell
   curl -s https://get.codex.storage/generate.sh | bash
   ```
   Your private key will be saved to `eth.key` and address to  `eth.address` file.

4. Fill-up your address shown on the screen with the tokens:
   - Use the web faucets to mint some [ETH](https://faucet-eth.testnet.codex.storage) and [TST](https://faucet-tst.testnet.codex.storage) tokens.
   - We can also do this using Discord [# bot](https://discord.com/channels/895609329053474826/1230785221553819669) channel
     - Use `/set ethaddress` command to enter your generated address
     - Use `/mint` command to receive ETH and TST tokens
     - Use `/balance` command to check if you have received test tokens successfully

5. Run Codex node:
   ```shell
   curl -s https://get.codex.storage/run.sh | bash
   ```

6. Configure [port forwarding](#basic-common) and we are ready go to.

### Windows {#basic-windows}

1. Download the master tarball from the Codex testnet starter repository, and untar its contents:
   > [!WARNING]
   > Windows antivirus software and built-in firewalls may cause steps to fail. We will cover some possible errors here, but always consider checking your setup if requests fail - in particular, if temporarily disabling your antivirus fixes it, then it is likely to be the culprit.

   ```batch
   curl -LO https://github.com/codex-storage/codex-testnet-starter/archive/master.tar.gz
   ```

   If you see an error like:

   ```batch
   curl: (35) schannel: next InitializeSecurityContext failed: CRYPT_E_NO_REVOCATION_CHECK (0x80092012) - The revocation function was unable to check revocation for the certificate.
   ```

   You may need to add the `--ssl-no-revoke` option to your curl call, e.g.:

   ```batch
   curl -LO --ssl-no-revoke https://github.com/codex-storage/codex-testnet-starter/archive/master.tar.gz
   ```

1. Extract the contents of the tar file, and then delete it:
   ```batch
   tar xzvf master.tar.gz
   del master.tar.gz
   ```

2. Navigate to the scripts folder:
   ```batch
   cd codex-testnet-starter-master\scripts\windows
   ```

3. Download Codex binaries from GitHub releases:
   ```batch
   download-online.bat
   ```

4. Generate an ethereum keypair:
   ```batch
   generate.bat
   ```
   Your private key will be saved to `eth.key` and address to  `eth.address` file.

5. Fill-up your address shown on the screen with the tokens:
   - Use the web faucets to mint some [ETH](https://faucet-eth.testnet.codex.storage) and [TST](https://faucet-tst.testnet.codex.storage) tokens.
   - We can also do this using Discord [# bot](https://discord.com/channels/895609329053474826/1230785221553819669) channel
     - Use `/set ethaddress` command to enter your generated address
     - Use `/mint` command to receive ETH and TST tokens
     - Use `/balance` command to check if you have received test tokens successfully

6. Run Codex node:
   ```batch
   run-client.bat
   ```

 7. Configure [port forwarding](#basic-common) and we are ready go to.

### All OS {#basic-common}

Configure [port forwarding](https://en.wikipedia.org/wiki/Port_forwarding) on your Internet router
| # | Protocol | Port   | Description       |
| - | -------- | ------ | ----------------- |
| 1 | `UDP`    | `8090` | `Codex Discovery` |
| 2 | `TCP`    | `8070` | `Codex Transport` |

After your node is up and running, you can use the [Codex API](/developers/api) to be able to interact with your Codex node, please check our [API walk-through](/learn/using) for more details.

You also can use [Codex App UI](https://app.codex.storage) to interact with your local Codex node.

Need help? Reach out to us in [#:sos:|node-help](https://discord.com/channels/895609329053474826/1286205545837105224) channel or check [troubleshooting guide](/learn/troubleshoot.md).

## Running a Storage Provider (Web Version) {#sp-guide-web}

Work in progress :construction:

## Testnet Data

### Bootstrap Nodes

 Testnet bootstrap nodes records could be found in [GitHub repository](https://github.com/codex-storage/codex-spr) and accessed via endpoints
 - Codex - [`spr.codex.storage/testnet`](https://spr.codex.storage/testnet)
 - Geth - [`spr.codex.storage/testnet/geth`](https://spr.codex.storage/testnet/geth)

### Smart contracts

| Contract    | Address                                                                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Token       | [`0x34a22f3911De437307c6f4485931779670f78764`](https://explorer.testnet.codex.storage/address/0x34a22f3911De437307c6f4485931779670f78764) |
| Verifier    | [`0x1f60B2329775545AaeF743dbC3571e699405263e`](https://explorer.testnet.codex.storage/address/0x1f60B2329775545AaeF743dbC3571e699405263e) |
| Marketplace | [`marketplace.codex.storage/codex-testnet/latest`](https://marketplace.codex.storage/codex-testnet/latest)                                |

### Endpoints

| # | Service         | URL                                                                          |
| - | --------------- | ---------------------------------------------------------------------------- |
| 1 | Geth Public RPC | [rpc.testnet.codex.storage](https://rpc.testnet.codex.storage)               |
| 2 | Block explorer  | [explorer.testnet.codex.storage](https://explorer.testnet.codex.storage)     |
| 3 | Faucet ETH      | [faucet-eth.testnet.codex.storage](https://faucet-eth.testnet.codex.storage) |
| 4 | Faucet TST      | [faucet-tst.testnet.codex.storage](https://faucet-tst.testnet.codex.storage) |
| 5 | Status page     | [status.testnet.codex.storage](https://status.testnet.codex.storage)         |
