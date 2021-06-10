import { Body, Content, Icon, List, ListItem, Text, Thumbnail, View } from 'native-base';
import React from 'react';
import { Dimensions, SafeAreaView, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { Logger, Telephony, IStyledProps, IUser, Presence, PresenceIcon, store, authService } from 'react-native-rainbow-module';
import { Actions } from 'react-native-router-flux';
import { Provider } from 'react-redux';

const logger = new Logger('AppMenu');

interface IProps extends IStyledProps<ISideMenuStyleProps> {
    user: IUser;
    signOut: () => void;
    isTelephonyEnabled: boolean;
}

interface ISideMenuStyleProps {
    menuHeader?: ViewStyle;
    loader?: ViewStyle;
    presenceIcon?: any;
    name?: TextStyle;
    icon?: any;
    contactInfo?: ViewStyle;
    profilePic?: ViewStyle;
    menuContentContainer?: ViewStyle;
    safeArea?: ViewStyle;
    nameText?: TextStyle;
    backButtonText?: TextStyle;
    leftView?: ViewStyle;
}
class AppMenuView extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }
    public render() {
        const storeState = store.getState();
        const connectedUserFromStore = storeState.auth.user;
        const presence = connectedUserFromStore ? (connectedUserFromStore.presence as keyof typeof Presence) : 'unsubscribed';
        return (
            <Provider store={store}>
                <SafeAreaView style={defaultStyle.safeArea}>
                    <View style={defaultStyle.menuHeader}>
                        <View style={defaultStyle.profilePic}>
                            <Thumbnail size={500} source={{ uri: `data:image/png;base64,${connectedUserFromStore.profileImgBase64}` }} />
                            <PresenceIcon presence={connectedUserFromStore.presence} />
                        </View>
                        <View style={defaultStyle.contactInfo}>
                            <Text style={[defaultStyle.name, defaultStyle.nameText]}>
                                {connectedUserFromStore.name ? connectedUserFromStore.name.split('\n')[0].slice(0, 15) : ''}
                            </Text>
                            <Text style={defaultStyle.name}>{connectedUserFromStore.companyName}</Text>
                            <Text style={defaultStyle.name}>{presence}</Text>
                        </View>
                        <View style={defaultStyle.leftView}>
                            <TouchableOpacity onPress={() => { Actions.pop() }}>
                                <Text style={defaultStyle.backButtonText}>Done</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                    <View style={defaultStyle.menuContentContainer}>
                        <Content>
                            <List>
                                <Telephony />
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
    presenceIcon: {
        position: 'relative',
        top: 0,
        width: 22,
        height: 22,
        marginLeft: 15,
        marginEnd: 18,
        borderColor: 'white',
        borderRadius: 40,
        borderWidth: 1
    },
    name: {
        color: '#fff',
        fontSize: 15,
        maxWidth: 180
    },
    backButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    leftView: {
        position: 'absolute',
        top: 10,
        right: 20
    },
    contactInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    menuHeader: {
        backgroundColor: '#0086CF',
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10
    },
    profilePic: {
        justifyContent: 'flex-start',
        marginRight: 20,
        marginLeft: 20
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
    nameText: { fontSize: 18 }

};
