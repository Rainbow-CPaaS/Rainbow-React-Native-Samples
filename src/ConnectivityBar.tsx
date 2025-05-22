import React, { useEffect, useState } from 'react';
import { eventEmitter, EventType, startUpService, WarningPanner } from 'react-native-rainbow-module';
import { Strings } from './resources/localization/Strings';

export const ConnectivitySnackbar = () => {
  const [isNetworkAvailable, setIsNetworkAvailable] = useState(true);

  useEffect(() => {
    const networkListener = eventEmitter.addListener(
      EventType.IsNetworkAvailable,
      (available: boolean) => {
        setIsNetworkAvailable(available);
      }
    );
    startUpService.checkNetworkConnection();

    return () => {
      networkListener.remove();
    };
  }, [isNetworkAvailable]);

  return (
    <>
	{ !isNetworkAvailable &&  <WarningPanner msg={Strings.noNetworkConnection}/>}
    </>
  );
};
