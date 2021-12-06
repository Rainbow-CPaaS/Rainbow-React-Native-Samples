# CHANGELOG SDK for React-Native

---

Here is the list of the changes and features provided by the **Rainbow-React-Native-SDK**
All notable changes to Rainbow-React-Native-SDK will be documented in this file.

## [0.3.5] - 2021-12-6

---

**API Changes**

- Add new API `hangupParticipantFromConference(bubbleId: string, contactJid: string)` to hangup one of the participant during the conference call, check docs in Rainbow API HUB[BubbleParticipants](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/bubbleParticipants).
- Add new API `promoteOwner(bubbleId: string, contactJid: string)` to change one of the ownership of the bubble, check docs in Rainbow API HUB[BubbleParticipants](https://hub.openrainbow.com/#/documentation/doc/sdk/reactnative/bubbleParticipants).

**Breaking Changes**
- Upgrade Android ALE SDK version to 2.9.2.
- Upgrade Android gradle version to 7.0.3.

**Other Changes**

- Fix a bugs in the conference incoming call.
- Fix a bug in Active call panner for P2P call.
- Fix a bug in showing permission when first installation.
- Fix a bug in messages.

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
