---
outline: [2, 4]
---
# Codex Testnet

Codex Testnet запущен и готов к использованию для тестирования.

Ваше участие в Codex Testnet регулируется [Условиями использования Codex Testnet](https://github.com/codex-storage/codex-testnet-starter/blob/master/Codex%20Testnet%20Terms%20and%20Conditions.pdf) и [Политикой конфиденциальности Codex Testnet](https://github.com/codex-storage/codex-testnet-starter/blob/master/Codex%20Testnet%20Privacy%20Policy.pdf).

**Руководства.** У нас есть базовые руководства по настройке Storage Client, который можно использовать для загрузки и хранения файлов путем покупки хранилища в сети Codex. Мы рекомендуем начать с них.

Запуск Storage Provider требует больше усилий и рассматривается в отдельном руководстве, которое демонстрирует сторону продажи хранилища, а также как запустить Codex с собственным локальным клиентом выполнения Ethereum.

Руководства доступны либо в Discord в виде пошаговых интерактивных руководств, либо здесь в виде простых инструкций, которым вы можете следовать:

- **Базовое: запуск storage client.** [[Discord](#sc-guide-discord) | [web](#sc-guide-web)]
- **Продвинутое: Запуск storage provider.** [[web](#sp-guide-web)]

Руководства были протестированы на следующих операционных системах:

 - Linux: Ubuntu 24.04, Debian 12, Fedora 40
 - macOS: 15
 - Windows: 11, Server 2022

## Запуск Storage Client (версия Discord) {#sc-guide-discord}

Вы можете присоединиться к [серверу Codex Discord](https://discord.gg/codex-storage) и перейти в канал [#:tv:|join-testnet](https://discord.com/channels/895609329053474826/1289923125928001702).

Это в основном то же самое, что и [Веб-руководство](#sc-guide-web), но использует возможности Discord, чтобы вы могли иметь интерактивное пошаговое руководство, а также получить поддержку в канале [#:sos:|node-help](https://discord.com/channels/895609329053474826/1286205545837105224).

## Запуск Storage Client (Веб-версия) {#sc-guide-web}

**Предварительные требования**

 - Доступ к вашему интернет-маршрутизатору для [настройки проброса портов](#basic-common)

Шаги для [Linux/macOS](#basic-linux-macos) и [Windows](#basic-windows) немного отличаются, поэтому используйте те, которые подходят для вашей ОС.

<hr>

### Linux/macOS {#basic-linux-macos}

1. Скачайте мастер-архив из репозитория Codex testnet starter и распакуйте его содержимое:
   ```shell
   curl -LO https://github.com/codex-storage/codex-testnet-starter/archive/master.tar.gz
   tar xzvf master.tar.gz
   rm master.tar.gz
   ```

2. Перейдите в папку со скриптами:
   ```shell
   cd codex-testnet-starter-master/scripts
   ```

3. Установите зависимости при необходимости:
   ```shell
   # Debian-based Linux
   sudo apt update && sudo apt install libgomp1
   ```

4. Скачайте бинарные файлы Codex из релизов GitHub:
   ```shell
   ./download_online.sh
   ```

5. Сгенерируйте пару ключей ethereum:
   ```shell
   ./generate.sh
   ```
   Ваш приватный ключ будет сохранен в файле `eth.key`, а адрес - в файле `eth.address`.

6. Пополните ваш адрес, показанный на экране, токенами:
   - Используйте веб-краны для получения [ETH](https://faucet-eth.testnet.codex.storage) и [TST](https://faucet-tst.testnet.codex.storage) токенов.
   - Мы также можем сделать это с помощью канала Discord [# bot](https://discord.com/channels/895609329053474826/1230785221553819669)
     - Используйте команду `/set ethaddress` для ввода вашего сгенерированного адреса
     - Используйте команду `/mint` для получения ETH и TST токенов
     - Используйте команду `/balance` для проверки успешного получения тестовых токенов

7. Запустите узел Codex:
   ```shell
   ./run_client.sh
   ```

8. Настройте [проброс портов](#basic-common), и мы готовы к работе.

### Windows {#basic-windows}

1. Скачайте мастер-архив из репозитория Codex testnet starter и распакуйте его содержимое:
   > [!WARNING]
   > Антивирусное ПО Windows и встроенные брандмауэры могут вызвать сбой шагов. Мы рассмотрим некоторые возможные ошибки здесь, но всегда учитывайте проверку вашей настройки, если запросы не выполняются - в частности, если временное отключение антивируса решает проблему, то, вероятно, он является причиной.

   ```batch
   curl -LO https://github.com/codex-storage/codex-testnet-starter/archive/master.tar.gz
   ```

   Если вы видите ошибку:

   ```batch
   curl: (35) schannel: next InitializeSecurityContext failed: CRYPT_E_NO_REVOCATION_CHECK (0x80092012) - The revocation function was unable to check revocation for the certificate.
   ```

   Возможно, вам нужно добавить опцию `--ssl-no-revoke` к вашему вызову curl, например:

   ```batch
   curl -LO --ssl-no-revoke https://github.com/codex-storage/codex-testnet-starter/archive/master.tar.gz
   ```

1. Распакуйте содержимое tar-файла и затем удалите его:
   ```batch
   tar xzvf master.tar.gz
   del master.tar.gz
   ```

2. Перейдите в папку со скриптами:
   ```batch
   cd codex-testnet-starter-master\scripts\windows
   ```

3. Скачайте бинарные файлы Codex из релизов GitHub:
   ```batch
   download-online.bat
   ```

4. Сгенерируйте пару ключей ethereum:
   ```batch
   generate.bat
   ```
   Ваш приватный ключ будет сохранен в файле `eth.key`, а адрес - в файле `eth.address`.

5. Пополните ваш адрес, показанный на экране, токенами:
   - Используйте веб-краны для получения [ETH](https://faucet-eth.testnet.codex.storage) и [TST](https://faucet-tst.testnet.codex.storage) токенов.
   - Мы также можем сделать это с помощью канала Discord [# bot](https://discord.com/channels/895609329053474826/1230785221553819669)
     - Используйте команду `/set ethaddress` для ввода вашего сгенерированного адреса
     - Используйте команду `/mint` для получения ETH и TST токенов
     - Используйте команду `/balance` для проверки успешного получения тестовых токенов

6. Запустите узел Codex:
   ```batch
   run-client.bat
   ```

 7. Настройте [проброс портов](#basic-common), и мы готовы к работе.

### Все ОС {#basic-common}

Настройте [проброс портов](https://en.wikipedia.org/wiki/Port_forwarding) на вашем интернет-маршрутизаторе
| # | Протокол | Порт   | Описание       |
| - | -------- | ------ | -------------- |
| 1 | `UDP`    | `8090` | `Codex Discovery` |
| 2 | `TCP`    | `8070` | `Codex Transport` |

После того как ваш узел запущен и работает, вы можете использовать [Codex API](/developers/api) для взаимодействия с вашим узлом Codex, пожалуйста, ознакомьтесь с нашим [пошаговым руководством по API](/learn/using) для получения более подробной информации.

Вы также можете использовать [Codex App UI](https://app.codex.storage) для взаимодействия с вашим локальным узлом Codex.

Нужна помощь? Обратитесь к нам в канале [#:sos:|node-help](https://discord.com/channels/895609329053474826/1286205545837105224) или проверьте [руководство по устранению неполадок](/learn/troubleshoot.md).

## Запуск Storage Provider (Веб-версия) {#sp-guide-web}

В процессе разработки :construction:

## Данные Testnet

### Bootstrap-узлы
**Codex**
```shell
spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P
spr:CiUIAhIhAyUvcPkKoGE7-gh84RmKIPHJPdsX5Ugm_IHVJgF-Mmu_EgIDARo8CicAJQgCEiEDJS9w-QqgYTv6CHzhGYog8ck92xflSCb8gdUmAX4ya78QoemesAYaCwoJBES39Q2RAnVOKkYwRAIgLi3rouyaZFS_Uilx8k99ySdQCP1tsmLR21tDb9p8LcgCIG30o5YnEooQ1n6tgm9fCT7s53k6XlxyeSkD_uIO9mb3
spr:CiUIAhIhAlNJ7ary8eOK5GcwQ6q4U8brR7iWjwhMwzHb8BzzmCEDEgIDARpJCicAJQgCEiECU0ntqvLx44rkZzBDqrhTxutHuJaPCEzDMdvwHPOYIQMQsZ67vgYaCwoJBK6Kf1-RAnVEGgsKCQSuin9fkQJ1RCpGMEQCIDxd6lXDvj1PcHgQYnNpHGfgCO5a7fejg3WhSjh2wTimAiB7YHsL1WZYU_zkHcNDWhRgMbkb3C5yRuvUhjBjGOYJYQ
spr:CiUIAhIhA7E4DEMer8nUOIUSaNPA4z6x0n9Xaknd28Cfw9S2-cCeEgIDARo8CicAJQgCEiEDsTgMQx6vydQ4hRJo08DjPrHSf1dqSd3bwJ_D1Lb5wJ4Qt_CesAYaCwoJBEDhWZORAnVYKkYwRAIgFNzhnftocLlVHJl1onuhbSUM7MysXPV6dawHAA0DZNsCIDRVu9gnPTH5UkcRXLtt7MLHCo4-DL-RCMyTcMxYBXL0
spr:CiUIAhIhAzZn3JmJab46BNjadVnLNQKbhnN3eYxwqpteKYY32SbOEgIDARo8CicAJQgCEiEDNmfcmYlpvjoE2Np1Wcs1ApuGc3d5jHCqm14phjfZJs4QrvWesAYaCwoJBKpA-TaRAnViKkcwRQIhANuMmZDD2c25xzTbKSirEpkZYoxbq-FU_lpI0K0e4mIVAiBfQX4yR47h1LCnHznXgDs6xx5DLO5q3lUcicqUeaqGeg
spr:CiUIAhIhAuN-P1D0HrJdwBmrRlZZzg6dqllRNNcQyMDUMuRtg3paEgIDARpJCicAJQgCEiEC434_UPQesl3AGatGVlnODp2qWVE01xDIwNQy5G2DeloQm_L2vQYaCwoJBI_0zSiRAnVsGgsKCQSP9M0okQJ1bCpHMEUCIQDgEVjUp1RJGb59eRPs7RPYMSGAI_fo1yv70iBtnTqefQIgVoXszc87EGFVO3aaqorEYZ21OGRko5ho_Pybdyqa6AI
spr:CiUIAhIhAsi_hgxFppWjHiKRwnYPX_qkB28dLtwK9c7apnlBanFuEgIDARpJCicAJQgCEiECyL-GDEWmlaMeIpHCdg9f-qQHbx0u3Ar1ztqmeUFqcW4Q2O32vQYaCwoJBNEmoCiRAnV2GgsKCQTRJqAokQJ1dipHMEUCIQDpC1isFfdRqNmZBfz9IGoEq7etlypB6N1-9Z5zhvmRMAIgIOsleOPr5Ra_Nk7BXmXGhe-YlLosH9jo83JtfWCy3-o
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

### Смарт-контракты

| Контракт    | Адрес                                                                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Токен       | [`0x34a22f3911De437307c6f4485931779670f78764`](https://explorer.testnet.codex.storage/address/0x34a22f3911De437307c6f4485931779670f78764) |
| Верификатор | [`0x02dd582726F7507D7d0F8bD8bf8053d3006F9092`](https://explorer.testnet.codex.storage/address/0x02dd582726F7507D7d0F8bD8bf8053d3006F9092) |
| Маркетплейс | [`0xfFaF679D5Cbfdd5Dbc9Be61C616ed115DFb597ed`](https://explorer.testnet.codex.storage/address/0xfFaF679D5Cbfdd5Dbc9Be61C616ed115DFb597ed) |

### Эндпоинты

| # | Сервис         | URL                                                                          |
| - | -------------- | ---------------------------------------------------------------------------- |
| 1 | Geth Public RPC | [rpc.testnet.codex.storage](https://rpc.testnet.codex.storage)               |
| 2 | Обозреватель блоков | [explorer.testnet.codex.storage](https://explorer.testnet.codex.storage)     |
| 3 | Кран ETH      | [faucet-eth.testnet.codex.storage](https://faucet-eth.testnet.codex.storage) |
| 4 | Кран TST      | [faucet-tst.testnet.codex.storage](https://faucet-tst.testnet.codex.storage) |
| 5 | Страница статуса | [status.testnet.codex.storage](https://status.testnet.codex.storage)         |
