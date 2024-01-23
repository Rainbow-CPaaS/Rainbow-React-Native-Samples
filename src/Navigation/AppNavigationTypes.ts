import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IBackButtonHandler, IBubble, IConversation, IFile, IPeer, IUser } from 'react-native-rainbow-module';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList as LibraryRootStackParamList } from 'react-native-rainbow-module';


export type AppRootStackParamList = {
  ScreenHome: {registerBackButtonHandler: (handler: IBackButtonHandler) => () => void};
  AppMenu: undefined;
  MyProfileInfo:{connectedUser: IUser}
  UserInfoFrom: {connectedUser: IUser}
  BubbleChatView: {bubble: IBubble}
  SharedFileList: {peer: IPeer}
  PeerConversationChatView: {conversation: IConversation}
  FileDescription: {file: IFile}
  CreateBubble: undefined;
  // other screen definitions go here
};

export type CombinedRootStackParamList = LibraryRootStackParamList & AppRootStackParamList;

export type HomeScreenRouteProp = RouteProp<CombinedRootStackParamList, 'ScreenHome'>;
export type HomeScreenNavigationProp = NativeStackNavigationProp<CombinedRootStackParamList, 'ScreenHome'>;

export type AppMenuNavigationProp = NativeStackNavigationProp<CombinedRootStackParamList, 'AppMenu'>;

export type MyProfileInfoRouteProp = RouteProp<CombinedRootStackParamList, 'MyProfileInfo'>;
export type MyProfileInfoNavigationProp = NativeStackNavigationProp<CombinedRootStackParamList, 'MyProfileInfo'>;

export type UserInfoFromRouteProp = RouteProp<CombinedRootStackParamList, 'UserInfoFrom'>;
export type UserInfoFromNavigationProp = NativeStackNavigationProp<CombinedRootStackParamList, 'UserInfoFrom'>;


export type BubbleChatViewRouteProp = RouteProp<CombinedRootStackParamList, 'BubbleChatView'>;
export type BubbleChatViewNavigationProp = NativeStackNavigationProp<CombinedRootStackParamList, 'BubbleChatView'>;

export type PeerChatViewRouteProp = RouteProp<CombinedRootStackParamList, 'PeerConversationChatView'>;
export type PeerChatViewNavigationProp = NativeStackNavigationProp<CombinedRootStackParamList, 'PeerConversationChatView'>;

export type SharedFileListRouteProp = RouteProp<CombinedRootStackParamList, 'SharedFileList'>;
export type SharedFileListNavigationProp = NativeStackNavigationProp<CombinedRootStackParamList, 'SharedFileList'>;

export type FileDescriptionRouteProp = RouteProp<CombinedRootStackParamList, 'FileDescription'>;

export type CreateBubbleNavigationProp = NativeStackNavigationProp<CombinedRootStackParamList, 'CreateBubble'>;