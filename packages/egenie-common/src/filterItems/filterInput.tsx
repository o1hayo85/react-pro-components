import _ from 'lodash';
import { action, extendObservable, observable } from 'mobx';
import type React from 'react';
import { FilterBase } from './filterBase';
import { ENUM_FILTER_ITEM_TYPE } from './types';
import { trimWhiteSpace } from './utils';

export class FilterInput extends FilterBase {
  constructor(options: Partial<FilterInput>) {
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
  }

  /**
   * 类型标志
   */
  @observable public type: 'input' = ENUM_FILTER_ITEM_TYPE.input;

  public toProgramme(): string | null {
    if (trimWhiteSpace(this.value, this.isTrimWhiteSpace)) {
      return trimWhiteSpace(this.value, this.isTrimWhiteSpace);
    } else {
      return null;
    }
  }

  public toParams(): {[key: string]: string; } {
    if (this.toProgramme()) {
      return { [this.field]: this.toProgramme() };
    } else {
      return {};
    }
  }

  public translateParams(): string[] {
    if (this.toProgramme()) {
      return [
        this.label,
        this.toProgramme(),
      ];
    } else {
      return [];
    }
  }

  @action
  public formatValue(value?: string): void {
    this.value = trimWhiteSpace(value, this.isTrimWhiteSpace);
  }

  private snapshot = '';

  @action private handleCallback = () => {
    if (typeof this.onChangeCallback === 'function') {
      this.onChangeCallback(_.toString(this.value));
    }
  };

  @action public reset = (): void => {
    this.value = this.snapshot;
    this.handleCallback();
  };

  /**
   * 输入的值
   */
  @observable public value = '';

  @action public onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    this.value = event.target.value;
    this.handleCallback();
  };

  /**
   * 改变值回掉
   */
  public onChangeCallback: (value?: string) => void;

  /**
   * 是否去掉左右空格
   */
  @observable public isTrimWhiteSpace = true;

  /**
   * 输入框提示文字
   */
  @observable public placeholder = '请输入';

  /**
   * 是否可清除
   */
  @observable public allowClear = true;

  /**
   * 是否禁止
   */
  @observable public disabled = false;
}
