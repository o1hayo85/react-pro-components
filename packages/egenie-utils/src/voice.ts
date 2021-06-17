import { BaseData, request } from './request';
import { LocalStorageExpire } from './storage';

const voiceCache = new LocalStorageExpire('egenie-voice');
const tokenKey = 'token';
const tokenExpire = 1000 * 60 * 60 * 24;

function playVoice(url: string): void {
  const audio = new Audio();
  audio.src = url;
  audio.autoplay = true;
}

function getVoiceToken(): Promise<string> {
  const token = voiceCache.getItem(tokenKey) as string;
  if (token) {
    return Promise.resolve(token);
  } else {
    return request<BaseData<string>>({ url: '/api/wms/rest/voice/getToken' })
      .then((res) => {
        voiceCache.setItem(tokenKey, res.data || '', tokenExpire);
        return res.data || '';
      });
  }
}

/**
 * @param tex 语音文本
 * @param per 声音类型
 */
export async function getAndPlayVoice(tex: string, per = '0'): Promise<void> {
  if (!tex) {
    return Promise.reject('填写声音');
  }

  const key = `${per}_${tex}`;
  const value = voiceCache.getItem(key) as string;

  if (value) {
    playVoice(value);
  } else {
    const tok = await getVoiceToken();
    const voiceData = {
      tex,
      tok,
      spd: '6',
      ctp: '1',
      per,
      pit: '7',
      vol: '15',
      vt: tex,
    };
    request<BaseData<string>>({
      url: '/api/wms/rest/voice/getVoiceUrl',
      method: 'POST',
      data: voiceData,
    })
      .then((res) => {
        voiceCache.setItem(key, res.data);
        playVoice(res.data);
      });
  }
}
