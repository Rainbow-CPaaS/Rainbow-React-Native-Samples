import { Box, Divider, HStack, Text, VStack } from 'native-base';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';
import { IBubble, eventEmitter, EventType, Bubbles, AvatarPresenceBadge, bubblesService, ImageButton } from 'react-native-rainbow-module';
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
            <Box borderBottomWidth="0" pl={["0", "4"]} pr={["0", "5"]} py="2"  >
                <HStack px={5} width="100%" justifyContent="space-between" >
                    <HStack space={3}>
                        <AvatarPresenceBadge peer={item} presence={undefined} />
                        <VStack justifyContent="center"  >
                            <Text>{item.name}</Text>
                            <Text >{item.topic}</Text>
                        </VStack>
                    </HStack>
                    <HStack>
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
                    </HStack>
                </HStack >
                <Divider mx="75" my="2" bg="muted.200" thickness="1" />
            </Box>
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

