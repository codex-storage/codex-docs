# Быстрый старт

Чтобы запустить Codex через это руководство, нам нужно выполнить следующие шаги:
- [Ознакомиться с отказом от ответственности](/codex/disclaimer)
- [Получить бинарный файл Codex](#get-codex-binary)
- [Запустить Codex](#run-codex)
- [Взаимодействовать с Codex](#interact-with-codex)

## Получение бинарного файла Codex

Для быстрого старта мы будем использовать предварительно скомпилированные бинарные файлы со [страницы релизов GitHub](https://github.com/codex-storage/nim-codex/releases). Если вы предпочитаете компилировать из исходного кода, пожалуйста, проверьте [Сборка Codex](/learn/build).

Пожалуйста, следуйте шагам для вашей ОС из списка:
- [Linux/macOS](#linux-macos)
- [Windows](#windows)

### Linux/macOS

1. Установите последний релиз Codex
   ```shell
   curl -s https://get.codex.storage/install.sh | bash
   ```

2. Установите зависимости
   ```shell
   # Debian-based Linux
   sudo apt update && sudo apt install libgomp1
   ```

3. Проверьте результат
   ```shell
   codex --version
   ```

### Windows

1. Установите последний релиз Codex
   ```batch
    curl -sO https://get.codex.storage/install.cmd && install.cmd 
   ```

   > [!WARNING]
   > Антивирусное программное обеспечение Windows и встроенные брандмауэры могут привести к сбою шагов. Мы рассмотрим некоторые возможные ошибки здесь, но всегда учитывайте проверку вашей настройки, если запросы завершаются неудачей - в частности, если временное отключение вашего антивируса исправляет это, то, вероятно, это является причиной.

   Если вы видите ошибку типа:

   ```batch
   curl: (35) schannel: next InitializeSecurityContext failed: CRYPT_E_NO_REVOCATION_CHECK (0x80092012) - The revocation function was unable to check revocation for the certificate.
   ```

   Возможно, вам нужно добавить опцию `--ssl-no-revoke` к вашим вызовам curl, т.е. изменить вызовы выше, чтобы они выглядели так:

   ```batch
    curl -LO --ssl-no-revoke https://...
    ```

2. Обновите путь, используя вывод консоли
    - Только для текущей сессии
      ```batch
      :: Путь установки по умолчанию
      set "PATH=%PATH%%LOCALAPPDATA%\Codex;"
      ```

    - Обновление PATH постоянно
      - Панель управления --> Система --> Дополнительные параметры системы --> Переменные среды
      - Или введите `environment variables` в поле поиска Windows

3. Проверьте результат
   ```shell
   codex --version
   ```

## Запуск Codex

Мы можем [запустить Codex в разных режимах](/learn/run#run), и для быстрого старта мы запустим [узел Codex](/learn/run#codex-node), чтобы иметь возможность обмениваться файлами в сети.

1. Запустите Codex

   **Linux/macOS**
   ```shell
   codex \
     --data-dir=datadir \
     --disc-port=8090 \
     --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
     --nat=any \
     --api-cors-origin="*" \
     --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P
   ```

   **Windows**

   > [!WARNING]
   > Windows на этом этапе может запросить разрешение на доступ в интернет для Codex. Вы должны разрешить это для работы.
   > Также может потребоваться добавить правила входящего брандмауэра для Codex, и мы можем использовать утилиту `netsh`.

   <details>
   <summary>добавить правила брандмауэра с помощью netsh</summary>

   ```batch
   :: Добавить правила
   netsh advfirewall firewall add rule name="Allow Codex (TCP-In)" protocol=TCP dir=in localport=8070 action=allow
   netsh advfirewall firewall add rule name="Allow Codex (UDP-In)" protocol=UDP dir=in localport=8090 action=allow

   :: Показать правила
   netsh advfirewall firewall show rule name=all | find /I "Codex"

   :: Удалить правила
   netsh advfirewall firewall delete rule name="Allow Codex (TCP-In)"
   netsh advfirewall firewall delete rule name="Allow Codex (UDP-In)"
   ```
   </details>

   ```batch
   :: Запустить Codex
   codex ^
     --data-dir=datadir ^
     --disc-port=8090 ^
     --listen-addrs=/ip4/0.0.0.0/tcp/8070 ^
     --nat=any ^
     --api-cors-origin="*" ^
     --bootstrap-node=spr:CiUIAhIhAiJvIcA_ZwPZ9ugVKDbmqwhJZaig5zKyLiuaicRcCGqLEgIDARo8CicAJQgCEiECIm8hwD9nA9n26BUoNuarCEllqKDnMrIuK5qJxFwIaosQ3d6esAYaCwoJBJ_f8zKRAnU6KkYwRAIgM0MvWNJL296kJ9gWvfatfmVvT-A7O2s8Mxp8l9c8EW0CIC-h-H-jBVSgFjg3Eny2u33qF7BDnWFzo7fGfZ7_qc9P
   ```

   > [!TIP]
   > В примере выше мы используем [узлы начальной загрузки тестовой сети Codex](/networks/testnet#bootstrap-nodes) и, таким образом, присоединяемся к тестовой сети. Если вы хотите присоединиться к другой сети, пожалуйста, используйте [соответствующее значение](/networks/networks).

2. Настройте проброс портов TCP/UDP на вашем интернет-маршрутизаторе
   | Протокол | Сервис     | Порт   |
   | -------- | ---------- | ------ |
   | UDP      | Discovery  | `8090` |
   | TCP      | Transport  | `8070` |

Если вы хотите покупать или продавать хранилище, рассмотрите возможность запуска [узла Codex с поддержкой маркетплейса](/learn/run#codex-node-with-marketplace-support) или [узла хранения Codex](/learn/run#codex-storage-node).

## Взаимодействие с Codex

Когда ваш узел Codex запущен и работает, вы можете взаимодействовать с ним, используя [Пользовательский интерфейс приложения Codex](https://app.codex.storage) для обмена файлами.

Также вы можете взаимодействовать с Codex, используя [API Codex](/developers/api), и для ознакомления с API рассмотрите возможность следования руководству [Использование Codex](/learn/using).

## Оставайтесь на связи

Хотите быть в курсе или ищете дополнительную помощь? Попробуйте наш [дискорд-сервер](https://discord.gg/codex-storage).

Готовы исследовать функциональность Codex? Пожалуйста, [Присоединитесь к тестовой сети Codex](/networks/testnet).

Если вы хотите запустить Codex локально без присоединения к тестовой сети, рассмотрите возможность попробовать [Тест с двумя клиентами Codex](/learn/local-two-client-test) или [Запуск локальной сети Codex с поддержкой маркетплейса](/learn/local-marketplace).
