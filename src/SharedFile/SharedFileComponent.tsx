import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Strings } from '../resources/localization/Strings';
import { IPeer, SharedFiles, IFile, sharedFilesService, EventType, eventEmitter, PeerType, SortFilters, Header, Logger } from 'react-native-rainbow-module';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SharedFileListNavigationProp, SharedFileListRouteProp } from '../Navigation/AppNavigationTypes';
import { RadioButton } from 'react-native-paper';
import { styles } from '../Calls/P2PCalls/P2PCall';

const logger = new Logger('SharedFileComponent');
export interface IProps {
    route: SharedFileListRouteProp
    navigation: SharedFileListNavigationProp
}

export const SharedFileComponent: React.FunctionComponent<IProps> = ({
    route,
    navigation,
}) => {
    const [peer] = useState<IPeer>(route.params.peer);
    const [sharedFileArray, setSharedFileArray] = useState<IFile[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const isBubble = peer.type === PeerType.Bubble;
    const [showModal, setShowModal] = useState<boolean>(false);
    const [sortOption, setSortOption] = useState<string>(SortFilters.Date);
    const sortOptions = [SortFilters.Date, SortFilters.Name, SortFilters.Size];
    useEffect(() => {
        sharedFilesService.fetchAllSharedFilesInPeer(peer.jId, isBubble);
        const sharedFileWithPeerResult = eventEmitter.addListener(
            EventType.GetAllSharedFileWithPeerResult,
            (eventData: IFile[]) => {
                logger.info(`GetAllSharedFileWithPeerResult with file count ${eventData.length}`);
                setSharedFileArray(eventData);
                setIsLoading(false);

            }
        );

        return () => {
            sharedFileWithPeerResult.remove();
        };
    }, [isBubble, peer]);
    const renderOnFileClicked = (selectedFile: IFile) => {
        navigation.navigate('FileDescription', { file: selectedFile });
    };

    const sortByName = () => {
        sharedFileArray.sort((a: IFile, b: IFile) => a.name.localeCompare(b.name));

    };
    const sortBySize = () => {
        sharedFileArray.sort((a: IFile, b: IFile) => a.size.toString().localeCompare(b.size.toString(), undefined, { numeric: true }));
    };
    const sortByDate = () => {
        sharedFileArray.sort((a: IFile, b: IFile) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            const result = dateA.getTime() - dateB.getTime();
            return result;
        });
    };
    const showModalView = () => {
        setShowModal(!showModal);
    };
    const onSortFilterSelected = (filter: string) => {
        switch (filter) {
            case SortFilters.Name:
                sortByName();
                break;
            case SortFilters.Size:
                sortBySize();
                break;
            case SortFilters.Date:
                sortByDate();
                break;
        }
        setSortOption(filter);
        showModalView();
    };
    const renderCenterHeader = () => {
        return <Text style={styles.headerText}>{Strings.showChatFilesTitle} </Text>;
    };
    const renderRightHeader = () => {
        return <Icon name="sort" onPress={showModalView} size={40} />;
    };
    return (
        <>
            <Header containerStyle={defaultStyle.headerStyle} centerComponent={renderCenterHeader} rightComponent={renderRightHeader} />
            <SharedFiles
                peer={peer}
                onFileItemClicked={renderOnFileClicked}
                sharedFileArray={sharedFileArray}
                isLoading={isLoading} />
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={showModalView}
            >
                <TouchableOpacity style={defaultStyle.centeredView} onPressOut={showModalView}>
                    <View style={defaultStyle.modalView}>
                        <Text style={defaultStyle.modalTitleText}>Sort order: </Text>
                        <View >

                            <RadioButton.Group
                                onValueChange={option => onSortFilterSelected(option)}
                                value={sortOption} >
                                {sortOptions.map((option, index) => (
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                                        <RadioButton value={option} />
                                        <Text>{option}</Text>
                                    </View>
                                ))}
                            </RadioButton.Group>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};
const defaultStyle = StyleSheet.create({
    headerStyle: { backgroundColor: '#0086CF' },
    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' },
    modalView: {
        width: '70%',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginLeft: 30,
        marginRight: 30,

    },
    modalTitleText: { textAlign: 'center', fontSize: 22, color: '#3B3B3B', margin: 10 },
    headerText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
