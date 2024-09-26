import { defineConfig } from 'vitepress'

// const { BASE: base = '/' } = process.env;

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  title: 'Codex Docs',
  description: 'Decentralised data storage platform',
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: false,
  appearance: true,
//  base: base,

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
          { text: 'Disclaimer Codex', link: '/codex/disclaimer' },
          { text: 'Quick start', link: '/learn/quick-start' },
          { text: 'Architecture', link: '/learn/architecture' },
          { text: 'Marketplace', link: '/learn/marketplace' },
          { text: 'Whitepaper', link: '/learn/whitepaper' },
          { text: 'Build Codex', link: '/learn/build' },
          { text: 'Run Codex', link: '/learn/run' }
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
  }
})
