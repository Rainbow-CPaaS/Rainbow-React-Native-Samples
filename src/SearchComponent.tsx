import React, {useState} from 'react';
import {DialogCallComponent} from './Calls/DialogCallComponent';
import {
  createCallPbxContactAction,
  IAction,
  IActionsProvider,
  IContact,
  Logger,
  Search,
} from 'react-native-rainbow-module';
import {CombinedRootStackParamList} from './Navigation/AppNavigationTypes';
import {NavigationProp} from '@react-navigation/native';

const logger = new Logger('SearchComponent');
interface ISearchNavigationProps {
  navigation: NavigationProp<CombinedRootStackParamList>;
}
export const SearchComponent: React.FunctionComponent<
  ISearchNavigationProps
> = ({navigation}) => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [contactToCall, setContactToCall] = useState<IContact>();

  const openDialog = () => {
    setShowDialog(!showDialog);
  };
  const actions: IAction[] = [
    createCallPbxContactAction((contact: IContact) => {
      setContactToCall(contact);
      openDialog();
    }),
  ];

  const contactActionsProvider: IActionsProvider = new (class {
    public getActions = (contact: IContact) => {
      logger.info(`getActions for contact${contact.name}`);
      return actions;
    };
  })();
  const handleClickItem = (contact: IContact) => {
    navigation.navigate('ContactInformation', {contact});
  };
  return (
    <>
      <Search
        searchPeople={true}
        contactActionsProvider={contactActionsProvider}
        onClickItem={handleClickItem}
      />
      {contactToCall && (
        <DialogCallComponent
          contact={contactToCall}
          showDialog={showDialog}
          openDialog={openDialog}
          callDialogWebRtcActions={[]}
        />
      )}
    </>
  );
};
