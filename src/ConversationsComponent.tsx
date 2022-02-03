import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Conversations, IBubble, IConversation } from 'react-native-rainbow-module';

export class ConversationsComponent extends Component {
    constructor(props: any) {
        super(props);
        this.onHandelClickEvent = this.onHandelClickEvent.bind(this);
    }
    public onHandelClickEvent = (conversation: IConversation) => {
        if (conversation.isBubble && conversation.bubble) {
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
    public render() {
        return <Conversations onHandelClickEvent={this.onHandelClickEvent} />;
    }
}
