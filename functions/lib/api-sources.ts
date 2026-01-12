export const API_SOURCES = {
  wy: [
    'https://netease-cloud-music-api-rosy-ten.vercel.app',
    'https://music-api-sigma-five.vercel.app',
    'https://netease-api-git-main.vercel.app',
    'https://api.injahow.cn/meting'
  ],
  joox: [
    'https://api.injahow.cn/meting',
    'https://api.bzqll.com/music/tencent',
    'https://music.gdstudio.xyz/api',
    'https://api.xingzhige.com/API/music'
  ],
  kw: [
    'https://api.injahow.cn/meting',
    'https://music.gdstudio.xyz/api',
    'https://api.xingzhige.com/API/music',
    'https://api.bzqll.com/music/kuwo'
  ],
  kg: [
    'https://api.injahow.cn/meting',
    'https://music.gdstudio.xyz/api',
    'https://api.xingzhige.com/API/music',
    'https://api.bzqll.com/music/kugou'
  ],
  qq: [
    'https://api.injahow.cn/meting',
    'https://api.bzqll.com/music/tencent',
    'https://music.gdstudio.xyz/api',
    'https://api.xingzhige.com/API/music'
  ],
  mg: [
    'https://api.injahow.cn/meting',
    'https://music.gdstudio.xyz/api',
    'https://api.xingzhige.com/API/music',
    'https://api.bzqll.com/music/migu'
  ]
};

let currentAPIIndex: Record<string, number> = {
  wy: 0, joox: 0, kw: 0, kg: 0, qq: 0, mg: 0
};

export function getCurrentAPI(source: string): string {
  const apis = API_SOURCES[source];
  if (!apis || apis.length === 0) return '';
  return apis[currentAPIIndex[source] || 0];
}

export function switchToNextAPI(source: string): string {
  const apis = API_SOURCES[source];
  if (!apis || apis.length === 0) return '';
  currentAPIIndex[source] = (currentAPIIndex[source] + 1) % apis.length;
  return apis[currentAPIIndex[source]];
}

export function resetAPIIndex(source: string): void {
  currentAPIIndex[source] = 0;
}
