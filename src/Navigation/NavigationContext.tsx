import React from 'react';
import { IBackButtonHandler } from 'react-native-rainbow-module';

type RegisterBackButtonHandler = (handler: IBackButtonHandler) => () => void;

export const NavigationContext = React.createContext<RegisterBackButtonHandler | undefined>(undefined);
