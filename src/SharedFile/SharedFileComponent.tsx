import {
    Container,
    Icon,
    ListItem,
    Radio,
    Text,
    Title,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { Strings } from '../resources/localization/Strings';
import { IPeer, SharedFiles, IFile, sharedFilesService, EventType, eventEmitter, PeerType, SortFilters, Header } from 'react-native-rainbow-module';

import { Actions } from 'react-native-router-flux';
export interface IProps {
    peer: IPeer
}

export const SharedFileComponent: React.FunctionComponent<IProps> = ({
    peer
}) => {
    const [sharedFileArray, setSharedFileArray] = useState<IFile[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const isBubble = peer.type === PeerType.Bubble;
    const [showModal, setShowModal] = useState<boolean>(false);
    const [sortOption, setSortOption] = useState<string>(SortFilters.Date)
    const sortOptions = [SortFilters.Date, SortFilters.Name, SortFilters.Size];
    useEffect(() => {
        sharedFilesService.fetchAllSharedFilesInPeer(peer.jId, isBubble);
        const sharedFileWithPeerResult = eventEmitter.addListener(
            EventType.GetAllSharedFileWithPeerResult,
            (eventData: IFile[]) => {
                console.log(`GetAllSharedFileWithPeerResult with file count ${eventData.length}`);
                setSharedFileArray(eventData);
                setIsLoading(false);

            }
        );

        return () => {
            sharedFileWithPeerResult.remove();
        }
    }, [isBubble, peer]);
    const renderOnFileClicked = (selectedFile: IFile) => {
        Actions.FileDescription({ file: selectedFile });
    }

    const sortByName = () => {
        sharedFileArray.sort((a: IFile, b: IFile) => a.name.localeCompare(b.name))
        console.log(sharedFileArray.length)

    }
    const sortBySize = () => {
        sharedFileArray.sort((a: IFile, b: IFile) => a.size.toString().localeCompare(b.size.toString(), undefined, { numeric: true }))
    }
    const sortByDate = () => {
        sharedFileArray.sort((a: IFile, b: IFile) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            const result = dateA.getTime() - dateB.getTime();
            return result;
        });
    }
    const showModalView = () => {
        console.log(showModal + 'now' + !showModal)
        setShowModal(!showModal);
    }
    const onSortFilterSelected = (filter: string) => () => {
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
    }
    const renderCenterHeader = () => {
        return <Title style={defaultStyle.headerTitle}> {Strings.showChatFilesTitle}</Title>;
    }
    const renderRightHeader = () => {
        return <Icon name="sort" type="MaterialIcons" onPress={showModalView} style={defaultStyle.sortIcon} />
    }
    return (
        <Container>
            <Header containerStyle={defaultStyle.headerStyle} centerComponent={renderCenterHeader} rightComponent={renderRightHeader} />
            <View style={defaultStyle.container} >
                <SharedFiles
                    peer={peer}
                    onFileItemClicked={renderOnFileClicked} sharedFileArray={sharedFileArray} isLoading={isLoading} />
            </View>
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
                            {sortOptions.map((option: string) => {
                                return (
                                    <ListItem
                                        onPress={onSortFilterSelected(option)}
                                        key={option}
                                        style={defaultStyle.radioContainer}
                                    >
                                        <Radio
                                            style={defaultStyle.radioButton}
                                            selectedColor="#0086CF"
                                            onPress={onSortFilterSelected(option)}
                                            selected={sortOption === option}
                                        />
                                        <Text >
                                            {option}
                                        </Text>
                                    </ListItem>
                                );
                            })}
                        </View>
                    </View>
                </TouchableOpacity>


            </Modal>
        </Container>
    );
};




const defaultStyle = StyleSheet.create({
    container: { flex: 1, },
    headerTitle: { textAlign: 'center', alignSelf: 'center', fontSize: 16, color: '#ffffff', },
    headerStyle: { backgroundColor: '#0086CF' },
    fileItemContainer: { flexDirection: 'row', margin: 10 },
    fileItemImage: { width: 50, height: 50 },
    fileItemInfoView: { flexDirection: 'column', justifyContent: 'space-between', padding: 10 },
    fileItemName: { fontSize: 18 },
    fileItemDate: { fontSize: 14, color: 'gray' },
    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', },
    modalView: {
        width: '70%',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginLeft: 30,
        marginRight: 30

    },
    modalTitleText: { textAlign: 'center', fontSize: 22, color: '#3B3B3B', margin: 10 },
    BodyContainer: { marginLeft: 20 },
    radioButton: { alignSelf: 'flex-start', margin: 10 },
    radioContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    sortIcon: { fontSize: 30, color: '#ffffff', }
});
