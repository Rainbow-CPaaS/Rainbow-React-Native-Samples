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
    View,
    Text
} from 'react-native';
import { Strings } from '../resources/localization/Strings';
import { IFile, BackArrow } from 'react-native-rainbow-module';

export interface IProps {
    file: IFile
}

export const FileDescription: React.FunctionComponent<IProps> = ({
    file
}) => {


    return (
        <Container>
            <Header hasSegment={true} style={defaultStyle.headerStyle}>
                <Left>
                    <BackArrow />
                </Left>
                <Body>
                    <Title style={defaultStyle.headerTitle}>
                        {Strings.Files}
                    </Title>
                </Body>
                <Right />
            </Header>
            <View style={defaultStyle.container} >
                <Text>{file.name}</Text>
                <Text>{file.date}</Text>
                <Text>{file.size}</Text>
                <Text>{file.owner.name}</Text>
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
