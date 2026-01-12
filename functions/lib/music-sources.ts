// 音源备份配置 - 每个平台4个备份接口
export const MUSIC_SOURCES = {
  // 网易云音乐 - 4个备份API
  wy: [
    'https://api1.example.com',
    'https://api2.example.com', 
    'https://api3.example.com',
    'https://api4.example.com'
  ],
  
  // JOOX音乐 - 4个备份API
  joox: [
    'https://joox-api1.example.com',
    'https://joox-api2.example.com',
    'https://joox-api3.example.com',
    'https://joox-api4.example.com'
  ],
  
  // 酷我音乐 - 4个备份API
  kw: [
    'https://kuwo-api1.example.com',
    'https://kuwo-api2.example.com',
    'https://kuwo-api3.example.com',
    'https://kuwo-api4.example.com'
  ],
  
  // 酷狗音乐 - 4个备份API (新增)
  kg: [
    'https://kugou-api1.example.com',
    'https://kugou-api2.example.com',
    'https://kugou-api3.example.com',
    'https://kugou-api4.example.com'
  ],
  
  // QQ音乐 - 4个备份API (新增)
  qq: [
    'https://qq-music-api1.example.com',
    'https://qq-music-api2.example.com',
    'https://qq-music-api3.example.com',
    'https://qq-music-api4.example.com'
  ],
  
  // 咪咕音乐 - 4个备份API (新增)
  mg: [
    'https://migu-api1.example.com',
    'https://migu-api2.example.com',
    'https://migu-api3.example.com',
    'https://migu-api4.example.com'
  ]
};

// 当前使用的API索引 (用于失败后切换)
export const currentAPIIndex = {
  wy: 0, joox: 0, kw: 0, kg: 0, qq: 0, mg: 0
};

// 获取下一个备份API
export function getNextAPI(source: string): string {
  const apis = MUSIC_SOURCES[source];
  if (!apis) return '';
  
  currentAPIIndex[source] = (currentAPIIndex[source] + 1) % apis.length;
  return apis[currentAPIIndex[source]];
}
