import { Body, Content, Icon, List, ListItem, Text, View } from 'native-base';
import React from 'react';
import { Dimensions, SafeAreaView, TextStyle, ViewStyle } from 'react-native';
import { Logger, Telephony, IStyledProps, UserProfile, PresenceList, store, authService } from 'react-native-rainbow-module';
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
class AppMenuView extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }
    public render() {
        return (
            <Provider store={store}>
                <SafeAreaView style={defaultStyle.safeArea}>
                    <UserProfile />
                    <View style={defaultStyle.menuContentContainer}>
                        <Content>
                            <List>
                                <PresenceList />
                                <Telephony />
                                <ListItem onPress={this.onSendLogs}>
                                    <Body>
                                        <Text>Send Logs</Text>
                                    </Body>
                                </ListItem>
                                <ListItem onPress={this.onLogout}>
                                    <Icon style={defaultStyle.icon} name="ios-log-out" />
                                    <Body>
                                        <Text>Log out</Text>
                                    </Body>
                                </ListItem>
                            </List>
                        </Content>
                    </View>
                </SafeAreaView>
            </Provider >

        );
    }
    private onLogout = () => {
        authService.signOut();
        store.dispatch(SignOutActionCreator);
    };
    private onSendLogs = () => {
        logger.info(`sendLogs:`);
        logger.sendLogs();

    }
}

const SignOutActionCreator = () => {
    logger.info('On SignOut');
    return {
        type: 'signOut',
    }
    authService.signOut();
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
