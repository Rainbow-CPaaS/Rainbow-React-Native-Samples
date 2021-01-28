import React, { FunctionComponent } from 'react';
import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Bubbles, CreateBubble, BubbleErrorCode, IBubble, Strings, Conversations } from 'react-native-rainbow-module';

export const BubblesComponent: FunctionComponent = () => {
    const onItemClick = (actionName: string, bubble?: IBubble) => {
        if (Actions.currentScene !== actionName) {
            console.log('onItemClick', actionName)
            Actions[actionName]({
                conversation: bubble,
                isBubble: true
            });
        }
    };
    return <Bubbles allBubbles={true} myBubbles={true} onItemClick={onItemClick} />;

};

export const CreateBubbleComponent: FunctionComponent = () => {
    const handelBubbleCreationAction = (actionName: string, result: BubbleErrorCode) => {
        if (result != null) {
            const errorMsg = result as keyof typeof BubbleErrorCode;
            Alert.alert('Failure', Strings.BubblesStrings[errorMsg]);
        } else {
            Actions.pop();
        }
    };
    return <CreateBubble onBubbleCreationResult={handelBubbleCreationAction} />;
};
