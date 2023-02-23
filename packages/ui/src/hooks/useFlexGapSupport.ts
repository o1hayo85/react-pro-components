import React from 'react';
import { detectFlexGapSupported } from '../utils/detectFlexGapSupported';

export const useFlexGapSupport = () => {
  const [flexSupport, setFlexSupport] = React.useState(false);
  React.useEffect(() => {
    setFlexSupport(detectFlexGapSupported());
  }, []);

  return flexSupport;
}
