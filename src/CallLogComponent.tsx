import React, { useState } from 'react';
import { Actions } from 'react-native-router-flux';
import { DialogCallComponent } from './Calls/DialogCallComponent';
import { webRtcActions } from './Calls/DialogCallComponent';
import {
    CallLogs,
    createRedialCallLogAction,
    createViewCallLogAction,
    ICallLog,
    ICallLogAction,
    ICallLogActionsProvider,
    IContact,
    Logger
} from 'react-native-rainbow-module';
const logger = new Logger('CallLogComponent');

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
            logger.info(`getCallLogAction: ${callLog}`)
            return actions;
        };
        public getOnClickCallLogAction = (callLog: ICallLog) => {
            logger.info(`getOnClickCallLogAction: ${callLog}`)

            return redialAction;
        };
    }();
    return (
        <>
            <CallLogs
                allCallsEnabled={true}
                missedCallsEnabled={true}
                callLogActionsProvider={callLogActionsProvider}
                voiceMailEnabled={true}
            />
            {contactToCall && (
                <DialogCallComponent
                    contact={contactToCall}
                    showDialog={showDialog}
                    openDialog={openDialog}
                    callDialogWebRtcActions={webRtcActions} />
            )}
        </>
    );
};
