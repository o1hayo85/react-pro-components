import { action, observable, toJS } from 'mobx';
import React from 'react';
import type { SortAndDisplaySettingItem, SortAndDisplaySettingViewProps } from './types';

function cloneData(data: SortAndDisplaySettingItem[]): SortAndDisplaySettingItem[] {
  return (data || []).map((item) => ({
    primaryKey: item.primaryKey,
    label: item.label,
    showItem: Boolean(item.showItem),
    frozen: Boolean(item.frozen),
  }));
}

export class SortAndDisplaySettingModel {
  constructor(originData: SortAndDisplaySettingItem[], initSettingData: SortAndDisplaySettingItem[], callback: SortAndDisplaySettingViewProps['callback']) {
    this.originData = cloneData(originData);
    this.initSettingData = cloneData(initSettingData);
    this.dataSource = cloneData(this.originData);
    this.selectedRowKeys = this.originData.filter((item) => item.showItem)
      .map((item) => item.primaryKey);
    this.callback = callback;
  }

  private callback: SortAndDisplaySettingViewProps['callback'];

  @observable public selectedRowKeys: string[] = [];

  @action public handleSelectedRowKeysChange = (selectedRowKeys: string[]): void => {
    this.selectedRowKeys = selectedRowKeys;
  };

  public originData: SortAndDisplaySettingItem[] = [];

  public initSettingData: SortAndDisplaySettingItem[] = [];

  @observable public dataSource: SortAndDisplaySettingItem[] = [];

  @action public handleInit = () => {
    this.dataSource = cloneData(this.initSettingData);
    this.selectedRowKeys = this.initSettingData.filter((item) => item.showItem)
      .map((item) => item.primaryKey);
  };

  @observable public isSave = false;

  @action public handleSave = () => {
    this.isSave = true;
    const data = this.dataSource.map((item) => toJS(item))
      .map((item) => ({
        ...item,
        showItem: this.selectedRowKeys.includes(item.primaryKey),
      }));
    this.callback(data)
      .finally(() => this.isSave = false);
  };

  @action public moveRow = (dragIndex: number, hoverIndex: number) => {
    const tmp = this.dataSource[dragIndex];
    this.dataSource.splice(dragIndex, 1);
    this.dataSource.splice(hoverIndex, 0, tmp);
  };

  public columns = [
    {
      title: '名称',
      dataIndex: 'label',
      key: 'label',
      width: 200,
      ellipsis: true,
    },
  ];
}
