import React, { useState } from 'react';
import { DialogCallComponent } from './Calls/DialogCallComponent';
import { IContact, Search } from 'react-native-rainbow-module';
import { CombinedRootStackParamList } from './Navigation/AppNavigationTypes';
import { NavigationProp } from '@react-navigation/native';

interface ISearchNavigationProps {
    navigation: NavigationProp<CombinedRootStackParamList>;
  }
export const SearchComponent: React.FunctionComponent<ISearchNavigationProps> = ({navigation}) => {
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [contactToCall, setContactToCall] = useState<IContact>();

    const openDialog = () => {
        setShowDialog(!showDialog);
    };

    const handleClickItem = (contact: IContact) => {
        setContactToCall(contact);
        navigation.navigate('ContactInformation', {contact})
    };
    return (
        <>
            <Search searchPeople={true} onClickItem={handleClickItem} />
            {contactToCall && (
                <DialogCallComponent
                    contact={contactToCall}
                    showDialog={showDialog}
                    openDialog={openDialog}
                    callDialogWebRtcActions={[]}
                />
            )};
        </>
    );
};
