import { DatePicker, Select, Typography } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import { action, set, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { ENUM_FILTER_ITEM_TYPE, FilterBase } from './common';

enum FormatType {
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

export class FilterDate extends FilterBase {
  constructor(options: Partial<FilterDate>) {
    super();
    set(this, {
      ...options,
      showCollapse: false,
    });
    this.snapshot = {
      selectValue: this.selectValue,
      startTime: this.startTime,
      endTime: this.endTime,
    };
  }

  /**
   * 是否显示更多时间字段项目
   */
  @observable public showSelect = true;

  /**
   * 类型标志
   */
  @observable public type: 'date' | 'dateRange' = ENUM_FILTER_ITEM_TYPE.date;

  public toProgramme(): string | null {
    if (this.showSelect) {
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
    if (this.showSelect) {
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
    if (this.showSelect) {
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
   * 日期类型选中值
   */
  @observable public selectValue: string | undefined = undefined;

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
  @observable public startTime: moment.Moment | null = null;

  /**
   * @internal
   */
  @action public handleStartChange = (startTime: moment.Moment | null) => {
    this.startTime = startTime;
  };

  /**
   * 结束时间
   */
  @observable public endTime: moment.Moment | null = null;

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
export class FilterDateWrapperComponent extends React.Component<{ store: FilterDate; }> {
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
      showSelect,
      disabled,
    } = this.props.store;
    const newClassName = classNames(showSelect ? 'filterDateSelect' : 'filterDateNormal', className);
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
          {
            showSelect ? (
              <Select
                bordered={false}
                onChange={handleSelectChange}
                options={data}
                placeholder="请选择"
                value={selectValue}
              />
            ) : null
          }
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
          {
            showSelect ? (
              <div>
                至
              </div>
            ) : null
          }
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
            showToday={format !== FormatType.defaultFormat}
            value={endTime}
          />
          <span/>
        </section>
      </div>
    );
  }
}
