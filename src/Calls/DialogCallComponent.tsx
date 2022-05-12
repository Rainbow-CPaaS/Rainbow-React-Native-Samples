import React from 'react';
import componentConfig from '../../component-config.json';
import { CallDialog, IContact, IPbxCallActionProps, IWebRtcCallActionProps } from 'react-native-rainbow-module'
interface IOpenCallDialogComponentProps {
    contact: IContact;
    showDialog: boolean;
    openDialog: () => void;
    callDialogWebRtcActions: IWebRtcCallActionProps[];
    callDialogPbxActions: IPbxCallActionProps;
}
export const webRtcActions: IWebRtcCallActionProps[] = [
    { callType: 'video', actionName: 'video', iconName: 'ios-videocam' },
    { callType: 'audio', actionName: 'audio', iconName: 'md-headset' }
];
export const PbxActions: IPbxCallActionProps = { enablePbxCalls: true };
export const DialogCallComponent: React.FunctionComponent<IOpenCallDialogComponentProps> = ({
    contact,
    showDialog,
    openDialog,
    callDialogWebRtcActions,
    callDialogPbxActions
}) => {
    return (
        <CallDialog
            contact={contact}
            webRtcActions={callDialogWebRtcActions}
            PbxActions={callDialogPbxActions}
            showDialog={showDialog}
            openDialog={openDialog}
            pbxEnabled={componentConfig.calls.pbxEnabled}
            webrtcEnabled={componentConfig.calls.webRtcEnabled}
        />
    );
};
