import React from 'react';
import { RainbowContainer, registerRainbowCallComponents } from 'react-native-rainbow-module';
import { P2PCall } from './P2PCalls/P2PCall';
import { ConferenceCallComponent } from './Conference/ConferenceCallComponent';
import { NativeBaseProvider } from 'native-base';

const CallApp = () => (
    <RainbowContainer>
        <NativeBaseProvider>
            <ConferenceCallComponent />
            <P2PCall />
        </NativeBaseProvider>
    </RainbowContainer>
);

export const registerRainbowCallApp = () => registerRainbowCallComponents(() => CallApp);