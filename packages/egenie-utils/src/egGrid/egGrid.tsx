import { Pagination, Spin, Button, Empty } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import DataGrid from 'react-data-grid';
import { DragAndDropHOC } from '../dragAndDropHOC';
import { ColumnSettingModal } from './columnSetting';
import { EgGridModel } from './egGridModel';
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
              );
            }}
            headerRowHeight={headerRowHeight}
            onColumnResize={onColumnResize}
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
    columnSettingModel, columnSettingModel: {
      openColumnSetting,
    }} = store;
  return (
    <div className={`${styles.edgPagerWrapper}`}>
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
        <span
          className={styles.refreshWrap}
          onClick={openColumnSetting}
        >
          <i className={`${styles.edgBlue} icon-setup`}/>
          设置
        </span>
      </div>
      <ColumnSettingModal store={columnSettingModel}/>
    </div>
  );
});

