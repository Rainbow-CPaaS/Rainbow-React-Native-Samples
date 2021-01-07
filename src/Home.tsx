import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { startUpService, authService, permissionsService, EventsTabIcon } from 'react-native-rainbow-module';
import { Body, Button, Container, Content, Footer, FooterTab, Header, Icon, Left, Right } from 'native-base';
import { ContactsComponent } from './ContactsComponent';
import { InvitationsComponent } from './InvitationsComponent';
import { CallLogComponent } from './CallLogComponent';
import appStyleConfig from '../app-styles.json';
import { Actions } from 'react-native-router-flux';

const homeStyle = StyleSheet.create(appStyleConfig.home);

export default function Home() {
	const [selectedTab, setSelectedTab] = React.useState<string>('contacts');
	React.useEffect(() => {
		// request al the permission the App is needed
		const allAppPermissions = permissionsService.appPermissions;
		permissionsService.checkMultiPermissionRequest(allAppPermissions).then((result) => {
			// Do what ever you want

		});
		startUpService.getLocalContacts();
		startUpService.getRosterContacts();
	}, [])
	const onLogout = () => {
		authService.signOut();
	}
	const openMenu = () => {
		Actions.AppMenu();
	}
	const renderTab = (): Element => {
		switch (selectedTab) {
			case 'contacts':
				return <ContactsComponent />

			case 'invitations':
				return <InvitationsComponent />

			case 'callLogs':
				return <CallLogComponent />
			default:
				return (
					<Content>
						<Text>No Data Found</Text>
					</Content>
				)
		}

	}
	const switchTab = (tabName: string) => () => {
		setSelectedTab(tabName);

	}
	return (
		<React.Fragment>
			<Container>
				<Header style={[homeStyle.tabBackground, styles.header]}>
					<Left>
						<Icon
							name="ios-menu"
							style={{
								color: 'white',
								marginTop: 5,
								alignSelf: 'center',
							}}
							onPress={openMenu}
						/>
					</Left>
					<Body />
					<Right />

				</Header>
				{renderTab()}
				<Footer>
					<FooterTab style={homeStyle.tabBackground}>
						<Button vertical={true} onPress={switchTab('contacts')}>
							<Icon name="person" style={homeStyle.tabIcon} />
							<Text>Contacts</Text>
						</Button>
						<Button vertical={true} onPress={switchTab('invitations')}>
							<Icon name="camera" style={homeStyle.tabIcon} />
							<Text>Invitations</Text>
						</Button>
						<Button vertical={true} badge={true} onPress={switchTab('callLogs')}>
							<EventsTabIcon name={'ios-time'} />
							<Text>Call Logs</Text>
						</Button>
					</FooterTab>
				</Footer>
			</Container>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	header: { borderBottomWidth: 0 },
	headerIcon: { fontSize: 40 }
});
