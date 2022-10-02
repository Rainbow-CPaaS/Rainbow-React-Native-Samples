import { Body, Icon, List, ListItem, Text, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ImageStyle } from 'react-native';
import { Dimensions, SafeAreaView, TextStyle, ViewStyle } from 'react-native';
import { Logger, Telephony, IStyledProps, UserProfile, PresenceList, store, authService, eventEmitter, EventType, IUser, userProfileService } from 'react-native-rainbow-module';
import { Actions } from 'react-native-router-flux';
import { Provider } from 'react-redux';

const logger = new Logger('AppMenu');

interface IProps extends IStyledProps<ISideMenuStyleProps> { }

interface ISideMenuStyleProps {
    menuHeader?: ViewStyle;
    loader?: ViewStyle;
    name?: TextStyle;
    icon?: any;
    menuContentContainer?: ViewStyle;
    safeArea?: ViewStyle;
}
const presenceIconStyle: ImageStyle = {
    width: 25,
    height: 25,
};
const AppMenuView: React.FunctionComponent<IProps> = () => {

    const [connectedUser, setConnectedUser] = useState<IUser>();
    // TODO: get the connected user here! since there is multi component depends on the UserProfile info

    useEffect(() => {
        userProfileService.getConnectedUser();
        const connectedUserUpdated = eventEmitter.addListener(
            EventType.ConnectedUserUpdated,
            (eventData: IUser) => {
                logger.info(`ConnectedUserUpdated${eventData}`);
                if (eventData) {
                    setConnectedUser(eventData);
                }
            }
        );

        return () => {
            connectedUserUpdated.remove();
        }
    }, []);

    const onSendLogs = () => {
        logger.info(`sendLogs:`);
        logger.sendLogs();
    }
    const onLogout = () => {
        authService.signOut();
        store.dispatch(SignOutActionCreator);
    }



    if (connectedUser) {
        const goToMyProfileInfo = () => {
            Actions.MyProfileInfo({
                connectedUser
            })
        }
        return (
            <Provider store={store}>
                <SafeAreaView style={defaultStyle.safeArea}>
                    <UserProfile />
                    <View style={defaultStyle.menuContentContainer}>
                        <List>
                            {connectedUser.isAllowedToChangePresence && <PresenceList presenceIconStyle={presenceIconStyle} />}
                            <Telephony />
                            <ListItem onPress={goToMyProfileInfo}>
                                <Icon style={defaultStyle.icon} name="user-circle" type="FontAwesome" />
                                <Body>
                                    <Text>MyProfile</Text>
                                </Body>
                            </ListItem>
                            <ListItem onPress={onSendLogs}>
                                <Icon style={defaultStyle.icon} name="send" type="FontAwesome" />
                                <Body>
                                    <Text>Send Logs</Text>
                                </Body>
                            </ListItem>
                            <ListItem onPress={onLogout}>
                                <Icon style={defaultStyle.icon} name="ios-log-out" />
                                <Body>
                                    <Text>Log out</Text>
                                </Body>
                            </ListItem>
                        </List>
                    </View>
                </SafeAreaView>
            </Provider >
        );
    }
    return null;

}

const SignOutActionCreator = () => {
    logger.info('On SignOut');
    return {
        type: 'signOut',
    }
};

export default AppMenuView;


const defaultStyle: ISideMenuStyleProps = {
    loader: {
        flex: 1,
        justifyContent: 'center',
        opacity: 1,
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgba(234, 236, 238, 0.8)'
    },
    name: {
        color: '#fff',
        fontSize: 15,
        maxWidth: 180
    },
    menuHeader: {
        backgroundColor: '#0086CF',
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10
    },
    icon: {
        color: '#0086CF',
        fontSize: 30
    },
    menuContentContainer: {
        flex: 2,
        backgroundColor: '#fff'
    },
    safeArea: { backgroundColor: '#0086CF', flex: 1 },

};
