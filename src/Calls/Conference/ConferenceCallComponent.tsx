import React, { FunctionComponent, useEffect, useState } from 'react';
import { eventEmitter, EventType, IConference, Logger, ConferenceActionsView, ConferenceCallView, IConferenceParticipants, ISharingConference, CallTypeName } from 'react-native-rainbow-module';
import { Body, Container, Header, Left, Title, Right, Icon } from 'native-base';
import {
    StyleSheet,
    View
} from 'react-native';
import { renderCustomActiveCall, renderCustomIncomingCall, renderActiveCallActionsButtons, renderIncomingCallActionsButtons } from './CustomizableConferenceView';
import { ShareConferenceView } from './ShareConferenceView';

const logger = new Logger('ConferenceCallComponent');

export const ConferenceCallComponent: FunctionComponent = () => {

    const [conferenceCall, setConferenceCall] = useState<IConference>();
    const [sharingInfo, setSharingInfo] = useState<ISharingConference>();
    const [switchToShareScreen, setSwitchToShareScreen] = useState<boolean>(true);

    useEffect(() => {
        const handleCurrentCallEvent = (call?: IConference) => {
            if (call?.currentTypeName === CallTypeName.Conference) {
                logger.info('CurrentCall event received: call is active');
                setConferenceCall(call);
            } else {
                logger.info(
                    'CurrentCall event received: no call is active, exiting call activity'
                );
            }
        };
        const currentCallListener = eventEmitter.addListener(EventType.GetCurrentCall, handleCurrentCallEvent);
        const currentConferenceUpdatedListener = eventEmitter.addListener(EventType.CurrentConferenceUpdated, (call?: IConference) => {
            logger.info(`CurrentConferenceUpdated with conference call: ${call}`);
            setConferenceCall(call);
        });

        const getSharingUpdate = eventEmitter.addListener(
            EventType.GetConferenceScreenSharingUpdate,
            (eventData: ISharingConference) => {
                logger.info(`conference screen sharing update with isSharingEnabled: ${eventData.isSharingEnabled}`);
                setSharingInfo(eventData);
            }
        );

        const confAttendeesUpdatesListener = eventEmitter.addListener(EventType.ConferenceAttendeesUpdates, (attendees: IConferenceParticipants[]) => {
            logger.info(`get conference participants with count ${attendees.length}`);
            if (conferenceCall) {
                setConferenceCall({ ...conferenceCall, attendees });
            }
        });

        return () => {
            currentCallListener.remove();
            currentConferenceUpdatedListener.remove();
            getSharingUpdate.remove();
            confAttendeesUpdatesListener.remove();
        }
    }, [conferenceCall]);


    const hideOrShowConferenceParticipant = () => {
        setSwitchToShareScreen(!switchToShareScreen);
    }


    if (conferenceCall) {
        const { name } = conferenceCall.callPeer;

        const SharingVideoView = (
            <ShareConferenceView sharingParticipant={sharingInfo?.sharingParticipant} />
        );
        const CallView = (
            <ConferenceCallView conferenceCall={conferenceCall} renderIncomingCallView={renderCustomIncomingCall} renderActiveCallView={renderCustomActiveCall} />
        );

        return (
            <Container >
                <Header style={defaultStyle.headerColor} hasSegment={true}>
                    <Left style={defaultStyle.leftStyle}>
                        {sharingInfo?.isSharingEnabled && <Icon
                            name={switchToShareScreen ? 'stop-screen-share' : 'screen-share'}
                            type="MaterialIcons"
                            onPress={hideOrShowConferenceParticipant}
                            style={defaultStyle.hideShowParticipant}
                            active={true}
                        />}
                    </Left>
                    <Body>
                        <Title style={defaultStyle.headerTitle}>{name}</Title>
                    </Body>
                    <Right />
                </Header>
                <View style={defaultStyle.backgroundImage}>
                    {sharingInfo?.isSharingEnabled && switchToShareScreen ? SharingVideoView : CallView}
                    <ConferenceActionsView call={conferenceCall} style={{ container: defaultStyle.callActionContainer }} renderIncomingConferenceActions={renderIncomingCallActionsButtons} renderActiveConferenceActions={renderActiveCallActionsButtons} />
                </View>

            </Container>
        );
    }
    else {
        return null;
    }
}

const defaultStyle = StyleSheet.create({
    headerTitle: {
        textAlign: 'center',
        fontSize: 20,
        color: 'white',
    },
    headerColor: {
        backgroundColor: '#0086CF',
    },
    leftStyle: { margin: 10 },
    backgroundImage: {
        resizeMode: 'cover',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        flex: 1,
        backgroundColor: '#005b96'
    },
    hideShowParticipant: {
        fontSize: 30,
        color: '#ffffff',
    },
    callAction: { position: 'absolute', bottom: 10, left: 0, width: '100%', },
    callActionContainer: {
        position: 'absolute',
        bottom: 25,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#02a2ff',
        opacity: 0.8
    }
});