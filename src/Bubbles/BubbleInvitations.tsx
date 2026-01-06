import { Divider, Button } from 'react-native-paper';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import {
  IBubble,
  eventEmitter,
  EventType,
  Bubbles,
  AvatarPresenceBadge,
  bubblesService,
} from 'react-native-rainbow-module';

export const BubbleInvitations: FunctionComponent = () => {
  const [invitedBubbles, setInvitedBubble] = useState<IBubble[]>([]);
  useEffect(() => {
    bubblesService.getInvitedBubbles();
    // Listen for the invited bubble array result.
    const getInvitedBubbles = eventEmitter.addListener(
      EventType.GetInvitedBubbles,
      (bubble: IBubble[]) => {
        setInvitedBubble(bubble);
      },
    );
    // Listen to the accept/decline bubble invitation result.
    const invitedBubblesResult = eventEmitter.addListener(
      EventType.InvitedBubblesResult,
      (result: string) => {
        Alert.alert('Invitation Response', result);
      },
    );
    return () => {
      setInvitedBubble([]);
      getInvitedBubbles.remove();
      invitedBubblesResult.remove();
    };
  }, []);

  const acceptBubbleInvitation = (bubbleId: string) => () => {
    bubblesService.acceptBubbleInvitation(bubbleId);
  };
  const declineBubbleInvitation = (bubbleId: string) => () => {
    bubblesService.declineBubbleInvitation(bubbleId);
  };

  const renderBubbleInvitation = (item: IBubble) => {
    return (
      <View style={styles.container}>
      <View style={styles.innerContainer}>
          <View style={styles.leftSection}>
          <AvatarPresenceBadge peer={item} presence={undefined} />
          <View style={styles.textContainer}>
                  <Text style={styles.nameText}>{item.name}</Text>
                  <Text style={styles.topicText}>{item.topic}</Text>
              </View>
          </View>
          <View style={styles.buttonsContainer}>
              <Button
                  icon="check"
                  mode="contained"
                  onPress={acceptBubbleInvitation(item.id)}
                  compact
                  style={styles.button} children={null}
                  />
              <Button
                  icon="close"
                  mode="contained"
                  onPress={declineBubbleInvitation(item.id)}
                  compact
                  style={styles.button}
                  children={null}
              />
          </View>
      </View>
      <Divider style={styles.divider} />
  </View>
    );
  };

  return (
    <Bubbles bubbles={invitedBubbles} renderItems={renderBubbleInvitation} />
  );
};
const styles = StyleSheet.create({
  container: {
      paddingVertical: 8,
  },
  innerContainer: {
      paddingHorizontal: 20,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  textContainer: {
      justifyContent: 'center',
      marginLeft: 10,
  },
  nameText: {
      fontSize: 16,
      fontWeight: 'bold',
  },
  topicText: {
      fontSize: 14,
      color: 'grey',
  },
  buttonsContainer: {
      flexDirection: 'row',
  },
  button: {
      marginHorizontal: 5,
  },
  divider: {
      marginHorizontal: 30,
      marginVertical: 8,
      backgroundColor: '#E0E0E0',
  },
});

