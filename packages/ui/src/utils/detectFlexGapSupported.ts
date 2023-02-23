
let flexGapSupported: boolean | undefined;
export function detectFlexGapSupported() {
  if (flexGapSupported !== undefined) {
    return flexGapSupported;
  }

  if (!window.document.documentElement) {
    return false
  }

  const flex = document.createElement('div');
  flex.style.display = 'flex';
  flex.style.flexDirection = 'column';
  flex.style.rowGap = '1px';

  flex.appendChild(document.createElement('div'))
  flex.appendChild(document.createElement('div'))

  document.body.append(flex);
  flexGapSupported = flex.scrollHeight === 1; // 判断是否rowGap生效
  return flexGapSupported
}