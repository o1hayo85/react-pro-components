/**
 * 格式化number
 * @param num 数字
 */
export function formatNumber(num: unknown): number {
  const newNum = Number(num);
  //isFinite function determine whether this params is this infinite or NaN, And return false it is infinite or NaN, else return true; 
  return isFinite(newNum) ? newNum : 0;
}

/**
 * @name 数字字符相加，支持浮点数相加
 */
export function plus(num1: unknown, num2: unknown): number {
  const str1 = String(formatNumber(num1));
  const str2 = String(formatNumber(num2));
  const decimalLength1 = (str1.split('.')[1] || '').length;
  const decimalLength2 = (str2.split('.')[1] || '').length;

  const maxDecimalLength = Math.max(decimalLength1, decimalLength2);
  const newNum1 = Number(str1.replace('.', '')) * Math.pow(10, maxDecimalLength - decimalLength1);
  const newNum2 = Number(str1.replace('.', '')) * Math.pow(10, maxDecimalLength - decimalLength2);
  return (newNum1 + newNum2) / Math.pow(10, maxDecimalLength);
}

/**
 * @name 浮点数相减
 */
export function subtract(num1: unknown, num2: unknown): number {
  return plus(num1, -num2)
}


/**
 * @name 浮点数相乘
 * @param num1 数字1
 * @param num2 数字2
 */
export function multiple(num1: unknown, num2: unknown): number {
  const s1 = String(formatNumber(num1));
  const s2 = String(formatNumber(num2));
  const decimalLength = (s1.split('.')[1] || '').length + (s2.split('.')[1] || '').length;

  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, decimalLength);
}

/**
 * @name 千分位
 * @param num 数字
 */
export function thousandthSeparator(num: unknown): string {
  return String(formatNumber(num))
    .replace(/\d+/, (n) => n.replace(/(?!^)(?=(\d{3})+$)/g, ','));
}


type Mode = 'round' | 'remove';

/**
 * 价格格式化
 * @param { unknown } price 要格式化的价格
 * @param { number } decimalLength 保留的小数位数
 * @param { Mode } mode 保留小数的方式，四舍五入or直接去除
 */
export function formatPrice(price: unknown, decimalLength = 2, mode: Mode = 'remove'): number {
  const base = Math.pow(10, decimalLength);
  const transformPrice = mode === 'remove' ? Math.floor(multiple(price, base)) : Math.round(multiple(price, base));
  if (isFinite(transformPrice) && transformPrice > 0) {
    return transformPrice / base
  } else {
    return 0
  }
}