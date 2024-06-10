import {Text, VStack} from 'native-base';
import React, {useState} from 'react';
import {Image} from 'react-native';
import {Strings} from '../resources/localization/Strings';
import {Header, IFile} from 'react-native-rainbow-module';
import fileLogo from '../resources/images/attachedFile.png';
import moment from 'moment';
import {FileDescriptionRouteProp} from '../Navigation/AppNavigationTypes';

export interface IProps {
  route: FileDescriptionRouteProp;
}
export const FileDescription: React.FunctionComponent<IProps> = ({route}) => {
  const [file] = useState<IFile>(route.params?.file);

  const renderBodyHeader = () => {
    return (
      <Text fontSize="md" color="white">
        {' '}
        {Strings.Files}
      </Text>
    );
  };
  const displayPreview = (imagePreview: string) => {
    if (imagePreview == null) return fileLogo;
    else return {uri: `data:image/png;base64,${imagePreview}`};
  };

  return (
    <>
      <Header
        containerStyle={{backgroundColor: '#0086CF'}}
        centerComponent={renderBodyHeader}
      />
      <VStack
        space={5}
        justifyContent="space-between"
        p="5"
        alignItems="center">
        <Image
          resizeMode="cover"
          resizeMethod="scale"
          style={{width: 60, height: 60}}
          source={displayPreview(file.ImagePreview)}
        />

        <Text>{file.name}</Text>
        <Text>{file.owner.name}</Text>
        <Text>{moment(Number(file.date)).format('MMM DD, YYYY')}</Text>

        <Text fontSize="xs">{file.size}</Text>
      </VStack>
    </>
  );
};
