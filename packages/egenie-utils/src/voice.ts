import { BaseData, request } from './request';

let token = '';
const voiceList = new Map<string, string>();

function playVoice(url: string): void {
  const audio = new Audio();
  audio.src = url;
  audio.autoplay = true;
}

/**
 * 获取声音token
 */
function getVoiceToken(): Promise<string> {
  if (token) {
    return Promise.resolve(token);
  } else {
    return request<BaseData<string>>({ url: '/api/wms/rest/voice/getToken' })
      .then((res) => {
        token = res.data || '';
        return token;
      });
  }
}

/**
 * 暂时放内存缓存，后期考虑localStorage做缓存
 * @param tex 语音文本
 * @param per 声音类型
 */
export async function getAndPlayVoice(tex: string, per = '0'): Promise<void> {
  if (!tex) {
    return Promise.reject('填写声音');
  }

  const nameKey = `${per}_${tex}`;
  if (voiceList.has(nameKey)) {
    playVoice(voiceList.get(nameKey));
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
        voiceList.set(nameKey, res.data);
        playVoice(res.data);
      });
  }
}
