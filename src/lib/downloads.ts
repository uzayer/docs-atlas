/**
 * Where Atlas is downloaded from: the GitHub releases of pacifio/atlas.
 *
 * The single source of truth for every install link on the site. The landing
 * page (atlas repo, landing/index.html) and the credits site hard-code the
 * same release, so when a release ships, bump the tag and file names here in
 * the same breath as those two.
 *
 * Asset names are not stable across releases (they carry the version), so
 * there is no `releases/latest/download/<name>` shortcut. The Linux files
 * can live on a different release from the macOS and Windows ones:
 * alpha-0.4.1-org-agent carries no Linux files, so Linux comes from
 * alpha-0.4.1. Copy each name from the release page, never from a pattern.
 */

export const RELEASES_URL = 'https://github.com/pacifio/atlas/releases';

const TAG = 'alpha-0.4.1-org-agent';
const LINUX_TAG = 'alpha-0.4.1';
const asset = (name: string, tag: string = TAG) => `${RELEASES_URL}/download/${tag}/${name}`;
const linuxAsset = (name: string) => asset(name, LINUX_TAG);

export const LATEST_RELEASE = {
  tag: TAG,
  version: '0.4.1',
  url: `${RELEASES_URL}/tag/${TAG}`,
} as const;

export type Platform = 'macos' | 'windows' | 'linux';

export type Download = {
  /** What the button says. */
  label: string;
  /** A short qualifier under or beside the label. */
  detail?: string;
  href: string;
};

export type PlatformDownloads = {
  name: string;
  requirement: string;
  /** The first entry is the primary button; the rest are secondary. */
  downloads: Download[];
};

export const DOWNLOADS: Record<Platform, PlatformDownloads> = {
  macos: {
    name: 'macOS',
    requirement: 'macOS 11 or later',
    downloads: [
      { label: 'Apple silicon', detail: '.dmg', href: asset('Atlas_0.4.1_aarch64.dmg') },
      { label: 'Intel', detail: '.dmg', href: asset('Atlas_0.4.1_x86_64.dmg') },
    ],
  },
  windows: {
    name: 'Windows',
    requirement: 'Windows 10 or later, x64',
    downloads: [{ label: 'Windows', detail: '.msi', href: asset('Atlas_0.4.1_x64_en-US.msi') }],
  },
  linux: {
    name: 'Linux',
    requirement: 'x86-64 with WebKitGTK 4.1',
    downloads: [
      { label: 'Debian, Ubuntu', detail: '.deb', href: linuxAsset('tryatlas_0.4.1_amd64.deb') },
      { label: 'Fedora, openSUSE', detail: '.rpm', href: linuxAsset('tryatlas-0.4.1-1.x86_64.rpm') },
      { label: 'Arch', detail: '.pkg.tar.zst', href: linuxAsset('tryatlas-bin-0.4.1-1-x86_64.pkg.tar.zst') },
      { label: 'AppImage', detail: '.AppImage', href: linuxAsset('tryatlas_0.4.1_amd64.AppImage') },
      { label: 'Tarball', detail: '.tar.gz', href: linuxAsset('atlas-0.4.1-linux-x86_64.tar.gz') },
    ],
  },
};
