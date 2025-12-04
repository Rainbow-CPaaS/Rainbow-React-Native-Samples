import React from 'react';
import {RainbowProvider} from 'react-native-rainbow-module';
import {P2PCall} from './P2PCalls/P2PCall';
import {ConferenceCallComponent} from './Conference/ConferenceCallComponent';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';


export const CallApp = () => (
  <NavigationContainer>
    <RainbowProvider>
      <PaperProvider>
        <ConferenceCallComponent />
        <P2PCall />
      </PaperProvider>
    </RainbowProvider>
  </NavigationContainer>
);
