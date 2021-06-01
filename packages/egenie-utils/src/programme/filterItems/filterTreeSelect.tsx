import { Typography, TreeSelect } from 'antd';
import _ from 'lodash';
import { action, intercept, observable, extendObservable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ENUM_FILTER_ITEM_TYPE, FilterBase } from './common';

/**
 * TreeData数据类型
 */
export interface FilterTreeSelectItem {
  id?: number;
  pid?: number;
  value: string;
  title: React.ReactNode;
  children?: FilterTreeSelectItem[];
  disabled?: boolean;
  disableCheckbox?: boolean;
  selectable?: boolean;
  checkable?: boolean;
  isLeaf?: boolean;
  [key: string]: any;
}

export class FilterTreeSelect extends FilterBase {
  constructor(options: Partial<FilterTreeSelect>) {
    super(options);
    const {
      data,
      ...rest
    } = options;

    extendObservable(this, {
      ...rest,
      showCollapse: false,
    });
    this.formatValue(this.value);
    this.snapshot = this.value;

    intercept(this, 'value', (change) => {
      change.newValue = Array.isArray(change.newValue) ? change.newValue : [];
      return change;
    });
  }

  /**
   * 类型标志
   */
  @observable public type: 'treeSelect' = ENUM_FILTER_ITEM_TYPE.treeSelect;

  public toProgramme(): string | null {
    if (Array.isArray(this.value) && this.value.length) {
      return this.value.join(',');
    } else {
      return null;
    }
  }

  public toParams(this: FilterTreeSelect): {[key: string]: string; } {
    if (this.toProgramme()) {
      return { [this.field]: this.toProgramme() };
    } else {
      return {};
    }
  }

  @action
  public formatValue(this: FilterTreeSelect, value?: string[] | string): void {
    if (Array.isArray(value)) {
      this.value = value;
    } else {
      this.value = _.toString(value)
        .split(',')
        .filter(Boolean);
    }
  }

  private snapshot: string[] = [];

  @action private handleCallback = () => {
    if (typeof this.onChangeCallback === 'function') {
      this.onChangeCallback(toJS(this.value));
    }
  };

  @action public reset = (): void => {
    this.value = this.snapshot;
    this.handleCallback();
  };

  /**
   * 选择的值
   */
  @observable public value: string[] = [];

  /**
   * @internal
   */
  @action public onChange = (value: string[]) => {
    if (Array.isArray(value)) {
      this.value = value;
    } else if (typeof value === 'string' || typeof value === 'number') {
      this.value = [`${value}`];
    } else {
      this.value = [];
    }

    this.handleCallback();
  };

  /**
   * 值改回掉
   */
  public onChangeCallback: (value?: string[]) => void;

  /**
   * 输入框提示文字
   */
  @observable public placeholder = '请选择';

  /**
   * 是否可清除
   */
  @observable public allowClear = false;

  /**
   * 是否禁止
   */
  @observable public disabled = false;

  /**
   * 是否显示搜索框
   */
  @observable public showSearch = false;

  /**
   * 下拉菜单的 className 属性
   */
  @observable public dropdownClassName = '';

  /**
   * 下拉菜单和选择器同宽
   */
  @observable public dropdownMatchSelectWidth: number | boolean = true;

  /**
   * 设置弹窗滚动高度
   */
  @observable public listHeight = 256;

  /**
   * 异步加载数据
   */
  public loadData: (node: any) => Promise<any>;

  /**
   * 支持多选（当设置 treeCheckable 时自动变为 true）
   */
  @observable public multiple = false;

  /**
   * 显示 Checkbox
   */
  @observable public treeCheckable = false;

  /**
   * 最多显示多少个 tag，响应式模式会对性能产生损耗
   */
  @observable public maxTagCount: number | 'responsive' = 'responsive';

  /**
   * 配置 treeCheckable 时，定义选中项回填的方式。
   * SHOW_ALL: 显示所有选中节点(包括父节点)
   * SHOW_PARENT: 只显示父节点(当父节点下所有子节点都选中时)
   * SHOW_CHILD: 只显示子节点
   */
  @observable public showCheckedStrategy: 'SHOW_ALL' | 'SHOW_PARENT' | 'SHOW_CHILD' = 'SHOW_ALL';

  /**
   * treeNodes 数据
   */
  @observable public treeData: FilterTreeSelectItem[] = [];

  /**
   * 使用简单格式的 treeData
   */
  @observable public treeDataSimpleMode = false;

  /**
   * 展开的树节点
   */
  @observable public treeExpandedKeys: string[] = [];

  /**
   * 输入项过滤对应的 treeNode 属性
   */
  @observable public treeNodeFilterProp = 'title';

  /**
   * 设置 false 时关闭虚拟滚动
   */
  @observable public virtual = true;

  /**
   * @internal
   */
  @action public onTreeExpand = (treeExpandedKeys: string[]) => {
    if (Array.isArray(treeExpandedKeys)) {
      this.treeExpandedKeys = treeExpandedKeys;
    } else {
      this.treeExpandedKeys = [];
    }
  };
}

/**
 * @internal
 */
@observer
export class FilterTreeSelectComponent extends React.Component<{ store: FilterTreeSelect; }> {
  render() {
    const {
      value,
      onChange,
      placeholder,
      allowClear,
      disabled,
      style,
      className,
      label,
      showSearch,
      labelWidth,
      dropdownClassName,
      dropdownMatchSelectWidth,
      listHeight,
      loadData,
      multiple,
      treeExpandedKeys,
      treeNodeFilterProp,
      treeData,
      onTreeExpand,
      treeCheckable,
      showCheckedStrategy,
      maxTagCount,
      treeDataSimpleMode,
    } = this.props.store;
    return (
      <div
        className={`filterTreeSelect ${className}`}
        style={toJS(style)}
      >
        <div
          className="filterLabel"
          style={{
            width: labelWidth,
            maxWidth: labelWidth,
          }}
          title={label}
        >
          <Typography.Title
            ellipsis={{ rows: 1 }}
            title={label}
          >
            {label}
          </Typography.Title>
        </div>
        <section style={{ width: `calc(100% - ${labelWidth}px)` }}>
          <TreeSelect
            allowClear={allowClear}
            bordered={false}
            disabled={disabled}
            dropdownClassName={dropdownClassName}
            dropdownMatchSelectWidth={dropdownMatchSelectWidth}
            listHeight={listHeight}
            loadData={loadData}
            maxTagCount={maxTagCount}
            multiple={multiple}
            onChange={onChange}
            onTreeExpand={onTreeExpand}
            placeholder={placeholder}
            showCheckedStrategy={showCheckedStrategy}
            showSearch={showSearch}
            treeCheckable={treeCheckable}
            treeData={treeData}
            treeDataSimpleMode={treeDataSimpleMode}
            treeExpandedKeys={treeExpandedKeys}
            treeNodeFilterProp={treeNodeFilterProp}
            value={value}
          />
        </section>
      </div>
    );
  }
}
