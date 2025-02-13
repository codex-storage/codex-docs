# Prueba de Dos Clientes Codex

La prueba de dos clientes es una prueba manual que puede realizar para verificar su configuración y familiarizarse con la API de Codex. Estos pasos le guiarán a través de la ejecución y conexión de dos nodos, con el fin de cargar un archivo a uno y luego descargarlo desde el otro. Esta prueba también incluye la ejecución de un nodo blockchain local para tener disponible la funcionalidad del Marketplace. Sin embargo, la ejecución de un nodo blockchain local no es estrictamente necesaria, y puede omitir los pasos marcados como opcionales si decide no iniciar un nodo blockchain local.

## Requisitos Previos

Asegúrese de haber [ compilado el cliente](/learn/build) o haber obtenido el [ binario compilado](/learn/quick-start#get-codex-binary).

## Steps

### 0. Configuración del nodo blockchain (opcional)

Necesita tener instalado NodeJS y npm para poder levantar un nodo blockchain local.

Diríjase al directorio `vendor/codex-contracts-eth`  y ejecute estos dos comandos:
```
npm ci
npm start
```

Esto iniciará una blockchain Ganache local.

### 1. Inicio del Nodo #1
Abra una terminal y ejecute:
- Mac/Linux:
  ```shell
   codex \
     --data-dir="$(pwd)/Data1" \
     --api-port=8080 \
     --disc-port=8090 \
     --listen-addrs="/ip4/127.0.0.1/tcp/8070"
   ```
- Windows:
  ```batch
  codex.exe ^
    --data-dir="Data1" ^
    --api-port=8080 ^
    --disc-port=8090 ^
    --listen-addrs="/ip4/127.0.0.1/tcp/8070"
  ```

Opcionalmente, si desea utilizar la funcionalidad de Marketplace blockchain, también debe incluir las siguientes flags: `--persistence --eth-account=<account>`, donde `account` puede ser una de las siguientes:

  - `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
  - `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
  - `0x90F79bf6EB2c4f870365E785982E1f101E93b906`
  - `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`

**¡Para cada nodo use una cuenta diferente!**

| Argumento      | Descripción                                                       |
|----------------|-----------------------------------------------------------------------|
| `data-dir`     | Especifica la ruta relativa donde el nodo almacenará sus datos.        |
| `listen-addrs` | Multiaddress donde el nodo aceptará conexiones de otros nodos. |
| `api-port`     | Puerto en localhost donde el nodo expondrá su API.                |
| `disc-port`    | Puerto que el nodo utilizará para su servicio de descubrimiento.                     |
| `persistence`  | Habilita la funcionalidad de Marketplace. Requiere una conexión a la blockchain.  |
| `eth-account`  | Define qué cuenta de blockchain debe usar el nodo. Esta cuenta debe tener fondos (ETH) para pagar las transacciones.                 |

Codex utiliza valores predeterminados sensatos para la mayoría de sus argumentos. Aquí especificamos algunos explícitamente para el propósito de esta guía.

### 2. Señal de vida

Ejecute el comando :

```bash
curl -X GET http://127.0.0.1:8080/api/codex/v1/debug/info
```

Esta solicitud GET devolverá la información de depuración del nodo. La respuesta estará en formato JSON y debería verse así:

```json
{
  "id": "16Uiu2HAmJ3TSfPnrJNedHy2DMsjTqwBiVAQQqPo579DuMgGxmG99",
  "addrs": [
    "/ip4/127.0.0.1/tcp/8070"
  ],
  "repo": "/Users/user/projects/nim-codex/Data1",
  "spr": "spr:CiUIAhIhA1AL2J7EWfg7x77iOrR9YYBisY6CDtU2nEhuwDaQyjpkEgIDARo8CicAJQgCEiEDUAvYnsRZ-DvHvuI6tH1hgGKxjoIO1TacSG7ANpDKOmQQ2MWasAYaCwoJBH8AAAGRAh-aKkYwRAIgB2ooPfAyzWEJDe8hD2OXKOBnyTOPakc4GzqKqjM2OGoCICraQLPWf0oSEuvmSroFebVQx-3SDtMqDoIyWhjq1XFF",
  "announceAddresses": [
    "/ip4/127.0.0.1/tcp/8070"
  ],
  "table": {
    "localNode": {
      "nodeId": "f6e6d48fa7cd171688249a57de0c1aba15e88308c07538c91e1310c9f48c860a",
      "peerId": "16Uiu2HAmJ3TSfPnrJNedHy2DMsjTqwBiVAQQqPo579DuMgGxmG99",
      "record": "...",
      "address": "0.0.0.0:8090",
      "seen": false
    },
    "nodes": []
  },
  "codex": {
    "version": "untagged build",
    "revision": "b3e626a5"
  }
}
```

| Campo            | Descripción                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `id`                | ID del nodo. También conocido como 'peerId'.                                        |
| `addrs`             | Multiaddresses actualmente abiertos para aceptar conexiones de otros nodos.                   |
| `repo`              | Ruta de la carpeta de datos de este nodo.                                                         |
| `spr`               | Signed Peer Record, información codificada sobre este nodo y su ubicación en la red. Este registro está firmado criptográficamente. |
| `announceAddresses` | Multiaddresses utilizados para anunciar este nodo.                                             |
| `table`             | Tabla de nodos presentes en la DHT del nodo.                                                 |
| `codex`             | Información sobre la versión de Codex.                                                                |

### 3. Inicio del Nodo #2

Necesitaremos el Signed Peer Record (SPR) del primer nodo que obtuvo en el paso anterior.

Reemplace `<SPR HERE>` en el siguiente comando con el SPR devuelto por el comando anterior, tenga en cuenta que debe incluir el `spr:` al principio.

Abra una nueva terminal y ejecute:
- Mac/Linux:
  ```shell
  codex \
    --data-dir="$(pwd)/Data2" \
    --api-port=8081 \
    --disc-port=8091 \
    --listen-addrs=/ip4/127.0.0.1/tcp/8071 \
    --bootstrap-node=<SPR HERE>
  ```
- Windows:
  ```
  codex.exe ^
    --data-dir="Data2" ^
    --api-port=8081 ^
    --disc-port=8091 ^
    --listen-addrs=/ip4/127.0.0.1/tcp/8071 ^
    --bootstrap-node=<SPR HERE>
  ```

Alternativamente en Mac, Linux, o MSYS2 y un binario Codex reciente se puede ejecutar en un solo comando como:

```shell
codex \
  --data-dir="$(pwd)/Data2" \
  --api-port=8081 \
  --disc-port=8091 \
  --listen-addrs=/ip4/127.0.0.1/tcp/8071 \
  --bootstrap-node=$(curl -H "Accept: text/plain" http://127.0.0.1:8080/api/codex/v1/spr)
```

Observe que estamos utilizando un nuevo data-dir, y hemos incrementado cada número de puerto en uno. Esto es necesario para que el nuevo nodo no intente abrir puertos ya en uso por el primer nodo.

Ahora también estamos incluyendo el argumento `bootstrap-node` Esto nos permite enlazar el nuevo nodo a otro, iniciando nuestra propia pequeña red peer-to-peer (P2P). Las cadenas SPR siempre comienzan con `spr:`.

### 4. Conectando los Dos Nodos

Normalmente, los dos nodos se conectarán automáticamente.  Si no se conectan automáticamente o desea conectar los nodos manualmente, puede utilizar el peerId para conectar los nodos.

Puede obtener el peer id del primer nodo ejecutando el siguiente comando y encontrando el  `"peerId"`  en los resultados:

```shell
curl -X GET \
  -H "Accept: text/plain" \
  http://127.0.0.1:8081/api/codex/v1/peerid
```

A continuación, reemplace `<PEER ID HERE>` en el siguiente comando con el peerId devuelto por el comando anterior:

```shell
curl -X GET \
  http://127.0.0.1:8080/api/codex/v1/connect/<PEER ID HERE>?addrs=/ip4/127.0.0.1/tcp/8071
```

Alternativamente en Mac, Linux, o MSYS2 y un binario Codex reciente se puede ejecutar en un solo comando como:

```shell
curl -X GET \
  http://127.0.0.1:8080/api/codex/v1/connect/$(curl -X GET -H "Accept: text/plain" http://127.0.0.1:8081/api/codex/v1/peerid)\?addrs=/ip4/127.0.0.1/tcp/8071
```

Observe que estamos enviando el "`peerId`" y la multiaddress del nodo 2 al endpoint `/connect` del nodo 1.  Esto proporciona al nodo 1 toda la información que necesita para comunicarse con el nodo 2. La respuesta a esta solicitud debería ser `Successfully connected to peer`.

### 5. Subir un Archivo

Ahora estamos listos para subir un archivo a la red. En este ejemplo, utilizaremos el nodo 1 para la carga y el nodo 2 para la descarga. Pero también funciona al revés.

A continuación, reemplace `<FILE PATH>` con la ruta al archivo que desea cargar en el siguiente comando:

```shell
curl -X POST \
  127.0.0.1:8080/api/codex/v1/data \
  -H "Content-Type: application/octet-stream" \
  -H "Expect: 100-continue" \
  -T "<FILE PATH>"
```
> [¡CONSEJO!]
> Si curl se resiste a mostrarle la respuesta, agregue  `-o <FILENAME>` para escribir el resultado en un archivo.

Dependiendo del tamaño del archivo, esto puede tomar un momento. Codex está procesando el archivo dividiéndolo en bloques y generando datos de recuperación de borrado. Cuando el proceso finalice, la solicitud devolverá el Content Identifier (CID) del archivo cargado. Debería verse algo como  `zdj7WVxH8HHHenKtid8Vkgv5Z5eSUbCxxr8xguTUBMCBD8F2S`.

### 6. Descarga del Archivo

Reemplace `<CID>` con el identificador devuelto en el paso anterior. Reemplace  `<OUTPUT FILE>` con el nombre del archivo donde desea almacenar el archivo descargado:

```bash
curl -X GET \
  127.0.0.1:8081/api/codex/v1/data/<CID>/network \
  -o <OUTPUT FILE>
```

Observe que nos estamos conectando al segundo nodo para descargar el archivo. El CID que proporcionamos contiene la información necesaria para localizar el archivo dentro de la red.

### 7. Verificar los Resultados

Si su archivo se descarga y es idéntico al archivo que cargó, entonces esta prueba manual ha pasado. ¡Regocíjese! Si, por otro lado, eso no sucedió o no pudo completar ninguno de estos pasos, déjenos un mensaje detallando sus problemas.

## Notas

Cuando se utiliza la blockchain Ganache, existen algunas desviaciones del comportamiento esperado, principalmente vinculadas a la forma en que se minan los bloques, lo que afecta a ciertas funcionalidades del módulo de Ventas.
Por lo tanto, si está probando manualmente procesos como el cobro de pagos después de que se completa una solicitud o el envío de pruebas, debe minar algunos bloques manualmente para que funcione correctamente. Puede hacerlo utilizando el siguiente comando curl:

```shell
curl -X POST \
  127.0.0.1:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"evm_mine","params":[],"id":67}'
```
