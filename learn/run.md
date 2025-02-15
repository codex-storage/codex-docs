---
outline: [2, 4]
---
# Ejecutar Codex

Por ahora, Codex está implementado solo en [Nim](https://nim-lang.org) y se puede encontrar en el repositorio [nim-codex](https://github.com/codex-storage/nim-codex) .

Es una aplicación de línea de comandos que se puede ejecutar de diferentes maneras:
 - [Usando un binario](#using-binary)
 - [Ejecutar con Daemon en Linux](#run-as-a-daemon-in-linux) (not supported yet)
 - [Ejecutar como un servicio en Windows](#run-as-a-service-in-windows) (not supported yet)
 - [Usando Docker](#using-docker)
 - [Usando Docker Compose](#using-docker-compose)
 - [En Kubernetes](#on-kubernetes)

Durante la ejecución, es necesario pasar una opción de [configuración](#configuration) a la aplicación, lo cual se puede hacer de diferentes maneras.

## Configuración

Es posible configurar un nodo Codex de varias maneras:
 1. [Opciones de la CLI](#cli-options)
 2. [Opciones de la CLI](#environment-variables)
 3. [Opciones de la CLI](#configuration-file)

El orden de prioridad es el mismo que el anterior:
[Opciones de la CLI](#cli-options) --> [Variables de entorno](#environment-variables) --> [Archivo de configuración](#configuration-file).

### Información Común

#### Unidades

Para algunas opciones de configuración, podemos pasar valores en unidades comunes, como las siguientes:
```shell
--cache-size=1m/1M/1mb/1MB
--storage-quota=2m/2M/2mb/2MB

--block-mi=1s/1S/1m/1M/1h/1H/1d/1D/1w/1W
--block-ttl=2s/2S/2m/2M/2h/2H/2d/2D/2w/2W
```

#### Registro (Logging)

Codex utiliza la biblioteca de registro [Chronicles](https://github.com/status-im/nim-chronicles) que permite una gran flexibilidad al trabajar con registros. Chronicles tiene el concepto de temas, que categorizan las entradas de registro en grupos semánticos.

Usando el parámetro `log-level` , se puede establecer el nivel de registro de nivel superior, como `--log-level="trace"`, , pero, lo que es más importante,  se pueden establecer niveles de registro para temas específicos como `--log-level="info; trace: marketplace,node; error: blockexchange"`,
que establece el nivel de registro de nivel superior en `info`  y luego para los temas `marketplace` y `node` establece el nivel en `trace` y así sucesivamente.

### Opciones de la CLI

```shell
codex --help

Uso:

codex [OPCIONES]... comando

Las siguientes opciones están disponibles:

     --config-file          Carga la configuración desde un archivo TOML [=none].
     --log-level            Establece el nivel de registro [=info].
     --metrics              Habilita el servidor de métricas [=false].
     --metrics-address      Dirección de escucha del servidor de métricas [=127.0.0.1].
     --metrics-port         Puerto HTTP de escucha del servidor de métricas [=8008].
 -d, --data-dir             El directorio donde Codex almacenará la configuración y los datos
                            [=/root/.cache/codex].
 -i, --listen-addrs         Multi Addresses para escuchar [=/ip4/0.0.0.0/tcp/0].
 -a, --nat                  Direcciones IP para anunciar detrás de un NAT [=127.0.0.1].
 -e, --disc-ip              Dirección de escucha de descubrimiento [=0.0.0.0].
 -u, --disc-port            Puerto de descubrimiento (UDP) [=8090].
     --net-privkey          Fuente de la ruta o nombre del archivo de la clave privada (secp256k1) de la red [=key].
 -b, --bootstrap-node       Especifica uno o más nodos de arranque para usar al conectarse a la red.
     --max-peers            El número máximo de pares a los que conectarse [=160].
     --agent-string         Cadena de agente del nodo que se utiliza como identificador en la red [=Codex].
     --api-bindaddr         La dirección de enlace de la API REST [=127.0.0.1].
 -p, --api-port             El puerto de la API REST [=8080].
     --api-cors-origin      El origen permitido de CORS de la API REST para descargar datos. '*' permitirá todos
                            los orígenes, '' no permitirá ninguno. [=No permitir ninguna solicitud de origen cruzado para descargar
                            datos].
     --repo-kind            Backend para el almacén del repositorio principal (fs, sqlite, leveldb) [=fs].
 -q, --storage-quota        El tamaño de la cuota total de almacenamiento dedicada al nodo [=$DefaultQuotaBytes].
 -t, --block-ttl            Tiempo de espera predeterminado del bloque en segundos - 0 deshabilita el ttl [=$DefaultBlockTtl].
     --block-mi             Intervalo de tiempo en segundos - determina la frecuencia del ciclo de mantenimiento del bloque: con qué
                            frecuencia se comprueban los bloques para la expiración y la limpieza
                            [=$DefaultBlockMaintenanceInterval].
     --block-mn             Número de bloques a comprobar en cada ciclo de mantenimiento [=1000].
 -c, --cache-size           El tamaño de la caché de bloques, 0 deshabilita la caché - podría ayudar en discos duros lentos
                            [=0].

Subcomandos disponibles:

codex persistence [OPCIONES]... comando

Las siguientes opciones están disponibles:

     --eth-provider         La URL de la API JSON-RPC del nodo Ethereum [=ws://localhost:8545].
     --eth-account          La cuenta de Ethereum que se utiliza para los contratos de almacenamiento.
     --eth-private-key      Archivo que contiene la clave privada de Ethereum para los contratos de almacenamiento.
     --marketplace-address  Dirección del contrato Marketplace desplegado.
     --validator            Habilita el validador, requiere un nodo Ethereum [=false].
     --validator-max-slots  Número máximo de slots que el validador monitoriza [=1000].
     --reward-recipient     Dirección para enviar los pagos (ej. recompensas y reembolsos).

Subcomandos disponibles:

codex persistence prover [OPCIONES]...

Las siguientes opciones están disponibles:

 -cd, --circuit-dir          Directorio donde Codex almacenará los datos del circuito de prueba
                            [=/root/.cache/codex/circuits].
     --circom-r1cs          El archivo r1cs para el circuito de almacenamiento
                            [=/root/.cache/codex/circuits/proof_main.r1cs].
     --circom-wasm          El archivo wasm para el circuito de almacenamiento
                            [=/root/.cache/codex/circuits/proof_main.wasm].
     --circom-zkey          El archivo zkey para el circuito de almacenamiento
                            [=/root/.cache/codex/circuits/proof_main.zkey].
     --circom-no-zkey       Ignora el archivo zkey - ¡úsalo sólo para pruebas! [=false].
     --proof-samples        Número de muestras para probar [=5].
     --max-slot-depth       La profundidad máxima del árbol de slots [=32].
     --max-dataset-depth    La profundidad máxima del árbol de conjunto de datos [=8].
     --max-block-depth      La profundidad máxima del árbol Merkle del bloque de red [=5].
     --max-cell-elements    El número máximo de elementos en una celda [=67].
```

### Variables de entorno

Para establecer una opción de configuración utilizando variables de entorno, primero encuentre la [opción de la CLI](#cli-options)
deseada y luego transfórmela de la siguiente manera:

 1. Añada como prefijo `CODEX_`
 2. Póngala en mayúsculas
 3. Reemplace `-` with `_`

Por ejemplo, para configurar `--log-level`, use `CODEX_LOG_LEVEL` como el nombre de la variable de entorno.

> [¡ATENCIÓN!]
> Algunas opciones no se pueden configurar a través de variables de entorno por ahora  [^multivalue-env-var] [^sub-commands].

### Archivo de Configuración

También se puede usar un archivo de configuración [TOML](https://toml.io/en/)para establecer valores de configuración. Los nombres de las opciones de configuración y los valores correspondientes se colocan en el archivo, separados por `=`. Los nombres de las opciones de configuración se pueden obtener del comando [`codex --help`](#cli-options) y no deben incluir el prefijo `--` Por ejemplo, el nivel de registro de un nodo (`--log-level`) se puede configurar usando TOML de la siguiente manera:

```toml
log-level = "trace"
```

Para opciones como `bootstrap-node` y `listen-addrs` que aceptan múltiples valores, podemos especificar los datos como un array:
```toml
listen-addrs = [
  "/ip4/0.0.0.0/tcp/1234",
  "/ip4/0.0.0.0/tcp/5678"
]
```

El nodo Codex puede entonces leer la configuración de este archivo utilizando el parámetro de la CLI `--config-file` , de la siguiente manera:
```shell
codex --config-file=/path/to/your/config.toml
```

## Ejecución

Basically, we can run Codex in three different modes:
 - [Nodo Codex](#codex-node) - útil para pruebas/desarrollo locales e intercambio básico de archivos.
 - [Nodo Codex con soporte de marketplace](#codex-node-with-marketplace-support) -  puede compartir archivos y comprar almacenamiento; este es el modo principal y debe ser utilizado por los usuarios finales.
 - [Nodo de almacenamiento Codex](#codex-storage-node) - debe ser utilizado por los proveedores de almacenamiento o si desea vender su almacenamiento local.

 También tocaremos en algunas palabras [ Nodo de arranque de Codex](#codex-bootstrap-node).

### Usando un binario

#### Nodo Codex

Podemos ejecutar Codex de una manera simple como la siguiente:


```shell
codex
```
> [¡ATENCIÓN!]
> Este comando puede no funcionar correctamente cuando usamos las versiones de  GitHub [^data-dir].

Pero, usará un valor `data-dir` predeterminado y podemos pasar uno personalizado:
```shell
codex --data-dir=datadir
```

Esto ejecutará Codex como una instancia aislada, y si deseamos unirnos a una red existente, es necesario pasar un [nodo de arranque.](#codex-bootstrap-node). También podemos pasar varios nodos:
```shell
codex \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --bootstrap-node=spr:CiUIAhIhAyUvcPkKoGE7-gh84RmKIPHJPdsX5Ugm_IHVJgF-Mmu_EgIDARo8CicAJQgCEiEDJS9w-QqgYTv6CHzhGYog8ck92xflSCb8gdUmAX4ya78QoemesAYaCwoJBES39Q2RAnVOKkYwRAIgLi3rouyaZFS_Uilx8k99ySdQCP1tsmLR21tDb9p8LcgCIG30o5YnEooQ1n6tgm9fCT7s53k6XlxyeSkD_uIO9mb3
```

> [¡IMPORTANTE!]
> Asegúrese de estar utilizando un valor adecuado para la [red](/networks/networks) a la que desea unirse.

Además, para que su nodo Codex sea accesible para otros participantes de la red, es necesario especificar una dirección IP pública que pueda usarse para acceder a su nodo:
```shell
codex \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --nat=<your public IP>
```

> [¡CONSEJO!]
> Podemos establecer la IP pública usando curl y un servicio de búsqueda de IP, como [ip.codex.storage](https://ip.codex.storage).

Después de eso, el nodo se anunciará utilizando su IP pública, el puerto UDP predeterminado ([descubrimiento](https://docs.libp2p.io/concepts/discovery-routing/overview/)) y el puerto TCP dinámico ([transferencia de datos](https://docs.libp2p.io/concepts/transports/overview/)), que se pueden ajustar de la siguiente manera:
```shell
codex \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --nat=`curl -s https://ip.codex.storage` \
  --disc-port=8090 \
  --listen-addrs=/ip4/0.0.0.0/tcp/8070
```

De esa manera, el nodo se anunciará utilizando la [multiaddress](https://docs.libp2p.io/concepts/fundamentals/addressing/) especificada y podemos verificarlo a través de la llamada a la [API](https://api.codex.storage/#tag/Debug/operation/getDebugInfo) :
```shell
curl -s localhost:8080/api/codex/v1/debug/info | jq -r '.announceAddresses'
```
```json
[
  "/ip4/<tu IP pública>/tcp/8070"
]
```
Básicamente, para la comunicación P2P, deberíamos especificar y configurar dos puertos:
| # | Protocolo | Función                                                                 | CLI option       | Ejemplo                                |
| - | -------- | ------------------------------------------------------------------------ | ---------------- | -------------------------------------- |
| 1 | UDP      | [Discovery](https://docs.libp2p.io/concepts/discovery-routing/overview/) | `--disc-port`    | `--disc-port=8090`                     |
| 2 | TCP      | [Transport](https://docs.libp2p.io/concepts/transports/overview/)        | `--listen-addrs` | `--listen-addrs=/ip4/0.0.0.0/tcp/8070` |

Y, también es necesario configurar el reenvío de puertos en su enrutador de Internet para que su nodo sea accesible para los participantes [^port-forwarding].

Entonces, una configuración básica y totalmente funcional se vería así:
```shell
codex \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
  --nat=`curl -s https://ip.codex.storage` \
  --disc-port=8090 \
  --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
  --api-cors-origin="*"
```

Después de que el nodo esté en funcionamiento y se hayan realizado las configuraciones de reenvío de puertos, deberíamos poder [ Cargar un archivo](/learn/using#upload-a-file)/[,Descargar un archivo](/learn/using#download-a-file) en la red usando la [API](/developers/api).

También puede utilizar la [UI de la aplicación Codex](https://app.codex.storage) para cargar/descargar archivos.

Y para poder comprar almacenamiento, deberíamos ejecutar [Nodo Codex con soporte de marketplace](#codex-node-with-marketplace-support).

#### Nodo Codex con soporte de marketplace

El soporte de [Marketplace](/learn/architecture.md#marketplace-architecture) permite comprar almacenamiento en la red Codex. Básicamente, deberíamos añadir solo un subcomando `persistence` y las [opciones de la CLI](#cli-options) requeridas a la [ejecución anterior](#codex-node).

> [¡NOTA!]
> Por favor, ignore la opción de la CLI `--eth-account` , ya que está obsoleta [^eth-account].

1. Para el uso diario, debemos considerar ejecutar un nodo blockchain local basado en la [red](/networks/networks) a la que desea unirse. Ese proceso se describe en la guía [Unirse a Codex Testnet](/networks/testnet), pero para un inicio rápido podemos usar un endpoint RPC público.

2. Cree un archivo con la clave privada de Ethereum y establezca los permisos adecuados:
   > [¡PRECAUCIÓN!]
   > Utilice el servicio de generación de claves solo con fines de demostración.

   ```shell
   response=$(curl -s https://key.codex.storage)
   awk -F ': ' '/private/ {print $2}' <<<"${response}" > eth.key
   awk -F ': ' '/address/ {print $2}' <<<"${response}" > eth.address
   chmod 600 eth.key
   ```
   Muestre su dirección Ethereum:
   ```shell
   cat eth.address
   ```
   ```
   0x412665aFAb17768cd9aACE6E00537Cc6D5524Da9
   ```

3. Complete su dirección de Ethereum con ETH y tokens basados en la [red](/networks/networks) a la que desea unirse.

4. Especifique los nodos de arranque y la dirección del marketplace según la [red](/networks/networks) a la que desea unirse.

5. Ejecute el nodo:
   ```shell
   codex \
     --data-dir=datadir \
     --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
     --nat=`curl -s https://ip.codex.storage` \
     --disc-port=8090 \
     --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
     --api-cors-origin="*" \
     persistence \
     --eth-provider=https://rpc.testnet.codex.storage \
     --eth-private-key=eth.key \
     --marketplace-address=0xAB03b6a58C5262f530D54146DA2a552B1C0F7648
   ```

> [¡NOTA!]
> Codex también tiene un mecanismo de autodescubrimiento de la dirección del contrato de marketplace basado en el ID de la cadena; esa asignación se realiza en el [código fuente](https://github.com/codex-storage/nim-codex/blob/master/codex/contracts/deployment.nim). De esa manera, podemos omitir el argumento `--marketplace-address` o usarlo para anular un valor codificado.

Una vez el nodo esté en funcionamiento y su dirección tenga fondos, debería poder [Comprar almacenamiento](/learn/using#purchase-storage) utilizando la [API](/developers/api).

También puede usar la [UI de la aplicación Codex](https://app.codex.storage) para la compra de almacenamiento.

#### Nodo de Almacenamiento Codex

El [nodo de almacenamiento](architecture#network-architecture) Codex debe ser ejecutado por proveedores de almacenamiento o en caso de que desee vender su almacenamiento local.

Para eso, además del [Nodo Codex con soporte de marketplace](#codex-node-with-marketplace-support), debemos usar el subcomando `prover`y las [Opciones de la CLI](#cli-options) requeridas. 

Ese subcomando hará que Codex escuche las solicitudes de prueba en la blockchain y las responda. Para calcular una respuesta para la solicitud de prueba, Codex usará los datos almacenados y los archivos de circuito generados por el código en el repositorio [codex-storage-proofs-circuits](https://github.com/codex-storage/codex-storage-proofs-circuits).

Cada [red](/networks/networks) utiliza su propio conjunto generado de archivos que se almacenan en el repositorio [codex-contracts-eth](https://github.com/codex-storage/codex-contracts-eth/tree/master/verifier/networks) y también se cargan en la CDN. El hash del conjunto de archivos también es conocido por el [contrato inteligente del marketplace](/learn/architecture#smart-contract).

Para descargar los archivos de circuito y hacerlos disponibles para la aplicación Codex, tenemos una utilidad independiente - `cirdl`. Se puede [compilar a partir de los fuentes](/learn/build#circuit-download-tool) o descargar desde la [página de lanzamiento de GitHub](https://github.com/codex-storage/nim-codex/releases).

1. Crear archivo de clave Ethereum
   <details>
   <summary>example</summary>

   > [¡PRECAUCIÓN!]
   > Utilice el servicio de generación de claves solo con fines de demostración.

   ```shell
   response=$(curl -s https://key.codex.storage)
   awk -F ': ' '/private/ {print $2}' <<<"${response}" > eth.key
   awk -F ': ' '/address/ {print $2}' <<<"${response}" > eth.address
   chmod 600 eth.key
   ```
   Muestre su dirección Ethereum:
   ```shell
   cat eth.address
   ```
   ```
   0x412665aFAb17768cd9aACE6E00537Cc6D5524Da9
   ```
   </details>

2. Para descargar los archivos de circuito, debemos pasar el directorio, el endpoint RPC y la dirección del marketplace al descargador de circuitos:
   ```shell
   # Crear carpeta de archivos de circuito
   mkdir -p datadir/circuits
   chmod 700 datadir/circuits

   # Descargar archivos de circuito
   cirdl \
     datadir/circuits \
     https://rpc.testnet.codex.storage \
     0xAB03b6a58C5262f530D54146DA2a552B1C0F7648
   ```

2. Iniciar el nodo de almacenamiento Codex
   ```shell
   codex \
     --data-dir=datadir \
     --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
     --nat=`curl -s https://ip.codex.storage` \
     --disc-port=8090 \
     --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
     persistence \
     --eth-provider=https://rpc.testnet.codex.storage \
     --eth-private-key=eth.key \
     --marketplace-address=0xAB03b6a58C5262f530D54146DA2a552B1C0F7648 \
     prover \
     --circuit-dir=datadir/circuits
   ```

> [¡NOTA!]
> Deberá pasar los nodos de arranque, el punto final RPC de la cadena de bloques y la dirección del marketplace en función de la [red](/networks/networks) a la que desee unirse.


Después de que el nodo esté en funcionamiento y su dirección haya encontrado, podrá [vender el almacenamiento](/learn/using#create-storage-availability) utilizando la [API](/developers/api).

También puede usar la [UI de la aplicación Codex](https://app.codex.storage) para vender el almacenamiento.

#### Nodo de Arranque Codex

Los nodos de arranque se utilizan solo para ayudar a los pares con el descubrimiento inicial de nodos y necesitamos ejecutar Codex con solo algunas opciones básicas:
```shell
codex \
  --data-dir=datadir \
  --nat=`curl -s https://ip.codex.storage` \
  --disc-port=8090
```

Para obtener el SPR del nodo de arranque podemos usar la llamada a la [API](https://api.codex.storage/#tag/Debug/operation/getDebugInfo) call:
```shell
curl -s localhost:8080/api/codex/v1/debug/info | jq -r '.spr'
```
```shell
spr:CiUIAhIhApd79-AxPqwRDmu7Pk-berTDtoIoMz0ovKjo85Tz8CUdEgIDARo8CicAJQgCEiECl3v34DE-rBEOa7s-T5t6tMO2gigzPSi8qOjzlPPwJR0Qjv_WtwYaCwoJBFxzjbKRAh-aKkYwRAIgCiTq5jBTaJJb6lUxN-0uNCj8lkV9AGY682D21kIAMiICIE1yxrjbDdiSCiARnS7I2zqJpXC2hOvjB4JoL9SAAk67
```

Ese registro SPR puede ser utilizado entonces por otros pares para el descubrimiento inicial de nodos.

Debemos tener en cuenta algunas cosas importantes sobre el registro SPR (ver [ENR](https://eips.ethereum.org/EIPS/eip-778)):
- Utiliza la IP del nodo (`--nat`), el puerto de descubrimiento (`--disc-port`) y la clave privada (`--net-privkey`) para la creación del registro.
- Los datos especificados se firman en cada ejecución y cambiarán, pero aún contendrán los datos especificados del nodo cuando se decodifiquen.
- Puede decodificarlo pasándolo al nodo Codex en la ejecución y con `--log-level=trace`

Para el nodo de arranque, es necesario reenviar solo el puerto de descubrimiento en su enrutador de Internet.

### Ejecutar en Daemon en Linux

Esta funcionalidad aún no es compatible :construction:

### Ejecutar como un servicio en Windows

Esta funcionalidad aún no es compatible :construction:

### Usando Docker

También enviamos Codex en contenedores Docker, que se pueden ejecutar en plataformas `amd64` y `arm64`.

#### Docker entrypoint

El [punto de entrada de Docker](https://github.com/codex-storage/nim-codex/blob/master/docker/docker-entrypoint.sh), admite algunas opciones adicionales, que se pueden utilizar para facilitar la configuración:

- `ENV_PATH` - ruta al archivo, en forma `env=value` que se obtendrá y estará disponible para Codex en la ejecución. Eso es útil para la configuración de los Pods de Kubernetes.
- `NAT_IP_AUTO` - cuando se establece en `true`, establecerá la variable `CODEX_NAT` con la dirección IP interna del contenedor. También es útil para la configuración de los Pods de Kubernetes, cuando realizamos pruebas automatizadas.
- `NAT_PUBLIC_IP_AUTO` - se utiliza para establecer  `CODEX_NAT` en la dirección IP pública utilizando servicios de búsqueda, como [ip.codex.storage](https://ip.codex.storage). Se puede utilizar para que Docker/Kubernetes establezcan la IP pública en modo automático.
- `ETH_PRIVATE_KEY` - se puede utilizar para pasar la clave privada de Ethereum, que se guardará y pasará como valor de la variable`CODEX_ETH_PRIVATE_KEY` . Debe considerarse como una opción insegura y utilizarse solo con fines de prueba.
- uando establecemos el subcomando  `prover` , el punto de entrada ejecutará la herramienta `cirdl` para descargar los archivos de ceremonia, requeridos por el [nodo de almacenamiento Codex](#codex-storage-node).

#### Red Docker

Cuando ejecutamos Codex usando Docker con la [red de puente predeterminada](https://docs.docker.com/engine/network/drivers/bridge/), predeterminada, creará un NAT doble:
 - Uno en el lado de Docker
 - Segundo en su enrutador de Internet

Si su enrutador de Internet no es compatible con [Full Cone NAT](https://learningnetwork.cisco.com/s/question/0D56e0000CWxJ9sCQF/lets-explain-in-details-full-cone-nat-restricted-cone-nat-and-symmetric-nat-terminologies-vs-cisco-nat-terminologies), es posible que tenga un problema y el descubrimiento de pares y el transporte de datos no funcionen o podrían funcionar de manera inesperada.

En ese caso, debemos considerar las siguientes soluciones:
- Utilice la [red de host](https://docs.docker.com/engine/network/drivers/host/) para Docker, que solo es compatible con Linux
- Ejecutar [usando binario](#using-binary)
- Utilice VM/VPS en la nube para ejecutar Docker con red de puente o host

#### Ejecutar usando Docker

Y, básicamente, podemos usar las mismas opciones que [usamos para el bninario](#using-binary) y adicionalmente es necesario montar volúmenes y mapear los puertos.

[Nodo de Almacenamiento Codex](#codex-storage-node)

1. Crear archivo de clave Ethereum
   <details>
   <summary>example</summary>

   > [¡PRECAUCIÓN!]
   > Utilice el servicio de generación de claves solo con fines de demostración.

   ```shell
   response=$(curl -s https://key.codex.storage)
   awk -F ': ' '/private/ {print $2}' <<<"${response}" > eth.key
   awk -F ': ' '/address/ {print $2}' <<<"${response}" > eth.address
   chmod 600 eth.key
   ```
   Muestre su dirección Ethereum:
   ```shell
   cat eth.address
   ```
   ```
   0x412665aFAb17768cd9aACE6E00537Cc6D5524Da9
   ```
   </details>

2. Ejecutar Codex:
```shell
docker run \
  --rm \
  -v $PWD/datadir:/datadir \
  -v $PWD/eth.key:/opt/eth.key \
  -p 8070:8070 \
  -p 8080:8080 \
  -p 8090:8090/udp \
  codexstorage/nim-codex:latest \
  codex \
    --data-dir=/datadir \
    --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P \
    --nat=`curl -s https://ip.codex.storage` \
    --disc-port=8090 \
    --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
    --api-cors-origin="*" \
    --api-bindaddr=0.0.0.0 \
    --api-port=8080 \
    persistence \
    --eth-provider=https://rpc.testnet.codex.storage \
    --eth-private-key=/opt/eth.key \
    --marketplace-address=0xAB03b6a58C5262f530D54146DA2a552B1C0F7648 \
    prover \
    --circuit-dir=/datadir/circuits
```

> [¡NOTA!]
> Deberá pasar nodos de arranque, el punto final RPC de la cadena de bloques y la dirección del marketplace según la [red](/networks/networks) a la que desee unirse.

### Usando Docker Compose

Para Docker Compose, es más adecuado utilizar [variables de entorno](#environment-variables) para la configuración de Codex y podemos reutilizar los comandos del ejemplo anterior para Docker.

[para la configuración de Codex y podemos reutilizar los comandos del ejemplo anterior para Docker.](#codex-storage-node)

1. Crear archivo de clave Ethereum
   <details>
   <summary>example</summary>

   > [¡PRECAUCIÓN!]
   > Utilice el servicio de generación de claves solo con fines de demostración.

   ```shell
   response=$(curl -s https://key.codex.storage)
   awk -F ': ' '/private/ {print $2}' <<<"${response}" > eth.key
   awk -F ': ' '/address/ {print $2}' <<<"${response}" > eth.address
   chmod 600 eth.key
   ```
   Muestre su dirección Ethereum:
   ```shell
   cat eth.address
   ```
   ```
   0x412665aFAb17768cd9aACE6E00537Cc6D5524Da9
   ```
   </details>

2. Crear archivo `docker-compose.yaml`:
    ```yaml
    services:
      codex:
        image: codexstorage/nim-codex:latest
        container_name: codex
        command:
          - codex
          - persistence
          - prover
          - --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P
          - --bootstrap-node=spr:CiUIAhIhAyUvcPkKoGE7-gh84RmKIPHJPdsX5Ugm_IHVJgF-Mmu_EgIDARo8CicAJQgCEiEDJS9w-QqgYTv6CHzhGYog8ck92xflSCb8gdUmAX4ya78QoemesAYaCwoJBES39Q2RAnVOKkYwRAIgLi3rouyaZFS_Uilx8k99ySdQCP1tsmLR21tDb9p8LcgCIG30o5YnEooQ1n6tgm9fCT7s53k6XlxyeSkD_uIO9mb3
          - --bootstrap-node=spr:CiUIAhIhA6_j28xa--PvvOUxH10wKEm9feXEKJIK3Z9JQ5xXgSD9EgIDARo8CicAJQgCEiEDr-PbzFr74--85TEfXTAoSb195cQokgrdn0lDnFeBIP0QzOGesAYaCwoJBK6Kf1-RAnVEKkcwRQIhAPUH5nQrqG4OW86JQWphdSdnPA98ErQ0hL9OZH9a4e5kAiBBZmUl9KnhSOiDgU3_hvjXrXZXoMxhGuZ92_rk30sNDA
          - --bootstrap-node=spr:CiUIAhIhA7E4DEMer8nUOIUSaNPA4z6x0n9Xaknd28Cfw9S2-cCeEgIDARo8CicAJQgCEiEDsTgMQx6vydQ4hRJo08DjPrHSf1dqSd3bwJ_D1Lb5wJ4Qt_CesAYaCwoJBEDhWZORAnVYKkYwRAIgFNzhnftocLlVHJl1onuhbSUM7MysXPV6dawHAA0DZNsCIDRVu9gnPTH5UkcRXLtt7MLHCo4-DL-RCMyTcMxYBXL0
          - --bootstrap-node=spr:CiUIAhIhAzZn3JmJab46BNjadVnLNQKbhnN3eYxwqpteKYY32SbOEgIDARo8CicAJQgCEiEDNmfcmYlpvjoE2Np1Wcs1ApuGc3d5jHCqm14phjfZJs4QrvWesAYaCwoJBKpA-TaRAnViKkcwRQIhANuMmZDD2c25xzTbKSirEpkZYoxbq-FU_lpI0K0e4mIVAiBfQX4yR47h1LCnHznXgDs6xx5DLO5q3lUcicqUeaqGeg
          - --bootstrap-node=spr:CiUIAhIhAgybmRwboqDdUJjeZrzh43sn5mp8jt6ENIb08tLn4x01EgIDARo8CicAJQgCEiECDJuZHBuioN1QmN5mvOHjeyfmanyO3oQ0hvTy0ufjHTUQh4ifsAYaCwoJBI_0zSiRAnVsKkcwRQIhAJCb_z0E3RsnQrEePdJzMSQrmn_ooHv6mbw1DOh5IbVNAiBbBJrWR8eBV6ftzMd6ofa5khNA2h88OBhMqHCIzSjCeA
          - --bootstrap-node=spr:CiUIAhIhAntGLadpfuBCD9XXfiN_43-V3L5VWgFCXxg4a8uhDdnYEgIDARo8CicAJQgCEiECe0Ytp2l-4EIP1dd-I3_jf5XcvlVaAUJfGDhry6EN2dgQsIufsAYaCwoJBNEmoCiRAnV2KkYwRAIgXO3bzd5VF8jLZG8r7dcLJ_FnQBYp1BcxrOvovEa40acCIDhQ14eJRoPwJ6GKgqOkXdaFAsoszl-HIRzYcXKeb7D9
        environment:
          - CODEX_DATA_DIR=/datadir
          - NAT_PUBLIC_IP_AUTO=https://ip.codex.storage
          - CODEX_DISC_PORT=8090
          - CODEX_LISTEN_ADDRS=/ip4/0.0.0.0/tcp/8070
          - CODEX_API_CORS_ORIGIN="*"
          - CODEX_API_PORT=8080
          - CODEX_API_BINDADDR=0.0.0.0
          - CODEX_ETH_PROVIDER=https://rpc.testnet.codex.storage
          - CODEX_ETH_PRIVATE_KEY=/opt/eth.key
          - CODEX_MARKETPLACE_ADDRESS=0xAB03b6a58C5262f530D54146DA2a552B1C0F7648
          - CODEX_CIRCUIT_DIR=/datadir/circuits
        ports:
          - 8080:8080/tcp # API
          - 8090:8090/udp # Discovery
          - 8070:8070/tcp # Transport
        volumes:
          - ./datadir:/datadir
          - ./eth.key:/opt/eth.key
        logging:
          driver: json-file
          options:
            max-size: 100m
            max-file: 5
    ```

3. Ejecutar Codex:
   ```shell
   docker compose up
   ```

> [¡NOTA!]
> Deberá pasar nodos de arranque, el punto final RPC de la cadena de bloques y la dirección del marketplace según la [red](/networks/networks) a la que desee unirse.

### En Kubernetes

Helm chart code is available in [helm-charts](https://github.com/codex-storage/helm-charts) repository, but chart was not published yet.

## Known issues

[^multivalue-env-var]: Las variables de entorno como `CODEX_BOOTSTRAP_NODE` y `CODEX_LISTEN_ADDRS` no admiten múltiples valores. Por favor, consulta [[Solicitud de función] Soporte para múltiples registros SPR a través de la variable de entorno #525](https://github.com/codex-storage/nim-codex/issues/525), para obtener más información.
[^sub-commands]: Los subcomandos `persistence` y `persistence prover` no se pueden establecer a través de variables de entorno.
[^data-dir]: Deberíamos establecer data-dir de forma explícita cuando usemos las versiones de GitHub - [[BUG] cambiar el datadir por defecto de Codex desde el tiempo de compilación al tiempo de ejecución #923.](https://github.com/codex-storage/nim-codex/issues/923)
[^port-forwarding]: [NAT traversal #753](https://github.com/codex-storage/nim-codex/issues/753) aún no está implementado, y necesitaremos configurar el reenvío de puertos para los protocolos de descubrimiento y transporte.
[^eth-account]: Por favor, ignora la opción de la CLI `--eth-account` - [Descartar el soporte para --eth-account #727](https://github.com/codex-storage/nim-codex/issues/727).
