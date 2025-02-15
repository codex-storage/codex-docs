# Descripción y Arquitectura

Codex está construyendo un motor de almacenamiento de datos duradero que es completamente descentralizado, proporcionando resistencia a la corrupción y a la censura para aplicaciones web3. Protege inherentemente a los participantes de la red al otorgar a los hosts una negación plausible sobre los datos que almacenan, y a los clientes garantías de durabilidad comprobables (hasta el 99.99%), a la vez manteniendo la eficacia en almacenamiento y ancho de banda.

Estas cuatro características clave se combinan para diferenciar a Codex de los proyectos existentes en el nicho del almacenamiento descentralizado:

*   **Codificación de borrado (Erasure coding):** Proporciona redundancia de datos eficiente, lo que aumenta las garantías de durabilidad de los datos.
*   **Prueba de recuperabilidad basada en ZK (ZK-based proof-of-retrievability):** Para garantizar la durabilidad de los datos de forma ligera.
*   **Mecanismo de reparación perezosa (Lazy repair mechanism):** Para una reconstrucción eficiente de los datos y prevención de la pérdida.
*   **Incentivación:** Para fomentar un comportamiento racional, una participación generalizada en la red y la provisión eficiente de recursos de red finitos.

Descentralización incentivada

Los mecanismos de incentivación son una de las piezas clave que faltan en las redes tradicionales de intercambio de archivos. Codex cree que una estructura de incentivos sólida basada en el mercado garantizará una amplia participación en todos los tipos de nodos que se detallan a continuación.

El desarrollo de una estructura de incentivos adecuada está impulsado por los siguientes objetivos:

*   Oferta y demanda para fomentar un uso óptimo de los recursos de la red.
*   Aumentar la participación permitiendo a los nodos utilizar sus ventajas competitivas para maximizar las ganancias.
*   Prevenir el spam y desalentar la participación maliciosa.

Aunque aún no se ha finalizado, la estructura de incentivos de Codex involucrará un mercado de participantes que desean almacenar datos, y aquellos que proporcionan almacenamiento publicando garantías (collateral), y estos últimos pujando por contratos de almacenamiento abiertos. Esta estructura tiene como objetivo garantizar que los incentivos de los participantes se alineen, lo que resulta en que Codex funcione según lo previsto.

Arquitectura de la red

Codex se compone de múltiples tipos de nodos, cada uno de los cuales desempeña un papel diferente en el funcionamiento de la red. Del mismo modo, las demandas de hardware para cada tipo de nodo varían, lo que permite participar a aquellos que operan dispositivos con recursos restringidos.

Nodos de almacenamiento

Como proveedores de almacenamiento confiables a largo plazo de Codex, los nodos de almacenamiento apuestan garantías (collateral) basadas en la garantía publicada en el lado de la solicitud de los contratos, y en el número de espacios que tiene un contrato. Esto está ligado a la durabilidad exigida por el usuario. El no proporcionar pruebas periódicas de posesión de datos resulta en penalizaciones de "slashing" (recorte de la garantía).

Nodo Agregador

Un método para descargar la codificación de borrado, la generación de pruebas y la agregación de pruebas por parte de un nodo cliente con bajos recursos, actualmente es un Trabajo En Progreso (WIP) y formará parte de la siguiente versión de Codex en el Q2/Q4 del próximo año.

Nodos Cliente

Los nodos cliente realizan solicitudes para que otros nodos almacenen, encuentren y recuperen datos. La mayor parte de la red Codex estará compuesta por nodos Cliente, y estos participantes pueden también funcionar como nodos de caché para compensar el costo de los recursos de red que consumen.

Cuando un nodo se compromete con un contrato de almacenamiento y un usuario carga datos, la red verificará de forma proactiva que el nodo de almacenamiento esté en línea y que los datos sean recuperables. A continuación, se consulta aleatoriamente a los nodos de almacenamiento para que transmitan pruebas de posesión de datos durante un intervalo que se corresponde con la duración del contrato y las "9s" de garantía de recuperabilidad que ofrece el protocolo.

Si el nodo de almacenamiento envía pruebas no válidas o no las proporciona a tiempo, la red expulsa al nodo de almacenamiento del espacio, y el espacio estará disponible para el primer nodo que genere una prueba válida para ese espacio.

Cuando se vuelve a publicar el contrato, parte de la garantía del nodo defectuoso paga las tarifas de ancho de banda del nuevo nodo de almacenamiento. La "codificación de borrado" complementa el esquema de reparación al permitir la reconstrucción de los fragmentos que faltan a partir de los datos de otros espacios dentro del mismo contrato de almacenamiento alojado por nodos de almacenamiento sin fallos.

Arquitectura del Marketplace

El mercado consiste en un contrato inteligente (smart contract) que se implementa "on-chain", y los módulos de compra y venta que forman parte del software del nodo. El módulo de compra es responsable de publicar las solicitudes de almacenamiento en el contrato inteligente. El módulo de venta es su contraparte, que los proveedores de almacenamiento utilizan para determinar qué solicitudes de almacenamiento les interesan.

Contrato Inteligente (Smart Contract)

El contrato inteligente facilita la coincidencia entre los proveedores de almacenamiento y los clientes de almacenamiento. Un cliente de almacenamiento puede solicitar una cierta cantidad de almacenamiento durante una cierta duración. Esta solicitud se publica entonces "on-chain", para que los proveedores de almacenamiento puedan verla y decidir si quieren llenar un espacio en la solicitud.

Los principales parámetros de una solicitud de almacenamiento son:

*   La cantidad de bytes de almacenamiento que se solicita
*   Un identificador de contenido (CID) de los datos que deben almacenarse
*   La duración durante la cual deben almacenarse los datos
*   El número de espacios (basado en los parámetros de codificación de borrado)
*   Una cantidad de tokens a pagar por el almacenamiento

A nivel de protocolo, un cliente de almacenamiento es libre de determinar estos parámetros como mejor le parezca, de modo que pueda elegir un nivel de durabilidad que sea adecuado para los datos, y ajustarse a los precios de almacenamiento cambiantes. Las aplicaciones construidas sobre Codex pueden proporcionar orientación a sus usuarios para elegir los parámetros correctos, de forma análoga a cómo las billeteras de Ethereum ayudan a determinar las tarifas de gas.

El contrato inteligente también comprueba que los proveedores de almacenamiento cumplen sus promesas. Los proveedores de almacenamiento publican garantías (collateral) cuando prometen llenar un espacio de una solicitud de almacenamiento. Se espera que publiquen pruebas de almacenamiento periódicas en el contrato, ya sea directamente o a través de un agregador. Si no lo hacen repetidamente, entonces su garantía puede ser confiscada. Su espacio se concede entonces a otro proveedor de almacenamiento.

El contrato inteligente indica cuándo un determinado proveedor de almacenamiento tiene que proporcionar una prueba de almacenamiento. Esto no se hace en un intervalo de tiempo fijo, sino que se determina estocásticamente para garantizar que no sea posible que un proveedor de almacenamiento prediga cuándo debe proporcionar la siguiente prueba de almacenamiento.

Compra (Purchasing)

El módulo de compra en el software del nodo interactúa con el contrato inteligente en nombre del operador del nodo. Publica las solicitudes de almacenamiento y gestiona cualquier otra interacción que se requiera durante la vida útil de la solicitud. Por ejemplo, cuando una solicitud se cancela porque no hay suficientes proveedores de almacenamiento interesados, el módulo de compra puede retirar los tokens que estaban asociados a la solicitud.

Venta (Sales)

El módulo de venta es la contraparte del módulo de compra. Supervisa el contrato inteligente para ser notificado de las solicitudes de almacenamiento entrantes. Mantiene una lista de las solicitudes más prometedoras que puede cumplir. Favorecerá aquellas solicitudes que tengan una alta recompensa y una baja garantía (collateral). Tan pronto como encuentre una solicitud adecuada, intentará primero reservar y luego llenar un espacio descargando los datos asociados, creando una prueba de almacenamiento y publicándola en el contrato inteligente. A continuación, seguirá supervisando el contrato inteligente para proporcionarle pruebas de almacenamiento cuando sean necesarias.

El módulo de venta contiene una estrategia de "mejor esfuerzo" (best effort) para determinar qué solicitudes de almacenamiento le interesan. Con el tiempo, esperamos que surjan estrategias más especializadas para satisfacer las necesidades de, por ejemplo, grandes proveedores frente a proveedores que ejecutan un nodo desde su casa.

### Libro Blanco ###

Leer [Codex whitepaper](/learn/whitepaper)
