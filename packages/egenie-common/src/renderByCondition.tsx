import React from 'react';

export const RenderByCondition: React.FC<{ show: boolean; }> = function({
  children,
  show,
}) {
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      { show ? children : null}
    </>
  );
};
