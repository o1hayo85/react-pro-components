import { DatePicker } from 'antd';
import classNames from 'classnames';
import { action, observable, extendObservable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { ENUM_FILTER_ITEM_TYPE, FilterBase, FilterItemLabel } from './common';
import { FormatDateType } from './filterDate';

function formatTime(value: moment.Moment | null, format: string, formatParams: string, type: string): string {
  if (!value) {
    return '';
  }

  if (type === ENUM_FILTER_ITEM_TYPE.dateStart) {
    if (format === FormatDateType.defaultFormat) {
      return value.format(formatParams);
    } else {
      return value.startOf('day')
        .format(formatParams);
    }
  } else {
    if (format === FormatDateType.defaultFormat) {
      return value.format(formatParams);
    } else {
      return value.endOf('day')
        .format(formatParams);
    }
  }
}

/**
 * 选择开始时间或者结束时间
 */
export class FilterDateStartOrEnd extends FilterBase {
  constructor(options: Partial<FilterDateStartOrEnd>) {
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

    if (!this.placeholder) {
      if (this.type === ENUM_FILTER_ITEM_TYPE.dateStart) {
        this.placeholder = '开始时间';
      } else {
        this.placeholder = '结束时间';
      }
    }
  }

  /**
   * 类型标志。dateStart为选择开始时间。dateEnd为选择结束时间
   */
  @observable public type: 'dateStart' | 'dateEnd' = ENUM_FILTER_ITEM_TYPE.dateStart;

  public toProgramme(): string | null {
    if (formatTime(this.value, this.format, this.formatParams, this.type)) {
      return formatTime(this.value, this.format, this.formatParams, this.type);
    } else {
      return null;
    }
  }

  public toParams(this: FilterDateStartOrEnd): {[key: string]: string; } {
    if (this.toProgramme()) {
      return { [this.field]: this.toProgramme() };
    } else {
      return {};
    }
  }

  @action
  public formatValue(this: FilterDateStartOrEnd, value?: string | moment.Moment | null): void {
    if (!value) {
      this.value = null;
    } else if (typeof value === 'string') {
      this.value = moment(value);
    } else {
      this.value = value;
    }
  }

  private snapshot: moment.Moment = null;

  @action private handleCallback = () => {
    if (typeof this.handleChangeCallback === 'function') {
      this.handleChangeCallback(this.value);
    }
  };

  @action public reset = (): void => {
    this.value = this.snapshot;
    this.handleCallback();
  };

  /**
   * 日期改变回掉
   */
  public handleChangeCallback: (value: moment.Moment | null) => void;

  /**
   * 是否允许清除
   */
  @observable public allowClear = true;

  /**
   * 日期展示格式
   */
  @observable public format: 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD' = FormatDateType.defaultFormat;

  /**
   * 日期转化成参数格式
   */
  @observable public formatParams: 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD' = FormatDateType.defaultFormat;

  /**
   * 时间
   */
  @observable.ref public value: moment.Moment | null = null;

  /**
   * @internal
   */
  @action public handleChange = (value: moment.Moment | null) => {
    this.value = value;
    this.handleCallback();
  };

  /**
   * 禁止状态
   */
  @observable public disabled = false;

  /**
   * 输入框提示文字
   */
  @observable public placeholder = '';
}

/**
 * @internal
 */
@observer
export class FilterDateStartOrEndComponent extends React.Component<{ store: FilterDateStartOrEnd; }> {
  render() {
    const {
      value,
      handleChange,
      placeholder,
      format,
      label,
      className,
      style,
      disabled,
      type,
      labelWidth,
      allowClear,
      required,
    } = this.props.store;
    const newClassName = classNames('filterDateNormal', className);
    return (
      <div
        className={newClassName}
        style={toJS(style)}
      >
        <header>
          <FilterItemLabel
            label={label}
            labelWidth={labelWidth}
            required={required}
          />
        </header>
        <section>
          <DatePicker
            allowClear={allowClear}
            bordered={false}
            disabled={disabled}
            format={format}
            onChange={handleChange}
            placeholder={placeholder}
            showTime={format === FormatDateType.defaultFormat ? {
              hideDisabledOptions: true,
              defaultValue: type === ENUM_FILTER_ITEM_TYPE.dateStart ? moment('00:00:00', 'HH:mm:ss') : moment('23:59:59', 'HH:mm:ss'),
            } : false}
            showToday
            value={value}
          />
        </section>
      </div>
    );
  }
}

