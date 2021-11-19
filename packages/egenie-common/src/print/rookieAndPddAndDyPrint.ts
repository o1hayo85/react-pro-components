import { message } from 'antd';
import type { RookiePrintParams } from './printHelper';
import { getUUID, isSocketConnected } from './utils';

interface RequestProtocol {
  cmd: string;
  version: string;
  requestID: string;
  [key: string]: any;
}

export class RookieAndPddAndDyPrint {
  constructor(host: string, port: number, openError: string) {
    this.host = host;
    this.port = port;
    this.openError = openError;
  }

  private openError: string;

  private readonly host: string;

  private readonly port: number;

  private socket: WebSocket;

  // eslint-disable-next-line @typescript-eslint/ban-types
  private taskRequest = new Map<string, { request: RequestProtocol; resolve?: Function; reject?: Function; }>();

  private taskQueue: RequestProtocol[] = [];

  private sendToPrinter<T = unknown>(request: RequestProtocol): Promise<T> {
    this.doConnect();

    return new Promise((resolve, reject) => {
      this.taskRequest.set(request.requestID, {
        request,
        resolve,
        reject,
      });

      if (isSocketConnected(this.socket, this.openError)) {
        this.socket.send(JSON.stringify(request));
      } else {
        this.taskQueue.push(request);
      }
    });
  }

  private doConnect = () => {
    if (this.socket) {
      return;
    }

    this.socket = new WebSocket(`ws://${this.host}:${this.port}`);

    // open
    this.socket.onopen = (event) => {
      console.log(`browser onopen event:${JSON.stringify(event)}`);

      this.refresh();
    };

    // 错误
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

    // 关闭
    this.socket.onclose = (event) => {
      console.log(`browser onclose event:${JSON.stringify(event)}`);
    };

    // 监听消息
    this.socket.onmessage = this.onmessage;
  };

  private refresh = () => {
    if (isSocketConnected(this.socket, this.openError)) {
      const taskQueue = this.taskQueue;
      this.taskQueue = [];
      taskQueue.forEach((item) => {
        this.socket.send(JSON.stringify(item));
      });
    }
  };

  private onmessage = (event: MessageEvent) => {
    const response = JSON.parse(event.data);
    const requestIDItem = this.taskRequest.get(response.requestID);
    if (response.status === 'failed') {
      if ([
        'notifyPrintResult',
        'PrintResultNotify',
      ].includes(response.cmd)) {
        const msg = response?.printStatus?.[0]?.msg ?? '请求失败';
        message.error(msg);
        if (requestIDItem && requestIDItem.reject) {
          requestIDItem.reject(msg);
        }
      } else {
        const msg = response?.msg ?? '请求失败';
        message.error(msg);
        if (requestIDItem && requestIDItem.reject) {
          requestIDItem.reject(msg);
        }
      }
    } else if (response.status === 'success') {
      if (response.cmd === 'print') {
        if (response.previewURL) {
          if (requestIDItem && requestIDItem.resolve) {
            requestIDItem.resolve(response.previewURL);
          }
          window.open(response.previewURL);
        } else {
          if (requestIDItem && requestIDItem.resolve) {
            requestIDItem.resolve(response);
          }
        }
      } else if (response.cmd === 'getPrinters') {
        if (requestIDItem && requestIDItem.resolve) {
          requestIDItem.resolve((response.printers || []).map((item: { name: string; }) => item.name));
        }
      } else {
        // 暂时只考虑获取打印机列表和打印成功
      }
    }

    this.taskRequest.delete(response?.requestID);
  };

  /**
   * 获取打印机列表
   */
  public getPrinters = (): Promise<string[]> => {
    return this.sendToPrinter<string[]>({
      requestID: getUUID(),
      version: '1.0',
      cmd: 'getPrinters',
    });
  };

  /**
   * 打印
   * @param preview 是否预览
   * @param contents 打印数据
   * @param printer 打印机
   */
  public print = ({
    preview,
    contents,
    printer,
  }: Omit<RookiePrintParams, 'count'>): Promise<any> => {
    if (Array.isArray(contents) && contents.length) {
      const request = {
        cmd: 'print',
        requestID: getUUID(),
        version: '1.0',
        task: {
          taskID: getUUID(),
          preview: Boolean(preview),
          previewType: 'pdf',
          printer,
          notifyType: ['print'],
          documents: contents,
        },
      };
      return this.sendToPrinter<any>(request);
    } else {
      message.warning({
        key: '没数据',
        content: '没数据',
      });
      return Promise.reject();
    }
  };
}
