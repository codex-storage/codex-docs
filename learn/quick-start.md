# Quick start

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

1. Download binary and checksum for your platform/architecture
   ```shell
   version=v0.1.4
   platform=$(echo `uname -s` | awk '{print tolower($0)}')
   architecture=$([[ `uname -m` == 'x86_64' ]] && echo amd64 || echo arm64)

   # Binary
   curl -LO https://github.com/codex-storage/nim-codex/releases/download/${version}/codex-${version}-${platform}-${architecture}.tar.gz

   # Checksum
   curl -LO https://github.com/codex-storage/nim-codex/releases/download/${version}/codex-${version}-${platform}-${architecture}.tar.gz.sha256
   ```

2. Verify checksum

   **Linux**
   ```shell
   sha256sum -c codex-${version}-${platform}-${architecture}.tar.gz.sha256
   ```

   **macOS**
   ```shell
   shasum -a 256 -c codex-${version}-${platform}-${architecture}.tar.gz.sha256
   ```

   Make sure you get `OK` in the result
   ```
   codex-v0.1.4-linux-amd64.tar.gz: OK
   ```

3. Extract binary
   ```shell
   tar -zxvf codex-${version}-${platform}-${architecture}.tar.gz
   ```

4. Copy binary to the appropriate folder
   ```shell
   sudo install codex-${version}-${platform}-${architecture} /usr/local/bin/codex
   ```

5. Install dependencies
   ```shell
   # Debian-based Linux
   sudo apt update && sudo apt install libgomp1
   ```

6. Check the result
   ```shell
   codex --version
   ```
   ```shell
   Codex version:  v0.1.4
   Codex revision: 484124d
   Nim Compiler Version 1.6.14 [Linux: amd64]
   ```

7. Cleanup
   ```shell
   rm -f \
     codex-${version}-${platform}-${architecture} \
     codex-${version}-${platform}-${architecture}.tar.gz \
     codex-${version}-${platform}-${architecture}.tar.gz.sha256
   ```

### Windows

1. Download binary and checksum for your platform/architecture
   > [!WARNING]
   > For Windows, only amd64 architecture is supported now.
   ```batch
   set version=v0.1.4
   set platform=windows
   if %PROCESSOR_ARCHITECTURE%==AMD64 (set architecture=amd64) else (set architecture=arm64)

   :: Binary
   curl -LO https://github.com/codex-storage/nim-codex/releases/download/%version%/codex-%version%-%platform%-%architecture%-libs.zip

   :: Checksum
   curl -LO https://github.com/codex-storage/nim-codex/releases/download/%version%/codex-%version%-%platform%-%architecture%-libs.zip.sha256
   ```

2. Verify checksum
   ```batch
   for /f "delims=" %a in ('certUtil -hashfile codex-%version%-%platform%-%architecture%-libs.zip SHA256 ^| findstr -vrc:"[^0123-9aAb-Cd-EfF ]"') do @set ACTUAL_HASH=%a
   for /f "tokens=1" %a in (codex-%version%-%platform%-%architecture%-libs.zip.sha256) do set EXPECTED_HASH=%a
   if %ACTUAL_HASH% == %EXPECTED_HASH% (echo. && echo codex-%version%-%platform%-%architecture%-libs.zip: OK) else (echo. && echo codex-%version%-%platform%-%architecture%-libs.zip: FAILED)
    ```

   Make sure you get `OK` in the result
   ```
   codex-v0.1.4-windows-amd64-libs.zip: OK
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
   setx PATH %PATH%%LOCALAPPDATA%\Codex;

   :: Add folder to the path for the current session
   PATH %PATH%%LOCALAPPDATA%\Codex;
   ```

4. Check the result
   ```shell
   codex --version
   ```
   ```shell
   Codex version:  v0.1.4
   Codex revision: 484124d
   Nim Compiler Version 1.6.14 [Windows: amd64]
   Compiled at 2024-06-27
   Copyright (c) 2006-2023 by Andreas Rumpf

   git hash: 38640664088251bbc88917b4bacfd86ec53014b8
   active boot switches: -d:release
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
   ```batch
   :: Get Public IP
   for /f "delims=" %a in ('curl -s https://ip.codex.storage') do @set nat=%a

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

When your Codex node is up and running you can interact with it using [Codex Marketplace UI](https://marketplace.codex.storage) for files sharing.

Also, you can interact with Codex using [Codex API](/developers/api) and for a walk-through of the API, consider following the [Using Codex](/learn/using) guide.

## Stay in touch

Want to stay up-date, or looking for further assistance? Try our [discord-server](https://discord.gg/codex-storage).

Ready to explore Codex functionality? Please [Join Codex Testnet](/networks/testnet).

If you want to run Codex locally without joining the Testnet, consider trying the [two-client-test](https://github.com/codex-storage/nim-codex/blob/master/docs/TwoClientTest.md) or the [marketplace-test](https://github.com/codex-storage/nim-codex/blob/master/docs/Marketplace.md).
