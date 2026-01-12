import { getCurrentAPI, switchToNextAPI } from '../lib/api-sources';

export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  
  try {
    switch (action) {
      case 'search':
        return await searchSong(url);
      case 'url':
        return await getSongUrl(url);
      case 'lyric':
        return await getLyric(url);
      case 'playlist':
        return await getPlaylist(url);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error: any) {
    console.error('酷狗API错误:', error);
    
    // 尝试切换到下一个备份API
    const nextAPI = switchToNextAPI('kg');
    return new Response(JSON.stringify({ 
      error: '当前API失败,已自动切换备份',
      nextAPI: nextAPI
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 搜索歌曲
async function searchSong(url: URL) {
  const keyword = url.searchParams.get('keyword') || '';
  const page = url.searchParams.get('page') || '1';
  
  const apiBase = getCurrentAPI('kg');
  const apiUrl = `${apiBase}?server=kugou&type=search&keyword=${encodeURIComponent(keyword)}&page=${page}`;
  
  const response = await fetch(apiUrl);
  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// 获取播放地址
async function getSongUrl(url: URL) {
  const id = url.searchParams.get('id') || '';
  
  const apiBase = getCurrentAPI('kg');
  const apiUrl = `${apiBase}?server=kugou&type=url&id=${id}`;
  
  const response = await fetch(apiUrl);
  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// 获取歌词
async function getLyric(url: URL) {
  const id = url.searchParams.get('id') || '';
  
  const apiBase = getCurrentAPI('kg');
  const apiUrl = `${apiBase}?server=kugou&type=lrc&id=${id}`;
  
  const response = await fetch(apiUrl);
  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// 获取歌单
async function getPlaylist(url: URL) {
  const id = url.searchParams.get('id') || '';
  
  const apiBase = getCurrentAPI('kg');
  const apiUrl = `${apiBase}?server=kugou&type=playlist&id=${id}`;
  
  const response = await fetch(apiUrl);
  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}
