import {
    Body,
    Container,
    Header,
    Left,
    Right,
    Title,
} from 'native-base';
import React, { } from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import { Strings } from '../resources/localization/Strings';
import { IPeer, SharedFiles, BackArrow, IFile } from 'react-native-rainbow-module';
import { Actions } from 'react-native-router-flux';

export interface IProps {
    peer: IPeer
}

export const SharedFileComponent: React.FunctionComponent<IProps> = ({
    peer
}) => {

    const renderOnFileClicked = (selectedFile: IFile) => {
        Actions.FileDescription({ file: selectedFile });
    }

    return (
        <Container>
            <Header hasSegment={true} style={defaultStyle.headerStyle}>
                <Left>
                    <BackArrow />
                </Left>
                <Body>
                    <Title style={defaultStyle.headerTitle}>
                        {Strings.showChatFilesTitle}
                    </Title>
                </Body>
                <Right />
            </Header>
            <View style={defaultStyle.container} >
                <SharedFiles peer={peer} onFileItemClicked={renderOnFileClicked} />
            </View>
        </Container>
    );
};




const defaultStyle = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerTitle: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 16,
        color: '#ffffff',
    },
    headerStyle: {
        backgroundColor: '#0086CF'
    },
    fileItemContainer: {
        flexDirection: 'row', margin: 10
    },
    fileItemImage: {
        width: 50, height: 50
    },
    fileItemInfoView: {
        flexDirection: 'column', justifyContent: 'space-between', padding: 10
    },
    fileItemName: { fontSize: 18 },
    fileItemDate: { fontSize: 14, color: 'gray' }

});
