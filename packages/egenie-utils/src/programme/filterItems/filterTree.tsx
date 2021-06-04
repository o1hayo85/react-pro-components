import { Tree } from 'antd';
import { action, observable, extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

/**
 * TreeData数据类型
 */
export interface FilterTreeItem {
  checkable?: boolean;
  disableCheckbox?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  isLeaf?: boolean;
  key?: string;
  selectable?: boolean;
  [key: string]: any;
  title?: React.ReactNode;
}

export class FilterTree {
  constructor(options: Partial<FilterTree>) {
    extendObservable(this, options);
  }

  public toParams(): {[key: string]: string; } {
    return {};
  }

  /**
   * 是否自动展开父节点
   */
  @observable public autoExpandParent = false;

  /**
   * 是否节点占据一行
   */
  @observable public blockNode = false;

  /**
   * 节点前添加 Checkbox 复选框
   */
  @observable public checkable = false;

  /**
   * 选中复选框的树节点.受控
   */
  @observable public checkedKeys: string[] = [];

  /**
   * checkable 状态下节点选择完全受控（父子节点选中状态不再关联）
   */
  @observable public checkStrictly = false;

  /**
   * 默认选中复选框的树节点
   */
  @observable public defaultCheckedKeys: string[] = [];

  /**
   * 默认展开所有树节点
   */
  @observable public defaultExpandAll = false;

  /**
   * 默认展开指定的树节点
   */
  @observable public defaultExpandedKeys: string[] = [];

  /**
   * 默认展开父节点
   */
  @observable public defaultExpandParent = true;

  /**
   * 默认选中的树节点
   */
  @observable public defaultSelectedKeys: string[] = [];

  /**
   * 是否禁用
   */
  @observable public disabled = false;
}

/**
 * @internal
 */
@observer
export class FilterTreeComponent extends React.Component<{ store: FilterTree; }> {
  render() {
    const {
      autoExpandParent,
      blockNode,
      checkable,
      checkedKeys,
      checkStrictly,
      defaultCheckedKeys,
      defaultExpandAll,
      defaultExpandedKeys,
      defaultExpandParent,
      defaultSelectedKeys,
      disabled,
    } = this.props.store;
    return (
      <Tree
        autoExpandParent={autoExpandParent}
        blockNode={blockNode}
        checkStrictly={checkStrictly}
        checkable={checkable}
        checkedKeys={checkedKeys}
        defaultCheckedKeys={defaultCheckedKeys}
        defaultExpandAll={defaultExpandAll}
        defaultExpandParent={defaultExpandParent}
        defaultExpandedKeys={defaultExpandedKeys}
        defaultSelectedKeys={defaultSelectedKeys}
        disabled={disabled}
      />
    );
  }
}
