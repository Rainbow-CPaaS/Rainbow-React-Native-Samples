import React, { FunctionComponent, useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IBubble, bubblesService, eventEmitter, EventType, Bubbles, AvatarPresenceBadge } from 'react-native-rainbow-module';
import { NavigationState, Route, SceneMap, SceneRendererProps, TabBar, TabView } from 'react-native-tab-view';
import addBubble from '../resources/images/addBubble.png';
import { Strings } from './../resources/localization/Strings';
import { BubbleInvitations } from './BubbleInvitations';
import { CombinedRootStackParamList } from '../Navigation/AppNavigationTypes';
import { NavigationProp } from '@react-navigation/native';
import { Badge, Divider , useTheme} from 'react-native-paper';
import customTheme from '../theme';

type State = NavigationState<Route>;

interface IBubblesNavigationProps {
  navigation: NavigationProp<CombinedRootStackParamList>;
}
export const BubblesComponent: FunctionComponent<IBubblesNavigationProps> = ({navigation}) => {
  const theme = useTheme(customTheme);

  const [allBubbles, setAllBubbles] = useState<IBubble[]>([]);
  const [bubbleInvitationCounter, setBubbleInvitationCounter] = useState<number>(0);
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([{
    key: 'first',
    title: Strings.all,
  }, {
    key: 'second',
    title: Strings.myBubbles,
  }, {
    key: 'third',
    title: Strings.Invitations,
  }]);
  const initialLayout = { width: Dimensions.get('window').width };
  const FirstRoute = () => <Bubbles bubbles={allBubbles} renderItems={renderBubblesList} />;
  const SecondRoute = () => <Bubbles bubbles={getMyBubble()} renderItems={renderBubblesList} />;
  const ThirdRoute = () => <BubbleInvitations />;
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
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
    return myBubble;
  };

  const onItemClick = (bubble: IBubble) => () => {
    navigation.navigate('BubbleChatView',{bubble});
  };
  const renderBubblesList = (item: IBubble) => {
    return (
      <View style={styles.container}>
      <TouchableOpacity onPress={() => onItemClick(item)} style={styles.pressable}>
          <View style={styles.innerContainer}>
              <View style={styles.hStack}>
              <AvatarPresenceBadge peer={item} presence={undefined} />
                  <View style={styles.vStack}>
                      <Text style={styles.nameText}>{item.name}</Text>
                      <Text style={styles.topicText}>{item.topic}</Text>
                  </View>
              </View>
          </View>
          <Divider style={styles.divider} />
      </TouchableOpacity>
  </View>
    );
  };

  const createBubble = () => {
    navigation.navigate('CreateBubble');
  };

const renderInvitationBadge = ({ route, color }: { route: { key: string }; color: string }) => {
  if (route.key === 'third' && bubbleInvitationCounter > 0) {
      return (
          <Badge
              size={16}
              style={[styles.badge, { backgroundColor: 'red', color: 'white' }]}
          >
              {bubbleInvitationCounter}
          </Badge>
      );
  }
  return null;
};

  const renderTabBar = (props: SceneRendererProps & { navigationState: State }) => {
    const { ...tabBarProps } = props as any;
    return (
      <TabBar
        {...tabBarProps}
      style={{ backgroundColor: '#fff' }}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.inactiveColor}
      indicatorStyle={{ backgroundColor: theme.colors.primary }}
      renderIcon={({ route, color }) => renderInvitationBadge({ route, color })}
    />
  );
  };
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
        style={styles.addIcon}
      >
        <Image source={addBubble} style={styles.icon} />
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
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
  container: {
    paddingVertical: 8,
},
pressable: {
    overflow: 'hidden',
},
innerContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
hStack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
},
vStack: {
    justifyContent: 'center',
    marginLeft: 10,
},
nameText: {
    fontSize: 16,
    fontWeight: 'bold',
},
topicText: {
    fontSize: 14,
    color: 'grey',
},
divider: {
    marginHorizontal: 30,
    marginVertical: 8,
    backgroundColor: '#E0E0E0',
},
badge: {
    position: 'absolute',
    top: -4,
    left: 20,
    zIndex: 2,
},
});
