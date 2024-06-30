import {Box, HStack, StatusBar, Text, VStack, InfoIcon} from 'native-base';
import React, {FunctionComponent, useEffect, useState} from 'react';
import {ImageStyle, TouchableWithoutFeedback} from 'react-native';
import {
  Logger,
  Telephony,
  UserProfile,
  PresenceList,
  store,
  authService,
  eventEmitter,
  EventType,
  IUser,
  userProfileService,
} from 'react-native-rainbow-module';
import {Provider} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {AppMenuNavigationProp} from './Navigation/AppNavigationTypes';

const logger = new Logger('AppMenu');

const presenceIconStyle: ImageStyle = {
  width: 25,
  height: 25,
};
interface IMenuProps {
  navigation: AppMenuNavigationProp;
}
export const AppMenuView: FunctionComponent<IMenuProps> = ({navigation}) => {
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
    logger.info(`sendLogs:`);
    logger.sendLogs();
  };
  const onLogout = () => {
    authService.signOut();
    store.dispatch(SignOutActionCreator);
  };
  const goToMyProfileInfo = () => {
    if (connectedUser != null) {
      navigation.navigate('MyProfileInfo', {connectedUser});
    }
  };
  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" />
      <Box safeAreaTop={true} bg="#0086CF" />
      <VStack space={3} w="100%">
        <UserProfile />
        {connectedUser?.isAllowedToChangePresence && (
          <HStack alignItems="flex-start" my="2" ml="5">
            <PresenceList presenceIconStyle={presenceIconStyle} />
          </HStack>
        )}
        {/* <Telephony /> */}
        <TouchableWithoutFeedback onPress={goToMyProfileInfo}>
          <HStack alignItems="flex-start" my="2">
            <Icon
              name="person-circle"
              size={30}
              color="#2196F3"
              style={{marginLeft: 20}}
            />
            <Text>MyProfile</Text>
          </HStack>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={onSendLogs}>
          <HStack alignItems="flex-start" my="2">
            <InfoIcon size="6" mx="5" color="blue.500" />
            <Text>Send Logs</Text>
          </HStack>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={onLogout}>
          <HStack alignItems="flex-start" my="2">
            <Icon
              name="log-out"
              size={30}
              color="#2196F3"
              style={{marginLeft: 20}}
            />
            <Text mx="5">Log out</Text>
          </HStack>
        </TouchableWithoutFeedback>
      </VStack>
    </Provider>
  );
};

const SignOutActionCreator = () => {
  logger.info('On SignOut');
  return {
    type: 'signOut',
  };
};
