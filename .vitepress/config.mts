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
    }
  }
})
