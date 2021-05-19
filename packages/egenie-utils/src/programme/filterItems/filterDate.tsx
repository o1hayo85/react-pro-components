import { DatePicker, Select, Typography } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import { action, observable, extendObservable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { ENUM_FILTER_ITEM_TYPE, FilterBase } from './common';

export enum FormatType {
  defaultFormat = 'YYYY-MM-DD HH:mm:ss',
  day = 'YYYY-MM-DD',
}

function formatTime(startTime: moment.Moment, endTime: moment.Moment, format: string): string {
  let startTimeString: string;
  let endTimeString: string;

  switch (format) {
    case FormatType.defaultFormat:
      startTimeString = startTime ? startTime.format(FormatType.defaultFormat) : '';
      endTimeString = endTime ? endTime.format(FormatType.defaultFormat) : '';
      break;
    case FormatType.day:
      startTimeString = startTime ? startTime.startOf('day')
        .format(FormatType.defaultFormat) : '';
      endTimeString = endTime ? endTime.endOf('day')
        .format(FormatType.defaultFormat) : '';
      break;
    default:
      startTimeString = '';
      endTimeString = '';
  }

  if (startTimeString || endTimeString) {
    return `${startTimeString},${endTimeString}`;
  } else {
    return '';
  }
}

/**
 * 时间范围
 */
export class FilterDate extends FilterBase {
  constructor(options: Partial<FilterDate>) {
    super(options);
    const {
      data,
      ...rest
    } = options;

    extendObservable(this, {
      ...rest,
      showCollapse: false,
    });
    this.snapshot = {
      selectValue: this.selectValue,
      startTime: this.startTime,
      endTime: this.endTime,
    };
  }

  /**
   * 类型标志。date为左右查询方案类型(带下拉选择,左右查询方案)。dateRange。DatePicker.Range
   */
  @observable public type: 'date' | 'dateRange' = ENUM_FILTER_ITEM_TYPE.date;

  public toProgramme(): string | null {
    if (this.type === ENUM_FILTER_ITEM_TYPE.date) {
      if (this.selectValue) {
        return `${this.selectValue},${formatTime(this.startTime, this.endTime, this.format)}`;
      } else {
        return null;
      }
    } else {
      return formatTime(this.startTime, this.endTime, this.format);
    }
  }

  public toParams(this: FilterDate): {[key: string]: string; } {
    const timeString = formatTime(this.startTime, this.endTime, this.format);
    if (this.type === ENUM_FILTER_ITEM_TYPE.date) {
      if (this.selectValue) {
        if (timeString) {
          return {
            dateType: this.selectValue,
            dateValue: timeString,
          };
        } else {
          return {};
        }
      } else {
        return {};
      }
    } else {
      if (timeString) {
        return { [this.field]: timeString };
      } else {
        return {};
      }
    }
  }

  @action
  public formatValue(this: FilterDate, value?: string): void {
    const keyAndValues = _.toString(value)
      .split(',');
    if (this.type === ENUM_FILTER_ITEM_TYPE.date) {
      this.selectValue = keyAndValues[0] ? keyAndValues[0] : undefined;
      this.startTime = keyAndValues[1] ? moment(keyAndValues[1]) : null;
      this.endTime = keyAndValues[2] ? moment(keyAndValues[2]) : null;
    } else {
      this.selectValue = undefined;
      this.startTime = keyAndValues[0] ? moment(keyAndValues[0]) : null;
      this.endTime = keyAndValues[1] ? moment(keyAndValues[1]) : null;
    }
  }

  private snapshot: { startTime: moment.Moment | null; endTime: moment.Moment | null; selectValue: string; } = {
    startTime: null,
    endTime: null,
    selectValue: '',
  };

  @action public reset = (): void => {
    this.startTime = this.snapshot.startTime;
    this.endTime = this.snapshot.endTime;
    this.selectValue = this.snapshot.selectValue;
  };

  /**
   * 允许起始项部分为空。type为dateRange生效
   */
  @observable public allowEmpty: [boolean, boolean] = [
    true,
    true,
  ];

  /**
   * 日期类型选中值
   */
  @observable public selectValue: string | undefined = undefined;

  /**
   * 日期改变回掉
   */
  public handleChangeCallback: (date: [moment.Moment, moment.Moment]) => void;

  /**
   * @internal
   */
  @action public handleSelectChange = (selectValue: string | undefined) => {
    this.selectValue = selectValue;
  };

  /**
   * 日期格式
   */
  @observable public format: 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD' = FormatType.defaultFormat;

  /**
   * 开始时间
   */
  @observable.ref public startTime: moment.Moment | null = null;

  /**
   * @internal
   */
  @action public handleStartChange = (startTime: moment.Moment | null) => {
    this.startTime = startTime;

    if (typeof this.handleChangeCallback === 'function') {
      this.handleChangeCallback([
        this.startTime,
        this.endTime,
      ]);
    }
  };

  /**
   * @internal
   */
  @action public handleRangeChange = (dates: [moment.Moment, moment.Moment]) => {
    this.startTime = dates?.[0];
    this.endTime = dates?.[1];
    if (typeof this.handleChangeCallback === 'function') {
      this.handleChangeCallback([
        this.startTime,
        this.endTime,
      ]);
    }
  };

  /**
   * 结束时间
   */
  @observable.ref public endTime: moment.Moment | null = null;

  /**
   * 禁止状态
   */
  @observable public disabled: [boolean, boolean] = [
    false,
    false,
  ];

  /**
   * @internal
   */
  @action public handleEndChange = (endTime: moment.Moment | null) => {
    this.endTime = endTime;

    if (typeof this.handleChangeCallback === 'function') {
      this.handleChangeCallback([
        this.startTime,
        this.endTime,
      ]);
    }
  };

  /**
   * 输入框提示文字
   */
  @observable public placeholder: [string, string] = [
    '开始时间',
    '结束时间',
  ];
}

/**
 * @internal
 */
@observer
export class FilterDateComponent extends React.Component<{ store: FilterDate; }> {
  render() {
    if (this.props.store.type === ENUM_FILTER_ITEM_TYPE.date) {
      return <FilterDateNormal store={this.props.store}/>;
    } else {
      return <FilterDateRange store={this.props.store}/>;
    }
  }
}

/**
 * @internal
 */
@observer
class FilterDateNormal extends React.Component<{ store: FilterDate; }> {
  render() {
    const {
      startTime,
      endTime,
      handleStartChange,
      handleEndChange,
      placeholder,
      format,
      handleSelectChange,
      data,
      selectValue,
      label,
      className,
      style,
      disabled,
    } = this.props.store;
    const newClassName = classNames('filterDateSelect', className);
    return (
      <div
        className={newClassName}
        style={toJS(style)}
      >
        <header>
          <section className="filterLabel">
            <Typography.Title
              ellipsis={{ rows: 1 }}
              title={label}
            >
              {label}
            </Typography.Title>
          </section>
          <Select
            bordered={false}
            onChange={handleSelectChange}
            options={data}
            placeholder="请选择"
            value={selectValue}
          />
        </header>
        <section>
          <DatePicker
            bordered={false}
            disabled={disabled[0]}
            format={format}
            onChange={handleStartChange}
            placeholder={Array.isArray(placeholder) ? placeholder[0] : placeholder}
            showTime={format === FormatType.defaultFormat ? {
              hideDisabledOptions: true,
              defaultValue: moment('00:00:00', 'HH:mm:ss'),
            } : false}
            showToday
            suffixIcon={null}
            value={startTime}
          />
          <div>
            至
          </div>
          <DatePicker
            bordered={false}
            disabled={disabled[1]}
            format={format}
            onChange={handleEndChange}
            placeholder={Array.isArray(placeholder) ? placeholder[1] : placeholder}
            showTime={format === FormatType.defaultFormat ? {
              hideDisabledOptions: true,
              defaultValue: moment('23:59:59', 'HH:mm:ss'),
            } : false}
            value={endTime}
          />
        </section>
      </div>
    );
  }
}

/**
 * @internal
 */
@observer
class FilterDateRange extends React.Component<{ store: FilterDate; }> {
  render() {
    const {
      allowEmpty,
      startTime,
      endTime,
      placeholder,
      format,
      label,
      className,
      style,
      disabled,
      handleRangeChange,
    } = this.props.store;
    const newClassName = classNames('filterDateNormal', className);
    return (
      <div
        className={newClassName}
        style={toJS(style)}
      >
        <header>
          <section className="filterLabel">
            <Typography.Title
              ellipsis={{ rows: 1 }}
              title={label}
            >
              {label}
            </Typography.Title>
          </section>
        </header>
        <section>
          <DatePicker.RangePicker
            allowEmpty={allowEmpty}
            bordered={false}
            disabled={disabled}
            format={format}
            onChange={handleRangeChange}
            placeholder={placeholder}
            showTime={format === FormatType.defaultFormat ? {
              hideDisabledOptions: true,
              defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('23:59:59', 'HH:mm:ss'),
              ],
            } : false}
            value={[
              startTime,
              endTime,
            ]}
          />
        </section>
      </div>
    );
  }
}
