import { Body, Container, Left, ListItem, Tab, TabHeading, Tabs, Text } from 'native-base';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { IBubble, bubblesService, eventEmitter, EventType, Bubbles, ImageHolder, WithBadge } from 'react-native-rainbow-module';
import { Actions } from 'react-native-router-flux';
import addBubble from '../resources/images/addBubble.png';
import { Strings } from './../resources/localization/Strings';
import { BubbleInvitations } from './BubbleInvitations';


export const BubblesComponent: FunctionComponent = ({

}) => {

  const [allBubbles, setAllBubbles] = useState<IBubble[]>([]);
  const [bubbleInvitationCounter, setBubbleInvitationCounter] = useState<number>(0);
  const [activeTab, setActiveTab] = useState(0);
  const BubbleInvitationBadge = WithBadge(bubbleInvitationCounter, {
    right: -3,
    top: -4,
  })(Text);

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
    Actions.BubbleChatView({
      bubble
    })
  }

  const renderBubblesList = (item: IBubble) => {
    return (
      <TouchableWithoutFeedback onPress={onItemClick(item)} >
        <ListItem avatar={true} style={defaultStyle.listItem}>
          <Left style={defaultStyle.leftItem}>
            <ImageHolder url={item.imageURL} name={item.name} />
          </Left>
          <Body>
            <Text>{item.name}</Text>
            <Text note={true}>{item.topic}</Text>
          </Body>
        </ListItem>
      </TouchableWithoutFeedback>
    );
  };

  const createBubble = () => {
    Actions.createBubble();
  };

  const setSelectedTab = (tab: { i: number; ref: Element; from: number }) => {
    setActiveTab(tab.i);
  };

  return (
    <Container>
      <Tabs initialPage={0} tabBarUnderlineStyle={defaultStyle.tabBarUnderline} onChangeTab={setSelectedTab}>
        <Tab
          heading={Strings.all}
          tabStyle={defaultStyle.TabsColor}
          activeTabStyle={defaultStyle.TabsColor}
          textStyle={defaultStyle.tabText}
          activeTextStyle={defaultStyle.tabActiveText}
        >
          <Bubbles bubbles={allBubbles} renderItems={renderBubblesList} />
        </Tab>
        <Tab
          heading={Strings.myBubbles}
          tabStyle={defaultStyle.TabsColor}
          activeTabStyle={defaultStyle.TabsColor}
          textStyle={defaultStyle.tabText}
          activeTextStyle={defaultStyle.tabActiveText}
        >
          <Bubbles bubbles={getMyBubble()} renderItems={renderBubblesList} />
        </Tab>
        <Tab
          heading={
            <TabHeading style={defaultStyle.TabsColor}>
              <BubbleInvitationBadge style={activeTab === 2 ? defaultStyle.tabActiveText : defaultStyle.tabText}>
                {Strings.Invitations}
              </BubbleInvitationBadge>

            </TabHeading>
          }
          tabStyle={defaultStyle.TabsColor}
          activeTextStyle={defaultStyle.tabActiveText}
        >

          <BubbleInvitations />
        </Tab>

      </Tabs>
      <TouchableOpacity
        onPress={createBubble}
        style={defaultStyle.iconContainer}
      >
        <Image source={addBubble} style={defaultStyle.icon} />
      </TouchableOpacity>
    </Container>
  );
};
const defaultStyle = StyleSheet.create({
  TabsColor: { backgroundColor: '#0086CF' },
  iconContainer: {
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
  tabBarUnderline: {
    backgroundColor: '#ffffff',
  },
  tabActiveText: {
    color: '#ffffff',
  },
  tabText: { color: '#a5c0f3' },
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
});
