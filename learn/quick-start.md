# Quick Start

To run Codex through this guide we would need to perform the following steps:
- [Review the disclaimer](/codex/disclaimer)
- [Get Codex binary](#get-codex-binary)
- [Run Codex](#run-codex)
- [Interact with Codex](#interact-with-codex)

## Get Codex binary

For quick a start we will use precompiled binaries from [GitHub release page](https://github.com/codex-storage/nim-codex/releases). If you prefer to compile from the sources, please check [Build Codex](/learn/build).

Please follow the steps for your OS from the list:
- [Linux/macOS](#linux-macos)
- [Windows](#windows)

### Linux/macOS

1. Install latest Codex release
   ```shell
   curl -s https://get.codex.storage/install.sh | bash
   ```

2. Install dependencies
   ```shell
   # Debian-based Linux
   sudo apt update && sudo apt install libgomp1
   ```

3. Check the result
   ```shell
   codex --version
   ```

### Windows

1. Download binary and checksum for your platform/architecture
   > [!WARNING]
   > For Windows, only amd64 architecture is supported now.

   > [!WARNING]
   > Windows antivirus software and built-in firewalls may cause steps to fail. We will cover some possible errors here, but always consider checking your setup if requests fail - in particular, if temporarily disabling your antivirus fixes it, then it is likely to be the culprit.

   ```batch
   set platform=windows
   if %PROCESSOR_ARCHITECTURE%==AMD64 (set architecture=amd64) else (set architecture=arm64)

   :: Binary
   curl -LO https://github.com/codex-storage/nim-codex/releases/download/%version%/codex-%version%-%platform%-%architecture%-libs.zip

   :: Checksum
   curl -LO https://github.com/codex-storage/nim-codex/releases/download/%version%/codex-%version%-%platform%-%architecture%-libs.zip.sha256
   ```

   If you see an error like:

   ```batch
   curl: (35) schannel: next InitializeSecurityContext failed: CRYPT_E_NO_REVOCATION_CHECK (0x80092012) - The revocation function was unable to check revocation for the certificate.
   ```

   You may need to add the `--ssl-no-revoke` option to your curl calls, i.e., modify the calls above so they look like this:

   ```batch
    curl -LO --ssl-no-revoke https://...
    ```

2. Verify checksum
   ```batch
   for /f "delims=" %a in ('certUtil -hashfile codex-%version%-%platform%-%architecture%-libs.zip SHA256 ^| findstr -vrc:"[^0123-9aAb-Cd-EfF ]"') do @set ACTUAL_HASH=%a
   for /f "tokens=1" %a in (codex-%version%-%platform%-%architecture%-libs.zip.sha256) do set EXPECTED_HASH=%a
   if %ACTUAL_HASH% == %EXPECTED_HASH% (echo. && echo codex-%version%-%platform%-%architecture%-libs.zip: OK) else (echo. && echo codex-%version%-%platform%-%architecture%-libs.zip: FAILED)
    ```

   Make sure you get `OK` in the result
   ```
   codex-v0.1.7-windows-amd64-libs.zip: OK
   ```

3. Extract binary and libraries
   ```batch
   if not exist %LOCALAPPDATA%\Codex mkdir %LOCALAPPDATA%\Codex
   tar -xvf codex-%version%-%platform%-%architecture%-libs.zip -C %LOCALAPPDATA%\Codex

4. Rename binary and update user `path` variable
   ```batch
   :: Rename binary
   move /Y %LOCALAPPDATA%\Codex\codex-%version%-%platform%-%architecture%.exe %LOCALAPPDATA%\Codex\codex.exe

   :: Add folder to the path permanently
   setx PATH "%PATH%%LOCALAPPDATA%\Codex;"

   :: Add folder to the path for the current session
   PATH "%PATH%%LOCALAPPDATA%\Codex;"
   ```

4. Check the result
   ```shell
   codex --version
   ```

5. Cleanup
   ```batch
   del codex-%version%-%platform%-%architecture%-libs.zip ^
     codex-%version%-%platform%-%architecture%-libs.zip.sha256
   ```

## Run Codex

We may [run Codex in different modes](/learn/run#run), and for a quick start we will run [Codex node](/learn/run#codex-node), to be able to share files in the network.

1. Run Codex

   **Linux/macOS**
   ```shell
   codex \
     --data-dir=datadir \
     --disc-port=8090 \
     --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
     --nat=`curl -s https://ip.codex.storage` \
     --api-cors-origin="*" \
     --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P
   ```

   **Windows**

   > [!WARNING]
   > Windows might at this stage prompt you to grant internet access to Codex. You must allow it for things to work.

   ```batch
   :: Get Public IP
   for /f "delims=" %a in ('curl -s --ssl-reqd ip.codex.storage') do @set nat=%a

   :: Run
   codex ^
     --data-dir=datadir ^
     --disc-port=8090 ^
     --listen-addrs=/ip4/0.0.0.0/tcp/8070 ^
     --nat=%nat% ^
     --api-cors-origin="*" ^
     --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P
   ```

   > [!TIP]
   > In the example above we use [Codex Testnet](/networks/testnet#bootstrap-nodes) bootstrap nodes and thus we join Testnet. If you would like to join a different network, please use [appropriate value](/networks/networks).

2. Configure port-forwarding for the TCP/UDP ports on your Internet router
   | Protocol | Service   | Port   |
   | -------- | --------- | ------ |
   | UDP      | Discovery | `8090` |
   | TCP      | Transport | `8070` |

If you would like to purchase or sell storage, please consider to run [Codex node with marketplace support](/learn/run#codex-node-with-marketplace-support) or [Codex storage node](/learn/run#codex-storage-node).

## Interact with Codex

When your Codex node is up and running you can interact with it using [Codex App UI](https://app.codex.storage) for files sharing.

Also, you can interact with Codex using [Codex API](/developers/api) and for a walk-through of the API, consider following the [Using Codex](/learn/using) guide.

## Stay in touch

Want to stay up-date, or looking for further assistance? Try our [discord-server](https://discord.gg/codex-storage).

Ready to explore Codex functionality? Please [Join Codex Testnet](/networks/testnet).

If you want to run Codex locally without joining the Testnet, consider trying the [Codex Two-Client Test](/learn/local-two-client-test) or the [Running a Local Codex Network with Marketplace Support](/learn/local-marketplace).
