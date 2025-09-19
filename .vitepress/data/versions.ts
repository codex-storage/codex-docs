import fs from "node:fs"
import path from "node:path"
import { DefaultTheme } from "vitepress/theme"
import util from "node:util"

export const LATEST_VERSION = '0.0.1'

export interface VersionInformation {
  name: string,
  sidebar: DefaultTheme.SidebarItem,
}

function getFilesRecursively(dir: string): string[] {
  const files: string[] = [];

  function traverseDirectory(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = `${currentDir}/${entry.name}`;

      if (entry.isDirectory()) {
        traverseDirectory(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }

  traverseDirectory(dir);

  return files;
}

/**
 * Generates vitepress rewrites for all versions in the "versions" folder.
 * The rewrites are used to format the URLs in `versions` to be more user-friendly.
 * @returns {Record<string, string>} A map of rewrite sources to their destinations.
 */
export function generateVersionRewrites(): Record<string, string> {
  const versionsDir = path.resolve(__dirname, '../../versions')
  const versions = fs.readdirSync(versionsDir)
  const rewrites = {};

  // Generate rewrites for each version's files.
  for (const version of versions) {
    // Get all files recursively in the version folder
    const files = getFilesRecursively(path.resolve(versionsDir, version));
    const rewriteSources = files.map(filePath => filePath.replace(versionsDir, 'versions'));
    for (const rewriteSource of rewriteSources) {
      rewrites[rewriteSource] = rewriteSource.replace(`versions/`, '');
    }
  }

  console.log(rewrites);
  return rewrites
}

/**
 * Generates a nav item for the version switcher, which contains all versions in the "versions" folder and the latest version.
 * @returns {DefaultTheme.NavItem} A nav item that contains all versions in the "versions" folder.
 */
export function generateVersionSwitcher(): DefaultTheme.NavItem {
  const versionsDir = path.resolve(__dirname, '../../versions')
  const versions = fs.readdirSync(versionsDir)

  const versionSwitcher: DefaultTheme.NavItem = {
    text: 'Switch Version',
    items: [
      {
        text: `${LATEST_VERSION} (latest)`,
        link: `/versions/${LATEST_VERSION}`
      }
    ]
  }

  for (const version of versions) {
    versionSwitcher.items.push({
      text: version,
      link: `/versions/${version}/`
    })
  }

  return versionSwitcher;
}

/**
 * Replaces all links in the sidebar with their versioned equivalents.
 * @example `{link: '/test'}` becomes `{link: '/0.1.0/test'}`
 * @param sidebar The sidebar to replace links in.
 * @param version The version to prepend to all links.
 * @returns {DefaultTheme.SidebarItem[]} The sidebar with all links prepended with the version.
 */
function replaceLinksRecursive(sidebar: DefaultTheme.SidebarItem[], version: string): DefaultTheme.SidebarItem[] {
  // Prepend the version to all links. `{VERSION}/$link`
  const versionedSidebar = sidebar.map(item => {
    // @ts-ignore
    if (item.process === false) return item;

    if (item.link) {
      item.link = `/versions/${version}${item.link}`
    }

    if (item.items) {
      item.items = replaceLinksRecursive(item.items, version)
    }

    return item
  })

  return versionedSidebar
}

/**
 * Gets the sidebar for a specific version.
 * This function will look for a sidebar.json5 file in the specified version's folder, or else return an empty sidebar.
 * @param version Get the sidebar for a specific version.
 * @returns {DefaultTheme.SidebarItem[]} The sidebar for the specified version.
 */
export function getSidebar(version: string): DefaultTheme.SidebarItem[] | DefaultTheme.SidebarMulti {
  const versionDir = path.resolve(__dirname, `../../versions/${version}`)
  const sidebarPath = path.resolve(versionDir, 'sidebar.json')

  if (fs.existsSync(sidebarPath)) {
    const sidebar = JSON.parse(fs.readFileSync(sidebarPath, 'utf-8'))

    if (!Array.isArray(sidebar)) {
      // Must be a multisidebar instance.
      const multisidebar = sidebar as DefaultTheme.SidebarMulti;

      // Replace all links in the sidebar with their versioned equivalents.
      Object.keys(multisidebar).forEach(key => {
        multisidebar[key] = replaceLinksRecursive(multisidebar[key] as DefaultTheme.SidebarItem[], version)
      });

      return multisidebar;
    }

    // Replace all links in the sidebar with their versioned equivalents.
    return replaceLinksRecursive(sidebar, version)
  }

  return [];
}

/**
 * Generates a sidebar for each version in the "versions" folder.
 * @returns {DefaultTheme.SidebarMulti} A map of versions to their sidebars.
 */
export function generateVersionSidebars(): DefaultTheme.SidebarMulti {
  const versionsDir = path.resolve(__dirname, '../../versions')
  const versions = fs.readdirSync(versionsDir)

  const versionSidebars: DefaultTheme.SidebarMulti = {}

  for (const version of versions) {
    const versionSidebar = getSidebar(version);

    if (Array.isArray(versionSidebar)) {
      versionSidebars[`/versions/${version}/`] = versionSidebar as DefaultTheme.SidebarItem[]
    } else {
      Object.keys(versionSidebar).forEach(key => {
        versionSidebars[`/versions/${version}${key}`] = versionSidebar[key] as DefaultTheme.SidebarItem[]
      });
    }
  }

  console.log(util.inspect(versionSidebars, false, null, true))

  return versionSidebars
}
