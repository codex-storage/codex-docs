---
outline: [2, 3]
---
# Usando Codex

Podemos interactuar con Codex usando la [API REST](/developers/api). Este documento le mostrará varios ejemplos útiles.

Además, podemos consultar la [UI de la App Codex](https://app.codex.storage).

El intérprete de línea de comandos en [Linux/macOS](#linux-macos) y [Windows](#windows) funciona de forma ligeramente diferente, así que utilice los pasos para su sistema operativo.

## Linux/macOS

### Descripción General
1. [Debug](#debug)
2. [Subir un archivo](#upload-a-file)
3. [Descargar un archivo](#download-a-file)
4. [Datos Locales](#local-data)
5. [Crear disponibilidad de almacenamiento](#create-storage-availability)
6. [Comprar almacenamiento](#purchase-storage)
7. [Ver el estado de la compra](#view-purchase-status)

### Debug
na forma sencilla de comprobar que su nodo está activo y en funcionamiento e

```shell
curl http://localhost:8080/api/codex/v1/debug/info \
  -w '\n'
```

Esto devolverá una estructura JSON con mucha información sobre su nodo local. Contiene información de pares que puede ser útil para solucionar problemas de conexión.

### Subir un archivo
> [¡ATENCIÓN!]
> Una vez que sube un archivo a Codex, otros nodos de la red pueden descargarlo. Por favor, no suba nada a lo que no quiera que otros accedan, o, encripte apropiadamente sus datos *primero*.

```shell
curl -X POST \
  http://localhost:8080/api/codex/v1/data \
  -H 'Content-Type: application/octet-stream' \
  -w '\n' \
  -T <FILE>
```

Tras una subida exitosa, recibirá un CID. Esto puede ser utilizado para descargar el archivo desde cualquier nodo en la red.

> [¡CONSEJO!]
> Está en el [servidor de Discord de Codex](https://discord.gg/codex-storage)? Publique su CID en el canal [# :wireless: | share-cids](https://discord.com/channels/895609329053474826/1278383098102284369) , vea si otros pueden descargarlo. Codex no proporciona (¿todavía?) metadatos de archivos, así que, si quiere que otros puedan abrir su archivo, dígasles qué extensión deben darle.

### Descargar un archivo
Cuando tenga un CID de datos que quiera descargar, puede usar los siguientes comandos:

```shell
# paste your CID from the previous step here between the quotes
CID="..."
```

```shell
curl "http://localhost:8080/api/codex/v1/data/${CID}/network/stream" \
  -o "${CID}.png"
```

Utilice la extensión correcta para el archivo descargado, porque Codex aún no almacena información de content-type o extensión.

### Datos locales
Puede ver qué conjuntos de datos están siendo almacenados actualmente por su nodo:

```shell
curl http://localhost:8080/api/codex/v1/data \
  -w '\n'
```

### Crear disponibilidad de almacenamiento
> [¡ATENCIÓN!]
> Este paso requiere que Codex se haya iniciado con la opción [`prover`](/learn/run#codex-storage-node) .

Para empezar a vender espacio de almacenamiento a la red, debe configurar su nodo con el siguiente comando. Una vez configurado, el nodo supervisará las solicitudes de almacenamiento en cadena y celebrará automáticamente los contratos que cumplan con estas especificaciones. Para celebrar y mantener los contratos de almacenamiento, su nodo debe presentar pruebas de almacenamiento de conocimiento cero. El cálculo de estas pruebas aumentará el uso de CPU y RAM de Codex.

```shell
curl -X POST \
  http://localhost:8080/api/codex/v1/sales/availability \
  -H 'Content-Type: application/json' \
  -w '\n' \
  -d '{
    "totalSize": "8000000",
    "duration": "7200",
    "minPrice": "10",
    "maxCollateral": "10"
  }'
```

Para obtener descripciones de cada parámetro, consulte la [especificación](https://api.codex.storage/#tag/Marketplace/operation/offerStorage).

### Comprar almacenamiento
Para comprar espacio de almacenamiento de la red, primero debe subir sus datos. Una vez que tenga el CID, utilice lo siguiente para crear una solicitud de almacenamiento.

Establezca su CID:

```shell
# paste your CID from the previous step here between the quotes
CID="..."
echo "CID: ${CID}"
```

A continuación, puede ejecutar:

```shell
curl -X POST \
  "http://localhost:8080/api/codex/v1/storage/request/${CID}" \
  -w '\n' \
  -d '{
    "duration": "3600",
    "reward": "1",
    "proofProbability": "5",
    "expiry": "1200",
    "nodes": 5,
    "tolerance": 2,
    "collateral": "1"
  }'
```

Para obtener descripciones de cada parámetro, consulte la [especificación](https://api.codex.storage/#tag/Marketplace/operation/createStorageRequest).

Si tiene éxito, esta solicitud devolverá un Purchase-ID.

### Ver el estado de la compra
Usando un Purchase-ID, puede comprobar el estado de su contrato de solicitud de almacenamiento:

```shell
# pegue su PURCHASE_ID del paso anterior aquí entre las comillas
PURCHASE_ID="..."
```

Entonces:

```shell
curl "http://localhost:8080/api/codex/v1/storage/purchases/${PURCHASE_ID}" \
  -w '\n'
```

Esto mostrará información de estado y errores para su compra.
| Estado     | Descripción                                                                                                                                                                                            |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Pendiente    | La solicitud está esperando la confirmación de la cadena.                                                                                                                                                             |
| Enviado | La solicitud está en la cadena. Los hosts ahora pueden intentar descargar los datos.                                                                                                                                       |
| Iniciado   | Los hosts han descargado los datos y han proporcionado prueba de almacenamiento.                                                                                                                                          |
| Fallido    | La solicitud se inició, pero (demasiados) hosts no proporcionaron la prueba de almacenamiento a tiempo. Aunque los datos pueden seguir estando disponibles en la red, a efectos de la compra se consideran perdidos. |
| Finalizado  | La solicitud se inició correctamente y la duración ha transcurrido.                                                                                                                                     |
| Expirado   | (No suficientes) hosts han enviado una prueba de almacenamiento antes de que transcurriera la fecha de caducidad de la solicitud.                                                                                                                |
| Erróneo   | Un desafortunado estado de cosas. El campo 'error' debería darle más información.                                                                                                                               |

## Windows

### Descripción General {#overview-windows}
1. [Debug](#debug-windows)
2. [Subir un archivo](#upload-a-file-windows)
3. [Descargar un archivo](#download-a-file-windows)
4. [Datos locales](#local-data-windows)
5. [Crear disponibilidad de almacenamiento](#create-storage-availability-windows)
6. [Comprar almacenamiento](#purchase-storage-windows)
7. [Ver el estado de la compra](#view-purchase-status-windows)

### Debug {#debug-windows}
Una forma sencilla de comprobar que su nodo está activo y en funcionamiento es:

```batch
curl http://localhost:8080/api/codex/v1/debug/info
```

Esto devolverá una estructura JSON con mucha información sobre su nodo local. Contiene información de pares que puede ser útil para solucionar problemas de conexión.

### Subir un archivo {#upload-a-file-windows}
> [¡ATENCIÓN!]
> Una vez que sube un archivo a Codex, otros nodos de la red pueden descargarlo. Por favor, no suba nada a lo que no quiera que otros accedan, o, encripte apropiadamente sus datos *primero*.

```batch
curl -X POST ^
  http://localhost:8080/api/codex/v1/data ^
  -H "Content-Type: application/octet-stream" ^
  -T <FILE>
```

Tras una subida exitosa, recibirá un CID. Esto puede ser utilizado para descargar el archivo desde cualquier nodo en la red.

> [¡CONSEJO!]
> Está en el [servidor de Discord de Codex](https://discord.gg/codex-storage)? Publique su CID en el canal [# :wireless: | share-cids](https://discord.com/channels/895609329053474826/1278383098102284369), vea si otros pueden descargarlo. Codex no proporciona (¿todavía?) metadatos de archivos, así que, si quiere que otros puedan abrir su archivo, dígasles qué extensión deben darle.

### Descargar un archivo {#download-a-file-windows}
Cuando tenga un CID de datos que quiera descargar, puede usar los siguientes comandos:

```batch
:: pegue su CID del paso anterior aquí entre las comillas
set CID="..."
```

```batch
curl "http://localhost:8080/api/codex/v1/data/%CID%/network/stream" ^
  -o "%CID%.png"
```

Utilice la extensión correcta para el archivo descargado, porque Codex aún no almacena información de content-type o extensión.

### Datos locales {#local-data-windows}
Puede ver qué conjuntos de datos están siendo almacenados actualmente por su nodo:

```batch
curl http://localhost:8080/api/codex/v1/data
```

### Crear disponibilidad de almacenamiento {#create-storage-availability-windows}
> [¡ATENCIÓN!]
> Este paso requiere que Codex se haya iniciado con la opción [`prover`](/learn/run#codex-storage-node) .

Para empezar a vender espacio de almacenamiento a la red, debe configurar su nodo con el siguiente comando. Una vez configurado, el nodo supervisará las solicitudes de almacenamiento en cadena y celebrará automáticamente los contratos que cumplan con estas especificaciones. Para celebrar y mantener los contratos de almacenamiento, su nodo debe presentar pruebas de almacenamiento de conocimiento cero. El cálculo de estas pruebas aumentará el uso de CPU y RAM de Codex.

```batch
curl -X POST ^
  http://localhost:8080/api/codex/v1/sales/availability ^
  -H "Content-Type: application/json" ^
  -d "{""totalSize"": ""8000000"", ""duration"": ""7200"", ""minPrice"": ""10"", ""maxCollateral"": ""10""}"
```

Para obtener descripciones de cada parámetro, consulte la [especificación](https://api.codex.storage/#tag/Marketplace/operation/offerStorage).

### Comprar almacenamiento {#purchase-storage-windows}
Para comprar espacio de almacenamiento de la red, primero debe subir sus datos. Una vez que tenga el CID, utilice lo siguiente para crear una solicitud de almacenamiento.

Establezca su CID:

```batch
:: paste your CID from the previous step here between the quotes
set CID="..."
echo CID: %CID%
```

A continuación, puede ejecutar:

```batch
curl -X POST ^
  "http://localhost:8080/api/codex/v1/storage/request/%CID%" ^
  -H "Content-Type: application/json" ^
  -d "{""duration"": ""3600"",""reward"": ""1"", ""proofProbability"": ""5"", ""expiry"": ""1200"", ""nodes"": 5, ""tolerance"": 2, ""collateral"": ""1""}"
```

Para obtener descripciones de cada parámetro, consulte la [especificación](https://api.codex.storage/#tag/Marketplace/operation/createStorageRequest).

Si tiene éxito, esta solicitud devolverá un Purchase-ID.

### Ver el estado de la compra {#view-purchase-status-windows}
Usando un Purchase-ID, puede comprobar el estado de su contrato de solicitud de almacenamiento:

```batch
:: pegue su PURCHASE_ID del paso anterior aquí entre las comillas
set PURCHASE_ID="..."
```

Entonces:

```batch
curl "http://localhost:8080/api/codex/v1/storage/purchases/%PURCHASE_ID%"
```

Esto mostrará información de estado y errores para su compra.
| Estado     | Descripción                                                                                                                                                                                            |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Pendiente    | La solicitud está esperando la confirmación de la cadena.                                                                                                                                                             |
| Enviado | La solicitud está en la cadena. Los hosts ahora pueden intentar descargar los datos.                                                                                                                                       |
| Iniciado   | Los hosts han descargado los datos y han proporcionado prueba de almacenamiento.                                                                                                                                          |
| Fallido    | La solicitud se inició, pero (demasiados) hosts no proporcionaron la prueba de almacenamiento a tiempo. Aunque los datos pueden seguir estando disponibles en la red, a efectos de la compra se consideran perdidos. |
| Finalizado  | La solicitud se inició correctamente y la duración ha transcurrido.                                                                                                                                     |
| Expirado   | (No suficientes) hosts han enviado una prueba de almacenamiento antes de que transcurriera la fecha de caducidad de la solicitud.                                                                                                                |
| Erróneo   | Un desafortunado estado de cosas. El campo 'error' debería darle más información.   |                                                                                                                   

## Problemas conocidos
1. Añadimos una nueva línea a las llamadas a la API para obtener una salida más legible, consulte [[rest] Add line ending on responses #771](https://github.com/codex-storage/nim-codex/issues/771) para obtener más detalles.
