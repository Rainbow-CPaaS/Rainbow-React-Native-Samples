import React, {useEffect, useState} from 'react';
import {
  Contacts,
  IContact,
  ContactCardView,
  eventEmitter,
  EventType,
  ImageButton,
  startUpService,
} from 'react-native-rainbow-module';
import {StyleSheet, Text} from 'react-native';
import {MakeCallButton} from './Calls/MakeCallButton';
import {NavigationProp} from '@react-navigation/native';
import {CombinedRootStackParamList} from './Navigation/AppNavigationTypes';
import {Center} from 'native-base';
import {Strings} from './resources/localization/Strings';
import contactDetailsImage from './resources/images/contactdetails.png';

interface IContactsNavigationProps {
  navigation: NavigationProp<CombinedRootStackParamList>;
}
export const ContactsComponent: React.FunctionComponent<
  IContactsNavigationProps
> = ({navigation}) => {
  const [contacts, setContacts] = useState<IContact[]>([]);
  useEffect(() => {
    startUpService.getRosterContacts();

    const contactsUpdated = eventEmitter.addListener(
      EventType.ContactsUpdated,
      (eventData: IContact[]) => {
        setContacts(eventData);
      },
    );

    return () => {
      contactsUpdated.remove();
    };
  }, []);

  const renderEmptyList = () => {
    return (
      <Center>
        <Text style={defaultStyle.NoDataMessages}>{Strings.noDataFound}</Text>
      </Center>
    );
  };
  const navigateToContactDetails = (contact: IContact) => () => {
    const makeCallButton = <MakeCallButton contact={contact} />;
    navigation.navigate('ContactInformation', {contact, makeCallButton});
  };
  const contactCardRightComponent = (contact: IContact) => {
    return (
      <ImageButton
        key={1}
        imageSource={contactDetailsImage}
        onPress={navigateToContactDetails(contact)}
        style={{
          container: {width: 50, height: 50},
          image: {width: 50, height: 50},
        }}
      />
    );
  };

  const renderItems = (item: IContact) => {
    return (
      <ContactCardView
        contact={item}
        rightItem={contactCardRightComponent(item)}
      />
    );
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
