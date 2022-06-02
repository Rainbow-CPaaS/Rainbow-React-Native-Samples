import React from 'react';
import { RainbowContainer, registerRainbowCallComponents } from 'react-native-rainbow-module';
import { P2PCall } from './P2PCalls/P2PCall';
import { ConferenceCallComponent } from './Conference/ConferenceCallComponent';

const CallApp = () => (
    <RainbowContainer>
        <ConferenceCallComponent />
        <P2PCall />
    </RainbowContainer>
);

export const registerRainbowCallApp = () => registerRainbowCallComponents(() => CallApp);