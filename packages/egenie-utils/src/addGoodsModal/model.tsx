import { Button, message } from 'antd';
import { action, observable, toJS } from 'mobx';
import React from 'react';
import { ImgFormatter, MainSubStructureModel } from '../egGrid';
import { request, PaginationData } from '../request';
import { GoodsItem } from './addGoodsModal';

export const selectData = {
  skuNo: {
    value: 'skuNo',
    label: 'sku编码',
  },
  productNo: {
    value: 'productNo',
    label: '商品编码',
  },
};

export class Store {
  constructor(showTmp: boolean, callback?: (rows: GoodsItem[]) => void) {
    this.showTmp = showTmp;
    this.callback = callback;
    this.goodsStore = new MainSubStructureModel({
      grid: {
        columns: [
          this.showTmp && {
            key: 'onlyCode',
            name: '操作',
            formatter: ({ row }) => {
              return (
                <Button
                  onClick={() => this.handleAdd([row])}
                  type="link"
                >
                  添加
                </Button>
              );
            },
          },
          {
            key: 'pic',
            name: '图片',
            formatter: ({ row }) => {
              return <ImgFormatter value={row.pic}/>;
            },
          },
          {
            key: 'productNo',
            name: '商品编码',
          },
          {
            key: 'skuNo',
            name: 'sku编码',
          },
          {
            key: 'colorType',
            name: '颜色',
          },
          {
            key: 'sizeType',
            name: '尺码',
          },
        ].filter(Boolean)
          .map((v) => ({
            resizable: false,
            sortable: false,
            ...v,
          })),
        rows: [],
        primaryKeyField: 'id',
        sortByLocal: false,
      },
      api: {
        onQuery: (params) => {
          if (this.selectValue && this.inputValue) {
            const {
              filterParams = {},
              ...rest
            } = params;
            return request<PaginationData<GoodsItem>>({
              url: '/api/baseinfo/rest/sku/findByConditions',
              method: 'POST',
              data: {
                ...filterParams,
                ...rest,
                [this.selectValue]: this.inputValue,
              },
            });
          } else {
            message.error('请输入查询条件');
            return Promise.reject();
          }
        },
      },
      hiddenSubTable: true,
    });
    this.tmpStore = new MainSubStructureModel({
      grid: {
        columns: [
          {
            key: 'onlyCode',
            name: '操作',
            formatter: ({ row }) => {
              return (
                <Button
                  onClick={() => this.handleDelete(row)}
                  type="link"
                >
                  删除
                </Button>
              );
            },
          },
          {
            key: 'pic',
            name: '图片',
            formatter: ({ row }) => {
              return <ImgFormatter value={row.pic}/>;
            },
          },
          {
            key: 'productNo',
            name: '商品编码',
          },
          {
            key: 'skuNo',
            name: 'sku编码',
          },
          {
            key: 'colorType',
            name: '颜色',
          },
          {
            key: 'sizeType',
            name: '尺码',
          },
        ].map((v) => ({
          resizable: false,
          sortable: false,
          ...v,
        })),
        rows: [],
        primaryKeyField: 'id',
        sortByLocal: false,
        showPager: false,
        showCheckBox: false,
      },
      api: {
        onQuery: (params) => {
          return Promise.reject();
        },
      },

      hiddenSubTable: true,
    });
  }

  @action public handleSave = () => {
    if (this.showTmp) {
      if (typeof this.callback === 'function') {
        this.callback(toJS(this.tmpStore.gridModel.rows));
      }
    } else {
      if (typeof this.callback === 'function') {
        this.callback(toJS(this.goodsStore.gridModel.selectRows));
      }
    }
  };

  public callback?: (rows: GoodsItem[]) => void;

  public showTmp: boolean;

  public goodsStore: MainSubStructureModel;

  public tmpStore: MainSubStructureModel;

  @observable public selectValue = selectData.skuNo.value;

  @action public handleSelectValueChange = (selectValue: string) => {
    this.selectValue = selectValue;
  };

  @observable public inputValue = '';

  @action public handleInputValueChange = (inputValue: string) => {
    this.inputValue = inputValue;
  };

  @action
  public handleAdd = (rows: GoodsItem[]) => {
    rows.forEach((item) => {
      if (!this.tmpStore.gridModel.rows.find((val) => val.id === item.id)) {
        this.tmpStore.gridModel.rows.push(item);
      }
    });
  };

  @action
  public handleDelete = (row: GoodsItem) => {
    this.tmpStore.gridModel.rows = this.tmpStore.gridModel.rows.filter((item) => item.id !== row.id);
  };
}
