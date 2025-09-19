# (0.1.0)Quick Start

To run Codex through this guide we would need to perform the following steps:
- [Review the disclaimer](../codex/disclaimer)
- [Get Codex binary](#get-codex-binary)
- [Run Codex](#run-codex)
- [Interact with Codex](#interact-with-codex)

## (0.1.0)Get Codex binary

For quick a start we will use precompiled binaries from [GitHub release page](https://github.com/codex-storage/nim-codex/releases). If you prefer to compile from the sources, please check [Build Codex](./build).

Please follow the steps for your OS from the list:
- [Linux/macOS](#linux-macos)
- [Windows](#windows)

### (0.1.0)Linux/macOS

1. Install latest Codex release
   ```shell
   curl -s https://get.codex.storage/install.sh | bash
   ```

2. Install dependencies
   ```shell
   # (0.1.0)Debian-based Linux
   sudo apt update && sudo apt install libgomp1
   ```

3. Check the result
   ```shell
   codex --version
   ```

### (0.1.0)Windows

1. Install latest Codex release
   ```batch
    curl -sO https://get.codex.storage/install.cmd && install.cmd 
   ```

   > [!WARNING]
   > Windows antivirus software and built-in firewalls may cause steps to fail. We will cover some possible errors here, but always consider checking your setup if requests fail - in particular, if temporarily disabling your antivirus fixes it, then it is likely to be the culprit.

   If you see an error like:

   ```batch
   curl: (35) schannel: next InitializeSecurityContext failed: CRYPT_E_NO_REVOCATION_CHECK (0x80092012) - The revocation function was unable to check revocation for the certificate.
   ```

   You may need to add the `--ssl-no-revoke` option to your curl calls, i.e., modify the calls above so they look like this:

   ```batch
    curl -LO --ssl-no-revoke https://...
    ```

2. Update path using console output
    - Current session only
      ```batch
      :: Default installation directory
      set "PATH=%PATH%%LOCALAPPDATA%\Codex;"
      ```

    - Update PATH permanently
      - Control Panel --> System --> Advanced System settings --> Environment Variables
      - Alternatively, type `environment variables` into the Windows Search box

3. Check the result
   ```shell
   codex --version
   ```

## (0.1.0)Run Codex

We may [run Codex in different modes](./run#run), and for a quick start we will run [Codex node](./run#codex-node), to be able to share files in the network.

0. Obtain an SPR of the Codex network you want to join.
Go to [networks](../networks/networks) 

1. Run Codex

   **Linux/macOS**
   ```shell
   codex \
     --data-dir=datadir \
     --disc-port=8090 \
     --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
     --nat=any \
     --api-cors-origin="*" \
     --bootstrap-node=<SPR HERE>
   ```

   **Windows**

   > [!WARNING]
   > Windows might at this stage prompt you to grant internet access to Codex. You must allow it for things to work.
   > It also might be required to add incoming firewall rules for Codex and we can use `netsh` utility.

   <details>
   <summary>add firewall rules using netsh</summary>

   ```batch
   :: Add rules
   netsh advfirewall firewall add rule name="Allow Codex (TCP-In)" protocol=TCP dir=in localport=8070 action=allow
   netsh advfirewall firewall add rule name="Allow Codex (UDP-In)" protocol=UDP dir=in localport=8090 action=allow

   :: List rules
   netsh advfirewall firewall show rule name=all | find /I "Codex"

   :: Delete rules
   netsh advfirewall firewall delete rule name="Allow Codex (TCP-In)"
   netsh advfirewall firewall delete rule name="Allow Codex (UDP-In)"
   ```
   </details>

   ```batch
   :: Run Codex
   codex ^
     --data-dir=datadir ^
     --disc-port=8090 ^
     --listen-addrs=/ip4/0.0.0.0/tcp/8070 ^
     --nat=any ^
     --api-cors-origin="*" ^
     --bootstrap-node=<SPR HERE>
   ```

2. Configure port-forwarding for the TCP/UDP ports on your Internet router
   | Protocol | Service   | Port   |
   | -------- | --------- | ------ |
   | UDP      | Discovery | `8090` |
   | TCP      | Transport | `8070` |

## (0.1.0)Interact with Codex

When your Codex node is up and running you can interact with it using [Codex App UI](https://app.codex.storage) for files sharing.

Also, you can interact with Codex using [Codex API](../developers/api) and for a walk-through of the API, consider following the [Using Codex](./using) guide.

## (0.1.0)Stay in touch

Want to stay up-date, or looking for further assistance? Try our [discord-server](https://discord.gg/codex-storage).
