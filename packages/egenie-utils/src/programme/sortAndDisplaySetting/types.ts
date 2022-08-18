export interface SortAndDisplaySettingItem {
  field: string;
  label: string;
  showItem: boolean;
}

export interface SortAndDisplaySettingViewProps {
  onCancel: (...arg: any[]) => any;
  originData: SortAndDisplaySettingItem[];
  initSettingData: SortAndDisplaySettingItem[];
  callback: (params: SortAndDisplaySettingItem[]) => Promise<unknown>;
}
