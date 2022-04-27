import { Modal, Switch, Button } from 'antd';
import { observable, set, action, extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import type { SortEndHandler } from 'react-sortable-hoc';
import type { EgGridModel, ColumnType } from '../egGridModel';
import styles from './columnSetting.less';

export class ColumnSettingModel {
  @observable public parent: EgGridModel;

  @observable public pannelItems: ColumnType = [];

  /**
   * 取消时使用
   */
  @observable public noSavePannelItems: ColumnType = [];

  public get firstIndexOfHiddenItem() {
    // 第一个未显示的查询条件项目
    return this.pannelItems.findIndex((item) => item.ejlHidden);
  }

  constructor(options) {
    set(this, {
      pannelItems: options.parent.twoLevelClone(options.parent.columns),
      noSavePannelItems: options.parent.twoLevelClone(options.parent.columns),
      ...(options || {}),
    });
  }

  @observable public isModalVisible = false;

  @action public handleCancel = (): void => {
    this.isModalVisible = false;
    this.pannelItems = this.parent.twoLevelClone(this.parent.columns);
  };

  @action public openColumnSetting = (): void => {
    this.isModalVisible = true;
  };

  @action public handleOk = (): void => {
    const { updateColumns, saveColumnsConfig, getStorageParam } = this.parent;
    this.isModalVisible = false;
    saveColumnsConfig(getStorageParam(this.pannelItems));
    updateColumns(this.pannelItems);
  };

  @action public handleResetOrder = (): void => {
    this.pannelItems = this.parent.twoLevelClone(this.noSavePannelItems);
  };

  @action public onSortEnd: SortEndHandler = ({ oldIndex, newIndex }): void => {
    console.log('🚀 ~ file: index.tsx ~ line 35 ~ ColumnSettingModel ~ oldIndex, newIndex', oldIndex, newIndex);
    if (oldIndex !== newIndex) {
      const { firstIndexOfHiddenItem } = this;
      const { ejlHidden } = this.pannelItems[oldIndex];
      const { frozen } = this.pannelItems[newIndex];
      const targetIndex = frozen ? oldIndex : !ejlHidden // 控制使得display=true的都在前边，=false的都在后边
        ? ~firstIndexOfHiddenItem
          ? newIndex < firstIndexOfHiddenItem
            ? newIndex
            : firstIndexOfHiddenItem - 1
          : newIndex
        : newIndex < firstIndexOfHiddenItem
          ? firstIndexOfHiddenItem
          : newIndex;
      this.arrayMove(this.pannelItems, oldIndex, targetIndex);
    }
  };

  @action public onSwitch = (index, checked): void => {
    console.log('🚀 ~ file: index.tsx ~ line 39 ~ ColumnSettingModel ~ index,checked', index, checked);
    const { firstIndexOfHiddenItem } = this;
    this.pannelItems[index].ejlHidden = !checked;

    this.arrayMove(this.pannelItems, index, !checked ? this.pannelItems.length - 1 : firstIndexOfHiddenItem);
  };

  // 拖拽列的方法
  @action private arrayMove = (array, previousIndex, newIndex) => {
    const cloneItemsArray = this.parent.twoLevelClone(array);
    if (newIndex >= cloneItemsArray.length) {
      let k = newIndex - cloneItemsArray.length;
      while (k-- + 1) {
        cloneItemsArray.push(undefined);
      }
    }
    cloneItemsArray.splice(newIndex, 0, cloneItemsArray.splice(previousIndex, 1)[0]);
    console.log(cloneItemsArray, 'array');

    this.pannelItems = cloneItemsArray;
    return array;
  };
}

const ColumnsPanelItem = observer(({ item, orderNo, onSwitch }) => {
  const { ejlHidden = false, frozen, nameText } = item;
  let { name = '默认标签' } = item;
  const defaultWrapperClassName = `${styles.columnItemWrapper} ${frozen ? styles.lockedColumnItem : ''}`;

  // 表头是自定义组件的话，要给相应的列配置nameText,或者自定义组件要有name属性，否则无法正常显示
  if (typeof name !== 'string') {
    name = nameText || name?.props?.name || '默认标签';
  }
  return (
    <div className={defaultWrapperClassName}>
      <div className={styles.orderNoWrapper}>
        <span className={styles.orderNo}>
          {orderNo + 1}
        </span>
        <div className={styles.label}>
          {name}
        </div>
      </div>
      <Switch
        checked={!ejlHidden}
        checkedChildren="开"
        disabled={item.frozen || false}
        onChange={onSwitch}
        unCheckedChildren="关"
      />
    </div>
  );
});

const SortableItem = SortableElement(ColumnsPanelItem);

const SortableList = SortableContainer(({ items, onSwitch }) => {
  // 若冻结列不允许排序 ，添加disabled={el.locked || false} ，Item内部也需要配置不允许关闭，同时需要添加CSS以做区分
  return (
    <div className={styles.scrollContainer}>
      <div className={styles.scrollWrapper}>
        <div className={styles.itemsContainer}>
          {items.map((el, index) => (
            <SortableItem
              disabled={el.frozen || false}
              index={index}
              item={el}
              key={el.key}
              onSwitch={onSwitch.bind(this, index)}
              orderNo={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

@observer
export class ColumnSettingModal extends React.Component<{ store: ColumnSettingModel ; }> {
  render() {
    const { handleCancel, handleOk, handleResetOrder, isModalVisible, onSortEnd, onSwitch, pannelItems, parent: {
      columns,
    }} = this.props.store;
    return (
      <Modal
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
          >
            取消
          </Button>,
          <Button
            key="reset"
            onClick={handleResetOrder}
            type="primary"
          >
            恢复默认顺序
          </Button>,
          <Button
            key="save"
            onClick={handleOk}
            type="primary"
          >
            保存
          </Button>,
        ]}
        onCancel={handleCancel}
        onOk={handleOk}
        title="表格列设置"
        visible={isModalVisible}
        width={782}
      >
        <div className={styles.tip}>
          冻结列不支持拖拽和关闭
        </div>
        <SortableList
          axis="xy"
          helperClass={styles.sortableHelper}

          // disableAutoscroll
          items={pannelItems}
          onSortEnd={onSortEnd}

          // lockOffset="1%"
          // lockToContainerEdges
          onSwitch={onSwitch}
        />
      </Modal>
    );
  }
}
