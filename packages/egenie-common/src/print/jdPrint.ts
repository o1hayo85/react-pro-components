import { message } from 'antd';
import type { PrintAbstract, CommonPrintParams } from './types';
import { getUUID } from './utils';

interface JdParams {

  /**
   * 京东打印自定义数据
   */
  customData?: any;

  /**
   * 京东打印自定义模板URL
   */
  customTempUrl?: string;

  /**
   * 京东打印固定数据
   */
  printData?: any;

  /**
   * 京东固定模板
   */
  tempUrl?: string;

  preview: CommonPrintParams['preview'];
  printer: CommonPrintParams['printer'];
}

interface IParameters {
  printName: string;
  offsetTop?: number;
  offsetLeft?: number;
  tempUrl: string;
  printData: any[];
  customTempUrl?: string;
  customData?: any[];
}

type TOrderType = 'PRE_View' | 'GET_Printers' | 'PRINT';

interface RequestProtocol {
  orderType: TOrderType;
  key?: string;
  parameters: IParameters;
}

interface IPrintResponse {
  code: '2' | '6' | '8';
  success: string;
  message: string;
  key?: string;
  content?: string;
  status?: string;
}

// 预览下载图片地址和图片名
function downloadImage(imgSrc: string, name?: string): void {
  const image = new Image();

  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous');
  image.onload = function() {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width, image.height);
    const url = canvas.toDataURL('image/png'); // 得到图片的base64编码数据
    const a = document.createElement('a'); // 生成一个a元素
    const event = new MouseEvent('click'); // 创建一个单击事件
    a.download = name || '预览图片'; // 设置图片名称
    a.href = url; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  };
  image.src = imgSrc;
}

export class JdPrint implements PrintAbstract {
  constructor(private readonly socketUrl: string, private readonly openError: string) {
  }

  private socket: WebSocket;

  // eslint-disable-next-line @typescript-eslint/ban-types
  private taskRequest = new Map<string, { request: RequestProtocol; resolve?: Function; reject?: Function; }>();

  private taskQueue = [] as RequestProtocol[];

  private connect = () => {
    if (this.socket) {
      return;
    }

    this.socket = new WebSocket(this.socketUrl);

    // 打开Socket
    this.socket.onopen = (event) => {
      console.log(`京东打印 onopen event:${JSON.stringify(event)}`);
      this.refresh();
    };

    // 监听消息
    this.socket.onmessage = this.onmessage;

    // 监听Socket的关闭
    this.socket.onclose = (event) => {
      console.log(`京东打印 onclose event:${JSON.stringify(event)}`);
    };

    // JDprint error
    this.socket.onerror = (event): void => {
      console.log(`browser onerror event:${JSON.stringify(event)}`);
      message.error({
        content: this.openError,
        key: this.openError,
      });

      for (const value of this.taskRequest.values()) {
        if (value.reject) {
          value.reject();
        }
      }

      this.taskRequest.clear();
    };
  };

  private onmessage = (event: MessageEvent) => {
    const response: IPrintResponse = JSON.parse(event.data);
    const {
      reject,
      resolve,
    } = (this.taskRequest.get(response.key) || {});
    const {
      code,
      success,
      content,
    } = response;
    console.log(response, 'response');
    if (success === 'false') {
      const msg = response?.message ?? '请求失败';
      message.error(msg);
      if (reject) {
        reject(msg);
      }
    } else if (success === 'true') {
      // 2：批量推送打印，6：获取打印机列表，8：预览
      // 返回内容，获取打印机时，返回为 打印机逗号分隔字符串；获取预览时，返回为base64格式图片字符串
      if (code === '2') {
        if (resolve) {
          resolve(content);
        }
      } else if (code === '6') {
        if (resolve) {
          resolve(content ? content.split(',') : []);
        }
      } else if (code === '8') {
        if (resolve) {
          downloadImage(`data:image/png;base64, ${content}`);
          resolve(content);

          // TODO: 待处理返回内容   window.open(response.previewURL);
        }
      }
    }

    this.taskRequest.delete(response?.key);
  };

  private isSocketConnected = () => {
    return this.socket && this.socket.readyState === 1;
  };

  private refresh = () => {
    if (this.isSocketConnected()) {
      const taskQueue = this.taskQueue;
      this.taskQueue = [];
      taskQueue.forEach((item) => {
        this.socket.send(JSON.stringify(item));
      });
    }
  };

  public sendToPrinter = (request: RequestProtocol): Promise<any> => {
    this.connect();

    return new Promise((resolve, reject) => {
      this.taskRequest.set(request.key, {
        request,
        resolve,
        reject,
      });

      if (this.isSocketConnected()) {
        this.socket.send(JSON.stringify(request));
      } else {
        this.taskQueue.push(request);
      }
    });
  };

  // 打印机列表
  public getPrinters = (): Promise<string[]> => {
    return this.sendToPrinter(this.getPrintParam('GET_Printers'));
  };

  // 打印
  public print = ({
    printer,
    preview,
    customData,
    customTempUrl,
    printData,
    tempUrl,
  }: JdParams) => {
    return this.sendToPrinter(this.getPrintParam(preview ? 'PRE_View' : 'PRINT', {
      printName: printer,
      customData,
      customTempUrl,
      printData,
      tempUrl,
    }));
  };

  /**
   * 获取请求协议
   */
  private getPrintParam = (cmd: TOrderType, parameters: IParameters = {
    tempUrl: '',
    printName: '',
    printData: [],
  }): RequestProtocol => {
    return {
      orderType: cmd,
      key: getUUID(8, 16),
      parameters,
    };
  };
}
