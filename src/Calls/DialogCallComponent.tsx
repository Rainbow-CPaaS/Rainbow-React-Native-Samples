import React from 'react';
import componentConfig from '../../component-config.json';
import {
  CallDialog,
  IContact,
  IPbxCallActionProps,
  IWebRtcCallActionProps,
} from 'react-native-rainbow-module';
interface IOpenCallDialogComponentProps {
  contact: IContact;
  showDialog: boolean;
  openDialog: () => void;
  callDialogWebRtcActions: IWebRtcCallActionProps[];
  callDialogPbxActions?: IPbxCallActionProps;
}
export const webRtcActions: IWebRtcCallActionProps[] = [
  {callType: 'video', actionName: 'video', iconName: 'videocam'},
  {callType: 'audio', actionName: 'audio', iconName: 'headset'},
];
export const DialogCallComponent: React.FunctionComponent<
  IOpenCallDialogComponentProps
> = ({contact, showDialog, openDialog, callDialogWebRtcActions}) => {
  return (
    <CallDialog
      contact={contact}
      webRtcActions={callDialogWebRtcActions}
      showDialog={showDialog}
      openDialog={openDialog}
      pbxEnabled={componentConfig.calls.pbxEnabled}
      webrtcEnabled={componentConfig.calls.webRtcEnabled}
    />
  );
};
