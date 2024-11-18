import React, {FunctionComponent} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Strings} from '../../resources/localization/Strings';
import {
  ConferenceScreenSharingView,
  IConferenceParticipants,
} from 'react-native-rainbow-module';
interface IProps {
  sharingParticipant?: IConferenceParticipants;
}

export const ShareConferenceView: FunctionComponent<IProps> = ({
  sharingParticipant,
}) => {
  // TODO:The sharingParticipant is not supported yet by the iOS side, this is why its may be undefined
  const participantNameView = sharingParticipant && (
    <Text style={defaultStyle.participantName}>
      {sharingParticipant?.name} {Strings.isSharing}{' '}
    </Text>
  );
  return (
    <View style={styles.container}>
      <ConferenceScreenSharingView />
      {participantNameView}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    bottom: 100,
    width: '100%',
    position: 'absolute',
    top: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
},
participantName: {
    color: 'white',
    fontSize: 20,
    width: '100%',
    textAlign: 'center',
    padding: 5,
},
shareVideo: {
    width: '100%',
    height: '100%',
},
});
