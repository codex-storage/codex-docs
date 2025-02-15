# Inicio Rápido

Para ejecutar Codex a través de esta guía, necesitaremos realizar los siguientes pasos:
- [Revisar el descargo de responsabilidad](/codex/disclaimer)
- [Obtener el binario de Codex](#get-codex-binary)
- [Ejecutar Codex](#run-codex)
- [Interactuar con Codex](#interact-with-codex)

## Obtener el binario de Codex

Para un inicio rápido, utilizaremos binarios precompilados desde la [página de lanzamiento de GitHub](https://github.com/codex-storage/nim-codex/releases). Si prefiere compilar desde las fuentes, consulte [Compilar Codex](/learn/build).

Por favor, siga los pasos para su sistema operativo de la lista:
- [Linux/macOS](#linux-macos)
- [Windows](#windows)

### Linux/macOS

1. Instalar la última versión de Codex
   ```shell
   curl -s https://get.codex.storage/install.sh | bash
   ```

2. Instalar dependencias
   ```shell
   # Debian-based Linux
   sudo apt update && sudo apt install libgomp1
   ```

3. Verificar el resultado
   ```shell
   codex --version
   ```

### Windows

1. Instalar la última versión de Codex
   ```batch
    curl -sO https://get.codex.storage/install.cmd && install.cmd 
   ```

   > [¡ATENCIÓN!]
   > El software antivirus de Windows y los firewalls integrados pueden causar que los pasos fallen. Cubriremos algunos posibles errores aquí, pero siempre considere verificar su configuración si las solicitudes fallan; en particular, si deshabilitar temporalmente su antivirus lo soluciona, entonces es probable que sea el culpable.

   Si ve un error como:

   ```batch
   curl: (35) schannel: next InitializeSecurityContext failed: CRYPT_E_NO_REVOCATION_CHECK (0x80092012) - The revocation function was unable to check revocation for the certificate.
   ```

   Es posible que necesite añadir la opción `--ssl-no-revoke` a sus llamadas cuirl, es decir, modificar las llamadas anteriores para que se vean así:

   ```batch
    curl -LO --ssl-no-revoke https://...
    ```

2. Actualizar el PATH usando la salida de la consola
    - Solo sesión actual
      ```batch
      :: Default installation directory
      set "PATH=%PATH%%LOCALAPPDATA%\Codex;"
      ```

    - Actualizar el PATH permanentemente
 Panel de control --> Sistema --> Configuración avanzada del sistema --> Variables de entorno
      - Alternativamente, escriba `environment variables` en el cuadro de búsqueda de Windows

3. Verificar el resultado
   ```shell
   codex --version
   ```

## Ejecutar Codex

Podemos  [ejecutar Codex en diferentes modos](/learn/run#run), y para un inicio rápido ejecutaremos un [nodo de Codex](/learn/run#codex-node), para poder compartir archivos en la red.

1. Ejecutar Codex

   **Linux/macOS**
   ```shell
   codex \
     --data-dir=datadir \
     --disc-port=8090 \
     --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
     --nat=`curl -s https://ip.codex.storage` \
     --api-cors-origin="*" \
     --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P
   ```

   **Windows**

   > [¡ATENCIÓN!]
   > Windows podría en esta etapa pedirle que otorgue acceso a Internet a Codex. Debe permitirlo para que las cosas funcionen.
   > ambién podría ser necesario añadir reglas de firewall de entrada para Codex y podemos usar la utilidad  `netsh` .

   <details>
   <summary>add firewall rules using netsh</summary>

   ```batch
   :: Añadir reglas
   netsh advfirewall firewall add rule name="Allow Codex (TCP-In)" protocol=TCP dir=in localport=8070 action=allow
   netsh advfirewall firewall add rule name="Allow Codex (UDP-In)" protocol=UDP dir=in localport=8090 action=allow

   :: Listar reglas
   netsh advfirewall firewall show rule name=all | find /I "Codex"

   :: Eliminar reglas
   netsh advfirewall firewall delete rule name="Allow Codex (TCP-In)"
   netsh advfirewall firewall delete rule name="Allow Codex (UDP-In)"
   ```
   </details>

   ```batch
   :: Obtener IP Pública
   for /f "delims=" %a in ('curl -s --ssl-reqd ip.codex.storage') do set nat=%a

   :: Ejecutar Codex
   codex ^
     --data-dir=datadir ^
     --disc-port=8090 ^
     --listen-addrs=/ip4/0.0.0.0/tcp/8070 ^
     --nat=%nat% ^
     --api-cors-origin="*" ^
     --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P
   ```

   > [¡CONSEJO!]
   > En el ejemplo anterior, utilizamos los nodos de arranque de [Codex Testnet](/networks/testnet#bootstrap-nodes) y, por lo tanto, nos unimos a Testnet. Si desea unirse a una red diferente , utilice el [valor apropiado](/networks/networks).

2. Configurar el reenvío de puertos para los puertos TCP/UDP en su enrutador de Internet
   | Protocolo | Servicio   | Puerto   |
   | -------- | --------- | ------ |
   | UDP      | Descubrimiento | `8090` |
   | TCP      | Transporte | `8070` |

Si desea comprar o vender almacenamiento, considere ejecutar  [Nodo Codex con soporte de marketplace](/learn/run#codex-node-with-marketplace-support) o [Nodo de almacenamiento Codex](/learn/run#codex-storage-node).

## Interactuar con Codex

Cuando su nodo Codex esté en funcionamiento, puede interactuar con él utilizando la [UI de la aplicación de Codex](https://app.codex.storage) para compartir archivos.

Además, puede interactuar con Codex utilizando la [API de Codex](/developers/api) y, para un recorrido por la API, considere seguir la guía [Usando Codex](/learn/using).

## Mantente en Contacto

¿Quiere mantenerse actualizado o busca más ayuda? Pruebe nuestro [servidor de Discord](https://discord.gg/codex-storage).

¿Listo para explorar la funcionalidad de Codex? Por favor [Únase a Codex Testnet](/networks/testnet).

Si desea ejecutar Codex localmente sin unirse a Testnet, considere probar la [Prueba de dos clientes Codex ](/learn/local-two-client-test) o la [Ejecución de una red Codex local con soporte de Marketplace](/learn/local-marketplace).
