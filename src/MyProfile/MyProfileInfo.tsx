import React, { useEffect, useState } from 'react';
import { View, Text, Container, HStack, VStack, Center, Heading } from 'native-base';
import { FlatList, ImageBackground, StyleSheet } from 'react-native';
import { IUser, EmailType, IEmail, IPhoneNumber, PhoneType, eventEmitter, EventType, Header, AvatarPresenceBadge } from 'react-native-rainbow-module';
import { Actions } from 'react-native-router-flux';
import { Strings } from '../resources/localization/Strings';
import Icon from 'react-native-vector-icons/MaterialIcons';


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
            <HStack space={2}>
                <Icon name="mail" size={35} color='gray' />
                <VStack justifyContent="center"  >
                    <Text size="sm">
                        {' '}
                        {Strings.emailStrings[item.type as keyof typeof EmailType]}{' '}
                    </Text>
                    <Text >{item.value}</Text>
                </VStack>
            </HStack>

        );
    }
    const renderPhoneItem = ({ item }: { item: IPhoneNumber }) => {
        if (item.value === '' || item.value === undefined) {
            return null;
        } else {
            return (
                <HStack space={2}>
                    <Icon name="call" size={35} color='white' />
                    <VStack justifyContent="center"  >
                        <Text size="sm">
                            {' '}
                            {Strings.phoneStrings[item.type as keyof typeof PhoneType]}{' '}
                        </Text>
                        <Text >{item.value}</Text>
                    </VStack>
                </HStack>

            );
        }
    }
    const openEditMyInfoPage = () => {
        Actions.UserInfoFrom({ connectedUser: user });
    }
    const renderCenterHeader = () => {
        return <Text color="white" fontSize="md"> {Strings.myProfileInfo}</Text>

    }
    const renderRightHeader = () => {
        return <Icon name="mode-edit" size={35} color='white' onPress={openEditMyInfoPage} />;
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
                >   <HStack space={2} justifyContent="flex-start" p="10">
                        <AvatarPresenceBadge peer={contact} avatarSize="100px" presenceIconSize="20px" presence={contact.presence} />
                        <VStack p="3" space={3}>
                            <Heading size="md" ml="-1">
                                {contact.name}
                            </Heading>
                            <Text fontSize="xs" fontWeight="500" ml="-0.5" mt="-1">{contact.jobTitle}</Text>
                            <Text fontSize="xs" fontWeight="500" ml="-0.5" mt="-1" >{contact.companyName}</Text>
                            <Text fontSize="xs" fontWeight="500" ml="-0.5" mt="-1" >{Strings.presenceOption[contact.presence]}</Text>
                        </VStack>

                    </HStack>
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
                <HStack space={2}>
                    <VStack justifyContent="center"  >
                        <Text>
                            {Strings.servicePlane}
                        </Text>
                        <Text >{servicePlane}</Text>
                    </VStack>
                </HStack>
            </View>
        </Container>
    );
};


const defaultStyle = StyleSheet.create({
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
        backgroundColor: '#0086CF'
    },
    imageBackgroundStyle: {
        opacity: 0.2
    }
});

