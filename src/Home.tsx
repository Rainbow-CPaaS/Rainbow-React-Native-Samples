import * as React from 'react';
import { Platform, Text, View, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import {
	startUpService,
	permissionsService,
	SearchBarInput,
	Logger,
	BackButtonHandler,
	BubbleEventsTabIcon,
	InvitationTabIcon,
	Header,
} from 'react-native-rainbow-module';
import { useTheme, IconButton } from 'react-native-paper';
import { ContactsComponent } from './ContactsComponent';
import { InvitationsComponent } from './InvitationsComponent';
import { CallLogComponent } from './CallLogComponent';
import { BubblesComponent } from './Bubbles/BubblesComponent';
import { ConversationsComponent } from './Conversations/ConversationsComponent';
import { SearchComponent } from './SearchComponent';
import { FunctionComponent, useContext } from 'react';
import { useRoute } from '@react-navigation/native';
import {
	HomeScreenRouteProp,
	HomeScreenNavigationProp,
} from './Navigation/AppNavigationTypes';
import { NavigationContext } from './Navigation/NavigationContext';
import customTheme from './theme';

const logger = new Logger('Home');

interface IHomeProps {
	route: HomeScreenRouteProp;
	navigation: HomeScreenNavigationProp;
}

export const Home: FunctionComponent<IHomeProps> = ({ navigation }) => {
	const theme = useTheme(customTheme);
	const [selectedTab, setSelectedTab] = React.useState<number>(1);
	const [isSearchMode, setIsSearchMode] = React.useState<boolean>(false);
	const [searchQuery, setSearchQuery] = React.useState<string>('');
	const registerBackButtonHandler =
		useContext(NavigationContext) ||
		(() => () => {
			logger.error('Failed to unregister handler; handler not found');
		});
	const currentRoute = useRoute();

	React.useEffect(() => {
		// request al the permission the App is needed
		const allAppPermissions = permissionsService.appPermissions;
		permissionsService
			.checkMultiPermissionRequest(allAppPermissions)
			.then(result => {
				permissionsService.requestIOSNotificationsPermission();
				logger.info(`checkMultiPermissionRequest ${result}`);
			});
		if (Platform.OS === 'android') {
			// startUpService.getAutoStartPermissions();
		}
		startUpService.getRosterContacts();
	}, []);

	const openMenu = () => {
		navigation.navigate('AppMenu');
	};
	const renderTab = (): React.ReactNode => {
		switch (selectedTab) {
			case 1:
				return <ContactsComponent navigation={navigation} />;
			case 2:
				return <ConversationsComponent navigation={navigation} />;
			case 3:
				return <BubblesComponent navigation={navigation} />;
			case 4:
				return <InvitationsComponent />;
			case 5:
				return <CallLogComponent navigation={navigation} />;
			default:
				return <Text>No Data Found</Text>;
		}
	};

	const updateHomeSearchState = (value: boolean, query: string) => {
		setIsSearchMode(value);
		setSearchQuery(query);
	};
	const cancelSearch = () => {
		onBackButtonPressed();
	};
	const onBackButtonPressed = () => {
		logger.info('onBackButtonPressed handled by home');
		if (isSearchMode && currentRoute.name === 'ContactInformation') {
			logger.info(
				'onBackButtonPressed handled by home, exit contact Card details and back to the search',
			);
			navigation.pop();
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
				return <BubbleEventsTabIcon />;
			case 'invitations':
				return <InvitationTabIcon />;
			default:
				return;
		}
	};
	const renderButtonTab = (tabName: string, iconName: string, tabNum: number) => {
		const { colors } = useTheme(customTheme);
		return (
			<TouchableOpacity
				style={{
					flex: 1,
					paddingVertical: 8,
					opacity: selectedTab === tabNum ? 1 : 0.5,
				}}
				onPress={() => setSelectedTab(tabNum)}
			>
				<View style={{ alignItems: 'center' }}>
					{renderPendingTabCounter(tabName)}
					<IconButton
						icon={iconName}
						size={30}
						iconColor={colors.primary as string}
					/>
				</View>
			</TouchableOpacity>
		);
	};
	const searchComponent = <SearchComponent navigation={navigation} />;
	const renderHeaderCenter = () => {
		return (
			<SearchBarInput
				onSearchUpdated={updateHomeSearchState}
				onCancelSearch={cancelSearch}
				registerBackButtonHandler={registerBackButtonHandler}
			/>
		);
	};
	const renderHeaderLeftIcon = () => {
		return (
			!isSearchMode && (<IconButton
				icon="menu"
				size={35}
				iconColor={theme.colors.primary}
				onPress={openMenu}
			/>)
		);
	};
	return (
		<React.Fragment>
			<Header
				leftComponent={renderHeaderLeftIcon}
				centerComponent={renderHeaderCenter}
				containerStyle={{ paddingTop: 10, paddingBottom: 10 }}
			/>
			{isSearchMode && searchComponent}
			{!isSearchMode && renderTab()}
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.footer}>
					{renderButtonTab('contacts', 'account-multiple', 1)}
					{renderButtonTab('conversations', 'chat-processing', 2)}
					{renderButtonTab('bubbles', 'chart-bubble', 3)}
					{renderButtonTab('invitations', 'account-plus-outline', 4)}
					{renderButtonTab('callLogs', 'phone-log', 5)}
				</View>
			</SafeAreaView>
			<BackButtonHandler
				registerBackButtonHandler={registerBackButtonHandler}
				onBackButtonPressed={onBackButtonPressed}
			/>
		</React.Fragment>
	);
};
const styles = StyleSheet.create({
	footer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 6,
		backgroundColor: '#fff',
	},
	safeArea: {
		backgroundColor: '#fff', width: '100%',
	},
});
