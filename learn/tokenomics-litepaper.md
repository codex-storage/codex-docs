---
outline: [1, 3]
---
# Codex Tokenomics Litepaper - Versión Testnet

**Codex: Un Protocolo de Almacenamiento Descentralizado para Información Duradera**

# Avisos Legales

*La información contenida en este documento tiene como objetivo ser puesta a disposición únicamente con fines informativos y no constituye un prospecto, ni una oferta de compra, una solicitud o una invitación a comprar, ni una recomendación para ningún token o valor. Ni este documento ni ninguno de sus contenidos deben considerarse como la creación de expectativas o la base de ningún contrato, compromiso u obligación vinculante. Ninguna información aquí contenida debe considerarse como conteniendo o debiendo ser invocada como una promesa, representación, garantía, ya sea expresa o implícita, y ya sea en relación con el pasado, el presente o el futuro en relación con los proyectos y asuntos aquí descritos. La información presentada es un resumen y no pretende ser precisa, fiable o completa. Este documento está bajo revisión legal continua y puede ser modificado o complementado en cualquier momento sin previo aviso. No se asumirá ninguna responsabilidad por la precisión, fiabilidad o integridad de la información contenida en este documento. Debido al alto grado de riesgo e incertidumbre descrito anteriormente, nadie debe depositar una confianza indebida en ningún asunto descrito en este documento. Cualquier token al que se haga referencia en este documento no ha sido registrado bajo ninguna ley de valores y no puede ser ofrecido o vendido en ninguna jurisdicción donde dicha oferta o venta esté prohibida.*

*Este documento puede contener declaraciones prospectivas que se basan únicamente en expectativas, estimaciones, previsiones, suposiciones y proyecciones actuales sobre la tecnología, la industria y los mercados en general. Las declaraciones prospectivas, los proyectos, el contenido y cualquier otro asunto descrito en este documento están sujetos a un alto grado de riesgo e incertidumbre. La hoja de ruta, los resultados, las descripciones de los proyectos, los detalles técnicos, las funcionalidades y otras características están sujetos a cambios basados, entre otras cosas, en las condiciones del mercado, los desarrollos técnicos y el entorno regulatorio. El desarrollo y los resultados reales, incluyendo el orden y el calendario, podrían diferir materialmente de los previstos en estas declaraciones prospectivas.*

*La información contenida en este documento no constituye asesoramiento financiero, legal, fiscal, de inversión, profesional o de otro tipo y no debe ser tratada como tal.*

# Descripción General

## Alcance

Este documento describe los Tokenomics de Codex con elementos que reflejan el despliegue de Testnet del Protocolo Codex.

## Qué Hace Codex

Codex es una plataforma de almacenamiento descentralizada de última generación que ofrece una solución novedosa que mejora las garantías de durabilidad de los datos para almacenar grandes cantidades de datos, eliminando al mismo tiempo cualquier dependencia de instituciones centralizadas que puedan conducir a un único punto de fallo.

Mientras que los sistemas de almacenamiento centralizados como Google Cloud pregonan once nueves de durabilidad, el almacenamiento duradero de archivos en sistemas distribuidos que proporcionan resistencia a la censura y privacidad es un requisito previo vital para casos de uso como la preservación de registros factuales de la historia en los estados de la red.

Aunque ningún sistema puede garantizar una protección absoluta contra la pérdida de datos, a través de su arquitectura técnica, incentivos económicos y codificación algorítmica, Codex está diseñado para proporcionar un almacenamiento de datos altamente descentralizado con alta durabilidad, resistencia a los fallos de la nube y resistencia a la censura.

## Cómo Funciona Codex

Codex opera como una red de nodos de almacenamiento, denominados aquí **Proveedores de Almacenamiento** (SP), que almacenan los datos del usuario durante la duración de un contrato celebrado por los SP y los usuarios de almacenamiento, denominados aquí simplemente **Clientes**.

Los contratos de almacenamiento son iniciados por un **Cliente** que solicita almacenar una cantidad específica de datos, durante una cantidad específica de tiempo, y a un precio específico por la totalidad del contrato. Los **Proveedores de Almacenamiento** se comprometen a espacios para almacenar fragmentos redundantes de estos datos.

El hecho de que los **SPs** deban depositar colateral (stake) para ocupar un espacio ayuda a proteger contra los ataques Sybil, promoviendo la diversidad en los nodos de almacenamiento que cumplen cada contrato. Además, este colateral actúa como un incentivo económico para garantizar que los **SPs** cumplan con sus obligaciones de probar periódicamente que todavía están en posesión de los datos en cuestión.

Esto se logra mediante desafíos periódicos a los **SPs** para proporcionar pruebas criptográficas que demuestren que los datos que han contratado para almacenar pueden ser recuperados. Codex incorpora Zero Knowledge (ZK) y Data Availability Sampling (DAS) para lograr una detección de pérdida de datos de bajo costo, altamente eficiente y fiable.

Los **SPs** están obligados a responder a estos desafíos, enviando sus pruebas a los **Validadores,** quienes verifican la validez de las pruebas y publican en la blockchain sólo la ausencia de una prueba. Esto reduce los costos de validación de las pruebas, sin afectar la seguridad del **Protocolo**.

Si los SPs no prueban un número fijo de veces que todavía tienen los datos en cuestión, o envían una prueba no válida, su colateral se reduce parcialmente. La penalización por slash es un porcentaje fijo del colateral total. Este slashing continúa hasta que se alcanza un cierto número de slashings, momento en el cual todo el colateral se reduce. En este momento, el espacio del SP se considera "abandonado". El colateral reducido se utiliza como incentivo para que un nuevo **SP** se haga cargo del espacio fallido a través del "mecanismo de recuperación de espacios" (discutido más adelante). Esto asegura que el colateral proporcione un incentivo económico para asegurar la durabilidad de los datos.

Codex está por lo tanto diseñado de tal manera que el comportamiento racional para los **SPs** consiste en almacenar los datos de la manera más eficiente en cuanto a espacio para minimizar los costos excesivos de almacenamiento, al tiempo que se equilibra la necesidad de suficiente redundancia para recuperarse de la posibilidad de pérdida/corrupción de datos por la penalización de la pérdida de su colateral (slashing).

Mientras que la tecnología de Codex maximiza la recuperabilidad y la durabilidad en el caso de una pérdida parcial de datos, los incentivos económicos de Codex coordinan a los actores racionales para proporcionar un entorno estable y predecible para los usuarios de almacenamiento de datos. En el corazón de estos incentivos económicos está el token de utilidad Codex (CDX), que sirve como colateral para proteger la durabilidad de los archivos y facilitar la reparación de los espacios, y el medio de pago para coordinar los contratos de almacenamiento exitosos.

# Ciclo de Vida del Contrato

El mercado coordina el emparejamiento de **Clientes** que quieren pagar por almacenar archivos con **Proveedores de Almacenamiento** que ofrecen espacio de almacenamiento y depositan colateral con el fin de obtener pagos por el contrato.

## Inicio de la Solicitud de Contrato

Como principio de diseño, los **Clientes** deben publicar los términos del acuerdo que están buscando, y los Proveedores de Almacenamiento priorizan qué acuerdos cumplen con sus criterios y presentan las mejores ofertas para tomar.

Cuando se crea la solicitud de contrato, el **Cliente** deposita el precio total de la duración del contrato en ese momento. Este depósito actúa como un mecanismo de prevención de spam y asegura que el tiempo y los recursos de **SP** no se desperdicien llenando espacios para acuerdos por los cuales un **Cliente** no completa el pago.

## Los Proveedores de Almacenamiento Llenan las Solicitudes

Antes de emparejarse con contratos de almacenamiento, los **Proveedores de Almacenamiento** especifican sus disponibilidades agregadas para nuevos contratos.

En base a las disponibilidades de cada **SP**, se crea una cola para cada **SP**, clasificando la solicitud de **Cliente** abierta para acuerdos de contrato con los acuerdos más favorables en la parte superior. Con el tiempo, esta cola se resuelve emparejando **SPs** con contratos que son compatibles con sus disponibilidades, comenzando con los acuerdos mejor clasificados primero.

En el lanzamiento, los **SPs** no podrán personalizar el algoritmo de creación de colas, lo que significa que los **SPs** con las mismas disponibilidades tendrán colas idénticas (aparte de las diferencias debidas a una función de aleatoriedad que aumenta la diversidad de **SP** por cada contrato). En el futuro, se espera que los **SPs** puedan personalizar su algoritmo de clasificación de colas.

Si un **SP** coincide con un contrato de almacenamiento y es elegible para reservar un espacio en el contrato, reserva un espacio abierto, descarga los datos del espacio del **Cliente** o de los **SPs** existentes cuyos datos pueden utilizarse para reconstruir el contenido del espacio, crea una prueba de almacenamiento inicial y envía esta prueba, junto con el colateral, al **Protocolo**.

Tenga en cuenta que un espacio no se considera confirmado como llenado hasta después de que un **SP** publique tanto el colateral asociado como produzca una prueba para el espacio.

## El Contrato Caduca Antes de Comenzar

Si todavía hay espacios vacíos cuando el tiempo de espera/vencimiento de la solicitud de contrato expira, el acuerdo se termina.

Los **Proveedores de Almacenamiento** que sí llenaron espacios, si los hay, son compensados por la cantidad de tiempo durante el cual almacenaron los datos del espacio, al precio especificado en las solicitudes de contrato por TB por Mes. El resto del depósito del **Cliente** es devuelto.

Como hay una alta probabilidad de tener al menos algunos espacios ocupados, no debería haber necesidad de más sanciones para el **Cliente** para prevenir solicitudes de spam e incentivar a los **Clientes** a presentar acuerdos atractivos.

## El Contrato Comienza

El contrato comienza si *todos* los espacios están ocupados, es decir, los **SPs** han descargado los datos, publicado el colateral y publicado las pruebas antes de que se alcance el tiempo de espera/vencimiento de la solicitud de contrato.

En este momento, se aplica una *tasa de protocolo* sobre el depósito del usuario. El producto se quema.

El resto del depósito del cliente es retenido por el protocolo y se utilizará para pagar a los **SPs** al final del contrato.

## El Contrato Está en Curso

Los **Proveedores de Almacenamiento** deben enviar pruebas a los **Validadores** de acuerdo con la frecuencia de prueba de la solicitud de almacenamiento, un parámetro establecido por el Cliente en la solicitud.

### Falta de Pruebas

Si un **SP** no envía pruebas dentro de los últimos períodos de tiempo, se le reduce parcialmente. La penalización es un porcentaje fijo del colateral. Tras la presentación de una prueba después de haber sido parcialmente reducido, el SP debe reponer el colateral faltante.

Si el SP es reducido suficientes veces, todo su colateral será reducido y confiscado, y se considera que el SP ha abandonado su espacio. La provisión de una prueba correcta en este momento no revertirá el inicio del mecanismo de recuperación del espacio.

## Un Espacio en el Contrato es Abandonado

Cuando un **SP** no envía suficientes pruebas de tal manera que se le reduce suficientes veces, su espacio se considera abandonado. Con el fin de incentivar a un nuevo **SP** a entrar y hacerse cargo del espacio abandonado (recuperación del espacio), el 50% del colateral confiscado del **SP** que ha abandonado el espacio se utiliza como un incentivo para el nuevo **SP**. El colateral confiscado restante se quema.

Esto ayuda a alinear el incentivo económico para que los **SPs** se hagan cargo de los espacios abandonados antes de llenar nuevos acuerdos, ya que pueden ganar colateral perdido por hacerse cargo y cumplir los espacios abandonados.

## El Contrato Incumple

Si, en cualquier momento durante la vida del contrato de almacenamiento, el número de espacios actualmente en un estado abandonado (aún no recuperado), alcanza o excede el número máximo de espacios de almacenamiento que se pueden perder antes de que los datos sean irrecuperables, entonces todo el acuerdo de almacenamiento se considera que está en un estado *fallido*.

El colateral publicado por cada **Proveedor de Almacenamiento** se quema. Esto incentiva a los **SPs** a no dejar que los acuerdos de almacenamiento corran el riesgo de incumplimiento. Los **SPs** están incentivados a *evitar proactivamente* esto diversificando su infraestructura y los contratos de almacenamiento en los que entran, y *reactivamente* haciendo copias de seguridad de los datos de sus propios espacios, o incluso haciendo copias de seguridad de los datos de otros espacios para que puedan ayudar mejor a la recuperación del espacio, a medida que el acuerdo se acerca a un estado fallido.

Los Clientes también reciben de vuelta cualquier sobrante de su pago original.

## El Contrato Termina Su Duración Completa

Cuando un contrato iniciado alcanza su duración pre-especificada sin haber incumplido previamente, el contrato se completa.

Todo el colateral es devuelto a los **SPs** que actualmente llenan los espacios (tenga en cuenta que, debido a la recuperación de los espacios, estos no son necesariamente los mismos **SPs** que llenaron los espacios al principio del contrato), y todo el pago restante es devuelto al cliente.

Los acuerdos no pueden renovarse o extenderse automáticamente. Si un **Cliente** desea continuar un acuerdo, debe crear una nueva solicitud de contrato de almacenamiento. De lo contrario, los clientes pueden recuperar sus datos.

# CDX Testnet Tokenomics

El token CDX no existe en la Fase Testnet. La descripción a continuación se refiere a la mecánica de un token Testnet y no al CDX en sí, y se denominará *CDX (Token Testnet)* para este propósito.

Para evitar dudas, los *CDX (Token Testnet)* son elementos virtuales sin valor de ningún tipo y no son convertibles a ninguna otra moneda, token o cualquier otra forma de propiedad. Están destinados únicamente a ser utilizados con el fin de habilitar la tokenomía y facilitar los diferentes roles en esta Fase Testnet.

## Roles

El protocolo Codex tiene dos roles principales cumplidos por los participantes de la red.

- **Clientes**: pagan a los Proveedores de Almacenamiento en *CDX (Token Testnet)* para almacenar de forma segura sus datos en la red Codex durante una cantidad de tiempo acordada.
- **Proveedores de Almacenamiento**: publican colateral *CDX (Token Testnet)* para celebrar contratos de almacenamiento con los Clientes a cambio de un pago denominado en *CDX (Token Testnet)*.
- **Validadores**: publican colateral *CDX (Token Testnet)* para validar pruebas de almacenamiento a cambio de un pago denominado en *CDX (Token Testnet)*.

## Utilidad del Token

El *CDX (Token Testnet)* se utiliza tanto como una forma de colateral publicado como un medio de pago para asegurar la red y acceder a sus servicios.

El colateral se utiliza principalmente como un mecanismo de prevención de spam y ataques Sybil, seguro de responsabilidad (por ejemplo, compensación a los Clientes en caso de pérdida catastrófica de datos) y para hacer cumplir el comportamiento racional.

Los pagos son realizados por los Clientes a los Proveedores por los servicios prestados, como el almacenamiento de datos durante un cierto período de tiempo o la recuperación de datos. Esto se implementa a través del contrato Marketplace, que actúa como un depósito en garantía. Los datos en un contrato de almacenamiento se distribuyen en espacios donde cada uno es, idealmente, alojado por un Proveedor de Almacenamiento diferente.

### **Para los Clientes**

- Pagar los costos de almacenamiento y las tarifas en *CDX (Token Testnet)* para almacenar archivos.

### **Para los Proveedores de Almacenamiento**

- Publicar colateral en *CDX (Token Testnet)* al comprometerse con nuevos contratos de almacenamiento. Este colateral se reduce si no cumplen con sus servicios acordados.
- Ganar *CDX (Token Testnet)* del colateral de los Proveedores de Almacenamiento reducidos participando en el mecanismo de recuperación de espacios.
- Ganar *CDX (Token Testnet)* de los Clientes al completar con éxito el servicio de almacenamiento.

### Para los Validadores

- Publicar colateral en *CDX (Token Testnet)* para operar el servicio de validación. Este colateral se reduce si no marcan una prueba como faltante dentro de un período predeterminado.
- Ganar *CDX (Token Testnet)* del colateral de los Proveedores de Almacenamiento reducidos marcando las pruebas como perdidas.

La siguiente figura muestra el flujo del token *CDX (Token Testnet)* dentro del sistema.

![Flujo del token *CDX dentro del sistema](/learn/tokenomics-token-flow.png)

## Mecanismos de Captura y Acumulación de Valor

Codex crea *valor* para los participantes:

- Los clientes pueden beneficiarse del almacenamiento de datos con fuertes garantías de durabilidad;
- Los proveedores de almacenamiento pueden obtener rendimiento de sus recursos o capital de repuesto al proporcionar un servicio.
- Los validadores obtienen pagos por marcar las pruebas como perdidas.

Los clientes necesitan tokens *CDX (Token Testnet)* para solicitar acuerdos de almacenamiento. *CDX (Token Testnet)* captura el valor creado para los Clientes al ser un *Token de Transferencia de Valor* para ellos.

Los proveedores de almacenamiento y los validadores son recompensados con el token *CDX (Token Testnet)* y también lo necesitan como prueba de compromiso con el Protocolo. Se arriesgan a ser reducidos a cambio de recompensas. *CDX (Token Testnet)* captura el valor creado para los Proveedores al ser un *Token de Trabajo* para ellos.

Los siguientes mecanismos describen cómo el valor se acumula en el token *CDX (Token Testnet)*.

### Tarifa de Protocolo sobre los Contratos

Si el contrato se cancela antes de que comience, al monto depositado por el Cliente se le cobra una pequeña penalización y se devuelve, lo que ayuda a prevenir solicitudes de acuerdos de spam de baja calidad.

Si el contrato se inicia con éxito, el protocolo cobra una tarifa por facilitar la transacción. El monto restante se pone a disposición para los pagos a los Proveedores de Almacenamiento.

Las tarifas cobradas se queman en ambos casos. Esto crea una fuerza deflacionaria pequeña pero constante en el suministro del token, que es proporcional a la demanda del producto.

## Comportamiento y Motivaciones

### Clientes

Los clientes tienen el siguiente comportamiento racional:

- Solicitar almacenamiento de la red con una tarifa a tasas de mercado justas
- Proporcionar datos a los nodos de almacenamiento que cumplan con sus criterios

También pueden exhibir el siguiente comportamiento desfavorable, ya sea por motivaciones impulsadas por las ganancias, maliciosas o de censura:

- Solicitar almacenamiento a la red, pero nunca hacer que los datos estén disponibles para ninguno o todos los espacios.
- Solicitar almacenamiento a la red, pero no liberar los datos dentro del período de tiempo requerido para comenzar el contrato con éxito
- Solicitar almacenamiento a la red, pero no liberar los datos a Proveedores específicos
- Atacar a los SP que alojan sus datos para intentar aliviar sus obligaciones de pago al final del contrato.

### **Proveedores de Almacenamiento**

Los proveedores de almacenamiento tienen el siguiente comportamiento racional:

- Comprometerse con espacios de contratos de almacenamiento para ganar una tarifa.
- Proporcionar pruebas de almacenamiento para sus espacios comprometidos para evitar las penalizaciones por reducción del colateral.
- Liberar los datos a cualquiera que los solicite.
- Comprometerse con espacios fallidos de contratos de almacenamiento para mantener la integridad de los datos

También pueden exhibir el siguiente comportamiento desfavorable, ya sea por motivaciones impulsadas por las ganancias, maliciosas o de censura:

- Reservar un espacio de contrato, pero nunca llenarlo (intento de evitar que el contrato comience)
- Dejar de proporcionar pruebas a mitad de la vida útil de un contrato
- Producir pruebas, pero no hacer que los datos estén disponibles para que otros nodos los recuperen

### Validadores

Los validadores tienen el siguiente comportamiento racional:

- Marcar una prueba como perdida para ganar una tarifa
- Rastrear el historial de pruebas perdidas de un **SP**
- Activar el Mecanismo de Recuperación de Espacios cuando un **SP** alcanza el número máximo permitido de pruebas perdidas

También pueden exhibir el siguiente comportamiento desfavorable, ya sea por motivaciones impulsadas por las ganancias, maliciosas o de censura:

- Conspirar con los SP para ignorar las pruebas perdidas
- Observar una prueba perdida, pero no publicarla en la cadena

## Mecanismos de Incentivos

Los siguientes mecanismos ayudan a incentivar el comportamiento esperado de cada rol y a mitigar los desfavorables.

### Los Clientes Proporcionan el Pago Completo por Adelantado

Los clientes deben depositar el monto total en *CDX (Token Testnet)* que cubra la totalidad de la duración del contrato de almacenamiento por adelantado. Esto indica su compromiso de pagar una cierta cantidad por el contrato de almacenamiento, aunque el contrato solo comienza cuando y si todos los espacios de datos son llenados por los Proveedores de Almacenamiento.

### Pago Retrasado a los Proveedores de Almacenamiento

Los proveedores de almacenamiento solo reciben el pago relacionado con la prestación de servicios al final de la duración del contrato.

### Requisito de Colateral

Para llenar un espacio de datos, los Proveedores de Almacenamiento primero deben apostar y comprometer el colateral requerido en forma de *CDX (Token Testnet)* para ese espacio, que luego está sujeto a reducción si no publican una prueba para confirmar el espacio.

Los validadores también necesitan publicar colateral para participar en el servicio de validación.

### Prueba de Almacenamiento

Los contratos solo comienzan cuando todos los espacios de datos están llenos. Los espacios solo se consideran llenos después de que un Proveedor de Almacenamiento haya publicado el colateral y la prueba asociada para su espacio.

Una vez que comienza el contrato, los Proveedores de Almacenamiento proporcionan regularmente una prueba de almacenamiento.

### **Reducción por Pruebas de Almacenamiento Perdidas**

En cualquier momento durante la duración del contrato de almacenamiento, el proveedor de almacenamiento se reduce si no proporciona un cierto número de pruebas de almacenamiento seguidas. Si el SP reanuda la provisión de pruebas de almacenamiento, debe reponer el colateral reducido. La penalización es un porcentaje fijo del colateral total.

### Mecanismo de Recuperación de Espacios

Si un Proveedor de Almacenamiento no envía las pruebas de almacenamiento requeridas cuando se requiere, después de una serie de reducciones, todo su colateral será incautado. Una parte del colateral confiscado se utiliza como incentivo para el nuevo Proveedor de Almacenamiento que recupera y comienza a servir el espacio abandonado. El resto del colateral confiscado en *CDX (Token Testnet)* se quema.

### Reducción del Contrato Incumplido

Si, en cualquier momento durante la duración del contrato de almacenamiento, el número de espacios de datos actualmente abandonados (y aún no recuperados) alcanza o supera el número máximo permitido de espacios perdidos (lo que significa que los datos se vuelven irrecuperables), entonces todo el contrato de almacenamiento se considera *fallido*.

En esta etapa, los colaterales de todos los Proveedores de Almacenamiento que sirven espacios de datos en el contrato se reducen por completo.

### Reembolso al Cliente

Si en cualquier momento durante el contrato, se abandonan suficientes espacios de tal manera que los datos no sean completamente recuperables, los Clientes reciben de vuelta cualquier sobrante de su pago original.

## Ciclo de Vida del Token

### Quema

Los tokens *CDX (Token Testnet)* se queman en estos casos:

- Cuando no se inicia un contrato de acuerdo de almacenamiento, se quema una pequeña parte del pago del Cliente por el acuerdo de almacenamiento. Esto sirve principalmente como un mecanismo para disuadir el spam y garantizar que las solicitudes de acuerdo se envíen a precios apropiados para el mercado del almacenamiento.
- Cuando un contrato de acuerdo de almacenamiento se inicia con éxito, el protocolo aplica una tarifa por facilitar la transacción.
- Siempre que un Proveedor de Almacenamiento pierde una cierta cantidad de pruebas de almacenamiento, se reduce y se quema una parte del colateral.
- Una vez que se resuelve el mecanismo de recuperación de espacios, se quema el resto del colateral del Proveedor de Almacenamiento que abandona.

