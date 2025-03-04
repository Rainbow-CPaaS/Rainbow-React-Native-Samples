import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { authService, eventEmitter, EventType, Logger, Strings, useAppSelector,ForgotPwdErrorCode } from 'react-native-rainbow-module';
import { Button, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const logger = new Logger('ForgotPassword');

export const ForgotPassword: React.FunctionComponent = ({

}) => {
  const appIcon = useAppSelector((state) =>{state.appConfigReducer.appIconBase64;});
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [switchToEmailCode, setSwitchToEmailCode] = useState<boolean>(false);
  const [showInProgressDialog, setShowInProgressDialog] = useState<boolean>(false);
  const navigation = useNavigation();

  const handleForgetPwdEmailResult = (result: string) => {
    logger.info(`ForgetPwdEmailResult: ${result}`);
    if (result == null) {
      setSwitchToEmailCode(true);
    } else {
      const forgotPwdEmailRes = result as keyof typeof ForgotPwdErrorCode;
      setSwitchToEmailCode(false);
      Alert.alert(
       'restPwdErrorTitle',
       forgotPwdEmailRes as string      );
    }
  };
  const handleResetPswResult = (result: string) => {
    logger.info(`ResetPswResult: ${result}`);
    setShowInProgressDialog(false);
    if (result == null) {
        authService.silentLogin();
     authService.saveCredentilals(email, newPassword );
    } else {
      const resetPwdError = result as keyof typeof ForgotPwdErrorCode;
      Alert.alert(
        'restPwdErrorTitle',
        resetPwdError as string
      );
    }
  };
  useEffect(() => {
    const forgetPwdEmailResultListener = eventEmitter.addListener(
      EventType.ForgetPwdEmailResult,
      handleForgetPwdEmailResult
    );
    const resetPswResultListener = eventEmitter.addListener(EventType.ResetPswResult, handleResetPswResult);
    return () => {
      forgetPwdEmailResultListener.remove();
      resetPswResultListener.remove();
    };
  });

  const onForgotPwdContinueClicked = () => {
    logger.info(
      `onForgotPwdContinueClicked: switchToEmailCode${switchToEmailCode}`
    );
    if (switchToEmailCode) {
      if (isValidCode()) {
        authService.resetUserPassword(verificationCode , newPassword);
        setShowInProgressDialog(true);
      } else {
        Alert.alert('invalidInput', 'validCode');
      }
    } else {
      if (isValidEmail()) {
        authService.sendResetPasswordEmail(email);
      } else {
        Alert.alert('invalidInput', 'validEmail');
      }
    }
  };
  const isValidEmail = () => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidCode = () => {
    return verificationCode === '' || verificationCode.length < 6
      ? false
      : true;
  };
  const handleEmailChange = (emailChange: string) => {
    setEmail(emailChange);
  };

  const handlePasswordChange = (passwordChange: string) => {
    setNewPassword(passwordChange);
  };

  const handleVerificationCodeChange = (verificationCodeChange: string) => {
    setVerificationCode(verificationCodeChange);
  };

  const goBackToLogin = () => {
    navigation.navigate('Login');
  };

  const emailAddressView = (
    <View style={styles.section}>
      <Text style={styles.title}>{Strings.forgotPwd}</Text>
      <Text style={styles.message}>{Strings.forgotPwdMsg1}</Text>
      <Text style={styles.message}>{Strings.forgotPwdMsg2}</Text>
      <TextInput
        mode="outlined"
        label={Strings.username}
        placeholder={Strings.username}
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        left={<TextInput.Icon icon="email" />}
        style={styles.input}
      />
    </View>
  );

  const verificationCodeView = (
    <View style={styles.section}>
      <Text style={styles.title}>{Strings.checkInbox}</Text>
      <Text style={styles.message}>{Strings.verificationCodeMsg}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          label={Strings.verificationCode}
          placeholder={Strings.verificationCode}
          value={verificationCode}
          onChangeText={handleVerificationCodeChange}
          keyboardType="numeric"
          maxLength={6}
          style={styles.verificationInput}
        />
        <TextInput
          mode="outlined"
          label={Strings.password}
          placeholder={Strings.password}
          value={newPassword}
          onChangeText={handlePasswordChange}
          secureTextEntry
          style={styles.verificationInput}
        />
      </View>
    </View>
  );
  return (
    <View style={styles.container}>

      <Image style={{ width: 120, height: 120 }} source={{ uri: `data:image/png;base64,${appIcon}` }} />

      {switchToEmailCode ? verificationCodeView : emailAddressView}

      <Button mode="contained" onPress={onForgotPwdContinueClicked} style={styles.button}>
      {Strings.continue}
    </Button>

    <View style={styles.footer}>
      <Text style={styles.footerText}>{Strings.alreadyHaveAccount}</Text>
      <Text style={styles.loginText} onPress={goBackToLogin}>{Strings.login}</Text>
    </View>

      {/* <InProgressDialog
        showDialog={showInProgressDialog}
        message={Strings.InProgressMsg}
        title={Strings.InProgress}
      /> */}
     </View>
);
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  title: {
    color: 'gray',
    fontSize: 18,
    marginBottom: 10,
  },
  message: {
    color: 'gray',
    fontSize: 14,
    marginBottom: 5,
  },
  appIcon: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  input: {
    width: '100%',
  },
  verificationInput: {
    width: '75%',
    marginVertical: 10,
  },
  inputContainer: {
    alignItems: 'center',
    width: '100%',
  },
  button: {
    marginTop: 20,
    width: '75%',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: 'gray',
  },
  loginText: {
    color: '#0086CF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
