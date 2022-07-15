import { FilterInput } from '../filterInput/filterInput';

describe('filterInput', () => {
  test('init', () => {
    const filterInput = new FilterInput({
      field: 'input',
      label: 'input',
      showCollapse: true,
      value: '  aa  ',
    });

    expect(filterInput.showCollapse).toBeFalsy();

    filterInput.value = 'bb';
    filterInput.reset();

    expect(filterInput.value).toBe('aa');
  });

  test('toProgramme toParams translateParams', () => {
    const filterInput = new FilterInput({
      field: 'input',
      label: 'input',
    });

    expect(filterInput.toProgramme()).toBeNull();
    expect(filterInput.toParams()).toEqual({});
    expect(filterInput.translateParams()).toEqual([]);

    filterInput.value = '  aa  ';
    expect(filterInput.toProgramme()).toBe('aa');
    expect(filterInput.toParams()).toEqual({ input: 'aa' });
    expect(filterInput.translateParams()).toEqual([
      'input',
      'aa',
    ]);
  });
});
