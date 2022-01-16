// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Wonjun\'s Today I Learned',
  tagline: '우당탕탕 개발새발 일지쓰기',
  url: 'https://wonjun0120/github.io',
  baseUrl: '/til/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'wonjun0120', // Usually your GitHub org/user name.
  projectName: 'til', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://wonjun0120/github.io/til/docs',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://wonjun0120/github.io/til',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Wonjun\'s TIL',
        // logo: {
        //   alt: 'My Site Logo',
        //   src: 'img/logo.svg',
        // },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Project Logs',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/wonjun0120',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Project Logs',
                to: '/docs/intro',
              },
            ],
          },
          // {
          //   title: 'Community',
          //   items: [
          //     {
          //       label: 'Stack Overflow',
          //       href: 'https://stackoverflow.com/questions/tagged/docusaurus',
          //     },
          //     {
          //       label: 'Discord',
          //       href: 'https://discordapp.com/invite/docusaurus',
          //     },
          //     {
          //       label: 'Twitter',
          //       href: 'https://twitter.com/docusaurus',
          //     },
          //   ],
          // },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/wonjun0120',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} wonjun0120, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
