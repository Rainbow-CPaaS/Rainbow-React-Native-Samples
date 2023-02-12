import React, { FunctionComponent, useEffect, useState } from 'react';
import { eventEmitter, EventType, IConference, Logger, ConferenceActionsView, ConferenceCallView, IConferenceParticipants, CallTypeName, CallState, Timer, MicButton, SwitchCameraButton, HideConferenceCallViewButton, AddVideoToConfButton, LoudspeakerButton, LockConfButton, EndConferenceCallButton, conferenceService, AnswerConfCallButton, IParticipantViewStyleProps, ConferenceLocalVideo, ParticipantConferenceView, Strings, Header, AvatarPresenceBadge } from 'react-native-rainbow-module';
import { Text, VStack } from 'native-base';
import { StyleSheet, View } from 'react-native';
import { ShareConferenceView } from './ShareConferenceView';
import { ConferenceDelegateContainer } from './ConferenceDelegate';
import { FlatGrid } from 'react-native-super-grid';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
                    style={{ container: { width: 60, height: 60 } }}
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
            <VStack justifyContent="space-between" space={2} alignItems="center">
                <Text style={defaultStyle.incomingCallInvitedMsg}>{`${callPeer.bubbleOwner.name} ${Strings.ConferenceCallInvitation} ${callPeer.name} `}</Text>
                <AvatarPresenceBadge peer={callPeer} avatarSize="140" presence={undefined} />

            </VStack>
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
            <View style={{ flex: 1, position: 'absolute' }}>
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
        const renderLeftHeader = () => {
            return (
                conferenceCall.isSharingEnabled && <Icon
                    name={switchToShareScreen ? 'stop-screen-share' : 'screen-share'}
                    onPress={hideOrShowConferenceParticipant}
                    style={defaultStyle.hideShowParticipant}
                />

            )
        }
        const renderHeaderCenter = () => {
            return (
                <VStack justifyContent="space-around" py="2">
                    <Text color="white" fontSize="md">{name}</Text>
                    {conferenceCall.callState === CallState.ACTIVE && <Text color="white" fontSize="xs"><Timer startTime={conferenceCall.startTime} /></Text>}
                </VStack>
            )
        }
        return (
            < >

                <VStack bg="#005b96" paddingBottom="10" mb="30">
                    <Header centerComponent={renderHeaderCenter} leftComponent={renderLeftHeader} />
                    <VStack justifyContent="space-between" h="95%" p="5" >
                        <ConferenceDelegateContainer showDelegateView={showDelegateConference} delegateParticipants={delegateParticipants} bubbleId={id} onClosePressed={() => setShowDelegateConference(false)} />
                        {conferenceCall.isSharingEnabled && switchToShareScreen ?
                            <ShareConferenceView sharingParticipant={conferenceCall.sharingParticipant} />
                            :
                            <ConferenceCallView conferenceCall={conferenceCall} renderIncomingCallView={renderCustomIncomingCall} renderActiveCallView={renderCustomActiveCall} />
                        }
                        <ConferenceActionsView call={conferenceCall} style={{ container: defaultStyle.callActionContainer }} renderIncomingConferenceActions={renderIncomingCallActionsButtons} renderActiveConferenceActions={renderActiveCallActionsButtons} />

                    </VStack>
                </VStack>

            </>
        );
    }
    else {
        return null;
    }
}

const defaultStyle = StyleSheet.create({
    hideShowParticipant: {
        fontSize: 30,
        color: '#ffffff',
    },
    callActionContainer: {
        justifyContent: "space-between",
        width: '100%',
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
    callDuration: {
        textAlign: 'center',
        alignSelf: 'center',
        color: 'white',
        fontSize: 12,
        fontWeight: 'normal'
    },
});

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
