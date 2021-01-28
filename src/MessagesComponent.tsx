import React, { Component } from 'react';
import { Messages, IConversation } from 'react-native-rainbow-module';

export interface IProps {
    conversation: IConversation;
    isBubble: boolean;
}

export class MessagesComponent extends Component<IProps> {
    constructor(props: any) {
        super(props);

    }

    public render() {
        const { conversation, isBubble } = this.props;
        return <Messages conversation={conversation} isBubble={isBubble} />;
    }
}
