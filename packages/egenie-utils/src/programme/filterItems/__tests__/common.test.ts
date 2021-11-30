import { FilterBase } from '../common';

class CommonBase extends FilterBase {
  constructor() {
    super();
  }

  public formatValue(value?: string) {
    return '';
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public reset() {
  }

  public translateParams(): string[] {
    return [];
  }

  public toProgramme(): string | null {
    return undefined;
  }

  public toParams(): {[p: string]: string; } {
    return {};
  }
}

describe('filterItemsCommon', () => {
  test('filterItemsCommon init', () => {
    const commonBase = new CommonBase();
    expect(commonBase.showItem)
      .toBeDefined();
    expect(commonBase.labelWidth)
      .toBeDefined();
    expect(commonBase.showCollapse)
      .toBeDefined();
    expect(commonBase.isCollapse)
      .toBeDefined();
    expect(commonBase.toggleCollapse)
      .toBeDefined();
    expect(commonBase.field)
      .toBeDefined();
    expect(commonBase.label)
      .toBeDefined();
    expect(commonBase.onPressEnter)
      .toBeDefined();
    expect(commonBase.style)
      .toBeDefined();
    expect(commonBase.className)
      .toBeDefined();
    expect(commonBase.data)
      .toBeDefined();
    expect(commonBase.handleData)
      .toBeDefined();
  });
});
