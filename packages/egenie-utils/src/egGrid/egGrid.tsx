import { Pagination, Spin, Button, Empty } from 'antd';
import DataGrid from 'egenie-data-grid';
import { observer } from 'mobx-react';
import React from 'react';
import { DragAndDropHOC } from '../dragAndDropHOC';
import { ColumnSettingModal } from './columnSetting';
import type { EgGridModel } from './egGridModel';
import styles from './egGridStyle.less';
import empty from './img/empty.png';
import searchEmpty from './img/searchEmpty.png';

interface IProps {
  store?: EgGridModel;
  children?: React.ReactNode;
}

export const EgGrid = observer(({ store, children }: IProps) => {
  const {
    /* columns,
       rows, */
    _rows,
    rowKeyGetter,
    rowHeight,
    loading,
    scrollLeftIsZero,
    primaryKeyFieldValue,
    primaryKeyField,
    headerRowHeight,
    draggableColumns,
    selectedIds,
    onSelectedRowsChange,
    onQuery,
    sortColumns,
    sortByLocal,
    localSort,
    remoteSort,
    sortDirection,
    onRowClick,
    onScroll,
    showPager,
    edgStyle,
    wrapClassName,
    showEmpty,
    showNoSearchEmpty,
    showNormalEmpty,
    onColumnResize,
    getSummaryRows,
    onMouseInRow,
    onMouseOutRow,
    emptyStatusView,
  } = store;

  return (
    <Spin
      size="large"
      spinning={loading}
      style={{
        display: 'flex',
        height: '100%',
        flexFlow: 'column nowrap',
      }}
      wrapperClassName={styles.edgGridSpin}
    >
      <div className={`${styles.edgWrap} ${wrapClassName || ''}`}>
        <DragAndDropHOC>
          <DataGrid
            className={`${styles.edg} ${scrollLeftIsZero ? '' : `${styles.edgHasScroll}`}`}
            columns={draggableColumns()}
            emptyRowsRenderer={function EmptyRowsRenderer() {
              return (
                <div style={{ height: 'calc(100% - 38px)' }}>
                  {
                    emptyStatusView ||
                      (
                        <div className={styles.emptyRows}>
                          {showEmpty ? (
                            <>
                              <Empty
                                description="点击立即查询后，呈现数据！"
                                image={searchEmpty}
                              />
                              <Button
                                onClick={onQuery}
                                type="primary"
                              >
                                点击查询
                              </Button>

                            </>
                          ) : null}

                          {
                            showNoSearchEmpty && (
                              <Empty
                                description="查询后，呈现数据！"
                                image={searchEmpty}
                              />
                            )
                          }

                          {
                            showNormalEmpty && (
                              <Empty
                                description="暂无数据哦！"
                                image={empty}
                              />
                            )
                          }

                        </div>
                      )
                  }
                </div>
              );
            }}
            headerRowHeight={headerRowHeight}
            onColumnResize={onColumnResize}
            onMouseInRow={onMouseInRow}
            onMouseOutRow={onMouseOutRow}
            onRowClick={onRowClick}
            onScroll={onScroll}
            onSelectedRowsChange={onSelectedRowsChange}
            onSortColumnsChange={sortByLocal ? localSort : remoteSort}
            rowClass={(row) => (row[primaryKeyField] === primaryKeyFieldValue ? `${styles.edgHightCursorRow}` : '')}
            rowHeight={rowHeight}
            rowKeyGetter={rowKeyGetter}
            rows={_rows}
            selectedRows={selectedIds}
            sortColumns={sortColumns}
            style={{ ...edgStyle }}
            summaryRows={getSummaryRows()}
          />
        </DragAndDropHOC>
        {showPager && <Pager store={store}/>}

      </div>
    </Spin>

  );
});

const PaginationOfPager = observer(({ store, children }: IProps) => {
  const { current, onPageChange, onShowSizeChange, pageSize, pageSizeOptions, showQuickJumper, size, total } = store;
  return (
    <Pagination
      current={current}
      onChange={onPageChange}
      onShowSizeChange={onShowSizeChange}
      pageSize={pageSize}
      pageSizeOptions={pageSizeOptions}
      showQuickJumper={showQuickJumper}
      showSizeChanger
      showTotal={function(total) {
        return (
          <span className={`${styles.edgf12}`}>
            共
            {total}
            条记录
          </span>
        );
      }}
      size={size}
      total={total}
    />
  );
});

const Pager = observer(({ store, children }: IProps) => {
  const { selectedRowsLength, resetAllSelectedRows, showSelectedTotal, showReset, showPagination, showRefresh, onRefresh,
    setColumnsDisplay, sumColumns, onSelectSum, searchReduceConfig, rows, columns, selectRows,
    columnSettingModel, columnSettingModel: {
      openColumnSetting,
    }} = store;
  return (
    <div className={`${styles.edgPagerWrapper}`}>
      <div className={styles.checkAndSummaryWrapper}>
        { showSelectedTotal ? (
          <div className={`${styles.edgPagerResetWrapper}`}>
            已勾选
            <span className={`${styles.edgBlue} ${styles.edgHasSelectedCount}`}>
              {selectedRowsLength}
            </span>
            条
            {showReset && (
              <span
                className={`${styles.edgBlue} ${styles.edgReset}`}
                onClick={resetAllSelectedRows}
              >
                重置
              </span>
            )}
          </div>
        ) : <div/>}
        <div className={styles.sumRowWrapper}>
          {sumColumns.length
            ? [...sumColumns].reduce((res, columnKey) => {
              let item, field;
              if (typeof columnKey === 'object') {
                const { name, key } = columnKey;
                item = columns.find((el) => el.key === key);
                field = name || '';
              } else {
                item = columns.find((el) => el.key === columnKey);
              }
              if (!item) {
                return res;
              }
              const labelName = field || (item?.name || '');
              const label = (
                <label
                  className={styles.labelName}
                  key={labelName}
                >
                  {labelName}
                </label>
              );
              let value;
              const reduceRows = onSelectSum ? selectRows : rows;
              if (typeof columnKey === 'object') {
                const { key, rule, tag, decimal } = columnKey;
                value = reduceRows.reduce((res, row) => {
                  if (rule) {
                    return res + (rule(row) || 0);
                  }
                  return res + Number(row[key] || 0);
                }, 0);
                value = tag === 'price' ? value.toFixed(decimal || 4) : decimal ? value.toFixed(decimal) : parseInt(value, 10);
              } else {
                value = reduceRows.reduce((res, row) => {
                  return res + Number(row[columnKey] || 0);
                }, 0);
                value = Number(value) || 0;
              }
              return res.concat([
                label,
                value,
              ]);
            }, [])
            : null}
          {searchReduceConfig?.length ? (
            <strong>
              <span style={{
                fontSize: 12,
                marginLeft: '10px',
              }}
              >
                查询汇总统计
              </span>
            </strong>
          ) : null}
          {
            searchReduceConfig?.length ? searchReduceConfig.reduce((pre, cur) => {
              const labelName = cur.name || '';
              const value = cur.value || 0;
              const label = (
                <label
                  className={styles.labelName}
                  key={labelName}
                >
                  {labelName}
                </label>
              );
              return pre.concat([
                label,
                value,
              ]);
            }, []) : null
          }
        </div>

      </div>

      <div className={styles.paginationWrap}>
        {
          showPagination && <PaginationOfPager store={store}/>
        }
        {showRefresh && (
          <span
            className={styles.refreshWrap}
            onClick={onRefresh}
          >
            <i className={`${styles.edgBlue} icon-replace`}/>
            刷新
          </span>
        )}
        { setColumnsDisplay && (
          <span
            className={styles.refreshWrap}
            onClick={openColumnSetting}
          >
            <i className={`${styles.edgBlue} icon-setup`}/>
            设置
          </span>
        )}
      </div>
      <ColumnSettingModal store={columnSettingModel}/>
    </div>
  );
});

