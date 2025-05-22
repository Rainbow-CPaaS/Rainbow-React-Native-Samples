import {Strings} from '../../resources/localization/Strings';
import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  Dimensions,
  ImageStyle,
  SafeAreaView,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
  Text,
} from 'react-native';

import {
  P2PCallView,
  IP2PCall,
  P2PCallActions,
  IStyledProps,
  Logger,
  eventEmitter,
  EventType,
  AnswerAudioCallButton,
  EndP2PCallButton,
  SharingVideo,
  RemoteWebrtcVideo,
  MyLocalWebrtcVideo,
  CallTypeName,
  CallState,
  ImageHolder,
  IImageHolderStyle,
  Timer,
  Header,
  currentCallService,
} from 'react-native-rainbow-module';

const logger = new Logger('CallContainer');

export interface ICallViewStyleProps {
  localVideo?: ViewStyle;
  remoteVideo?: ViewStyle;
  shareVideo?: ViewStyle;
  thumbnail?: ImageStyle;
  textStyle?: TextStyle;
  backgroundImage: ImageStyle;
}
interface IProps
  extends IStyledProps<{
    callView?: ICallViewStyleProps;
  }> {
  callActionsComponent?: React.ReactNode;
  P2PCallView?: React.ReactNode;
}
/**
 * @module
 * @name Calls
 * @public
 * @description This module services manages the PBX and the Webrtc calls provided by Rainbow
 *  <br>
 */
export const P2PCall: FunctionComponent<IProps> = ({}) => {
  const [p2pCall, setP2PCall] = useState<IP2PCall>();
  const isPortrait = () => {
    return Dimensions.get('screen').height >= Dimensions.get('screen').width;
  };
  const [orientation, setOrientation] = useState(
    isPortrait() ? 'portrait' : 'landscape',
  );
  const isCallActive = p2pCall?.callState === CallState.ACTIVE;
  let callStateText =
    p2pCall?.callState === undefined || p2pCall?.callState === null
      ? ''
      : p2pCall?.callState.toString();


  switch (p2pCall?.callState) {
    case CallState.RINGING_INCOMING:
      callStateText = Strings.IncomingCall;
      break;
    case CallState.RINGING_OUTGOING:
      callStateText = Strings.OutgoingCall;
      break;
    case CallState.HELD:
      callStateText = Strings.onHold;
      break;
  }
  useEffect(() => {
    logger.info(`p2p call ${p2pCall}`);

    currentCallService.getCurrentCall();
    Dimensions.addEventListener('change', () => {
      const orientationChanges = isPortrait() ? 'portrait' : 'landscape';
      setOrientation(orientationChanges);
    });

    const handleCurrentCallEvent = (call: IP2PCall) => {
      if (call?.currentTypeName === CallTypeName.P2P) {
        logger.info('CurrentCall event received: call is active');
        setP2PCall(call);
      } else {
        logger.info(
          'CurrentCall event received: no call is active, exiting call activity',
        );
      }
    };

    const updateCurrentCall = (call?: IP2PCall) => {
      logger.info(`updateCurrentCall ${call?.callId}`);
      setP2PCall(call);
    };

    const currentCallListener = eventEmitter.addListener(
      EventType.GetCurrentCall,
      handleCurrentCallEvent,
    );
    const callUpdatedListener = eventEmitter.addListener(
      EventType.P2PCallUpdated,
      updateCurrentCall,
    );

    return () => {
      logger.info('unregister listeners: ');
      currentCallListener.remove();
      callUpdatedListener.remove();
    };
  }, []);
  const renderIncomingCallActions = () => {
    if (p2pCall) {
      return (
        <>
          <AnswerAudioCallButton call={p2pCall} />
          <EndP2PCallButton call={p2pCall} />
        </>
      );
    }
    return null;
  };
  const renderActiveCallView = (call: IP2PCall) => {
    const {
      videoRemoteStreamCount,
      isLocalVideoEnabled,
      wasInitiatedWithVideo,
      wasInitiatedWithShare,
      isRemoteVideoEnabled,
    } = call;
    const profilePictureView = (
      <ImageHolder
        url={call.callPeer.imageURL}
        style={participantImageStyle}
        name={call.callPeer.name}
      />
    );
    const remoteVideoDynamicStyle = wasInitiatedWithShare
      ? {width: 150, height: 150, top: 10}
      : {};
    const remoteCombinedStyle = {
      ...styles.remoteVideo,
      ...remoteVideoDynamicStyle,
    };
    console.log(remoteCombinedStyle);
    return (
      <View style={{flex: 1}}>
        {!wasInitiatedWithVideo &&
          videoRemoteStreamCount === 0 &&
          profilePictureView}
        {wasInitiatedWithShare && (
          <SharingVideo call={call} style={styles.shareVideo} />
        )}
        {isRemoteVideoEnabled && (
          <RemoteWebrtcVideo call={call} style={remoteCombinedStyle} />
        )}
        {isLocalVideoEnabled && (
          <MyLocalWebrtcVideo style={styles.myLocalWebrtcVideo} />
        )}
      </View>
    );
  };

  if (p2pCall) {
    const renderCenterHeader = () => {
      return (
		<View style={styles.headerContainer}>
		<Text style={styles.headerText}>{p2pCall.callPeer.name}</Text>
		{!isCallActive && <Text style={styles.headerText}>{callStateText}</Text>}
		{isCallActive && <Text style={styles.headerText}><Timer startTime={p2pCall.startTime} /></Text>}
	</View>
      );
    };
    return (
      <React.Fragment>
        <SafeAreaView style={styles.headerColor} />
        <Header centerComponent={renderCenterHeader} containerStyle={{ backgroundColor: '#0086CF' }} />

		<View style={styles.container}>
		<P2PCallView call={p2pCall} />
          <P2PCallActions
            call={p2pCall}
            renderIncomingP2PCallActions={renderIncomingCallActions}
            style={{actionsContainer: {backgroundColor: 'gray'}}}
          />
        </View>
      </React.Fragment>
    );
  } else {return null;}
};
const participantImageStyle: IImageHolderStyle = {
  thumbnail: {
    top: 100,
    alignSelf: 'center',
    width: 140,
    height: 140,
    borderRadius: 100,
  },
  thumbnailContainer: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    width: 140,
    height: 140,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cf0071',
  },
  imageTextStyle: {fontSize: 50},
};
export const styles = StyleSheet.create({
  myLocalWebrtcVideo: {
    top: 10,
  },
  headerColor: {
    backgroundColor: '#0086CF',
  },
  remoteVideo: {position: 'absolute', width: '100%', height: 250, top: 50},
  shareVideo: {position: 'absolute', width: '100%', height: 250, top: 50},
  headerContainer: {
	justifyContent: 'space-around',
	alignItems: 'center',
	paddingVertical: 16,
},
headerText: {
	color: 'white',
	fontSize: 16,
},
container: {
	backgroundColor: '#005b96',
	minHeight: '100%',
},
});
