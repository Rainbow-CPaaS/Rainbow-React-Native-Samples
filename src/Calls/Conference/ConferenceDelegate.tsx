import {
  Text,
} from 'native-base';
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  ViewStyle,
  TextStyle,
  StyleSheet,
  FlatList
} from 'react-native';
import { IConferenceParticipants, ContactCardView, IContact, conferenceService } from 'react-native-rainbow-module';
import { Strings } from '../../resources/localization/Strings';

export interface IProps {
  showDelegateView: boolean;
  delegateParticipants: IConferenceParticipants[];
  bubbleId: string;
  onClosePressed: () => void;
}
export interface IAppInfoStyleProps {
  centeredView?: ViewStyle;
  modalView?: ViewStyle;
  modalTitleText?: TextStyle;
  modalMessageText?: TextStyle;
  modalInputItem?: ViewStyle;
  modalOptions?: ViewStyle;
  modalOptionsText?: TextStyle
  participantList?: ViewStyle;
}
export const ConferenceDelegateContainer: React.FunctionComponent<IProps> = ({
  delegateParticipants,
  bubbleId,
  showDelegateView,
  onClosePressed
}) => {


  const [selectedParticipantToDelegate, setSelectedParticipantToDelegate] = useState<IConferenceParticipants>();



  const onParticipantSelected = (selectedContact: IContact) => {
    if (selectedContact.jId !== selectedParticipantToDelegate?.jId) {
      setSelectedParticipantToDelegate(selectedContact as IConferenceParticipants);
    } else {
      // Check if its already had been selected, to unselect this contact
      setSelectedParticipantToDelegate(undefined);
    }
  }

  const onEndPress = () => {
    conferenceService.endConferenceCall(bubbleId);
  };

  const onDelegatePress = () => {
    if (selectedParticipantToDelegate) {
      conferenceService.delegateConference(bubbleId, selectedParticipantToDelegate.participantId);
    }
  }

  const renderParticipantsListView = () => {
    const renderItems = ({ item }: { item: IConferenceParticipants }) => {
      const style = item.jId === selectedParticipantToDelegate?.jId ? defaultModalStyle.selectedContactItem : defaultModalStyle.centeredView;
      return (
        <ContactCardView contact={item} onPressed={onParticipantSelected} style={{ listItem: style }} />
      );
    }
    const renderKeyExtractor = (item: IConferenceParticipants) => {
      return item.jId;
    }

    return (
      <FlatList
        data={delegateParticipants}
        renderItem={renderItems}
        keyExtractor={renderKeyExtractor}
      />
    );
  };

  const getMessageText = () => {
    if (delegateParticipants.length === 0) {
      return Strings.DelegateMsg1
    }
    else {
      return Strings.DelegateMsg2
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showDelegateView}
    >
      <View style={defaultModalStyle.centeredView}>
        <View style={defaultModalStyle.modalView}>
          <Text style={defaultModalStyle.modalTitleText}>{Strings.EndMeeting}</Text>
          <Text style={defaultModalStyle.modalMessageText}>{getMessageText()}</Text>
          {delegateParticipants.length > 0 && <View style={defaultModalStyle.participantList}>
            {renderParticipantsListView()}
          </View>
          }
          <View style={defaultModalStyle.viewContainer}>
            <TouchableOpacity onPress={onClosePressed}>
              <Text style={defaultModalStyle.modalOptionsText}>{Strings.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onEndPress}>
              <Text style={defaultModalStyle.endMeetingText}>{Strings.EndMeeting}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelegatePress} style={selectedParticipantToDelegate === undefined ? { opacity: 0.2 } : { opacity: 1 }} disabled={selectedParticipantToDelegate === undefined}>
              <Text style={defaultModalStyle.modalOptionsText}>{Strings.Delegate}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </Modal>
  );
};


const defaultModalStyle = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactItem: {
    display: 'flex',
    flexDirection: 'row',
    margin: 10
  },
  selectedContactItem: {
    display: 'flex',
    flexDirection: 'row',
    margin: 10,
    backgroundColor: 'rgba(	204, 230, 245, 0.8)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginLeft: 30,
    marginRight: 30
  },
  modalTitleText: {
    textAlign: 'center',
    fontSize: 22,
    color: '#0086CF',
    margin: 10
  },
  modalMessageText: {
    textAlign: 'center',
    margin: 10,
    fontSize: 15,
  },
  modalInputItem: {
    borderColor: '#0086CF',
    marginTop: 20,
    borderRadius: 10,
  },
  modalOptions: {
    flexDirection: 'row',
    marginTop: 40,
    alignSelf: 'flex-end'
  },
  modalOptionsText: {
    fontSize: 15,
    color: '#0086CF',
  },
  participantList: {
    flexDirection: 'row',
    margin: 10,
    backgroundColor: '#E8E8E8'
  },
  viewContainer: {
    flexDirection: 'row', justifyContent: 'space-between', margin: 10,
  },
  endMeetingText: {
    fontSize: 15, color: 'red'
  }
});