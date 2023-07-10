import * as React from 'react';
import { BackHandler, StyleSheet } from 'react-native';
import {
    Logger,
    DialPad,
    RainbowContainer,
    ContactInformation,
    IContactInfoStyleProps,
    TelephonySettings,
    CallHistory,
    IBackButtonHandler,
    ForwardedView,
    EditBubble,
    AddParticipant
} from 'react-native-rainbow-module';
import { Home } from './Home';
import {AppMenuView} from './AppMenu';
import { CreateBubbleComponent } from './Bubbles/CreateBubbleComponent';
import { useEffect } from 'react';
import { PeerConversationChatView } from './Messages/PeerConversationChatView'
import { BubbleChatView } from './Messages/BubbleChatView';
import jsonRainbowConfig from './rainbow-config.json';
import { ActiveCallBanner } from './Calls/ActiveCallBanner';
import { SharedFileComponent, FileDescription } from './SharedFile/'
import { NativeBaseProvider } from 'native-base';
import { MyProfileInfo, UserInfoFrom } from './MyProfile/';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CombinedRootStackParamList } from './Navigation/AppNavigationTypes';
import { NavigationContext } from './Navigation/NavigationContext';

const logger = new Logger('example');
const handlers: IBackButtonHandler[] = [];
const Stack = createNativeStackNavigator<CombinedRootStackParamList>();

RainbowContainer.setAppSecretKey(jsonRainbowConfig);

export default function App() {
    const registerBackButtonHandler = (handler: IBackButtonHandler) => {
        logger.info('registerBackButtonHandler');

        handlers.push(handler);
        return () => {
            const index = handlers.indexOf(handler);
            if (index >= 0) {
                handlers.splice(index);
            } else {
                logger.error('Failed to unregister handler; handler not found');
            }
        };
    };
    return (
        <NavigationContainer>
        <RainbowContainer >
            <NativeBaseProvider>
                <ActiveCallBanner />
                <BackHandlerListener />
                <NavigationContext.Provider value={registerBackButtonHandler}>
                <Stack.Navigator screenOptions={{ gestureEnabled: false, headerShown: false }}  >
                         {/* App's screens  */}
                        <Stack.Screen name="ScreenHome" component={Home} />
                        <Stack.Screen name="AppMenu" component={AppMenuView} />
                        <Stack.Screen name="MyProfileInfo" component={MyProfileInfo} />
                        <Stack.Screen name="UserInfoFrom" component={UserInfoFrom} />
                        <Stack.Screen name="BubbleChatView" component={BubbleChatView} />
                        <Stack.Screen name="PeerConversationChatView" component={PeerConversationChatView} />
                        <Stack.Screen name="SharedFileList" component={SharedFileComponent} />
                        <Stack.Screen name="FileDescription" component={FileDescription} />
                        <Stack.Screen name="CreateBubble" component={CreateBubbleComponent} />
                        {/*  Other screens react-native-rainbow-module library */}
                        <Stack.Screen name="EditBubble" component={EditBubble} /> 
                        <Stack.Screen name="ForwardedView" component={ForwardedView} />
                        <Stack.Screen name="TelephonySettings" component={TelephonySettings} />
                        <Stack.Screen name="AddParticipants" component={AddParticipant} />
                        <Stack.Screen name="ContactInformation" component={ContactInformation} />
                        <Stack.Screen name="CallHistory" component={CallHistory} />
                    </Stack.Navigator>
                </NavigationContext.Provider>
            </NativeBaseProvider>
        </RainbowContainer>
        </NavigationContainer>
    );
}

const BackHandlerListener: React.FunctionComponent = () => {
    const navigation = useNavigation();
    useEffect(() => {
        console.log(navigation.canGoBack());
        logger.info('BackHandlerListener');
        BackHandler.addEventListener('hardwareBackPress', onHandleBackButton);
    }, []);

    const onHandleBackButton = () => {
        logger.info(`BackHandlerListener: onHandleBackButton ${handlers.length}`);
        for (const handler of handlers) {
            logger.info(`BackHandlerListener: handler ${handler} `);
            if (handler.onBackButtonPressed()) {
                return;
            }
        }
        if (navigation.canGoBack()) {
            navigation.goBack();
            return true;
        } else {
            BackHandler.exitApp();
            return true;
        }
    };
    return null;
};