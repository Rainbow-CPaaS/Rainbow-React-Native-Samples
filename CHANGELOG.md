# CHANGELOG SDK for React-Native

---

Here is the list of the changes and features provided by the **Rainbow-React-Native-SDK**
All notable changes to Rainbow-React-Native-SDK will be documented in this file.

## [1.0.0] - 2022-5-30
---
**API Changes:**
- Upgrade Android SDK version 2.15.0
- Export a couple of a common components used in react-native-rainbow-module :`Timer`and  `ImageHolder`.
- Update the example code to give more details on managing webrtc and Conference Calls. check [Sample Code](https://github.com/Rainbow-CPaaS/Rainbow-React-Native-Samples/tree/main/src/Calls).

**API Breaking changes:**

Conference and Audio/Video webRTC calls:
- Adding customizable call components for all the call types (conference, peer-to-peer call). check [ retrieve calls](https://developers.openrainbow.com/doc/sdk/reactnative/tutorials/retrieve_calls).
- Provide a new `IP2P`, `IConference`, `IPBX`, and generic `ICall<T>` Interfaces types for webRTC, conference, and PBX calls. check [CallTypes](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/api/CallTypes)
- Provide a new components that handle the Local video, screen-sharing, and remote video in webrtc calls. check [managing webRTC calls](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/tutorials/managing_webrtc_calls).
- Add new props to webRTC call view component to allow the user to customize the incoming, outgoing, and active call view based on his app needs. check [managing webRTC calls](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/tutorials/managing_webrtc_calls).
- Add new props to the WebrtcConference call view component to allow the user to customize the participant's view, and call view based on the call state( incoming, active, outgoing). check [managing webRTC calls](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/tutorials/managing_conferences).
- Export `ParticipantConferenceView` component to allow user to customize the view of the conference participants.
- Provide a reusable components buttons for all the call actions and allow the user to customize the button icon and style

**Fixed:**
- Fix issues with join conference.
- Fix issue with the speaker button.
- Fix issue when adding video to webRTCConference call.

## [0.3.11] - 2022-4-7

---

**API Changes:**

- Add new API lock/ unlock conference, please check docs in Rainbow API HUB [Managing Conferences](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/tutorials/managing_conferences).

## [0.3.10] - 2022-3-10

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
- Adding props `wasInitiatedWithShare`, `videoRemoteStreamCount`, `isLocalVideoEnabled` in [ICall](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/api/ICall), and remove `isRemoteVideoCall`.
- Create `ShareConferenceView.tsx` component.
- Adding local video button in `CallActions.tsx`.
- Adding screen sharing view in both `CallView.tsx` and `ConferenceCallContainer.tsx`.

## [0.3.9] - 2022-2-17

---

**Breaking Changes:**

- Refactor the `Bubbles` component so it can be customizable easily by the user side, please check docs in Rainbow API HUB [Bubbles Component](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/tutorials/BubblesComponent).
- Refactor the `Conversations` component so it can be customizable easily by the user side, please check docs in Rainbow API HUB [Retrieve Conversation](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/tutorials/retrieve_conversations).

**Added:**

- Adding new item `WithBadge` for customized tab badges, where you can check how to use it by this example: [BubbleInvitationBadge](https://github.com/Rainbow-CPaaS/Rainbow-React-Native-Samples/tree/main/src/Bubbles/BubblesComponent.tsx).
- Adding [ConversationCard](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/tutorials/retrieve_conversations#ConversationCard).

**Fixed:**

- Fixing Can't Opening the downloaded files for Android version >= 11.
- Un mute participant get stuck.
- Fixing Contact Presence not synced in the call Logs.
- Fixing the Bubble Message View is not synced when edit bubble.
- Fixing edit bubble is not synced in both conversations and bubbles list.

**Other Changes:**

- Remove `getMyBubbles` with the associated event `MyBubblesUpdated` in [Bubble Services](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/api/BubbleServices), where you can use `getBubbles` instead and filter them by `isUserOwner` flag.
- Rename callback props `onBubbleCreationResult` From `(actionName: string,creationResult: BubbleErrorCode)` to `(creationResult: BubbleErrorCode)` in [CreateBubble Component](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/tutorials/BubblesComponent).

## [0.3.8] - 2022-2-3

---

**Breaking Changes:**

- Refactor the `Message` component so it can be customizable easily by the user side, please check docs in Rainbow API HUB [MAKE AN IM CONVERSATION](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/tutorials/make_im_conversation).

**Other Changes:**

- Rename `sent` prop in [IMessage](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/api/IMessage) to `isSent`
- Change `onItemClick: (actionName: string, data?: IBubble) => void` to `onItemClick: (data?: IBubble) => void` in [Bubbles](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/tutorials/bubbles) component.
- Adding [Contact Services](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/api/ContactServices);
- Adding [Message Services](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/api/MessageServices);
- Adding [Conversation Services](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/api/ConversationServices);
- Adding [Conference Services](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/api/ConferenceServices);

## [0.3.7] - 2022-1-6

---

**API Changes:**

- Add new API `createAutoAcceptedBubble(name: string, topic: string)` to create an auto accept bubble, check docs in Rainbow API HUB [BubbleServices](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/tutorials/BubbleServices).
- Add new API `inviteParticipantToBubble(bubbleId: string, contactJid: string, asModerator: string, withInvitation: string )` to invite a participant as a moderator or a member, with an option to send an invite or not, check docs in Rainbow API HUB [BubbleParticipants](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/tutorials/BubbleParticipants).
- Add new API `getBubbleById(bubbleId: string)` to fetch a bubble using its Id, check docs in Rainbow API HUB [BubbleServices](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/tutorials/BubbleServices).
- Add new API `delegateConference(conferenceRoomId: string, participantId: string)` to transfer the meeting control to another attendee, check docs in Rainbow API HUB [Managing Conferences](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/tutorials/managing_conferences).
- Add new bubble event that fires whenever a bubble is updated. It contains only that bubble. `EventType.OnBubbleUpdated` check docs in Rainbow API HUB [BubbleServices](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/tutorials/BubbleServices).

**Fixes:**

- Fix bubble topic in conference object does not exist in IOS side.

**Other Changes:**

- Change bubbles list event name from `EventType.BubblesUpdated` to `EventType.BubblesListUpdated`.

## [0.3.6] - 2021-12-15

---

**API Changes:**

- Add new property `customData ` for [IBubble](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/api/IBubble) interface which includes customized data added by you to bubble.
- Add new API `promoteContactFromBubble(bubbleId: string, contactJid: string)` to promote a member in a bubble(room) to be an organizer, check docs in Rainbow API HUB [BubbleParticipants](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/tutorials/BubbleParticipants).
- Add new API `demoteContactFromBubble(bubbleId: string, contactJid: string)` to demote an organizer in a bubble(room) to be a normal member, check docs in Rainbow API HUB [BubbleParticipants](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/tutorials/BubbleParticipants).
- IM: A new property [IsTyping](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/api/IMessage#ITyping) has been added in Im module which allows other contacts to know if the current user is composing or not.

**Fixes:**

- Fix organizer can't add participants.
- Fix 'is typing' users are not shown.
- Fix images are not shown on the .net server from IOS side.

**Other Changes:**

- change `promoteOwner(bubbleId: string, contactJid: string)` method name to `giveOwnerShip(bubbleId: string, contactJid: string)` in [BubbleParticipants](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/tutorials/BubbleParticipants).

## [0.3.5] - 2021-12-6

---

**API Changes**

- Add new API `hangupParticipantFromConference(bubbleId: string, contactJid: string)` to hangup one of the participant during the conference call, check docs in Rainbow API HUB[BubbleParticipants](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/bubbleParticipants).
- Add new API `promoteOwner(bubbleId: string, contactJid: string)` to change one of the ownership of the bubble, check docs in Rainbow API HUB[BubbleParticipants](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/bubbleParticipants).

**Other Changes**

- Fix Call end event is not coming in case if the user is not at the active screen in One2One calls issue.
- Enhancement for requesting permission for the sample app when first installation.
- Upgrade Rainbow Android SDK version to 2.9.2.
- Bug Fixing.

**Note**
please make sure to upgrade Android Gradle version greater than 7 to guarantee a smooth development.

## [0.3.4] - 2021-11-18

---

**API Changes**

- Add new api `BubbleParticipants.removeContactFromBubble(bubbleId:string, contactJid:string)` for remove contact from a bubble, check docs in Rainbow API HUB[BubbleParticipants](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/bubbleParticipants).
- Add new property `roomEvent ` for [IMessage](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/api/IMessage) interface to indicate if the message contains a room event (new invitation, leave and join bubble).
- Add new property `conference ` for [IMessage](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/api/IMessage) interface to indicate if the message contains a webrtc conference event (someone add/remove conference call)

**Other Changes**

- Fix for multiple notifications showing in the top navigation bar issue.
- Handle upload files and show progress bar while uploading/downloading files.
- Fix bug in load more messages.

## [0.3.3] - 2021-11-4

---

**API Changes**

- Add new property `conference: IConferenceEvent` in `IMessage` interface to distinguish the room event message type to
  allow render different message layout depends on msg type.
  **Other Changes**
- Fix bug receiving duplicate room event when end/start the conference room.

## [0.3.2] - 2021-11-1

---

**API Changes**

- Add new service `BubbleCustomData` for update/delete bubble custom data: all you need is to import this service which will provide the following method:
  - `updateCustomDataForBubble(bubbleId: string, customData: {})`
  - `deleteCustomDataForBubble(bubbleId: string)`
  - `getCustomDataFromBubble(bubbleId: string, key: string)`.

**Other Changes**

- Fix null value for bubble profile pic when receiving new conference call.
- Add new property `bubbleTopic` in `IConference` call object.
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
