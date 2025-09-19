// import { defineConfig } from 'vitepress'
import mdFootnote from 'markdown-it-footnote'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { generateVersionRewrites, generateVersionSidebars, generateVersionSwitcher, LATEST_VERSION } from './data/versions'
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

  rewrites: {
    ...generateVersionRewrites()
  },

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
      },
      generateVersionSwitcher()
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

    sidebar: {
      ...generateVersionSidebars()
    },

    logoLink: `/versions/${LATEST_VERSION}/learn/what-is-codex`,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/codex-storage/codex-docs' },
      { icon: 'twitter', link: 'https://twitter.com/Codex_storage' },
      { icon: 'youtube', link: 'https://www.youtube.com/@CodexStorage' },
      { icon: 'discord', link: 'https://discord.gg/codex-storage' }
    ]
  }
});
