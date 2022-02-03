import {
    Body,
    Header,
    Icon,
    Left,
    Right,
    RnViewStyleProp,
    Tab,
    Tabs,
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
    bubblesService
} from 'react-native-rainbow-module';
import React, { useEffect, useState } from 'react';
import { Actions } from 'react-native-router-flux';
import {
    StyleSheet,
    TextStyle,
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
    const [isConferenceJoinable, setIsConferenceJoinable] = useState<boolean>(false);

    useEffect(() => {
        conferenceService.CheckConferenceAvailability(props.bubble.id);
        const conferenceCapabilityUpdate = eventEmitter.addListener(EventType.ConferenceCapability, (eventData: boolean) => {
            logger.info(`addListener for ${EventType.ConferenceCapability} : ${eventData}`)
            setIsConferenceJoinable(eventData);
        });

        return () => {
            conferenceCapabilityUpdate.remove();
        }
    }, [props.bubble.id]);

    const openAddParticipants = () => {
        Actions.AddParticipants({ bubbleId: props.bubble.id });
    }
    const openBubbleInfo = () => {
        Actions.editBubble({ bubble: props.bubble })
    }

    const selectMenuItem = (value: string) => {
        switch (value) {
            case BubbleMenuOptions.Edit:
                openBubbleInfo()
                break;
            case BubbleMenuOptions.Delete:
                bubblesService.deleteBubble(props.bubble.id)
                break;
            case BubbleMenuOptions.Archive:
                bubblesService.archiveBubble(props.bubble.id)
                break;
            case BubbleMenuOptions.Leave:
                bubblesService.leaveBubble(props.bubble.id)
                break;
            case BubbleMenuOptions.SendEmail:
                bubblesService.sendBubbleChatByEmail(props.bubble.id);
                break;

        }

    }
    const renderBubbleMenuOptions = () => {
        const options = [];
        if (props.bubble.isUserOwner) {
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
        if (props.bubble.isUserModerator && activeTab === 1) {
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

    const startOrJoinConference = () => {
        if (props.bubble.isUserModerator) {
            // This means the user can start a conference call
            // isUserModerator mean is this user is the owner one of the bubble or he is one of the organizer
            conferenceService.startConference(props.bubble.id);
        }
        else {
            conferenceService.joinConference(props.bubble.id);
        }
    }

    return (
        <View style={messagesMergedStyle.container}>
            <Header style={messagesMergedStyle.headerBgColor} hasSegment={true}>
                <Left>
                    <BackArrow />
                </Left>
                <Body style={messagesMergedStyle.titleBodyStyle}>
                    <Title style={messagesMergedStyle.titleStyle}>{props.bubble?.name} </Title>
                </Body>
                <Right>
                    <View style={messagesMergedStyle.editBubbleView}>
                        {isConferenceJoinable && <Icon name="ios-call-sharp" style={messagesMergedStyle.startConferenceIcon} onPress={startOrJoinConference} />}
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
                    <MessageComponent peer={props.bubble} />
                </Tab>
                <Tab
                    heading={Strings.participants}
                    tabStyle={messagesMergedStyle.headerBgColor}
                    activeTabStyle={messagesMergedStyle.headerBgColor}
                    textStyle={messagesMergedStyle.tabText}
                    activeTextStyle={messagesMergedStyle.titleStyle}
                >
                    <BubbleParticipants bubble={props.bubble} />
                </Tab>
            </Tabs>

        </View>
    );


};
const styles: IBubbleChatStyleProps = StyleSheet.create({
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
    titleBodyStyle: { margin: 10 }
});