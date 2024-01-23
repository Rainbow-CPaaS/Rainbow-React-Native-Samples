
import {
  eventEmitter,
  EventType,
  Messages,
  IPeer,
  ICallEvent,
  IMessage,
  IRoomEvent,
  messagesService,
  ITyping,
  ChatActions,
  sharedFilesService,
  IUrgencyType,
  CustomMessageText,
  MessageTextProps,
  CustomMessageTime,
  MessageTimeProps,
  CustomBubbleContainer,
  CustomBubbleProps
} from 'react-native-rainbow-module';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  ImageBackground,
  StyleSheet,
  TextStyle,
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
import DocumentPicker from 'react-native-document-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Strings } from './../resources/localization/Strings';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text, VStack } from 'native-base';
import {  CombinedRootStackParamList } from '../Navigation/AppNavigationTypes';
import { NavigationProp } from '@react-navigation/native';


interface IMessageComponentProps {
  peer: IPeer,
  navigation: NavigationProp<CombinedRootStackParamList>;
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
        setShowAttachedLoader(false);
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
           props.navigation.navigate('ForwardedView', { message: message });
        
            break;
          case IMessageOption.Reply:
            // set message type to be replied
            message.isReplied = true;
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
            name="document"
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

  const renderActions = () => {
    return <React.Fragment>
      <ChatActions
        containerStyle={defaultStyle.msgTypeActionContainerStyle}
        icon={sendingMsgTypesIcon}
        options={{
          'Important msg': () => {
            const msg = {
              urgency: IUrgencyType.MEDIUM
            }
            setSelectedMessage(msg);
          },
          'Information msg': () => {
            const msg = {
              urgency: IUrgencyType.LOW
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

  const renderIsTypingArea = () => {
    return (onTypingList.length > 0) ? contactsIsTypingView(onTypingList) : null;

  }
  const renderAttachmentArea = () => {
    return filesToUpload.length > 0 ? selectedAttachedFilesView(filesToUpload, showAttachedLoader, cancelUpload) : null;
  }
  const renderRepliedArea = () => {
    return selectedMessage?.isReplied ? sendingExtraView(selectedMessage.user.name, resetToDefault, repliedViewStyle, selectedMessage.text) : null;
  }

  const renderUrgencyArea = () => {
    switch (selectedMessage?.urgency) {
      case IUrgencyType.MEDIUM:
        return sendingExtraView('Send Important...', resetToDefault, importantMsgViewStyle);
      case IUrgencyType.LOW:
        return sendingExtraView('Send Information...', resetToDefault, infoMsgViewStyle);
      case IUrgencyType.HIGH:
        return sendingExtraView('Send Emergency...', resetToDefault, importantMsgViewStyle);
      default:
        return;
    }

  }
  const renderSendingExtraView = () => {
    return (
      <>
        {renderUrgencyArea()}
        {renderRepliedArea()}
        {renderIsTypingArea()}
        {renderAttachmentArea()}
      </>
    )
  }

  const renderMessageCustomView = (currentMessage: IMessage) => {

    const filterMessage: IMessage[] = messages.filter(data => data._id === currentMessage.associatedMsgId)
    const warningIcon = <Icon name="warning" color="#c85c2c" size={25} />;
    const infoIcon = <Icon name="information-circle-outline" size={25} style={infoHeaderViewStyle.iconStyle} />;
    const arrowForwardIcon = <Icon name="arrow-forward-circle-outline" size={25} />;
    return (
      <>
        {currentMessage.urgency === IUrgencyType.MEDIUM ? messageHeaderView(warningIcon, importantHeaderViewStyle, Strings.Important) : null}
        {currentMessage.urgency === IUrgencyType.LOW ? messageHeaderView(infoIcon, infoHeaderViewStyle, Strings.Information) : null}
        {currentMessage.isDeleted ? deletedMessageView() : null}
        {currentMessage.isForwarded ? messageHeaderView(arrowForwardIcon, forwardHeaderViewStyle, Strings.Forwarded) : null}
        {(currentMessage.isReplied && filterMessage.length > 0) ? repliedMessageView(filterMessage[0].text, filterMessage[0].user.name, null) : null}
      </>
    )
  }
  const onSend = (message: IMessage) => {
    if (selectedMessage && selectedMessage.isReplied) {
      message.associatedMsgId = selectedMessage?._id;
      messagesService.replyMessage(message);
    }
    // Do not send any, incase there is NO attach or text to send
    else if (filesToUpload.length > 0 || message.text.length > 0) {
      if (filesToUpload.length > 0) {
        setShowAttachedLoader(true);
      }
      message.urgency = (selectedMessage && selectedMessage.urgency) ?? IUrgencyType.NONE;
      const fileUriArray = filesToUpload.map((item: IAttachedFile) => item.uri);
      messagesService.sendMessage(message, message.urgency, fileUriArray);
    }
    resetToDefault();
  }
  const renderCustomMessageText = (Props: MessageTextProps<IMessage>) => {
    /**
     * This function is used to customize the font style for standard message:
     * You can uncommitted the line 425 to customize the default font style.
     */
    const textStyle: TextStyle = {
      fontSize: 18, fontWeight: 'bold', fontFamily: 'AvenirNext-Regular', color: 'lightgray'
    };
    const linkStyle = { fontSize: 18, color: 'green' };
    const customTextStyle = { color: 'red' } // text style for both messages(left & right)
    const containerStyle = { backgroundColor: 'pink' }

    return (
      <CustomMessageText
        textStyle={{ left: textStyle, right: textStyle }}
        linkStyle={{ left: linkStyle, right: linkStyle }}
        customTextStyle={customTextStyle}
        {...Props} />
    )
  }
  const dateCustomStyle: TextStyle = { color: 'red', fontWeight: 'bold', fontStyle: 'italic', backgroundColor: '#B2D7DA' }

  const renderCustomMessageTime = (Props: MessageTimeProps<IMessage>) => {
    const timeTextStyle: TextStyle = { fontSize: 18, color: 'yellow', fontWeight: 'bold' }

    return (
      <CustomMessageTime timeTextStyle={{ left: timeTextStyle, right: timeTextStyle }} {...Props} />
    )
  }
  
const renderUsername = (props: CustomBubbleProps<IMessage>) => {
  const { previousMessage, currentMessage } = props;

  if (previousMessage?.user && !isCurrentUserMessage(props)) {
    const isSameUserInPrevMessage = previousMessage.user._id === currentMessage?.user._id;
    return !isSameUserInPrevMessage && currentMessage?.user.name;
  }

  return null;
};

const isCurrentUserMessage = (props: CustomBubbleProps<IMessage>) => {
  const { currentMessage, user } = props;
  return currentMessage?.user._id === user?._id;
};

  const renderBubbleContainer = (Props: CustomBubbleProps<IMessage>) => {
    /**
     * wrapperStyle: style of the whole message container(including the bottom time container)
     * containerStyle: message container style, top left and right(without bottom time container)
     * containerToNextStyle: next message container style
     * containerToPreviousStyle: previous  message container style
     * bottomContainerStyle: message time container in the bottom
     *
     *  *Note*: You have to set the borderRadius for each corner separately (e.g. borderBottomRightRadius) ,
     *          setting borderRadius won't work because the borderBottomRightRadius, borderTopRightRadius etc. in the
     *          react-native-gifted-chat code overrides it, since the more exact style (separate for each corner) always
     *          overrides the more general style
     */
    return (
      <VStack >
      <Text style={{ fontSize: 12,marginLeft: 10,fontWeight: 'bold'  }}>{renderUsername(Props)} </Text>
        <CustomBubbleContainer
        {...Props}
        wrapperStyle={{ left: { backgroundColor: '#497EF9' }, right: { backgroundColor: '#B09CF9' } }}
        containerStyle={{ left: { borderRadius: 20 }, right: { borderTopRightRadius: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 } }}
        containerToNextStyle={{ left: { borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }, right: { borderTopRightRadius: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 } }}
        containerToPreviousStyle={{ left: { borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }, right: { borderTopRightRadius: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 } }}
        bottomContainerStyle={{ left: { backgroundColor: '#A569BD', borderTopRightRadius: 40, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }, right: { backgroundColor: 'green', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 } }}
      />
      </VStack>
    )
  }
  return (
    <Messages
      conversation={props.peer}
      messages={messages}
      onSend={onSend}
      onMessageLongPressed={onLongPress}
      renderSystemMessage={renderSystemMessage}
      renderSendingExtraView={renderSendingExtraView}
      renderChatActions={renderActions}
      renderMessageCustomView={renderMessageCustomView}
      renderMessageImage={renderMessageFileImage}
    // dateCustomStyle={dateCustomStyle} // to custom the message time text style
    // renderCustomTime={renderCustomMessageTime} // to custom the system message date
    // renderMessageText={renderCustomMessageText} // custom the text style and text background inside the message container
    // renderBubbleContainer={renderBubbleContainer}
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