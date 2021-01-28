import { Container } from 'native-base';
import React, { useState } from 'react';
import { Actions } from 'react-native-router-flux';
import { OpenCallDialogComponent, PbxActions } from './CallComponent';
import { createCallPbxContactAction, IAction, IActionsProvider, IContact, Search } from 'react-native-rainbow-module';

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
                <OpenCallDialogComponent
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
