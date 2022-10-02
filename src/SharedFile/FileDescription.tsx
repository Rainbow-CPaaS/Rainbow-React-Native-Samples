import {
    Container,
    Title,
} from 'native-base';
import React, { } from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import { Strings } from '../resources/localization/Strings';
import { Header, IFile } from 'react-native-rainbow-module';

export interface IProps {
    file: IFile
}

export const FileDescription: React.FunctionComponent<IProps> = ({
    file
}) => {
    console.log(file.name + " " + file.viewers.length)

    const renderBodyHeader = () => {
        return <Title style={defaultStyle.headerTitle}> {Strings.Files}</Title>;
    }
    return (
        <Container>
            <Header containerStyle={defaultStyle.headerStyle} centerComponent={renderBodyHeader} />
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
