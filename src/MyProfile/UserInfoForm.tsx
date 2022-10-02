import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Body, Title, Icon, ListItem, List, Text } from 'native-base';
import { userProfileService, IUpdateUserQuery, IUser, ImageHolder, eventEmitter, EventType, Header } from 'react-native-rainbow-module';
import { Actions } from 'react-native-router-flux';
import { launchImageLibrary } from 'react-native-image-picker';
import { Strings } from '../resources/localization/Strings';

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
        return (
            <Title style={defaultStyle.headerTitle}>
                {Strings.updateMyInfo}
            </Title>
        );
    }
    const renderRightHeader = () => {
        return (<Icon
            name="done"
            type="MaterialIcons"
            style={isAllowedToModifyProfileInfo ? defaultStyle.saveIcon : defaultStyle.disabledSaveIcon} onPress={updateUserInfo} />);
    }
    return (
        <View>
            <Header containerStyle={defaultStyle.headerBgColor} rightComponent={renderRightHeader} centerComponent={renderCenterHeader} />
            <View  >
                <List style={defaultStyle.listItem}>
                    <ListItem onPress={updateUserAvatar} >
                        <Body>
                            <View style={defaultStyle.itemBody}>
                                <Text note={true}>
                                    {Strings.avatar}
                                </Text>
                                <ImageHolder url={contact.imageURL} name={contact.name} style={{
                                    thumbnail: {
                                        marginLeft: 15,
                                        zIndex: 2,
                                        width: 60,
                                        height: 60,
                                        borderRadius: 60
                                    },
                                    thumbnailContainer: {
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 30,
                                        padding: 10,
                                        marginLeft: 15,
                                    },
                                    imageTextStyle: {
                                        color: 'white',
                                        fontSize: 20,
                                        fontWeight: 'bold'
                                    }
                                }} />
                            </View>
                        </Body>
                    </ListItem>
                    <ListItem >
                        <Body>
                            <View style={defaultStyle.itemBody}>
                                <Text note={true}>
                                    {Strings.firstName}
                                </Text>
                                <TextInput style={isAllowedToModifyProfileInfo ? defaultStyle.textInputStyle : defaultStyle.disabledTextInputStyle} value={firstName} onChangeText={onFirstNameChanged} editable={isAllowedToModifyProfileInfo} />
                            </View>
                        </Body>
                    </ListItem>
                    <ListItem >
                        <Body>
                            <View style={defaultStyle.itemBody}>
                                <Text note={true}>
                                    {Strings.lastName}
                                </Text>
                                <TextInput style={isAllowedToModifyProfileInfo ? defaultStyle.textInputStyle : defaultStyle.disabledTextInputStyle} value={lastName} onChangeText={onLastNameChanged} editable={isAllowedToModifyProfileInfo} />
                            </View>
                        </Body>
                    </ListItem>
                </List>
            </View>
        </View>
    );
}

const defaultStyle = StyleSheet.create({
    headerTitle: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 16,
        color: '#ffffff',
    },
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
    itemBody: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

    },
    listItem: { margin: 5, backgroundColor: '#FFFFFF' },
    textInputStyle: { width: '100%', padding: 5, fontSize: 18, color: '#000000', },
    disabledTextInputStyle: { width: '100%', padding: 5, fontSize: 18, color: '#979797', }
});