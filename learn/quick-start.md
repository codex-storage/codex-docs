# Quick start

 To start to use Codex we would need to perform the following steps
 - [Get Codex binary](#get-codex-binary)
 - [Run Codex](#run-codex)
 - [Interact with Codex](#interact-with-codex)

### Get Codex binary

 For quick start we would use precompiled binaries from [GitHub release page](https://github.com/codex-storage/nim-codex/releases). If you rather prefer to compile from the sources, please check [Build Codex](/learn/build-codex).

 1. Download binary and checksum for your platform/architecture

    **Linux/macOS**
    ```shell
    version=v0.1.3
    platform=linux     # darwin
    architecture=amd64 # arm64

    # Binary
    curl -LO https://github.com/codex-storage/nim-codex/releases/download/${version}/codex-${version}-${platform}-${architecture}.tar.gz

    # Checksum
    curl -LO https://github.com/codex-storage/nim-codex/releases/download/${version}/codex-${version}-${platform}-${architecture}.tar.gz.sha256
    ```

 2. Verify checksum
    ```shell
    sha256sum -c codex-${version}-${platform}-${architecture}.tar.gz.sha256
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

 5. Check the result
    ```shell
    codex --version
    ```
    ```shell
    Codex version:  v0.1.3
    Codex revision: 89917d4
    Nim Compiler Version 1.6.14 [Linux: amd64]
    ```

 6. Cleanup
    ```shell
    rm -f \
      codex-${version}-${platform}-${architecture} \
      codex-${version}-${platform}-${architecture}.tar.gz \
      codex-${version}-${platform}-${architecture}.tar.gz.sha256
    ```


### Run Codex

 Currently, we can run Codex in two modes
 - **Client node** - you can upload/download files and purchase storage
 - **Storage node** - you can sell your local storage

 For quick start we will run Codex client node as an easiest way and if you would like to run a storage node please follow [Run Codex](/learn/run) and [Codex Testnet](/networks/testnet) guides.

 1. Run Codex client node
    ```shell
    codex \
      --data-dir=./data \
      --api-cors-origin="*" \
      --nat=`curl -s https://ip.codex.storage` \
      --disc-port=8090 \
      --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
      --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P
    ```
    ::: tip
    In the example above we use [Codex Testnet](/networks/testnet#bootstrap-nodes) bootstrap nodes and thus we join Testnet. If you would like to join a different network, please use [appropriate value](/networks).
    :::

 2. Configure port-forwarding for the TCP/UDP ports on your Internet router
    | Protocol | Service   | Port   |
    | -------- | --------- | ------ |
    | UDP      | Discovery | `8090` |
    | TCP      | Transport | `8070` |

### Interact with Codex

 After we performed steps above, we have Codex client node up and running and can interact with it using [Codex API](/developers/api).

 We can perform basic tasks like

 **Check node information**
 ```shell
 curl http://localhost:8080/api/codex/v1/debug/info \
  --write-out '\n'
 ```

 **Upload file**
 ::: warning
 Once you upload a file to Codex, other nodes in the network can download it.
 :::
 ```shell
 curl --request POST \
  http://localhost:8080/api/codex/v1/data \
  --header 'Content-Type: application/json' \
  --write-out '\n' \
  -T <FILE>
 ```
 You will get CID when upload will be finished

 **Download file**
 ```shell
 CID="..." # paste your CID from the previous step here between the quotes
 ```
 ```shell
 curl http://localhost:8080/api/codex/v1/data/${CID}/network -o ${CID}
 ```

### Next steps

 Now we have Codex node up and running and know how to interact with it.

 For more advanced use cases, please check the following guides
 - [Run Codex](/learn/run)
 - [Codex Testnet](/networks/testnet)
