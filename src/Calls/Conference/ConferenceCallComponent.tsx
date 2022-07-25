import React, { FunctionComponent, useEffect, useState } from 'react';
import { eventEmitter, EventType, IConference, Logger, ConferenceActionsView, ConferenceCallView, IConferenceParticipants, CallTypeName, CallState, Timer, MicButton, SwitchCameraButton, HideConferenceCallViewButton, AddVideoToConfButton, LoudspeakerButton, LockConfButton, EndConferenceCallButton, conferenceService, AnswerConfCallButton, IParticipantViewStyleProps, IImageHolderStyle, ConferenceLocalVideo, ImageHolder, ParticipantConferenceView, Strings } from 'react-native-rainbow-module';
import { Body, Container, Header, Left, Title, Right, Icon, Text } from 'native-base';
import {
    StyleSheet,
    View
} from 'react-native';
import { ShareConferenceView } from './ShareConferenceView';
import { ConferenceDelegateContainer } from './ConferenceDelegate';
import { FlatGrid } from 'react-native-super-grid';
import { Actions } from 'react-native-router-flux';

const logger = new Logger('ConferenceCallComponent');

export const ConferenceCallComponent: FunctionComponent = () => {

    const [conferenceCall, setConferenceCall] = useState<IConference>();
    const [switchToShareScreen, setSwitchToShareScreen] = useState<boolean>(true);
    const [showDelegateConference, setShowDelegateConference] = useState<boolean>(false);
    const delegateParticipants: IConferenceParticipants[] = conferenceCall?.attendees.filter((participant: IConferenceParticipants) => (participant.canBeConferenceDelegate === true && !participant.isMyUser)) ?? [];

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


        const confAttendeesUpdatesListener = eventEmitter.addListener(EventType.ConferenceAttendeesUpdates, (attendees: IConferenceParticipants[]) => {
            logger.info(`get conference participants with count ${attendees.length}`);
            if (conferenceCall) {
                setConferenceCall({ ...conferenceCall, attendees });
            }
        });

        return () => {
            currentCallListener.remove();
            currentConferenceUpdatedListener.remove();
            confAttendeesUpdatesListener.remove();
        }
    }, [conferenceCall]);


    const hideOrShowConferenceParticipant = () => {
        setSwitchToShareScreen(!switchToShareScreen);
    }

    // Customize Conference Action Buttons

    const renderIncomingCallActionsButtons = (call: IConference) => {
        return (
            <View style={defaultStyle.buttonsViewStyle} >
                <AnswerConfCallButton call={call} />
                <EndConferenceCallButton
                    call={call}
                    style={{
                        container: {
                            width: 60,
                            height: 60,
                        }
                    }}
                />
            </View>
        );
    }

    const renderActiveCallActionsButtons = (call: IConference) => {
        const { callPeer, isLocalVideoEnabled } = call;
        const onEndPressed = () => {
            if (conferenceCall) {
                // Check if my user had initiated the conference call, if its true then show the delegate view to hand handover the call, otherwise end the call.
                conferenceCall.isMyUserStartConference ? setShowDelegateConference(true) : conferenceService.endConferenceCall(callPeer.id);
            }
        }
        const goToBubbleChatView = () => {
            const bubble = call.callPeer;
            if (Actions.currentScene !== 'BubbleChatView') {
                Actions.BubbleChatView({ bubble });
            }
        }

        return (
            <View style={defaultStyle.buttonsViewStyle} >
                <MicButton />
                {isLocalVideoEnabled && <SwitchCameraButton />}
                <HideConferenceCallViewButton call={call} renderOnPress={goToBubbleChatView} />
                <AddVideoToConfButton call={call} />
                <LoudspeakerButton />
                {callPeer.isMyUserModerator && <LockConfButton call={call} />}
                <EndConferenceCallButton call={call} renderOnPress={onEndPressed} />
            </View>
        );
    }

    // Customize Conference View

    const renderCustomIncomingCall = (call: IConference) => {
        const { callPeer } = call;
        return (
            <View style={defaultStyle.viewStyle}>
                <Text style={defaultStyle.incomingCallInvitedMsg}>{`${callPeer.bubbleOwner.name} ${Strings.ConferenceCallInvitation} ${callPeer.name} `}</Text>
                <ImageHolder url={callPeer.imageURL} style={conferenceBubbleImageStyle} name={callPeer.name} />
            </View>
        );
    }
    const renderParticipantItem = ({ item }: { item: IConferenceParticipants }) => {
        return (
            <View style={defaultStyle.participantItemContainer}>
                <ParticipantConferenceView participant={item} key={item.jId} style={participantViewStyle} />
            </View>
        )
    }
    const renderCustomActiveCall = (call: IConference) => {
        const { isLocalVideoEnabled, attendees } = call;
        const attendeesWithoutMyUser = attendees.filter((item: IConferenceParticipants) => { return !item.isMyUser });
        return (
            <View style={defaultStyle.viewStyle}>
                {isLocalVideoEnabled && <ConferenceLocalVideo />}
                <FlatGrid
                    itemDimension={140}
                    data={attendeesWithoutMyUser}
                    style={defaultStyle.participantListStyle}
                    spacing={10}
                    renderItem={renderParticipantItem}
                />
            </View>
        );
    }

    if (conferenceCall) {
        const { name, id } = conferenceCall.callPeer;
        const SharingVideoView = (
            <ShareConferenceView sharingParticipant={conferenceCall.sharingParticipant} />
        );
        const CallView = (
            <ConferenceCallView conferenceCall={conferenceCall} renderIncomingCallView={renderCustomIncomingCall} renderActiveCallView={renderCustomActiveCall} />
        );

        return (
            <Container >
                <Header style={defaultStyle.headerColor} hasSegment={true}>
                    <Left style={defaultStyle.leftStyle}>
                        {// Show or hide screen sharing button
                            conferenceCall.isSharingEnabled && <Icon
                                name={switchToShareScreen ? 'stop-screen-share' : 'screen-share'}
                                type="MaterialIcons"
                                onPress={hideOrShowConferenceParticipant}
                                style={defaultStyle.hideShowParticipant}
                                active={true}
                            />}
                    </Left>
                    <Body>
                        <Title style={defaultStyle.headerTitle}>{name}</Title>
                        {conferenceCall.callState === CallState.ACTIVE && <Text style={defaultStyle.callDuration}><Timer startTime={conferenceCall.startTime} /></Text>}

                    </Body>
                    <Right />
                </Header>
                <View style={defaultStyle.backgroundImage}>
                    <ConferenceDelegateContainer showDelegateView={showDelegateConference} delegateParticipants={delegateParticipants} bubbleId={id} onClosePressed={() => setShowDelegateConference(false)} />
                    {conferenceCall.isSharingEnabled && switchToShareScreen ? SharingVideoView : CallView}
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
        alignSelf: 'center',
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
    },
    buttonsViewStyle: { flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'space-around' },
    incomingCallInvitedMsg: {
        fontSize: 15,
        color: '#ffffff',
        margin: 20,
        alignSelf: 'center'
    },
    participantListStyle: {
        marginTop: 10,
        flex: 1
    },
    participantItemContainer: {
        backgroundColor: '#02a2ff',
        borderRadius: 5,
        padding: 10,
        flexWrap: 'wrap',
        flexDirection: 'column'
    },
    viewStyle: { flex: 1 },
    callDuration: {
        textAlign: 'center',
        alignSelf: 'center',
        color: 'white',
        fontSize: 12,
        fontWeight: 'normal'
    },
});

const conferenceBubbleImageStyle: IImageHolderStyle = {
    thumbnail: {
        position: 'absolute',
        top: 100,
        alignSelf: 'center',
        width: 140,
        height: 140,
        borderRadius: 100
    },
    thumbnailContainer: {
        position: 'absolute',
        top: 100,
        alignSelf: 'center',
        width: 140,
        height: 140,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#cf0071'
    },
    imageTextStyle: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold'
    }
};

const participantViewStyle: IParticipantViewStyleProps = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',

    },
    participantViewStyle: {
        width: 150,
        height: 150,
    },
    participantBackgroundViewStyle: {
        justifyContent: 'center',
    },
    miceIconStyle: {
        color: 'white',
    },
    ParticipantDetailContainer: {
        marginTop: 10,
        backgroundColor: '#707680',
        flexDirection: 'row',
    },
    userNameStyle: {
        color: 'white',
        fontSize: 20,
        width: 150,
        textAlign: 'center'
    }
});
