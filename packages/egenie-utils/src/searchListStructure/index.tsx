import { Button } from 'antd';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component, CSSProperties, ReactNode } from 'react';
import { MainSubStructure, MainSubStructureModel, IMainSubStructureModel } from '../egGrid';
import { NormalProgramme, NormalProgrammeComponent, NormalProgrammeParams, ValueAndLabelData } from '../programme';
import styles from './index.less';

interface IStore {
  grid: IMainSubStructureModel;
  programe: Partial<NormalProgrammeParams>;
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

      this.programe = new NormalProgramme({
        ...props.programe,
        dict: props.dict,
        handleSearch: this.grid.onQuery,
      });
    };

    init();
    this.grid.getFilterParams = () => this.programe.filterItems.params;
  }

  @observable public grid: MainSubStructureModel;

  @observable public programe: NormalProgramme;
}

@observer
export class SearchListStructure extends Component<{ store: SearchListModal; className?: string; style?: CSSProperties; }> {
  render(): ReactNode {
    const { store: { programe, grid }, className = '', style = {}} = this.props;
    return (
      <div
        className={`${styles.searchListStructure} ${className}`}
        style={style}
      >
        <div className={`${styles.pd16} ${styles.bgf} ${styles.filter}`}>
          <NormalProgrammeComponent store={programe}/>
        </div>
        <div className={`${styles.flex1} ${styles.mt16}`}>
          <MainSubStructure store={grid}/>
        </div>
      </div>
    );
  }
}
