import React, { FunctionComponent } from 'react';
import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { CreateBubble, BubbleErrorCode, Strings } from 'react-native-rainbow-module';


export const CreateBubbleComponent: FunctionComponent = () => {
    const handelBubbleCreationAction = (result: BubbleErrorCode) => {
        if (result != null) {
            const errorMsg = result as keyof typeof BubbleErrorCode;
            Alert.alert('Failure', Strings.BubblesStrings[errorMsg]);
        } else {
            Actions.pop();
        }
    };
    return <CreateBubble onBubbleCreationResult={handelBubbleCreationAction} />;
};
