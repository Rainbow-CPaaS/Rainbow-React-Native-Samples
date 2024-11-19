import React, {FunctionComponent, useEffect, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  IBubble,
  conversationsService,
  IConversation,
  eventEmitter,
  EventType,
  Conversations,
  ConversationCard,
} from 'react-native-rainbow-module';
import {Strings} from '../resources/localization/Strings';
import {NavigationProp} from '@react-navigation/native';
import {CombinedRootStackParamList} from '../Navigation/AppNavigationTypes';

interface IConversationNavigationProps {
  navigation: NavigationProp<CombinedRootStackParamList>;
}
export const ConversationsComponent: FunctionComponent<
  IConversationNavigationProps
> = ({navigation}) => {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  useEffect(() => {
    conversationsService.getConversations();
    const conversationsUpdated = eventEmitter.addListener(
      EventType.ConversationsUpdated,
      (eventData: IConversation[]) => {
        setConversations(eventData);
      },
    );
    return () => {
      conversationsUpdated.remove();
    };
  }, []);

  const onClickItem = (conversation: IConversation) => {
    if (conversation.bubble) {
      const bubble: IBubble = conversation.bubble;
      navigation.navigate('BubbleChatView', {bubble});
    } else {
      navigation.navigate('PeerConversationChatView', {conversation});
    }
  };

  const renderEmptyList = () => {
    return (
      <View style={styles.container}>
      <Text style={styles.noDataMessages}>
          {Strings.noDataFound}
      </Text>
  </View>
    );
  };

  const renderItems = (item: IConversation) => {
    return <ConversationCard conversation={item} onClickItem={onClickItem} />;
  };

  return (
    <Conversations
      conversations={conversations}
      renderItems={renderItems}
      renderEmptyList={renderEmptyList}
    />
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  noDataMessages: {
    textAlign: 'center',
    fontSize: 16,
    color: 'grey',
    margin: 16,
  },
});
