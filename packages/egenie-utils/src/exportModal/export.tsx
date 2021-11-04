import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Select, Modal, Table, Form } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import type { ReactNode } from 'react';
import React, { Component } from 'react';
import type { ExportStore } from './exportStore';
import styles from './index.less';

const Option = Select.Option;

// 导出弹窗
@observer
export class ExportModal extends Component<{ store?: ExportStore; }> {
  render(): ReactNode {
    const { visible, commitLoading, templateList, column, fileName, showTips, templateColumnList, editId, selectTemplateId, setForm, onSelectTemplate, onChangeFileName, onExport, onClose, newTemplateClick } = this.props.store;
    const EditableCell = ({
      editing,
      dataIndex,
      title,
      record,
      index,
      children,
      inputType,
      ...restProps
    }) => {
      const inputNode = inputType === 'input' ? (
        <Input
          autoFocus
          maxLength={10}
        />
      ) : (
        <Select
          className={styles.templateColumnSelect}
          filterOption={(input, option) => {
            return option.children.includes(input);
          }}
          mode="multiple"
          showSearch
        >
          {templateColumnList.map((el) => {
            return (
              <Option
                key={el.id}
                value={el.id}
              >
                {el.baseSerializeSchemaName}
              </Option>
            );
          })}
        </Select>
      );
      return (
        <td {...restProps}>
          {editing ? (
            <Form.Item
              name={inputType === 'input' ? 'templateName' : 'fieldIds'}
              style={{ margin: 0 }}
            >
              {inputNode}
            </Form.Item>
          ) : (
            children
          )}
        </td>
      );
    };

    const mergedColumns = toJS(column).map((col, index) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: record.id === editId,
          inputType: col.key === 'templateName' ? 'input' : 'multiSelect',
        }),
      };
    });

    return (
      <Modal
        className={styles.exportModal}
        confirmLoading={commitLoading}
        maskClosable={false}
        onCancel={onClose}
        onOk={onExport}
        title="导出"
        visible={visible}
        width={800}
      >
        <div className={styles.fileNameWrapper}>
          文件名称：
          <Input
            className={styles.fileNameInput}
            onChange={onChangeFileName}
            value={fileName}
          />
          <div className={styles.redTips}>
            {showTips ? '文件名称不能包含特殊符号?、:*\\/“”<>|' : ''}
          </div>
        </div>
        <div>
          选择模板：
          <Form
            component={false}
            ref={setForm}
          >
            <Table
              className={styles.table}
              columns={mergedColumns}
              components={{ body: { cell: EditableCell }}}
              dataSource={templateList}
              onRow={(record) => {
                return { onClick: () => onSelectTemplate(record.id) };
              }}
              pagination={false}
              rowKey={(record) => record.id}
              rowSelection={{
                selectedRowKeys: [selectTemplateId],
                hideSelectAll: true,
                type: 'radio',
                onSelect: (record) => onSelectTemplate(record.id),
              }}
              scroll={{ y: 400 }}
            />
          </Form>
          <Button
            className={styles.newBtn}
            icon={<PlusOutlined/>}
            onClick={newTemplateClick}
            type="dashed"
          >
            新增模板
          </Button>
        </div>
      </Modal>
    );
  }
}

