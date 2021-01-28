import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Conversations, IConversation } from 'react-native-rainbow-module';

export class ConversationsComponent extends Component {
    constructor(props: any) {
        super(props);
        this.onHandelClickEvent = this.onHandelClickEvent.bind(this);
    }
    public onHandelClickEvent = (conversation: IConversation) => {
        Actions.messages({ conversation, isBubble: conversation.isBubble });
    };
    public render() {
        return <Conversations onHandelClickEvent={this.onHandelClickEvent} />;
    }
}
