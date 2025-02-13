---
outline: [2, 3]
---
# Ejecutando una Red Codex Local con Soporte de Marketplace

Este tutorial te enseñará cómo ejecutar una pequeña red Codex con el
_storage marketplace_ habilitado; es decir, la funcionalidad en Codex que
permite a los participantes ofrecer y comprar almacenamiento en un mercado, asegurando que
los proveedores de almacenamiento cumplan con su parte del acuerdo mediante pruebas criptográficas.

En este tutorial, aprenderás a:

1. [En este tutorial, aprenderás a:](#_1-set-up-a-geth-poa-network);
2. [Configurar El Marketplace](#_2-set-up-the-marketplace);
3. [Ejecutar Codex](#_3-run-codex);
4. [Comprar y Vender Almacenamiento en el Marketplace](#_4-buy-and-sell-storage-on-the-marketplace).

## Prerrequisitos

Para completar este tutorial, necesitarás:

* el cliente Ethereum [geth](https://github.com/ethereum/go-ethereum);
  Necesitas la versión `1.13.x` de geth ya que las versiones más nuevas ya no son compatibles con la Prueba de Autoridad (PoA). Este tutorial se probó utilizando la versión `1.13.15` de geth.
* un binario Codex, que, [puedes compilar desde el código fuente](https://github.com/codex-storage/nim-codex?tab=readme-ov-file#build-and-run).

También estaremos usando la sintaxis de [bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell))
en todo el documento. Si utilizas una shell diferente, es posible que debas adaptar
algunas cosas a tu plataforma.

Para comenzar, crea una nueva carpeta donde guardaremos los archivos relacionados con el tutorial
para que podamos mantenerlos separados del repositorio Codex.
Asumimos que el nombre de la carpeta es `marketplace-tutorial`.

## 1. Configurar una Red Geth PoA

Para este tutorial, utilizaremos una simple red
[Prueba de Autoridad](https://github.com/ethereum/EIPs/issues/225) con geth. El primer paso es crear una cuenta de firmante: una cuenta que
será utilizada por geth para firmar los bloques en la red.
Cualquier bloque firmado por un firmante se acepta como válido.
### 1.1. Crear una Cuenta de Firmante

Para crear una cuenta de firmante, desde el directorio `marketplace-tutorial` ejecuta:

```bash
geth account new --datadir geth-data
```

El generador de cuentas te pedirá que ingreses una contraseña, que puedes
dejar en blanco. Luego imprimirá cierta información,
incluida la dirección pública de la cuenta:

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

En este ejemplo, la dirección pública de la cuenta de firmante es
`0x33A904Ad57D0E2CB8ffe347D3C0E83C2e875E7dB`.
Tu consola imprimirá una dirección diferente. Guárdala para usarla más adelante.

A continuación, configura una variable de entorno para usarla más adelante:

```bash
export GETH_SIGNER_ADDR="0x0000000000000000000000000000000000000000"
echo ${GETH_SIGNER_ADDR} > geth_signer_address.txt
```

> Aquí, asegúrate de reemplazar `0x0000000000000000000000000000000000000000`
> con tu dirección pública de la cuenta de firmante
> (`0x33A904Ad57D0E2CB8ffe347D3C0E83C2e875E7dB` en nuestro ejemplo).

### 1.2. Configurar la Red y Crear el Bloque Génesis

El siguiente paso es decirle a geth qué tipo de red quieres ejecutar.
Estaremos ejecutando una red [pre-merge](https://ethereum.org/en/roadmap/merge/)
con consenso de Prueba de Autoridad.
Para que eso funcione, crea un archivo  `network.json` .

Si configuraste la variable `GETH_SIGNER_ADDR` anteriormente, puedes ejecutar el siguiente
comando para crear el archivo `network.json` .

```bash
echo  "{\"config\": { \"chainId\": 12345, \"homesteadBlock\": 0, \"eip150Block\": 0, \"eip155Block\": 0, \"eip158Block\": 0, \"byzantiumBlock\": 0, \"constantinopleBlock\": 0, \"petersburgBlock\": 0, \"istanbulBlock\": 0, \"berlinBlock\": 0, \"londonBlock\": 0, \"arrowGlacierBlock\": 0, \"grayGlacierBlock\": 0, \"clique\": { \"period\": 1, \"epoch\": 30000 } }, \"difficulty\": \"1\", \"gasLimit\": \"8000000\", \"extradata\": \"0x0000000000000000000000000000000000000000000000000000000000000000${GETH_SIGNER_ADDR:2}0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000\", \"alloc\": { \"${GETH_SIGNER_ADDR}\": { \"balance\": \"10000000000000000000000\"}}}" > network.json
```

También puedes crear el archivo manualmente recordando actualizarlo con tu
dirección pública de firmante:

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

Ten en cuenta que la dirección de la cuenta de firmante está incrustada en dos lugares diferentes:
* dentro de la cadena `"extradata"` , rodeada de ceros y sin su prefijo `0x` ;
* como una clave de entrada en la sesión `alloc` .
  Asegúrate de reemplazar esa ID con la ID de cuenta que anotaste en
  [Paso 1.1](#_1-1-create-a-signer-account).

Una vez que se crea `network.json` , puedes inicializar la red con:

```bash
geth init --datadir geth-data network.json
```

El resultado del comando anterior puede incluir algunas advertencias, como:

```bash
WARN [08-21|14:48:12.305] Unknown config environment variable      envvar=GETH_SIGNER_ADDR
```

o incluso errores al ejecutar el comando por primera vez:

```bash
ERROR[08-21|14:48:12.399] Head block is not reachable
```

Lo importante es que al final debes ver algo similar a:

```bash
INFO [08-21|14:48:12.639] Successfully wrote genesis state         database=lightchaindata hash=768bf1..42d06a
```

### 1.3. Iniciar tu Nodo PoA

Ahora estamos listos para iniciar nuestra blockchain privada de $1$ nodo.
Para lanzar el nodo firmante, abre una terminal separada en el mismo directorio de trabajo
y asegúrate de tener `GETH_SIGNER_ADDR` configurado.
Para mayor comodidad, utiliza el  `geth_signer_address.txt`:

```bash
export GETH_SIGNER_ADDR=$(cat geth_signer_address.txt)
```

Teniendo la variable `GETH_SIGNER_ADDR` configurada, ejecuta:

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

Ten en cuenta que, una vez más, la cuenta de firmante creada en
[Paso 1.1](#_1-1-create-a-signer-account) aparece tanto en
`--unlock` como en `--allow-insecure-unlock`.

Geth te pedirá que insertes la contraseña de la cuenta a medida que se inicia.
Una vez que lo hagas, debería poder iniciarse y comenzar a "minar" bloques.

También aquí, puedes encontrar errores como:

```bash
ERROR[08-21|15:00:27.625] Bootstrap node filtered by netrestrict   id=c845e51a5e470e44 ip=18.138.108.67
ERROR[08-21|15:00:27.625] Bootstrap node filtered by netrestrict   id=f23ac6da7c02f84a ip=3.209.45.79
ERROR[08-21|15:00:27.625] Bootstrap node filtered by netrestrict   id=ef2d7ab886910dc8 ip=65.108.70.101
ERROR[08-21|15:00:27.625] Bootstrap node filtered by netrestrict   id=6b36f791352f15eb ip=157.90.35.166
```

Puedes ignorarlos con seguridad.

Si el comando anterior falla con:

```bash
Fatal: Failed to register the Ethereum service: only PoS networks are supported, please transition old ones with Geth v1.13.x
```

asegúrate de estar ejecutando la versión correcta de Geth
(consulta la Secció [Prerrequisitos](#prerequisites))

## 2. Configurar El Marketplace

Necesitarás abrir una nueva terminal para esta sección y geth debe estar
ejecutándose ya. La configuración del marketplace de Codex implica:

1. Implementar los Contratos del Marketplace de Codex en nuestra blockchain privada
2. Configurar cuentas de Ethereum que utilizaremos para comprar y vender almacenamiento en el marketplace de Codex
3. Aprovisionar esas cuentas con los saldos de tokens requeridos
   
2.1. Implementar los Contratos del Marketplace de Codex
Asegúrate de salir del directorio `marketplace-tutorial` y clonar
el `codex-storage/nim-codex.git`:

```bash
git clone https://github.com/codex-storage/nim-codex.git
```

> Si solo quieres clonar el repositorio para ejecutar el tutorial, puedes
omitir el historial y simplemente descargar el head de la rama principal utilizando
el
> `--depth 1` option: `git clone --depth 1 https://github.com/codex-storage/nim-codex.git`

Por lo tanto, nuestra estructura de directorios para el propósito de este tutorial se ve así:

```bash
|
|-- nim-codex
└-- marketplace-tutorial
```

> Podrías clonar el `codex-storage/nim-codex.git`  a alguna otra ubicación.
> olo para mantener las cosas bien separadas, lo mejor es asegurarse de que
> `nim-codex` o esté bajo el directorio `marketplace-tutorial` .

Ahora, desde la carpeta `nim-codex` ejecuta:

```bash
make update && make
```

> Esto puede tomar un momento ya que también construirá el compilador `nim` Ten paciencia.

Ahora, para iniciar una red Ethereum local ejecuta:

```bash
cd vendor/codex-contracts-eth
npm install
```

> Mientras escribíamos el documento, utilizamos la version `v20.17.0` de `node` y
> la version `10.8.2` de `npm` .

Antes de continuar, ahora debes **esperar hasta que se minen $256$ bloques**
**en tu red PoA**, o la implementación fallará. Esto debería tomar alrededor de
$4$ minutos y $30$ segundos. Puedes verificar en qué altura de bloque te encuentras
actualmente ejecutando el siguiente comando
**desde la carpeta `marketplace-tutorial` **:

```bash
geth attach --exec web3.eth.blockNumber ./geth-data/geth.ipc
```

una vez que pase de $256$, estarás listo para continuar.

Para implementar contratos, desde el directorio `codex-contracts-eth` ejecuta:

```bash
export DISTTEST_NETWORK_URL=http://localhost:8545
npx hardhat --network codexdisttestnetwork deploy
```

Si el comando se completa correctamente, verás un resultado similar
a este:

```bash
Deployed Marketplace with Groth16 Verifier at:
0xCf0df6C52B02201F78E8490B6D6fFf5A82fC7BCd
```
> of course your address will be different.

You are now ready to prepare the accounts.

### 2.2. Generar las Cuentas Requeridas

Ejecutaremos $2$ nodos Codex: un **proveedor de almacenamiento**,que venderá almacenamiento
en la red, y un  **cliente**, que comprará y usará dicho almacenamiento;
por lo tanto, necesitamos dos cuentas de Ethereum válidas. Podríamos crear cuentas aleatorias
utilizando una de las muchas herramientas disponibles para tal fin pero, dado que
este es un tutorial que se ejecuta en una red privada local, simplemente
te proporcionaremos dos cuentas pre-hechas junto con sus claves privadas,
que puedes copiar y pegar en su lugar:

Primero, asegúrate de estar de vuelta en la carpeta `marketplace-tutorial` folder y
no en la subcarpeta `codex-contracts-eth` . Luego, configura estas variables:

**Almacenamiento:**
```bash
export ETH_STORAGE_ADDR=0x45BC5ca0fbdD9F920Edd12B90908448C30F32a37
export ETH_STORAGE_PK=0x06c7ac11d4ee1d0ccb53811b71802fa92d40a5a174afad9f2cb44f93498322c3
echo $ETH_STORAGE_PK > storage.pkey && chmod 0600 storage.pkey
```

**Cliente:**
```bash
export ETH_CLIENT_ADDR=0x9F0C62Fe60b22301751d6cDe1175526b9280b965
export ETH_CLIENT_PK=0x5538ec03c956cb9d0bee02a25b600b0225f1347da4071d0fd70c521fdc63c2fc
echo $ETH_CLIENT_PK > client.pkey && chmod 0600 client.pkey
```

### 2.3. Aprovisionar Cuentas con Tokens

Ahora necesitamos transferir algo de ETH a cada una de las cuentas, así como proporcionarles
algunos tokens Codex para que el nodo de almacenamiento los use como colateral y
para que el nodo cliente compre almacenamiento real.

Aunque el proceso no es particularmente complicado, te sugiero que uses
[el script que preparamos](https://github.com/gmega/local-codex-bare/blob/main/scripts/mint-tokens.js)
para eso. Este script, esencialmente:

1. Lee la dirección del contrato del Marketplace y su ABI de los datos de implementación;
2. Transfiere $1$ ETH de la cuenta del firmante a una cuenta de destino si la cuenta de destino no tiene saldo de ETH;
3. Acuña $n$ tokens Codex y los agrega al saldo de la cuenta de destino.

Para usar el script, simplemente descárgalo en un archivo local llamado `mint-tokens.js`,
por ejemplo, usando `curl` (asegúrate de estar en
el directorio `marketplace-tutorial` ):

```bash
# descargar script
curl https://raw.githubusercontent.com/gmega/codex-local-bare/main/scripts/mint-tokens.js -o mint-tokens.js
```

Luego ejecuta:

```bash
# establecer la ubicación del archivo de contrato (asumimos que estás en el directorio marketplace-tutorial)
export CONTRACT_DEPLOY_FULL="../nim-codex/vendor/codex-contracts-eth/deployments/codexdisttestnetwork"
export GETH_SIGNER_ADDR=$(cat geth_signer_address.txt)
# Instala Web3-js
npm install web3
# Proporciona tokens a la cuenta de almacenamiento.
node ./mint-tokens.js $CONTRACT_DEPLOY_FULL/TestToken.json $GETH_SIGNER_ADDR 0x45BC5ca0fbdD9F920Edd12B90908448C30F32a37 10000000000
# Proporciona tokens a la cuenta del cliente.
node ./mint-tokens.js $CONTRACT_DEPLOY_FULL/TestToken.json $GETH_SIGNER_ADDR 0x9F0C62Fe60b22301751d6cDe1175526b9280b965 10000000000
```

Si te sale un mensaje como

```bash
Usage: mint-tokens.js <token-hardhat-deploy-json> <signer-account> <receiver-account> <token-ammount>
```

entonces necesitas asegurarte que proveiste todos los argumentos requeridos.
En particular necesitas asegurar, que la variable de entorno `GETH_SIGNER_ADDR` contenga la dirección del firmante (usamos
`export GETH_SIGNER_ADDR=$(cat geth_signer_address.txt)`  arriba, para
asegurar que este establecida)

## 3. Ejecutar Codex

Con las cuentas y geth configurados, ahora podemos iniciar los nodos Codex.

### 3.1.Storage Node

El nodo de almacenamiento será el que almacene los datos y envíe las pruebas de
almacenamiento a la cadena. Para hacer eso necesita access a:

1. La dirección de contrata del Marketplace que fue "deployed" a el nodo geth local en [Paso 2.1](#_2-1-deploy-the-codex-marketplace-contracts);
2. A los "sample ceremony files" los cuales estan dentro de Codex contracts repo
  (`nim-codex/vendor/codex-contracts-eth`).

**Dirección del Contrato Marketplace.** La dirección del contracto se puede encontrar
dentro el archivo `nim-codex/vendor/codex-contracts-eth/deployments/codexdisttestnetwork/Marketplace.json`.
Capturamos esta ubicación en la variable  `CONTRACT_DEPLOY_FULL` arriba, por lo tanto, desde la carpeta `marketplace-tutorial` ejecuta:

```bash
grep '"address":' ${CONTRACT_DEPLOY_FULL}/Marketplace.json
```

esto imprimirá algo como:
```bash
"address": "0xCf0df6C52B02201F78E8490B6D6fFf5A82fC7BCd",
```

> Esta dirección debería de coincidir con la que obtuvimos antes cuando "deployeamos"
> el contracto Marketplace arriba.

Después ejecuta lo siguiente con la dirección correcta del mercado:
```bash
export MARKETPLACE_ADDRESS="0x0000000000000000000000000000000000000000"
echo ${MARKETPLACE_ADDRESS} > marketplace_address.txt
```

donde reemplazariamos `0x0000000000000000000000000000000000000000` con
el contrato Marketplace de arriba en
[Paso 2.1](#_2-1-deploy-the-codex-marketplace-contracts).

**Archivos de ceremonia del "prover".** The "ceremony files" están bajo el
subdirectorio
`nim-codex/vendor/codex-contracts-eth/verifier/networks/codexdisttestnetwork`
 Son tres:  `proof_main.r1cs`, `proof_main.zkey`,
y `prooof_main.wasm`. Los necesitaremos todos para iniciar el nodo de almacenamiento Codex.

**Iniciando el nodo de almacenamiento.** Sea:

* `PROVER_ASSETS` conteniendo la dirección donde los archivos de ceremonia del "prover" están ubicados. **Esta debe de ser una ruta absoluta**;
* `CODEX_BINARY` conteniendo la ubicación de tu binario Codex;
* `MARKETPLACE_ADDRESS` conteniendo la dirección de el contrato Marketplace (ya hemos configurado esto arriba).

Configura estas rutas en variables de entorno (asegúrate que esta en
el directorio `marketplace-tutorial` ):

```bash
export CONTRACT_DEPLOY_FULL=$(realpath "../nim-codex/vendor/codex-contracts-eth/deployments/codexdisttestnetwork")
export PROVER_ASSETS=$(realpath "../nim-codex/vendor/codex-contracts-eth/verifier/networks/codexdisttestnetwork/")
export CODEX_BINARY=$(realpath "../nim-codex/build/codex")
export MARKETPLACE_ADDRESS=$(cat marketplace_address.txt)
```
> puedes notar, que ya establecimos la variable `CONTRACT_DEPLOY_FULL` variable
> arriba. Ahora, nos aseguramos que es una dirección absoluta

Para lanzar el nodo de almacenamiento , ejecuta :

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

**Iniciando el nodo cliente.**

El nodo client se inicializa similar, excepto que:

necesitamos pasar la SPR del nodo de almacenamiento, par que pueda formar uan red con el;
desde que no ejecuta ningún "proofs", no requiere archivos de "ceremonia".
Obtenemos el  "Signed Peer Record (SPR)" del nodo de almacenamiento, para poder "bootstrap"
el nodo cliente con el.  Para obtener la SPR, ejecuta la llamada siguiente:

```bash
curl -H 'Accept: text/plain' 'http://localhost:8000/api/codex/v1/spr' --write-out '\n'
```

Deberías recibir el SPR de vuelta, empezando con `spr:`.

Antes de proceder, abre una nueva terminal, y entra en en directorio `marketplace-tutorial` .

Lo siguiente es establecer estas rutas en variables de entorno:

```bash
# establece el SPR para el nodo de almacenamiento
export STORAGE_NODE_SPR=$(curl -H 'Accept: text/plain' 'http://localhost:8000/api/codex/v1/spr')
# variables basicas
export CONTRACT_DEPLOY_FULL=$(realpath "../nim-codex/vendor/codex-contracts-eth/deployments/codexdisttestnetwork")
export CODEX_BINARY=$(realpath "../nim-codex/build/codex")
export MARKETPLACE_ADDRESS=$(cat marketplace_address.txt)
```
y después ejecuta:

```bash
${CODEX_BINARY}\
  --data-dir=./codex-client\
  --listen-addrs=/ip4/0.0.0.0/tcp/8081\
  --api-port=8001\
  --disc-port=8091\
  --bootstrap-node=${STORAGE_NODE_SPR}\
  persistence\
  --eth-provider=http://localhost:8545\
  --eth-private-key=./client.pkey\
  --marketplace-address=${MARKETPLACE_ADDRESS}
```

## 4. Comprar y Vender Almacenamiento en el Marketplace

Cualquier negociación de almacenamiento tiene dos lados:: un comprador y un vendedor.
Por lo tanto, antes de que podamos realmente solicitar almacenamiento, primero debemos ofrecer
algo de el a la venta.

### 4.1 Vender Almacenamiento

LA siguiente solicitud hara, que el nodo de almacenamiento ponga a la venta  $50\text{MB}$
de almacenamiento por  $1$ hora , a un precio de $1$ token Codex
por "slot" por segundo, al tiempo que expresa que está dispuesto a asumir como máximo
una penalización de  $1000$ tokens Codex, por no cumplir con su parte del contrato.[^1]

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

Esto debería devolver una respuesta  JSON conteniendo un `id` (p.ej. `"id": "0xb55b3bc7aac2563d5bf08ce8a177a38b5a40254bfa7ee8f9c52debbb176d44b0"`)
que identifica la oferta de almacenamiento.

> Para que las respuestas JSON sean más legibles, puedes intentar
> [jq](https://jqlang.github.io/jq/) la utilidad de formato JSON,
> simplemente agregando `| jq` después del comando.
> En macOS puedes instalarlo con `brew install jq`.

Para revisar las ofertas de almacenamiento actuales para ste nodo, puedes ejecutar:

```bash
curl 'http://localhost:8000/api/codex/v1/sales/availability'
```

o con `jq`:

```bash
curl 'http://localhost:8000/api/codex/v1/sales/availability' | jq
```

Esto debería de imprimir una lista de ofertas, con la que acabas de crear figurando
entre ellas (para nuestro tutorial, solo se devolverá una oferta
en este momento).

### 4.2. Comprar Almacenamiento

Antes de que podamos comprar almacenamiento, necesitamos mas data para solicitar
almacenamiento.  Empieza subiendo un archivo pequeño a tu nodo cliente.
En Linux (o macOS) podrías, por ejemplo, usar `dd` para generar un archivo $1M$:

```bash
dd if=/dev/urandom of=./data.bin bs=1M count=1
```

Asumiendo que tu archivo se llama `data.bin`, puedes subirlo con:

```bash
curl --request POST http://localhost:8001/api/codex/v1/data --header 'Content-Type: application/octet-stream' --write-out '\n' -T ./data.bin
```

Una vez que se complete la carga, deberías ver un _Content Identifier_,
o _CID_ (p.ej. `zDvZRwzm2mK7tvDzKScRLapqGdgNTLyyEBvx1TQY37J2CdWdS6Sj`)
para el archivo cargado impreso en la terminal.
Usa ese CID en la solicitud de compra:

```bash
# asegúrate de reemplazar el  CID anterior con el CID que obtuviste en el paso anterior
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

Los parámetros en `--data` dicen:

1. queremos comprar almacenamiento para nuestro archivo durante $5$ minutos (`"duration": "600"`);
2. estamos dispuestos pagar a hasta $1$ token por slot por segundo (`"reward": "1"`)
3. nuestro archivo se dividirá en tres pedazos (`"nodes": 3`). 
   Porque establecimos `"tolerance": 1` solo necesitamos dos (`nodes - tolerance`)
   pedazos para reconstruir el archivo; i.e., podemos tolerar que a lo mucho 1 nodo deje de almacenar nuestros datos; ya sea debido a falla u otras razones;
4. exigimos `1000` tokens en garantía de los proveedores de almacensmiento por slot. Desde que hay $3$ slots de estos, habrá `3000` en garantía total
   comprometido por los proveedores de almacenamiento una vez que se inicie nuestra solicitud.
5. finalmente, el `expiry` pone un límite de tiempo para llenar todos los "slots" por los proveedores de almacenamiento. Si los slots no se llenan antes del intervalo `expire` interval,
la solicitud expirará, y fallara.

### 4.3. Rastrear Tus Solicitudes de Almacenamiento

"POSTeando" una solicitud de almacenamiento la pondrá a disposicion en el mercado de almacenamiento,
y un nodo de almacenamiento eventualmente la recogerá.

Puedes mandar a llamar el estado de tu solicitud por medios de::
```bash
export STORAGE_PURCHASE_ID="1d0ec5261e3364f8b9d1cf70324d70af21a9b5dccba380b24eb68b4762249185"
curl "http://localhost:8001/api/codex/v1/storage/purchases/${STORAGE_PURCHASE_ID}"
```

Por ejemplo:

```bash
> curl 'http://localhost:8001/api/codex/v1/storage/purchases/6c698cd0ad71c41982f83097d6fa75beb582924e08a658357a1cd4d7a2a6766d'
```

Esto devuelve un resultado como:

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

Muestra que a una solicitud se le ha dado  "submitted" pero aun no ha sido completada.
Tu solicitud tendrá éxito una vez que `"state"` muestre `"started"`.
Cualquier otra cosa fuera de eso significa que una solicitud no ha sido completamente
procesada aun, y un estado `"error"` a parte de `null` significa que ha fallado.

Bueno, este ha sido un camino largo verdad?  Puedes felicitarte a ti mismo por
haber terminado exitosamenet el tutorial de Codex marketplace !

[^1]: Los archivos Codex se han dividido en pedazos llamados "slots" y distribuidos
a varios proveedores de almacenamiento. "The colateral  refiers to one such slot"
y lo consumiran lentamente a medida que el proveedor de almacenamiento falle en el
entrega oportuna de "proofs" , pero la lógica actual es [más compleja que eso](https://github.com/codex-storage/codex-contracts-eth/blob/6c9f797f408608958714024b9055fcc330e3842f/contracts/Marketplace.sol#L209).
