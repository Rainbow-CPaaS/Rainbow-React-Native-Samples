import React from 'react';
import componentConfig from '../component-config.json';
import { CallButton, IImageButtonStyleProps, IContact, CallDialog, IPbxCallActionProps, IWebRtcCallActionProps } from 'react-native-rainbow-module'
import videoCall from './videoCall.png';

interface ICallComponentProps {
    contact: IContact;
}
const customStyle: IImageButtonStyleProps = {
    image: {
        width: 50,
        height: 50
    }
};
export const webRtcActions: IWebRtcCallActionProps[] = [
    { callType: 'video', actionName: 'video', iconName: 'ios-videocam' },
    { callType: 'audio', actionName: 'audio', iconName: 'md-headset' }
];
export const PbxActions: IPbxCallActionProps = { enablePbxCalls: true };

export const CallComponent: React.FunctionComponent<ICallComponentProps> = ({ contact }) => {
    return (
        <CallButton
            imageSource={videoCall}
            style={customStyle}
            webRtcActions={webRtcActions}
            PbxActions={PbxActions}
            contact={contact}
            pbxEnabled={componentConfig.calls.pbxEnabled}
            webrtcEnabled={componentConfig.calls.webRtcEnabled}
        />
    );
};
interface IOpenCallDialogComponentProps {
    contact: IContact;
    showDialog: boolean;
    openDialog: () => void;
    callDialogWebRtcActions: IWebRtcCallActionProps[];
    callDialogPbxActions: IPbxCallActionProps;
}
export const OpenCallDialogComponent: React.FunctionComponent<IOpenCallDialogComponentProps> = ({
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
