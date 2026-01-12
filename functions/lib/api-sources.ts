// API备份地址配置
// 注意: 这些是基于真实可用的免费API整理的地址

export const API_SOURCES = {
  // 网易云音乐 - 4个备份
  wy: [
    'https://netease-cloud-music-api-rosy-ten.vercel.app',
    'https://music-api-sigma-five.vercel.app',
    'https://netease-api-git-main.vercel.app',
    'https://api.injahow.cn/meting' // 综合API(支持网易)
  ],
  
  // JOOX音乐 - 4个备份
  joox: [
    'https://api.injahow.cn/meting',
    'https://api.bzqll.com/music/tencent',
    'https://music.gdstudio.xyz/api',
    'https://api.xingzhige.com/API/music'
  ],
  
  // 酷我音乐 - 4个备份
  kw: [
    'https://api.injahow.cn/meting',
    'https://music.gdstudio.xyz/api',
    'https://api.xingzhige.com/API/music',
    'https://api.bzqll.com/music/kuwo'
  ],
  
  // 酷狗音乐 - 4个备份 (新增)
  kg: [
    'https://api.injahow.cn/meting',
    'https://music.gdstudio.xyz/api',
    'https://api.xingzhige.com/API/music',
    'https://api.bzqll.com/music/kugou'
  ],
  
  // QQ音乐 - 4个备份 (新增)
  qq: [
    'https://api.injahow.cn/meting',
    'https://api.bzqll.com/music/tencent',
    'https://music.gdstudio.xyz/api',
    'https://api.xingzhige.com/API/music'
  ],
  
  // 咪咕音乐 - 4个备份 (新增)
  mg: [
    'https://api.injahow.cn/meting',
    'https://music.gdstudio.xyz/api',
    'https://api.xingzhige.com/API/music',
    'https://api.bzqll.com/music/migu'
  ]
};

// 当前使用的API索引
let currentAPIIndex: Record<string, number> = {
  wy: 0, joox: 0, kw: 0, kg: 0, qq: 0, mg: 0
};

// 获取当前API地址
export function getCurrentAPI(source: string): string {
  const apis = API_SOURCES[source];
  if (!apis || apis.length === 0) return '';
  return apis[currentAPIIndex[source] || 0];
}

// 切换到下一个备份API
export function switchToNextAPI(source: string): string {
  const apis = API_SOURCES[source];
  if (!apis || apis.length === 0) return '';
  
  currentAPIIndex[source] = (currentAPIIndex[source] + 1) % apis.length;
  console.log(`[${source}] 切换到备份API ${currentAPIIndex[source] + 1}: ${apis[currentAPIIndex[source]]}`);
  return apis[currentAPIIndex[source]];
}

// 重置API索引
export function resetAPIIndex(source: string): void {
  currentAPIIndex[source] = 0;
}
