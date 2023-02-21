/**
 * @name 冒泡排序
 */
export function bubbleSort(list: number[]): number[] {
  const loopCount = list.length - 1;
  if (loopCount === 0) {
    return list;
  }

  for (let i = 0; i < loopCount; i++) {
    for (let j = 0; j < loopCount - i; j++) {
      if (list[j] > list[j + 1]) {
        [list[j], list[j + 1]] = [list[j + 1], list[j]];
      }
    }
  }

  return list;
}

/**
 * @name 选择排序
 */
export function selectionSort(list: number[]): number[] {
  for (let i = 0; i < list.length; i++) {
    let minIndex = i;

    for (let j = i + 1; j < list.length; j++) {
      if (list[j] < list[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [list[i], list[minIndex]] = [list[minIndex], list[i]];
    }
  }

  return list;
}
