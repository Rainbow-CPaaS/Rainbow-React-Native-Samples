import React, {useState} from 'react';
import {DialogCallComponent} from './Calls/DialogCallComponent';
import {webRtcActions} from './Calls/DialogCallComponent';
import {
  CallLogs,
  createRedialCallLogAction,
  createViewCallLogAction,
  ICallLog,
  ICallLogAction,
  ICallLogActionsProvider,
  IContact,
  Logger,
} from 'react-native-rainbow-module';
import {NavigationProp} from '@react-navigation/native';
import {CombinedRootStackParamList} from './Navigation/AppNavigationTypes';
const logger = new Logger('CallLogComponent');

interface ICallLogNavigationProps {
  navigation: NavigationProp<CombinedRootStackParamList>;
}
export const CallLogComponent: React.FunctionComponent<
  ICallLogNavigationProps
> = ({navigation}) => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [contactToCall, setContactToCall] = useState<IContact>();

  const actions: ICallLogAction[] = [
    createViewCallLogAction(callLog => {
      navigation.navigate('CallHistory', {callLog});
    }),
  ];

  const redialAction: ICallLogAction = createRedialCallLogAction(callLog => {
    if (
      callLog.contact.phoneNumbers.length === 0 ||
      callLog.lastCall.isConference
    ) {
      return;
    }
    setContactToCall(callLog.contact);
    openDialog();
  });

  const openDialog = () => {
    setShowDialog(!showDialog);
  };
  const callLogActionsProvider: ICallLogActionsProvider = new (class {
    public getCallLogAction = (callLog: ICallLog) => {
      logger.info(`getCallLogAction: ${callLog}`);
      return actions;
    };
    public getOnClickCallLogAction = (callLog: ICallLog) => {
      logger.info(`getOnClickCallLogAction: ${callLog}`);

      return redialAction;
    };
  })();
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
          callDialogWebRtcActions={webRtcActions}
        />
      )}
    </>
  );
};
