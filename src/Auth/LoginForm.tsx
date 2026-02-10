import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Keychain from 'react-native-keychain';
import { authService, Logger, useAppSelector, AuthErrorCode, ApplicationInformation } from 'react-native-rainbow-module';
import { useNavigation } from '@react-navigation/native';
import { Button, TextInput } from 'react-native-paper';
import { Strings } from '../resources/localization/Strings';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CombinedRootStackParamList } from '../Navigation/AppNavigationTypes';

const logger = new Logger('LoginForm');
type RegistrationScreenNavigationProp = NativeStackNavigationProp<
  CombinedRootStackParamList,
  'ForgotPassword'
>;
export const LoginForm: React.FunctionComponent = () => {
  const authResponseMsg = useAppSelector((state: any) => state.authReducer.responseMsg);
  const appIcon = useAppSelector((state: any) => state.appConfigReducer.appIconBase64);
  const isMounted = useRef<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [clicksCount, setClicksCount] = useState<number>(0);
  const navigation = useNavigation<RegistrationScreenNavigationProp>();

  useEffect(() => {
    isMounted.current = true;
    getCachedCredentials();
    return () => {
      isMounted.current = false;
    }
  }, []);

  const doLogin = () => {
    if (!isValidEmail() || !password) {
      Alert.alert('invalidInput', 'Strings.validEmail');
      return;
    }

    authService.login(email, password);
    Keychain.setGenericPassword(email, password);

  };
  const isValidEmail = () => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailChange = (emailChange: string) => {
    setEmail(emailChange);
  };

  const handlePasswordChange = (passwordChange: string) => {
    setPassword(passwordChange);
  };

  const onLogoPress = () => {
    logger.info(`Clicks count ${clicksCount}`);
    setClicksCount(clicksCount + 1);
    if (clicksCount === 4) {
      setClicksCount(0);
      setModalVisible(true);
    }
  };

  const onCancelPress = () => {
    setModalVisible(false);
  };

  const getCachedCredentials = async () => {

    try {
      const credentials = await Keychain.getGenericPassword();
      logger.info(`getCachedCredentials:${credentials}`);
      if (isMounted.current) {
        if (credentials) {
          setEmail(credentials.username);
          setPassword(credentials.password);
        }
      }
    } catch (error) {
      logger.error(`Keychain error: ${error}`);
    }
  };

  const goToForgotPwd = () => {

      navigation.navigate('ForgotPassword');
   };
  return (
    <View style={styles.container}>
    {/* App Logo */}
    <TouchableOpacity onPress={onLogoPress} style={styles.logoContainer}>
      <Image
        style={styles.logo}
        source={{ uri: `data:image/png;base64,${appIcon}` }}
      />
    </TouchableOpacity>

    {/* Input Fields */}
    <TextInput
      label={'username'}
      mode="outlined"
      placeholder={'username'}
      placeholderTextColor="#aaa"
      value={email}
      onChangeText={handleEmailChange}
      keyboardType="email-address"
      autoCapitalize="none"
      style={styles.input}
      theme={{ colors: { primary: '#0086CF', placeholder: '#aaa' } }}
    />
    <TextInput
      label={'password'}
      mode="outlined"
      placeholder={'password'}
      placeholderTextColor="#aaa"
      value={password}
      onChangeText={handlePasswordChange}
      secureTextEntry
      style={styles.input}
      theme={{ colors: { primary: '#0086CF', placeholder: '#aaa' } }}
    />

    {/* Error Message */}
    {authResponseMsg && (
      <Text style={styles.errorText}>
        {Strings.AuthErrorCode[authResponseMsg as keyof typeof AuthErrorCode]}
      </Text>
    )}

    {/* Forgot Password */}
    <Text style={styles.forgotPasswordText} onPress={goToForgotPwd}>
      {Strings.forgotPwd}
    </Text>

    {/* Register Link */}
    <View style={styles.registerContainer}>
  <Text style={styles.registerText}>
    {Strings.dontHaveAccount}{''}
    <Text 
      style={styles.registerLink}
      onPress={() => navigation.navigate('Registration' as never)}
    >
      {Strings.registerNow}
    </Text>
  </Text>
</View>
    {/* Login Button */}
    <Button
      mode="contained"
      onPress={doLogin}
      style={styles.button}
      labelStyle={styles.buttonText}
    >
      {Strings.login}
    </Button>
    {/* Application Information Modal */}
    <ApplicationInformation visible={modalVisible} closeModal={onCancelPress} /> 
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 32,
  backgroundColor: '#F9F9F9',
},
logoContainer: {
  marginBottom: 30,
  alignItems: 'center',
},
logo: {
  width: 120,
  height: 120,
  borderRadius: 15,
  marginBottom: 40,
},
input: {
  width: '100%',
  marginBottom: 15,
  backgroundColor: '#FFF',
  borderRadius: 15,

},
errorText: {
  color: '#FF4D4F',
  fontSize: 13,
  marginBottom: 10,
  textAlign: 'center',
},
forgotPasswordText: {
  color: '#0086CF',
  fontSize: 14,
  fontWeight: '600',
  textAlign: 'center',
  marginBottom: 20,
},
button: {
  width: '100%',
  borderRadius: 10,
  paddingVertical: 10,
  elevation: 3,
  backgroundColor: '#0086CF',
},
buttonText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#FFF',
},
registerContainer: {
  margin: 20,
  alignItems: 'center',
},
registerText: {
  color: '#666',
  fontSize: 14,
},
registerLink: {
  color: '#007AFF',
  fontWeight: 'bold',
},
});
