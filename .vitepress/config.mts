// import { defineConfig } from 'vitepress'
import mdFootnote from 'markdown-it-footnote'
import { withMermaid } from 'vitepress-plugin-mermaid'
// const { BASE: base = '/' } = process.env;

// https://vitepress.dev/reference/site-config
export default withMermaid({
  lang: 'en-US',
  title: 'Codex Docs',
  description: 'Decentralised data storage platform',
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: false,
  appearance: true,

  markdown: {
    math: true,
    config: (md) => {
      md.use(mdFootnote)
    },
  },
  //  base: base,

  mermaid:{
    //mermaidConfig !theme here works for ligth mode since dark theme is forced in dark mode
  },

  // lite-youtube-embed
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag === 'lite-youtube',
      },
    },
  },

  head: [
    [
      'link', { rel: 'icon', href: '/favicons/favicon.svg', type: 'image/svg+xml' }
    ]
  ],

  srcExclude: ['README.md'],

  outDir: './.vitepress/dist',
  assetsDir: 'assets',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Whitepaper', link: '/learn/whitepaper' },
      { text: 'Tokenomics Litepaper', link: '/learn/tokenomics-litepaper' },
      {
        text: 'Codex',
        items: [
          { text: 'About', link: '/codex/about' },
          { text: 'Security', link: '/codex/security' },
          { text: 'Privacy Policy', link: '/codex/privacy-policy' },
          { text: 'Terms of Use', link: '/codex/terms-of-use' }
        ]
      }
    ],

    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },

    editLink: {
      pattern: 'https://github.com/codex-storage/codex-docs/edit/master/:path',
      text: 'Edit this page on GitHub',
    },

    logo: {
      alt: 'Codex • Docs',
      light: '/codex-mark-primary-black-resized.png',
      dark: '/codex-mark-primary-white-resized.png',
    },

    siteTitle: 'Codex • Docs',

    logoLink: '/learn/what-is-codex',

    sidebar: [
      {
        text: 'Introduction',
        collapsed: false,
        items: [
          { text: 'What is Codex?', link: '/learn/what-is-codex' },
          { text: 'Architecture', link: '/learn/architecture' },
          { text: 'Whitepaper', link: '/learn/whitepaper' },
          { text: 'Tokenomics Litepaper', link: '/learn/tokenomics-litepaper' }
        ]
      },
      {
        text: 'Setup Codex with Installer',
        collapsed: false,
        items: [
          { text: 'Disclaimer', link: '/codex/installer-disclaimer' },
          { text: 'Requirements', link: '/learn/installer/requirements' },
          { text: 'Install and Run Codex', link: '/learn/installer/install-and-run' },
          { text: 'Upload/Download', link: '/learn/installer/upload-and-download' },
        ]
      },
      {
        text: 'Setup Codex Manually',
        collapsed: false,
        items: [
          { text: 'Disclaimer', link: '/codex/disclaimer' },
          { text: 'Quick start', link: '/learn/quick-start' },
          { text: 'Build Codex', link: '/learn/build' },
          { text: 'Run Codex', link: '/learn/run' },
          { text: 'Using Codex', link: '/learn/using' },
          { text: 'Local Two Client Test', link: '/learn/local-two-client-test' },
          { text: 'Local Marketplace', link: '/learn/local-marketplace' },
          { text: 'Download Flow', link: '/learn/download-flow' },
          { text: 'Troubleshoot', link: '/learn/troubleshoot' }
        ]
      },
      {
        text: 'Codex networks',
        collapsed: false,
        items: [
          { text: 'Devnet', link: '/networks/devnet' },
          { text: 'Testnet', link: '/networks/testnet' }
        ]
      },
      {
        text: 'Developers',
        collapsed: false,
        items: [
          { text: 'API', link: '/developers/api' }
        ]
      },
      {
        text: 'Codex',
        collapsed: false,
        items: [
          { text: 'About', link: '/codex/about' },
          { text: 'Security', link: '/codex/security' },
          { text: 'Privacy Policy', link: '/codex/privacy-policy' },
          { text: 'Terms of Use', link: '/codex/terms-of-use' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/codex-storage/codex-docs' },
      { icon: 'twitter', link: 'https://twitter.com/Codex_storage' },
      { icon: 'youtube', link: 'https://www.youtube.com/@CodexStorage' },
      { icon: 'discord', link: 'https://discord.gg/codex-storage' }
    ]
  },

  // Internationalization - https://vitepress.dev/guide/i18n
  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
    // Russian
    ru: {
      label: 'Русский',
      lang: 'ru-RU',
      link: '/ru',
      themeConfig: {
        nav: [
          { text: 'Whitepaper', link: '/ru/learn/whitepaper' },
          { text: 'Tokenomics Litepaper', link: '/ru/learn/tokenomics-litepaper' },
          {
            text: 'Codex',
            items: [
              { text: 'О проекте', link: '/ru/codex/about' },
              { text: 'Безопасность', link: '/ru/codex/security' },
              { text: 'Политика конфиденциальности', link: '/ru/codex/privacy-policy' },
              { text: 'Условия использования', link: '/ru/codex/terms-of-use' }
            ]
          }
        ],
        editLink: {
          pattern: 'https://github.com/codex-storage/codex-docs/edit/master/:path',
          text: 'Редактировать эту страницу на GitHub',
        },
        siteTitle: 'Codex • Документация',
        logoLink: '/ru/learn/what-is-codex',
        sidebar: [
          {
            text: 'Введение',
            collapsed: false,
            items: [
              { text: 'Что такое Codex?', link: '/ru/learn/what-is-codex' },
              { text: 'Архитектура', link: '/ru/learn/architecture' },
              { text: 'Whitepaper', link: '/ru/learn/whitepaper' },
              { text: 'Tokenomics Litepaper', link: '/ru/learn/tokenomics-litepaper' }
            ]
          },
          {
            text: 'Установка Codex с помощью установщика',
            collapsed: false,
            items: [
              { text: 'Отказ от ответственности', link: '/ru/codex/installer-disclaimer' },
              { text: 'Требования', link: '/ru/learn/installer/requirements' },
              { text: 'Установка и запуск Codex', link: '/ru/learn/installer/install-and-run' },
              { text: 'Загрузка/Скачивание', link: '/ru/learn/installer/upload-and-download' },
            ]
          },
          {
            text: 'Установка Codex вручную',
            collapsed: false,
            items: [
              { text: 'Отказ от ответственности', link: '/ru/codex/disclaimer' },
              { text: 'Быстрый старт', link: '/ru/learn/quick-start' },
              { text: 'Сборка Codex', link: '/ru/learn/build' },
              { text: 'Запуск Codex', link: '/ru/learn/run' },
              { text: 'Использование Codex', link: '/ru/learn/using' },
              { text: 'Локальное тестирование с двумя клиентами', link: '/ru/learn/local-two-client-test' },
              { text: 'Локальный маркетплейс', link: '/ru/learn/local-marketplace' },
              { text: 'Поток загрузки', link: '/ru/learn/download-flow' },
              { text: 'Устранение неполадок', link: '/ru/learn/troubleshoot' }
            ]
          },
          {
            text: 'Сети Codex',
            collapsed: false,
            items: [
              { text: 'Devnet', link: '/ru/networks/devnet' },
              { text: 'Testnet', link: '/ru/networks/testnet' }
            ]
          },
          {
            text: 'Разработчики',
            collapsed: false,
            items: [
              { text: 'API', link: '/ru/developers/api' }
            ]
          },
          {
            text: 'Codex',
            collapsed: false,
            items: [
              { text: 'О проекте', link: '/ru/codex/about' },
              { text: 'Безопасность', link: '/ru/codex/security' },
              { text: 'Политика конфиденциальности', link: '/ru/codex/privacy-policy' },
              { text: 'Условия использования', link: '/ru/codex/terms-of-use' }
            ]
          }
        ],
      }
    },
    // Korean
    ko: {
      label: '한국어',
      lang: 'ko-KP',
      link: '/ko',
      themeConfig: {
        nav: [
          { text: '백서', link: '/ko/learn/whitepaper' },
          { text: 'Tokenomics Litepaper', link: '/ko/learn/tokenomics-litepaper' },
          {
            text: 'Codex',
            items: [
              { text: '소개', link: '/ko/codex/about' },
              { text: '보안', link: '/ko/codex/security' },
              { text: '개인정보 처리방침', link: '/ko/codex/privacy-policy' },
              { text: '이용 약관', link: '/ko/codex/terms-of-use' }
            ]
          }
        ],
        editLink: {
          pattern: 'https://github.com/codex-storage/codex-docs/edit/master/:path',
          text: 'Edit this page on GitHub',
        },
        siteTitle: 'Codex • 문서',
        logoLink: '/ko/learn/what-is-codex',
        sidebar: [
          {
            text: 'Introduction',
            collapsed: false,
            items: [
              { text: 'Codex란 무엇인가?', link: '/ko/learn/what-is-codex' },
              { text: '아키텍처', link: '/ko/learn/architecture' },
              { text: '백서', link: '/ko/learn/whitepaper' },
              { text: 'Tokenomics Litepaper', link: '/ko/learn/tokenomics-litepaper' }
            ]
          },
          {
            text: 'Setup Codex with Installer',
            collapsed: false,
            items: [
              { text: '면책 조항', link: '/ko/codex/installer-disclaimer' },
              { text: 'Requirements', link: '/ko/learn/installer/requirements' },
              { text: 'Install and Run Codex', link: '/ko/learn/installer/install-and-run' },
              { text: 'Upload/Download', link: '/ko/learn/installer/upload-and-download' },
            ]
          },
          {
            text: 'Setup Codex Manually',
            collapsed: false,
            items: [
              { text: '면책 조항', link: '/ko/codex/disclaimer' },
              { text: '빠른 시작', link: '/ko/learn/quick-start' },
              { text: 'Build Codex', link: '/ko/learn/build' },
              { text: 'Run Codex', link: '/ko/learn/run' },
              { text: '사용하기', link: '/ko/learn/using' },
              { text: 'Local Two Client Test', link: '/ko/learn/local-two-client-test' },
              { text: 'Local Marketplace', link: '/ko/learn/local-marketplace' },
              { text: 'Download Flow', link: '/ko/learn/download-flow' },
              { text: '문제 해결', link: '/ko/learn/troubleshoot' }
            ]
          },
          {
            text: 'Codex networks',
            collapsed: false,
            items: [
              { text: '테스트넷', link: '/ko/networks/testnet' }
            ]
          },
          {
            text: 'Developers',
            collapsed: false,
            items: [
              { text: 'API', link: '/developers/api' }
            ]
          },
          {
            text: 'Codex',
            collapsed: false,
            items: [
              { text: '소개', link: '/ko/codex/about' },
              { text: '보안', link: '/ko/codex/security' },
              { text: '개인정보 처리방침', link: '/ko/codex/privacy-policy' },
              { text: '이용 약관', link: '/ko/codex/terms-of-use' }
            ]
          }
        ],
      }
    },
    // Spanish
    es: {
      label: 'Español',
      lang: 'es-ES',
      link: '/es',
      themeConfig: {
        nav: [
          { text: 'Whitepaper', link: '/es/learn/whitepaper' },
          { text: 'Tokenomics Litepaper', link: '/es/learn/tokenomics-litepaper' },
          {
            text: 'Codex',
            items: [
              { text: 'Acerca de Codex', link: '/es/codex/about' },
              { text: 'Seguridad', link: '/es/codex/security' },
              { text: 'Política de privacidad', link: '/es/codex/privacy-policy' },
              { text: 'Términos de uso', link: '/es/codex/terms-of-use' }
            ]
          }
        ],
        editLink: {
          pattern: 'https://github.com/codex-storage/codex-docs/edit/master/:path',
          text: 'Redactar esta página en GitHub',
        },
        siteTitle: 'Codex • Documentación',
        logoLink: '/es/learn/what-is-codex',
        sidebar: [
          {
            text: 'Introducción',
            collapsed: false,
            items: [
              { text: '¿Qué es Codex?', link: '/es/learn/what-is-codex' },
              { text: 'Arquitectura', link: '/es/learn/architecture' },
              { text: 'Whitepaper', link: '/es/learn/whitepaper' },
              { text: 'Tokenomics Litepaper', link: '/es/learn/tokenomics-litepaper' }
            ]
          },
          {
            text: 'Instalar Codex manualmente',
            collapsed: false,
            items: [
              { text: 'Descargo de responsabilidad', link: '/es/codex/disclaimer' },
              { text: 'Inicio rápido', link: '/es/learn/quick-start' },
              { text: 'Compilar Codex', link: '/es/learn/build' },
              { text: 'Ejecutar Codex', link: '/es/learn/run' },
              { text: 'Usar Codex', link: '/es/learn/using' },
              { text: 'Prueba local de dos clientes', link: '/es/learn/local-two-client-test' },
              { text: 'Mercado local', link: '/es/learn/local-marketplace' },
              { text: 'Flujo de descarga', link: '/es/learn/download-flow' },
              { text: 'Solucionar problemas', link: '/es/learn/troubleshoot' }
            ]
          },
          {
            text: 'Redes Codex',
            collapsed: false,
            items: [
              { text: 'Devnet', link: '/es/networks/devnet' },
              { text: 'Testnet', link: '/es/networks/testnet' }
            ]
          },
          {
            text: 'Desarrolladores',
            collapsed: false,
            items: [
              { text: 'API', link: '/developers/api' }
            ]
          },
          {
            text: 'Codex',
            collapsed: false,
            items: [{ text: 'Acerca de', link: '/es/codex/about' },
              { text: 'Seguridad', link: '/es/codex/security' },
              { text: 'Política de privacidad', link: '/es/codex/privacy-policy' },
              { text: 'Términos de uso', link: '/es/codex/terms-of-use' }
            ]
          }
        ],
      }
    }
  }
})
