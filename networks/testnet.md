---
outline: [2, 4]
---
# Codex Testnet

La red de pruebas (Testnet) de Codex ha sido lanzada y está lista para ser utilizada para pruebas.

Tu participación en la Testnet de Codex está sujeta a los [Términos y Condiciones de la Testnet de Codex](https://github.com/codex-storage/codex-testnet-starter/blob/master/Codex%20Testnet%20Terms%20and%20Conditions.pdf) y a la [Política de Privacidad de la Testnet de Codex](https://github.com/codex-storage/codex-testnet-starter/blob/master/Codex%20Testnet%20Privacy%20Policy.pdf).

**Guías.** Tenemos guías básicas que cubren cómo configurar un Cliente de Almacenamiento, que puede ser utilizado para subir y almacenar archivos comprando espacio de almacenamiento en la red Codex. Recomendamos que comiences con estas.

Ejecutar un Proveedor de Almacenamiento es más complejo y está cubierto en una guía separada, la cual demuestra el lado de la venta de almacenamiento, así como también cómo ejecutar Codex con su propio cliente de ejecución de Ethereum local.

Las guías están disponibles en Discord, como guías interactivas paso a paso, o aquí como instrucciones simples que puedes seguir:

- **Básico: Ejecutando un cliente de almacenamiento.** [[Discord](#sc-guide-discord) | [Web](#sc-guide-web)]
- **Avanzado: Ejecutando un proveedor de almacenamiento.** [[Web](#sp-guide-web)]

Las guías fueron probadas en los siguientes sistemas operativos:

- Linux: Ubuntu 24.04, Debian 12, Fedora 40
- macOS: 15
- Windows: 11, Server 2022

## Ejecutando un Cliente de Almacenamiento (Versión Discord) {#sc-guide-discord}

Puedes unirte al [servidor de Discord de Codex](https://discord.gg/codex-storage) e ingresar al canal [#:tv:|join-testnet](https://discord.com/channels/895609329053474826/1289923125928001702).

Es prácticamente lo mismo que la [Guía Web](#sc-guide-web), pero utiliza las capacidades de Discord para que puedas tener una guía interactiva paso a paso, y también puedes obtener soporte en el canal [#:sos:|node-help](https://discord.com/channels/895609329053474826/1286205545837105224).

## Ejecutando un Cliente de Almacenamiento (Versión Web) {#sc-guide-web}

**Prerrequisitos**

- Acceso a tu enrutador de Internet para que puedas [configurar el reenvío de puertos](#basic-common)

Los pasos para [Linux/macOS](#basic-linux-macos) y [Windows](#basic-windows) son ligeramente diferentes, así que por favor utiliza los que correspondan a tu sistema operativo.

<hr>

### Linux/macOS {#basic-linux-macos}

1. Descarga el archivo tarball maestro del repositorio de inicio de la testnet de Codex, y descomprime su contenido:
   ```shell
   curl -LO https://github.com/codex-storage/codex-testnet-starter/archive/master.tar.gz
   tar xzvf master.tar.gz
   rm master.tar.gz
   ```

2. Navega a la carpeta de scripts:
   ```shell
   cd codex-testnet-starter-master/scripts
   ```

3. Instala las dependencias cuando sea necesario:
   ```shell
   #  Linux basado en Debian
   sudo apt update && sudo apt install libgomp1
   ```

4. Descarga los binarios de Codex desde las versiones de GitHub:
   ```shell
   ./download_online.sh
   ```

5. Genera claves Ethereum:
   ```shell
   ./generate.sh
   ```
   Tu clave privada se guardará en el archivo `eth.key` y la dirección en el archivo  `eth.address` .

6. Completa tu dirección que se muestra en la pantalla con los tokens:
   - Usa los grifos web para acuñar algunos [ETH](https://faucet-eth.testnet.codex.storage) y los tokens [TST](https://faucet-tst.testnet.codex.storage) .
   - También podemos hacer esto usando el canal Discord [# bot](https://discord.com/channels/895609329053474826/1230785221553819669) .
     - Use `/set ethaddress` comando para ingresar su dirección generada
     - Use `/mint` comando para recibir ETH y tokens TST
     - Use `/balance` comando para verificar si recibió los tokens de prueba con éxito

7. Ejecuta el nodo Codex:
   ```shell
   ./run_client.sh
   ```

8. Configura el [reenvío de puertos](#basic-common) y ya estaría.

### Windows {#basic-windows}

1. Descarga el archivo tarball maestro del repositorio de inicio de la testnet de Codex, y descomprime su contenido:
   > [¡ATENCIÓN!]
   > El software antivirus de Windows y los firewalls integrados pueden causar que los pasos fallen. Cubriremos algunos posibles errores aquí, pero considera siempre revisar tu configuración si las peticiones fallan - en particular, si deshabilitar temporalmente tu antivirus lo soluciona, entonces es probable que este sea el culpable.

   ```batch
   curl -LO https://github.com/codex-storage/codex-testnet-starter/archive/master.tar.gz
   ```

   Si ves un error como:

   ```batch
   curl: (35) schannel: next InitializeSecurityContext failed: CRYPT_E_NO_REVOCATION_CHECK (0x80092012) - The revocation function was unable to check revocation for the certificate.
   ```

   Puede que necesites añadir la opción  `--ssl-no-revoke`  a tu llamada curl, por ejemplo:

   ```batch
   curl -LO --ssl-no-revoke https://github.com/codex-storage/codex-testnet-starter/archive/master.tar.gz
   ```

2. Extrae el contenido del archivo tar, y luego elimínalo:
   ```batch
   tar xzvf master.tar.gz
   del master.tar.gz
   ```

3. Navega a la carpeta de scripts:
   ```batch
   cd codex-testnet-starter-master\scripts\windows
   ```

4. Descarga los binarios de Codex desde las versiones de GitHub:
   ```batch
   download-online.bat
   ```

5. Genera claves de Ethereum:
   ```batch
   generate.bat
   ```
  Tu clave privada se guardará en el archivo  `eth.key` y la dirección en el archivo  `eth.address` .

5. Completa tu dirección que se muestra en la pantalla con los tokens:
   - Usa los grifos web para acuñar algunos [ETH](https://faucet-eth.testnet.codex.storage) y los tokens [TST](https://faucet-tst.testnet.codex.storage) .
   - También podemos hacer esto usando el canal Discord [# bot](https://discord.com/channels/895609329053474826/1230785221553819669) .
     - Use `/set ethaddress` comando para ingresar su dirección generada
     - Use `/mint` comando para recibir ETH y tokens TST
     - Use `/balance` comando para verificar si recibió los tokens de prueba con éxito


7. Ejecuta el nodo Codex:
   ```batch
   run-client.bat
   ```

 8. Configura el [reenvío de puertos](#basic-common) y ya estaría.

### Todos los SO {#basic-common}

Configura el [reenvío de puertos](https://en.wikipedia.org/wiki/Port_forwarding) en tu router
| # | Protocolo | Puerto   | Descripción      |
| - | -------- | ------ | ----------------- |
| 1 | `UDP`    | `8090` | `Descubrimiento de Codex` |
| 2 | `TCP`    | `8070` | `Transporte de Codex` |

Una vez que tu nodo esté en funcionamiento, puedes utilizar la [API de Codex](/developers/api) para interactuar con tu nodo Codex. Por favor, revisa nuestro [recorrido por la API](/learn/using) para más detalles.

También puedes utilizar la [Interfaz de Usuario de la App de Codex](https://app.codex.storage) para interactuar con tu nodo Codex local.

¿Necesitas ayuda? Contáctanos en el canal [#:sos:|node-help](https://discord.com/channels/895609329053474826/1286205545837105224) o revisa la [guía de resolución de problemas](/learn/troubleshoot.md).

## Ejecutando un Proveedor de Almacenamiento (Versión Web) {#sp-guide-web}
Trabajo en progreso :construction:

## Datos de la Testnet

### Nodos Bootstrap
**Codex**
```shell
spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P
spr:CiUIAhIhAyUvcPkKoGE7-gh84RmKIPHJPdsX5Ugm_IHVJgF-Mmu_EgIDARo8CicAJQgCEiEDJS9w-QqgYTv6CHzhGYog8ck92xflSCb8gdUmAX4ya78QoemesAYaCwoJBES39Q2RAnVOKkYwRAIgLi3rouyaZFS_Uilx8k99ySdQCP1tsmLR21tDb9p8LcgCIG30o5YnEooQ1n6tgm9fCT7s53k6XlxyeSkD_uIO9mb3
spr:CiUIAhIhA6_j28xa--PvvOUxH10wKEm9feXEKJIK3Z9JQ5xXgSD9EgIDARo8CicAJQgCEiEDr-PbzFr74--85TEfXTAoSb195cQokgrdn0lDnFeBIP0QzOGesAYaCwoJBK6Kf1-RAnVEKkcwRQIhAPUH5nQrqG4OW86JQWphdSdnPA98ErQ0hL9OZH9a4e5kAiBBZmUl9KnhSOiDgU3_hvjXrXZXoMxhGuZ92_rk30sNDA
spr:CiUIAhIhA7E4DEMer8nUOIUSaNPA4z6x0n9Xaknd28Cfw9S2-cCeEgIDARo8CicAJQgCEiEDsTgMQx6vydQ4hRJo08DjPrHSf1dqSd3bwJ_D1Lb5wJ4Qt_CesAYaCwoJBEDhWZORAnVYKkYwRAIgFNzhnftocLlVHJl1onuhbSUM7MysXPV6dawHAA0DZNsCIDRVu9gnPTH5UkcRXLtt7MLHCo4-DL-RCMyTcMxYBXL0
spr:CiUIAhIhAzZn3JmJab46BNjadVnLNQKbhnN3eYxwqpteKYY32SbOEgIDARo8CicAJQgCEiEDNmfcmYlpvjoE2Np1Wcs1ApuGc3d5jHCqm14phjfZJs4QrvWesAYaCwoJBKpA-TaRAnViKkcwRQIhANuMmZDD2c25xzTbKSirEpkZYoxbq-FU_lpI0K0e4mIVAiBfQX4yR47h1LCnHznXgDs6xx5DLO5q3lUcicqUeaqGeg
spr:CiUIAhIhAgybmRwboqDdUJjeZrzh43sn5mp8jt6ENIb08tLn4x01EgIDARo8CicAJQgCEiECDJuZHBuioN1QmN5mvOHjeyfmanyO3oQ0hvTy0ufjHTUQh4ifsAYaCwoJBI_0zSiRAnVsKkcwRQIhAJCb_z0E3RsnQrEePdJzMSQrmn_ooHv6mbw1DOh5IbVNAiBbBJrWR8eBV6ftzMd6ofa5khNA2h88OBhMqHCIzSjCeA
spr:CiUIAhIhAntGLadpfuBCD9XXfiN_43-V3L5VWgFCXxg4a8uhDdnYEgIDARo8CicAJQgCEiECe0Ytp2l-4EIP1dd-I3_jf5XcvlVaAUJfGDhry6EN2dgQsIufsAYaCwoJBNEmoCiRAnV2KkYwRAIgXO3bzd5VF8jLZG8r7dcLJ_FnQBYp1BcxrOvovEa40acCIDhQ14eJRoPwJ6GKgqOkXdaFAsoszl-HIRzYcXKeb7D9
```

**Geth**
```shell
enode://cff0c44c62ecd6e00d72131f336bb4e4968f2c1c1abeca7d4be2d35f818608b6d8688b6b65a18f1d57796eaca32fd9d08f15908a88afe18c1748997235ea6fe7@159.223.243.50:40010
enode://ea331eaa8c5150a45b793b3d7c17db138b09f7c9dd7d881a1e2e17a053e0d2600e0a8419899188a87e6b91928d14267949a7e6ec18bfe972f3a14c5c2fe9aecb@68.183.245.13:40030
enode://4a7303b8a72db91c7c80c8fb69df0ffb06370d7f5fe951bcdc19107a686ba61432dc5397d073571433e8fc1f8295127cabbcbfd9d8464b242b7ad0dcd35e67fc@174.138.127.95:40020
enode://36f25e91385206300d04b95a2f8df7d7a792db0a76bd68f897ec7749241b5fdb549a4eecfab4a03c36955d1242b0316b47548b87ad8291794ab6d3fecda3e85b@64.225.89.147:40040
enode://2e14e4a8092b67db76c90b0a02d97d88fc2bb9df0e85df1e0a96472cdfa06b83d970ea503a9bc569c4112c4c447dbd1e1f03cf68471668ba31920ac1d05f85e3@170.64.249.54:40050
enode://6eeb3b3af8bef5634b47b573a17477ea2c4129ab3964210afe3b93774ce57da832eb110f90fbfcfa5f7adf18e55faaf2393d2e94710882d09d0204a9d7bc6dd2@143.244.205.40:40060
enode://6ba0e8b5d968ca8eb2650dd984cdcf50acc01e4ea182350e990191aadd79897801b79455a1186060aa3818a6bc4496af07f0912f7af53995a5ddb1e53d6f31b5@209.38.160.40:40070
```

### Contratos Inteligentes

| Contract    | Dirección                                                                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Token       | [`0x34a22f3911De437307c6f4485931779670f78764`](https://explorer.testnet.codex.storage/address/0x34a22f3911De437307c6f4485931779670f78764) |
| Dirección    | [`0x02dd582726F7507D7d0F8bD8bf8053d3006F9092`](https://explorer.testnet.codex.storage/address/0x02dd582726F7507D7d0F8bD8bf8053d3006F9092) |
| Marketplace | [`0xAB03b6a58C5262f530D54146DA2a552B1C0F7648`](https://explorer.testnet.codex.storage/address/0xAB03b6a58C5262f530D54146DA2a552B1C0F7648) |

### Puntos de Acceso (Endpoints)

| # | Service         | URL                                                                          |
| - | --------------- | ---------------------------------------------------------------------------- |
| 1 | Geth RPC Público | [rpc.testnet.codex.storage](https://rpc.testnet.codex.storage)               |
| 2 | Explorador de Bloques  | [explorer.testnet.codex.storage](https://explorer.testnet.codex.storage)     |
| 3 | Faucet ETH      | [faucet-eth.testnet.codex.storage](https://faucet-eth.testnet.codex.storage) |
| 4 | Faucet TST      | [faucet-tst.testnet.codex.storage](https://faucet-tst.testnet.codex.storage) |
| 5 | Página de Estado     | [status.testnet.codex.storage](https://status.testnet.codex.storage)         |
