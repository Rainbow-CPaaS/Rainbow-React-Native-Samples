import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle, Image, ActivityIndicator } from 'react-native';
import { ImageHolder, ITyping } from 'react-native-rainbow-module';
import { IAttachedFile } from './MessageComponent';
import fileLogo from '../resources/images/attachedFile.png';
import { Strings } from './../resources/localization/Strings';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import Icon from 'react-native-vector-icons/Ionicons';
export interface IStyleSendingExtraView {
    containerStyle: ViewStyle;
    textStyle: TextStyle;
    msgStyle?: TextStyle;
}
export interface IStyleHeaderView {
    containerStyle: ViewStyle;
    textStyle: TextStyle;
    iconStyle: any;
}

export enum Attached {
    Capture = 'Capture',
    ImageLibrary = 'ImageLibrary',
    FilesLibrary = 'FilesLibrary'
}

export const systemMessageView = (msg: string) => (
    <View style={defaultInternalStyle.systemMessageView}>
        <Text style={defaultInternalStyle.systemMessageText}>{msg}</Text>
    </View>
);

export const sendingExtraView = (title: string, onClose: () => void, style: IStyleSendingExtraView, msg?: string,) => (
    <View style={style.containerStyle}>
        <Text style={style.textStyle}>{title}</Text>
        <Text style={style.msgStyle ?? style.textStyle}>{msg}</Text>
        <Icon name="close-circle" style={defaultInternalStyle.closeIconStyle} onPress={onClose} />
    </View>
);

export const contactsIsTypingView = (typingContacts: ITyping[]) => {
    const typingContactsImages = typingContacts.map(({ contact }) => {
        return (
            <ImageHolder
                url={contact.imageURL}
                name={contact.name}
                key={contact.jId}
                style={{
                    thumbnail: defaultInternalStyle.isTypingThumbnail,
                    thumbnailContainer: defaultInternalStyle.thumbnailContainer,
                    imageTextStyle: defaultInternalStyle.imageTextStyle
                }} />);
    });
    return (
        <View style={defaultInternalStyle.isTypingContainer}>
            {typingContactsImages}
            <Text style={defaultInternalStyle.isTypingText}> typing ...</Text>
        </View>
    );
};


export const selectedAttachedFilesView = (filesToUpload: IAttachedFile[], isLoading: boolean, onCancel: (file: IAttachedFile) => () => void) => {
    const files = filesToUpload.map((file) => {
        return (
            <View style={defaultInternalStyle.selectedAttachedFilesContainer} key={file.uri}>
                {!isLoading && <TouchableOpacity onPress={onCancel(file)} style={defaultInternalStyle.cancelUploadIcon}>
                    <Icon name="close-circle" size={30} color="white" />
                </TouchableOpacity>}
                {file.type === Attached.FilesLibrary ? fileAttachedView(file) : imageAttachedView(file)}
                {isLoading && <ActivityIndicator size="large" color="blue" style={defaultInternalStyle.attachedLoading} />}
            </View>
        );
    });

    return (
        <View style={defaultInternalStyle.filesToUploadContainer}>
            <ScrollView horizontal={true} >
                {files}
            </ScrollView>
        </View>
    );
};

export const messageHeaderView = (icon: ReactNode, style: IStyleHeaderView, msgType: string) => {
    return (
        <View style={style.containerStyle}>
            {icon}
            <Text style={style.textStyle}>{msgType}</Text>
        </View>
    );
};
export const sendingMsgTypesIcon = () => (<FontAwesomeIcon style={defaultInternalStyle.msgActionStyle} name="exclamation" />);

export const attachIcon = () => (<EntypoIcon name="attachment" style={defaultInternalStyle.msgActionStyle} />);

const fileAttachedView = (file: IAttachedFile) => {
    const fileName = file.uri.split('/').pop() ?? '';
    return (
        <View>
            <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={defaultInternalStyle.fileLogo}
                source={fileLogo}
                key={file.uri}
            />
            <Text style={defaultInternalStyle.fileName}>{fileName.slice(0, 10) + ' ...'}</Text>
        </View >
    );

};

const imageAttachedView = (file: IAttachedFile) => (
    <View>
        <Image
            resizeMode="cover"
            resizeMethod="scale"
            style={defaultInternalStyle.attachedImage}
            source={{ uri: file.uri }}
            key={file.uri}
        />
    </View >
);
export const deletedMessageView = () => {
    return <View>
        <View style={defaultInternalStyle.deletedMessageView}>
            <Text style={defaultInternalStyle.deletedMessageText}>{Strings.deletedMessage}</Text>
        </View>
    </View> as React.ReactElement;
};

export const repliedMessageView = (msg: string, user: string, anyProps: any) => {
    return <View>
        <View style={defaultInternalStyle.repliedMessageView}>
            <Text style={defaultInternalStyle.repliedMessageUser}>{user}</Text>
            <Text style={defaultInternalStyle.repliedMessageText}>{msg}</Text>
        </View>
        {anyProps}
    </View> as React.ReactElement;
};

const defaultInternalStyle = StyleSheet.create({
    isTypingThumbnail: { width: 25, height: 25, borderRadius: 15, marginLeft: 2 },
    isTypingText: { alignSelf: 'center' },
    isTypingContainer: { flexDirection: 'row', padding: 2 },
    thumbnailContainer: { width: 25, height: 25, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginLeft: 2 },
    imageTextStyle: { fontSize: 10, color: 'white', },
    msgActionStyle: { fontSize: 35, color: '#3f8df5' },
    selectedAttachedFilesContainer: { flexDirection: 'column', width: 100, height: 100, alignItems: 'center', marginEnd: 10 },
    cancelUploadIcon: { position: 'absolute', top: -2, right: 0, zIndex: 1 },
    fileLogo: { width: 80, height: 80 },
    fileName: { fontSize: 12 },
    attachedImage: { width: 100, height: 100, marginEnd: 10 },
    systemMessageView: { justifyContent: 'center', alignItems: 'center', margin: 5 },
    systemMessageText: { fontSize: 12, color: '#C0C0C0' },
    closeIconStyle: { color: 'gray', position: 'absolute', top: -10, right: 0, fontSize: 30 },
    filesToUploadContainer: { backgroundColor: '#DCDCDC', minHeight: 40, padding: 10, flexDirection: 'row' },
    deletedMessageView: { padding: 10, borderRadius: 10 },
    deletedMessageText: { color: '#C0C0C0', fontWeight: 'bold', fontSize: 15 },
    repliedMessageView: { padding: 10, backgroundColor: '#fdeed9', borderRadius: 10 },
    repliedMessageUser: { color: '#e3902b', fontWeight: 'bold', fontSize: 15 },
    repliedMessageText: { fontSize: 15 },
    attachedLoading: { position: 'absolute', top: '20%', left: '30%' },
});