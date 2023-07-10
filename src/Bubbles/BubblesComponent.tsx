import { Box, Circle, Divider, HStack, Text, VStack, Pressable } from 'native-base';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { IBubble, bubblesService, eventEmitter, EventType, Bubbles, AvatarPresenceBadge } from 'react-native-rainbow-module';
import { NavigationState, Route, SceneMap, SceneRendererProps, TabBar, TabView } from 'react-native-tab-view';
import addBubble from '../resources/images/addBubble.png';
import { Strings } from './../resources/localization/Strings';
import { BubbleInvitations } from './BubbleInvitations';
import { CombinedRootStackParamList } from '../Navigation/AppNavigationTypes';
import { NavigationProp } from '@react-navigation/native';


type State = NavigationState<Route>;

interface IBubblesNavigationProps {
  navigation: NavigationProp<CombinedRootStackParamList>;
}
export const BubblesComponent: FunctionComponent<IBubblesNavigationProps>= ({navigation}) => {

  const [allBubbles, setAllBubbles] = useState<IBubble[]>([]);
  const [bubbleInvitationCounter, setBubbleInvitationCounter] = useState<number>(0);
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([{
    key: 'first',
    title: Strings.all
  }, {
    key: 'second',
    title: Strings.myBubbles
  }, {
    key: 'third',
    title: Strings.Invitations
  },]);
  const initialLayout = { width: Dimensions.get('window').width };
  const FirstRoute = () => <Bubbles bubbles={allBubbles} renderItems={renderBubblesList} />;
  const SecondRoute = () => <Bubbles bubbles={getMyBubble()} renderItems={renderBubblesList} />;
  const ThirdRoute = () => <BubbleInvitations />;
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute
  });

  useEffect(() => {
    // Call the bubble list from the bubble services.
    bubblesService.getBubbles();
    const bubblesListUpdated = eventEmitter.addListener(
      EventType.BubblesListUpdated,
      (eventData: IBubble[]) => {
        setAllBubbles(eventData);

      }
    );
    const bubblePendingInvitationsCounter = eventEmitter.addListener(
      EventType.BubblePendingInvitationsCounter,
      (counter: number) => {
        setBubbleInvitationCounter(counter);
      }
    );

    return () => {
      bubblesListUpdated.remove();
      bubblePendingInvitationsCounter.remove();
    };
  }, []);

  const getMyBubble = () => {
    const myBubble = allBubbles.filter((item: IBubble) => item.isMyUserOwner);
    return myBubble
  }

  const onItemClick = (bubble: IBubble) => () => {
    navigation.navigate('BubbleChatView',{bubble})


  }
  const renderBubblesList = (item: IBubble) => {
    return (
      <Box borderBottomWidth="0" pl={["0", "4"]} pr={["0", "5"]} py="2"  >
        <Pressable onPress={onItemClick(item)} overflow="hidden" >
          <HStack px={5} width="100%" justifyContent="space-between" >
            <HStack space={4}>
              <AvatarPresenceBadge peer={item} presence={undefined} />
              <VStack justifyContent="center"  >
                <Text>{item.name}</Text>
                <Text >{item.topic}</Text>
              </VStack>
            </HStack>
          </HStack >
          <Divider mx="75" my="2" bg="muted.200" thickness="1" />
        </Pressable>
      </Box>
    );
  };

  const createBubble = () => {
    navigation.navigate('CreateBubble')
  };

  const renderInvitationBadge = ({ route, color }: { route: Route; color: string }) => {
    if (route.key === 'third' && bubbleInvitationCounter > 0)
      return (
        <Circle size='16px' bg="red.600" zIndex={2} ml="20" mt="-2">
          <Text color="white" fontSize="xs" bold alignSelf="center">{bubbleInvitationCounter}</Text>
        </Circle>
      )
    else return null;
  };
  const renderTabBar = (props: SceneRendererProps & { navigationState: State }) => (
    <TabBar {...props} style={{ backgroundColor: '#0086CF' }} renderIcon={renderInvitationBadge} />
  );
  return (
    <>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar} />

      <TouchableOpacity
        onPress={createBubble}
        style={defaultStyle.addIcon}
      >
        <Image source={addBubble} style={defaultStyle.icon} />
      </TouchableOpacity>
    </>
  );
};
const defaultStyle = StyleSheet.create({
  addIcon: {
    position: 'absolute',
    bottom: 60,
    end: 20,
    width: 65,
    height: 65,
    backgroundColor: '#0086CF',
    borderRadius: 40,
    paddingTop: 10,
    alignSelf: 'flex-end',
  },
  icon: {
    width: 40,
    height: 40,
    alignSelf: 'center',
  },

});
