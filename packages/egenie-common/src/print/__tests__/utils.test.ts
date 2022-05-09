import { formatBarcodeData, formatDyDataOld, formatPddDataOld, formatPrintName, formatRookieDataOld, get, getTemplateData, lodopItemGetText, sliceData } from '../utils';

describe('print utils', () => {
  test('getTemplateData', () => {
    expect(getTemplateData(null)).toBeNull();

    expect(getTemplateData({
      printerName: 'a',
      id: '1',
    })).toEqual({
      printerName: 'a',
      id: '1',
    });

    expect(getTemplateData({
      printerName: '',
      id: '',
      content: {
        printerName: 'a',
        id: '1',
      },
    })).toEqual({
      printerName: 'a',
      id: '1',
    });

    expect(getTemplateData({
      printerName: '',
      id: '2',
      content: {
        printerName: 'a',
        id: null,
      },
    })).toEqual({
      printerName: 'a',
      id: '2',
    });
  });

  test('formatPrintName', () => {
    expect(formatPrintName(null, null)).toBeUndefined();

    expect(formatPrintName(null, 'a')).toBe('a');

    expect(formatPrintName({ printerName: 'b' }, 'a')).toBe('a');

    expect(formatPrintName({ printerName: 'b' }, null)).toBe('b');
  });

  test('sliceData', () => {
    expect(sliceData(null)).toEqual([]);

    expect(sliceData([])).toEqual([]);

    expect(sliceData([
      1,
      2,
    ])).toEqual([
      [
        1,
        2,
      ],
    ]);

    expect(sliceData([
      1,
      2,
      3,
    ], 2)).toEqual([
      [
        1,
        2,
      ],
      [3],
    ]);
  });

  test('get', () => {
    expect(get(null, [])).toBeNull();

    expect(get({ a: 1 }, [])).toEqual({ a: 1 });

    expect(get({ a: 1 }, ['a'])).toBe(1);

    expect(get({ a: 1 }, [
      'a',
      'b',
    ])).toBe(1);

    expect(get([
      0,
      1,
    ], ['1'])).toBe(1);

    expect(get([
      0,
      1,
    ], [
      '1',
      '0',
    ])).toBe(1);

    expect(get({
      a: {
        b: [
          0,
          1,
        ],
      },
    }, [
      'a',
      'b',
      '0',
    ])).toBe(0);

    expect(get([
      {
        a: {
          b: 1,
          c: 2,
        },
      },
    ], [
      '0',
      'a',
      'c',
    ])).toBe(2);
  });

  test('lodopItemGetText', () => {
    expect(lodopItemGetText(null, 'a-b')).toBeNull();

    expect(lodopItemGetText({ a: 1 }, 'a')).toBe(1);

    expect(lodopItemGetText({ a: { b: 1 }}, 'a-b')).toBe(1);

    expect(lodopItemGetText({ a: { b: 1 }}, 'a.b')).toBe(1);

    expect(lodopItemGetText({ a: { b: { c: 1 }}}, 'a.b-c')).toBe(1);

    expect(lodopItemGetText({ a: { b: { c: 1 }}}, 'a-b.c')).toBe(1);

    expect(lodopItemGetText({ a: { b: { c: 1 }}}, 'a.b.c')).toBe(1);

    expect(lodopItemGetText({ a: { b: { c: 1 }}}, 'a-b-c')).toEqual({ c: 1 });

    expect(lodopItemGetText({ a: { b: { c: { d: 1 }}}}, 'a.b-c.d')).toBe(1);

    expect(lodopItemGetText({ a: { b: { c: { d: 1 }}}}, 'a.b.c.d')).toBe(1);
  });

  test('formatBarcodeData', () => {
    expect(formatBarcodeData(1, 1, null)).toEqual([]);

    expect(formatBarcodeData(1, 1, [
      1,
      2,
    ])).toEqual([
      1,
      2,
    ]);

    expect(formatBarcodeData(1, 2, [
      1,
      2,
      3,
      4,
      5,
    ])).toEqual([
      {
        item_0_0: 1,
        item_0_1: 2,
      },
      {
        item_0_0: 3,
        item_0_1: 4,
      },
      { item_0_0: 5 },
    ]);

    expect(formatBarcodeData(2, 2, [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
    ])).toEqual([
      {
        item_0_0: 1,
        item_0_1: 2,
        item_1_0: 3,
        item_1_1: 4,
      },
      {
        item_0_0: 5,
        item_0_1: 6,
        item_1_0: 7,
        item_1_1: 8,
      },
      { item_0_0: 9 },
    ]);
  });

  test('formatRookieData', () => {
    expect(formatRookieDataOld(null, null)).toEqual([]);

    expect(formatRookieDataOld([], { cainiaoTemp: '0' })).toEqual([]);

    expect(formatRookieDataOld([
      {
        value: 1,
        templateURL: 1,
        newCaiNiao: JSON.stringify({ caiNiaoDefaultData: 1 }),
      },
      {
        value: 2,
        templateURL: 2,
      },
    ], null)[0].contents).toEqual([
      {
        data: {
          value: 1,
          templateURL: 1,
        },
        templateURL: 1,
      },
      {
        data: {
          value: 2,
          templateURL: 2,
        },
        templateURL: 2,
      },
    ]);

    expect(formatRookieDataOld([
      {
        value: 1,
        templateURL: 1,
        newCaiNiao: JSON.stringify({ caiNiaoDefaultData: 1 }),
      },
      {
        value: 2,
        templateURL: 2,
      },
    ], { cainiaoTemp: '1' })[0].contents).toEqual([
      { caiNiaoDefaultData: 1 },
      {
        data: {
          value: 1,
          templateURL: 1,
        },
        templateURL: 1,
      },
      {
        data: {
          value: 2,
          templateURL: 2,
        },
        templateURL: 2,
      },
    ]);
  });

  test('formatDyData', () => {
    expect(formatDyDataOld(null)).toEqual([]);

    expect(formatDyDataOld([])).toEqual([]);

    expect(formatDyDataOld([{ value: 1 }])).toEqual([]);

    expect(formatDyDataOld([{ dyData: { printData: JSON.stringify({ value: 1 }) }}])[0].contents).toEqual([{ value: 1 }]);

    expect(formatDyDataOld([
      {
        dyData: {
          customTempUrl: 1,
          customData: JSON.stringify({ value: 1 }),
        },
      },
    ])[0].contents).toEqual([
      {
        data: { value: 1 },
        templateURL: 1,
      },
    ]);

    expect(formatDyDataOld([
      {
        dyData: {
          customTempUrl: 1,
          customData: JSON.stringify({ value: 1 }),
          printData: JSON.stringify({ value: 1 }),
        },
      },
    ])[0].contents).toEqual([
      { value: 1 },
      {
        data: { value: 1 },
        templateURL: 1,
      },
    ]);
  });

  test('formatPddData', () => {
    expect(formatPddDataOld(null, null)).toEqual([]);

    expect(formatPddDataOld([], 1)).toEqual([]);

    expect(formatPddDataOld([{ newCaiNiao: JSON.stringify({ caiNiaoDefaultData: 1 }) }], 1)[0].contents).toEqual([{ caiNiaoDefaultData: 1 }]);

    expect(formatPddDataOld([{ pinduoduo: JSON.stringify({ value: 1 }) }], 1)[0].contents).toEqual([
      {
        data: { value: 1 },
        templateURL: 'https://front.ejingling.cn/customer-source/printTemp/pdd_waybill_yilian_template.xml',
      },
    ]);

    expect(formatPddDataOld([
      {
        newCaiNiao: JSON.stringify({ caiNiaoDefaultData: 1 }),
        pinduoduo: JSON.stringify({ value: 1 }),
      },
    ], 0)[0].contents).toEqual([
      { caiNiaoDefaultData: 1 },
      {
        data: { value: 1 },
        templateURL: 'https://front.ejingling.cn/customer-source/printTemp/pdd_waybill_seller_area_template.xml',
      },
    ]);
  });
});
