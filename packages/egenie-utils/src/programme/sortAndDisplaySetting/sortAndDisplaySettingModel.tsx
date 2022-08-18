import { action, observable, toJS } from 'mobx';
import React from 'react';
import type { SortAndDisplaySettingItem, SortAndDisplaySettingViewProps } from './types';

export class SortAndDisplaySettingModel {
  constructor(originData: SortAndDisplaySettingItem[], initSettingData: SortAndDisplaySettingItem[], callback: SortAndDisplaySettingViewProps['callback']) {
    this.originData = JSON.parse(JSON.stringify(originData));
    this.initSettingData = JSON.parse(JSON.stringify(initSettingData));
    this.callback = callback;
    this.handleReset();
  }

  private callback: SortAndDisplaySettingViewProps['callback'];

  @observable public selectedRowKeys: string[] = [];

  @action public onChange = (selectedRowKeys: string[]): void => {
    this.selectedRowKeys = selectedRowKeys;
  };

  public originData: SortAndDisplaySettingItem[] = [];

  public initSettingData: SortAndDisplaySettingItem[] = [];

  @observable public dataSource: SortAndDisplaySettingItem[] = [];

  @action public handleReset = () => {
    this.dataSource = JSON.parse(JSON.stringify(this.originData));
    this.selectedRowKeys = this.originData.filter((item) => item.showItem)
      .map((item) => item.field);
  };

  @action public handleInit = () => {
    this.dataSource = JSON.parse(JSON.stringify(this.initSettingData));
    this.selectedRowKeys = this.initSettingData.filter((item) => item.showItem)
      .map((item) => item.field);
  };

  @observable public isSave = false;

  @action public handleSave = () => {
    this.isSave = true;
    const data = this.dataSource.map((item) => toJS(item))
      .map((item) => ({
        ...item,
        showItem: this.selectedRowKeys.includes(item.field),
      }));
    this.callback(data)
      .finally(() => this.isSave = false);
  };

  @action public moveRow = (dragIndex: number, hoverIndex: number) => {
    const tmp = this.dataSource[dragIndex];
    this.dataSource.splice(dragIndex, 1);
    this.dataSource.splice(hoverIndex, 0, tmp);
  };

  public get columns() {
    return [
      {
        title: '名称',
        dataIndex: 'label',
        key: 'label',
        width: 200,
        ellipsis: true,
      },
    ];
  }
}
