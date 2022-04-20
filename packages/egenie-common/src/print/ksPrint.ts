import { message } from 'antd';
import type { KSPrintParams } from './types';
import { getUUID, isSocketConnected, validateData } from './utils';

interface RequestProtocol {
  cmd: string;
  version: string;
  requestID: string;

  [key: string]: any;
}

export class KsPrint {
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

    this.socket = new WebSocket(`ws://${this.host}:${this.port}/ks/printer`);

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
    if (requestIDItem == null) {
      return;
    }

    if (response.cmd === 'getPrinters') {
      requestIDItem.resolve((response.printers || []).map((item: { name: string; }) => item.name));
      this.taskRequest.delete(response.requestID);
    } else if (response.cmd === 'print') {
      if (response.status !== 'success') {
        const msg = response.msg || '任务提交失败';
        message.error(msg);
        requestIDItem.reject(msg);
        this.taskRequest.delete(response.requestID);
      }
    } else if (response.cmd === 'notifyPrintResult') {
      if (response.taskStatus === 'printed') {
        requestIDItem.resolve();
      } else {
        const msg = response.msg || '打印失败';
        message.error(msg);
        requestIDItem.reject(msg);
      }
      this.taskRequest.delete(response.requestID);
    }
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
  public print = async({
    preview,
    contents,
    printer,
  }: Omit<KSPrintParams, 'count'>): Promise<any> => {
    await validateData(contents);
    return this.sendToPrinter<any>({
      cmd: 'print',
      requestID: getUUID(),
      version: '1.0',
      task: {
        taskID: getUUID(),
        printer,
        documents: contents,
      },
    });
  };
}
