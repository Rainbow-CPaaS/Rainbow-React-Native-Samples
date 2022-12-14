/* eslint-disable react-native/no-inline-styles */
import { Title, } from 'native-base';
import {
    eventEmitter,
    EventType,
    IConversation,
    IStyledProps,
    FloatButton,
    IFloatButtonStyleProps,
    contactsService,
    DropDownMenu,
    conversationsService,
    Header
} from 'react-native-rainbow-module';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    StyleSheet,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import { MakeCallButton } from '../Calls/MakeCallButton';
import { MessageComponent } from './MessageComponent';
import { Strings } from './../resources/localization/Strings';
import { Actions } from 'react-native-router-flux';


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
    DeleteAllMessages: Strings.deleteAllMessages,
    SeeSharedFiles: Strings.seeSharedFiles
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
    const { peerIsInvited, peerIsRoster, name, contact } = props.conversation;
    const messagesMergedStyle = { ...styles, ...props.style }
    const [isRoster, setIsRoster] = useState<boolean>(peerIsRoster);

    useEffect(() => {
        eventEmitter.addListener(EventType.AddContactToRoster, (eventData: string) => {
            if (eventData === 'success') {
                setIsRoster(true)
            }
            Alert.alert('Invite contact to my network', eventData);
        })
    }, []);

    const addToRoster = (roosterId: string) => () => {
        contactsService.addContactToRoster(roosterId);
    }

    const renderMenuOptions = () => {
        const options = [];
        options.push(PeerConversationMenuOptions.SendEmail);
        options.push(PeerConversationMenuOptions.DeleteAllMessages);
        options.push(PeerConversationMenuOptions.SeeSharedFiles);
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
            case PeerConversationMenuOptions.SeeSharedFiles:
                Actions.SharedFiles({ peer: props.conversation });
                break;
        }
    }
    const renderHeaderCenter = () => {
        return (
            <Title style={messagesMergedStyle.titleStyle}>{name}</Title>
        );
    }
    const renderHeaderRightIcon = () => {
        return (
            <View style={messagesMergedStyle.rightHeaderView}>
                {contact && <MakeCallButton contact={contact} />}
                <DropDownMenu menuItems={renderMenuOptions()} onSelectItem={selectMenuItem} />
            </View>
        );
    }
    return (
        <View style={messagesMergedStyle.container}>

            <Header
                containerStyle={messagesMergedStyle.headerBgColor}
                centerComponent={renderHeaderCenter}
                rightComponent={renderHeaderRightIcon}
                centerContainerStyle={{ alignItems: 'flex-end' }}
            />
            {(!isRoster && !peerIsInvited) && <FloatButton title={Strings.addToMyNetwork} style={addButtonStyle} onPress={addToRoster(props.conversation.jId)} />}
            <MessageComponent peer={props.conversation} />
        </View>
    );


};
const styles: IPeerConversationStyleProps = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff', height: 'auto', },
    headerBgColor: { backgroundColor: '#0086CF', },
    titleStyle: {
        color: 'white',
        textAlign: 'center'
    },
    rightHeaderView: {
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 100
    }
});