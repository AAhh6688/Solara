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
    console.error('QQ音乐API错误:', error);
    const nextAPI = switchToNextAPI('qq');
    return new Response(JSON.stringify({ 
      error: '当前API失败,已自动切换备份',
      nextAPI: nextAPI
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function searchSong(url: URL) {
  const keyword = url.searchParams.get('keyword') || '';
  const page = url.searchParams.get('page') || '1';
  
  const apiBase = getCurrentAPI('qq');
  const apiUrl = `${apiBase}?server=tencent&type=search&keyword=${encodeURIComponent(keyword)}&page=${page}`;
  
  const response = await fetch(apiUrl);
  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getSongUrl(url: URL) {
  const id = url.searchParams.get('id') || '';
  
  const apiBase = getCurrentAPI('qq');
  const apiUrl = `${apiBase}?server=tencent&type=url&id=${id}`;
  
  const response = await fetch(apiUrl);
  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getLyric(url: URL) {
  const id = url.searchParams.get('id') || '';
  
  const apiBase = getCurrentAPI('qq');
  const apiUrl = `${apiBase}?server=tencent&type=lrc&id=${id}`;
  
  const response = await fetch(apiUrl);
  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getPlaylist(url: URL) {
  const id = url.searchParams.get('id') || '';
  
  const apiBase = getCurrentAPI('qq');
  const apiUrl = `${apiBase}?server=tencent&type=playlist&id=${id}`;
  
  const response = await fetch(apiUrl);
  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}
