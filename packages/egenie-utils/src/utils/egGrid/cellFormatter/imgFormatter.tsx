import React from 'react';

function showPic(event: React.MouseEvent<HTMLImageElement, MouseEvent>, pic: string, otherProps) {
  if (!document.getElementById('picImg')) {
    const { width, height } = otherProps;
    const picDiv = document.createElement('div');
    picDiv.id = 'picUrl';
    picDiv.style.display = 'none';
    const picImg: HTMLImageElement = document.createElement('img');
    picImg.style.width = width ? `${width}px` : '280px';
    picImg.style.height = height ? `${height}px` : '280px';
    picImg.id = 'picImg';
    picImg.src = '';
    picDiv.appendChild(picImg);
    document.body.appendChild(picDiv);
  }

  let x = event.clientX,
    y = event.clientY;

  const lImgWidth = 280,
    sImgWidth = 20,
    windowHeight = window.innerHeight,
    windowWidth = window.innerWidth;
  if (windowHeight - y < lImgWidth) {
    y -= lImgWidth + sImgWidth;
  } else {
    y += sImgWidth;
  }
  if (windowWidth - x < lImgWidth) {
    x -= lImgWidth + sImgWidth;
  } else {
    x += sImgWidth;
  }

  ((document.getElementById('picImg') as HTMLImageElement).src) = pic;
  const picStyle = document.getElementById('picUrl').style;
  picStyle.display = 'block';
  picStyle.border = '0px';
  picStyle.position = 'absolute';
  picStyle.left = `${x}px`;
  picStyle.top = `${y}px`;
  picStyle.zIndex = '99999';
}

function hidePic(event: React.MouseEvent<HTMLImageElement, MouseEvent>) {
  document.getElementById('picUrl').style.display = 'none';
}
interface IImgProps {
  value?: string;
  className?: string;
  alt?: string;
  width?: number ;
  height?: number;
  row?: any;
}
export const ImgFormatter: React.FC<IImgProps> = function({ row, className, value, alt, ...rest }): JSX.Element {
  return (
    <div
      className="imgFormatter"
      style={{
        display: 'flex',
        height: '100%',
        alignItems: 'center',
      }}
    >
      { value ? (
        <img
          alt={alt ?? ''}
          className={className}
          onMouseMove={(e) => showPic({ ...e }, value, rest)}
          onMouseOut={hidePic}
          src={value}
          style={{
            width: '30px',
            height: '30px',
            verticalAlign: 'baseline',
          }}
        />
      ) : ''}

    </div>
  );
};

