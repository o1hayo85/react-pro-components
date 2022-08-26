import { Checkbox, Tooltip } from 'antd';
import _ from 'lodash';
import { action, observable, toJS } from 'mobx';
import { Observer } from 'mobx-react';
import React from 'react';
import styles from './sortAndDisplaySetting.less';
import type { SortAndDisplaySettingItem, SortAndDisplaySettingViewProps } from './types';

function cloneData(data: SortAndDisplaySettingItem[]): SortAndDisplaySettingItem[] {
  return (data || []).map((item, index) => ({
    primaryKey: item.primaryKey,
    label: item.label,
    showItem: Boolean(item.showItem),
    frozen: Boolean(item.frozen),
    ...item,
  }));
}

export class SortAndDisplaySettingModel {
  constructor(options: Pick<SortAndDisplaySettingViewProps, 'initSettingData' | 'originData' | 'callback' | 'renderLabel'>) {
    this.originData = cloneData(options.originData);
    this.initSettingData = cloneData(options.initSettingData);
    this.dataSource = cloneData(this.originData);
    this.frozenLastIndex = _.findLastIndex(this.originData, (item) => item.frozen);

    this.callback = options.callback;
    this.renderLabel = options.renderLabel;
  }

  public readonly frozenLastIndex: number = -1;

  private readonly callback: SortAndDisplaySettingViewProps['callback'];

  private readonly renderLabel?: SortAndDisplaySettingViewProps['renderLabel'];

  public readonly originData: SortAndDisplaySettingItem[] = [];

  public readonly initSettingData: SortAndDisplaySettingItem[] = [];

  @observable public dataSource: SortAndDisplaySettingItem[] = [];

  @action public handleInit = () => {
    this.dataSource = cloneData(this.initSettingData);
  };

  @observable public isSave = false;

  @action public handleSave = () => {
    this.isSave = true;
    const data = toJS(this.dataSource);
    this.callback(data)
      .finally(() => this.isSave = false);
  };

  // 冻结列不允许拖拽,也不允许拖拽到其前
  @action public moveRow = (dragIndex: number, hoverIndex: number): void => {
    if (dragIndex <= this.frozenLastIndex || dragIndex >= this.dataSource.length) {
      return;
    }

    if (hoverIndex <= this.frozenLastIndex) {
      hoverIndex = this.frozenLastIndex + 1;
    }

    if (hoverIndex >= this.dataSource.length) {
      return;
    }

    const tmp = this.dataSource[dragIndex];
    this.dataSource.splice(dragIndex, 1);
    this.dataSource.splice(hoverIndex, 0, tmp);
  };

  @action public handlePlacement = (index: number): void => {
    this.moveRow(index, this.frozenLastIndex + 1);
  };

  public columns = [
    {
      title: '显隐',
      dataIndex: 'primaryKey',
      width: 50,
      render: (_: string, __: SortAndDisplaySettingItem, index: number) => {
        return (
          <Observer>
            {
              () => (
                <Checkbox
                  checked={this.dataSource[index].showItem}
                  disabled={this.dataSource[index].frozen}
                  onChange={(event) => this.dataSource[index].showItem = event.target.checked}
                />
              )
            }
          </Observer>
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'label',
      width: 250,
      ellipsis: true,
      render: (_: string, record: SortAndDisplaySettingItem) => {
        if (typeof this.renderLabel === 'function') {
          return this.renderLabel(record);
        } else {
          return record.label;
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width: 100,
      align: 'center',
      render: (_: string, record: SortAndDisplaySettingItem, index: number) => {
        if (record.frozen) {
          return null;
        }

        return (
          <>
            <Tooltip
              arrowPointAtCenter
              title="拖拽排序"
            >
              <i className={`icon-icon-px01 ${styles.icon}`}/>
            </Tooltip>
            &nbsp;
            &nbsp;
            <Tooltip
              arrowPointAtCenter
              title="置顶"
            >
              <i
                className={`icon-icon-zd01 ${styles.icon}`}
                onClick={() => this.handlePlacement(index)}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];
}
