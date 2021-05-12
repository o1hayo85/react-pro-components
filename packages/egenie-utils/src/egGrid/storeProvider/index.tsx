import React, { FC, createContext, ReactNode, ReactElement } from 'react';
import { EgGridModel } from '../egGridModel';

export const StoreContext = createContext<EgGridModel>({} as EgGridModel);

export type StoreComponent = FC<{
  store: EgGridModel;
  children: ReactNode;
}>;

// 根store的使用方式
export const StoreProvider: StoreComponent = ({
  children,
  store,
}): ReactElement => {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};
