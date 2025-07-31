# Сборка Codex

## Содержание

- [Установка инструментов разработчика](#prerequisites)
  - [Linux](#linux)
  - [macOS](#macos)
  - [Windows + MSYS2](#windows-msys2)
  - [Другие](#other)
- [Клонирование и подготовка Git-репозитория](#repository)
- [Сборка исполняемого файла](#executable)
- [Запуск примера](#example-usage)

**Дополнительно**
- [Запуск тестов](#tests)

## Предварительные требования

Для сборки nim-codex необходимо установить и сделать доступными инструменты разработчика в операционной системе.

Инструкции ниже примерно соответствуют настройкам окружения в [CI workflow](https://github.com/codex-storage/nim-codex/blob/master/.github/workflows/ci.yml) nim-codex и известны как рабочие.

Другие подходы могут быть жизнеспособны. На macOS некоторые пользователи могут предпочесть [MacPorts](https://www.macports.org/) вместо [Homebrew](https://brew.sh/). На Windows вместо MSYS2 некоторые пользователи могут предпочесть установку инструментов разработчика с помощью [winget](https://docs.microsoft.com/en-us/windows/package-manager/winget/), [Scoop](https://scoop.sh/) или [Chocolatey](https://chocolatey.org/), или загрузку установщиков для, например, Make и CMake, в остальном полагаясь на официальные инструменты разработчика Windows. Приветствуются вклады сообщества в эти документы и нашу систему сборки!

### Rust

Текущая реализация схемы доказательств с нулевым разглашением Codex требует установки Rust версии 1.79.0 или выше. Убедитесь, что вы установили его для вашей ОС и добавили в PATH вашего терминала так, чтобы команда `cargo --version` показывала совместимую версию.

### Linux

> [!WARNING]
> Сборка в Linux в настоящее время требует gcc $\leq$ 13. Если это не вариант в вашей системе, вы можете попробовать [сборку в Docker](#building-within-docker) как обходной путь.

*Команды менеджера пакетов могут требовать `sudo` в зависимости от настройки ОС.*

На базовой установке Debian (или дистрибутива, производного от Debian, такого как Ubuntu), выполните

```shell
apt-get update && apt-get install build-essential cmake curl git rustc cargo
```

Не-Debian дистрибутивы имеют разные менеджеры пакетов: `apk`, `dnf`, `pacman`, `rpm`, `yum` и т.д.

Например, на базовой установке Fedora выполните

```shell
dnf install @development-tools cmake gcc-c++ rust cargo
```

В случае, если ваш дистрибутив не предоставляет требуемую версию Rust, мы можем установить её с помощью [rustup](https://www.rust-lang.org/tools/install)
```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs/ | sh -s -- --default-toolchain=1.79.0 -y

. "$HOME/.cargo/env"
```

Обратите внимание, что в настоящее время вы не сможете собрать Codex с gcc 14. Чтобы проверить, что у вас поддерживаемая версия, выполните:

```shell
gcc --version
```

Если вы получите число, начинающееся с 14 (например, `14.2.0`), то вам нужно либо понизить версию, либо попробовать обходной путь, например [сборку в Docker](#building-within-docker).

### macOS

Установите [Xcode Command Line Tools](https://mac.install.guide/commandlinetools/index.html), открыв терминал и выполнив
```shell
xcode-select --install
```

Установите [Homebrew (`brew`)](https://brew.sh/) и в новом терминале выполните
```shell
brew install bash cmake rust
```

Проверьте, что `PATH` настроен правильно
```shell
which bash cmake

# /usr/local/bin/bash
# /usr/local/bin/cmake
```

### Windows + MSYS2

*Инструкции ниже предполагают, что ОС - 64-битная Windows и что оборудование или ВМ совместимо с [x86-64](https://en.wikipedia.org/wiki/X86-64).*

Скачайте и запустите установщик с [msys2.org](https://www.msys2.org/).

Запустите среду MSYS2 [environment](https://www.msys2.org/docs/environments/). UCRT64 обычно рекомендуется: из меню *Пуск* Windows выберите `MSYS2 MinGW UCRT x64`.

Предполагая среду UCRT64, в Bash выполните
```shell
pacman -Suy
pacman -S base-devel git unzip mingw-w64-ucrt-x86_64-toolchain mingw-w64-ucrt-x86_64-cmake mingw-w64-ucrt-x86_64-rust
```

Нам следует понизить GCC до версии 13 [^gcc-14]
```shell
pacman -U --noconfirm \
  https://repo.msys2.org/mingw/ucrt64/mingw-w64-ucrt-x86_64-gcc-13.2.0-6-any.pkg.tar.zst \
  https://repo.msys2.org/mingw/ucrt64/mingw-w64-ucrt-x86_64-gcc-libs-13.2.0-6-any.pkg.tar.zst
```

#### Опционально: Интеграция с терминалом VSCode

Вы можете связать терминал MSYS2-UCRT64 с VSCode, изменив файл конфигурации, как показано ниже.
Файл: `C:/Users/<username>/AppData/Roaming/Code/User/settings.json`
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

### Другие

Возможно, что nim-codex может быть собран и запущен на других платформах, поддерживаемых языком [Nim](https://nim-lang.org/): семейство BSD, более старые версии Windows и т.д. Не было достаточного экспериментирования с nim-codex на таких платформах, поэтому инструкции не предоставляются. Приветствуются вклады сообщества в эти документы и нашу систему сборки!

## Репозиторий

В Bash выполните
```shell
git clone https://github.com/codex-storage/nim-codex.git repos/nim-codex && cd repos/nim-codex
```

nim-codex использует [nimbus-build-system](https://github.com/status-im/nimbus-build-system), поэтому затем выполните
```shell
make update
```

Этот шаг может занять некоторое время для завершения, потому что по умолчанию он собирает [компилятор Nim](https://nim-lang.org/docs/nimc.html).

Чтобы увидеть больше вывода от `make`, передайте `V=1`. Это работает для всех целей `make` в проектах, использующих nimbus-build-system
```shell
make V=1 update
```

## Исполняемый файл

В Bash выполните
```shell
make
```

Цель `make` по умолчанию создает исполняемый файл `build/codex`.

## Инструменты

### Инструмент загрузки схемы

Чтобы собрать инструмент загрузки схемы, расположенный в `tools/cirdl`, выполните:

```shell
make cirdl
```

## Пример использования

См. инструкции в [Быстром старте](/learn/quick-start).

## Тесты

В Bash выполните
```shell
make test
```

### testAll

#### Предварительные требования

Для запуска интеграционных тестов требуется тестовый узел Ethereum. Следуйте этим инструкциям для его настройки.

##### Windows (сделайте это перед "Все платформы")

1. Скачайте и установите Visual Studio 2017 или новее. (Не VSCode!) В обзоре рабочих нагрузок включите `Desktop development with C++`. ( https://visualstudio.microsoft.com )

##### Все платформы

1. Установите NodeJS (проверено с v18.14.0), рассмотрите использование NVM как менеджера версий. [Node Version Manager (`nvm`)](https://github.com/nvm-sh/nvm#readme)
1. Откройте терминал
1. Перейдите в папку vendor/codex-contracts-eth: `cd /<git-root>/vendor/codex-contracts-eth/`
1. `npm install` -> Должно завершиться с количеством добавленных пакетов и обзором известных уязвимостей.
1. `npm test` -> Должен вывести результаты тестов. Может занять минуту.

Перед запуском интеграционных тестов вы должны вручную запустить тестовый узел Ethereum.
1. Откройте терминал
1. Перейдите в папку vendor/codex-contracts-eth: `cd /<git-root>/vendor/codex-contracts-eth/`
1. `npm start` -> Это должно запустить Hardhat и вывести ряд ключей и предупреждающее сообщение.

#### Запуск

Цель `testAll` запускает те же тесты, что и `make test`, а также запускает тесты для контрактов Ethereum nim-codex, а также базовый набор интеграционных тестов.

Чтобы запустить `make testAll`.

Используйте новый терминал для запуска:
```shell
make testAll
```

## Сборка в Docker

Для конкретного случая дистрибутивов Linux, которые поставляются с gcc 14
и понижение до 13 невозможно/нежелательно, сборка в контейнере Docker
и извлечение бинарных файлов путем копирования или монтирования остается
вариантом; например:

```bash=
# Клонировать оригинальный репозиторий.
git clone https://github.com/codex-storage/nim-codex

# Собрать внутри docker
docker build -t codexstorage/nim-codex:latest -f nim-codex/docker/codex.Dockerfile nim-codex

# Извлечь исполняемый файл
docker create --name=codex-build codexstorage/nim-codex:latest
docker cp codex-build:/usr/local/bin/codex ./codex
docker cp codex-build:/usr/local/bin/cirdl ./cirdl
```

и вуаля, у вас должны быть бинарные файлы доступны в текущей папке.
