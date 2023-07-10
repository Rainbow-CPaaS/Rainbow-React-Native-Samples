
import { Center, Text } from 'native-base';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { IBubble, conversationsService, IConversation, eventEmitter, EventType, Conversations, ConversationCard } from 'react-native-rainbow-module';
import { Strings } from '../resources/localization/Strings';
import { NavigationProp } from '@react-navigation/native';
import { CombinedRootStackParamList } from '../Navigation/AppNavigationTypes';

interface IConversationNavigationProps {
  navigation: NavigationProp<CombinedRootStackParamList>;
}
export const ConversationsComponent: FunctionComponent<IConversationNavigationProps> = ({navigation}) => {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  useEffect(() => {
    conversationsService.getConversations();
    const conversationsUpdated = eventEmitter.addListener(
      EventType.ConversationsUpdated,
      (eventData: IConversation[]) => {
        setConversations(eventData);
      }
    );
    return () => {
      conversationsUpdated.remove();
    };
  }, []);

  const onClickItem = (conversation: IConversation) => {
    if (conversation.bubble) {
      const bubble: IBubble = conversation.bubble
      navigation.navigate('BubbleChatView',{bubble});
    }
    else {
      navigation.navigate('PeerConversationChatView',{conversation});
    }
  };

  const renderEmptyList = () => {
    return (
      <Center>
        <Text style={defaultStyle.NoDataMessages}>
          {Strings.noDataFound}
        </Text>
      </Center>
    );
  }

  const renderItems = (item: IConversation) => {
    return <ConversationCard conversation={item} onClickItem={onClickItem} />
  }

  return (
    <Conversations
      conversations={conversations}
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