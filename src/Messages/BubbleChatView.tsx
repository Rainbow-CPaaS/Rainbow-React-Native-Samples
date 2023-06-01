import { Button, Text } from 'native-base';
import {
    eventEmitter,
    EventType,
    IBubble,
    BubbleParticipants,
    Logger,
    conferenceService,
    DropDownMenu,
    bubblesService,
    IConference,
    Header
} from 'react-native-rainbow-module';
import React, { useEffect, useState } from 'react';
import { Actions } from 'react-native-router-flux';
import { Alert, StyleSheet, View } from 'react-native';
import { MessageComponent } from './MessageComponent';
import { Strings } from './../resources/localization/Strings';
import Icon from 'react-native-vector-icons/Ionicons';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';


const logger = new Logger('BubbleChatView');

export interface IBubbleChatProps {
    bubble: IBubble;
}

const BubbleMenuOptions = {
    Delete: Strings.deleteBubble,
    Leave: Strings.leaveBubble,
    Archive: Strings.archiveBubble,
    Edit: Strings.editBubble,
    SendEmail: Strings.sendConversationByEmail,
    SeeSharedFiles: Strings.seeSharedFiles
}

export const BubbleChatView: React.FunctionComponent<IBubbleChatProps> = (
    props: IBubbleChatProps
) => {

    const [index, setIndex] = useState(0);
    const [currentBubble, setCurrentBubble] = useState<IBubble>(props.bubble);
    const [currentConferenceCall, setCurrentConferenceCall] = useState<IConference>();
    const [displayJoinBanner, setDisplayJoinBanner] = useState<boolean>(false);
    const [routes] = useState([
        { key: 'conversations', title: `${Strings.conversations}` },
        { key: 'participants', title: `${Strings.participants}` },
    ]);

    useEffect(() => {
        // Listen for bubble change update
        eventEmitter.addListener(EventType.DisplayJoinBanner, (eventData: boolean)=>{
            logger.info(`addListener for ${EventType.DisplayJoinBanner} : ${eventData}`)
            setDisplayJoinBanner(eventData)

        });
        const onBubbleUpdated = eventEmitter.addListener(EventType.OnBubbleUpdated, (eventData: IBubble) => {
            logger.info(`addListener for ${EventType.OnBubbleUpdated} : ${eventData}`);
            setCurrentBubble(eventData);
        });
        const conferenceLockState = eventEmitter.addListener(EventType.GetConferenceLockState, (eventData: boolean) => {
            logger.info(`addListener for ${EventType.GetConferenceLockState} : ${eventData}`)
            Alert.alert(Strings.lockedConference, Strings.lockedConferenceMessage);
        });
        const onBubbleArchive = eventEmitter.addListener(EventType.ArchiveBubbleResult, (eventData: string) => {
            logger.info(`addListener for ${EventType.ArchiveBubbleResult} : ${eventData}`)
            Alert.alert(Strings.archiveBubble, eventData, [{ text: 'oK', onPress: () => Actions.pop() }]);
        });
        const onBubbleDeleted = eventEmitter.addListener(EventType.DeleteBubbleResult, (eventData: string) => {
            logger.info(`addListener for ${EventType.ArchiveBubbleResult} : ${eventData}`)
            Alert.alert(Strings.archiveBubble, eventData, [{ text: 'oK', onPress: () => Actions.pop() }]);
        });
        const currentConferenceUpdatedListener = eventEmitter.addListener(EventType.CurrentConferenceUpdated, (conferenceCall?: IConference) => {
            logger.info(`CurrentConferenceUpdated with conference call: ${conferenceCall?.callPeer.name} : current bubble has conf ${conferenceCall?.callPeer.jId === currentBubble.jId}`);
            if (conferenceCall?.callPeer.jId === currentBubble.jId) {
                setCurrentConferenceCall(conferenceCall);
            }
            else {
                setCurrentConferenceCall(undefined);
            }
        });


        if (currentBubble.hasActiveConference && !currentConferenceCall) {
            bubblesService.getActiveConferenceForBubble(props.bubble.id);
        }
        const getConferenceBubbleEvent = eventEmitter.addListener(
            EventType.GetActiveConferenceForBubbleResult,
            (eventData: IConference) => {
                logger.info(`GetActiveConferenceForBubbleResult:  ${eventData}`);
                setCurrentConferenceCall(eventData);
            }
        );

        return () => {
            onBubbleUpdated.remove();
            conferenceLockState.remove();
            currentConferenceUpdatedListener.remove();
            getConferenceBubbleEvent.remove();
            onBubbleArchive.remove();
            onBubbleDeleted.remove();
        }
    }, [currentConferenceCall, props]);

    const openAddParticipants = () => {
        Actions.AddParticipants({ bubbleId: currentBubble.id });
    }
    const openBubbleInfo = () => {
        Actions.editBubble({ bubble: currentBubble })
    }

    const selectMenuItem = (value: string) => {
        switch (value) {
            case BubbleMenuOptions.Edit:
                openBubbleInfo()
                break;
            case BubbleMenuOptions.Delete:
                bubblesService.deleteBubble(currentBubble.id)
                break;
            case BubbleMenuOptions.Archive:
                bubblesService.archiveBubble(currentBubble.id)
                break;
            case BubbleMenuOptions.Leave:
                bubblesService.leaveBubble(currentBubble.id)
                break;
            case BubbleMenuOptions.SendEmail:
                bubblesService.sendBubbleChatByEmail(currentBubble.id);
                break;
            case BubbleMenuOptions.SeeSharedFiles:
                Actions.SharedFiles({ peer: props.bubble });
                break;

        }

    }
    const renderBubbleMenuOptions = () => {
        const options = [];
        if (currentBubble.isMyUserOwner) {
            options.push(BubbleMenuOptions.Edit);
            options.push(BubbleMenuOptions.Delete);
            options.push(BubbleMenuOptions.Archive);
        }
        else {
            options.push(BubbleMenuOptions.Leave);
        }
        options.push(BubbleMenuOptions.SendEmail);
        options.push(BubbleMenuOptions.SeeSharedFiles);

        return options;
    }
    const renderBubbleOption = () => {
        if (currentBubble.isMyUserModerator && index === 1) {
            return (
                <Icon
                    name="add"
                    style={styles.addParticipantsIcon}
                    size={35}
                    color='white'
                    onPress={openAddParticipants} />
            );
        }
        else {
            return <DropDownMenu menuItems={renderBubbleMenuOptions()} onSelectItem={selectMenuItem} />
        }
    }

    const startConferenceAction = () => {
        conferenceService.startConference(currentBubble.id);
    }

    const joinConferenceAction = () => {
        conferenceService.joinConference(currentBubble.id);
    }

    const renderJoinConferencePanner = () => {
        return (
            <View style={styles.joinContainer}>
                <Text> {Strings.joinMsg}</Text>
                <Button colorScheme="success" onPress={joinConferenceAction}>{Strings.join}</Button>
            </View>
        );
    }
    const renderHeaderCenter = () => {
        return <Text color="white">{currentBubble?.name}</Text>;
    }
    const renderHeaderRightIcon = () => {
        return (
            <View style={styles.editBubbleView}>
                {(currentBubble.isMyUserModerator && !currentBubble.hasActiveConference) && <Icon name="ios-call-sharp" style={styles.startConferenceIcon} onPress={startConferenceAction} />}
                {renderBubbleOption()}
            </View>
        );
    }
    const FirstTab = () => (
        <>
            <MessageComponent peer={currentBubble} />
            {displayJoinBanner && renderJoinConferencePanner()}
        </>

    );
    const SecondTab = () => (
        <BubbleParticipants bubble={currentBubble} conferenceCall={currentConferenceCall} />

    );

    const renderScene = SceneMap({
        conversations: FirstTab,
        participants: SecondTab,
    });
    return (
        <>
            <Header
                centerComponent={renderHeaderCenter}
                rightComponent={renderHeaderRightIcon}
                containerStyle={{ paddingTop: 10, paddingBottom: 10 }}
            />
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={props => <TabBar {...props} style={{ backgroundColor: '#0086CF' }} />}
            />
        </>

    );


};
const styles = StyleSheet.create({
    editBubbleView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },

    addParticipantsIcon: { marginTop: 10 },
    startConferenceIcon: { fontSize: 30, color: 'white', position: 'relative', right: 30 },
    joinContainer: { flex: 1, flexDirection: 'column', position: 'absolute', top: 0, padding: 18, backgroundColor: '#e3e3e3', borderRadius: 5, width: '100%' },
});