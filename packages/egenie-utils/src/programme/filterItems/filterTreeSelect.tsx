import { TreeSelect } from 'antd';
import _ from 'lodash';
import { action, intercept, observable, extendObservable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ENUM_FILTER_ITEM_TYPE, FilterBase, FilterItemLabel } from './common';

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

  @action public reset = (): void => {
    this.value = this.snapshot;
    if (typeof this.onChangeCallback === 'function') {
      this.onChangeCallback(toJS(this.value));
    }
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

    if (typeof this.onChangeCallback === 'function') {
      this.onChangeCallback(toJS(this.value));
    }
  };

  /**
   * 值改回掉
   */
  public onChangeCallback: (value?: string[]) => void;

  /**
   * @internal
   */
  @action public onSelect = (value: string) => {
    if (typeof value === 'string' || typeof value === 'number') {
      if (typeof this.onChangeCallback === 'function') {
        this.onSelectCallback(`${value}`);
      }
    }
  };

  /**
   * 被选中回掉
   */
  public onSelectCallback: (value?: string) => void;

  /**
   * 输入框提示文字
   */
  @observable public placeholder = '请选择';

  /**
   * 是否可清除
   */
  @observable public allowClear = false;

  /**
   * 当多选模式下值被选择，自动清空搜索框
   */
  @observable public autoClearSearchValue = true;

  /**
   * 是否禁止
   */
  @observable public disabled = false;

  /**
   * 是否显示 suffixIcon，单选模式下默认 true
   */
  @observable public showArrow: boolean | undefined = undefined;

  /**
   * 自定义的选择框后缀图标, 多选模式下必须同时设置 showArrow 为 true
   */
  @observable.ref public suffixIcon: React.ReactNode = undefined;

  /**
   * 自定义树节点的展开/折叠图标
   */
  @observable.ref public switcherIcon: React.ReactNode = undefined;

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
   * 下拉菜单的样式
   */
  @observable public dropdownStyle: React.CSSProperties = {};

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
   * 默认展开所有树节点
   */
  @observable public treeDefaultExpandAll = false;

  /**
   * 默认展开的树节点
   */
  @observable public treeDefaultExpandedKeys: string[] | undefined = undefined;

  /**
   * 展开的树节点
   */
  @observable public treeExpandedKeys: string[] | undefined = undefined;

  /**
   * 是否展示 TreeNode title 前的图标，没有默认样式，如设置为 true，需要自行定义图标相关样式
   */
  @observable public treeIcon = false;

  /**
   * 输入项过滤对应的 treeNode 属性
   */
  @observable public treeNodeFilterProp = 'title';

  /**
   * 作为显示的 prop 设置
   */
  @observable public treeNodeLabelProp = 'title';

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
      autoClearSearchValue,
      dropdownStyle,
      showArrow,
      suffixIcon,
      switcherIcon,
      treeDefaultExpandAll,
      treeDefaultExpandedKeys,
      treeIcon,
      onSelect,
      required,
    } = this.props.store;
    return (
      <div
        className={`filterTreeSelect ${className}`}
        style={toJS(style)}
      >
        <FilterItemLabel
          label={label}
          labelWidth={labelWidth}
          required={required}
        />
        <section style={{ width: `calc(100% - ${labelWidth}px)` }}>
          <TreeSelect
            allowClear={allowClear}
            autoClearSearchValue={autoClearSearchValue}
            bordered={false}
            disabled={disabled}
            dropdownClassName={dropdownClassName}
            dropdownMatchSelectWidth={dropdownMatchSelectWidth}
            dropdownStyle={dropdownStyle}
            listHeight={listHeight}
            loadData={loadData}
            maxTagCount={maxTagCount}
            multiple={multiple}
            onChange={onChange}
            onSelect={onSelect}
            onTreeExpand={onTreeExpand}
            placeholder={placeholder}
            showArrow={showArrow}
            showCheckedStrategy={showCheckedStrategy}
            showSearch={showSearch}
            suffixIcon={suffixIcon}
            switcherIcon={switcherIcon}
            treeCheckable={treeCheckable}
            treeData={treeData}
            treeDataSimpleMode={treeDataSimpleMode}
            treeDefaultExpandAll={treeDefaultExpandAll}
            treeDefaultExpandedKeys={treeDefaultExpandedKeys}
            treeExpandedKeys={treeExpandedKeys}
            treeIcon={treeIcon}
            treeNodeFilterProp={treeNodeFilterProp}
            value={value}
          />
        </section>
      </div>
    );
  }
}
