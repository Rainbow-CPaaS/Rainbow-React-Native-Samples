import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Strings } from '../resources/localization/Strings';
import { Header, IFile } from 'react-native-rainbow-module';
import fileLogo from '../resources/images/attachedFile.png';
import moment from 'moment';
import { FileDescriptionRouteProp } from '../Navigation/AppNavigationTypes';

export interface IProps {
    route: FileDescriptionRouteProp
}

export const FileDescription: React.FunctionComponent<IProps> = ({
    route,
}) => {
    const [file] = useState<IFile>(route.params.file);

    const renderBodyHeader = () => {
        return< Text style={styles.headerText}>{Strings.Files}</Text>;
    };
    const displayPreview = (imagePreview: string) => {
        if (imagePreview == null)
            {return fileLogo;}
        else
            {return { uri: `data:image/png;base64,${imagePreview}` };}
    };

    return (
        <>
            <Header containerStyle={{ backgroundColor: '#0086CF' }} centerComponent={renderBodyHeader} />
            <View style={styles.container}>
                <Image
                    resizeMode="cover"
                    style={styles.image}
                    source={displayPreview(file.ImagePreview)}
                />
                <Text style={styles.fileName}>{file.name}</Text>
                <Text style={styles.ownerName}>{file.owner.name}</Text>
                <Text style={styles.dateText}>{moment(file.date, 'ddd MMM DD HH:mm:ss YYYY').format('MMM DD, YYYY')}</Text>
                <Text style={styles.sizeText}>{file.size}</Text>
            </View>

        </>
    );
};

const styles = StyleSheet.create({
    headerBgColor: {
        backgroundColor: '#0086CF',
    },
    headerText: {
        color: 'white',
        fontSize: 16,
    },
    container: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    image: {
        width: 60,
        height: 60,
    },
    fileName: {
        fontSize: 16,
        color: 'black',
    },
    ownerName: {
        fontSize: 14,
        color: 'black',
    },
    dateText: {
        fontSize: 14,
        color: 'gray',
    },
    sizeText: {
        fontSize: 12,
        color: 'gray',
    },
});


