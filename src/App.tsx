import * as React from 'react';
import { BackHandler, StyleSheet } from 'react-native';
import { Logger, DialPad, RainbowContainer, ContactInformation, IContactInfoStyleProps, TelephonySettings, CallHistory, IBackButtonHandler } from 'react-native-rainbow-module';
import { Actions, Router, Scene } from 'react-native-router-flux';
import { Home } from './Home';
import componentConfig from '../component-config.json'
import appStyleConfig from '../app-styles.json';
import { CallComponent } from './CallComponent';
import AppMenuView from './AppMenu';
import { CreateBubbleComponent } from './BubblesComponent';
import { MessagesComponent } from './MessagesComponent';
import { useEffect } from 'react';

const contactsInfoStyle = StyleSheet.create(appStyleConfig.contactsInformation);
const logger = new Logger('example');
const contactsInfoCustomStyle: IContactInfoStyleProps = { headerBgColor: { backgroundColor: contactsInfoStyle.tabBackground.backgroundColor } }

const handlers: IBackButtonHandler[] = [];

export default function App() {
    const registerBackButtonHandler = (handler: IBackButtonHandler) => {
        console.info('Home: registerBackButtonHandler');
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
        <RainbowContainer>
            <BackHandlerListener />

            <Router>
                <Scene key="root" headerMode="none">
                    <Scene key="home" component={Home} registerBackButtonHandler={registerBackButtonHandler} />
                    <Scene
                        key="dialPad"
                        component={DialPad}
                        showCallButton={true}
                    />
                    <Scene
                        key="contactInformation"
                        component={ContactInformation}
                        callActionsComponent={CallComponent}
                        viewEmails={componentConfig.ContactInformation.viewEmails}
                        viewPhoneNumbers={componentConfig.ContactInformation.viewPhoneNumbers}
                        style={contactsInfoCustomStyle}
                    />
                    <Scene key="Telephony" component={TelephonySettings} />
                    <Scene key="AppMenu" component={AppMenuView} />
                    <Scene key="createBubble" component={CreateBubbleComponent} />
                    <Scene key="messages" component={MessagesComponent} />
                    <Scene key="callHistory" component={CallHistory} callActionsComponent={CallComponent} />

                </Scene>
            </Router>
        </RainbowContainer>
    );
}
const BackHandlerListener: React.FunctionComponent = () => {
    useEffect(() => {
        logger.info('BackHandlerListener');
        BackHandler.addEventListener('hardwareBackPress', onHandleBackButton);
    }, []);

    const onHandleBackButton = () => {
        logger.info(`BackHandlerListener: onHandleBackButton ${handlers.length} ${Actions.currentScene}`);
        for (const handler of handlers) {
            if (handler.onBackButtonPressed()) {
                return;
            }
        }
        if (Actions.currentScene === 'home') {
            BackHandler.exitApp();
        } else {
            Actions.pop();
        }
        return null;
    };
    return null;
};