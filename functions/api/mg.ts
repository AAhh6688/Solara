import { getNextAPI, MUSIC_SOURCES } from '../lib/music-sources';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  
  try {
    const apiBase = MUSIC_SOURCES.mg[0];
    
    switch (action) {
      case 'search':
        const keyword = url.searchParams.get('keyword');
        return await searchSong(apiBase, keyword);
      case 'url':
        const id = url.searchParams.get('id');
        return await getSongUrl(apiBase, id);
      case 'lyric':
        const songId = url.searchParams.get('id');
        return await getLyric(apiBase, songId);
      case 'playlist':
        const playlistId = url.searchParams.get('id');
        return await getPlaylist(apiBase, playlistId);
      default:
        return new Response('Invalid action', { status: 400 });
    }
  } catch (error) {
    const nextAPI = getNextAPI('mg');
    console.log(`咪咕音乐API失败,切换到备份: ${nextAPI}`);
    return new Response(JSON.stringify({ error: 'API失败' }), { status: 500 });
  }
}

async function searchSong(apiBase: string, keyword: string) {
  const response = await fetch(`${apiBase}/search?keyword=${encodeURIComponent(keyword)}`);
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getSongUrl(apiBase: string, id: string) {
  const response = await fetch(`${apiBase}/song?id=${id}`);
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getLyric(apiBase: string, id: string) {
  const response = await fetch(`${apiBase}/lyric?id=${id}`);
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getPlaylist(apiBase: string, id: string) {
  const response = await fetch(`${apiBase}/playlist?id=${id}`);
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}
