# Codex documentation

 Welcome to Codex documentation.

 Codex is a decentralised data storage platform that provides exceptionally strong censorship resistance and durability guarantees.


## Run and build

 For documentation we use [VitePress](https://vitepress.dev/), which is [Vue](https://vuejs.org/)-powered static site generator built on top of [Vite](https://vitejs.dev/).

 To run site locally, we should clone repository, install dependencies and run the following command
 ```shell
 npm run docs:dev
 ```

 <details>
 <summary>Detailed guide</summary>

 1. [Install](https://nodejs.org/en/download/package-manager) node 20 or [above](https://nodejs.org/en/about/previous-releases)

    Using [nvm](https://github.com/nvm-sh/nvm)
    ```shell
    # nvm
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

    # Node 22
    nvm install 22
    nvm use 22

    # Check
    node --version
    v22.6.0
    ```

 2. Clone repository
    ```shell
    git clone https://github.com/codex-storage/codex-docs
    cd codex-docs
    ```

 3. Install dependencies
    ```shell
    npm install
    ```

 4. Start a local dev server with instant hot updates
    ```shell
    # Local
    npm run docs:dev

    # Expose
    npm run docs:dev -- --host
    ```

 5. [Build the site](https://vitepress.dev/guide/deploy)
    ```shell
    npm run docs:build

    # .vitepress/dist
    ```
 </details>


## Contribute

 Please check [VitePress documentation](https://vitepress.dev/) for more details about customizations.

 Process
 - Create a fork
 - Create a custom branch in your fork
 - Add your contribution
 - Make a PR to the upstream repository

 Project structure
 - `learn` - All information to learn about Codex
 - `networks` - Codex networks related information
 - `developers` - Codex development process and guides
