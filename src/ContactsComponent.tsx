import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import {
    createViewContactAction,
    IAction,
    IActionsProvider,
    Contacts,
    IContactsStyleProps,
    IContactInfoStyleProps
} from 'react-native-rainbow-module';
import componentConfig from '../component-config.json'
import appStyleConfig from '../app-styles.json';
import { StyleSheet } from 'react-native';
import { CallComponent } from './CallComponent';

const contactsStyle = StyleSheet.create(appStyleConfig.contacts);
const contactsInfoStyle = StyleSheet.create(appStyleConfig.contactsInformation);
const contactsInfoCustomStyle: IContactInfoStyleProps = { headerBgColor: { backgroundColor: contactsInfoStyle.tabBackground.backgroundColor } }
const customStyle: IContactsStyleProps = { tabBackground: { backgroundColor: contactsStyle.tabBackground.backgroundColor } }

export class ContactsComponent extends Component implements IActionsProvider {
    private actions: IAction[] = [
        createViewContactAction(contact => {
            if (Actions.currentScene !== 'contactInformation') {
                Actions.contactInformation({
                    contact,
                    style: contactsInfoCustomStyle,
                    viewEmails: componentConfig.ContactInformation.viewEmails,
                    viewPhoneNumbers: componentConfig.ContactInformation.viewPhoneNumbers,
                    callActionsComponent: CallComponent
                });
            }
        })
    ];
    constructor(props: any) {
        super(props);
    }
    public getActions = () => {
        return this.actions;
    };
    public render() {
        return (
            <Contacts
                networkContactsEnabled={componentConfig.Contacts.networkContactsEnabled}
                localContactsEnabled={componentConfig.Contacts.localContactsEnabled}
                actionsProvider={this}
                style={customStyle}
            />
        );
    }
}
