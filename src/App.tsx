import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Logger, DialPad, RainbowContainer, ContactInformation, IContactInfoStyleProps, TelephonySettings } from 'react-native-rainbow-module';
import { Router, Scene } from 'react-native-router-flux';
import Home from './Home';
import componentConfig from '../component-config.json'
import appStyleConfig from '../app-styles.json';
import { CallComponent } from './CallComponent';
import AppMenuView from './AppMenu';
import { CreateBubbleComponent } from './BubblesComponent';
import { MessagesComponent } from './MessagesComponent';

const contactsInfoStyle = StyleSheet.create(appStyleConfig.contactsInformation);
const logger = new Logger('example');
const contactsInfoCustomStyle: IContactInfoStyleProps = { headerBgColor: { backgroundColor: contactsInfoStyle.tabBackground.backgroundColor } }

export default function App() {
    React.useEffect(() => {
        logger.info('This logs is from example app');
    }, []);

    return (
        <RainbowContainer>
            <Router>
                <Scene key="root" headerMode="none">
                    <Scene key="login" component={Home} />
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
                </Scene>
            </Router>
        </RainbowContainer>
    );
}
