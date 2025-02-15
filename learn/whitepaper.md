<center>
    
**Resumen** 
</center>
  
<div style="display: flex; justify-content: center; align-items: center;">
<div style="text-align: justify; width: 80%">
Internet se está volviendo cada vez más centralizado. A medida que las empresas y los individuos dependen cada vez más de los proveedores de nube centralizados para el almacenamiento, las preocupaciones críticas sobre la privacidad, la censura y el control del usuario, así como sobre la concentración del poder económico en manos de unas pocas entidades, se vuelven más pronunciadas.

Si bien ha habido varios intentos de proporcionar alternativas, las redes de almacenamiento descentralizadas (DSN) modernas a menudo no cumplen con aspectos básicos, como tener sólidas garantías de durabilidad, ser eficientes para operar o proporcionar pruebas escalables de almacenamiento. Esto, a su vez, conduce a soluciones que son: i) no útiles, ya que pueden perder datos; ii) no amigables con la descentralización, ya que requieren hardware especializado o costoso; o iii) económicamente inviables, ya que sobrecargan a los proveedores con demasiados costos más allá de los del hardware de almacenamiento en sí.

En este artículo, presentamos Codex, una novedosa Red de Almacenamiento Descentralizada con Codificación de Borrado que intenta abordar esos problemas. Codex aprovecha la codificación de borrado como parte tanto de la redundancia como de las pruebas de almacenamiento, combinándola con pruebas de conocimiento cero y reparación diferida para lograr garantías de durabilidad ajustables, al tiempo que es modesta en cuanto a los requisitos de hardware y energía. Un concepto central de Codex es el Motor de Durabilidad Descentralizado (DDE), un marco que formalizamos para abordar sistemáticamente la redundancia de datos, la auditoría remota, la reparación, los incentivos y la dispersión de datos en los sistemas de almacenamiento descentralizados.

Describimos la arquitectura y los mecanismos de Codex, incluido su mercado y sus sistemas de prueba, y proporcionamos un análisis preliminar de la confiabilidad utilizando un modelo de Cadena de Markov de Tiempo Continuo (CTMC) para evaluar las garantías de durabilidad. Codex representa un paso hacia la creación de una capa de almacenamiento descentralizada, resiliente y económicamente viable que es fundamental para el ecosistema descentralizado más amplio.
</div>
</div>

## 1. Introducción
La producción de datos ha estado creciendo a un ritmo asombroso, con importantes implicaciones. Los datos son un activo crítico para las empresas, impulsando la toma de decisiones, la planificación estratégica y la innovación. Los individuos entrelazan cada vez más sus vidas físicas con el mundo digital, documentando meticulosamente cada aspecto de sus vidas, tomando fotos y videos, compartiendo sus puntos de vista y perspectivas sobre los acontecimientos actuales, utilizando medios digitales para la comunicación y la expresión artística, etc. Las identidades digitales se han vuelto tan importantes como sus contrapartes físicas, y esta tendencia solo está aumentando.

Sin embargo, la tendencia actual hacia la centralización en la web ha llevado a una situación en la que los usuarios tienen poco o ningún control sobre sus datos personales y cómo se utilizan. Las grandes corporaciones recopilan, analizan y monetizan los datos de los usuarios, a menudo sin consentimiento ni transparencia. Esta falta de privacidad deja a las personas vulnerables a la publicidad dirigida, la creación de perfiles, la vigilancia y el posible uso indebido de su información personal.

Además, la concentración de datos y poder en manos de unas pocas entidades centralizadas crea un riesgo significativo de censura: las plataformas pueden decidir unilateralmente eliminar, modificar o suprimir contenido que consideren indeseable, limitando efectivamente la libertad de expresión y el acceso a la información de los usuarios. Este desequilibrio de poder socava la naturaleza abierta y democrática de Internet, creando cámaras de eco y restringiendo el libre flujo de ideas.

Otro aspecto indeseable de la centralización es económico: a medida que el dominio de las grandes empresas tecnológicas en este espacio evoluciona hacia un oligopolio, todos los ingresos fluyen hacia las manos de unos pocos seleccionados, mientras que la barrera de entrada se vuelve cada vez más alta..

Para abordar estos problemas, existe una necesidad creciente de tecnologías descentralizadas. Las tecnologías descentralizadas permiten a los usuarios: i) poseer y controlar sus datos al proporcionar mecanismos seguros y transparentes para el almacenamiento y el intercambio de datos, y ii) participar en la economía del almacenamiento como proveedores, permitiendo a los individuos y organizaciones tomar su parte de los ingresos. Los usuarios pueden optar por compartir selectivamente sus datos con terceros de confianza, conservar la capacidad de revocar el acceso cuando sea necesario y monetizar sus datos y su hardware si así lo desean. Este cambio de paradigma hacia la propiedad de datos e infraestructura centrada en el usuario tiene el potencial de crear un ecosistema digital más equitativo y transparente.

A pesar de sus beneficios potenciales, sin embargo, la falta de almacenamiento descentralizado eficiente y confiable deja una brecha clave que debe abordarse antes de que se pueda contemplar seriamente cualquier noción de una pila de tecnología descentralizada.

En respuesta a estos desafíos, presentamos Codex: una novedosa Red de Almacenamiento Descentralizada con Codificación de Borrado que se basa en la codificación de borrado para la redundancia y las pruebas eficientes de almacenamiento. Este método proporciona una confiabilidad sin igual y permite el almacenamiento de grandes conjuntos de datos, más grandes que cualquier nodo individual en la red, de una manera duradera y segura. Nuestras pruebas de almacenamiento compactas y eficientes pueden detectar y prevenir la pérdida catastrófica de datos con gran precisión, al tiempo que incurren en requisitos de hardware y electricidad relativamente modestos – dos condiciones previas para lograr una verdadera descentralización. Además, introducimos y formalizamos en este artículo la noción de durabilidad en las redes de almacenamiento descentralizadas a través de un nuevo concepto que llamamos el Motor de Durabilidad Descentralizado (DDE).

El resto de este artículo está organizado de la siguiente manera. Primero, discutimos el contexto en el que se construye Codex (Sec. 2) mediante la ampliación de los problemas de almacenamiento en la nube centralizado, y proporcionando información básica sobre los enfoques previos a las alternativas descentralizadas - en concreto, las redes p2p, blockchains, y DSNs. Luego, introducimos el marco conceptual que sustenta Codex en la Sec. 3 - el Motor de Durabilidad Descentralizado (DDE) - seguido de una descripción más detallada de los mecanismos detrás de Codex y cómo se materializa como un DDE en la Sec. 4. Sec. 5, a continuación, presenta un análisis de fiabilidad preliminar, que sitúa los parámetros de almacenamiento de Codex junto con mayores garantías de durabilidad formales. Finalmente, la Sec. 6 proporciona las conclusiones y el trabajo en curso.

## 2. Antecedentes y Contexto

Codex pretende ser una alternativa útil y descentralizada para el almacenamiento centralizado. En esta sección, se analiza el contexto en el que surge esta necesidad, así como por qué los enfoques anteriores y actuales para la construcción y el razonamiento sobre el almacenamiento descentralizado resultaron incompletos. Esto sentará las bases para nuestra introducción del Motor de Durabilidad Descentralizado - nuestro enfoque para el razonamiento sobre el almacenamiento descentralizado - en la Sec. 3.

### 2.1. Almacenamiento en la Nube Centralizado
Durante las últimas dos décadas, el almacenamiento en la nube centralizado se ha convertido en el enfoque de facto para los servicios de almacenamiento en Internet, tanto para particulares como para empresas. De hecho, una investigación reciente sitúa el porcentaje de empresas que dependen de al menos un proveedor de servicios en la nube en el $94%$ [^zippia_cloud_report], mientras que la mayoría de los smartphones modernos realizan copias de seguridad de sus contenidos en un proveedor de almacenamiento en la nube de forma predeterminada.

El atractivo es claro: escalable, fácil de utilizar el almacenamiento elástico y la conexión en red junto con un modelo flexible de pago por uso y un fuerte enfoque en la durabilidad [^s3_reinvent_19] que se traduce en una infraestructura fiable que está disponible de inmediato y en la escala exacta requerida.

La centralización, sin embargo, conlleva una larga lista de inconvenientes, la mayoría de ellos debidos a tener un único actor en el control de todo el sistema. Esto coloca efectivamente a los usuarios a merced de los intereses comerciales del actor controlador, que puede que no coincidan con los intereses del usuario respecto a la forma en que se utilizan sus datos, así como su capacidad para permanecer a flote frente a la adversidad natural, política o económica. La intervención del gobierno y la censura son también importantes fuentes de preocupación [^liu_19]. Las organizaciones más grandes son muy conscientes de estos riesgos, con un $98%$ de los usuarios empresariales de la nube que adoptan entornos multi-nube para mitigarlos [^multicloud].

El último inconveniente es económico: ya que muy pocas empresas pueden proveer actualmente estos servicios a la escala y la calidad necesarias, los miles de millones de gasto de los clientes se canalizan a los bolsillos de un puñado de individuos. Oligopolios como estos pueden descarrilar a un mercado no competitivo que encuentra su equilibrio en un punto de precio que no está necesariamente en el mejor interés de los usuarios finales [^feng_14].

### 2.2. Alternativas Descentralizadas: Pasado y Presente

Teniendo en cuenta los inconvenientes del almacenamiento centralizado en la nube, es natural preguntarse si podría haber alternativas; y, de hecho, estos han sido investigados ampliamente desde principios de la década de 2000. No vamos a intentar cubrir todo ese espacio aquí, y en su lugar nos centraremos en lo que consideramos que son los tres principales avances tecnológicos que se produjeron en los sistemas descentralizados en estas últimas dos décadas, y por qué no han logrado avances significativos hasta el momento: Redes P2P, blockchains, y Redes de Almacenamiento de Datos (DSNs).

**Redes P2P.** Las redes P2P han existido durante más de dos décadas. Su premisa es que los usuarios pueden ejecutar software cliente en sus propias máquinas y formar una red autoorganizada que permite compartir recursos como ancho de banda, computación y almacenamiento para proporcionar servicios de nivel superior como búsqueda o intercambio de archivos descentralizado sin la necesidad de un actor controlador centralizado.

Las primeras redes como BitTorrent[^cohen_01], sin embargo, solo tenían incentivos rudimentarios basados en una forma de economía de trueque en la que los nodos que proporcionaban bloques a otros nodos serían recompensados con acceso a más bloques. Esto proporciona algunos incentivos básicos para que los nodos intercambien los datos que poseen, pero si un nodo decide o no mantener una determinada pieza de datos depende de si el operador del nodo estaba interesado en esos datos para empezar; es decir, un nodo probablemente no descargará una película si no está interesado en verla. 

Por lo tanto, los archivos que no son populares tienden a desaparecer de la red, ya que nadie está interesado en ellos, y no hay forma de incentivar a los nodos para que hagan lo contrario. Esta falta de incluso garantías básicas de durabilidad significa que BitTorrent y, de hecho, la mayoría de las primeras redes de intercambio de archivos P2P, son adecuadas como redes de distribución en el mejor de los casos, pero no como redes de almacenamiento, ya que los datos pueden, y probablemente lo harán, perderse eventualmente. Incluso los intentos más recientes de intercambio de archivos descentralizado como IPFS[^ipfs_website] sufren de deficiencias similares: por defecto, IPFS no ofrece garantías de durabilidad, es decir, no hay forma de castigar a un servicio de pinning si no mantiene los datos disponibles.

**Blockchains.** Las blockchains se introdujeron como parte de Bitcoin en 2008[^nakamoto_08], y el siguiente actor principal, Ethereum[^buterin_13], entró en funcionamiento en 2013. Una blockchain consta de una serie de bloques, cada uno de los cuales contiene una lista de transacciones. Estos bloques están vinculados entre sí en orden cronológico a través de hashes criptográficos. Cada bloque contiene un hash del bloque anterior, lo que asegura la cadena contra la manipulación. Esta estructura asegura que una vez que se agrega un bloque a la blockchain, la información que contiene no se puede alterar sin rehacer todos los bloques subsiguientes, lo que la hace segura contra el fraude y las revisiones. Para todos los propósitos prácticos, una vez que se agrega un bloque, ya no se puede eliminar.

Esta permanencia aliada a la naturaleza totalmente replicada de la blockchain significa que proporciona garantías de durabilidad y disponibilidad muy sólidas, y esto se ha reconocido desde muy temprano. El modelo de replicación completa de las blockchains, sin embargo, también resulta ser lo que las hace poco prácticas para el almacenamiento de datos: en la fecha de esta redacción, almacenar tan solo un gigabyte de datos en una cadena como Ethereum sigue siendo prohibitivamente caro[^kostamis_24].

Las blockchains representan, sin embargo, una adición revolucionaria a los sistemas descentralizados, ya que permiten a los diseñadores de sistemas construir mecanismos de incentivos mucho más sólidos y complejos basados en economías monetarias, e implementar mecanismos clave como la seguridad criptoeconómica[^chaudhry_24] a través del slashing, que simplemente no eran posibles antes.

**Redes de Almacenamiento Descentralizadas (DSNs).** Las Redes de Almacenamiento Descentralizadas (DSNs) representan un paso natural en el almacenamiento descentralizado: al combinar la tecnología P2P tradicional con los sólidos mecanismos de incentivos que ofrecen las blockchains modernas y las nuevas primitivas criptográficas, proporcionan una visión mucho más creíble del almacenamiento descentralizado.

Al igual que las primeras redes P2P, las DSN consolidan las capacidades de almacenamiento de varios proveedores independientes y orquestan los servicios de almacenamiento y recuperación de datos para los clientes. A diferencia de las primeras redes P2P, sin embargo, las DSN emplean los mecanismos mucho más sólidos que ofrecen las blockchains para incentivar el funcionamiento correcto. Normalmente emplean técnicas de auditoría remota como pruebas de conocimiento cero para responsabilizar a los participantes, junto con mecanismos de staking/slashing que infligen pérdidas monetarias a los participantes malos cuando son atrapados.

En su artículo seminal[^protocol_17], el equipo de Filecoin caracteriza una DSN como una tupla $\Pi = \left(\text{Put}, \text{Get}, \text{Manage}\right)$, donde:

* $\text{Put(data)} \rightarrow \text{key}$: Los clientes ejecutan el protocolo Put para almacenar datos bajo una clave identificadora única.
* $\text{Get(key)} \rightarrow \text{data}$: Los clientes ejecutan el protocolo Get para recuperar los datos que están almacenados actualmente utilizando la clave.
* $\text{Manage()}$: La red de participantes se coordina a través del protocolo Manage para: controlar el almacenamiento disponible, auditar el servicio ofrecido por los proveedores y reparar posibles fallas. El protocolo Manage es ejecutado por los proveedores de almacenamiento, a menudo en conjunto con los clientes o una red de auditores.

Si bien es útil, argumentamos que esta definición es incompleta, ya que traslada una serie de elementos clave a un protocolo/primitiva de caja negra no especificada llamada $\text{Manage}()$. Estos incluyen:


* mecanismos de incentivos y slashing;
* protocolos de auditoría remota y reparación;
* estrategias para la redundancia y dispersión de datos.

Tales elementos son de particular importancia cuando uno intenta razonar sobre lo que se requeriría para construir una DSN que proporcione utilidad real. Al comenzar a diseñar Codex y hacernos esa pregunta, descubrimos que la clave para las DSN útiles está en la durabilidad; es decir, un sistema de almacenamiento sólo es útil si puede proporcionar garantías de durabilidad que se puedan razonar.

En la siguiente sección, exploramos una construcción que llamamos Decentralized Durability Engines (Motores de Durabilidad Descentralizados), que, argumentamos, conducen a un enfoque más fundamentado para diseñar sistemas de almacenamiento que proporcionen utilidad.
    
## 3. Motores de Durabilidad Descentralizados (DDE)
    
Un Motor de Durabilidad Descentralizado es una tupla $\Gamma = \text{(R, A, P, I, D)}$ donde:

* $R$ es un conjunto de mecanismos de redundancia, como la codificación de borrado y la replicación, que garantizan la disponibilidad de los datos y la tolerancia a fallos.
* $A$ es un conjunto de protocolos de auditoría remota que verifican la integridad y la disponibilidad de los datos almacenados.
* $P$ es un conjunto de mecanismos de reparación que mantienen el nivel deseado de redundancia y la integridad de los datos mediante la detección y corrección de la corrupción y la pérdida de datos.
* $I$ es un conjunto de mecanismos de incentivos que alientan a los nodos a comportarse de manera honesta y fiable, recompensando el buen comportamiento y penalizando las acciones maliciosas o negligentes.
* $D$ es un conjunto de algoritmos de dispersión de datos que distribuyen estratégicamente los fragmentos de datos en múltiples nodos para minimizar el riesgo de pérdida de datos debido a fallos localizados y para mejorar la disponibilidad y la accesibilidad de los datos.

Argumentamos que, al diseñar un sistema de almacenamiento que pueda conservar los datos, ninguno de estos elementos es opcional. Los datos deben ser redundantes ($R$), debe haber una manera de detectar fallos y comportamientos indebidos ($A$), debemos ser capaces de reparar los datos para que no se pierdan debido a la acumulación de fallos ($P$), los nodos que se comportan mal deben ser penalizados ($I$) y los datos deben colocarse de manera que se comprenda la correlación de fallos ($D$).

Este es un tratamiento un tanto informal por ahora, pero los parámetros reales que se ingresarían en cualquier análisis de fiabilidad de un sistema de almacenamiento dependerían de esas elecciones. En una publicación futura, exploraremos cómo la elección de cada uno de estos elementos afecta la durabilidad en un marco formal.

## 4. Codex: Un Motor de Durabilidad Descentralizado

Esta sección describe cómo funciona realmente Codex. La motivación principal detrás de Codex es proporcionar una solución de almacenamiento descentralizada escalable y robusta que aborde las limitaciones de las DSN existentes. Esto incluye: i) garantías de durabilidad mejoradas que se pueden razonar, ii) escalabilidad y rendimiento y iii) descentralización y resistencia a la censura.

Comenzamos esta sección exponiendo los conceptos clave necesarios para comprender cómo funciona Codex (Sec. 4.1). Luego, analizamos la redundancia ($R$), la auditoría remota ($A$) y los mecanismos de reparación ($P$) de Codex y cómo combinan los códigos de borrado y las pruebas de conocimiento cero en un sistema que es ligero, eficiente y susceptible a la descentralización. La Sec. 4.4 se desvía hacia la capa de red y proporciona una visión general de nuestros protocolos escalables de transferencia de datos. Finalmente, los incentivos ($I$) y la dispersión ($D$) se discuten en la Sec. 4.5 como parte del mercado de Codex.

### 4.1. Conceptos

En el contexto de Codex (y de los sistemas de almacenamiento en general), dos propiedades aparecen como fundamentales:

Disponibilidad. Se dice que un sistema está disponible cuando es capaz de proporcionar el servicio previsto, y no disponible en caso contrario. La disponibilidad de un sistema durante un intervalo de tiempo dado viene dada por [^tanembaum]:

$$
p_\text{avail} =\frac{t_a}{t_a + t_u}
$$

donde $t_a$ y $t_u$ son los tiempos totales en los que el sistema permaneció disponible y no disponible, respectivamente. Para mantener una alta disponibilidad, un sistema de almacenamiento necesita ser tolerante a fallos; es decir, debería ser capaz de atender correctamente las solicitudes de almacenamiento y recuperación en presencia de fallos de hardware y participantes maliciosos.

**Durabilidad.** Cuantificada como una probabilidad $p_\text{dur} = 1 - p_\text{loss}$ de que una unidad de datos dada no se pierda durante un período de tiempo dado; por ejemplo, la probabilidad de que algún archivo no se pierda en un período de 1 año. Esta probabilidad a veces se expresa como un porcentaje (por ejemplo, en S3).

Si este número es muy cercano a uno, por ejemplo, $p_\text{loss} \leq 10^{-6}$, entonces se dice que el sistema es altamente duradero. Los sistemas que no son altamente duraderos son aquellos que pueden perder datos con una probabilidad mayor o ilimitada, o que no cuantifican en absoluto sus probabilidades de pérdida.

Idealmente, nos gustaría que los sistemas de almacenamiento fueran altamente disponibles y altamente duraderos. Dado que lograr la disponibilidad demostrable no es posible en general[^bassam_18], Codex se centra en garantías más sólidas para la durabilidad y en incentivar la disponibilidad en su lugar.

**Conjunto de datos.** Un conjunto de datos $D = {c_1, \cdots c_b}$ se define en Codex como un conjunto ordenado de $b \in \mathbb{N}$ bloques de tamaño fijo. Los bloques suelen ser pequeños, del orden de $64\text{kB}$. A todos los efectos, se puede pensar en un conjunto de datos como un archivo normal.

**Cliente de almacenamiento (SC).**  Un cliente de almacenamiento es un nodo que participa en la red Codex para comprar almacenamiento. Estos pueden ser individuos que buscan hacer una copia de seguridad del contenido de sus discos duros, u organizaciones que buscan almacenar datos comerciales.

**Proveedor de almacenamiento (SP).** Un proveedor de almacenamiento es un nodo que participa en Codex vendiendo espacio en disco a otros nodos.

### 4.2. Visión general

A un alto nivel, el almacenamiento de datos en Codex funciona de la siguiente manera. Siempre que un SC desea almacenar un conjunto de datos $D$ en Codex, este:

1. divide $D$ en $k$ particiones disjuntas ${S_1, \cdots, S_k}$ denominadas slots, donde cada slot contiene $s = \left\lceil \frac{b}{k} \right\rceil$ bloques;
2. codifica con borrado $D$ con un código Reed-Solomon[^reed_60] extendiéndolo a un nuevo conjunto de datos $D_e$ que añade un extra de $m \times s$ bloques de paridad a $D$ (Sec. 4.3). Esto añade efectivamente $m$ nuevos slots al conjunto de datos. Como utilizamos un código sistemático, $D$ sigue siendo un prefijo de $D_e$;
3. calcula dos raíces de árbol Merkle diferentes: una utilizada para las pruebas de inclusión durante el intercambio de datos, basada en SHA256, y otra para las pruebas de almacenamiento, basada en Poseidon2 (Sec 4.3);
4. genera un manifiesto direccionable por contenido para $D_e$ y lo anuncia en el Codex DHT (Sec. 4.4);
5. publica una solicitud de almacenamiento que contiene un conjunto de parámetros en el mercado de Codex (en la cadena), que incluye cosas como cuánto está dispuesto a pagar el SC por el almacenamiento, así como las expectativas que pueden afectar la rentabilidad de los SP candidatos y las garantías de durabilidad para $D_e$, para cada slot (Sec. 4.5).

El mercado de Codex (Sec. 4.5) luego asegura que los SP dispuestos a almacenar datos para una solicitud de almacenamiento determinada tengan una oportunidad justa de hacerlo. Eventualmente, para cada slot $S_i \in D_e$, algún SP:

1. declara su interés en él presentando una reserva de slot;
2. descarga los datos para el slot desde el SC;
3. proporciona una prueba inicial de almacenamiento y alguna garantía de staking para ello.

Una vez que este proceso se completa, decimos que el slot $S_i$ ha sido completado. Una vez que todos los slots en $D_e$ han sido completados, decimos que $D_e$ ha sido cumplido. Para el resto de esta sección, profundizaremos en la arquitectura y los mecanismos de Codex explicando con más detalle cada aspecto del flujo de almacenamiento.

### 4.3. Codificación de Borrado, Reparación y Pruebas de Almacenamiento

a codificación de borrado desempeña dos funciones principales en Codex: i) permitir que los datos se recuperen tras la pérdida de uno o más SP y los slots que poseen (redundancia) y ii) permitir pruebas de almacenamiento rentables. Revisaremos cada uno de estos aspectos por separado.
    
**Codificación de Borrado para la Redundancia.**  Como se describió antes, un conjunto de datos $D$ se divide inicialmente en $k$ slots de tamaño $s = \left\lceil \frac{b}{k} \right\rceil$ (Figura 1). Dado que $b$ puede no ser realmente divisible por $k$, Codex añadirá bloques de relleno según sea necesario para que el número de bloques en $D$ sea $b_p = s \times k$.

<center>
    <img src="/learn/whitepaper/dataset-and-blocks.png" width=80%/>
</center>

**Figura 1.** Un conjunto de datos rellenado $D$ dividido en $k$ slots.
    
odex luego codifica con borrado $D$ entrelazando bloques tomados de cada slot (Figura 2), uno a la vez. El procedimiento ejecuta $s$ pasos de entrelazado, donde $s$ es el número de bloques en un slot. 

<center>
    <img src="/learn/whitepaper/ec-dataset-and-blocks.png" width=80%/>
</center>

**Figura 2.** Conjunto de datos codificado con borrado $D_e$ con $k + m$ slots y proceso de entrelazado.
    
En cada paso de entrelazado, recogemos $k$ bloques seleccionando el bloque $i^{th}$ dentro de cada uno de los $k$ slots ($1 \leq i \leq s$), y los alimentamos a través del codificador Reed-Solomon. El codificador luego genera $m$ bloques de paridad, que se añaden como el bloque $i^{th}$ de $m$ nuevos slots de paridad distintos. Dado que los slots tienen $s$ bloques cada uno, al final de este proceso, nos quedan $m$ slots de paridad de $s$ bloques cada uno, o $m \times s$ nuevos bloques de paridad.
    
l mercado de Codex (Sec. 4.5) luego emplea mecanismos para asegurar que cada uno de estos slots se asignen a un nodo diferente para que las probabilidades de fallo para cada slot estén descorrelacionadas. Esto es importante ya que, volviendo a las garantías de durabilidad, asumiendo que pudiéramos conocer la probabilidad $p_{\text{loss}}$ con la que un SP dado podría fallar durante un período de un año, esto limitaría la probabilidad de pérdida de datos en $p_{\text{loss}} \leq \binom{k + m}{k} p_{\text{loss}}^k(1 - p_{\text{loss}})^{m}$. Decimos que esto es un límite porque en la práctica la reparación se activaría antes, por lo que la probabilidad de pérdida es en realidad mucho menor que esta. Llevaremos a cabo un análisis más detallado teniendo en cuenta esos aspectos en la Sec. 5.
     
**Codificación de Borrado para Pruebas de Almacenamiento.** La otra forma, menos obvia, en la que Codex emplea la codificación de borrado es localmente en cada SP al generar pruebas de almacenamiento. Esto permite a Codex ser expeditivo en la detección de la pérdida de datos, tanto no intencional como maliciosa, con un alto nivel de precisión.

Para entender cómo funciona esto, imagine que tenemos un SP que ha prometido almacenar algún slot $S_i \in D_e$ hasta un cierto instante de tiempo $t_b$. ¿Cómo nos aseguramos de que el SP está realmente cumpliendo su promesa? Una forma de abordar esto sería que un verificador descargue el slot completo $S_i$ desde el SP en instantes aleatorios en el tiempo. Esto aseguraría que los datos todavía están allí, pero sería costoso.

Un enfoque más inteligente sería mediante muestreo: en lugar de descargar el archivo completo, el verificador puede pedir un subconjunto aleatorio de los bloques en el archivo y sus pruebas de inclusión Merkle. Si bien esto también funciona, el problema aquí es que la probabilidad de detectar bloques perdidos se ve directamente afectada por qué fracción de bloques $l_i$ se han perdido: si pedimos al SP $j$ muestras, entonces la probabilidad de que detectemos un bloque faltante es $p_{\text{detect}} = 1 - (1 - l_i)^j$.

Aunque la decadencia es siempre geométrica, el impacto de tener una fracción de pérdida que es baja (por ejemplo, menos del $1%$) puede ser significativo: como se representa en la Figura 3, para $l_i = 0.01$ obtenemos un $p_{\text{detect}}$ que es menor que $0.5$ incluso después de extraer $50$ muestras. Si eso no suena tan mal, considere un entorno adversarial en el que un SP deliberadamente descarta una fracción muy pequeña de un archivo grande, quizás un solo bloque de un millón. Para fracciones tan pequeñas ($10^{-6}$), se requerirían cientos de miles de muestras para obtener probabilidades de detección razonables, por ejemplo, $p_{\text{detect}} > 0.99$.
    
<center>
    <img src="/learn/whitepaper/p-detect-plot.png"/>
</center>
    
**Figura 3.** Número de muestras $j$ requeridas por un verificador para afirmar la pérdida de datos ($p_{\text{detect}}$) para varias fracciones de pérdida ($l_i$).

La razón por la que es difícil detectar la pérdida es porque estamos intentando encontrar el quizás único bloque que falta de $b$ bloques mediante muestreo aleatorio. La codificación de borrado cambia completamente esa dinámica en el sentido de que cualquier $k$ de $b$ bloques es suficiente para recuperar los datos, de modo que sólo importan las fracciones de pérdida que son mayores que $k/b$, ya que cualquier fracción menor puede ser compensada por el código de borrado.
    
Si requerimos que los SP codifiquen localmente los slots con una tasa de código [^wikipedia_code_rate] que sea superior a 0.5, de modo que un conjunto de datos con $b$ bloques se expanda a $2b$ y cualquier $b$ bloques de esos sean suficientes para recuperar los datos, esto significa que los datos sólo se perderán si se descarta más de la mitad de los bloques, es decir, cuando $l_i \geq 0.5$. De la Figura 3, podemos ver que en este caso nos acercamos a $p_{\text{detect}} = 1$ con un número muy pequeño de muestras: de hecho, con sólo mirar 10 muestras, ya obtenemos $p_{\text{detect}} > 0.99$. La implementación real en Codex toma prestado mucho de estas ideas, aunque requiere que los SP utilicen una estructura de codificación bidimensional algo más intrincada por otras razones técnicas[^spanbroek_23].
    
El paso final para las pruebas de Codex es que necesitan ser verificables públicamente. El mecanismo de prueba real en Codex construye una prueba Groth16[^groth_16] para que pueda ser verificada on-chain; es decir, los verificadores son los propios nodos de la blockchain pública. Por tanto, la implementación tiene tanto un componente on-chain, que contiene la lógica para determinar cuándo se requieren las pruebas y cuándo están vencidas, como un componente off-chain, que se ejecuta periódicamente para activar aquellas en los instantes correctos.

El Algoritmo 1 muestra, en pseudocódigo de Python, el bucle de prueba que los SP deben ejecutar para cada slot $S_i$ que completen. Comienza esperando un límite de período (línea 7), que es un segmento de tiempo fijo que es mayor que el tiempo promedio entre bloques consecutivos en la blockchain de destino; es decir, el bucle en las líneas 6 -- 15 se ejecuta como máximo una vez por bloque.
    
A continuación, pregunta al contrato on-chain si se requiere una prueba para este período (línea 8). El contrato ejecutará entonces el Algoritmo 2 (on-chain), que comprueba si el blockhash actual módulo un parámetro `frequency` (líneas 3) es igual a cero. Dado que los valores hash son aproximadamente aleatorios, esa condición resultará ser verdadera, en promedio, en cada `frequency` bloques.
    
Volviendo al Algoritmo 1, si resulta que se requiere una prueba para el período actual, el SP recuperará entonces un valor aleatorio del contrato (línea 9), que también se deriva del blockhash actual.
    

```python=
async def proving_loop(
    dataset_root: Poseidon2Hash,
    slot_root: Poseidon2Hash,
    contract: StorageContract, 
    slot_index: int):
  while True:
    await contract.next_period()
    if contract.is_proof_required():
      randomness = contract.get_randomness()
      merkle_proofs = compute_merkle_proofs(slot_root, randomness)
      post(
        zk_proof(
          public = [randomness, dataset_root, slot_index],
          private = [slot_root, merkle_proofs]
        ))
```
**Algoritmo 1.**  Bucle de prueba de Codex (ejecutado en SPs, off-chain).

Luego, utiliza esta aleatoriedad para determinar los índices de los bloques dentro del slot codificado con borrado localmente para los que necesita proporcionar pruebas, y calcula las pruebas de inclusión Merkle para cada uno (línea $10$). La prueba de conocimiento cero se construye entonces ejecutando una verificación de esas pruebas de inclusión contra la raíz del conjunto de datos en un zk-SNARK, en el que la aleatoriedad, la raíz (Merkle) del conjunto de datos y el índice del slot se toman como entradas públicas, y las pruebas de inclusión y la raíz (Merkle) del slot son privadas en su lugar (líneas $12$ - $15$). Una vez que se calcula la prueba, se publica on-chain (línea $11$), donde se verifica.

```python=
def is_proof_required()
  randomness = block.blockhash()
  return randomness % frequency == 0:
```
**Algoritmo 2.** Comprobación de si se requiere una prueba (ejecutado en el contrato inteligente, on-chain).
    
Los árboles Merkle para la verificación de pruebas se construyen utilizando hashes $\text{Poseidon2}$[^grassi_23], ya que son más eficientes de calcular dentro de circuitos aritméticos que, por ejemplo, SHA256, aunque esto puede cambiar a medida que evolucionemos el sistema de pruebas.

**Reparación.** Los mecanismos de redundancia y prueba descritos hasta ahora permiten a Codex reparar los datos de una manera relativamente sencilla: las pruebas faltantes señalan los slots perdidos y se utilizan como detectores de fallos. Siempre que se pierde una cantidad umbral de slots, se activa un proceso de reparación perezoso en el que los slots perdidos se ponen a la venta de nuevo. Entonces se permite a los proveedores completar esos slots de nuevo, pero, en lugar de descargar el slot en sí, descargan suficientes bloques de otros nodos para poder reconstruir el slot faltante, digamos, $S_i$. A continuación, proceden como antes y envían una prueba para $S_i$, haciendo que ese slot se complete de nuevo.

La forma en que Codex organiza sus datos como slots particionados y codificados con borrado está en gran medida inspirada en HAIL[^bowers_09]. El uso de la codificación de borrado local y las pruebas compactas está en cambio inspirado en trabajos anteriores sobre PoRs[^juels_07] y PDPs[^ateniese_07], así como en PoRs compactos[^schacham_08].

Un aspecto clave del sistema de pruebas de Codex es que intenta ser lo más ligero posible. El objetivo final es poder ejecutarlo en ordenadores sencillos equipados con CPUs económicas y cantidades modestas de RAM. Los requisitos actuales para los SP domésticos están muy por debajo de lo que puede proporcionar un NUC o un portátil de consumo, pero deberían disminuir aún más a medida que lo optimicemos. Esto es clave, ya que un sistema de pruebas eficiente significa que:

1. tanto el hardware que no es de almacenamiento, por ejemplo, las CPUs y la RAM, como los costes generales de electricidad para las pruebas deberían ser bajos. Esto conduce a mejores márgenes para los SP;
2. los requisitos mínimos son modestos, lo que favorece la descentralización.
    
### 4.4. Publicación y Recuperación de Datos

Los conjuntos de datos almacenados en Codex deben anunciarse a través de una Tabla Hash Distribuida (DHT), que es una variante de la DHT Kademlia[^maymounkov_02], para que puedan ser localizados y recuperados por otros pares. A un nivel básico, la DHT de Codex asigna los Identificadores de Contenido (CIDs)[^cid_spec], que identifican los datos, a las listas de proveedores, que identifican a los pares que tienen esos datos.

Un CID identifica inequívocamente una pieza de datos codificando una variante de un hash de su contenido junto con el tipo de método de hashing utilizado para calcularlo. En el caso de un conjunto de datos Codex $D_e$ (Figura 4), este hash se toma como la raíz del árbol Merkle SHA256 construido sobre sus bloques ${b_1, \cdots, b_{s \times (k + m)}}$.

<div style="display: flex; justify-content: center; padding: 0 0 15px 0">
    <img src="/learn/whitepaper/cid.png" width="60%" />
</div>

**Figure 4.** CIDs para conjuntos de datos Codex.
    
Los nodos que tienen parte o la totalidad de $D_e$ anunciarán periódicamente un Registro de Par Firmado (SPR) bajo el CID de $D_e$ en la DHT para informar a otros pares de que están disponibles para proporcionar bloques para $D_e$. Un SPR es un registro firmado[^signed_envelope_spec] que contiene el ID del par, su clave pública y sus direcciones de red admitidas como una lista de multiaddresses[^multiaddress_spec].

Esta estructura ofrece una gran flexibilidad en la forma en que los pares eligen comunicarse y codificar los conjuntos de datos, y es clave para crear una red p2p que pueda admitir múltiples versiones concurrentes de clientes p2p y, por lo tanto, pueda actualizarse sin problemas.
    
**Metadata.** Codex almacena los metadatos del conjunto de datos en descriptores llamados manifiestos. Actualmente, estos se mantienen separados del conjunto de datos en sí, de forma similar a los archivos torrent de BitTorrent. Contienen metadatos sobre varios atributos necesarios para describir y procesar correctamente el conjunto de datos, como las raíces Merkle tanto para los árboles de contenido (SHA256) como de prueba ($\text{Poseidon2}$), el número de bloques contenidos en el conjunto de datos, el tamaño del bloque, los parámetros de codificación de borrado y el tipo MIME de los conjuntos de datos. Aunque el CID de un conjunto de datos es en gran medida independiente de su manifiesto, un conjunto de datos no puede decodificarse ni verificarse correctamente sin él.

Los manifiestos se almacenan actualmente como bloques direccionables por contenido en Codex y se tratan de forma similar a los conjuntos de datos: los nodos que tienen el manifiesto de un conjunto de datos determinado anunciarán su CID en la DHT, que se calcula tomando un hash SHA256 del contenido del manifiesto. Sin embargo, dado que los manifiestos se almacenan separados del conjunto de datos, también se pueden intercambiar fuera de banda, como se pueden hacer con los archivos torrent.

Otros sistemas eligen un acoplamiento más estrecho entre los metadatos y el conjunto de datos. IPFS y Swarm utilizan estructuras criptográficas como Merkle DAG y un árbol Merkle, donde los nodos intermedios se colocan en la red y se consultan iterativamente para recuperar los vértices y las hojas respectivos. Tales decisiones de diseño tienen sus propios compromisos y ventajas, por ejemplo, una ventaja de almacenar los metadatos en una única unidad direccionable es que elimina los viajes de ida y vuelta de la red intermediaria, a diferencia de una estructura criptográfica distribuida como un árbol o un DAG.

**Recuperación de datos.** La recuperación de datos en Codex sigue un proceso similar a BitTorrent: un par que desee descargar un conjunto de datos $D_e$ primero debe adquirir su manifiesto, ya sea a través de Codex buscando el CID del manifiesto en la DHT y descargándolo de los pares que lo proporcionan, o fuera de banda. Una vez en posesión del manifiesto, el par puede aprender el CID del conjunto de datos (construido a partir de su raíz Merkle SHA256) y buscarlo en la DHT. Esto se representa en la Figura 5a (1).

<div style="display: flex; justify-content: center;">
    <div style="text-align: center;">
        <img src="/learn/whitepaper/download.png"/>
        <p>(a)</p>
    </div>
    <div style="text-align: center;">
        <img src="/learn/whitepaper/swarm.png"/>
        <p>(b)</p>
    </div>
</div>

**Figura 5.** (a) Búsqueda en la DHT y (b) enjambre de descarga.

Los nodos responsables de ese CID responderán con un subconjunto (aleatorizado) de los proveedores para ese CID (Figura 5a (2)). El par puede entonces contactar con estos nodos para integrarse en un enjambre de descarga (Figura 5b). Una vez que forma parte del enjambre, el par participará en un protocolo de intercambio similar a BitSwap[^bitswap_spec] anunciando los bloques que desea descargar a los vecinos, y recibiendo peticiones de los vecinos a cambio. Los pares que se desconectan se sustituyen volviendo a consultar la DHT. Tenga en cuenta que los SP siempre participan en los enjambres para los conjuntos de datos que alojan, actuando como seeders. Dado que el mecanismo es tan similar a BitTorrent, esperamos que Codex escale al menos igual de bien.

Codex ahora mismo se basa en mecanismos de incentivos sencillos para garantizar que los pares compartan bloques. Actualmente se está trabajando en incentivos de ancho de banda y, en futuras versiones, los pares podrán comprar transferencias de bloques entre sí.
    
### 4.5. Mercado de Codex

El mercado de Codex es el conjunto de componentes que se ejecutan tanto on-chain, como contratos inteligentes, como off-chain, como parte de ambos SCs y SPs. Su principal objetivo es definir y hacer cumplir el conjunto de reglas que, juntas, permiten: i) la venta y compra ordenada de almacenamiento; ii) la verificación de las pruebas de almacenamiento; iii) las reglas para penalizar a los actores defectuosos (slashing) y compensar las reparaciones de SP y la pérdida de datos de SC; y iv) varios otros aspectos de la economía del sistema, que se discutirán como parte de un próximo litepaper de tokenomics de Codex.

Codex implementa un mercado de ask/bid en el que los SCs publican solicitudes de almacenamiento en la cadena, y los SPs pueden entonces actuar sobre ellas si resultan ser rentables. Esto significa que el lado de la solicitud; es decir, cuánto está dispuesto a pagar un SC, es siempre visible, mientras que el lado de la oferta; es decir, a qué precio está dispuesto a vender un SP, no lo es. 

Un SC que desea que Codex almacene un conjunto de datos $D_e$ necesita proporcionar 5 parámetros principales. Estos son:

1. Tamaño en bytes. Especifica cuántos bytes de almacenamiento desea comprar el SC.
2. Duración. Especifica durante cuánto tiempo desea comprar el SC los bytes de almacenamiento en (1); por ejemplo, un año.
3. Número de slots. Contiene el número de slots en $D_e$. Esto se deriva de los parámetros de codificación de borrado $k$ y $m$ discutidos en la Sec. 4.3.
4. Precio. El precio que este SC está dispuesto a pagar por el almacenamiento, expresado como una cantidad fraccionaria de tokens Codex por byte, por segundo. Por ejemplo, si esto se establece en $1$ y el SC quiere comprar $1\text{MB}$ de almacenamiento durante $10$ segundos, entonces esto significa que el SC está dispuesto a desembolsar $10$ millones de tokens Codex para esta solicitud.
5. Colateral por slot. Dicta la cantidad de tokens Codex que se espera que el SP ponga como colateral si deciden cumplir un slot en esta solicitud (staking). El no proporcionar pruebas oportunas puede resultar en la pérdida de este colateral (slashing).

Como se explica en la Sec. 5, estos parámetros pueden afectar directamente a las garantías de durabilidad, y el sistema ofrece una flexibilidad completa para que las aplicaciones puedan adaptar el gasto y los parámetros a necesidades específicas. Las aplicaciones construidas sobre Codex deberán proporcionar orientación a sus usuarios para que puedan elegir los parámetros correctos para sus necesidades, de forma no muy diferente a como las carteras de Ethereum ayudan a los usuarios a determinar las tasas de gas.

<center>
    <img src="/learn/whitepaper/marketplace-overview.png" width=70%/>
</center>

**Figura 6.** Solicitudes de almacenamiento y su procesamiento por los SPs
    
Como se muestra en la Figura 6, cada solicitud de almacenamiento publicada por un SC queda registrada on-chain y genera un evento de blockchain que los SPs escuchan. Internamente, los SPs clasificarán las solicitudes de almacenamiento sin completar según sus propios criterios, normalmente la rentabilidad, e intentarán completar primero los slots para las solicitudes que les resulten más interesantes. Como se explica en la Sec. 4.2, completar un slot implica: i) reservar el slot on-chain; ii) descargar los datos del SC; iii) proporcionar una prueba de almacenamiento inicial, así como la garantía de staking.
    
**Garantizar la diversidad.** Los SPs compiten por los slots sin completar. Si permitiéramos que esta competencia se produjera puramente basándose en la latencia; es decir, el proveedor más rápido en reservar un slot gana, podríamos fácilmente terminar con un sistema demasiado centralizado o, incluso peor, con múltiples slots terminando en un solo proveedor. Esto último es particularmente grave, ya que los fallos dentro de un proveedor pueden no estar descorrelacionados y, por lo tanto, queremos asegurar que la distribución de slots entre los proveedores sea lo más aleatoria posible.

Para ayudar a mitigar estos problemas, el mercado de Codex implementa un mecanismo de ventana en expansión basado en el tiempo para permitir que los SPs compitan por los slots. Como se muestra en la Figura 7, a cada solicitud de almacenamiento se le asigna una posición aleatoria en un espacio de ID de $z$ bits tomando una función hash $h$ y calculando, para el slot $S_i$, el valor $h(u,|, i)$, donde $u$ es un nonce aleatorio. Esto dispersará efectivamente las solicitudes de almacenamiento para los slots de forma aproximadamente uniforme y aleatoria sobre el espacio de ID.

<div style="padding: 2rem 0 4rem 0">
    <img src="/learn/whitepaper/marketplace-slot-dispersal.png"/>
</div>
    
**Figura 7.** Slots colocados aleatoriamente en un espacio de $z$ bits.
    
A continuación, permitimos que sólo los hosts cuyos IDs de blockchain estén dentro de una cierta "distancia" de un slot compitan por completarlo (Figura 8).  

<div style="padding: 2rem 0 4rem 0">
    <img src="/learn/whitepaper/marketplace-expanding-window.png"/>
</div>

**Figura 8.** Elegibilidad de SP en función del tiempo y su distancia a un slot.
    
Esta distancia se expande con el tiempo según un parámetro de dispersión $\mu$. Sea $d: {0,1}^z \times {0,1}^z \longrightarrow [0, 2^z)$ nuestra función de distancia - podríamos, por ejemplo, tomar el XOR de $a$ y $b$. A un host con ID de blockchain $b$ sólo se le permitirá completar un slot en la posición $a$ en el tiempo $t$ si:
    
$$
\begin{equation}
     d(a, b) \leq \mu t
\end{equation}\tag{1}
$$

donde $t = 0$ en el momento en que se publica la solicitud de almacenamiento para $a$. En el ejemplo de la Figura 8, al host $b$ se le permitirá completar el slot $a$ cuando $t \geq 2$, mientras que al host $c$ sólo se le permitirá intentarlo una vez que $t \geq 3$. No intentaremos probar esto formalmente, pero, bajo supuestos relativamente débiles, esto garantiza que la asignación de slots a los SPs se produzca de forma aproximadamente uniforme y aleatoria.

## 5. Análisis de fiabilidad

En esta sección, proporcionamos un análisis inicial de la durabilidad para Codex. El objetivo principal es investigar los valores para $p_{\text{loss}}$, nuestra probabilidad de perder datos durante un período de 1 año. En particular, estamos interesados en comprender qué tipo de parámetros se requieren para que podamos obtener niveles muy altos de fiabilidad (por ejemplo, $p_{\text{loss}} = 10^{-9}$, o nueve nueves de disponibilidad).

Codex, como sistema, almacena una gran cantidad de conjuntos de datos, cada uno codificado, distribuido, verificado y reparado de acuerdo con los parámetros específicos establecidos en el contrato de almacenamiento respectivo. Dado que los conjuntos de datos se configuran de forma independiente y operan (en su mayoría) de forma independiente, podemos modelar el sistema a nivel del conjunto de datos. Más adelante hablaremos de la correlación entre varios conjuntos de datos almacenados en el sistema.

En nuestro primer modelo, utilizamos un modelo de Cadena de Markov de Tiempo Continuo (CTMC) para describir el estado del conjunto de datos en cualquier instante de tiempo. El modelo considera los siguientes aspectos de Codex:

* codificación de datos;
* fallos de nodo;
* el proceso de prueba;
* reparación de conjuntos de datos.

Antes de discutir el espacio de estados y la matriz de tasas del modelo CTMC, vamos a describir estos aspectos del sistema. 
    
Como antes, asumimos un conjunto de datos $D$ dividido en $k$ particiones disjuntas, y codificado en un nuevo conjunto de datos $D_e$ con $n=k+m$ slots ${S_1, \cdots, S_k , \cdots, S_{k+m}}$. Esta codificación se caracteriza a menudo por su factor de expansión de código $e = n/k =1+m/k$, que expresa la sobrecarga de almacenamiento debido a la redundancia del código.
    
### 5.1. Modelo de fallo

Al hablar de fallos, debemos diferenciar entre fallos transitorios y permanentes, así como entre fallos catastróficos de nodos (los datos del slot se pierden por completo) y fallos parciales.

En nuestro primer modelo, nos centramos en fallos permanentes de los nodos. Desde la perspectiva de Codex, se considera que un nodo se ha perdido si no puede proporcionar pruebas. El fallo permanente de un nodo puede deberse a un fallo del disco, a otros fallos de hardware o software que conduzcan a la corrupción de los datos, pero también a riesgos operativos, incluidos los fallos de hardware, los fallos de red o las decisiones operativas.

Los fallos de hardware irreparables se suelen caracterizar con su métrica MTTF (Mean Time To Failure - Tiempo Medio Hasta el Fallo), asumiendo una distribución exponencial del tiempo hasta el fallo. Existen varias estadísticas de MTTF disponibles sobre los fallos de disco[^schroeder_07].

Como primera aproximación, uno podría partir de las cifras de MTTF de disco anteriores, e intentar tener en cuenta otras razones de fallos permanentes de nodos. El MTTF de disco se especifica en el rango de 1e+6 horas, sin embargo, tenemos buenas razones para ser más pesimistas, o al menos errar en el lado más poco fiable, y asumir un MTTF en el rango de 1e+4 horas, es decir, alrededor de un año.

En aras de la modelización, también asumimos fallos i.i.d. (independientes e idénticamente distribuidos) entre el conjunto de nodos que almacenan un determinado conjunto de datos. Este es un modelo optimista en comparación con los casos en los que algunos proveedores de almacenamiento podrían fallar juntos, por ejemplo, por estar en un hardware compartido, en el mismo centro de datos o por estar bajo la misma autoridad administrativa. Modelaremos estos eventos correlacionados en un documento aparte.

También podría haber nodos maliciosos en el conjunto de proveedores de almacenamiento, por ejemplo, reteniendo datos cuando se requiriera la reconstrucción. De nuevo, ampliaremos el modelo para estos en un documento aparte.

### 5.2. de reconstrucción

El siguiente parámetro importante relacionado con el tiempo del modelo es el MTTR (Mean Time To Reconstruct - Tiempo Medio Para Reconstruir). Si bien modelamos los eventos a nivel de un solo conjunto de datos, es importante tener en cuenta aquí que un evento de fallo probablemente involucra discos enteros o nodos enteros con múltiples discos, con muchos conjuntos de datos y una gran cantidad de datos. Por lo tanto, en el caso de la reconstrucción, los procesos estocásticos de conjuntos de datos individuales no son independientes entre sí, lo que lleva a tiempos de reconstrucción más altos e inciertos.

El tiempo real de reparación depende de varios factores:

- tiempo para comenzar a reparar el conjunto de datos,
- transmisión de datos para fines de decodificación de código de borrado,
- la propia decodificación EC,
- asignación de los nuevos nodos para albergar los bloques reparados,
- distribución de datos reparados a los nodos asignados.

En general, claramente no es fácil obtener una distribución razonable para el tiempo de reparación, ni siquiera el tiempo medio de reparación. Si bien es muy probable que el tiempo de reparación no sea una distribución exponencial, la modelamos como tal en una primera aproximación para permitir la modelización basada en la cadena de Markov.
    
### 5.3. Activación de la reconstrucción

La reconstrucción y la reasignación de slots se pueden activar mediante el estado observado, y nuestro sistema "observa" el estado a través del proceso de prueba. En nuestro modelo, asumimos que los nodos proporcionan pruebas de acuerdo con un proceso aleatorio con una distribución exponencial entre los tiempos de prueba, con una media de MTBF (Mean Time Between Proofs - Tiempo Medio Entre Pruebas), i.i.d. entre nodos. También son posibles otras distribuciones, pero en aras de la modelización, comenzamos con una distribución exponencial, que también es sencilla de implementar en la práctica.

La reconstrucción se puede activar en función del estado observado de varias maneras:

- si a un nodo individual le falta una prueba de slot (o, más generalmente, una serie de pruebas), se puede iniciar la reconstrucción. La ventaja de esta opción es que las consecuencias de fallar una prueba sólo dependen del propio nodo, y no de otros nodos.
- la reconstrucción también se puede activar mediante el estado del sistema observado, es decir, el número de nodos que han perdido la última prueba (o más en general, algunas de las últimas pruebas). De hecho, gracias a las propiedades de los códigos RS, siempre que se está reparando un slot, todos los datos del slot se regeneran. Como consecuencia, el coste de la reparación es independiente del número de slots que se estén reparando, y al activar la reparación sólo después de que se observan varios slots perdidos (la llamada "reparación perezosa"), podemos reducir drásticamente el coste de la reparación.

En nuestro modelo, asumimos una reconstrucción que utiliza una combinación de los dos activadores anteriores.

- La reconstrucción se activa en función del estado del sistema observado, lo que permite una reparación perezosa, activándola cuando $l_0$ de los slots se consideran perdidos.
- Se considera que un solo slot se ha perdido si le faltó la última $l_1$ pruebas.

También son posibles otras estrategias de reconstrucción, como considerar todas las pruebas de todos los slots en una ventana de tiempo, pero las dejamos para un estudio posterior.

### 5.4. Modelo CTMC

Modelamos el sistema utilizando un CTMC con un espacio de estados multidimensional que representa el estado del slot y el progreso de la prueba. Para mantener la descripción sencilla, introducimos aquí el modelo para el caso de $l_1 = 1$. Una extensión a $l_1 > 1$ es posible aumentando las dimensiones del espacio de estados a $1+l_1$.

**Espacio de estados.** Modelamos el sistema con un espacio de estados multidimensional $S_{l,f}$ con las siguientes dimensiones:

- pérdidas: $l \in [0, \cdots, m+1]$: el número de slots perdidos. Los valores prácticos de $l$ van de $0$ a $m$. En cuanto $l$ alcanza $m+1$, el conjunto de datos puede considerarse perdido.
observaciones: $f \in [0, \cdots, l]$ es el número de slots con la última prueba fallida, o dicho de otro modo, las - - pérdidas observadas. La reparación se activa cuando $l \ge l_0$. Dado que la reparación reasigna slots a nuevos nodos, podemos asumir que todos los slots reparados están disponibles después del proceso. Por lo tanto, $f \le l$ en todos los estados alcanzables.

**Tasas de transición de estado.** Desde un estado dado $S_{l,f}$ podemos llegar a los siguientes estados:

- pérdida de slot, $S_{l+1,f}$: la pérdida de slot está impulsada por el MTTF, asumiendo pérdidas de slot i.i.d. Obviamente, sólo se pueden perder los slots disponibles, por lo que la probabilidad de transición también depende de $n-l$.
- pruebas faltantes, $S_{l,f+1}$: sólo nos interesa el evento de observar la pérdida de un slot que no hemos visto antes. Por lo tanto, la probabilidad de transición de estado depende de $f-l$.
- reparación, $S_{0,0}$: la reparación sólo se activa una vez que el número de pérdidas observadas alcanza el umbral de reparación perezosa $l_0$. En caso de una reparación exitosa, todos los slots se restauran completamente (incluso si el conjunto real de nodos que almacenan los slots está cambiando).
    
Los estados $S_{M+1,f}$ para cada $f$ son estados de absorción. Calculando el tiempo esperado de absorción, podemos cuantificar la fiabilidad del sistema.
    
<center>
    <img src="/learn/whitepaper/ploss-vs-slots.png"/>
</center>

**Figura 9.**  $p_{\text{loss}}$ (eje y) en función de $n$ para varios valores de $l_0$ y factores de expansión ($e$).

    
La Figura 9 muestra la fiabilidad del conjunto de datos ($p_{\text{loss}}$) en función de $n$, el número de slots, asumiendo un MTTF de 1 año y un MTTR de 24 horas. Establecemos la frecuencia de reparación (MTBR) en 24 horas, y exploramos varias opciones en el factor de expansión de código $e$ y el umbral de reparación perezosa $l_0$. Claramente, añadir más redundancia (utilizando un código RS con un factor de expansión más alto) nos permite almacenar un conjunto de datos en menos SPs. Como se esperaba, la reparación perezosa requiere el uso de más SPs, pero reduce el coste de la reparación al retrasarla.

La figura también muestra qué valores de $k$ y $m$ son necesarios para alcanzar un determinado umbral de fiabilidad bajo diferentes factores de expansión y umbrales de reparación perezosa. Por ejemplo, los valores para una probabilidad de fallo en un año de $10^{-9}$, también llamada fiabilidad de "nueve nueves", se resumen en la Tabla 1.

<center>
    
| Expansión ($e$) | Reparación perezosa ($l_0$) |k + m Requerido|
|:---------------:|:-------------------:|:------------:|
|   1.5           |   1                 |   18 +  9    |
|   2             |   1                 |    7 +  7    |
|   2.5           |   1                 |    4 +  6    |
|   1.5           |   5                 |   28 + 14    |
|   2             |   5                 |   13 + 13    |
|   2.5           |   5                 |    8 + 12    |

</center> 

**Table 1.** Expansión, reparación perezosa y valores requeridos para $k$ y $m$ para lograr $p_{\text{loss}} = 10^{-9}$

### 5.5 Frecuencia de prueba

Un parámetro importante para evaluar es la frecuencia de las pruebas, expresada en nuestro modelo como MTBP, ya que se traduce directamente en costes de generación y envío de pruebas. Si pudiéramos duplicar el MTBP, podríamos reducir a la mitad los costes asociados. 

<center>
    <img src="/learn/whitepaper/ploss-vs-proof-freq.png"/>
</center>

**Figura 10.**  $p_{\text{loss}}$ (eje y) en función de la frecuencia de la prueba (MTBP), para varios recuentos de slots ($k+m$) y umbrales de reparación perezosa ($l_0$).

En la Figura 10 mantenemos el MTTF de 1 año y el MTTR de 1 día, como antes, y mostramos $p_{\text{loss}}$ en función del MTBP (expresado en días para mayor simplicidad). Tenga en cuenta que el eje x es logarítmico para mostrar mejor la relación coste-beneficio de cambiar el intervalo de prueba.

Como era de esperar, los valores grandes de MTBP (pruebas poco frecuentes) no son aceptables, el conjunto de datos podría perderse fácilmente sin activar la reparación. Lo que también muestran las curvas es que requerir pruebas con un MTBF inferior a un día no supone una diferencia significativa. De hecho, con varias combinaciones de parámetros, en concreto, con valores de $n$ más altos, podemos permitirnos aumentar el MTBF considerablemente, hasta varios días.

Sin embargo, tenga en cuenta que todavía estamos utilizando $l_1=1$ en nuestro modelo, es decir, un slot se considera perdido después de una sola prueba fallida. Consideramos que esto es demasiado reactivo, ya que las pruebas individuales pueden perderse debido a fallos temporales. Sin entrar en muchos detalles, una mayor tolerancia en las pruebas perdidas ($l_1 > 1$) es similar a multiplicar MTBF por $l_1$ (aunque el modelo se vuelve más complejo, con un espacio de estados dimensional de $l_1 +1$).

## 6. Conclusiones y trabajo futuro

Hemos presentado Codex, un Motor de Durabilidad Descentralizado que emplea la codificación de borrado y pruebas eficientes de almacenamiento para proporcionar garantías de durabilidad ajustables y una compensación favorable en coste y complejidad para los proveedores de almacenamiento. Al tener pruebas ligeras, Codex puede mantener los gastos generales en hardware y electricidad al mínimo. Esto es importante tanto para fomentar la participación, ya que los márgenes de los proveedores de almacenamiento pueden aumentarse a la vez que los precios para los clientes pueden disminuir, y la descentralización, ya que los requisitos modestos son más propensos a fomentar un conjunto más diverso de participantes que van desde proveedores domésticos aficionados a jugadores más grandes.

A pesar de nuestros ambiciosos objetivos, Codex es un trabajo en curso. Los esfuerzos en curso para mejorarlo incluyen:

* **Reducción de los costes de prueba.** La verificación de pruebas on-chain es costosa. Para reducir los costes a corto plazo, estamos trabajando en un mecanismo de agregación en el nodo que permita a los proveedores agrupar pruebas en varios slots. En un horizonte temporal ligeramente más largo, también tenemos la intención de construir nuestra propia red de agregación, que en última instancia permitirá a Codex ir on-chain con muy poca frecuencia. Por último, a nivel de pruebas individuales, estamos trabajando en sistemas de prueba más eficientes que deberían reducir aún más los requisitos de hardware.
* **Incentivos de ancho de banda.** odex está diseñado para proporcionar incentivos sólidos que favorezcan la durabilidad. Si bien incentivar la disponibilidad resulta más difícil, ya que en general no es posible proporcionar pruebas para ella[^bassam_18], todavía podemos proporcionar una forma de incentivo eficaz, aunque más débil, permitiendo a los proveedores vender ancho de banda. Con ese fin, actualmente estamos trabajando en mecanismos para habilitar un mercado de ancho de banda eficiente en Codex que complemente el mercado de almacenamiento.
* **Privacidad y cifrado.** En el futuro, Codex cifrará los datos de forma predeterminada para que los SP nunca sepan lo que están almacenando. Esto también debería ofrecer a los SCs más privacidad.
* **Capa P2P.** Actualmente estamos trabajando en la optimización de los protocolos para que escalen y rindan mejor. Esto incluye mejoras en la latencia y el rendimiento de la transferencia de bloques, enjambres más eficientes y mecanismos de descubrimiento de bloques, así como la investigación de protocolos más seguros.
* **Herramientas y APIs.** Actualmente estamos trabajando en la creación de herramientas de desarrollo (SDKs) y APIs para facilitar el desarrollo de aplicaciones descentralizadas sobre la red Codex.

El trabajo dentro de un horizonte temporal más largo incluye:

* **Soporte para archivos mutables y de grano fino.** Codex, como muchos otros DSNs, es actualmente adecuado para conjuntos de datos inmutables grandes, y cualquier otro caso de uso requerirá actualmente middleware adicional. Tenemos trabajos en curso sobre la exploración de compromisos polinómicos en lugar de árboles Merkle para las pruebas, lo que debería permitirnos cambiar incrementalmente los conjuntos de datos sin tener que volver a codificarlos por completo. Esto desbloqueará una serie de nuevos casos de uso, y permitirá que Codex se utilice de una forma mucho más natural.
* **Mejoras en la codificación de borradog.** Existe un gran número de códigos diferentes que ofrecen diferentes compromisos, por ejemplo, códigos no MDS como los turbocódigos y los códigos tornado, que podrían dar como resultado un mejor rendimiento que los códigos Reed-Solomon que empleamos actualmente.

Codex tiene el potencial de soportar una amplia gama de casos de uso, desde el almacenamiento de datos personales y el alojamiento web descentralizado hasta la copia de seguridad y el archivo de datos seguros, las identidades descentralizadas y la distribución de contenidos descentralizada.

En última instancia, el caso de uso de Codex es el de una capa de almacenamiento descentralizada duradera y funcional, sin la cual no se puede contemplar seriamente ninguna pila de tecnología descentralizada. A medida que el ecosistema descentralizado continúa evolucionando, esperamos que el enfoque de almacenamiento de Codex basado en DDE desempeñe un papel crucial para permitir nuevos tipos de aplicaciones y servicios que prioricen el control del usuario, la privacidad y la resistencia.
## Referencias
              
[^tanembaum]: A. S. Tanenbaum and M. van Steen, Distributed Systems: Principles and Paradigms, 2nd ed. Upper Saddle River, NJ, USA: Pearson Education, 2007.

[^gcs]: Google Cloud Storage, "Google Cloud Storage," [Online]. Available: https://cloud.google.com/storage/docs. [Accessed: Aug. 27, 2024].

[^s3]: Amazon Web Services, "Amazon S3," [Online]. Available: https://aws.amazon.com/s3/. [Accessed: Aug. 27, 2024].

[^multicloud]: DigitalOcean, "The Business Benefits of a Multi-Cloud Strategy," [Online]. Available: https://www.digitalocean.com/community/tutorials/the-business-benefits-of-a-multi-cloud-strategy. [Accessed: Aug. 27, 2024].

[^liu_19]: J. Liu, "Government Backdoor in Cloud Services: Ethics of Data Security," USC Viterbi Conversations in Ethics, vol. 3, no. 2, 2019. [Online]. Available: https://vce.usc.edu/volume-3-issue-2/government-backdoor-in-cloud-services-ethics-of-data-security/. [Accessed: Aug. 27, 2024].

[^statista_cloud_percentage]: Statista, "Share of total spending on the cloud spent on storage in the United States and the United Kingdom 2023," Jan. 2023. [Online]. Available: https://www.statista.com/statistics/1374192/cloud-storage-cost-share/. [Accessed: Aug. 27, 2024]

[^gartner_cloud_budget]: Gartner, "Gartner forecasts worldwide public cloud end-user spending to surpass $675 billion in 2024," May 20, 2024. [Online]. Available: https://www.gartner.com/en/newsroom/press-releases/2024-05-20-gartner-forecasts-worldwide-public-cloud-end-user-spending-to-surpass-675-billion-in-2024. [Accessed: Aug. 27, 2024].

[^s3_wikipedia]: https://en.wikipedia.org/wiki/Amazon_S3

[^zippia_cloud_report]: Zippia. "25 Amazing Cloud Adoption Statistics [2023]: Cloud Migration, Computing, And More" Zippia.com. Jun. 22, 2023, https://www.zippia.com/advice/cloud-adoption-statistics/

[^s3_reinvent_19]: D. Brown, J. Smith, and A. Johnson, "Beyond eleven nines: Lessons from the Amazon S3 culture of durability," presented at AWS re:Invent 2019, 2019. [Online]. Available: https://d1.awsstatic.com/events/reinvent/2019/REPEAT_1_Beyond_eleven_nines_Lessons_from_the_Amazon_S3_culture_of_durability_STG331-R1.pdf. [Accessed: Aug. 29, 2024].

[^feng_14]: Y. Feng, B. Li and B. Li, "Price Competition in an Oligopoly Market with Multiple IaaS Cloud Providers" in IEEE Transactions on Computers, vol. 63, no. 01, pp. 59-73, 2014.

[^nakamoto_08]: S. Nakamoto, "Bitcoin: A Peer-to-Peer Electronic Cash System," 2008. [Online]. Available: https://bitcoin.org/bitcoin.pdf

[^buterin_13]: V. Buterin, "Ethereum White Paper: A Next Generation Smart Contract & Decentralized Application Platform," 2013. [Online]. Available: https://ethereum.org/en/whitepaper/

[^buterin_24]: V. Buterin, "EIP-4844: Shard Blob Transactions," Ethereum Improvement Proposals, 2024. [Online]. Available: https://www.eip4844.com. [Accessed: Sep. 3, 2024].

[^kostamis_24]: P. Kostamis, A. Sendros, and P. S. Efraimidis, "Data management in Ethereum DApps: A cost and performance analysis," Future Generation Computer Systems, vol. 145, pp. 193-205, Apr. 2024.

[^cohen_01]: B. Cohen, "BitTorrent - a new P2P app," Yahoo! Groups - decentralization, Jul. 2, 2001. [Online]. Available: https://web.archive.org/web/20080129085545/http://finance.groups.yahoo.com/group/decentralization/message/3160 [Accessed: Sep. 20, 2024]

[^chaudhry_24]: A. Chaudhry, S. Kannan and D. Tse, "STAKESURE: Proof of Stake Mechanisms with Strong Cryptoeconomic Safety," arXiv:2401.05797 [cs.CR], Jan. 2024.

[^protocol_17]: Protocol Labs, "Filecoin: A Decentralized Storage Network," Jul. 19, 2017. [Online]. Available: https://filecoin.io/filecoin.pdf

[^bassam_18]: M. Al-Bassam, A. Sonnino, and V. Buterin, "Fraud and Data Availability Proofs: Maximising Light Client Security and Scaling Blockchains with Dishonest Majorities," arXiv:1809.09044 [cs.CR], May 2019
    
[^reed_60]: I. S. Reed and G. Solomon, "Polynomial Codes Over Certain Finite Fields," Journal of the Society for Industrial and Applied Mathematics, vol. 8, no. 2, pp. 300-304, 1960

[^spanbroek_23]: M. Spanbroek, "Storage Proofs & Erasure Coding," https://github.com/codex-storage/codex-research/blob/master/design/proof-erasure-coding.md (accessed Sep. 26, 2024).
              
[^wikipedia_code_rate]: "Code rate," Wikipedia. https://en.wikipedia.org/wiki/Code_rate (accessed Sep. 26, 2024).
              
[^groth_16]: J. Groth, "On the Size of Pairing-based Non-interactive Arguments," in Advances in Cryptology – EUROCRYPT 2016, M. Fischlin and J.-S. Coron, Eds. Berlin, Heidelberg: Springer Berlin Heidelberg, 2016, pp. 305-326.
              
[^ateniese_07]: G. Ateniese et al., "Provable data possession at untrusted stores," in Proceedings of the 14th ACM Conference on Computer and Communications Security (CCS '07), Alexandria, Virginia, USA, Oct. 2007, pp. 598-609.

[^juels_07]: A. Juels et al., "Pors: proofs of retrievability for large files," in Proceedings of the 14th ACM Conference on Computer and Communications Security (CCS '07), Alexandria, Virginia, USA, Oct. 2007, pp. 584-597

[^schacham_08]: H. Shacham and B. Waters, "Compact Proofs of Retrievability," in Advances in Cryptology - ASIACRYPT 2008, J. Pieprzyk, Ed. Berlin, Heidelberg: Springer Berlin Heidelberg, 2008, pp. 90-107.

[^bowers_09]: K. D. Bowers, A. Juels, and A. Oprea, "HAIL: A high-availability and integrity layer for cloud storage," in Proceedings of the 16th ACM Conference on Computer and Communications Security (CCS '09), Chicago, Illinois, USA, Nov. 2009, pp. 187-198.

[^cid_spec]: Protocol Labs. "CID (Content IDentifier) Specification," https://github.com/multiformats/cid (accessed Sep. 26, 2024)

[^signed_envelope_spec]: libp2p. "RPC 0003 - Routing Records," https://github.com/libp2p/specs/blob/master/RFC/0003-routing-records.md (accessed Sep. 26, 2024)
       
[^multiaddress_spec]: Protocol Labs. "Multiformats / Multiaddr," https://multiformats.io/multiaddr/ (accessed Sep. 26, 2024)

[^maymounkov_02]: P. Maymounkov and D. Mazieres, "Kademlia: A peer-to-peer information system based on the XOR metric," in Proceedings of the First International Workshop on Peer-to-Peer Systems (IPTPS), Cambridge, MA, USA, Mar. 2002, pp. 53-65.
       
[^grassi_23]: L. Grassi, D. Khovratovich, and M. Schofnegger, "Poseidon2: A Faster Version of the Poseidon Hash Function," Cryptology ePrint Archive, Paper 2023/323, 2023. [Online]. Available: https://eprint.iacr.org/2023/323
       
[^bitswap_spec]: IPFS Standards. "Bitswap Protocol," https://specs.ipfs.tech/bitswap-protocol/ (accessed Sep. 27, 2024)
    
[^schroeder_07]: B. Schroeder and G. A. Gibson, "Disk Failures in the Real World: What Does an MTTF of 1,000,000 Hours Mean to You?," in Proceedings of the 5th USENIX Conference on File and Storage Technologies (FAST '07), San Jose, CA, USA, 2007
    
[^ipfs_website]: IPFS: An open system to manage data without a central server," IPFS, 2024. [Online]. Available: https://ipfs.tech/. [Accessed: Sep. 28, 2024].
