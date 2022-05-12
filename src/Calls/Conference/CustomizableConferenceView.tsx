import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IConference, ImageHolder, IImageHolderStyle, ConferenceLocalVideo, IConferenceParticipants, ParticipantConferenceView, IParticipantViewStyleProps, AnswerConfCallButton, EndConferenceCallButton, LoudspeakerButton, MicButton, AddVideoToConfButton, HideConferenceCallViewButton, LockConfButton, SwitchCameraButton } from 'react-native-rainbow-module';
import { FlatGrid } from 'react-native-super-grid';
import { Strings } from './../../resources/localization/Strings';

// Conference View
export const renderCustomIncomingCall = (call: IConference) => {
    const { callPeer } = call;
    return (
        <View style={defaultStyle.viewStyle}>
            <Text style={defaultStyle.incomingCallInvitedMsg}>{`${callPeer.bubbleOwner.name} ${Strings.ConferenceCallInvitation} ${callPeer.name} `}</Text>
            <ImageHolder url={callPeer.imageURL} style={conferenceBubbleImageStyle} name={callPeer.name} />
        </View>
    );
}
const renderParticipantItem = ({ item }: { item: IConferenceParticipants }) => {
    return (
        <View style={defaultStyle.participantItemContainer}>
            <ParticipantConferenceView participant={item} key={item.contact.jId} style={participantViewStyle} />
        </View>
    )
}

export const renderCustomActiveCall = (call: IConference) => {
    const { isLocalVideoEnabled } = call;
    return (
        <View style={defaultStyle.viewStyle}>
            {isLocalVideoEnabled && <ConferenceLocalVideo />}
            <FlatGrid
                itemDimension={140}
                data={call.attendees}
                style={defaultStyle.participantListStyle}
                spacing={10}
                renderItem={renderParticipantItem}
            />
        </View>
    );
}

// Conference Action Buttons
export const renderIncomingCallActionsButtons = (call: IConference) => {
    return (
        <View style={defaultStyle.buttonsViewStyle} >
            <AnswerConfCallButton call={call} />
            <EndConferenceCallButton
                call={call}
                style={{
                    container: {
                        width: 60,
                        height: 60,
                    }
                }}
            />
        </View>
    );
}


export const renderActiveCallActionsButtons = (call: IConference) => {
    const { callPeer, isLocalVideoEnabled } = call;
    return (
        <View style={defaultStyle.buttonsViewStyle} >
            <MicButton />
            {isLocalVideoEnabled && <SwitchCameraButton />}
            <HideConferenceCallViewButton call={call} />
            <AddVideoToConfButton call={call} />
            <LoudspeakerButton />
            {callPeer.isUserModerator && <LockConfButton call={call} />}
            <EndConferenceCallButton call={call} />
        </View>
    );
}


const defaultStyle = StyleSheet.create({
    incomingCallInvitedMsg: {
        fontSize: 15,
        color: '#ffffff',
        margin: 20,
        alignSelf: 'center'
    },
    participantListStyle: {
        marginTop: 10,
        flex: 1
    },
    participantItemContainer: {
        backgroundColor: '#02a2ff',
        borderRadius: 5,
        padding: 10,
        flexWrap: 'wrap',
        flexDirection: 'column'
    },
    viewStyle: { flex: 1 },
    buttonsViewStyle: { flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'space-around' }
});
const conferenceBubbleImageStyle: IImageHolderStyle = {
    thumbnail: {
        position: 'absolute',
        top: 100,
        alignSelf: 'center',
        width: 140,
        height: 140,
        borderRadius: 100
    },
    thumbnailContainer: {
        position: 'absolute',
        top: 100,
        alignSelf: 'center',
        width: 140,
        height: 140,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#cf0071'
    },
    imageTextStyle: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold'
    }
};

const participantViewStyle: IParticipantViewStyleProps = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',

    },
    participantViewStyle: {
        width: 150,
        height: 150,
    },
    participantBackgroundViewStyle: {
        justifyContent: 'center',
    },
    miceIconStyle: {
        color: 'white',
    },
    ParticipantDetailContainer: {
        marginTop: 10,
        backgroundColor: '#707680',
        flexDirection: 'row',
    },
    userNameStyle: {
        color: 'white',
        fontSize: 20,
        width: 150,
        textAlign: 'center'
    }
});
