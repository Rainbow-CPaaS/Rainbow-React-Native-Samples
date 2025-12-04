import React, { useState } from 'react';
import { DialogCallComponent } from './Calls/DialogCallComponent';
import { webRtcActions } from './Calls/DialogCallComponent';
import {
    CallLogs,
    ICallLog,
    IContact,
} from 'react-native-rainbow-module';
import { NavigationProp } from '@react-navigation/native';
import { CombinedRootStackParamList } from './Navigation/AppNavigationTypes';

interface ICallLogNavigationProps {
    navigation: NavigationProp<CombinedRootStackParamList>;
}
export const CallLogComponent: React.FunctionComponent<ICallLogNavigationProps> = ({ navigation }) => {
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [contactToCall, setContactToCall] = useState<IContact>();

    const onClickCallLogAction = (callLog: ICallLog)=> {
        if (callLog.contact.phoneNumbers.length === 0 || callLog.lastCall.isConference) {
            return;
        }
        setContactToCall(callLog.contact);
        openDialog();
    };

    const openDialog = () => {
        setShowDialog(!showDialog);
    };

    return (
        <>
            <CallLogs
                allCallsEnabled={true}
                missedCallsEnabled={true}
                onClickCallLogAction={onClickCallLogAction}
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
