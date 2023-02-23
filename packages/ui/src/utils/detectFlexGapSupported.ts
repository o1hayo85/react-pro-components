
let flexGapSupport: boolean | undefined;
export function detectFlexGapSupported() {
  if (!window.document.documentElement) {
    return false
  }

  if (flexGapSupport !== undefined) {
    return flexGapSupport;
  }

  const flex = document.createElement('div');
  flex.style.display = 'flex';
  flex.style.flexDirection = 'column';
  flex.style.rowGap = '1px';

  flex.appendChild(document.createElement('div'))
  flex.appendChild(document.createElement('div'))
}