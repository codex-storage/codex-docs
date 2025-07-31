# Процесс загрузки
Последовательность взаимодействий, приводящих к передаче блоков данных через сеть.

## Локальное хранилище
Когда данные доступны в локальном хранилище блоков,

```mermaid
sequenceDiagram
actor Alice
participant API
Alice->>API: Download(CID)
API->>+Node/StoreStream: Retrieve(CID)
loop Get manifest block, then data blocks
    Node/StoreStream->>NetworkStore: GetBlock(CID)
    NetworkStore->>LocalStore: GetBlock(CID)
    LocalStore->>NetworkStore: Block
    NetworkStore->>Node/StoreStream: Block
end
Node/StoreStream->>Node/StoreStream: Handle erasure coding
Node/StoreStream->>-API: Data stream
API->>Alice: Stream download of block
```

## Сетевое хранилище
Когда данные не найдены в локальном хранилище блоков, используется механизм обмена блоками для обнаружения местоположения блока в сети. Устанавливается соединение с узлом(ами), у которых есть блок, и происходит обмен.

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
Node/StoreStream->>-API: Data stream
API->>Alice: Download stream begins
loop Get manifest block, then data blocks
    Node/StoreStream->>NetworkStore: GetBlock(CID)
    NetworkStore->>Engine: RequestBlock(CID)
    opt CID not known
    Engine->>Discovery: Discovery Block
    Discovery->>Discovery: Locates peers who provide block
    Discovery->>Engine: Peers
    Engine->>Engine: Update peers admin
    end
    Engine->>Engine: Select optimal peer
    Engine->>OtherNode: Send WantHave list
    OtherNode->>Engine: Send BlockPresence
    Engine->>Engine: Update peers admin
    Engine->>Engine: Decide to buy block
    Engine->>OtherNode: Send WantBlock list
    OtherNode->>Engine: Send Block
    Engine->>NetworkStore: Block
    NetworkStore->>NetworkStore: Add to Local store
    NetworkStore->>Node/StoreStream: Resolve Block
    Node/StoreStream->>Node/StoreStream: Handle erasure coding
    Node/StoreStream->>API: Push data to stream
end
API->>Alice: Download stream finishes
```
