import React, { useEffect, useState } from 'react';
import { View, Text, Body, Container, Title, ListItem, Icon } from 'native-base';
import { FlatList, ImageBackground, StyleSheet } from 'react-native';
import { IUser, ImageHolder, PresenceIcon, EmailType, IEmail, IPhoneNumber, PhoneType, eventEmitter, EventType, IImageHolderStyle, Header } from 'react-native-rainbow-module';
import { Actions } from 'react-native-router-flux';
import { Strings } from '../resources/localization/Strings';


export interface IProps {
    connectedUser: IUser
}

export const MyProfileInfo: React.FunctionComponent<IProps> = ({
    connectedUser
}) => {
    const [user, setUser] = useState<IUser>(connectedUser);
    const { contact, servicePlane } = user;
    useEffect(() => {
        const connectedUserUpdated = eventEmitter.addListener(
            EventType.ConnectedUserUpdated,
            (eventData: IUser) => {
                if (eventData)
                    setUser(eventData);
            });

        return () => {
            connectedUserUpdated.remove();
        }
    }, []);
    const setKeyExtractor = (item: any) => {
        return item.value;
    }
    const renderEmailItem = ({ item }: { item: IEmail }) => {
        return (
            <ListItem avatar={true}>
                <Icon name="ios-mail" style={defaultStyle.icon} />
                <Body>
                    <View style={defaultStyle.itemBody}>
                        <Text note={true}>
                            {' '}
                            {Strings.emailStrings[item.type as keyof typeof EmailType]}{' '}
                        </Text>
                        <Text >{item.value}</Text>
                    </View>
                </Body>
            </ListItem>
        );
    }
    const renderPhoneItem = ({ item }: { item: IPhoneNumber }) => {
        if (item.value === '' || item.value === undefined) {
            return null;
        } else {
            return (
                <ListItem avatar={true} >
                    <Icon name="ios-call" style={defaultStyle.icon} />
                    <Body>
                        <View style={defaultStyle.itemBody}>
                            <Text note={true}>
                                {' '}
                                {Strings.phoneStrings[item.type as keyof typeof PhoneType]}{' '}
                            </Text>
                            <Text >{item.value}</Text>
                        </View>
                    </Body>
                </ListItem>
            );
        }
    }
    const openEditMyInfoPage = () => {
        Actions.UserInfoFrom({ connectedUser: user });
    }
    const renderCenterHeader = () => {
        return (
            <Title style={defaultStyle.headerTitle}>
                {Strings.myProfileInfo}
            </Title>
        );
    }
    const renderRightHeader = () => {
        return <Icon name="mode-edit" type="MaterialIcons" style={defaultStyle.editIcon} onPress={openEditMyInfoPage} />;
    }
    return (
        <Container >
            <Header containerStyle={defaultStyle.headerBgColor} rightComponent={renderRightHeader} centerComponent={renderCenterHeader} />
            <View style={defaultStyle.imageView}>
                <ImageBackground
                    style={defaultStyle.backgroundImg}
                    imageStyle={defaultStyle.imageBackgroundStyle}
                    source={{
                        uri: contact.imageURL,
                    }}
                >
                    <View style={defaultStyle.detailsInfo}>
                        <View style={defaultStyle.imageHolderContainer}>
                            <ImageHolder url={contact.imageURL} name={contact.name} style={imageHolderStyle} />
                        </View>
                        <PresenceIcon
                            presence={contact.presence}
                            style={defaultStyle.presenceIcon}
                        />
                        <View style={defaultStyle.titleContainer}>
                            <Text style={defaultStyle.contactName}>
                                {contact.name}
                            </Text>
                            <Text style={defaultStyle.text}>{contact.jobTitle}</Text>
                            <Text style={defaultStyle.text}>{contact.companyName}</Text>
                            <Text style={defaultStyle.text}>{Strings.presenceOption[contact.presence]}</Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>
            <View>
                <FlatList
                    data={contact.emails}
                    renderItem={renderEmailItem}
                    keyExtractor={setKeyExtractor}
                />
                <FlatList
                    data={contact.phoneNumbers}
                    renderItem={renderPhoneItem}
                    keyExtractor={setKeyExtractor}
                />
                <ListItem style={defaultStyle.listItem}>
                    <Body>
                        <View style={defaultStyle.itemBody}>
                            <Text note={true}>
                                {Strings.servicePlane}
                            </Text>
                            <Text >{servicePlane}</Text>
                        </View>
                    </Body>
                </ListItem>
            </View>
        </Container>
    );
};


const defaultStyle = StyleSheet.create({
    presenceIcon: {
        width: 15,
        height: 15,
        position: 'absolute',
        zIndex: 2,
        top: 90,
        marginLeft: 90,
    },
    backgroundImg: {
        width: '100%',
        height: '100%',
    },
    detailsInfo: {
        display: 'flex',
        flexDirection: 'row',
        zIndex: 2,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 15,
        margin: 2
    },
    imageView: {
        width: '100%',
        height: 150,
        backgroundColor: '#808080',
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexShrink: 1,
        margin: 10
    },
    profilePic: {
        width: 100,
        height: 100,
        margin: 25,
        borderRadius: 50,
    },
    itemBody: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    icon: {
        fontSize: 30,
        color: 'gray',
    },
    contactName: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#ffffff',
    },
    headerTitle: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 16,
        color: '#ffffff',
    },
    headerBgColor: {
        backgroundColor: '#0086CF'
    },
    removeText: {
        color: 'white',
        fontWeight: 'bold'
    },
    imageBackgroundStyle: {
        opacity: 0.2
    },
    imageHolderContainer: {
        width: 60, height: 70, margin: 25,
    },
    editIcon: {
        color: '#ffffff',
    },
    listItem: {
        margin: 5, backgroundColor: '#FFFFFF'
    }
});

const imageHolderStyle: IImageHolderStyle = {
    thumbnail: {
        position: 'absolute',
        zIndex: 2,
        width: 80,
        height: 80,
        borderRadius: 60
    },
    thumbnailContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 60,
        width: 80,
        height: 80,
        padding: 10
    },
    imageTextStyle: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold'
    }
}


