import {
    eventEmitter,
    EventType,
    FloatButton,
    IFloatButtonStyleProps,
    contactsService,
    DropDownMenu,
    conversationsService,
    Header
} from 'react-native-rainbow-module';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text } from 'react-native';
import { MakeCallButton } from '../Calls/MakeCallButton';
import { MessageComponent } from './MessageComponent';
import { Strings } from './../resources/localization/Strings';
import { HStack } from 'native-base';
import { PeerChatViewNavigationProp, PeerChatViewRouteProp } from '../Navigation/AppNavigationTypes';
export interface IPeerChatProps {
    navigation: PeerChatViewNavigationProp,
    route: PeerChatViewRouteProp
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
    { route, navigation }
) => {
    const { peerIsInvited, peerIsRoster, name, contact, jId } = route.params.conversation;
    const [isRoster, setIsRoster] = useState<boolean>(peerIsRoster);
    const viewInviteBtn = (!isRoster && !peerIsInvited);

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
                conversationsService.sendConversationByEmail(jId);
                break;
            case PeerConversationMenuOptions.DeleteAllMessages:
                conversationsService.deleteConversationMessages(jId);
                break;
            case PeerConversationMenuOptions.SeeSharedFiles:
                navigation.navigate('SharedFileList', { peer: route.params.conversation })
                break;
        }
    }
    const renderHeaderCenter = () => {
        return (
            <Text style={styles.titleStyle}>{name}</Text>
        );
    }
    const renderHeaderRightIcon = () => {
        return (
            <HStack space={2} justifyContent="space-between" alignItems="center">
                {contact && <MakeCallButton contact={contact} />}
                <DropDownMenu menuItems={renderMenuOptions()} onSelectItem={selectMenuItem} />
            </HStack>
        );
    }
    return (
        <React.Fragment>
            <Header
                centerComponent={renderHeaderCenter}
                rightComponent={renderHeaderRightIcon}
                containerStyle={styles.headerContainer}
            />
            {viewInviteBtn && <FloatButton title={Strings.addToMyNetwork} style={addButtonStyle} onPress={addToRoster(contact.corporateId)} />}
            <MessageComponent peer={route.params.conversation} navigation={navigation} />
        </React.Fragment>
    );

};
const styles = StyleSheet.create({
    titleStyle: {
        color: 'white',
        textAlign: 'center'
    },
    rightHeaderView: {
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 100
    },
    headerContainer: { paddingTop: 5, paddingBottom: 5 }
});