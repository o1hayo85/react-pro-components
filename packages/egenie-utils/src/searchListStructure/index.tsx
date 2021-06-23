import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component, CSSProperties, ReactNode } from 'react';
import { MainSubStructure, MainSubStructureModel, IMainSubStructureModel } from '../egGrid';
import { NormalProgramme, NormalProgrammeComponent, NormalProgrammeParams, ValueAndLabelData } from '../programme';
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
