# Using Codex
Codex's web-API is documented: [Here](https://github.com/codex-storage/nim-codex/blob/master/openapi.yaml)

This document will show you several useful API calls.

## Overview
1. [Debug](#debug)
2. [Upload a file](#upload-a-file)
3. [Download a file](#download-a-file)
4. [Local data](#local-data)
5. [Create storage availability](#create-storage-availability)
6. [Purchase storage](#purchase-storage)
7. [View purchase status](#view-purchase-status)


## Debug
An easy way to check that your node is up and running is:

```shell
curl http://localhost:8080/api/codex/v1/debug/info \
  --write-out '\n'
```

This will return a JSON structure with plenty of information about your local node. It contains peer information that may be useful when troubleshooting connection issues.


## Upload a file
> [!Warning]
> Once you upload a file to Codex, other nodes in the network can download it. Please do not upload anything you don't want others to access, or, properly encrypt your data *first*.

```shell
curl --request POST \
  http://localhost:8080/api/codex/v1/data \
  --header 'Content-Type: application/json' \
  --write-out '\n' \
  -T <FILE>
```

On successful upload, you'll receive a CID. This can be used to download the file from any node in the network.

> [!TIP]
> Are you on the [Codex Discord server](https://discord.gg/codex-storage)? Post your CID in the [#testnet](https://discord.com/channels/895609329053474826/1278383098102284369) channel, see if others are able to download it. Codex does not (yet?) provide file metadata, so if you want others to be able to open your file, tell them which extension to give it.

## Download a file
When you have a CID of data you want to download, you can use the following commands:

```shell
CID="..." # paste your CID from the previous step here between the quotes
```

```shell
curl -o "${CID}.png" "http://localhost:8080/api/codex/v1/data/${CID}/network"
```

Please use the correct extension for the downloaded file, because Codex does not store yet content-type or extension information.

## Local data
You can view which datasets are currently being stored by your node.

```shell
curl http://localhost:8080/api/codex/v1/data \
  --write-out '\n'
```

## Create storage availability
> [!WARNING]
> This step requires that Codex was started with the [`prover`](/learn/run#codex-storage-node) option.

In order to start selling storage space to the network, you must configure your node with the following command. Once configured, the node will monitor on-chain requests-for-storage and will automatically enter into contracts that meet these specifications. In order to enter and maintain storage contracts, your node is required to submit zero-knowledge storage proofs. The calculation of these proofs will increase the CPU and RAM usage of Codex.

```shell
curl --request POST \
  http://localhost:8080/api/codex/v1/sales/availability \
  --header 'Content-Type: application/json' \
  --write-out '\n' \
  --data '{
    "totalSize": "8000000",
    "duration": "7200",
    "minPrice": "10",
    "maxCollateral": "10"
  }'
```

For descriptions of each parameter, please view the [spec](https://api.codex.storage/#tag/Marketplace/operation/offerStorage).

## Purchase storage
To purchase storage space from the network, first you must upload your data. Once you have the CID, use the following to create a request-for-storage.

Set your CID:

```shell
CID="..." # paste your CID from the previous step here between the quotes
echo "CID: ${CID}"
```

Next you can run:

```shell
curl --request POST \
  "http://localhost:8080/api/codex/v1/storage/request/${CID}" \
  --write-out '\n' \
  --data '{
    "duration": "3600",
    "reward": "1",
    "proofProbability": "5",
    "expiry": "1200",
    "nodes": 5,
    "tolerance": 2,
    "collateral": "1"
  }'
```

For descriptions of each parameter, please view the [spec](https://api.codex.storage/#tag/Marketplace/operation/createStorageRequest).

When successful, this request will return a Purchase-ID.


## View purchase status
Using a Purchase-ID, you can check the status of your request-for-storage contract:

```shell
PURCHASE_ID="..."
```

Then:

```shell
curl "http://localhost:8080/api/codex/v1/storage/purchases/${PURCHASE_ID}" \
  --write-out '\n'
```

This will display state and error information for your purchase.
| State     | Description                                                                                                                                                                                            |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Pending   | Request is waiting for chain confirmation.                                                                                                                                                             |
| Submitted | Request is on-chain. Hosts may now attempt to download the data.                                                                                                                                       |
| Started   | Hosts have downloaded the data and provided proof-of-storage.                                                                                                                                          |
| Failed    | The request was started, but (too many) hosts failed to provide proof-of-storage on time. While the data may still be available in the network, for the purpose of the purchase it is considered lost. |
| Finished  | The request was started successfully and the duration has elapsed.                                                                                                                                     |
| Expired   | (Not enough) hosts have submitted proof-of-storage before the request's expiry elapsed.                                                                                                                |
| Errored   | An unfortunate state of affairs. The 'error' field should tell you more.                                                                                                                               |

## Known issues
1. We add a new line to the API calls to get more readable output, please check [[rest] Add line ending on responses #771](https://github.com/codex-storage/nim-codex/issues/771) for more details.
