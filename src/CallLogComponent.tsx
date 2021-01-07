import { Container } from 'native-base';
import React, { useState } from 'react';
import { Actions } from 'react-native-router-flux';
import { OpenCallDialogComponent } from './CallComponent';
import { PbxActions, webRtcActions } from './CallComponent';
import {
    CallLogs,
    createRedialCallLogAction,
    createViewCallLogAction,
    ICallLog,
    ICallLogAction,
    ICallLogActionsProvider,
    IContact
} from 'react-native-rainbow-module';

export const CallLogComponent: React.FunctionComponent = () => {
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [contactToCall, setContactToCall] = useState<IContact>();

    const actions: ICallLogAction[] = [
        createViewCallLogAction(callLog => {
            if (Actions.currentScene !== 'callHistory') {
                Actions.callHistory({
                    callLog
                });
            }
        })
    ];

    const redialAction: ICallLogAction = createRedialCallLogAction(callLog => {
        if (callLog.contact.phoneNumbers.length === 0 || callLog.lastCall.isConference) {
            return;
        }
        setContactToCall(callLog.contact);
        openDialog();
    });

    const openDialog = () => {
        setShowDialog(!showDialog);
    };
    const callLogActionsProvider: ICallLogActionsProvider = new class {
        public getCallLogAction = (callLog: ICallLog) => {
            return actions;
        };
        public getOnClickCallLogAction = (callLog: ICallLog) => {
            return redialAction;
        };
    }();
    return (
        <Container>
            <CallLogs
                allCallsEnabled={true}
                missedCallsEnabled={true}
                callLogActionsProvider={callLogActionsProvider}
                voiceMailEnabled={true}
            />
            {contactToCall && (
                <OpenCallDialogComponent
                    contact={contactToCall}
                    showDialog={showDialog}
                    openDialog={openDialog}
                    callDialogPbxActions={PbxActions}
                    callDialogWebRtcActions={webRtcActions}
                />
            )}
        </Container>
    );
};
