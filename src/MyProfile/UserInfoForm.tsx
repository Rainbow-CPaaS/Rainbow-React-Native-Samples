import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { CheckIcon, HStack, Input, Pressable, Text, VStack } from 'native-base';
import { userProfileService, IUpdateUserQuery, IUser, eventEmitter, EventType, Header, AvatarPresenceBadge } from 'react-native-rainbow-module';
import { launchImageLibrary } from 'react-native-image-picker';
import { Strings } from '../resources/localization/Strings';
import { UserInfoFromNavigationProp, UserInfoFromRouteProp } from '../Navigation/AppNavigationTypes';

export interface IProps {
    route: UserInfoFromRouteProp;
    navigation: UserInfoFromNavigationProp;
}

export const UserInfoFrom: React.FunctionComponent<IProps> = ({ navigation, route }) => {
    const connectedUser = route.params?.connectedUser;
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
            navigation.pop();
        }
    }

    const updateUserAvatar = () => {
        launchImageLibrary({
            quality: 1.0,
            selectionLimit: 1,
            mediaType: 'mixed',
            includeBase64: false,
        }, response => {
            if (response.assets && response.assets.length > 0) {
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
        if (isAllowedToModifyProfileInfo) {
            return <CheckIcon color="#ffffff" onPress={updateUserInfo} />
        } else {
            return <CheckIcon color="#AEAEAE" size="20" />
        }

    }
    return (
        <>
            <Header containerStyle={defaultStyle.headerBgColor} rightComponent={renderRightHeader} centerComponent={renderCenterHeader} />
            <VStack justifyItems="center" my={10} space={10}>

                <Pressable onPress={updateUserAvatar} ml={15}>
                    <AvatarPresenceBadge peer={contact} presence={contact.presence} />
                </Pressable>


                <HStack px={2} justifyContent="space-between">
                    <Text fontSize="sm">{Strings.firstName}</Text>
                    <Input
                        value={firstName}
                        isDisabled={isAllowedToModifyProfileInfo ? false : true}
                        onChangeText={onFirstNameChanged}
                        editable={isAllowedToModifyProfileInfo}
                        width="75%" />
                </HStack >
                <HStack px={2} justifyContent="space-between">
                    <Text fontSize="sm"> {Strings.lastName}    </Text>
                    <Input
                        isDisabled={isAllowedToModifyProfileInfo ? false : true}
                        value={lastName}
                        onChangeText={onLastNameChanged}
                        editable={isAllowedToModifyProfileInfo}
                        width="75%" />
                </HStack >
            </VStack>
        </>
    );
}

const defaultStyle = StyleSheet.create({
    headerBgColor: {
        backgroundColor: '#0086CF'
    },
});