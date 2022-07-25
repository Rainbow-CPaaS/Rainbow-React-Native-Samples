
import { Content, Text } from 'native-base';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { IBubble, conversationsService, IConversation, eventEmitter, EventType, Conversations, ConversationCard } from 'react-native-rainbow-module';
import { Actions } from 'react-native-router-flux';
import { Strings } from '../resources/localization/Strings';

export const ConversationsComponent: FunctionComponent = () => {
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
      Actions.BubbleChatView({
        bubble
      });
    }
    else {
      Actions.PeerConversationChatView({
        conversation,
      });
    }
  };

  const renderEmptyList = () => {
    return (
      <Content>
        <Text note={true} style={defaultStyle.NoDataMessages}>
          {Strings.noDataFound}
        </Text>
      </Content>
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