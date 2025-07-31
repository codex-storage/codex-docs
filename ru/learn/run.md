---
outline: [2, 4]
---
# Запуск Codex

На данный момент Codex реализован только на [Nim](https://nim-lang.org) и находится в репозитории [nim-codex](https://github.com/codex-storage/nim-codex).

Это консольное приложение, которое может быть запущено разными способами:
 - [Использование бинарного файла](#using-binary)
 - [Запуск как сервис в Linux](#run-as-a-service-in-linux)
 - [Запуск как сервис в Windows](#run-as-a-service-in-windows) (пока не поддерживается)
 - [Использование Docker](#using-docker)
 - [Использование Docker Compose](#using-docker-compose)
 - [На Kubernetes](#on-kubernetes)

При запуске необходимо передать [параметры конфигурации](#configuration) приложению, что можно сделать разными способами.

## Конфигурация

Настроить узел Codex можно несколькими способами:
 1. [Параметры командной строки](#cli-options)
 2. [Переменные окружения](#environment-variables)
 3. [Файл конфигурации](#configuration-file)

Приоритет следующий:
[Параметры командной строки](#cli-options) --> [Переменные окружения](#environment-variables) --> [Файл конфигурации](#configuration-file).

### Общая информация

#### Единицы измерения

Для некоторых параметров конфигурации мы можем передавать значения в общепринятых единицах измерения:
```shell
--cache-size=1m/1M/1mb/1MB
--storage-quota=2m/2M/2mb/2MB

--block-mi=1s/1S/1m/1M/1h/1H/1d/1D/1w/1W
--block-ttl=2s/2S/2m/2M/2h/2H/2d/2D/2w/2W
```

#### Логирование

Codex использует библиотеку логирования [Chronicles](https://github.com/status-im/nim-chronicles), которая обеспечивает большую гибкость в работе с логами.
Chronicles использует концепцию тем, которые группируют записи логов по семантическим группам.

Используя параметр `log-level`, вы можете установить общий уровень логирования, например `--log-level="trace"`, но что более важно,
вы можете установить уровни логирования для конкретных тем, например `--log-level="info; trace: marketplace,node; error: blockexchange"`,
что устанавливает общий уровень логирования в `info`, а для тем `marketplace` и `node` устанавливает уровень `trace` и так далее.

### Параметры командной строки

```shell
codex --help

Использование:

codex [ПАРАМЕТРЫ]... команда

Доступны следующие параметры:

     --config-file          Загружает конфигурацию из TOML файла [=none].
     --log-level            Устанавливает уровень логирования [=info].
     --metrics              Включает сервер метрик [=false].
     --metrics-address      Адрес прослушивания сервера метрик [=127.0.0.1].
     --metrics-port         HTTP порт прослушивания сервера метрик [=8008].
 -d, --data-dir             Директория, где codex будет хранить конфигурацию и данные
                            [=/root/.cache/codex].
 -i, --listen-addrs         Multi-адреса для прослушивания [=/ip4/0.0.0.0/tcp/0].
 -a, --nat                  Метод обхода NAT для определения публичного адреса.
                            Варианты: any, none, upnp, pmp, extip:<IP> [any]
 -u, --disc-port            Порт обнаружения (UDP) [=8090].
     --net-privkey          Источник сетевого (secp256k1) приватного ключа - путь к файлу или имя [=key].
 -b, --bootstrap-node       Указывает один или несколько узлов начальной загрузки для использования при подключении к сети.
     --max-peers            Максимальное количество пиров для подключения [=160].
     --num-threads          Количество рабочих потоков ("0" = использовать столько потоков, сколько доступно ядер CPU).
     --agent-string         Строка агента узла, используемая как идентификатор в сети [=Codex].
     --api-bindaddr         Адрес привязки REST API [=127.0.0.1].
 -p, --api-port             Порт REST API [=8080].
     --api-cors-origin      Разрешенный источник CORS для REST API при загрузке данных. '*' разрешит все
                            источники, '' не разрешит ни одного. [=Запретить все кросс-оригинальные запросы
                            для загрузки данных].
     --repo-kind            Бэкенд для основного хранилища репозитория (fs, sqlite, leveldb) [=fs].
 -q, --storage-quota        Размер общего квота хранилища, выделенного узлу [=$DefaultQuotaBytes].
 -t, --block-ttl            Таймаут блока по умолчанию в секундах - 0 отключает ttl [=$DefaultBlockTtl].
     --block-mi             Интервал времени в секундах - определяет частоту цикла обслуживания блоков: как
                            часто блоки проверяются на истечение срока действия и очищаются
                            [=$DefaultBlockMaintenanceInterval].
     --block-mn             Количество блоков для проверки в каждом цикле обслуживания [=1000].
 -c, --cache-size           Размер кэша блоков, 0 отключает кэш - может помочь на медленных жестких дисках
                            [=0].

Доступные подкоманды:

codex persistence [ПАРАМЕТРЫ]... команда

Доступны следующие параметры:

     --eth-provider         URL JSON-RPC API узла Ethereum [=ws://localhost:8545].
     --eth-account          Учетная запись Ethereum, используемая для контрактов хранения.
     --eth-private-key      Файл, содержащий приватный ключ Ethereum для контрактов хранения.
     --marketplace-address  Адрес развернутого контракта Marketplace.
     --validator            Включает валидатор, требует узел Ethereum [=false].
     --validator-max-slots  Максимальное количество слотов, которые мониторит валидатор [=1000].
     --reward-recipient     Адрес для отправки выплат (например, вознаграждений и возвратов).
     --request-cache-size   Максимальное количество StorageRequests, хранящихся в памяти. Уменьшает получение данных StorageRequest из контракта. [=128].

Доступные подкоманды:

codex persistence prover [ПАРАМЕТРЫ]...

Доступны следующие параметры:

 -cd, --circuit-dir          Директория, где Codex будет хранить данные схемы доказательств
                            [=/root/.cache/codex/circuits].
     --circom-r1cs          Файл r1cs для схемы хранения
                            [=/root/.cache/codex/circuits/proof_main.r1cs].
     --circom-wasm          Файл wasm для схемы хранения
                            [=/root/.cache/codex/circuits/proof_main.wasm].
     --circom-zkey          Файл zkey для схемы хранения
                            [=/root/.cache/codex/circuits/proof_main.zkey].
     --circom-no-zkey       Игнорировать файл zkey - использовать только для тестирования! [=false].
     --proof-samples        Количество образцов для доказательства [=5].
     --max-slot-depth       Максимальная глубина дерева слотов [=32].
     --max-dataset-depth    Максимальная глубина дерева наборов данных [=8].
     --max-block-depth      Максимальная глубина дерева Меркла сетевых блоков [=5].
     --max-cell-elements    Максимальное количество элементов в ячейке [=67].
```

### Переменные окружения

Чтобы установить параметр конфигурации с помощью переменных окружения, сначала найдите нужный [параметр командной строки](#cli-options)
и затем преобразуйте его следующим образом:

 1. добавьте префикс `CODEX_`
 2. сделайте его заглавными буквами
 3. замените `-` на `_`

Например, чтобы настроить `--log-level`, используйте `CODEX_LOG_LEVEL` как имя переменной окружения.

> [!WARNING]
> Некоторые параметры пока не могут быть настроены через переменные окружения [^multivalue-env-var] [^sub-commands].

### Файл конфигурации

Для установки значений конфигурации также можно использовать файл [TOML](https://toml.io/en/). Имена параметров конфигурации и соответствующие значения размещаются в файле, разделенные `=`. Имена параметров конфигурации можно получить из команды [`codex --help`](#cli-options), и они не должны включать префикс `--`. Например, уровень логирования узла (`--log-level`) можно настроить с помощью TOML следующим образом:

```toml
log-level = "trace"
```

Для параметров, таких как `bootstrap-node` и `listen-addrs`, которые принимают несколько значений, мы можем указать данные как массив
```toml
listen-addrs = [
  "/ip4/0.0.0.0/tcp/1234",
  "/ip4/0.0.0.0/tcp/5678"
]
```

Узел Codex может затем прочитать конфигурацию из этого файла, используя параметр `--config-file` командной строки:
```shell
codex --config-file=/path/to/your/config.toml
```

Пожалуйста, проверьте [Запуск как сервис в Linux](#run-as-a-service-in-linux) для полного примера файла конфигурации.

## Запуск

В основном, мы можем запустить Codex в трех разных режимах:
 - [Узел Codex](#codex-node) - полезен для локального тестирования/разработки и базового обмена файлами.
 - [Узел Codex с поддержкой маркетплейса](#codex-node-with-marketplace-support) - вы можете обмениваться файлами и покупать хранилище, это основной режим и должен использоваться конечными пользователями.
 - [Узел хранения Codex](#codex-storage-node) - должен использоваться поставщиками хранилища или если вы хотите продавать свое локальное хранилище.

 Мы также кратко рассмотрим [Узел начальной загрузки Codex](#codex-bootstrap-node).

### Использование бинарного файла

#### Узел Codex

Мы можем запустить Codex простым способом:
```shell
codex
```
> [!WARNING]
> Эта команда может работать некорректно при использовании релизов GitHub [^data-dir].

Но, она будет использовать значение `data-dir` по умолчанию, и мы можем передать пользовательское:
```shell
codex --data-dir=datadir
```

Это запустит Codex как изолированный экземпляр, и если мы хотим присоединиться к существующей сети, необходимо передать [узел начальной загрузки](#codex-bootstrap-node). Мы можем передать несколько узлов:
```shell
codex \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --bootstrap-node=spr:CiUIAhIhAyUvcPkKoGE7-gh84RmKIPHJPdsX5Ugm_IHVJgF-Mmu_EgIDARo8CicAJQgCEiEDJS9w-QqgYTv6CHzhGYog8ck92xflSCb8gdUmAX4ya78QoemesAYaCwoJBES39Q2RAnVOKkYwRAIgLi3rouyaZFS_Uilx8k99ySdQCP1tsmLR21tDb9p8LcgCIG30o5YnEooQ1n6tgm9fCT7s53k6XlxyeSkD_uIO9mb3
```

> [!IMPORTANT]
> Убедитесь, что вы используете правильное значение для [сети](/networks/networks), к которой хотите присоединиться.

Также, чтобы сделать ваш узел Codex доступным для других участников сети, необходимо указать публичный IP-адрес, который можно использовать для доступа к вашему узлу:
```shell
codex \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --nat=any
```

> [!TIP]
> Мы можем установить публичный IP с помощью curl и сервиса определения IP, например [ip.codex.storage](https://ip.codex.storage).

После этого узел будет объявлять себя, используя ваш публичный IP, UDP-порт по умолчанию ([обнаружение](https://docs.libp2p.io/concepts/discovery-routing/overview/)) и динамический TCP-порт ([передача данных](https://docs.libp2p.io/concepts/transports/overview/)), которые можно настроить следующим образом:
```shell
codex \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --nat=any \
  --disc-port=8090 \
  --listen-addrs=/ip4/0.0.0.0/tcp/8070
```

Таким образом, узел будет объявлять себя, используя указанный [multi-адрес](https://docs.libp2p.io/concepts/fundamentals/addressing/), и мы можем проверить это через [API](https://api.codex.storage/#tag/Debug/operation/getDebugInfo) вызов:
```shell
curl -s localhost:8080/api/codex/v1/debug/info | jq -r '.announceAddresses'
```
```json
[
  "/ip4/<ваш публичный IP>/tcp/8070"
]
```
В основном, для P2P-коммуникации мы должны указать и настроить два порта:
| # | Протокол | Функция                                                                 | Параметр командной строки | Пример                                |
| - | -------- | ------------------------------------------------------------------------ | ---------------- | -------------------------------------- |
| 1 | UDP      | [Обнаружение](https://docs.libp2p.io/concepts/discovery-routing/overview/) | `--disc-port`    | `--disc-port=8090`                     |
| 2 | TCP      | [Транспорт](https://docs.libp2p.io/concepts/transports/overview/)        | `--listen-addrs` | `--listen-addrs=/ip4/0.0.0.0/tcp/8070` |

Также необходимо настроить [проброс портов](#port-forwarding) на вашем интернет-маршрутизаторе, чтобы сделать ваш узел доступным для участников.

Итак, полностью рабочая базовая конфигурация будет выглядеть следующим образом:
```shell
codex \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --nat=any \
  --disc-port=8090 \
  --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
  --api-cors-origin="*"
```

After node is up and running and port-forwarding configurations was done, we should be able to [Upload a file](/learn/using#upload-a-file)/[Download a file](/learn/using#download-a-file) in the network using [API](/developers/api).

You also can use [Codex App UI](https://app.codex.storage) for files upload/download.

And to be able to purchase a storage, we should run [Codex node with marketplace support](#codex-node-with-marketplace-support).

#### Узел Codex с поддержкой маркетплейса

Для запуска узла Codex с поддержкой маркетплейса необходимо добавить несколько дополнительных параметров:

```shell
codex \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --nat=any \
  --disc-port=8090 \
  --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
  --api-cors-origin="*" \
  --eth-provider=ws://localhost:8545 \
  --eth-account=0x45BC5ca0fbdD9F920Edd12B90908448C30F32a37 \
  --eth-private-key=0x06c7ac11d4ee1d0ccb53811b71802fa92d40a5a174afad9f2cb44f93498322c3 \
  --marketplace-address=0x1234567890123456789012345678901234567890
```

> [!NOTE]
> Для работы с маркетплейсом необходимо иметь запущенный узел Ethereum и развернутый контракт Marketplace.

#### Узел хранения Codex

Узел хранения Codex - это специальный тип узла, который предоставляет хранилище для других участников сети. Для его запуска необходимо добавить параметр `--validator`:

```shell
codex \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --nat=any \
  --disc-port=8090 \
  --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
  --api-cors-origin="*" \
  --eth-provider=ws://localhost:8545 \
  --eth-account=0x45BC5ca0fbdD9F920Edd12B90908448C30F32a37 \
  --eth-private-key=0x06c7ac11d4ee1d0ccb53811b71802fa92d40a5a174afad9f2cb44f93498322c3 \
  --marketplace-address=0x1234567890123456789012345678901234567890 \
  --validator=true \
  --validator-max-slots=1000 \
  --reward-recipient=0x45BC5ca0fbdD9F920Edd12B90908448C30F32a37
```

> [!NOTE]
> Узел хранения требует больше ресурсов, чем обычный узел, так как он должен хранить и обслуживать данные для других участников сети.

#### Узел начальной загрузки Codex

Узел начальной загрузки - это специальный узел, который помогает новым узлам присоединиться к сети. Для его запуска необходимо добавить параметр `--bootstrap`:

```shell
codex \
  --data-dir=datadir \
  --nat=any \
  --disc-port=8090 \
  --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
  --api-cors-origin="*" \
  --bootstrap=true
```

> [!NOTE]
> Узел начальной загрузки должен быть доступен для других участников сети, поэтому важно правильно настроить проброс портов.

### Запуск как сервис в Linux

Для запуска Codex как системного сервиса в Linux можно использовать systemd. Создайте файл конфигурации `/etc/systemd/system/codex.service`:

```ini
[Unit]
Description=Codex Node
After=network.target

[Service]
Type=simple
User=codex
Group=codex
WorkingDirectory=/home/codex
ExecStart=/usr/local/bin/codex --config-file=/etc/codex/config.toml
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

И файл конфигурации `/etc/codex/config.toml`:

```toml
data-dir = "/home/codex/.codex"
bootstrap-node = [
  "spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P"
]
nat = "any"
disc-port = 8090
listen-addrs = ["/ip4/0.0.0.0/tcp/8070"]
api-cors-origin = "*"
eth-provider = "ws://localhost:8545"
eth-account = "0x45BC5ca0fbdD9F920Edd12B90908448C30F32a37"
eth-private-key = "0x06c7ac11d4ee1d0ccb53811b71802fa92d40a5a174afad9f2cb44f93498322c3"
marketplace-address = "0x1234567890123456789012345678901234567890"
validator = true
validator-max-slots = 1000
reward-recipient = "0x45BC5ca0fbdD9F920Edd12B90908448C30F32a37"
```

Затем выполните следующие команды:

```shell
sudo systemctl daemon-reload
sudo systemctl enable codex
sudo systemctl start codex
```

### Запуск как сервис в Windows

This functionality is not supported yet :construction:

### Использование Docker

Для запуска Codex в Docker можно использовать официальный образ:

```shell
docker run -d \
  --name codex \
  -p 8070:8070 \
  -p 8090:8090/udp \
  -p 8080:8080 \
  -v /path/to/data:/root/.codex \
  codexstorage/codex:latest \
  --data-dir=/root/.codex \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --nat=any \
  --disc-port=8090 \
  --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
  --api-cors-origin="*"
```

### Использование Docker Compose

Для более сложных конфигураций можно использовать Docker Compose. Создайте файл `docker-compose.yml`:

```yaml
version: '3'
services:
  codex:
    image: codexstorage/codex:latest
    container_name: codex
    ports:
      - "8070:8070"
      - "8090:8090/udp"
      - "8080:8080"
    volumes:
      - /path/to/data:/root/.codex
    command: >
      --data-dir=/root/.codex
      --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P
      --nat=any
      --disc-port=8090
      --listen-addrs=/ip4/0.0.0.0/tcp/8070
      --api-cors-origin="*"
```

Затем выполните:

```shell
docker-compose up -d
```

### На Kubernetes

Для запуска Codex в Kubernetes создайте файл `codex-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: codex
spec:
  replicas: 1
  selector:
    matchLabels:
      app: codex
  template:
    metadata:
      labels:
        app: codex
    spec:
      containers:
      - name: codex
        image: codexstorage/codex:latest
        ports:
        - containerPort: 8070
          name: tcp
        - containerPort: 8090
          name: udp
          protocol: UDP
        - containerPort: 8080
          name: api
        volumeMounts:
        - name: codex-data
          mountPath: /root/.codex
        command:
        - codex
        - --data-dir=/root/.codex
        - --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P
        - --nat=any
        - --disc-port=8090
        - --listen-addrs=/ip4/0.0.0.0/tcp/8070
        - --api-cors-origin="*"
      volumes:
      - name: codex-data
        persistentVolumeClaim:
          claimName: codex-pvc
```

И примените его:

```shell
kubectl apply -f codex-deployment.yaml
```

## How-tos

### NAT Configuration 

Use the `--nat` CLI flag to specify how your codex node should handle NAT traversal. Below are the available options:

**any**(default): This option will automatically try to detect your public IP by checking the routing table or using UPnP/PMP NAT traversal techniques. If successful, it will use the detected public IP and port for the announce address.

**upnp**: This option exclusively uses [UPnP](https://en.wikipedia.org/wiki/Universal_Plug_and_Play) to detect the public IP and create a port mapping entry, if your device supports UPnP.

**pmp**: This option uses only [NAT-PMP](https://en.wikipedia.org/wiki/NAT_Port_Mapping_Protocol) to detect the public IP and create a port mapping entry, if your device supports NAT-PMP.

**extIP:[Your Public IP]**:Use this option if you want to manually specify an external IP address and port for the announce address. When selecting this option, you'll need to configure **port forwarding** on your router to ensure that incoming traffic is directed to the correct internal IP and port.

### Port Forwarding 

If you're running on a private network, you'll need to set up port forwarding to ensure seamless communication between the codex node and its peers. It's also recommended to configure appropriate firewall rules for TCP and UDP traffic.
While the specific steps required vary based on your router, they can be summarised as follows:
1. Find your public IP address by either visiting [ip-codex](https://ip.codex.storage/) or running `curl ip.codex.storage`
2. Identify your [private](#determine-your-private-ip) IP address 
3. Access your router's settings by entering its IP address (typically [http://192.168.1.1](http://192.168.1.1/)) in your web browser
4. Sign in with administrator credentials and locate the port forwarding settings
5. Set up the discovery port forwarding rule with these settings:
    - External Port: 8090
    - Internal Port: 8090
    - Protocol: UDP
    - IP Address: Your device's private IP address
6. Set up the libp2p port forwarding rule with these settings:
    - External Port: 8070
    - Internal Port: 8070
    - Protocol: TCP
    - IP Address: Your device's private IP address

#### Determine your private IP

To determine your private IP address, run the appropriate command for your OS:

**Linux**: 
```shell
ip addr show | grep "inet " | grep -v 127.0.0.1
```

**Windows**: 
```shell
ipconfig | findstr /i "IPv4 Address"
```

**MacOs**: 
```shell
ifconfig | grep "inet " | grep -v 127.0.0.1
```

## Known issues

[^multivalue-env-var]: Environment variables like `CODEX_BOOTSTRAP_NODE` and `CODEX_LISTEN_ADDRS` does not support multiple values. Please check [[Feature request] Support multiple SPR records via environment variable #525](https://github.com/codex-storage/nim-codex/issues/525), for more information.
[^sub-commands]: Sub-commands `persistence` and `persistence prover` can't be set via environment variables.
[^data-dir]: We should set data-dir explicitly when we use GitHub releases - [[BUG] Change codex default datadir from compile-time to run-time #923](https://github.com/codex-storage/nim-codex/issues/923)
[^eth-account]: Please ignore `--eth-account` CLI option - [Drop support for --eth-account #727](https://github.com/codex-storage/nim-codex/issues/727).
