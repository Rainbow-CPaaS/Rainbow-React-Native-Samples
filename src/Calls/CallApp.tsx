import React from 'react';
import {RainbowContainer} from 'react-native-rainbow-module';
import {P2PCall} from './P2PCalls/P2PCall';
import {ConferenceCallComponent} from './Conference/ConferenceCallComponent';
import {NativeBaseProvider} from 'native-base';
import { NavigationContainer } from '@react-navigation/native';


export const CallApp = () => (
  <NavigationContainer>
    <RainbowContainer>
      <NativeBaseProvider>
        <ConferenceCallComponent />
        <P2PCall />
      </NativeBaseProvider>
    </RainbowContainer>
  </NavigationContainer>
);
