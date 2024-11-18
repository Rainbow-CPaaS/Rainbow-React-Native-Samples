import React, { useEffect, useState } from 'react';
import {
  Contacts,
  IContact,
  ContactCardView,
  eventEmitter,
  EventType,
  ImageButton,
  startUpService,
} from 'react-native-rainbow-module';
import { StyleSheet, Text, View } from 'react-native';
import { webRtcActions } from './Calls/MakeCallButton';
import { NavigationProp } from '@react-navigation/native';
import { CombinedRootStackParamList } from './Navigation/AppNavigationTypes';
import { Strings } from './resources/localization/Strings';
import contactDetailsImage from './resources/images/contactdetails.png';
import videoCall from './resources/images/videoCall.png';


interface IContactsNavigationProps {
  navigation: NavigationProp<CombinedRootStackParamList>;
}
export const ContactsComponent: React.FunctionComponent<IContactsNavigationProps> = ({ navigation }) => {
  const [contacts, setContacts] = useState<IContact[]>([]);
  useEffect(() => {
    startUpService.getRosterContacts();

    const contactsUpdated = eventEmitter.addListener(
      EventType.ContactsUpdated,
      (eventData: IContact[]) => {
        setContacts(eventData);
      });

    return () => {
      contactsUpdated.remove();
    };
  }, []);

  const renderEmptyList = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={defaultStyle.NoDataMessages}>
          {Strings.noDataFound}
        </Text>
      </View>
    );
  };
  const navigateToContactDetails = (contact: IContact) => () => {
    navigation.navigate('ContactInformation', {
      contact,
      makeCallButtonProps: {
        imageSource: videoCall,
        webrtcActions: webRtcActions,
      },
    });

  };
  const contactCardRightComponent = (contact: IContact) => {

    return (
      <ImageButton
        key={1}
        imageSource={contactDetailsImage}
        onPress={navigateToContactDetails(contact)}
        style={{
          container: {
            width: 50, height: 50,
          }, image: { width: 50, height: 50 },
        }}
      />
    );
  };

  const renderItems = (item: IContact) => {
    return <ContactCardView contact={item} rightItem={contactCardRightComponent(item)} />;
  };

  return (
    <Contacts
      contacts={contacts}
      renderItems={renderItems}
      renderEmptyList={renderEmptyList}
    />
  );
};

const defaultStyle = StyleSheet.create({
  NoDataMessages: {
    textAlign: 'center',
  },
});
