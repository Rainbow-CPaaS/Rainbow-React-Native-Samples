import { Container } from 'native-base';
import React, { useState } from 'react';
import { Actions } from 'react-native-router-flux';
import { DialogCallComponent, PbxActions } from './Calls/DialogCallComponent';
import { createCallPbxContactAction, IAction, IActionsProvider, IContact, Logger, Search } from 'react-native-rainbow-module';

const logger = new Logger('SearchComponent');
export const SearchComponent: React.FunctionComponent = () => {
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [contactToCall, setContactToCall] = useState<IContact>();

    const openDialog = () => {
        setShowDialog(!showDialog);
    };
    const actions: IAction[] = [
        createCallPbxContactAction(contact => {
            setContactToCall(contact);
            openDialog();
        })
    ];

    const contactActionsProvider: IActionsProvider = new (class {
        public getActions = (contact: IContact) => {
            logger.info(`getActions for contact${contact.name}`)
            return actions;
        };
    })();
    const handleClickItem = (contact: IContact) => {
        if (Actions.currentScene !== 'contactInformation') {
            Actions.contactInformation({
                contact
            });
        }
    };
    return (
        <Container>
            <Search searchPeople={true} contactActionsProvider={contactActionsProvider} onClickItem={handleClickItem} />
            {contactToCall && (
                <DialogCallComponent
                    contact={contactToCall}
                    showDialog={showDialog}
                    openDialog={openDialog}
                    callDialogWebRtcActions={[]}
                    callDialogPbxActions={PbxActions}
                />
            )}
        </Container>
    );
};
