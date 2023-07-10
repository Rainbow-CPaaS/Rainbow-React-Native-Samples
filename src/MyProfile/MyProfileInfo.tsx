import React, { useEffect, useState } from 'react';
import { View, Text, HStack, VStack, Heading } from 'native-base';
import { ImageBackground, StyleSheet } from 'react-native';
import { IUser, EmailType, IEmail, IPhoneNumber, PhoneType, eventEmitter, EventType, Header, AvatarPresenceBadge } from 'react-native-rainbow-module';
import { Strings } from '../resources/localization/Strings';
import Icon from 'react-native-vector-icons/Ionicons';
import { MyProfileInfoNavigationProp, MyProfileInfoRouteProp } from '../Navigation/AppNavigationTypes';

export interface IProps {
    route: MyProfileInfoRouteProp;
    navigation: MyProfileInfoNavigationProp;
}

export const MyProfileInfo: React.FunctionComponent<IProps> = ({
    navigation,
    route
}) => {
    const connectedUser = route.params?.connectedUser;
    const [user, setUser] = useState<IUser>(connectedUser);
    const { contact, licenses } = user;
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
    const renderEmailItem = (item: IEmail) => {
        return (
            <HStack p="3" key={item.value}>
                <Icon name="mail-sharp" size={30} color="#0086CF" />
                <VStack ml="3">
                    <Text color="lightBlue.600">
                        {Strings.emailStrings[item.type as keyof typeof EmailType]}
                    </Text>
                    <Text >{item.value}</Text>
                </VStack>
            </HStack>
        );
    }
    const renderPhoneItem = (item: IPhoneNumber) => {
        return (
            <HStack p="3" key={item.value}  >
                <Icon name="md-phone-portrait-outline" size={30} color="#0086CF" />
                <VStack ml="3">
                    <Text color="lightBlue.600">
                        {Strings.phoneStrings[item.type as keyof typeof PhoneType]}
                    </Text>
                    <Text color="black">{item.value}</Text>
                </VStack>
            </HStack>
        );
    }
    const openEditMyInfoPage = () => {
        navigation.navigate('UserInfoFrom', { connectedUser: user })
    }
    const renderCenterHeader = () => {
        return <Text color="white" fontSize="md"> {Strings.myProfileInfo}</Text>

    }
    const renderRightHeader = () => {
        return <Icon name="pencil-outline" size={35} color='white' onPress={openEditMyInfoPage} />;
    }
    return (
        <>
            <Header containerStyle={defaultStyle.headerBgColor} rightComponent={renderRightHeader} centerComponent={renderCenterHeader} />
            <View style={defaultStyle.imageView}>
                <ImageBackground
                    style={defaultStyle.backgroundImg}
                    imageStyle={defaultStyle.imageBackgroundStyle}
                    source={{
                        uri: contact.imageURL,
                    }}>
                    <HStack space={2} justifyContent="flex-start" p="10">
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
            <VStack space={3}>
                {contact.emails.map((item: IEmail) => renderEmailItem(item))}
                {contact.phoneNumbers.map((item: IPhoneNumber) => renderPhoneItem(item))}
                <HStack alignItems="center" px={5} >
                    <Text fontSize="md" fontWeight="bold" color="lightBlue.600">{Strings.servicePlane} : </Text>
                    {licenses.map((item: string) => <Text fontSize="xs" fontWeight="500" key={item}>{item} , </Text>)}

                </HStack>
            </VStack>
        </>
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

