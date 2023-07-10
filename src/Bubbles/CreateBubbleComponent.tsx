import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent } from 'react';
import { Alert } from 'react-native';
import { CreateBubble, BubbleErrorCode, Strings } from 'react-native-rainbow-module';

export const CreateBubbleComponent: FunctionComponent = () => {
    const navigation = useNavigation();

    const handelBubbleCreationAction = (result: BubbleErrorCode) => {
        if (result != null) {
            const errorMsg = result as keyof typeof BubbleErrorCode;
            Alert.alert('Failure', Strings.BubblesStrings[errorMsg]);
        } else {
            navigation.goBack()
        }
    };
    return <CreateBubble onBubbleCreationResult={handelBubbleCreationAction} />;
};
