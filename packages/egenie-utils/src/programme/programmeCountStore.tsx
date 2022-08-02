import { action, observable } from 'mobx';
import type { BaseData } from '../request';
import { request } from '../request';
import type { Programme } from './programme';

export class ProgrammeCountStore {
  constructor(private parent: Programme) {
  }

  @observable public showProgrammeCount = false;

  @observable public programmeCount: Record<string, number> = {};

  @observable public isProgrammeCountLoading = false;

  @action public getProgrammeCount = (): void => {
    if (this.showProgrammeCount) {
      this.isProgrammeCountLoading = true;
      request<BaseData<Record<string, number>>>({
        url: '/api/boss/baseinfo/rest/filterSet/count',
        method: 'post',
        data: { module: this.parent.moduleName },
      })
        .then((info) => this.programmeCount = info.data || {})
        .finally(() => this.isProgrammeCountLoading = false);
    }
  };
}
