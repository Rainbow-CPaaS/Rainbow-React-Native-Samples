/* eslint-disable react-native/no-inline-styles */
import React, {FunctionComponent, useEffect, useState} from 'react';
import { ImageStyle, Text, TouchableWithoutFeedback, View } from 'react-native';
import {
  Logger,
  UserProfile,
  PresenceList,
  authService,
  eventEmitter,
  EventType,
  IUser,
  userProfileService,
} from 'react-native-rainbow-module';
import {AppMenuNavigationProp} from './Navigation/AppNavigationTypes';
import { useTheme, IconButton } from 'react-native-paper';
import customTheme from './theme';

const logger = new Logger('AppMenu');

const presenceIconStyle: ImageStyle = {
  width: 25,
  height: 25,
};
interface IMenuProps {
  navigation: AppMenuNavigationProp;
}
export const AppMenuView: FunctionComponent<IMenuProps> = ({navigation}) => {
  const theme = useTheme(customTheme);

  const [connectedUser, setConnectedUser] = useState<IUser>();
  // TODO: get the connected user here! since there is multi component depends on the UserProfile info
  useEffect(() => {
    userProfileService.getConnectedUser();
    const connectedUserUpdated = eventEmitter.addListener(
      EventType.ConnectedUserUpdated,
      (eventData: IUser) => {
        logger.info(`ConnectedUserUpdated${eventData}`);
        if (eventData) {
          setConnectedUser(eventData);
        }
      },
    );

    return () => {
      connectedUserUpdated.remove();
    };
  }, []);

  const onSendLogs = () => {
    logger.info('sendLogs:');
    logger.sendLogs();
  };
  const onLogout = () => {
    authService.signOut();
  };
  const goToMyProfileInfo = () => {
    if (connectedUser != null) {
      navigation.navigate('MyProfileInfo', {connectedUser});
    }
  };
  return (

    <View style={{ padding: 16 }}>
    <UserProfile />
    {connectedUser?.isAllowedToChangePresence && (
        <View style={{ flexDirection: 'row', alignItems: 'center',marginVertical: 8 }}>
            <PresenceList presenceIconStyle={presenceIconStyle} />
        </View>
    )}

    <TouchableWithoutFeedback onPress={goToMyProfileInfo}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8  }}>
            <IconButton icon="account-circle" size={30} iconColor={theme.colors.primary as string}  />
            <Text>My Profile</Text>
        </View>
    </TouchableWithoutFeedback>

    <TouchableWithoutFeedback onPress={onSendLogs}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
            <IconButton icon="information" size={24} iconColor={theme.colors.primary as string}  />
            <Text>Send Logs</Text>
        </View>
    </TouchableWithoutFeedback>

    <TouchableWithoutFeedback onPress={onLogout}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
            <IconButton icon="logout" size={30} iconColor={theme.colors.primary as string}   />
            <Text>Log out</Text>
        </View>
    </TouchableWithoutFeedback>
</View>

  );
};
