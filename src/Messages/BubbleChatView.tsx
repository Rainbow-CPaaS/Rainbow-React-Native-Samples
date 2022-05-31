import {
    Body,
    Header,
    Icon,
    Left,
    Right,
    RnViewStyleProp,
    Tab,
    Tabs,
    Text,
    Title,
} from 'native-base';
import {
    eventEmitter,
    EventType,
    IStyledProps,
    BackArrow,
    IBubble,
    BubbleParticipants,
    Logger,
    conferenceService,
    DropDownMenu,
    bubblesService,
    IConference
} from 'react-native-rainbow-module';
import React, { useEffect, useState } from 'react';
import { Actions } from 'react-native-router-flux';
import {
    Alert,
    StyleSheet,
    TextStyle,
    TouchableHighlight,
    View,
    ViewStyle,
} from 'react-native';
import { MessageComponent } from './MessageComponent';
import { Strings } from './../resources/localization/Strings';

const logger = new Logger('BubbleChatView');

export interface IBubbleChatProps extends IStyledProps<IBubbleChatStyleProps> {
    bubble: IBubble;
}
export interface IBubbleChatStyleProps {
    container: ViewStyle;
    headerBgColor: ViewStyle;
    editBubbleView?: ViewStyle;
    titleStyle?: TextStyle;
    tabText?: TextStyle;
    tabBarUnderline?: RnViewStyleProp;
    addParticipantsIcon?: ViewStyle;
    startConferenceIcon?: ViewStyle;
    titleBodyStyle?: ViewStyle
}

const BubbleMenuOptions = {
    Delete: Strings.deleteBubble,
    Leave: Strings.leaveBubble,
    Archive: Strings.archiveBubble,
    Edit: Strings.editBubble,
    SendEmail: Strings.sendConversationByEmail
}

export const BubbleChatView: React.FunctionComponent<IBubbleChatProps> = (
    props: IBubbleChatProps
) => {
    const messagesMergedStyle = { ...styles, ...props.style }
    const [activeTab, setActiveTab] = useState(0);
    const [currentBubble, setCurrentBubble] = useState<IBubble>(props.bubble);
    const [currentConferenceCall, setCurrentConferenceCall] = useState<IConference>();

    useEffect(() => {
        // Listen for bubble change update
        const onBubbleUpdated = eventEmitter.addListener(EventType.OnBubbleUpdated, (eventData: IBubble) => {
            logger.info(`addListener for ${EventType.OnBubbleUpdated} : ${eventData}`);
            setCurrentBubble(eventData);
        });
        const conferenceLockState = eventEmitter.addListener(EventType.GetConferenceLockState, (eventData: boolean) => {
            logger.info(`addListener for ${EventType.GetConferenceLockState} : ${eventData}`)
            Alert.alert(Strings.lockedConference, Strings.lockedConferenceMessage);
        });

        const currentConferenceUpdatedListener = eventEmitter.addListener(EventType.CurrentConferenceUpdated, (conferenceCall?: IConference) => {
            logger.info(`CurrentConferenceUpdated with conference call: ${conferenceCall}`);
            if (conferenceCall?.callPeer.id === props.bubble.jId) {
                setCurrentConferenceCall(conferenceCall);
            }
            else {
                setCurrentConferenceCall(undefined);
            }
        });



        if (props.bubble.hasActiveConference && !currentConferenceCall) {
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
        options.push(BubbleMenuOptions.SendEmail)

        return options;
    }
    const renderBubbleOption = () => {
        if (currentBubble.isMyUserModerator && activeTab === 1) {
            return (
                <Icon
                    name="add"
                    style={messagesMergedStyle.addParticipantsIcon}
                    onPress={openAddParticipants}
                />
            );
        }
        else {
            return (
                <DropDownMenu menuItems={renderBubbleMenuOptions()} onSelectItem={selectMenuItem} />
            );
        }
    }
    const setSelectedTab = (tab: { i: number; ref: Element; from: number }) => {
        setActiveTab(tab.i);
    };

    const startConferenceAction = () => {
        conferenceService.startConference(currentBubble.id);
    }

    const joinConferenceAction = () => {
        conferenceService.joinConference(currentBubble.id);
    }

    const renderJoinConferencePanner = () => {
        return (
            <View style={styles.joinContainer}>
                <Text>
                    {Strings.joinMsg}
                </Text>
                <TouchableHighlight style={styles.joinButtonView} onPress={joinConferenceAction}>
                    <Text style={styles.joinText}>{Strings.join}</Text>
                </TouchableHighlight>
            </View>
        );
    }

    return (
        <View style={messagesMergedStyle.container}>
            <Header style={messagesMergedStyle.headerBgColor} hasSegment={true}>
                <Left>
                    <BackArrow />
                </Left>
                <Body style={messagesMergedStyle.titleBodyStyle}>
                    <Title style={messagesMergedStyle.titleStyle}>{currentBubble?.name} </Title>
                </Body>
                <Right>
                    <View style={messagesMergedStyle.editBubbleView}>
                        {(currentBubble.isMyUserModerator && !currentBubble.hasActiveConference) && <Icon name="ios-call-sharp" style={messagesMergedStyle.startConferenceIcon} onPress={startConferenceAction} />}
                        {renderBubbleOption()}
                    </View>
                </Right>
            </Header>
            <Tabs
                initialPage={0}
                onChangeTab={setSelectedTab}
                tabBarUnderlineStyle={messagesMergedStyle.tabBarUnderline}
                locked={true}

            >
                <Tab
                    heading={Strings.conversations}
                    tabStyle={messagesMergedStyle.headerBgColor}
                    activeTabStyle={messagesMergedStyle.headerBgColor}
                    textStyle={messagesMergedStyle.tabText}
                    activeTextStyle={messagesMergedStyle.titleStyle}

                >
                    <MessageComponent peer={currentBubble} />
                    {(currentBubble.hasActiveConference && !currentConferenceCall?.hasMyUserJoinedConferenceCall) && renderJoinConferencePanner()}
                </Tab>
                <Tab
                    heading={Strings.participants}
                    tabStyle={messagesMergedStyle.headerBgColor}
                    activeTabStyle={messagesMergedStyle.headerBgColor}
                    textStyle={messagesMergedStyle.tabText}
                    activeTextStyle={messagesMergedStyle.titleStyle}
                >
                    <BubbleParticipants bubble={currentBubble} conferenceCall={currentConferenceCall} />
                </Tab>
            </Tabs>

        </View>
    );


};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff', height: 'auto', },
    Thumbnail: { width: 30, height: 30, },
    headerBgColor: { backgroundColor: '#0086CF', },
    tabBarUnderline: {
        backgroundColor: '#ffffff',
    },
    editBubbleView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    titleStyle: {
        color: 'white'
    },
    tabText: { color: '#a5c0f3' },
    addParticipantsIcon: { fontSize: 35, color: 'white', marginTop: 10 },
    startConferenceIcon: { fontSize: 30, color: 'white', position: 'relative', right: 30 },
    titleBodyStyle: { margin: 10 },
    joinContainer: { flex: 1, flexDirection: 'column', position: 'absolute', top: 0, padding: 18, backgroundColor: '#e3e3e3', borderRadius: 5 },
    joinButtonView: { backgroundColor: '#4ba42f', alignSelf: 'center', padding: 10, borderRadius: 3 },
    joinText: { color: 'white' },
});