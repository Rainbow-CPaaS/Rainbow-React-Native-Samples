import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Box, Divider, HStack, Pressable, Text } from 'native-base';
import { userProfileService, IUpdateUserQuery, IUser, eventEmitter, EventType, Header, AvatarPresenceBadge } from 'react-native-rainbow-module';
import { Actions } from 'react-native-router-flux';
import { launchImageLibrary } from 'react-native-image-picker';
import { Strings } from '../resources/localization/Strings';
import Icon from 'react-native-vector-icons/MaterialIcons';

export interface IProps {
    connectedUser: IUser
}

export const UserInfoFrom: React.FunctionComponent<IProps> = ({ connectedUser }) => {
    const [user, setUser] = useState<IUser>(connectedUser);
    const { contact, isAllowedToModifyProfileInfo } = user;
    const userName = contact.name.split(' ');
    const [firstName, setUserFirstName] = useState<string>(userName.length > 0 ? userName[0] : '');
    const [lastName, setUserLastName] = useState<string>(userName.length > 1 ? userName[1] : '');

    useEffect(() => {
        const connectedUserUpdated = eventEmitter.addListener(
            EventType.ConnectedUserUpdated,
            (eventData: IUser) => {
                if (eventData) {
                    setUser(eventData);
                }
            }
        );

        return () => {
            connectedUserUpdated.remove();
        }
    }, []);

    const updateUserInfo = () => {
        if (isAllowedToModifyProfileInfo) {
            const updateRequest: IUpdateUserQuery = { firstName, lastName }
            userProfileService.updateUserInfo(updateRequest);
            Actions.pop();
        }
    }

    const updateUserAvatar = () => {
        launchImageLibrary({
            quality: 1.0,
            selectionLimit: 1,
            mediaType: 'mixed',
            includeBase64: false,
        }, response => {
            if (response.assets.length > 0) {
                const fileUri = response.assets[0].uri;
                if (fileUri)
                    userProfileService.updateUserPhoto(fileUri);
            }
        });
    }

    const onFirstNameChanged = (text: string) => {
        setUserFirstName(text)
    }

    const onLastNameChanged = (text: string) => {
        setUserLastName(text)
    }
    const renderCenterHeader = () => {
        return <Text color="white" fontSize="md"> {Strings.updateMyInfo}</Text>;
    }
    const renderRightHeader = () => {
        return (<Icon
            name="done"
            style={isAllowedToModifyProfileInfo ? defaultStyle.saveIcon : defaultStyle.disabledSaveIcon} onPress={updateUserInfo} />);
    }
    return (
        <>
            <Header containerStyle={defaultStyle.headerBgColor} rightComponent={renderRightHeader} centerComponent={renderCenterHeader} />

            <Box borderBottomWidth="0" pl={["0", "4"]} pr={["0", "5"]} py="2" style={style} >
                <Pressable onPress={updateUserAvatar} overflow="hidden" >
                    <HStack px={2} width="100%" justifyContent="space-between">
                        <AvatarPresenceBadge peer={contact} presence={contact.presence} />
                        <Text fontSize="sm">{Strings.avatar}</Text>
                    </HStack >
                </Pressable>
                <Divider mx="75" my="2" bg="muted.200" thickness="1" />

                <HStack px={2} width="100%" justifyContent="space-between">
                    <Text fontSize="sm">{Strings.firstName}</Text>
                    <TextInput
                        style={isAllowedToModifyProfileInfo ? defaultStyle.textInputStyle : defaultStyle.disabledTextInputStyle}
                        value={firstName}
                        onChangeText={onFirstNameChanged}
                        editable={isAllowedToModifyProfileInfo} />
                    <Divider mx="75" my="2" bg="muted.200" thickness="1" />
                </HStack >
                <HStack px={2} width="100%" justifyContent="space-between">
                    <Text fontSize="sm"> {Strings.lastName}    </Text>
                    <TextInput
                        style={isAllowedToModifyProfileInfo ? defaultStyle.textInputStyle : defaultStyle.disabledTextInputStyle}
                        value={lastName}
                        onChangeText={onLastNameChanged}
                        editable={isAllowedToModifyProfileInfo} />
                    <Divider mx="75" my="2" bg="muted.200" thickness="1" />
                </HStack >

            </Box>
        </>
    );
}

const defaultStyle = StyleSheet.create({
    saveIcon: {
        color: '#ffffff',
        fontSize: 40
    },
    disabledSaveIcon: {
        color: '#AEAEAE',
        fontSize: 40,
    },
    headerBgColor: {
        backgroundColor: '#0086CF'
    },
    textInputStyle: { width: '100%', padding: 5, fontSize: 18, color: '#000000', },
    disabledTextInputStyle: { width: '100%', padding: 5, fontSize: 18, color: '#979797', }
});