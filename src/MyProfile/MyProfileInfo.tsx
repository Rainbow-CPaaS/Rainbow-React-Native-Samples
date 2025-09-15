import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { IUser, EmailType, IEmail, IPhoneNumber, PhoneType, eventEmitter, EventType, Header, AvatarPresenceBadge } from 'react-native-rainbow-module';
import { Strings } from '../resources/localization/Strings';
import Icon from 'react-native-vector-icons/Ionicons';
import { MyProfileInfoNavigationProp, MyProfileInfoRouteProp } from '../Navigation/AppNavigationTypes';
import { IconButton } from 'react-native-paper';

export interface IProps {
    route: MyProfileInfoRouteProp;
    navigation: MyProfileInfoNavigationProp;
}

export const MyProfileInfo: React.FunctionComponent<IProps> = ({
    navigation,
    route,
}) => {
    const connectedUser = route.params.connectedUser;
    const [user, setUser] = useState<IUser>(connectedUser);
    const { contact, licenses } = user;
    useEffect(() => {
        const connectedUserUpdated = eventEmitter.addListener(
            EventType.ConnectedUserUpdated,
            (eventData: IUser) => {
                if (eventData)
                    {setUser(eventData);}
            });

        return () => {
            connectedUserUpdated.remove();
        };
    }, []);
    const renderEmailItem = (item: IEmail) => {
        return(
        <View style={{ flexDirection: 'row', padding: 12 }} key={item.value}>
        <IconButton
            icon="mail"
            size={30}
            iconColor="#0086CF"
            style={{ marginRight: 12 }}
        />
        <View>
            <Text style={{ color: 'lightBlue', fontSize: 16 }}>
                {Strings.emailStrings[item.type as keyof typeof EmailType]}
            </Text>
            <Text>{item.value}</Text>
        </View>
    </View>
        );
    };

    const renderPhoneItem = (item: IPhoneNumber) => {
        return(
        <View style={{ flexDirection: 'row', padding: 12 }} key={item.value}>
            <IconButton
                icon="phone" // Replace with appropriate icon name
                size={30}
                iconColor="#0086CF"
                style={{ marginRight: 12 }}
            />
            <View>
                <Text style={{ color: 'lightBlue', fontSize: 16 }}>
                    {Strings.phoneStrings[item.type as keyof typeof PhoneType]}
                </Text>
                <Text style={{ color: 'black' }}>{item.value}</Text>
            </View>
        </View>
        );
    };
    const openEditMyInfoPage = () => {
        navigation.navigate('UserInfoFrom', { connectedUser: user });
    };
    const renderCenterHeader = () => {
        return <Text style={styles.headerText}> {Strings.myProfileInfo}</Text>;

    };
    const renderRightHeader = () => {
        return <Icon name="pencil-outline" size={35} color="white" onPress={openEditMyInfoPage} />;
    };
    const renderContactInfo = () => {
        return (
            <View style={styles.container}>
                <AvatarPresenceBadge
                    peer={contact}
                    avatarSize={100}
                    presenceIconSize={20}
                    presence={contact.presence}
                />
                <View style={styles.infoContainer}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.jobTitle}>{contact.jobTitle}</Text>
                    <Text style={styles.companyName}>{contact.companyName}</Text>
                    <Text style={styles.presenceText}>{Strings.presenceOption[contact.presence]}</Text>
                </View>
            </View>
        );
    };
    const renderContactDetails = () => {
        return (
            <View style={styles.detailsContainer}>
                 {contact.emails.map((item: IEmail) => renderEmailItem(item))}
                 {contact.phoneNumbers.map((item: IPhoneNumber) => renderPhoneItem(item))}
                <View style={styles.servicePlaneContainer}>
                        <Text style={styles.servicePlaneText}>{Strings.servicePlane}:</Text>
                        {licenses.map((item: string) => (
                            <Text style={styles.licenseText} key={item}>{item}, </Text>
                        ))}
                    </View>
                </View>);
    };
    return (
        <>
            <Header containerStyle={styles.headerBgColor} rightComponent={renderRightHeader} centerComponent={renderCenterHeader} />
            <View style={styles.imageView}>
                <ImageBackground
                    style={styles.backgroundImg}
                    imageStyle={styles.imageBackgroundStyle}
                    source={{
                        uri: contact.imageURL,
                    }}>
                   {renderContactInfo()}
                </ImageBackground>
            </View>
            {renderContactDetails()}
       </>
    );
};

const styles = StyleSheet.create({
    backgroundImg: {
        width: '100%',
        height: '100%',
    },
    imageView: {
        width: '100%',
        height: 150,
        backgroundColor: '#808080',
    },
    headerBgColor: {
        backgroundColor: '#0086CF',
    },
    imageBackgroundStyle: {
        opacity: 0.2,
    },
    headerText:{
        color: 'white',
        fontSize: 16,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 20, // Equivalent to p="10"
    },
    infoContainer: {
        padding: 12, // Equivalent to p="3"
        justifyContent: 'space-between',
    },
    contactName: {
        fontSize: 16, // Adjust to your desired md size
        marginLeft: -1,
    },
    jobTitle: {
        fontSize: 12,
        fontWeight: '500',
        marginLeft: -0.5,
        marginTop: -1,
    },
    companyName: {
        fontSize: 12,
        fontWeight: '500',
        marginLeft: -0.5,
        marginTop: -1,
    },
    presenceText: {
        fontSize: 12,
        fontWeight: '500',
        marginLeft: -0.5,
        marginTop: -1,
    },
    detailsContainer:{
        padding: 10,
    },
    servicePlaneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    servicePlaneText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3f51b5',
    },
    licenseText: {
        fontSize: 12,
        fontWeight: '500',
    },
});

