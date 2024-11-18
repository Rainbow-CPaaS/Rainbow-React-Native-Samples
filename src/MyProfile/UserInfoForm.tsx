import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { userProfileService, IUpdateUserQuery, IUser, eventEmitter, EventType, Header, AvatarPresenceBadge } from 'react-native-rainbow-module';
import { launchImageLibrary } from 'react-native-image-picker';
import { Strings } from '../resources/localization/Strings';
import { UserInfoFromNavigationProp, UserInfoFromRouteProp } from '../Navigation/AppNavigationTypes';
import { IconButton, TextInput } from 'react-native-paper';

export interface IProps {
    route: UserInfoFromRouteProp;
    navigation: UserInfoFromNavigationProp;
}

export const UserInfoFrom: React.FunctionComponent<IProps> = ({ navigation, route }) => {
    const connectedUser = route.params.connectedUser;
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
        };
    }, []);

    const updateUserInfo = () => {
        if (isAllowedToModifyProfileInfo) {
            const updateRequest: IUpdateUserQuery = { firstName, lastName };
            userProfileService.updateUserInfo(updateRequest);
            navigation.pop();
        }
    };

    const updateUserAvatar = () => {
        launchImageLibrary({
            quality: 1.0,
            selectionLimit: 1,
            mediaType: 'mixed',
            includeBase64: false,
        }, response => {
            if (response.assets &&  response.assets.length > 0) {
                const fileUri = response.assets[0].uri;
                if (fileUri)
                    {userProfileService.updateUserPhoto(fileUri);}
            }
        });
    };

    const onFirstNameChanged = (text: string) => {
        setUserFirstName(text);
    };

    const onLastNameChanged = (text: string) => {
        setUserLastName(text);
    };
    const renderCenterHeader = () => {
        return <Text style={styles.headerText}> {Strings.updateMyInfo}</Text>;
    };

    const renderRightHeader = () => (

        <IconButton
            icon="check"
            iconColor={isAllowedToModifyProfileInfo ? '#ffffff' : '#AEAEAE'}
            size={24}
            onPress={updateUserInfo}
            disabled={ isAllowedToModifyProfileInfo ? false : true}

        />
    );
    return (
        <>
            <Header containerStyle={styles.headerBgColor} rightComponent={renderRightHeader} centerComponent={renderCenterHeader} />
            <View style={styles.container}>
                <Pressable onPress={updateUserAvatar} style={styles.avatarContainer}>
                <AvatarPresenceBadge peer={contact} presence={contact.presence} />
                </Pressable>

                <View style={styles.inputRow}>
                    <Text style={styles.labelText}>{Strings.firstName}</Text>
                    <TextInput
                        mode="outlined"
                        value={firstName}
                        onChangeText={onFirstNameChanged}
                        disabled={!isAllowedToModifyProfileInfo}
                        style={styles.input}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.labelText}>{Strings.lastName}</Text>
                    <TextInput
                        mode="outlined"
                        value={lastName}
                        onChangeText={onLastNameChanged}
                        disabled={!isAllowedToModifyProfileInfo}
                        style={styles.input}
                    />
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    headerBgColor: {
        backgroundColor: '#0086CF',
    },
    headerText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    container: {
        marginVertical: 20,
        paddingHorizontal: 15,
    },
    avatarContainer: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    labelText: {
        fontSize: 14,
        flex: 1,
    },
    input: {
        width: '75%',
    },
});
