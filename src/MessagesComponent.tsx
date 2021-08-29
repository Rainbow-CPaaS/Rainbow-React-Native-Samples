import React, { Component } from 'react';
import { Messages, IConversation, IBubble } from 'react-native-rainbow-module';
import { CallComponent } from './CallComponent';

export interface IProps {
    conversation: IConversation;
    isBubble: boolean;
    bubble: IBubble
}

export class MessagesComponent extends Component<IProps> {
    constructor(props: any) {
        super(props);

    }

    public render() {
        const { conversation, isBubble, bubble } = this.props;
        return <Messages conversation={conversation} isBubble={isBubble} bubble={bubble} callActionsComponent={CallComponent} />;
    }
}
