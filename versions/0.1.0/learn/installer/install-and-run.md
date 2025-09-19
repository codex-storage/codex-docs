# (0.1.0)Quick Start

Codex Installer is a CLI tool that simplifies the process of setting up a Codex node. It handles all the necessary steps to get your node running quickly and efficiently.

> Before we get started, please make sure to review and accept the [disclaimer](../../codex/installer-disclaimer) as Codex Installer collects some of your node information to improve the user experience.

<br/>

<iframe width="560" height="315" src="https://www.youtube.com/embed/CcFtQzmzGSg?si=wUHfIgGWggIcyzqT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## (0.1.0)Requirements

- git
- npm

## (0.1.0)Run the Codex Installer

To start the Codex Installer, simply run the following command in your terminal :

```bash
npx codexstorage
```

## (0.1.0)Download and install Codex

Once you run the above command, you will be seeing a command line interface with various options as below :

![InstallCodex](/public/learn/codex-installer.png)

On selecting the `Download and install Codex` option, you will be asked to agree to the privacy disclaimer and provide an installation path to finish your installation. If you do not wish to agree to the data collection disclaimer, you can select the `Exit` option and follow the instructions [Manual setup](../quick-start.md) to install Codex without using the Installer.

## (0.1.0)Run the Codex node

Upon selecting the `Run Codex node` option, you will be asked for your Listening port (default is 8070) and discovery port (default is 8090). You can optionally provide your ERC20 public address to associate your testnet node with your wallet (Please note that Codex does not promise any incentives for running a node yet).

![RunCodex](/public/learn/codex-installer2.png)

Keep this terminal window open as closing this will terminate your node.

## (0.1.0)Get the *ALTRUISTIC MODE* role on Codex discord

With that, your Codex node should be up and running. You can check the information and status of your node by proceeding to the third option.

![Get Role](/public/learn/codex-installer3.png)

To claim the *ALTRUISTIC MODE* role, join the [Codex Discord](https://discord.gg/codex-storage) and go to the #bot channel. Run the `/node <NODE_ID>` command where `<NODE_ID>` can be found in the Node Information menu in your Installer.

In order to keep your role, you will be required to frequently interact with the Codex testnet by running your node and/or [uploading/downloading files](./upload-and-download.md) using the testnet.