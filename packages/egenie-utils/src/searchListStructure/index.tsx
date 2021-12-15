import type { NormalProgrammeParams, ValueAndLabelData } from 'egenie-common';
import { NormalProgramme, NormalProgrammeComponent } from 'egenie-common';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import type { CSSProperties, ReactNode } from 'react';
import React, { Component } from 'react';
import type { IMainSubStructureModel } from '../egGrid';
import { MainSubStructure, MainSubStructureModel } from '../egGrid';
import styles from './index.less';

interface IStore {
  grid: IMainSubStructureModel;
  programme: Partial<NormalProgrammeParams>;
  dict?: {[key: string]: ValueAndLabelData; };
  className?: string;
  style?: CSSProperties;
}

export class SearchListModal {
  constructor(props: IStore) {
    const init = () => {
      this.grid = new MainSubStructureModel({
        ...props.grid,
        hiddenSubTable: true,
      });

      this.programme = new NormalProgramme({
        ...props.programme,
        dict: props.dict,
        handleSearch: this.grid.onQuery,
      });
    };

    init();
    this.grid.getFilterParams = () => this.programme.filterItems.params;
  }

  @observable public grid: MainSubStructureModel;

  @observable public programme: NormalProgramme;
}

@observer
export class SearchListStructure extends Component<{ store: SearchListModal; className?: string; style?: CSSProperties; }> {
  render(): ReactNode {
    const { store: { programme, grid }, className = '', style = {}} = this.props;
    return (
      <div
        className={`${styles.searchListStructure} ${className}`}
        style={style}
      >
        <div className={`${styles.pd16} ${styles.bgf} ${styles.filter}`}>
          <NormalProgrammeComponent store={programme}/>
        </div>
        <div className={`${styles.flex1} ${styles.mt16}`}>
          <MainSubStructure store={grid}/>
        </div>
      </div>
    );
  }
}
