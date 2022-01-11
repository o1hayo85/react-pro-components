import { InfoCircleOutlined, DownloadOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Steps, Upload, Progress, Switch, Space } from 'antd';
import { observer } from 'mobx-react';
import type { ReactNode } from 'react';
import React, { Component } from 'react';
import styles from './index.less';
import type { ImportModelInterface } from './model';

@observer
export class ImportModal extends Component<{ store: ImportModelInterface; promptChildren?: ReactNode; }> {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props?.store?.stopInterval();
  }

  public renderImport = (): ReactNode => {
    const {
      uploadParams,
      file,
      buttonLoading,
      startImporting,
      importConditionGroup,
      isImportClick,
      downloadTemplate,
      onSwitchClick,
    } = this.props.store;
    return (
      <div className={styles.modalChildren}>
        {!file && isImportClick ? (
          <div className={styles.error}>
            <InfoCircleOutlined className={styles.errorIcon}/>
            <span className={styles.errorTitle}>
              请选择文件后，再导入!
            </span>
          </div>
        ) : undefined}
        <Steps direction="vertical">
          <Steps.Step
            description={(
              <Button
                icon={<DownloadOutlined className={styles.downloadOutlined}/>}
                onClick={downloadTemplate}
              >
                下载模版
              </Button>
            )}
            status="process"
            title="下载模版"
          />
          <Steps.Step
            description={(
              <div className={styles.upload}>
                <Upload {...uploadParams}>
                  <Button>
                    选择文件
                  </Button>
                </Upload>
                {file ? (
                  <span className={styles.fileName}>
                    {file.name}
                  </span>
                ) : undefined}
              </div>

            )}
            status="process"
            subTitle="目前仅支持文件扩展名 .xlsx 的文件"
            title="选择文件"
          />
          <Steps.Step
            description={(
              <Button
                loading={buttonLoading}
                onClick={startImporting}
              >
                开始导入
              </Button>
            )}
            status="process"
            title="导入"
          />
        </Steps>
        <div className={styles.importConditionGroup}>
          {importConditionGroup.map((item) => {
            return (
              <div
                className={styles.importParams}
                key={item.key}
              >
                <Switch
                  checked={Boolean(item.value)}
                  onClick={(checked) => {
                    onSwitchClick(checked, item.key);
                  }}
                />
                <span className={styles.importTitle}>
                  {item.title}
                </span>
                <div className={styles.explain}>
                  {item.explain}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  public renderBeingImported = (): ReactNode => {
    const {
      percent,
      openMissionCenter,
      progressStatus,
      taskStatus,
      taskStatusTitle,
    } = this.props.store;
    return (
      <div className={styles.renderBeingImported}>
        <span className={styles.title}>
          <InfoCircleOutlined className={styles.icon}/>
          系统正在执行导入，可关闭弹窗，稍后到
          <Button
            className={styles.button}
            onClick={openMissionCenter}
            type="link"
          >
            导入导出任务中心
          </Button>
          查看导入结果
        </span>
        <Progress
          format={taskStatus === 5 ? () => <CloseCircleOutlined/> : undefined}
          percent={percent}
          status={progressStatus}
          strokeWidth={10}
        />
        {taskStatusTitle ? (
          <span style={{ color: taskStatusTitle.color }}>
            {taskStatusTitle.title}
          </span>
        ) : undefined}
      </div>
    );
  };

  render(): ReactNode {
    const {
      importModalParams,
      type,
    } = this.props.store;
    return (
      <Modal {...importModalParams}>
        {type === 1 ? this.renderImport() : this.renderBeingImported()}
        {type === 1 ? this.props?.promptChildren : undefined}
      </Modal>
    );
  }
}
