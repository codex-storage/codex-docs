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
 - `developers` - Codex development process and guides


## Internationalization

 We are using built-in [i18n features for Internationalization support](https://vitepress.dev/guide/i18n).

 In order to add a new language version of the docs it is required
 1. Create a folder with a name of the two letter language code - `ko` for Korean, please check [List of ISO 639 language codes](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes).

 2. Copy and translate required pages. It make sense to use English pages as a source as it is the primary language. Pages are located inside the repository sub-folders
    - *codex*
    - *developers*
    - *learn*
    - *networks*

    After translation, we will have a new folder with all sub-folders
    ```
    ko
    ├── codex
    ├── developers
    ├── learn
    └── networks
    ```

 3. If you need to translate images, they are located inside a *public* folder. After translation, add a language suffix to the language specific file, for example *public/learn/architecture-`ko`.png*.

    Then, update the docs to use a language specific image.

 4. Add new language to the site config file - [*.vitepress/config.mts*](.vitepress/config.mts)
    ```json
    // Korean
    ko: {
      label: '한국어',
      lang: 'ko-KP',
      link: '/ko',
      themeConfig: {}
    }
    ```
    - `label` - Native language name from [List of ISO 639 language codes](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes)
    - `lang` - [\<Language code\>](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes)-[\<Country code\>](https://en.wikipedia.org/wiki/ISO_3166-1)
    - `link` - link to the index document located in the language specific folder
    - `themeConfig` - contains translation of the site elements like Nav/Side bar, etc.

 After performed changes, we should have a documentation site in a newly added language.
