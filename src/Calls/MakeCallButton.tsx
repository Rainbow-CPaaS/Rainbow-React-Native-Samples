import React from 'react';
import componentConfig from '../../component-config.json';
import {
  CallButton,
  IImageButtonStyleProps,
  IContact,
  IPbxCallActionProps,
  IWebRtcCallActionProps,
} from 'react-native-rainbow-module';
import videoCall from '../resources/images/videoCall.png';

interface ICallComponentProps {
  contact: IContact;
}
const customStyle: IImageButtonStyleProps = {
  image: {
    width: 50,
    height: 50,
  },
};
export const webRtcActions: IWebRtcCallActionProps[] = [
  {callType: 'video', actionName: 'video', iconName: 'videocam'},
  {callType: 'audio', actionName: 'audio', iconName: 'headset'},
];
export const PbxActions: IPbxCallActionProps = {enablePbxCalls: true};

export const MakeCallButton: React.FunctionComponent<ICallComponentProps> = ({
  contact,
}) => {
  return (
    <CallButton
      imageSource={videoCall}
      style={customStyle}
      webRtcActions={webRtcActions}
      contact={contact}
      pbxEnabled={componentConfig.calls.pbxEnabled}
      webrtcEnabled={componentConfig.calls.webRtcEnabled}
    />
  );
};
