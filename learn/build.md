# Construir Codex

## Tabla de Contenidos

- [Instalar herramientas de desarrollo](#prerequisites)
  - [Linux](#linux)
  - [macOS](#macos)
  - [Windows + MSYS2](#windows-msys2)
  - [Otros](#other)
- [Clonar y preparar el repositorio Git](#repository)
- [Construir el ejecutable](#executable)
- [Ejecutar el ejemplo](#example-usage)

**Opcional**
- [Ejecutar las pruebas](#tests)

## Prerrequisitos

Para construir nim-codex, es necesario instalar las herramientas de desarrollo y que sean accesibles en el sistema operativo.

Las instrucciones siguientes corresponden aproximadamente a las configuraciones ambientales en el flujo de trabajo CI de nim-codex [CI workflow](https://github.com/codex-storage/nim-codex/blob/master/.github/workflows/ci.yml) y se sabe que funcionan.

Otros enfoques pueden ser viables. En macOS, algunos usuarios pueden preferir [MacPorts](https://www.macports.org/) o [Homebrew](https://brew.sh/). En Windows, en lugar de usar MSYS2, algunos usuarios pueden preferir instalar herramientas de desarrollo con [winget](https://docs.microsoft.com/en-us/windows/package-manager/winget/), [Scoop](https://scoop.sh/), o [Chocolatey](https://chocolatey.org/), o descargar instaladores para, por ejemplo, Make y CMake, mientras que de otro modo confían en las herramientas de desarrollo oficiales de Windows. ¡Las contribuciones de la comunidad a estos documentos y a nuestro sistema de construcción son bienvenidas!

### Rust

La implementación actual del circuito de prueba de conocimiento cero de Codex requiere la instalación de rust v1.79.0 o superior. Asegúrate de instalarlo para tu sistema operativo y agregarlo a la ruta de tu terminal de tal manera que el comando `cargo --version` dé una versión compatible.

### Linux

> [¡ATENCION!]
> Las compilaciones de Linux actualmente requieren gcc ≤ 13. Si esta no es una opción en tu
> system, sistema, puedes intentar construir [dentro de Docker](#building-within-docker) como una solución alternativa.


*Los comandos del administrador de paquetes pueden requerir `sudo` dependiendo de la configuración del sistema operativo.*

En una instalación básica de Debian (o una distribución derivada de Debian, como Ubuntu), ejecuta

```shell
apt-get update && apt-get install build-essential cmake curl git rustc cargo
```

Las distribuciones que no son Debian tienen diferentes administradores de paquetes: `apk`, `dnf`, `pacman`, `rpm`, `yum`, etc.

Por ejemplo, en una instalación básica de Fedora, ejecuta

```shell
dnf install @development-tools cmake gcc-c++ rust cargo
```

En caso de que su distribución no proporcione la versión requerida de rust, podemos instalarla utilizando [rustup](https://www.rust-lang.org/tools/install)
```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs/ | sh -s -- --default-toolchain=1.79.0 -y

. "$HOME/.cargo/env"
```

Ten en cuenta que actualmente no podrás construir Codex con gcc 14. Para verificar
que tienes una versión compatible, ejecuta:

```shell
gcc --version
```

Si obtienes un número que comienza con 14 (p.j. `14.2.0`), entonces necesitas degradar o probar una solución alternativa como [construir dentro de Docker](#building-within-docker).

### macOS

Instala las Herramientas de [Línea de Comandos de Xcode](https://mac.install.guide/commandlinetools/index.html) abriendo una terminal y ejecutando
```shell
xcode-select --install
```

Instala [Homebrew (`brew`)](https://brew.sh/) y en una nueva terminal ejecuta
```shell
brew install bash cmake rust
```

Comprueba que `PATH` está configurado correctamente
```shell
which bash cmake

# /usr/local/bin/bash
# /usr/local/bin/cmake
```

### Windows + MSYS2

*Las siguientes instrucciones asumen que el sistema operativo es Windows de 64 bits y que el hardware o la máquina virtual es compatible con [x86-64](https://en.wikipedia.org/wiki/X86-64) *

Descarga y ejecuta el instalador desde [msys2.org](https://www.msys2.org/).

Inicia un [entorno MSYS2](https://www.msys2.org/docs/environments/). Generalmente se recomienda UCRT64: desde el menú *Inicio de Windows* selecciona `MSYS2 MinGW UCRT x64`.

Asumiendo un entorno UCRT64, en Bash ejecuta
```shell
pacman -Suy
pacman -S base-devel git unzip mingw-w64-ucrt-x86_64-toolchain mingw-w64-ucrt-x86_64-cmake mingw-w64-ucrt-x86_64-rust
```

Deberíamos degradar GCC a la versión 13 [^gcc-14]
```shell
pacman -U --noconfirm \
  https://repo.msys2.org/mingw/ucrt64/mingw-w64-ucrt-x86_64-gcc-13.2.0-6-any.pkg.tar.zst \
  https://repo.msys2.org/mingw/ucrt64/mingw-w64-ucrt-x86_64-gcc-libs-13.2.0-6-any.pkg.tar.zst
```

<!-- #### Headless Windows container -->
<!-- add instructions re: getting setup with MSYS2 in a Windows container -->
<!-- https://github.com/StefanScherer/windows-docker-machine -->

#### Opcional: Integración del Terminal de VSCode


Puedes vincular el terminal MSYS2-UCRT64 a VSCode modificando el archivo de configuración como se muestra a continuación.
Archivo: `C:/Users/<username>/AppData/Roaming/Code/User/settings.json`
```json
{
    ...
    "terminal.integrated.profiles.windows": {
      ...
      "MSYS2-UCRT64": {
        "path": "C:\\msys64\\usr\\bin\\bash.exe",
        "args": [
          "--login",
          "-i"
        ],
        "env": {
          "MSYSTEM": "UCRT64",
          "CHERE_INVOKING": "1",
          "MSYS2_PATH_TYPE": "inherit"
        }
      }
    }
}
```

### Otros

Es posible que nim-codex pueda ser construido y ejecutado en otras plataformas soportadas por el lenguaje [Nim](https://nim-lang.org/) : familia BSD, versiones antiguas de Windows, etc. No ha habido suficiente experimentación con nim-codex en tales plataformas, por lo que no se proporcionan instrucciones. ¡Las contribuciones de la comunidad a estos documentos y a nuestro sistema de construcción son bienvenidas!

## Repositorio

En Bash ejecuta
```shell
git clone https://github.com/codex-storage/nim-codex.git repos/nim-codex && cd repos/nim-codex
```

nim-codex utiliza el [nimbus-build-system](https://github.com/status-im/nimbus-build-system), así que a continuación ejecuta
```shell
make update
```

Este paso puede tardar un tiempo en completarse porque por defecto construye el [compilador de Nim](https://nim-lang.org/docs/nimc.html).

Para ver más salida de `make` pasa `V=1`. Esto funciona para todos los objetivos de `make` en proyectos que utilizan el nimbus-build-system
```shell
make V=1 update
```

## Ejecutable

En Bash ejecuta
```shell
make
```

El objetivo `make` predeterminado crea el ejecutable `build/codex`.

## Herramientas

### Herramienta de descarga de circuitos
Para construir la herramienta de descarga de circuitos ubicada en `tools/cirdl` ejecuta:

```shell
make cirdl
```

## Ejemplo de uso

Consulta las instrucciones en la [Guía de Inicio Rápido](/learn/quick-start).

## Pruebas

En Bash ejecuta
```shell
make test
```

### testAll

#### Prerrequisitos

Para ejecutar las pruebas de integración, se requiere un nodo de prueba de Ethereum. Sigue estas instrucciones para configurarlo.

##### Windows (haz esto antes de 'Todas las plataformas')

1. Descarga e instala Visual Studio 2017 o más nuevo. (¡No VSCode!). En la descripción general de Workloads, habilita `Desktop development with C++`. ( https://visualstudio.microsoft.com )

##### Todas las plataformas

1. Instala NodeJS (probado con v18.14.0), considera usar NVM como administrador de versiones. [Node Version Manager (`nvm`)](https://github.com/nvm-sh/nvm#readme)
1. Abre una terminal
1. Ve a la carpeta vendor/codex-contracts-eth: `cd /<git-root>/vendor/codex-contracts-eth/`
1. `npm install` -> Debería completarse con el número de paquetes añadidos y una descripción general de las vulnerabilidades conocidas.
1. `npm test` -> Debería mostrar los resultados de las pruebas. Puede tardar un minuto.

Antes de que se inicien las pruebas de integración, debes iniciar el nodo de prueba de Ethereum manualmente.
1. Abre una terminal
1. Ve a la carpeta vendor/codex-contracts-eth: `cd /<git-root>/vendor/codex-contracts-eth/`
1. `npm start` -> Esto debería iniciar Hardhat, y mostrar una serie de claves más un mensaje de advertencia.

#### Ejecutar

El objetivo `testAll` ejecuta las mismas pruebas que `make test` y también ejecuta pruebas para los contratos Ethereum de nim-codex, así como un conjunto básico de pruebas de integración.

Para ejecutar `make testAll`.

Usa una nueva terminal para ejecutar:
```shell
make testAll
```

## Construyendo Dentro de Docker

Para el caso específico de las distribuciones de Linux que se entregan con gcc 14 y una degradación a 13 no es posible/deseable, la construcción dentro de un contenedor Docker y la extracción de los binarios copiando o montando sigue siendo una opción; por ejemplo:

```bash=
# Clona el repositorio original.
git clone https://github.com/codex-storage/nim-codex

# Construye dentro de docker
docker build -t codexstorage/nim-codex:latest -f nim-codex/docker/codex.Dockerfile nim-codex

# Extrae el ejecutable
docker create --name=codex-build codexstorage/nim-codex:latest
docker cp codex-build:/usr/local/bin/codex ./codex
docker cp codex-build:/usr/local/bin/cirdl ./cirdl
```

y voilà, deberías tener los binarios disponibles en la carpeta actual.
