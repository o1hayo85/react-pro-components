export interface SortAndDisplaySettingItem {

  /**
   * 主键---唯一性自己保证,内部无法处理
   */
  primaryKey: string;
  label: string;
  showItem: boolean;

  /**
   * 是否冻结(不可拖和排序)---自己需保证冻结列在开头(内部置顶是在最后一个冻结列后面)
   */
  frozen?: boolean;
}

export interface SortAndDisplaySettingViewProps {
  onCancel: (...arg: any[]) => any;

  /**
   * 初始化显示的数据
   */
  originData: SortAndDisplaySettingItem[];

  /**
   * 恢复默认的数据
   */
  initSettingData: SortAndDisplaySettingItem[];
  callback: (params: SortAndDisplaySettingItem[]) => Promise<any>;
}
