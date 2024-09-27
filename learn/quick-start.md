# Quick start

 To join the Codex testnet we would need to perform the following steps:
 - [Review the disclaimer](/codex/disclaimer)
 - [Get Codex binary](#get-codex-binary)
 - [Run Codex](#run-codex)
 - [Interact with Codex](#interact-with-codex)

### Get Codex binary

 For quick start we will use precompiled binaries from [GitHub release page](https://github.com/codex-storage/nim-codex/releases). If you prefer to compile from the sources, please check [Build Codex](/learn/build).

 Please follow the steps for your OS from the list:
 - [Linux/macOS](#linux-macos)
 - [Windows](#windows)

#### Linux/macOS

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

#### Windows

 1. Download binary and checksum for your platform/architecture
    ::: warning
    For Windows, only amd64 architecture is supported now.
    :::
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

### Run Codex

 To run your Codex node and join the testnet, follow the steps in the [codex-testnet-starter](https://github.com/codex-storage/codex-testnet-starter/blob/master/SETUP_HOME.md).

 If you want to run Codex locally without joining the testnet, consider trying the [two-client-test](https://github.com/codex-storage/nim-codex/blob/master/docs/TwoClientTest.md) or the [marketplace-test](https://github.com/codex-storage/nim-codex/blob/master/docs/Marketplace.md).

### Interact with Codex

 When your Codex node is up and running you can interact with it using [Codex API](/developers/api).

 For a walk-through of the API, consider following the [using-codex](https://github.com/codex-storage/codex-testnet-starter/blob/master/USINGCODEX.md) guide.

### Stay in touch

 Want to stay up-date, or looking for further assistance? Try our [discord-server](https://discord.gg/codex-storage).
