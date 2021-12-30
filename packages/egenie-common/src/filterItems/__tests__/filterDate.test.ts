import moment from 'moment';
import { FilterDate, formatTime } from '../filterDate';

describe('filterDate', () => {
  test('init', () => {
    const filterDate = new FilterDate({
      field: 'date',
      label: 'date',
      showCollapse: true,
      open: [
        true,
        true,
      ],
    });

    expect(filterDate.showCollapse).toBeFalsy();
    expect(filterDate.selectValue).toBeUndefined();
    expect(filterDate.startTime).toBeNull();
    expect(filterDate.endTime).toBeNull();

    filterDate.selectValue = 'a';
    filterDate.startTime = moment();
    filterDate.endTime = moment();
    filterDate.reset();
    expect(filterDate.selectValue).toBeUndefined();
    expect(filterDate.startTime).toBeNull();
    expect(filterDate.endTime).toBeNull();
    expect(filterDate.open).toEqual([
      false,
      false,
    ]);
  });

  test('formatValue', () => {
    const filterDate = new FilterDate({
      field: 'date',
      label: 'date',
      type: 'date',
    });

    expect(filterDate.selectValue).toBeUndefined();
    expect(filterDate.startTime).toBeNull();
    expect(filterDate.endTime).toBeNull();

    filterDate.formatValue('aa,2021-12-29 11:11:11,');

    expect(filterDate.selectValue).toBe('aa');
    expect(filterDate.startTime).toBeDefined();
    expect(filterDate.endTime).toBeNull();

    filterDate.type = 'dateRange';
    filterDate.formatValue(',2021-12-29 22:22:22');
    expect(filterDate.selectValue).toBeUndefined();
    expect(filterDate.startTime).toBeNull();
    expect(filterDate.endTime).toBeDefined();
  });

  test('formatTime', () => {
    const startTimeStr = '2021-12-29 11:11:11';
    expect(formatTime(null, null, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss')).toBe('');

    expect(formatTime(moment(startTimeStr), null, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss')).toBe(`${startTimeStr},`);
    expect(formatTime(moment(startTimeStr), null, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD')).toBe('2021-12-29,');
    expect(formatTime(moment(startTimeStr), null, 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss')).toBe('2021-12-29 00:00:00,');
    expect(formatTime(moment(startTimeStr), null, 'YYYY-MM-DD', 'YYYY-MM-DD')).toBe('2021-12-29,');

    expect(formatTime(null, moment(startTimeStr), 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss')).toBe(`,${startTimeStr}`);
    expect(formatTime(null, moment(startTimeStr), 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD')).toBe(',2021-12-29');
    expect(formatTime(null, moment(startTimeStr), 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss')).toBe(',2021-12-29 23:59:59');
    expect(formatTime(null, moment(startTimeStr), 'YYYY-MM-DD', 'YYYY-MM-DD')).toBe(',2021-12-29');

    expect(formatTime(moment(startTimeStr), moment('2021-12-29 22:22:22'), 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss')).toBe('2021-12-29 11:11:11,2021-12-29 22:22:22');
    expect(formatTime(moment(startTimeStr), moment('2021-12-30 22:22:22'), 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD')).toBe('2021-12-29,2021-12-30');
    expect(formatTime(moment(startTimeStr), moment('2021-12-29 22:22:22'), 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss')).toBe('2021-12-29 00:00:00,2021-12-29 23:59:59');
    expect(formatTime(moment(startTimeStr), moment('2021-12-30 22:22:22'), 'YYYY-MM-DD', 'YYYY-MM-DD')).toBe('2021-12-29,2021-12-30');
  });

  test('toProgramme toParams translateParams validator dateRange', () => {
    const startTimeStr = '2021-12-29 11:11:11';
    const filterDate = new FilterDate({
      field: 'date',
      label: 'date',
      type: 'dateRange',
      required: true,
    });

    expect(filterDate.toProgramme()).toBeNull();
    expect(filterDate.toParams()).toEqual({});
    expect(filterDate.translateParams()).toEqual([]);
    // eslint-disable-next-line jest/valid-expect
    expect(filterDate.validator()).rejects.toMatch(/请/);

    filterDate.startTime = moment(startTimeStr);
    expect(filterDate.toProgramme()).toBe(`${startTimeStr},`);
    expect(filterDate.toParams()).toEqual({ date: `${startTimeStr},` });
    expect(filterDate.translateParams()).toEqual([
      'date',
      `${startTimeStr}至`,
    ]);
    // eslint-disable-next-line jest/valid-expect
    expect(filterDate.validator()).resolves.toBe('');

    filterDate.startTime = null;
    filterDate.endTime = moment(startTimeStr);
    // eslint-disable-next-line jest/valid-expect
    expect(filterDate.validator()).resolves.toBe('');
  });

  test('toProgramme toParams translateParams validator date', () => {
    const endTimeStr = '2021-12-29 11:11:11';
    const filterDate = new FilterDate({
      field: 'date',
      label: 'date',
      type: 'date',
      required: true,
      data: [
        {
          value: 'a',
          label: '1',
        },
      ],
    });

    expect(filterDate.toProgramme()).toBeNull();
    expect(filterDate.toParams()).toEqual({});
    expect(filterDate.translateParams()).toEqual([]);
    // eslint-disable-next-line jest/valid-expect
    expect(filterDate.validator()).rejects.toMatch(/请/);

    filterDate.selectValue = 'a';
    expect(filterDate.toProgramme()).toBe('a');
    filterDate.selectValue = undefined;

    filterDate.endTime = moment(endTimeStr);
    expect(filterDate.toProgramme()).toBeNull();
    expect(filterDate.toParams()).toEqual({});
    expect(filterDate.translateParams()).toEqual([]);
    // eslint-disable-next-line jest/valid-expect
    expect(filterDate.validator()).rejects.toMatch(/请/);

    filterDate.selectValue = 'a';
    expect(filterDate.toProgramme()).toBe(`a,,${endTimeStr}`);
    expect(filterDate.toParams()).toEqual({
      dateType: 'a',
      dateValue: `,${endTimeStr}`,
    });
    expect(filterDate.translateParams()).toEqual([
      '1',
      `至${endTimeStr}`,
    ]);
    // eslint-disable-next-line jest/valid-expect
    expect(filterDate.validator()).resolves.toBe('');

    filterDate.endTime = null;
    filterDate.startTime = moment(endTimeStr);
    // eslint-disable-next-line jest/valid-expect
    expect(filterDate.validator()).resolves.toBe('');
  });
});
