import { Body, Left, ListItem, Text } from 'native-base';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { IBubble, eventEmitter, EventType, Bubbles, ImageHolder, ImageButton, bubblesService } from 'react-native-rainbow-module';
import accept from '../resources/images/acceptFeed.png';
import remove from '../resources/images/removeFeed.png';


export const BubbleInvitations: FunctionComponent = () => {

    const [invitedBubbles, setInvitedBubble] = useState<IBubble[]>([]);
    useEffect(() => {
        bubblesService.getInvitedBubbles();
        // Listen for the invited bubble array result.
        const getInvitedBubbles = eventEmitter.addListener(
            EventType.GetInvitedBubbles,
            (bubble: IBubble[]) => {
                setInvitedBubble(bubble);
            }
        );
        // Listen to the accept/decline bubble invitation result.
        const invitedBubblesResult = eventEmitter.addListener(
            EventType.InvitedBubblesResult,
            (result: string) => {
                Alert.alert('Invitation Response', result);
            }
        );
        return () => {
            setInvitedBubble([]);
            getInvitedBubbles.remove();
            invitedBubblesResult.remove();
        }
    }, []);

    const acceptBubbleInvitation = (bubbleId: string) => () => {
        bubblesService.acceptBubbleInvitation(bubbleId);
    }
    const declineBubbleInvitation = (bubbleId: string) => () => {
        bubblesService.declineBubbleInvitation(bubbleId);
    }

    const renderBubbleInvitation = (item: IBubble) => {
        return (
            <TouchableWithoutFeedback>
                <ListItem avatar={true}>
                    <Left style={defaultStyle.leftItem}>
                        <ImageHolder url={item.imageURL} name={item.name} />
                    </Left>
                    <Body>
                        <Text>{item.name}</Text>
                        <Text note={true}>{item.topic}</Text>
                    </Body>
                    <View style={defaultStyle.viewButton}>
                        <ImageButton
                            imageSource={accept}
                            onPress={acceptBubbleInvitation(item.id)}
                            style={{ image: defaultStyle.image }}
                        />
                        <ImageButton
                            imageSource={remove}
                            onPress={declineBubbleInvitation(item.id)}
                            style={{ image: defaultStyle.image }}
                        />
                    </View>
                </ListItem>
            </TouchableWithoutFeedback>
        );
    }

    return (<Bubbles bubbles={invitedBubbles} renderItems={renderBubbleInvitation} />);
};
const defaultStyle = StyleSheet.create({
    listItem: { paddingTop: 10 },
    leftItem: { width: 60, height: 60 },
    sectionHeader: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#0086CF',
        backgroundColor: '#eeeded',
    },
    viewButton: { flexDirection: 'row' },
    image: { width: 40, height: 40, margin: 10 },
});

