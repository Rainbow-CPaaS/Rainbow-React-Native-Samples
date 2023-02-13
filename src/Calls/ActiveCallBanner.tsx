import React, { FunctionComponent, useEffect, useState, } from 'react';
import { SafeAreaView, StyleSheet, Text, TextStyle, TouchableHighlight, ViewStyle, } from 'react-native';
import { Strings } from '../resources/localization/Strings';
import { eventEmitter, EventType, CallState, Logger, currentCallService, ICall, Timer, IConference, IP2PCall } from 'react-native-rainbow-module';

interface IProps {
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const logger = new Logger('ActiveCallBanner');

export const ActiveCallBanner: FunctionComponent<IProps> = ({
    style,
    textStyle,
}) => {
    const mergedStyle = { ...styles.container, ...style };
    const mergedTextStyle = { ...styles.pannerText, ...textStyle };
    const [currentCall, setCurrentCall] = useState<ICall>();
    useEffect(() => {

        const currentConferenceUpdatedListener = eventEmitter.addListener(EventType.CurrentConferenceUpdated, (conferenceCall?: IConference) => {
            logger.info(`CurrentConferenceUpdated with conference call: ${conferenceCall}`);
            setCurrentCall(conferenceCall);
        });
        const callUpdatedListener = eventEmitter.addListener(EventType.P2PCallUpdated, (p2pCall?: IP2PCall) => {
            logger.info(`P2PCallUpdated with p2p call: ${p2pCall?.callId}`);
            setCurrentCall(p2pCall);
        });

        return () => {
            currentConferenceUpdatedListener.remove();
            callUpdatedListener.remove();
        }
    }, []);

    const openActiveCall = () => {
        logger.info('openActiveCall');
        currentCallService.retrieveCurrentCall();
    };

    return currentCall?.callState === CallState.ACTIVE || currentCall?.callState === CallState.HELD ? (
        <TouchableHighlight onPress={openActiveCall}>
            <SafeAreaView style={mergedStyle}>
                <Text style={mergedTextStyle}>{Strings.callInProgress}</Text>
                <Timer startTime={currentCall.startTime} style={mergedTextStyle} />
            </SafeAreaView>
        </TouchableHighlight>
    ) : null;
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#5cad46',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        minHeight: 60,
    },
    pannerText: {
        color: 'white',
        margin: 10,
        fontSize: 18,
    },
});
