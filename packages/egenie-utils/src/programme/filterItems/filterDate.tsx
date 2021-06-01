import { DatePicker, Row, Select, Tag, Typography } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import { action, observable, extendObservable, toJS, computed } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { ENUM_FILTER_ITEM_TYPE, FilterBase } from './common';
import styles from './filterItems.less';

export enum FormatDateType {
  defaultFormat = 'YYYY-MM-DD HH:mm:ss',
  day = 'YYYY-MM-DD',
}

export type FilterDateValue = 'today' | 'yesterday' | 'recentThreeDays' | 'thisWeek' | 'recentSevenDays' | 'recentFifteenDays' | 'thisMonth' | 'recentThirtyDays' | 'thisQuarter' | 'recentHalfYear' | 'thisYear' | 'recentYear';

export interface FilterDateDict {
  value: FilterDateValue;
  label: string;
  getTimes: () => [moment.Moment, moment.Moment];
}

export type FilterDateDateItem = FilterDateValue | { value: string; label: FilterDateDict['label']; getTimes: FilterDateDict['getTimes']; };

export const filterDateDict: {[key: string]: FilterDateDict; } = {
  today: {
    value: 'today',
    label: '今天',
    getTimes() {
      return [
        moment()
          .startOf('day'),
        moment(),
      ];
    },
  },
  yesterday: {
    value: 'yesterday',
    label: '昨天',
    getTimes() {
      return [
        moment()
          .startOf('day')
          .subtract(1, 'days'),
        moment()
          .endOf('day')
          .subtract(1, 'days'),
      ];
    },
  },
  recentThreeDays: {
    value: 'recentThreeDays',
    label: '近3日',
    getTimes() {
      return [
        moment()
          .startOf('day')
          .subtract(2, 'days'),
        moment(),
      ];
    },
  },
  thisWeek: {
    value: 'thisWeek',
    label: '本周',
    getTimes() {
      return [
        moment()
          .startOf('week'),
        moment(),
      ];
    },
  },
  recentSevenDays: {
    value: 'recentSevenDays',
    label: '近7天',
    getTimes() {
      return [
        moment()
          .startOf('day')
          .subtract(6, 'days'),
        moment(),
      ];
    },
  },
  recentFifteenDays: {
    value: 'recentFifteenDays',
    label: '近15天',
    getTimes() {
      return [
        moment()
          .startOf('day')
          .subtract(14, 'days'),
        moment(),
      ];
    },
  },
  thisMonth: {
    value: 'thisMonth',
    label: '本月',
    getTimes() {
      return [
        moment()
          .startOf('month'),
        moment(),
      ];
    },
  },
  recentThirtyDays: {
    value: 'recentThirtyDays',
    label: '近30天',
    getTimes() {
      return [
        moment()
          .startOf('day')
          .subtract(29, 'days'),
        moment(),
      ];
    },
  },
  thisQuarter: {
    value: 'thisQuarter',
    label: '本季度',
    getTimes() {
      return [
        moment()
          .startOf('quarter'),
        moment(),
      ];
    },
  },
  recentHalfYear: {
    value: 'recentHalfYear',
    label: '近180天',
    getTimes() {
      return [
        moment()
          .startOf('day')
          .subtract(179, 'days'),
        moment(),
      ];
    },
  },
  thisYear: {
    value: 'thisYear',
    label: '本年',
    getTimes() {
      return [
        moment()
          .startOf('year'),
        moment(),
      ];
    },
  },
  recentYear: {
    value: 'recentYear',
    label: '近365天',
    getTimes() {
      return [
        moment()
          .startOf('day')
          .subtract(364, 'days'),
        moment(),
      ];
    },
  },
};

function formatTime(startTime: moment.Moment, endTime: moment.Moment, formatParams: string): string {
  let startTimeString: string;
  let endTimeString: string;

  switch (formatParams) {
    case FormatDateType.defaultFormat:
      startTimeString = startTime ? startTime.format(formatParams) : '';
      endTimeString = endTime ? endTime.format(formatParams) : '';
      break;
    case FormatDateType.day:
      startTimeString = startTime ? startTime.startOf('day')
        .format(formatParams) : '';
      endTimeString = endTime ? endTime.endOf('day')
        .format(formatParams) : '';
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
        return `${this.selectValue},${formatTime(this.startTime, this.endTime, this.formatParams)}`;
      } else {
        return null;
      }
    } else {
      return formatTime(this.startTime, this.endTime, this.formatParams);
    }
  }

  public toParams(this: FilterDate): {[key: string]: string; } {
    const timeString = formatTime(this.startTime, this.endTime, this.formatParams);
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

  @action private handleCallback = () => {
    if (typeof this.handleChangeCallback === 'function') {
      this.handleChangeCallback([
        this.startTime,
        this.endTime,
      ]);
    }
  };

  @action public reset = (): void => {
    this.startTime = this.snapshot.startTime;
    this.endTime = this.snapshot.endTime;
    this.selectValue = this.snapshot.selectValue;
    this.handleCallback();
  };

  /**
   * 是否允许清除
   */
  @observable public allowClear = true;

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
   * 日期展示格式
   */
  @observable public format: 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD' = FormatDateType.defaultFormat;

  /**
   * 日期转化成参数格式
   */
  @observable public formatParams: 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD' = FormatDateType.defaultFormat;

  /**
   * 开始时间
   */
  @observable.ref public startTime: moment.Moment | null = null;

  /**
   * @internal
   */
  @action public handleStartChange = (startTime: moment.Moment | null) => {
    this.startTime = startTime;
    this.handleCallback();
  };

  /**
   * @internal
   */
  @action public handleRangeChange = (dates: [moment.Moment, moment.Moment]) => {
    this.startTime = dates?.[0];
    this.endTime = dates?.[1];
    this.handleCallback();
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
    this.handleCallback();
  };

  /**
   * 输入框提示文字
   */
  @observable public placeholder: [string, string] = [
    '开始时间',
    '结束时间',
  ];

  /**
   * 预设时间字典。可以根据实际选取，或者新增
   */
  @observable.ref public dateDict: FilterDateDateItem[] = Object.values(filterDateDict);

  /**
   * @internal
   */
  @computed
  public get realDateDict(): Array<{ value: string; label: FilterDateDict['label']; getTimes: FilterDateDict['getTimes']; }> {
    const result: Array<{ value: string; label: FilterDateDict['label']; getTimes: FilterDateDict['getTimes']; }> = [];
    this.dateDict.forEach((item) => {
      if (typeof item === 'string') {
        result.push({
          value: item,
          label: filterDateDict[item].label,
          getTimes: filterDateDict[item].getTimes,
        });
      } else {
        // @ts-ignore
        result.push(item);
      }
    });

    return result;
  }

  /**
   * 字典值改变
   */
  @action public handleDateDictChange = (value: string) => {
    const item = this.realDateDict.find((item) => item.value === value);
    if (item.getTimes) {
      const [
        startTime,
        endTime,
      ] = item.getTimes();

      this.startTime = startTime;
      this.endTime = endTime;

      this.handleCallback();
    }
  };
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
      labelWidth,
      allowClear,
    } = this.props.store;
    const newClassName = classNames('filterDateSelect', className);
    return (
      <div
        className={newClassName}
        style={toJS(style)}
      >
        <header>
          <section
            className="filterLabel"
            style={{
              width: labelWidth,
              maxWidth: labelWidth,
            }}
          >
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
            allowClear={allowClear}
            bordered={false}
            disabled={disabled[0]}
            dropdownClassName={styles.dropdownDate}
            format={format}
            onChange={handleStartChange}
            placeholder={Array.isArray(placeholder) ? placeholder[0] : placeholder}
            renderExtraFooter={() => <FilterDateDictComponent store={this.props.store}/>}
            showNow={false}
            showTime={format === FormatDateType.defaultFormat ? {
              hideDisabledOptions: true,
              defaultValue: moment('00:00:00', 'HH:mm:ss'),
            } : false}
            showToday={false}
            suffixIcon={null}
            value={startTime}
          />
          <div>
            至
          </div>
          <DatePicker
            allowClear={allowClear}
            bordered={false}
            disabled={disabled[1]}
            dropdownClassName={styles.dropdownDate}
            format={format}
            onChange={handleEndChange}
            placeholder={Array.isArray(placeholder) ? placeholder[1] : placeholder}
            renderExtraFooter={() => <FilterDateDictComponent store={this.props.store}/>}
            showNow={false}
            showTime={format === FormatDateType.defaultFormat ? {
              hideDisabledOptions: true,
              defaultValue: moment('23:59:59', 'HH:mm:ss'),
            } : false}
            showToday={false}
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
      labelWidth,
      allowClear,
    } = this.props.store;
    const newClassName = classNames('filterDateNormal', className);
    return (
      <div
        className={newClassName}
        style={toJS(style)}
      >
        <header>
          <section
            className="filterLabel"
            style={{
              width: labelWidth,
              maxWidth: labelWidth,
            }}
          >
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
            allowClear={allowClear}
            allowEmpty={allowEmpty}
            bordered={false}
            disabled={disabled}
            dropdownClassName={styles.dropdownDate}
            format={format}
            onChange={handleRangeChange}
            placeholder={placeholder}
            renderExtraFooter={() => <FilterDateDictComponent store={this.props.store}/>}
            showTime={format === FormatDateType.defaultFormat ? {
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

/**
 * @internal
 */
@observer
class FilterDateDictComponent extends React.Component<{ store: FilterDate; }> {
  render() {
    const {
      handleDateDictChange,
      realDateDict,
    } = this.props.store;
    return (
      <Row
        className={styles.dateSelect}
        gutter={[
          4,
          4,
        ]}
      >
        {realDateDict.map((item) => (
          <Tag
            color="blue"
            onClick={() => handleDateDictChange(item.value)}
          >
            {item.label}
          </Tag>
        ))}
      </Row>
    );
  }
}
