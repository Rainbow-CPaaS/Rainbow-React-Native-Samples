import {
    Body,
    Header,
    Left,
    Right,
    Title,
} from 'native-base';
import {
    eventEmitter,
    EventType,
    IConversation,
    IStyledProps,
    BackArrow,
    FloatButton,
    IFloatButtonStyleProps,
    contactsService,
    DropDownMenu,
    conversationsService
} from 'react-native-rainbow-module';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import { CallComponent } from '../CallComponent';
import { MessageComponent } from './MessageComponent';
import { Strings } from './../resources/localization/Strings';


export interface IPeerChatProps extends IStyledProps<IPeerConversationStyleProps> {
    conversation: IConversation;
}

export interface IPeerConversationStyleProps {
    container: ViewStyle;
    headerBgColor: ViewStyle;
    titleStyle?: TextStyle;
    rightHeaderView?: ViewStyle;
}

const PeerConversationMenuOptions = {
    SendEmail: Strings.sendConversationByEmail,
    DeleteAllMessages: Strings.deleteAllMessages
}

const addButtonStyle: IFloatButtonStyleProps = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#009DD2',
        margin: 10,
        width: Dimensions.get('screen').width - 20,
        height: 30
    }
}

export const PeerConversationChatView: React.FunctionComponent<IPeerChatProps> = (
    props: IPeerChatProps
) => {
    const { peerIsInvited, peerIsRoster, name, } = props.conversation;
    const messagesMergedStyle = { ...styles, ...props.style }
    const [isRoster, setIsRoster] = useState<boolean>(peerIsRoster);

    useEffect(() => {
        eventEmitter.addListener(EventType.AddContactToRoster, (eventData: string) => {
            if (eventData === 'success') {
                setIsRoster(true)
            }
        })
    }, []);

    const addToRoster = (roosterId: string) => () => {
        contactsService.addContactToRoster(roosterId);
    }

    const renderBubbleMenuOptions = () => {
        const options = [];
        options.push(PeerConversationMenuOptions.SendEmail);
        options.push(PeerConversationMenuOptions.DeleteAllMessages)
        return options;
    }
    const selectMenuItem = (value: string) => {
        switch (value) {
            case PeerConversationMenuOptions.SendEmail:
                conversationsService.sendConversationByEmail(props.conversation.jId);
                break;
            case PeerConversationMenuOptions.DeleteAllMessages:
                conversationsService.deleteConversationMessages(props.conversation.jId);
                break;
        }
    }
    return (
        <View style={messagesMergedStyle.container}>
            <Header style={messagesMergedStyle.headerBgColor} hasSegment={true}>
                <Left>
                    <BackArrow />
                </Left>
                <Body>
                    <Title style={messagesMergedStyle.titleStyle}>{name}</Title>
                </Body>
                <Right>
                    <View style={messagesMergedStyle.rightHeaderView}>
                        <CallComponent contact={props.conversation.contact} />
                        <DropDownMenu menuItems={renderBubbleMenuOptions()} onSelectItem={selectMenuItem} />
                    </View>
                </Right>
            </Header>
            {(!isRoster && !peerIsInvited) && <FloatButton title={Strings.addToMyNetwork} style={addButtonStyle} onPress={addToRoster(props.conversation.jId)} />}
            <MessageComponent peer={props.conversation} />
        </View>
    );


};
const styles: IPeerConversationStyleProps = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff', height: 'auto', },
    headerBgColor: { backgroundColor: '#0086CF', },
    titleStyle: {
        color: 'white'
    },
    rightHeaderView: {
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 100
    }
});