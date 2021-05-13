import { Button, Input, Modal, Select } from 'antd';
import { inject, observer, Provider } from 'mobx-react';
import React from 'react';
import { EgGrid } from '../egGrid';
import styles from './addGoodsModal.less';
import { selectData, Store } from './model';

export interface GoodsItem {
  id?: number;
  pic?: string;
  skuNo?: string;
  barCode?: string;
  colorType?: string;
  sizeType?: string;
  color?: string;
  size?: string;
  sellerOuterNo?: string;
  salePrice?: number;
  costPrice?: string;
  distributionPrice?: string;
  tenantId?: boolean;
  productName?: string;
  productNo?: string;
  productId?: number;
  vendorId?: number;
  vendorName?: string;
  ownerId?: number;
  costPriceUpdateTime?: string;
  productPic?: string;
  enabled?: boolean;
  usable?: boolean;
  donation?: boolean;
}

export interface AddGoodsModalProps {

  /**
   * antd-Modal的props。取消的回掉自写,外层控制Modal的显隐
   */
  modalProps: React.ComponentProps<typeof Modal>;

  /**
   * 是否展示临时表格(子表)
   */
  showTmp?: boolean;

  /**
   * 保存的回掉。数据处理自写
   * @param rows
   */
  callback?: (rows: GoodsItem[]) => void;
}

export class AddGoodsModal extends React.Component<AddGoodsModalProps> {
  constructor(props) {
    super(props);
    this.store = new Store(props.showTmp !== false, props.callback);
  }

  public store: Store;

  render() {
    const {
      store,
      props: { modalProps },
    } = this;
    return (
      <Provider store={store}>
        <Modal
          className={styles.container}
          closable
          maskClosable={false}
          style={{ height: 740 }}
          visible
          width={1000}
          {...modalProps}
          onOk={store.handleSave}
        >
          <ModalHeader/>
          <GridWrapper/>
        </Modal>
      </Provider>
    );
  }
}

@inject('store')
@observer
class GridWrapper extends React.Component<{ store?: Store; }> {
  render() {
    const {
      goodsStore,
      tmpStore,
      showTmp,
    } = this.props.store;
    return (
      <>
        <div style={{ height: 300 }}>
          <EgGrid store={goodsStore.gridModel}/>
        </div>
        {
          showTmp ? (
            <>
              <div style={{ height: 240 }}>
                <EgGrid store={tmpStore.gridModel}/>
              </div>
              <div className={styles.rows}>
                共
                <span>
                  {tmpStore.gridModel.rows.length}
                </span>
                条
              </div>
            </>
          ) : null
        }
      </>
    );
  }
}

@inject('store')
@observer
class ModalHeader extends React.Component<{ store?: Store; }> {
  render() {
    const {
      selectValue,
      inputValue,
      handleInputValueChange,
      handleSelectValueChange,
      goodsStore,
      handleAdd,
      showTmp,
    } = this.props.store;
    return (
      <div className={styles.modelHeader}>
        <section className={styles.left}>
          <Select
            bordered={false}
            onChange={handleSelectValueChange}
            options={Object.values(selectData)}
            size="large"
            value={selectValue}
          />
          <Input
            allowClear
            onChange={(event) => handleInputValueChange(event.target.value)}
            onPressEnter={() => goodsStore.gridModel.onQuery()}
            size="large"
            value={inputValue}
          />
          &nbsp;&nbsp;
          <Button
            onClick={() => goodsStore.gridModel.onQuery()}
            size="large"
            type="primary"
          >
            查询
          </Button>
        </section>
        {
          showTmp ? (
            <section className={styles.right}>
              <Button
                className="ghost-bg-btn"
                onClick={() => handleAdd(goodsStore.gridModel.selectRows)}
                size="large"
              >
                批量添加
              </Button>
            </section>
          ) : null
        }
      </div>
    );
  }
}
