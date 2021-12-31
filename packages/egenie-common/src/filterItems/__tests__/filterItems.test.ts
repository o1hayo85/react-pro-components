import { FilterItems } from '../filterItems';

describe('filterItems', () => {
  test('validParams', () => {
    // @ts-ignore
    expect(() => new FilterItems({ filterItems: [{ type: 'a' }]})).toThrow();

    expect(() => new FilterItems({ filterItems: [{ type: 'input' }]})).toThrow();

    expect(() => new FilterItems({
      filterItems: [
        {
          type: 'input',
          field: 'a',
        },
      ],
    })).toThrow();

    expect(() => new FilterItems({
      filterItems: [
        {
          type: 'input',
          field: 'a',
          label: 'a',
        },
        {
          type: 'input',
          field: 'a',
          label: 'b',
        },
      ],
    })).toThrow();

    expect(() => new FilterItems({
      filterItems: [
        {
          type: 'input',
          field: 'a',
          label: 'a',
        },
        {
          type: 'input',
          field: 'b',
          label: 'a',
        },
      ],
    })).toThrow();
  });
});
