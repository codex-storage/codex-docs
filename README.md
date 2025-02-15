# Documentación de Codex

Bienvenido a la documentación de Codex.

Codex es una plataforma descentralizada de almacenamiento de datos que ofrece una gran resistencia a la censura y sólidas garantías de durabilidad.

## Ejecutar y construir

Para la documentación, utilizamos [VitePress](https://vitepress.dev/), que es un generador de sitios web estáticos impulsado por [Vue](https://vuejs.org/) construido sobre [Vite](https://vitejs.dev/).

Para ejecutar el sitio localmente, debemos clonar el repositorio, instalar las dependencias y ejecutar el siguiente comando:

```shell
npm run docs:dev
 ```

 <details>
 <summary>Guía detallada</summary>

 1. [Instala](https://nodejs.org/en/download/package-manager) node 20 o [superior](https://nodejs.org/en/about/previous-releases)

    Usando [nvm](https://github.com/nvm-sh/nvm)
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

 2. Clona el repositorio
    ```shell
    git clone https://github.com/codex-storage/codex-docs
    cd codex-docs
    ```

 3. Instala las dependencias
    ```shell
    npm install
    ```

 4. Inicia un servidor de desarrollo local con actualizaciones instantáneas
    ```shell
    # Local
    npm run docs:dev

    # Expose
    npm run docs:dev -- --host
    ```

 5. [Genera el sitio web](https://vitepress.dev/guide/deploy)
    ```shell
    npm run docs:build

    # .vitepress/dist
    ```
 </details>


## Contribuir

 Por favor, consulta la [documentación de VitePress](https://vitepress.dev/) para obtener más información sobre las opciones de personalización.

 Proceso:

*   Haz un fork del repositorio.
*   Crea una rama (branch) en tu fork.
*   Añade tu contribución.
*   Envía un pull request (PR) al repositorio upstream.

 Estructura del proyecto:
- `learn` - Toda la información para aprender sobre Codex.
- `networks` - Información relacionada con las redes de Codex.
- `developers` - Proceso de desarrollo y guías de Codex.
