---
outline: [2, 3]
---
# Запуск локальной сети Codex с поддержкой маркетплейса

Это руководство научит вас, как запустить небольшую сеть Codex с включенным
_маркетплейсом хранения_; т.е. функциональностью в Codex, которая
позволяет участникам предлагать и покупать хранилище на рынке, обеспечивая
честное выполнение обязательств поставщиками хранилища с помощью криптографических доказательств.

В этом руководстве вы:

1. [Настроите сеть Geth PoA](#_1-set-up-a-geth-poa-network);
2. [Настроите маркетплейс](#_2-set-up-the-marketplace);
3. [Запустите Codex](#_3-run-codex);
4. [Купите и продайте хранилище на маркетплейсе](#_4-buy-and-sell-storage-on-the-marketplace).

## Предварительные требования

Для прохождения этого руководства вам понадобится:

* клиент Ethereum [geth](https://github.com/ethereum/go-ethereum);
  Вам нужна версия `1.13.x` geth, так как более новые версии больше не поддерживают
  Proof of Authority (PoA). Это руководство было протестировано с версией geth `1.13.15`.
* бинарный файл Codex, который [можно собрать из исходного кода](https://github.com/codex-storage/nim-codex?tab=readme-ov-file#build-and-run).

Мы также будем использовать синтаксис [bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell))
на протяжении всего руководства. Если вы используете другую оболочку, вам может потребоваться адаптировать
команды под вашу платформу.

Для начала создайте новую папку, где мы будем хранить файлы, связанные с руководством,
чтобы держать их отдельно от репозитория codex.
Предположим, что имя папки будет `marketplace-tutorial`.

## 1. Настройка сети Geth PoA

Для этого руководства мы будем использовать простую
[Proof-of-Authority](https://github.com/ethereum/EIPs/issues/225) сеть
с geth. Первым шагом является создание _учетной записи подписанта_: учетной записи, которая
будет использоваться geth для подписи блоков в сети.
Любой блок, подписанный подписантом, принимается как действительный.

### 1.1. Создание учетной записи подписанта

Чтобы создать учетную запись подписанта, из директории `marketplace-tutorial` выполните:

```bash
geth account new --datadir geth-data
```

Генератор учетных записей попросит вас ввести пароль, который вы можете
оставить пустым. Затем он выведет некоторую информацию,
включая публичный адрес учетной записи:

```bash
INFO [09-29|16:49:24.244] Maximum peer count                       ETH=50 total=50
Your new account is locked with a password. Please give a password. Do not forget this password.
Password:
Repeat password:

Your new key was generated

Public address of the key:   0x33A904Ad57D0E2CB8ffe347D3C0E83C2e875E7dB
Path of the secret key file: geth-data/keystore/UTC--2024-09-29T14-49-31.655272000Z--33a904ad57d0e2cb8ffe347d3c0e83c2e875e7db

- You can share your public address with anyone. Others need it to interact with you.
- You must NEVER share the secret key with anyone! The key controls access to your funds!
- You must BACKUP your key file! Without the key, it's impossible to access account funds!
- You must REMEMBER your password! Without the password, it's impossible to decrypt the key!
```

В этом примере публичный адрес учетной записи подписанта -
`0x33A904Ad57D0E2CB8ffe347D3C0E83C2e875E7dB`.
У вас будет выведен другой адрес. Сохраните его для дальнейшего использования.

Затем установите переменную окружения для дальнейшего использования:

```bash
export GETH_SIGNER_ADDR="0x0000000000000000000000000000000000000000"
echo ${GETH_SIGNER_ADDR} > geth_signer_address.txt
```

> Здесь убедитесь, что вы заменили `0x0000000000000000000000000000000000000000`
> на ваш публичный адрес учетной записи подписанта
> (`0x33A904Ad57D0E2CB8ffe347D3C0E83C2e875E7dB` в нашем примере).

### 1.2. Настройка сети и создание генезис-блока

Следующий шаг - указать geth, какую сеть вы хотите запустить.
Мы будем запускать [pre-merge](https://ethereum.org/en/roadmap/merge/)
сеть с консенсусом Proof-of-Authority.
Чтобы это работало, создайте файл `network.json`.

Если вы установили переменную `GETH_SIGNER_ADDR` выше, вы можете выполнить следующую
команду для создания файла `network.json`:

```bash
echo  "{\"config\": { \"chainId\": 12345, \"homesteadBlock\": 0, \"eip150Block\": 0, \"eip155Block\": 0, \"eip158Block\": 0, \"byzantiumBlock\": 0, \"constantinopleBlock\": 0, \"petersburgBlock\": 0, \"istanbulBlock\": 0, \"berlinBlock\": 0, \"londonBlock\": 0, \"arrowGlacierBlock\": 0, \"grayGlacierBlock\": 0, \"clique\": { \"period\": 1, \"epoch\": 30000 } }, \"difficulty\": \"1\", \"gasLimit\": \"8000000\", \"extradata\": \"0x0000000000000000000000000000000000000000000000000000000000000000${GETH_SIGNER_ADDR:2}0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000\", \"alloc\": { \"${GETH_SIGNER_ADDR}\": { \"balance\": \"10000000000000000000000\"}}}" > network.json
```

Вы также можете создать файл вручную, не забыв обновить его своим
публичным адресом подписанта:

```json
{
  "config": {
    "chainId": 12345,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 0,
    "berlinBlock": 0,
    "londonBlock": 0,
    "arrowGlacierBlock": 0,
    "grayGlacierBlock": 0,
    "clique": {
      "period": 1,
      "epoch": 30000
    }
  },
  "difficulty": "1",
  "gasLimit": "8000000",
  "extradata": "0x000000000000000000000000000000000000000000000000000000000000000033A904Ad57D0E2CB8ffe347D3C0E83C2e875E7dB0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "alloc": {
    "0x33A904Ad57D0E2CB8ffe347D3C0E83C2e875E7dB": {
      "balance": "10000000000000000000000"
    }
  }
}
```

Обратите внимание, что адрес учетной записи подписанта встроен в два разных места:
* внутри строки `"extradata"`, окруженный нулями и без префикса `0x`;
* как ключ записи в секции `alloc`.
  Убедитесь, что вы заменили этот ID на ID учетной записи, который вы записали в
  [Шаге 1.1](#_1-1-create-a-signer-account).

После создания `network.json` вы можете инициализировать сеть с помощью:

```bash
geth init --datadir geth-data network.json
```

В выводе этой команды могут быть предупреждения, например:

```bash
WARN [08-21|14:48:12.305] Unknown config environment variable      envvar=GETH_SIGNER_ADDR
```

или даже ошибки при первом запуске команды:

```bash
ERROR[08-21|14:48:12.399] Head block is not reachable
```

Важно, что в конце вы должны увидеть что-то похожее на:

```bash
INFO [08-21|14:48:12.639] Successfully wrote genesis state         database=lightchaindata hash=768bf1..42d06a
```

### 1.3. Запуск вашего PoA узла

Теперь мы готовы запустить нашу $1$-узловую приватную блокчейн-сеть.
Чтобы запустить узел подписанта, откройте отдельный терминал в той же рабочей
директории и убедитесь, что у вас установлена переменная `GETH_SIGNER_ADDR`.
Для удобства используйте `geth_signer_address.txt`:

```bash
export GETH_SIGNER_ADDR=$(cat geth_signer_address.txt)
```

Имея установленную переменную `GETH_SIGNER_ADDR`, выполните:

```bash
geth\
  --datadir geth-data\
  --networkid 12345\
  --unlock ${GETH_SIGNER_ADDR}\
  --nat extip:127.0.0.1\
  --netrestrict 127.0.0.0/24\
  --mine\
  --miner.etherbase ${GETH_SIGNER_ADDR}\
  --http\
  --allow-insecure-unlock
```

Обратите внимание, что учетная запись подписанта, созданная в
[Шаге 1.1](#_1-1-create-a-signer-account), снова появляется как в
`--unlock`, так и в `--allow-insecure-unlock`.

Geth попросит вас ввести пароль учетной записи при запуске.
После этого он должен запуститься и начать "майнить" блоки.

Здесь также могут возникнуть ошибки, например:

```bash
ERROR[08-21|15:00:27.625] Bootstrap node filtered by netrestrict   id=c845e51a5e470e44 ip=18.138.108.67
ERROR[08-21|15:00:27.625] Bootstrap node filtered by netrestrict   id=f23ac6da7c02f84a ip=3.209.45.79
ERROR[08-21|15:00:27.625] Bootstrap node filtered by netrestrict   id=ef2d7ab886910dc8 ip=65.108.70.101
ERROR[08-21|15:00:27.625] Bootstrap node filtered by netrestrict   id=6b36f791352f15eb ip=157.90.35.166
```

Их можно безопасно игнорировать.

Если команда выше завершается с ошибкой:

```bash
Fatal: Failed to register the Ethereum service: only PoS networks are supported, please transition old ones with Geth v1.13.x
```

убедитесь, что вы используете правильную версию Geth
(см. раздел [Предварительные требования](#prerequisites))

## 2. Настройка маркетплейса

Для этого раздела вам нужно открыть новый терминал, и geth должен быть уже запущен.
Настройка маркетплейса Codex включает:

1. Развертывание контрактов маркетплейса Codex в нашу приватную блокчейн-сеть
2. Настройку учетных записей Ethereum, которые мы будем использовать для покупки и продажи хранилища в
   маркетплейсе Codex
3. Обеспечение этих учетных записей необходимыми балансами токенов

### 2.1. Развертывание контрактов маркетплейса Codex

Убедитесь, что вы вышли из директории `marketplace-tutorial` и клонируйте
`codex-storage/nim-codex.git`:

```bash
git clone https://github.com/codex-storage/nim-codex.git
```

> Если вы хотите просто клонировать репозиторий для прохождения руководства, вы можете
> пропустить историю и просто скачать голову ветки master, используя
> опцию `--depth 1`: `git clone --depth 1 https://github.com/codex-storage/nim-codex.git`

Таким образом, структура директорий для целей этого руководства выглядит так:

```bash
|
|-- nim-codex
└-- marketplace-tutorial
```

> Вы можете клонировать `codex-storage/nim-codex.git` в другое место.

Теперь из папки `nim-codex` выполните:

```bash
make update && make
```

> Это может занять некоторое время, так как это также соберет компилятор `nim`. Будьте терпеливы.

Теперь, чтобы запустить локальную сеть Ethereum, выполните:

```bash
cd vendor/codex-contracts-eth
npm install
```

> При написании документа мы использовали `node` версии `v20.17.0` и
> `npm` версии `10.8.2`.

Прежде чем продолжить, вы должны **дождаться, пока будет добыто $256$ блоков**
**в вашей PoA сети**, иначе развертывание завершится неудачей. Это должно занять около
$4$ минут и $30$ секунд. Вы можете проверить, на какой высоте блока вы находитесь,
выполнив следующую команду
**из папки `marketplace-tutorial`**:

```bash
geth attach --exec web3.eth.blockNumber ./geth-data/geth.ipc
```

как только это превысит $256$, вы готовы к работе.

Чтобы развернуть контракты, из директории `codex-contracts-eth` выполните:

```bash
export DISTTEST_NETWORK_URL=http://localhost:8545
npx hardhat --network codexdisttestnetwork deploy
```

Если команда завершится успешно, вы увидите вывод, похожий на этот:

```bash
Deployed Marketplace with Groth16 Verifier at:
0xCf0df6C52B02201F78E8490B6D6fFf5A82fC7BCd
```
> конечно, ваш адрес будет другим.

Теперь вы готовы подготовить учетные записи.

### 2.2. Генерация необходимых учетных записей

Мы будем запускать $2$ узла Codex: **поставщик хранилища**, который будет продавать хранилище
в сети, и **клиент**, который будет покупать и использовать такое хранилище;
поэтому нам нужны две действительные учетные записи Ethereum. Мы могли бы создать случайные
учетные записи, используя один из многих доступных инструментов, но, поскольку
это руководство работает в локальной приватной сети, мы просто предоставим вам
две предварительно созданные учетные записи вместе с их приватными ключами,
которые вы можете скопировать и вставить:

Сначала убедитесь, что вы вернулись в папку `marketplace-tutorial` и
не находитесь в подпапке `codex-contracts-eth`. Затем установите эти переменные:

**Хранилище:**
```bash
export ETH_STORAGE_ADDR=0x45BC5ca0fbdD9F920Edd12B90908448C30F32a37
export ETH_STORAGE_PK=0x06c7ac11d4ee1d0ccb53811b71802fa92d40a5a174afad9f2cb44f93498322c3
echo $ETH_STORAGE_PK > storage.pkey && chmod 0600 storage.pkey
```

**Клиент:**
```bash
export ETH_CLIENT_ADDR=0x9F0C62Fe60b22301751d6cDe1175526b9280b965
export ETH_CLIENT_PK=0x5538ec03c956cb9d0bee02a25b600b0225f1347da4071d0fd70c521fdc63c2fc
echo $ETH_CLIENT_PK > client.pkey && chmod 0600 client.pkey
```

### 2.3. Обеспечение учетных записей токенами

Теперь нам нужно перевести немного ETH на каждую из учетных записей, а также предоставить
им некоторые токены Codex для использования узлом хранилища в качестве залога и
для клиентского узла для покупки фактического хранилища.

Хотя процесс не особенно сложен, я предлагаю вам использовать
[скрипт, который мы подготовили](https://github.com/gmega/local-codex-bare/blob/main/scripts/mint-tokens.js)
для этого. Этот скрипт, по сути:

1. читает адрес контракта маркетплейса и его ABI из данных развертывания;
2. переводит $1$ ETH с учетной записи подписанта на целевую учетную запись, если целевая
   учетная запись не имеет баланса ETH;
3. чеканит $n$ токенов Codex и добавляет их в баланс целевой учетной записи.

Чтобы использовать скрипт, просто скачайте его в локальный файл с именем `mint-tokens.js`,
например, используя `curl` (убедитесь, что вы находитесь в
директории `marketplace-tutorial`):

```bash
# скачать скрипт
curl https://raw.githubusercontent.com/gmega/codex-local-bare/main/scripts/mint-tokens.js -o mint-tokens.js
```

Затем выполните:

```bash
# установить расположение файла контракта (мы предполагаем, что вы находитесь в директории marketplace-tutorial)
export CONTRACT_DEPLOY_FULL="../nim-codex/vendor/codex-contracts-eth/deployments/codexdisttestnetwork"
export GETH_SIGNER_ADDR=$(cat geth_signer_address.txt)
# Устанавливает Web3-js
npm install web3
# Предоставляет токены учетной записи хранилища.
node ./mint-tokens.js $CONTRACT_DEPLOY_FULL/TestToken.json $GETH_SIGNER_ADDR 0x45BC5ca0fbdD9F920Edd12B90908448C30F32a37 10000000000
# Предоставляет токены клиентской учетной записи.
node ./mint-tokens.js $CONTRACT_DEPLOY_FULL/TestToken.json $GETH_SIGNER_ADDR 0x9F0C62Fe60b22301751d6cDe1175526b9280b965 10000000000
```

Если вы получите сообщение типа 

```bash
Usage: mint-tokens.js <token-hardhat-deploy-json> <signer-account> <receiver-account> <token-ammount>
```

то вам нужно убедиться, что вы предоставили все необходимые аргументы.
В частности, вам нужно убедиться, что переменная окружения `GETH_SIGNER_ADDR`
содержит адрес подписанта (мы использовали
`export GETH_SIGNER_ADDR=$(cat geth_signer_address.txt)` выше, чтобы
убедиться, что она установлена).

## 3. Запуск Codex

С учетными записями и geth на месте, мы теперь можем запустить узлы Codex.

### 3.1. Узел хранилища

Узел хранилища будет тем, который хранит данные и отправляет доказательства
хранения в цепочку. Для этого ему нужен доступ к:

1. адресу контракта маркетплейса, который был развернут в
   локальном узле geth в [Шаге 2.1](#_2-1-deploy-the-codex-marketplace-contracts);
2. образцам файлов церемонии, которые поставляются в репозитории контрактов Codex
  (`nim-codex/vendor/codex-contracts-eth`).

**Адрес контракта маркетплейса.** Адрес контракта можно найти
внутри файла `nim-codex/vendor/codex-contracts-eth/deployments/codexdisttestnetwork/Marketplace.json`.
Мы захватили это расположение выше в переменной `CONTRACT_DEPLOY_FULL`, поэтому из
папки `marketplace-tutorial` просто выполните:

```bash
grep '"address":' ${CONTRACT_DEPLOY_FULL}/Marketplace.json
```

что должно вывести что-то вроде:
```bash
"address": "0xCf0df6C52B02201F78E8490B6D6fFf5A82fC7BCd",
```

> Этот адрес должен соответствовать адресу, который мы получили ранее при развертывании
> контракта маркетплейса выше.

Затем выполните следующее с правильным адресом маркетплейса:
```bash
export MARKETPLACE_ADDRESS="0x0000000000000000000000000000000000000000"
echo ${MARKETPLACE_ADDRESS} > marketplace_address.txt
```

где вы заменяете `0x0000000000000000000000000000000000000000` на
адрес контракта маркетплейса выше в
[Шаге 2.1](#_2-1-deploy-the-codex-marketplace-contracts).

**Файлы церемонии провайдера.** Файлы церемонии находятся в подкаталоге
`nim-codex/vendor/codex-contracts-eth/verifier/networks/codexdisttestnetwork`.
Их три: `proof_main.r1cs`, `proof_main.zkey`,
и `prooof_main.wasm`. Нам понадобятся все они для запуска узла хранилища Codex.

**Запуск узла хранилища.** Пусть:

* `PROVER_ASSETS` содержит директорию, где находятся файлы церемонии провайдера.
  **Это должен быть абсолютный путь**;
* `CODEX_BINARY` содержит расположение вашего бинарного файла Codex;
* `MARKETPLACE_ADDRESS` содержит адрес контракта маркетплейса
  (мы уже установили его выше).

Установите эти пути в переменные окружения (убедитесь, что вы находитесь в
директории `marketplace-tutorial`):

```bash
export CONTRACT_DEPLOY_FULL=$(realpath "../nim-codex/vendor/codex-contracts-eth/deployments/codexdisttestnetwork")
export PROVER_ASSETS=$(realpath "../nim-codex/vendor/codex-contracts-eth/verifier/networks/codexdisttestnetwork/")
export CODEX_BINARY=$(realpath "../nim-codex/build/codex")
export MARKETPLACE_ADDRESS=$(cat marketplace_address.txt)
```
> вы можете заметить, что мы уже установили переменную `CONTRACT_DEPLOY_FULL`
> выше. Здесь мы убеждаемся, что это абсолютный путь.

Чтобы запустить узел хранилища, выполните:

```bash
${CODEX_BINARY}\
  --data-dir=./codex-storage\
  --listen-addrs=/ip4/0.0.0.0/tcp/8080\
  --api-port=8000\
  --disc-port=8090\
  persistence\
  --eth-provider=http://localhost:8545\
  --eth-private-key=./storage.pkey\
  --marketplace-address=${MARKETPLACE_ADDRESS}\
  --validator\
  --validator-max-slots=1000\
  prover\
  --circom-r1cs=${PROVER_ASSETS}/proof_main.r1cs\
  --circom-wasm=${PROVER_ASSETS}/proof_main.wasm\
  --circom-zkey=${PROVER_ASSETS}/proof_main.zkey
```

**Запуск клиентского узла.**

Клиентский узел запускается аналогично, за исключением того, что:

* нам нужно передать SPR узла хранилища, чтобы он мог сформировать сеть с ним;
* поскольку он не выполняет никаких доказательств, ему не требуются файлы церемонии.

Мы получаем Signed Peer Record (SPR) узла хранилища, чтобы мы могли загрузить
клиентский узел с ним. Чтобы получить SPR, выполните следующий вызов:

```bash
curl -H 'Accept: text/plain' 'http://localhost:8000/api/codex/v1/spr' --write-out '\n'
```

Вы должны получить SPR, начинающийся с `spr:`.

Прежде чем продолжить, откройте новый терминал и войдите в директорию `marketplace-tutorial`.

Затем установите эти пути в переменные окружения:

```bash
# установить SPR для узла хранилища
export STORAGE_NODE_SPR=$(curl -H 'Accept: text/plain' 'http://localhost:8000/api/codex/v1/spr')
# базовые переменные
export CONTRACT_DEPLOY_FULL=$(realpath "../nim-codex/vendor/codex-contracts-eth/deployments/codexdisttestnetwork")
export CODEX_BINARY=$(realpath "../nim-codex/build/codex")
export MARKETPLACE_ADDRESS=$(cat marketplace_address.txt)
```
и затем выполните:

```bash
${CODEX_BINARY}\
  --data-dir=./codex-client\
  --listen-addrs=/ip4/0.0.0.0/tcp/8081\
  --api-port=8001\
  --disc-port=8091\
  --bootstrap-node=${STORAGE_NODE_SPR}\
  persistence\
  --eth-provider=http://localhost:8545\
```

## 4. Покупка и продажа хранилища на маркетплейсе

Любые переговоры о хранилище имеют две стороны: покупатель и продавец.
Поэтому, прежде чем мы сможем фактически запросить хранилище, мы должны сначала предложить
его на продажу.

### 4.1 Продажа хранилища

Следующий запрос заставит узел хранилища выставить $50\text{MB}$
хранилища на продажу на $1$ час по цене $1$ токен Codex
за слот в секунду, при этом выражая готовность принять максимум
$1000$ токенов Codex в качестве штрафа за невыполнение своей части контракта.[^1]

```bash
curl 'http://localhost:8000/api/codex/v1/sales/availability' \
  --header 'Content-Type: application/json' \
  --data '{
  "totalSize": "50000000",
  "duration": "3600",
  "minPrice": "1",
  "maxCollateral": "1000"
}'
```

Это должно вернуть JSON-ответ, содержащий `id` (например, `"id": "0xb55b3bc7aac2563d5bf08ce8a177a38b5a40254bfa7ee8f9c52debbb176d44b0"`),
который идентифицирует это предложение хранилища.

> Чтобы сделать JSON-ответы более читаемыми, вы можете попробовать
> утилиту форматирования JSON [jq](https://jqlang.github.io/jq/)
> просто добавив `| jq` после команды.
> На macOS вы можете установить с помощью `brew install jq`.

Чтобы проверить текущие предложения хранилища для этого узла, вы можете выполнить:

```bash
curl 'http://localhost:8000/api/codex/v1/sales/availability'
```

или с `jq`:

```bash
curl 'http://localhost:8000/api/codex/v1/sales/availability' | jq
```

Это должно вывести список предложений, с тем, который вы только что создали, среди
них (для нашего руководства, в это время будет возвращено только одно предложение).

### 4.2. Покупка хранилища

Прежде чем мы сможем купить хранилище, у нас должны быть некоторые фактические данные для запроса
хранилища. Начните с загрузки небольшого файла на ваш клиентский узел.
В Linux (или macOS) вы могли бы, например, использовать `dd` для генерации файла размером $1M$:

```bash
dd if=/dev/urandom of=./data.bin bs=1M count=1
```

Предполагая, что ваш файл называется `data.bin`, вы можете загрузить его с помощью:

```bash
curl --request POST http://localhost:8001/api/codex/v1/data --header 'Content-Type: application/octet-stream' --write-out '\n' -T ./data.bin
```

После завершения загрузки вы должны увидеть _Content Identifier_,
или _CID_ (например, `zDvZRwzm2mK7tvDzKScRLapqGdgNTLyyEBvx1TQY37J2CdWdS6Sj`)
для загруженного файла, выведенный в терминал.
Используйте этот CID в запросе на покупку:

```bash
# убедитесь, что заменили CID перед с CID, который вы получили на предыдущем шаге
export CID=zDvZRwzm2mK7tvDzKScRLapqGdgNTLyyEBvx1TQY37J2CdWdS6Sj
```

```bash
curl "http://localhost:8001/api/codex/v1/storage/request/${CID}" \
  --header 'Content-Type: application/octet-stream' \
  --data "{
    \"duration\": \"600\",
    \"reward\": \"1\",
    \"proofProbability\": \"3\",
    \"expiry\": \"500\",
    \"nodes\": 3,
    \"tolerance\": 1,
    \"collateral\": \"1000\"
  }" \
  --write-out '\n'
```

Параметры под `--data` говорят, что:

1. мы хотим купить хранилище для нашего файла на $5$ минут (`"duration": "600"`);
2. мы готовы платить до $1$ токена за слот в секунду (`"reward": "1"`)
3. наш файл будет разделен на три части (`"nodes": 3`). 
   Поскольку мы установили `"tolerance": 1`, нам нужно только две части (`nodes - tolerance`)
   для восстановления файла; т.е. мы можем допустить, что максимум один узел
   перестанет хранить наши данные; либо из-за сбоя, либо по другим причинам;
4. мы требуем `1000` токенов в качестве залога от поставщиков хранилища для каждой части.
   Поскольку есть $3$ такие части, всего будет `3000` залога,
   зафиксированного поставщиком(ами) хранилища, как только наш запрос будет начат.
5. наконец, `expiry` устанавливает временной лимит для заполнения всех слотов
   поставщиком(ами) хранилища. Если слоты не заполнены к моменту `expire`,
   запрос истечет и завершится неудачей. 

### 4.3. Отслеживание ваших запросов на хранилище

POST-запрос на хранилище сделает его доступным на рынке хранилища,
и узел хранилища в конечном итоге подберет его.

Вы можете опрашивать статус вашего запроса с помощью:
```bash
export STORAGE_PURCHASE_ID="1d0ec5261e3364f8b9d1cf70324d70af21a9b5dccba380b24eb68b4762249185"
curl "http://localhost:8001/api/codex/v1/storage/purchases/${STORAGE_PURCHASE_ID}"
```

Например:

```bash
> curl 'http://localhost:8001/api/codex/v1/storage/purchases/6c698cd0ad71c41982f83097d6fa75beb582924e08a658357a1cd4d7a2a6766d'
```

Это возвращает результат типа:

```json
{
  "requestId": "0x86501e4677a728c6a8031971d09b921c3baa268af06b9f17f1b745e7dba5d330",
  "request": {
    "client": "0x9f0c62fe60b22301751d6cde1175526b9280b965",
    "ask": {
      "slots": 3,
      "slotSize": "262144",
      "duration": "1000",
      "proofProbability": "3",
      "reward": "1",
      "collateral": "1",
      "maxSlotLoss": 1
    },
    "content": {
      "cid": "zDvZRwzkyw1E7ABaUSmgtNEDjC7opzhUoHo99Vpvc98cDWeCs47u"
    },
    "expiry": "1711992852",
    "nonce": "0x9f5e651ecd3bf73c914f8ed0b1088869c64095c0d7bd50a38fc92ebf66ff5915",
    "id": "0x6c698cd0ad71c41982f83097d6fa75beb582924e08a658357a1cd4d7a2a6766d"
  },
  "state": "submitted",
  "error": null
}
```

Показывает, что запрос был отправлен, но еще не заполнен.
Ваш запрос будет успешным, как только `"state"` покажет `"started"`.
Все, что отличается от этого, означает, что запрос еще не полностью
обработан, а состояние `"error"` отличное от `null` означает, что он завершился неудачей.

Ну что, это было довольно долгое путешествие, не так ли? Вы можете поздравить себя с
успешным завершением руководства по маркетплейсу codex!

[^1]: Файлы Codex разделяются на части, называемые "слотами", и распределяются
по различным поставщикам хранилища. Залог относится к одному такому слоту,
и будет медленно уменьшаться по мере того, как поставщик хранилища не сможет предоставить
своевременные доказательства, но фактическая логика [более сложна, чем это](https://github.com/codex-storage/codex-contracts-eth/blob/6c9f797f408608958714024b9055fcc330e3842f/contracts/Marketplace.sol#L209).
