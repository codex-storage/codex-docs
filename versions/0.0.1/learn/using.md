---
outline: [2, 3]
---
# (0.0.1)Using Codex

We can interact with Codex using [REST API](../developers/api). This document will show you several useful examples.

Also, we can check [Codex App UI](https://app.codex.storage).

Command line interpreter on [Linux/macOS](#linux-macos) and [Windows](#windows) works slightly different, so please use steps for your OS.

## (0.0.1)Linux/macOS

### (0.0.1)Overview
1. [Debug](#debug)
2. [Upload a file](#upload-a-file)
3. [Download a file](#download-a-file)
4. [Local data](#local-data)

### (0.0.1)Debug
An easy way to check that your node is up and running is:

```shell
curl http://localhost:8080/api/codex/v1/debug/info \
  -w '\n'
```

This will return a JSON structure with plenty of information about your local node. It contains peer information that may be useful when troubleshooting connection issues.

### (0.0.1)Upload a file
> [!Warning]
> Once you upload a file to Codex, other nodes in the network can download it. Please do not upload anything you don't want others to access, or, properly encrypt your data *first*.

```shell
curl -X POST \
  http://localhost:8080/api/codex/v1/data \
  -H 'Content-Type: application/octet-stream' \
  -w '\n' \
  -T <FILE>
```

On successful upload, you'll receive a CID. This can be used to download the file from any node in the network.

> [!TIP]
> Are you on the [Codex Discord server](https://discord.gg/codex-storage)? Post your CID in the [# (0.0.1):wireless: | share-cids](https://discord.com/channels/895609329053474826/1278383098102284369) channel, see if others are able to download it. Codex does not (yet?) provide file metadata, so if you want others to be able to open your file, tell them which extension to give it.

### (0.0.1)Download a file
When you have a CID of data you want to download, you can use the following commands:

```shell
# (0.0.1)paste your CID from the previous step here between the quotes
CID="..."
```

```shell
curl "http://localhost:8080/api/codex/v1/data/${CID}/network/stream" \
  -o "${CID}.png"
```

Please use the correct extension for the downloaded file, because Codex does not store yet content-type or extension information.

### (0.0.1)Local data
You can view which datasets are currently being stored by your node:

```shell
curl http://localhost:8080/api/codex/v1/data \
  -w '\n'
```

## (0.0.1)Windows

### (0.0.1)Overview {#overview-windows}
1. [Debug](#debug-windows)
2. [Upload a file](#upload-a-file-windows)
3. [Download a file](#download-a-file-windows)
4. [Local data](#local-data-windows)

### (0.0.1)Debug {#debug-windows}
An easy way to check that your node is up and running is:

```batch
curl http://localhost:8080/api/codex/v1/debug/info
```

This will return a JSON structure with plenty of information about your local node. It contains peer information that may be useful when troubleshooting connection issues.

### (0.0.1)Upload a file {#upload-a-file-windows}
> [!Warning]
> Once you upload a file to Codex, other nodes in the network can download it. Please do not upload anything you don't want others to access, or, properly encrypt your data *first*.

```batch
curl -X POST ^
  http://localhost:8080/api/codex/v1/data ^
  -H "Content-Type: application/octet-stream" ^
  -T <FILE>
```

On successful upload, you'll receive a CID. This can be used to download the file from any node in the network.

> [!TIP]
> Are you on the [Codex Discord server](https://discord.gg/codex-storage)? Post your CID in the [# (0.0.1):wireless: | share-cids](https://discord.com/channels/895609329053474826/1278383098102284369) channel, see if others are able to download it. Codex does not (yet?) provide file metadata, so if you want others to be able to open your file, tell them which extension to give it.

### (0.0.1)Download a file {#download-a-file-windows}
When you have a CID of data you want to download, you can use the following commands:

```batch
:: paste your CID from the previous step here between the quotes
set CID="..."
```

```batch
curl "http://localhost:8080/api/codex/v1/data/%CID%/network/stream" ^
  -o "%CID%.png"
```

Please use the correct extension for the downloaded file, because Codex does not store yet content-type or extension information.

### (0.0.1)Local data {#local-data-windows}
You can view which datasets are currently being stored by your node:

```batch
curl http://localhost:8080/api/codex/v1/data
```

## (0.0.1)Known issues
1. We add a new line to the API calls to get more readable output, please check [[rest] Add line ending on responses #771](https://github.com/codex-storage/nim-codex/issues/771) for more details.
