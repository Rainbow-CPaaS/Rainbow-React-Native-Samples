import * as React from 'react';
import { BackHandler } from 'react-native';
import {
  Logger,
  RainbowContainer,
  ContactInformation,
  TelephonySettings,
  CallHistory,
  IBackButtonHandler,
  ForwardedView,
  EditBubble,
  AddParticipant,
  useRainbowAuth,
  RainbowProvider,
  Spinner,
  SafeArea,
} from 'react-native-rainbow-module';
import { Home } from './Home';
import { AppMenuView } from './AppMenu';
import { CreateBubbleComponent } from './Bubbles/CreateBubbleComponent';
import { useEffect } from 'react';
import { PeerConversationChatView } from './Messages/PeerConversationChatView';
import { BubbleChatView } from './Messages/BubbleChatView';
import { ActiveCallBanner } from './Calls/ActiveCallBanner';
import { SharedFileComponent, FileDescription } from './SharedFile/';
import { MyProfileInfo, UserInfoFrom } from './MyProfile/';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CombinedRootStackParamList } from './Navigation/AppNavigationTypes';
import { NavigationContext } from './Navigation/NavigationContext';
import {  PaperProvider } from 'react-native-paper';
import customTheme from './theme';
import { LoginForm } from './Auth/LoginForm';
import { ForgotPassword } from './Auth/ForgotPassword';
import { ConnectivitySnackbar } from './ConnectivityBar';
const logger = new Logger('example');
const handlers: IBackButtonHandler[] = [];
const Stack = createNativeStackNavigator<CombinedRootStackParamList>();

const App: React.FunctionComponent = () => {

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
    <SafeArea >
        <PaperProvider theme={customTheme}>
            <RainbowProvider>
                <NavigationContainer>
                    <ConnectivitySnackbar />
                    <RootNavigator registerBackButtonHandler={registerBackButtonHandler} />
                </NavigationContainer>
            </RainbowProvider>
        </PaperProvider>
    </SafeArea>
);

};
const AuthNavigator = () => {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginForm} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      </Stack.Navigator>
  );
};
const MainAppNavigator: React.FC<{ registerBackButtonHandler: (handler: IBackButtonHandler) => () => void }> = ({ registerBackButtonHandler }) => {
  return (
      <>
          <ActiveCallBanner />
          <BackHandlerListener />
          <NavigationContext.Provider value={registerBackButtonHandler}>
              <Stack.Navigator screenOptions={{ gestureEnabled: false, headerShown: false }} >
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
      </>
  );
};

const RootNavigator: React.FC<{ registerBackButtonHandler: (handler: IBackButtonHandler) => () => void }> = ({ registerBackButtonHandler }) => {
  const { isAuthenticated, isLoading } = useRainbowAuth();

  if (isLoading) {
      return <Spinner spinnerSize={40} />;
  }

  return isAuthenticated ? <MainAppNavigator registerBackButtonHandler={registerBackButtonHandler} /> : <AuthNavigator />;
};




const BackHandlerListener: React.FunctionComponent = () => {
  const navigation = useNavigation();
  useEffect(() => {
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
export default App;
