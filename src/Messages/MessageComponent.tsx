
import {
  eventEmitter,
  EventType,
  Messages,
  IPeer,
  ICallEvent,
  IMessage,
  IRoomEvent,
  messagesService,
  IMessageType,
  ITyping,
  ChatActions,
  sharedFilesService
} from 'react-native-rainbow-module';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';
import {
  systemMessageView,
  sendingExtraView,
  IStyleSendingExtraView,
  contactsIsTypingView,
  sendingMsgTypesIcon,
  attachIcon,
  selectedAttachedFilesView,
  messageHeaderView,
  repliedMessageView,
  deletedMessageView,
  IStyleHeaderView
} from './CustomizableMsgUI';
import { Actions } from 'react-native-router-flux';
import DocumentPicker from 'react-native-document-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Strings } from './../resources/localization/Strings';
import { Icon } from 'native-base';

interface IMessageComponentProps {
  peer: IPeer,
}
// you can add what ever option as you want
enum IMessageOption {
  Copy = 'Copy Text',
  Forward = 'Forward',
  Reply = 'Reply',
  Delete = 'Delete',
  Cancel = 'Cancel',
  Download = 'Download file'
}

export enum Attached {
  Capture = 'Capture',
  ImageLibrary = 'ImageLibrary',
  FilesLibrary = 'FilesLibrary'
}

export interface IAttachedFile {
  uri: string;
  type: Attached;
}

export const MessageComponent: React.FunctionComponent<IMessageComponentProps> = (props: IMessageComponentProps) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [onTypingList, setOnTypingList] = useState<ITyping[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<IAttachedFile[]>([]);
  const [downloadedFileIds, setDownloadedFileIds] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>();
  const [showAttachedLoader, setShowAttachedLoader] = useState<boolean>(false);

  useEffect(() => {
    const onMessagesUpdatedEvent = eventEmitter.addListener(
      EventType.MessagesUpdated,
      (eventData: IMessage[]) => {
        setMessages(eventData);
        // mark as read for any new incoming msg
        messagesService.messagesMarkedASReadInActiveConversation(props.peer.jId);
      }
    );
    const onIsTyping = eventEmitter.addListener(EventType.IsTyping, (eventData: ITyping[]) => {
      setOnTypingList(eventData);
    });
    const uploadFilesResult = eventEmitter.addListener(
      EventType.FileAttachFinished,
      (eventData: { isSuccess: boolean, uri: string, errorMsg?: string }) => {
        const filteredFilesToUpload = filesToUpload.filter((item: IAttachedFile) => item.uri !== eventData.uri);
        setFilesToUpload(filteredFilesToUpload);
        if (eventData.isSuccess === false) {
          Alert.alert(Strings.failedToDownload, eventData.errorMsg);
        }
      }
    );
    const downloadResult = eventEmitter.addListener(
      EventType.FileDownloadFinished,
      (eventData: { isSuccess: boolean, fileId: string, errorMsg?: string }) => {
        const filteredIds = downloadedFileIds.filter((id: string) => id !== eventData.fileId);
        setDownloadedFileIds(filteredIds);
        if (eventData.isSuccess === false) {
          Alert.alert(Strings.failedToDownload, eventData.errorMsg);
        }
      }
    );
    return () => {
      onMessagesUpdatedEvent.remove();
      onIsTyping.remove();
      uploadFilesResult.remove();
      downloadResult.remove();
    }
  }, [downloadedFileIds, filesToUpload, props.peer.jId]);

  const resetToDefault = () => {
    setSelectedMessage(undefined);
  }

  const onLongPress = (context: any, message: IMessage) => {
    const options: IMessageOption[] = [IMessageOption.Reply, IMessageOption.Forward, IMessageOption.Copy];
    if (message.fileDescriptorId) {
      // Incase the message obj have a `fileDescriptorId` this means this msg have file or image!
      options.push(IMessageOption.Download);
    }
    if (message.isSent) {
      // Show delete option only for the sent msg
      options.push(IMessageOption.Delete);
    }
    // Make the cancel option the last one
    options.push(IMessageOption.Cancel);
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex: number) => {
        switch (options[buttonIndex]) {
          case IMessageOption.Copy:
            Clipboard.setString(message.text);
            break;
          case IMessageOption.Download:
            // set the downloaded file Ids so you can show the loader on the message
            downloadedFileIds.push(message.fileDescriptorId);
            setDownloadedFileIds([...downloadedFileIds]);
            sharedFilesService.downloadFile(message.fileDescriptorId);
            break;
          case IMessageOption.Forward:
            if (Actions.currentScene !== 'ForwardedView') {
              Actions.ForwardedView({ selectedMessage: message });
            }
            break;
          case IMessageOption.Reply:
            // set message type to be replied
            message.msgType = IMessageType.Replied;
            setSelectedMessage(message);
            break;
          case IMessageOption.Delete:
            messagesService.deleteMessage(message._id);
            break;
          default:
            break;
        }
      }
    );
  }

  const renderSystemMessage = (currentMessage: IMessage) => {
    const conference = currentMessage.conference;
    const call: ICallEvent = currentMessage.call;
    const roomEvent: IRoomEvent = currentMessage.roomEvent;
    if (conference) {
      return systemMessageView(conference.msgContent);
    }
    else if (call) {
      return systemMessageView(call.msgContent);
    }
    else if (roomEvent) {
      return systemMessageView(roomEvent.msgContent);
    }
    else {
      return;
    }
  }

  const renderMessageFileImage = (currentMessage: IMessage) => {
    const image = currentMessage.image;
    const downloadedId = downloadedFileIds.find(id => id === currentMessage.fileDescriptorId);
    const showLoadingIndicator = downloadedId !== undefined;
    return (
      <View >
        {currentMessage.image === 'icon' ?
          <Icon
            name="ios-document"
            style={defaultStyle.msgDocument}
          />
          :
          <ImageBackground
            style={defaultStyle.ImageBackground}
            resizeMode={'contain'}
            source={{ uri: image }}
          />
        }
        {showLoadingIndicator && <ActivityIndicator size="large" color="#808080" style={defaultStyle.downloadingLoader} />}
      </View>
    );
  }

  const renderChatActions = () => {
    return <React.Fragment>
      <ChatActions
        containerStyle={defaultStyle.msgTypeActionContainerStyle}
        icon={sendingMsgTypesIcon}
        options={{
          'Important msg': () => {
            const msg = {
              msgType: IMessageType.Important
            }
            setSelectedMessage(msg);
          },
          'Information msg': () => {
            const msg = {
              msgType: IMessageType.Information
            }
            setSelectedMessage(msg);
          },
          Cancel: () => {
            console.log('Cancel');
          },
        }}
      />
      <ChatActions
        containerStyle={defaultStyle.attachActionContainerStyle}
        icon={attachIcon}
        options={{
          'Attach Image': () => {
            openAttached(Attached.ImageLibrary)
          },
          'Attach Files': () => {
            openAttached(Attached.FilesLibrary)
          },
          'Open Camera': () => {
            openAttached(Attached.Capture)
          },
          Cancel: () => {
            console.log('Cancel');
          },

        }}
      />
    </React.Fragment>
  };


  const openAttached = async (type: Attached) => {
    switch (type) {
      case Attached.FilesLibrary:
        try {
          const results = await DocumentPicker.pickMultiple({
            type: [DocumentPicker.types.allFiles],
          })
          for (const res of results) {
            if (res.uri) {
              const fileType = res.type === DocumentPicker.types.images ? Attached.ImageLibrary : Attached.FilesLibrary;
              const fileObj: IAttachedFile = { uri: res.uri, type: fileType }
              filesToUpload.push(fileObj)
              setFilesToUpload([...filesToUpload]);
            }
          }
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
          } else {
            console.error(`openAttached ERROR: ${err}`)
          }
        }
        break;
      case Attached.Capture:
        launchCamera({
          saveToPhotos: true,
          mediaType: 'photo',
          includeBase64: false,
        }, response => {
          if (response.assets) {
            response.assets.map((uri) => {
              if (uri.uri) {
                const fileObj: IAttachedFile = { uri: uri.uri, type: Attached.ImageLibrary }
                filesToUpload.push(fileObj)
                setFilesToUpload([...filesToUpload]);
              }
            });
          }
        }
        );
        break;

      case Attached.ImageLibrary:
        launchImageLibrary({
          quality: 1.0,
          selectionLimit: 0,
          mediaType: 'mixed',
          includeBase64: false,
        }, response => {
          if (response.assets) {
            response.assets.map((uri) => {
              if (uri.uri) {
                const fileObj: IAttachedFile = { uri: uri.uri, type: Attached.ImageLibrary }
                filesToUpload.push(fileObj)
                setFilesToUpload([...filesToUpload]);
              }
            });
          }
        }
        );
        break;
    }
  }

  const cancelUpload = (file: IAttachedFile) => () => {
    const remainingFiles = filesToUpload.filter((item: IAttachedFile) => item.uri !== file.uri);
    setFilesToUpload([...remainingFiles])
  };

  const renderSendingExtraView = () => {
    // show a custom view for the selected message type to Send
    if (selectedMessage) {
      switch (selectedMessage.msgType) {
        case IMessageType.Replied:
          return sendingExtraView(selectedMessage.user.name, resetToDefault, repliedViewStyle, selectedMessage.text,);
        case IMessageType.Information:
          return sendingExtraView('Send Information...', resetToDefault, infoMsgViewStyle);
        case IMessageType.Important:
          return sendingExtraView('Send Important...', resetToDefault, importantMsgViewStyle);
      }
    }
    // show all the contacts whose is Typing in conversation
    if (onTypingList.length > 0) {
      return contactsIsTypingView(onTypingList);
    }
    // show files To Upload
    if (filesToUpload.length > 0) {
      return selectedAttachedFilesView(filesToUpload, showAttachedLoader, cancelUpload);
    }
    return;
  }

  const renderMessageCustomView = (currentMessage: IMessage) => {
    switch (currentMessage.msgType) {
      case IMessageType.Important:
        return messageHeaderView('warning', importantHeaderViewStyle, currentMessage.msgType);

      case IMessageType.Information:
        return messageHeaderView('ios-information-circle-outline', infoHeaderViewStyle, currentMessage.msgType);

      case IMessageType.Forwarded:
        return messageHeaderView('ios-arrow-forward-circle-outline', forwardHeaderViewStyle, currentMessage.msgType);

      case IMessageType.Deleted:
        return deletedMessageView();

      case IMessageType.Replied:
        const filterMessage: IMessage[] = messages.filter(data => data._id === currentMessage.associatedMsgId);
        if (filterMessage.length > 0) {
          return repliedMessageView(filterMessage[0].text, filterMessage[0].user.name, null);
        }
        break;
    }
    return null;
  }

  const onSend = (message: IMessage) => {
    if (selectedMessage?.msgType === IMessageType.Replied) {
      message.associatedMsgId = selectedMessage?._id;
      messagesService.replyMessage(message);
    }
    // Do not send any, incase there is NO attach or text to send
    else if (filesToUpload.length > 0 || message.text.length > 0) {
      if (filesToUpload.length > 0) {
        setShowAttachedLoader(true);
      }
      message.msgType = selectedMessage?.msgType ?? IMessageType.Default;
      const fileUriArray = filesToUpload.map((item: IAttachedFile) => item.uri);
      messagesService.sendMessage(message, fileUriArray);
    }
    resetToDefault();
  }

  return (
    <Messages
      conversation={props.peer}
      messages={messages}
      onSend={onSend}
      onMessageLongPressed={onLongPress}
      renderSystemMessage={renderSystemMessage}
      renderSendingExtraView={renderSendingExtraView}
      renderChatActions={renderChatActions}
      renderMessageCustomView={renderMessageCustomView}
      renderMessageImage={renderMessageFileImage}
    // renderSendButton={()=><Icon name='send' />}
    />
  );
}

const repliedViewStyle: IStyleSendingExtraView = StyleSheet.create({
  containerStyle: { padding: 10, backgroundColor: '#fdeed9', borderRadius: 10 },
  textStyle: { color: '#e3902b', fontWeight: 'bold', fontSize: 15 },
  msgStyle: { fontSize: 15 },
});
const infoMsgViewStyle: IStyleSendingExtraView = StyleSheet.create({
  containerStyle: { backgroundColor: '#cae1fb', minHeight: 40, padding: 10 },
  textStyle: { color: '#3f8df5' },
});
const importantMsgViewStyle: IStyleSendingExtraView = StyleSheet.create({
  containerStyle: { backgroundColor: '#f9d38b', minHeight: 40, padding: 10 },
  textStyle: { color: '#c85c2c' },
});
const importantHeaderViewStyle: IStyleHeaderView = StyleSheet.create({
  containerStyle: { backgroundColor: '#f9d38b', borderRadius: 10, width: '100%', alignContent: 'center', flexDirection: 'row', padding: 5 },
  iconStyle: { color: '#c85c2c' },
  textStyle: { color: '#c85c2c', fontSize: 15, paddingTop: 10, paddingBottom: 10 }
});
const infoHeaderViewStyle: IStyleHeaderView = StyleSheet.create({
  containerStyle: { backgroundColor: '#cae1fb', borderRadius: 10, width: '100%', alignContent: 'center', flexDirection: 'row', padding: 5 },
  iconStyle: { color: '#3f8df5' },
  textStyle: { color: '#3f8df5', fontSize: 15, paddingTop: 10, paddingBottom: 10 }
});
const forwardHeaderViewStyle: IStyleHeaderView = StyleSheet.create({
  containerStyle: { backgroundColor: 'gray', borderRadius: 10, width: '100%', alignContent: 'center', flexDirection: 'row', padding: 5 },
  iconStyle: { color: 'white' },
  textStyle: { color: 'white', fontSize: 15, paddingTop: 10, paddingBottom: 10 }
});

const defaultStyle = StyleSheet.create({
  msgTypeActionContainerStyle: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 0, marginLeft: 4, marginRight: 4 },
  attachActionContainerStyle: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 0, marginLeft: -15 },
  filesToUploadContainer: { backgroundColor: '#DCDCDC', minHeight: 40, padding: 10, flexDirection: 'row' },
  msgDocument: { margin: 20, fontSize: 50, color: 'red' },
  ImageBackground: { width: '100%', aspectRatio: 1, height: undefined },
  downloadingLoader: { position: 'absolute', top: '50%', left: '50%' },
});