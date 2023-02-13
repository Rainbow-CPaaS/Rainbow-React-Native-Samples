# CHANGELOG SDK for React-Native

---

Here is the list of the changes and features provided by the **Rainbow-React-Native-SDK**
All notable changes to Rainbow-React-Native-SDK will be documented in this file.

## [1.4.0] - 2023-2-13

---
**API Changes:**

- Add new param `mainActivity.class` to `RainbowPackage.setApplication()` method in MainApplication class.
- Remove `intent` param form `NotificationHandler` constructor.

**Fixes:**

- Fix invalid date issue in bubble and P2P conversations.
- Fix typo error in authentication result event name in ios.
- Fix issue that notification is not clickable.
- Fix keyboard closed when tabbing on TextInput on login screen issue.
- Fix local video gets merged with the other video issue.
- Fix mute/unMute issue pn peer tp peer webrtc calls.
- Fix issue add/remove button is not synched with the invite/remove contact result.
- Fix user presence is not consistent when user changes his presence from web.
- Fix add contact to my network button is not working on conversation chat view.

**Other Changes:**

- Update React-native version to 0.70.0 and solve the break changes[React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/?from=0.65.0&to=0.70.0)

- Add patch file for [react-native-router-flux+4.3.1.patch](https://github.com/Rainbow-CPaaS/Rainbow-React-Native-Samples/tree/main/patches) to fix incompatibility issue with the new RN version :
- Update node, npm and metro version.
- update native-base version to 3.4.19.


## [1.3.3] - 2022-12-14

---
**API Changes:**

- Add new boolean property  `amIconnected ` to [IBubble](https://developers.openrainbow.com/doc/sdk/reactnative/api/IBubble) to check if the connected user is connected to the active conference call.

**Fixes:**

- The contact's presence is not updated in the conversations list.

**Other Changes:**

- Upgrade the Rainbow Android SDK to version 2.22.0 and solve all the break changes.
- Upgrade all third-party libraries versions to the latest in [sample code on GitHub](https://github.com/Rainbow-CPaaS/Rainbow-React-Native-Samples/blob/main/package.json).

## [1.3.2] - 2022-10-6

---

**Other Changes:**

- Add new method `renderCustomMessageContainer = (messageProps: CustomMessageContainerProps<IMessage>)` to [Messages component](https://github.com/Rainbow-CPaaS/Rainbow-React-Native-Samples/blob/main/src/Messages/MessageComponent.tsx) to custom the style of standard message container.

## [1.3.1] - 2022-10-5

---

**Other Changes:**

- Add new props to [Messages component](https://github.com/Rainbow-CPaaS/Rainbow-React-Native-Samples/blob/main/src/Messages/MessageComponent.tsx) to custom the background and container style of standard message date/Time .
  - New method `renderCustomTime:(Props: MessageTimeProps<IMessage>)=>;` to custom container background and the text style for the message time.
  - New prop `renderCustomTime:TextStyle` to custom container background and the text style for the message date.

## [1.3.0] - 2022-10-2

---

**API Changes:**

- [user Profile Service]: adding new method `updateUserInfo(updateUserRequest: IUpdateUserQuery):void` to update the connected user information. check docs here [managing profile](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/tutorials/managing_personal_profile).and [sample code](https://github.com/Rainbow-CPaaS/Rainbow-React-Native-Samples/tree/main/src/MyProfile) for more info.
- Adding new props to [IUser](https://developers.openrainbow.com/doc/sdk/reactnative/api/IUser) obj:

  - `isAllowedToModifyProfileInfo`: to check if the user is allowed to update his profile.
  - `isAllowedToChangePresence`: to check if the user is allowed to update his presence.
  - `IUpdateUserQuery`:interface for the query obj that contains the user profile info you want to update.
  - `IServicePlane`: enum for the account license type.

- Add new `fileType`prop to [IMessage](https://developers.openrainbow.com/doc/sdk/reactnative/api/IMessage#IMessageType) interface to indicate the file type associated with a message.

- **Break Changes:**
  - update all the buttons and make its icons customizable, by providing users the option to pass their own icon
    as png or any type they want.

**Other Changes:**

- Add a new `<Header />`common component, and expose the styles and content props to make it customizable.
- Add new method `renderMessageText` to custom the standard message font style.See[MessageComponent](https://github.com/Rainbow-CPaaS/Rainbow-React-Native-Samples/blob/main/src/Messages/MessageComponent.tsx)

## [1.2.0] - 2022-8-15

---

**API Changes:**

- [SharedFile Services]: Android ONLY, adding new method `uploadFileToMyRainbowSharing`.
- [Messages Services]: handle sending urgency, by replacing `sendMessage(message: IMessage, attachedFileUri:string[])` to `sendMessage(message: IMessage, urgency: string, attachedFileUri: string[]): void`.
- [Messages Services]: adding send message with additional content: `sendMessageWithAdditionalContentAndUrgency(conversationJid: string,text: string, additionalCont?: string,additionalContType?: string, urgency?: IUrgencyType): void`.

**Break Changes:**

- Refactor [IMessage](/doc/sdk/reactnative/api/IMessage), by adding new props: `urgency`, `alternativeContent`,`isDeleted`, `isForwarded`, `isReplied`, remove: `system` flag, change `msgType` contents types.
- Refactor connected user type: [IUser](/doc/sdk/reactnative/api/IUser), by adding new props: `servicePlane` and `language` and replacing the `name`,`imageURL`, `presence` with [IContact](/doc/sdk/reactnative/api/IContact) object.
- Move method `getConnectedUser` from the `authService` and added it to `userProfileService`.
- Remove `EventType.ConnectedUserPresenceUpdated`, and make `EventType.ConnectedUserUpdated` trigger for any changes occurs in the connected user, including the user presence.
- adding new mandatory props to `<SharedFiles .../>` component: `sharedFileArray: IFile[]` and `isLoading: boolean`.

**Other Changes:**

- remove `mediaType` from [IRoomConfEndPoint](https://developers.openrainbow.com/doc/sdk/reactnative/api/IBubble#IRoomConfEndPoint).
- [iOS] sorting the conversation list according to the last update date.
- [Example App Side]: adding how to sort the shared files, either by date, name, size.
- Update the `Android SDK` version from 2.18.1 to 2.19.0.
- [Fix Notification]: can't open the currently active call from the notification panner.

## [1.1.0] - 2022-7-25

---

**API Changes:**

- Add new property `activeSpeaker?: IContact` to get the current active talker in [IConference](/doc/sdk/reactnative/api/CallTypes).
- Add new method `fetchAllSharedFilesInPeer(peerJid: string, isBubble: boolean): void` to fetch all shared files (sent and received) in bubble and conversation. check [Shared files](https://developers.openrainbow.com/doc/sdk/reactnative/api/SharedFilesService).
- Expose shared file info( name, size, and the file viewers ) in [IFile](https://developers.openrainbow.com/doc/sdk/reactnative/api/IFile)
- Add a new property to the IConference object: `(isSharingEnabled: boolean, sharingParticipant?: IConferenceParticipants)`to get the sharing participant's updates.
- Support previously unsupported features by the iOS Rainbow SDK including:

1. custom data for the connected user [`userProfileService.updateCustomData(customData)`]
2. the screen sharing participant in IConference object [`conferenceCall.sharingParticipant`]

**Fixed:**

- Fix a crash when tapping on any contact from the search result list.
- Fix the iOS message menu picker crash.

**Other Changes:**

- Upgrade the Android SDK version from `2.16.0` to `2.18.1`.
- Upgrade iOS SDK from `2.3.0` to `2.4.0`.
- Handle push notifications.
- Refactor `DropDownMenu` component and make it customizable by adding new props: `iconName`, `onSelectItem` and `renderCustomItem`.
- Expose a `renderSendButton` function to customize the "Send" text button with an icon to send messages.
- Expose a style property for the presence icon.
- Make the iOS bubble Id in the `bubble.id` value similar to the Android value result.

## [1.0.2] - 2022-6-28

---

**API Changes:**

- Expose new property `isBot`in [IConversation](/doc/sdk/reactnative/api/IConversation) object to identify one2one bot conversations.

## [1.0.1] - 2022-6-20

---

**Fixed:**

- Fix app crash issue when tapping on any contact from the search result list

## [1.0.0] - 2022-5-30

---

**API Changes:**

- Upgrade Android SDK version 2.15.0
- Export a couple of a common components used in react-native-rainbow-module :`Timer`and `ImageHolder`.
- Update the example code to give more details on managing webrtc and Conference Calls. check [Sample Code](https://github.com/Rainbow-CPaaS/Rainbow-React-Native-Samples/tree/main/src/Calls).

**API Breaking changes:**

Conference and Audio/Video webRTC calls:

- Adding customizable call components for all the call types (conference, peer-to-peer call). check [retrieve calls](https://developers.openrainbow.com/doc/sdk/reactnative/tutorials/retrieve_calls).
- Provide a new `IP2P`, `IConference`, `IPBX`, and generic `ICall<T>` Interfaces types for webRTC, conference, and PBX calls. check [CallTypes](/doc/sdk/reactnative/api/CallTypes)
- Provide a new components that handle the Local video, screen-sharing, and remote video in webrtc calls. check [managing webRTC calls](/doc/sdk/reactnative/tutorials/managing_webrtc_calls).
- Add new props to webRTC call view component to allow the user to customize the incoming, outgoing, and active call view based on his app needs. check [managing webRTC calls](/doc/sdk/reactnative/tutorials/managing_webrtc_calls).
- Add new props to the WebrtcConference call view component to allow the user to customize the participant's view, and call view based on the call state( incoming, active, outgoing). check [managing webRTC calls](/doc/sdk/reactnative/tutorials/managing_conferences).
- Export `ParticipantConferenceView` component to allow user to customize the view of the conference participants.
- Provide a reusable components buttons for all the call actions and allow the user to customize the button icon and style

**Fixed:**

- Fix issues with join conference.
- Fix issue with the speaker button.
- Fix issue when adding video to webRTCConference call.

## [0.3.11] - 2022-4-7

**API Changes:**

- Add new API lock/ unlock conference, please check docs in Rainbow API HUB [Managing Conferences](/doc/sdk/reactnative/tutorials/managing_conferences).

## [0.3.10] - 2022-3-9

---

**API Changes:**

- Show the incoming screen sharing for P2P and conference call.
- Show the screen sharing publisher in conference call [only Android].
- Add enable/disable local video in P2P call.

**Fixed:**

- Fixing crash occurs when switching mobile to the 'Landscape' position.
- Fixing wrong active conference call view, where its some time shows as incoming call, not active call!.
- Fixing not showing the participant video stream, while joining conference.
- Fixing time restart in [P2P, Conference] call, when peer call enable/disable his remote video [IOS].

**Other Changes:**

- Upgrade Android SDK version from `2.11.0-beta1` to `2.12.0-beta2`.
- Upgrade IOS SDK version from `2.2.0` to `2.3.0`.
- Adding `GetConferenceScreenSharingUpdate` event to listen for Conference Screen Sharing changes.
- Adding props `wasInitiatedWithShare`, `videoRemoteStreamCount`, `isLocalVideoEnabled` in [ICall](/doc/sdk/reactnative/api/ICall), and remove `isRemoteVideoCall`.
- Create `ShareConferenceView` component.

## [0.3.9] - 2022-2-17

---

**Breaking Changes:**

- Refactor the `Bubbles` component so it can be customizable easily by the user side, please check docs in Rainbow API HUB [Bubbles Component](/doc/sdk/reactnative/tutorials/BubblesComponent).
- Refactor the `Conversations` component so it can be customizable easily by the user side, please check docs in Rainbow API HUB [Retrieve Conversation](/doc/sdk/reactnative/tutorials/retrieve_conversations).

**Added:**

- Adding new item `WithBadge` for customized tab badges, where you can check how to use it by this example: [BubbleInvitationBadge](https://github.com/Rainbow-CPaaS/Rainbow-React-Native-Samples/tree/main/src/Bubbles/BubblesComponent.tsx).
- Adding [ConversationCard](/doc/sdk/reactnative/tutorials/retrieve_conversations#ConversationCard).

**Fixed:**

- Fixing Can't Opening the downloaded files for Android version >= 11.
- Un mute participant get stuck.
- Fixing Contact Presence not synced in the call Logs.
- Fixing the Bubble Message View is not synced when edit bubble.
- Fixing edit bubble is not synced in both conversations and bubbles list.

**Other Changes:**

- Remove `getMyBubbles` with the associated event `MyBubblesUpdated` in [Bubble Services](/doc/sdk/reactnative/api/BubbleServices), where you can use `getBubbles` instead and filter them by `isMyUserOwner` flag.
- Rename callback props `onBubbleCreationResult` From `(actionName: string,creationResult: BubbleErrorCode)` to `(creationResult: BubbleErrorCode)` in [CreateBubble Component](/doc/sdk/reactnative/tutorials/BubblesComponent).

## [0.3.8] - 2022-1-27

---

**Breaking Changes:**

- Refactor the `Message` component so it can be customizable easily by the user side, please check docs in Rainbow API HUB [MAKE AN IM CONVERSATION](/doc/sdk/reactnative/tutorials/make_im_conversation).

**Other Changes:**

- Rename `sent` prop in [IMessage](/doc/sdk/reactnative/api/IMessage) to `isSent`
- Change `onItemClick: (actionName: string, data?: IBubble) => void` to `onItemClick: (data?: IBubble) => void` in [Bubbles](/doc/sdk/reactnative/tutorials/bubbles) component.
- Adding [Contact Services](/doc/sdk/reactnative/api/ContactServices);
- Adding [Message Services](/doc/sdk/reactnative/api/MessageServices);
- Adding [Conversation Services](/doc/sdk/reactnative/api/ConversationServices);
- Adding [Conference Services](/doc/sdk/reactnative/api/ConferenceServices);

## [0.3.7] - 2022-1-6

---

**API Changes:**

- Add new API `createAutoAcceptedBubble(name: string, topic: string)` to create an auto accept bubble, check docs in Rainbow API HUB [BubbleServices](/doc/sdk/reactnative/tutorials/BubbleServices).
- Add new API `inviteParticipantToBubble(bubbleId: string, contactJid: string, asModerator: string, withInvitation: string )` to invite a participant as a moderator or a member, with an option to send an invite or not, check docs in Rainbow API HUB [BubbleParticipants](/doc/sdk/reactnative/tutorials/BubbleParticipants).
- Add new API `getBubbleById(bubbleId: string)` to fetch a bubble using its Id, check docs in Rainbow API HUB [BubbleServices](/doc/sdk/reactnative/tutorials/BubbleServices).
- Add new API `delegateConference(conferenceRoomId: string, participantId: string)` to transfer the meeting control to another attendee, check docs in Rainbow API HUB [Managing Conferences](/doc/sdk/reactnative/tutorials/managing_conferences).
- Add new bubble event that fires whenever a bubble is updated. It contains only that bubble. `EventType.OnBubbleUpdated` check docs in Rainbow API HUB [BubbleServices](/doc/sdk/reactnative/tutorials/BubbleServices).
  **Fixes:**

- Fix bubble topic in conference object does not exist in IOS side.

**Other Changes:**

- Change bubbles list event name from `EventType.BubblesUpdated` to `EventType.BubblesListUpdated`.

## [0.3.6] - 2021-12-15

---

**API Changes:**

- Add new property `customData` for [IBubble](/doc/sdk/reactnative/api/IBubble) interface which includes customized data added by you to bubble.
- Add new API `promoteContactFromBubble(bubbleId: string, contactJid: string)` to promote a member in a bubble(room) to be an organizer, check docs in Rainbow API HUB [BubbleParticipants](/doc/sdk/reactnative/tutorials/BubbleParticipants).
- Add new API `demoteContactFromBubble(bubbleId: string, contactJid: string)` to demote an organizer in a bubble(room) to be a normal member, check docs in Rainbow API HUB [BubbleParticipants](/doc/sdk/reactnative/tutorials/BubbleParticipants).
- IM: A new property [IsTyping](/doc/sdk/reactnative/api/IMessage#ITyping) has been added in Im module which allows other contacts to know if the current user is composing or not.

**Fixes:**

- Fix organizer can't add participants.
- Fix 'is typing' users are not shown.
- Fix images are not shown on the .net server from IOS side.

**Other Changes:**

- change `promoteOwner(bubbleId: string, contactJid: string)` method name to `giveOwnerShip(bubbleId: string, contactJid: string)` in [BubbleParticipants](/doc/sdk/reactnative/tutorials/BubbleParticipants).

## [0.3.5] - 2021-12-6

---

- API Changes:

- Add new API `hangupParticipantFromConference(bubbleId: string, contactJid: string)` to hang up one of the participants during the conference call, check docs in Rainbow API HUB [BubbleParticipants](/doc/sdk/reactnative/tutorials/BubbleParticipants).
- Add new API `promoteOwner(bubbleId: string, contactJid: string)` to change one of the ownership of the bubble, check docs in Rainbow API HUB [BubbleParticipants](/doc/sdk/reactnative/tutorials/BubbleParticipants).

- Breaking Changes:

- Upgrade Android ALE SDK version to 2.9.2.

- Fixes:

- Fix bugs in the conference incoming call.
- Fix a bug in the Active call panner for P2P calls.
- Fix a bug in showing permission when the first installation.
- Fix a bug in messages.

## [0.3.4] - 2021-11-18

---

- API Changes:

- Add new api `BubbleParticipants.removeContactFromBubble(bubbleId:string, contactJid:string)` for remove contact from a bubble, check docs in Rainbow API HUB [BubbleParticipants](/doc/sdk/reactnative/tutorials/BubbleParticipants).
- Add new property `roomEvent` for [IMessage](/doc/sdk/reactnative/api/IMessage) interface to indicate if the message contains a room event (new invitation, leave and join bubble).
- Add new property `conference` for [IMessage](/doc/sdk/reactnative/api/IMessage) interface to indicate if the message contains a webrtc conference event (someone add/remove conference call)

- Other Changes:

- Fix for multiple notifications showing in the top navigation bar issue.
- Handle upload files and show progress bar while uploading/downloading files.
- Fix bug in load more messages.

## [0.3.3] - 2021-11-11

---

- API Changes:

- Show conference call attendees and non attendees.
- Enhancing the conference messages UI when conference is added/ended.
- Fixing duplicate notification in Android side.
- Handle load more messages.
- show activity indicator until the messages is loaded.

## [0.3.2] - 2021-11-1

---

- API Changes:

- Add new service `BubbleCustomData` for update/delete bubble custom data: all you need is to import this service which will provide the following method:

  - `updateCustomDataForBubble(bubbleId: string, customData: {})`
  - `deleteCustomDataForBubble(bubbleId: string)`
  - `getCustomDataFromBubble(bubbleId: string, key: string)`.

- Other Changes:

- Update the version of react native to 0.65.0 in the Sample app.
- Fix null value for bubble profile pic when receiving new conference call.
- Add new bubble topic in `IConference` call object.
- Fix the background color for default Contacts avatar.

## [0.3.1] - 2021-10-21

---

- Update the version of react native to 0.65.0.
- Fixes for the invalid date in chat messages.
- Fixes on join conference when the user is not the owner of the bubbleAdd active Connected.
- UI fixes in conference call view.

## [0.3.0] - 2021-9-27

---

- Add active Connected Call intimation on top of the application.
- Switch between cameras (front and back) during a call.
- Add mute all participants and un mute all participants.
- Make the local video in a conference as separate video;
- Handle sending files in the messages.
- Changing the host name.
- Fixing Bugs.

## [0.2.9] - 2021-9-9

---

- Add the ability to change rainbow server host platform and pass platform specific AppId & AppSecret initialize the SDK module.
- Add the ability to add video into the conference.

## [0.2.8] - 2021-9-5

---

- Add the ability to receive all videos from all publishers in an ongoing conference.
- Get connected conference bubble.

## [0.2.7] - 2021-8-12

- Add joining conference.
- Add pending contact invitation counter flag.
- some UI fixes.

## [0.2.6] - 2021-7-26

- Send conversation by email.
- Delete all conversation messages.
- Allow the connected to change his presence manually.
- Enhancement for attaching files.
- Launch camera for attaching the captured photo.

## [0.2.5] - 2021-6-30

- Bug fixes.
- Update and refactor the documentation.

## [0.2.4] - 2021-6-14

- Managing webRtc conference calls: start, join and end a conference call.
- retrieve the number of pending bubbles invitations.
- Accept/ decline an incoming invitation to a bubble.
- Bug Fixes

## [0.2.3] - 2021-5-24

- Edit bubble information (change name, topics and change avatar)
- Handle leave bubbles.
- Handle delete bubbles.
- Handle archive bubbles.
- Add a new participants to an existing bubble.

## [0.2.1] - 2021-4-26

- Handle the message options: forward,delete and reply.
- Send message with important and information type.
- refactor the processing of Rainbow conversations and bubbles in RN.

## [0.2.0] - 2021-3-15

- Handle push notifications.

## [0.1.9] - 2021-2-23

- update Github links in the npm package.

## [0.1.8] - 2021-2-22

- Handle Back button pressed.
- Fixes for Call History component
- Docs: find alternative way to document interface in typescript
- Setup environment for Automation testing

## [0.1.7] - 2021-1-28

- Fixes for exporting Bubbles and Conversation.
- Fixes for iOS >= 14 compatibility issues.
- search by name for a Rainbow contact.
