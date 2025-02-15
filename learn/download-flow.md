 Flujo de Descarga

Secuencia de interacciones que resultan en la transferencia de bloques de datos a través de la red.

## Almacén Local (Local Store)

Cuando los datos están disponibles en el almacén de bloques local (local blockstore),

```mermaid
sequenceDiagram
actor Alice
participant API
Alice->>API: Download(CID)
API->>+Node/StoreStream: Retrieve(CID)
loop Obtener bloque de manifiesto, luego bloques de datos
    Node/StoreStream->>NetworkStore: GetBlock(CID)
    NetworkStore->>LocalStore: GetBlock(CID)
    LocalStore->>NetworkStore: Block
    NetworkStore->>Node/StoreStream: Block
end
Node/StoreStream->>Node/StoreStream: Manejar codificación de borrado (Handle erasure coding)
Node/StoreStream->>-API: Flujo de datos (Data stream)
API->>Alice: Descarga en flujo del bloque (Stream download of block)
```

## Almacén de Red
Cuando los datos no se encuentran en el almacén de bloques local, el motor de intercambio de bloques se utiliza para descubrir la ubicación del bloque dentro de la red. Se establecerá una conexión con el/los nodo(s) que tienen el bloque, y el intercambio puede tener lugar.

```mermaid
sequenceDiagram
box
actor Alice
participant API
participant Node/StoreStream
participant NetworkStore
participant Discovery
participant Engine
end
box
participant OtherNode
end
Alice->>API: Download(CID)
API->>+Node/StoreStream: Retrieve(CID)
Node/StoreStream->>-API: Flujo de datos (Data stream)
API->>Alice: Comienza la descarga en flujo (Download stream begins)
loop Obtener bloque de manifiesto, luego bloques de datos
    Node/StoreStream->>NetworkStore: GetBlock(CID)
    NetworkStore->>Engine: RequestBlock(CID)
    opt CID no conocido
    Engine->>Discovery: Discovery Block
    Discovery->>Discovery: Localiza pares que proporcionan el bloque (Locates peers who provide block)
    Discovery->>Engine: Pares (Peers)
    Engine->>Engine: Actualizar administración de pares (Update peers admin)
    end
    Engine->>Engine: Seleccionar par óptimo (Select optimal peer)
    Engine->>OtherNode: Enviar lista WantHave (Send WantHave list)
    OtherNode->>Engine: Enviar Presencia de Bloque (Send BlockPresence)
    Engine->>Engine: Actualizar administración de pares (Update peers admin)
    Engine->>Engine: Decidir comprar bloque (Decide to buy block)
    Engine->>OtherNode: Enviar lista WantBlock (Send WantBlock list)
    OtherNode->>Engine: Enviar Bloque (Send Block)
    Engine->>NetworkStore: Block
    NetworkStore->>NetworkStore: Añadir al almacén local (Add to Local store)
    NetworkStore->>Node/StoreStream: Resolver Bloque (Resolve Block)
    Node/StoreStream->>Node/StoreStream: Manejar codificación de borrado (Handle erasure coding)
    Node/StoreStream->>API: Empujar datos al flujo (Push data to stream)
end
API->>Alice: Finaliza la descarga en flujo (Download stream finishes)
```
