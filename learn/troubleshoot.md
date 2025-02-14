---
outline: [2, 3]
---
# Solución de Problemas

¿Estás teniendo problemas para conectar tu nodo Codex a la testnet? Aquí tiene una lista de problemas comunes de conexión de Codex y los pasos para diagnosticarlos y resolverlos. Si sus problemas no se abordan aquí, consulte nuestros problemas abiertos en Github o póngase en contacto a través de nuestro servidor de Discord.

## Algunos conceptos básicos

Probablemente ya haya considerado esto. Pero por si acaso:

1. ¿Está utilizando una VPN? Asegúrese de que esté configurada correctamente para reenviar los puertos correctos y asegúrese de anunciar su nodo por la dirección IP pública donde se le pueda contactar.
2. ¿Está utilizando un firewall u otro software de seguridad? Asegúrese de que esté configurado para permitir las conexiones entrantes a los puertos de descubrimiento y peer-to-peer de Codex.

## Compruebe su dirección de anuncio

Su nodo anuncia su dirección pública a la red, para que otros nodos puedan conectarse a usted. Un problema común es el fallo de conexión debido a direcciones de anuncio incorrectas. Siga estos pasos para comprobar su dirección de anuncio.

1. Vaya a un sitio de cuál-es-mi-ip, o a `ip.codex.storage` y anote la dirección IP.
2. Vaya a la configuración WAN de su router/módem y busque la dirección IP pública.
3. Estas dos direcciones deben coincidir.
4. Si no coinciden, es posible que A) esté detrás de una VPN. En este caso, depende de usted deshabilitar la VPN o asegurarse de que todo el reenvío esté configurado correctamente. o B) Su proveedor de servicios de Internet ha colocado su enlace ascendente detrás de un NAT secundario. Los ISP hacen esto para ahorrar direcciones IP públicas. La dirección asignada a su router/módem no es una dirección de Internet pública "verdadera". Por lo general, este problema puede ser resuelto por su ISP. Póngase en contacto con el servicio de atención al cliente y pídales que le den una dirección pública (a veces también llamada dirección IP dinámica).
5. Llame al punto final debug/info de Codex. Consulte la sección [Usando Codex](/learn/using) para obtener más detalles.
6. En la respuesta JSON, encontrará "announceAddresses".
7. La dirección IP que aparece allí debe coincidir con su IP pública.
8. Si la dirección de anuncio en el JSON es incorrecta, puede ajustarla manualmente cambiando el argumento de la CLI de Codex `--nat` o estableciendo la variable de entorno `CODEX_NAT`. Después de haber cambiado su dirección de anuncio y reiniciado su nodo, espere un tiempo (20-30 minutos) para que la red difunda la dirección actualizada.

Si ha realizado estos pasos y no ha encontrado ningún problema, es probable que su dirección de anuncio no sea el problema.


