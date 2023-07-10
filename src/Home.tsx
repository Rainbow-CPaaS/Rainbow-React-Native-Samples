import * as React from 'react';
import { Platform } from 'react-native';
import { startUpService, permissionsService, SearchBarInput, Logger, BackButtonHandler, BubbleEventsTabIcon, InvitationTabIcon, Header } from 'react-native-rainbow-module';
import { Text, HStack, Box, Center, Pressable } from 'native-base';
import { ContactsComponent } from './ContactsComponent';
import { InvitationsComponent } from './InvitationsComponent';
import { CallLogComponent } from './CallLogComponent';
import { BubblesComponent } from './Bubbles/BubblesComponent'
import { ConversationsComponent } from './Conversations/ConversationsComponent';
import { SearchComponent } from './SearchComponent'
import { FunctionComponent, useContext } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import { HomeScreenRouteProp, HomeScreenNavigationProp } from './Navigation/AppNavigationTypes';
import { NavigationContext } from './Navigation/NavigationContext';

const logger = new Logger('Home');
interface IHomeProps {
	route: HomeScreenRouteProp;
	navigation: HomeScreenNavigationProp;
}
export const Home: FunctionComponent<IHomeProps> = ({
	route,
	navigation,
}) => {
	const [selectedTab, setSelectedTab] = React.useState<number>(1);
	const [isSearchMode, setIsSearchMode] = React.useState<boolean>(false);
	const [searchQuery, setSearchQuery] = React.useState<string>('');
	const registerBackButtonHandler = useContext(NavigationContext) ||  (() => () => {
		logger.error('Failed to unregister handler; handler not found');
	});
	const currentRoute = useRoute();

	React.useEffect(() => {
		// request al the permission the App is needed
		const allAppPermissions = permissionsService.appPermissions;
		permissionsService.checkMultiPermissionRequest(allAppPermissions).then((result) => {
			permissionsService.requestIOSNotificationsPermission();
			logger.info(`checkMultiPermissionRequest ${result}`)

		});
		if (Platform.OS === 'android') {
			startUpService.getAutoStartPermissions();
		}
		startUpService.getRosterContacts();
	}, [])

	const openMenu = () => {
		navigation.navigate('AppMenu')
	}
	const renderTab = (): Element => {
		switch (selectedTab) {
			case 1:
				return <ContactsComponent navigation={navigation} />
			case 2:
				return <ConversationsComponent navigation={navigation} />
			case 3:
				return <BubblesComponent navigation={navigation} />
			case 4:
				return <InvitationsComponent />
			case 5:
				return <CallLogComponent navigation={navigation} />
			default:
				return <Text>No Data Found</Text>
		}
	}

	const updateHomeSearchState = (value: boolean, query: string) => {
		setIsSearchMode(value);
		setSearchQuery(query);

	};
	const cancelSearch = () => {
		onBackButtonPressed();
	};
	const onBackButtonPressed = () => {
		logger.info('onBackButtonPressed handled by home');
		if (isSearchMode && currentRoute.name === 'ContactInformation'
		) {
			logger.info('onBackButtonPressed handled by home, exit contact Card details and back to the search');
			navigation.pop()
			return true;
		}
		if (isSearchMode) {
			logger.info('onBackButtonPressed handled by home, exit searchMode');
			setIsSearchMode(false);
			if (searchQuery) {
				// To do clear input value on back button pressed.
			} else {
				setIsSearchMode(false);
			}
			return true;
		}
		return false;
	};

	const renderPendingTabCounter = (tabName: string) => {
		switch (tabName) {
			case 'bubbles':
				return <BubbleEventsTabIcon />
			case 'invitations':
				return <InvitationTabIcon />
			default:
				return
		}
	}

	const renderButtonTab = (tabName: string, iconName: string, tabNum: number) => {
		return (
			<Pressable opacity={selectedTab === tabNum ? 1 : 0.5} py="2" flex={1} onPress={() => setSelectedTab(tabNum)}>
				<Center color="green.100">
					{renderPendingTabCounter(tabName)}
					<Icon name={iconName} size={30} color="white" />
				</Center>
			</Pressable>
		);
	};
	const searchComponent = <SearchComponent navigation={navigation} />;
	const renderHeaderCenter = () => {
		return <SearchBarInput onSearchUpdated={updateHomeSearchState} onCancelSearch={cancelSearch} registerBackButtonHandler={registerBackButtonHandler}  />
	}
	const renderHeaderLeftIcon = () => {
		return !isSearchMode && (<Icon name="menu" size={35} color="white" onPress={openMenu} />);
	}
	return (
		<React.Fragment>
			<Header leftComponent={renderHeaderLeftIcon} centerComponent={renderHeaderCenter} containerStyle={{ paddingTop: 10, paddingBottom: 10 }} />
			{isSearchMode && searchComponent}
			{!isSearchMode && renderTab()}
			<Box bg="white" safeAreaTop width="100%" alignSelf="flex-end" >
				<HStack bg="lightBlue.600" alignItems="center" alignSelf="flex-end" safeAreaBottom shadow={6} >
					{renderButtonTab('contacts', 'person', 1)}
					{renderButtonTab('conversations', 'ios-chatbox', 2)}
					{renderButtonTab('bubbles', 'md-chatbubbles', 3)}
					{renderButtonTab('invitations', 'person-add-sharp', 4)}
					{renderButtonTab('callLogs', 'ios-time', 5)}
				</HStack>
			</Box>
			<BackButtonHandler
				registerBackButtonHandler={registerBackButtonHandler}
				onBackButtonPressed={onBackButtonPressed}
			/>
		</React.Fragment>
	);
}
