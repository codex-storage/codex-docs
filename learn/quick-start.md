# Quick start

 To join the Codex testnet we would need to perform the following steps:
 - [Review the disclaimer](/codex/disclaimer)
 - [Get Codex binary](#get-codex-binary)
 - [Run Codex](#run-codex)
 - [Interact with Codex](#interact-with-codex)

### Get Codex binary

 For quick start we will use precompiled binaries from [GitHub release page](https://github.com/codex-storage/nim-codex/releases). If you prefer to compile from the sources, please check [Build Codex](/learn/build).

 1. Download binary and checksum for your platform/architecture

    **Linux/macOS**
    ```shell
    version=v0.1.3
    platform=$(echo `uname -s` | awk '{print tolower($0)}')
    architecture=$([[ `uname -m` == 'x86_64' ]] && echo amd64 || echo arm64)

    # Binary
    curl -LO https://github.com/codex-storage/nim-codex/releases/download/${version}/codex-${version}-${platform}-${architecture}.tar.gz

    # Checksum
    curl -LO https://github.com/codex-storage/nim-codex/releases/download/${version}/codex-${version}-${platform}-${architecture}.tar.gz.sha256
    ```

 2. Verify checksum
    ```shell
    # Linux
    sha256sum -c codex-${version}-${platform}-${architecture}.tar.gz.sha256

    # macOS
    shasum -a 256 -c codex-${version}-${platform}-${architecture}.tar.gz.sha256
    ```
    Make sure you get `OK` in the result
    ```
    codex-v0.1.3-linux-amd64.tar.gz: OK
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
    Codex version:  v0.1.3
    Codex revision: 89917d4
    Nim Compiler Version 1.6.14 [Linux: amd64]
    ```

 7. Cleanup
    ```shell
    rm -f \
      codex-${version}-${platform}-${architecture} \
      codex-${version}-${platform}-${architecture}.tar.gz \
      codex-${version}-${platform}-${architecture}.tar.gz.sha256
    ```


### Run Codex

 To run your Codex node and join the testnet, follow the steps in the [codex-testnet-starter](https://github.com/codex-storage/codex-testnet-starter/blob/master/SETUP_HOME.md).

 If you want to run Codex locally without joining the testnet, consider trying the [two-client-test](https://github.com/codex-storage/nim-codex/blob/master/docs/TwoClientTest.md) or the [marketplace-test](https://github.com/codex-storage/nim-codex/blob/master/docs/Marketplace.md).

### Interact with Codex

 When your Codex node is up and running you can interact with it using [Codex API](/developers/api).

 For a walk-through of the API, consider following the [using-codex](https://github.com/codex-storage/codex-testnet-starter/blob/master/USINGCODEX.md) guide.

### Stay in touch

 Want to stay up-date, or looking for further assistence? Try our [discord-server](https://discord.gg/codex-storage).
