import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useAppSelector, authService, eventEmitter, EventType } from 'react-native-rainbow-module';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CombinedRootStackParamList } from '../Navigation/AppNavigationTypes'
type RegistrationScreenNavigationProp = NativeStackNavigationProp<
  CombinedRootStackParamList,
  'Registration'
>;
export const RegistrationForm: React.FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [registrationStep, setRegistrationStep] = useState('email'); // 'email' | 'verification' | 'profile' | 'complete'
  const isLoading = useAppSelector((state) => state.authReducer.isRegistrationInProgress);
  const error = useAppSelector((state) => state.authReducer.registrationError);
  const navigation = useNavigation<RegistrationScreenNavigationProp>();

  useEffect(() => {
    const registerByEmaiListener = eventEmitter.addListener(
      EventType.RegisterByEmailResult,
      (result: boolean) => {
        if (result) {
          setRegistrationStep('verification');
        } else {
          Alert.alert('Registration failed', 'Please try again');
        }
      }
    )
    const validateRegistrationTokenListner = eventEmitter.addListener(
      EventType.ValidationTokenResult, (result: {sucess: boolean, error: String}) =>{
        if (result.sucess){
          setRegistrationStep('profile')
        }else{
        Alert.alert('Verification Failure', error || 'An unknown error occurred');

        }
      }
    );
    return () => {
      registerByEmaiListener.remove();
      validateRegistrationTokenListner.remove();
    }
  },[registrationStep])
  console.log("registrationStep", registrationStep)

    const goToLoginPage= () => {
    
      navigation.navigate('Login');
   };

  const handleSubmit = async () => {
    if (registrationStep === 'email') {
      // Basic email validation

      if (!/\S+@\S+\.\S+/.test(email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address');
        return;
      }
      authService.registerByEmail(email)
    } else if (registrationStep === 'verification') {
      authService.validateRegistrationToken({
        token: verificationCode,
        email,
        password
      })
      if (!verificationCode) {
        Alert.alert('Verification Required', 'Please enter the verification code sent to your email');
        return;
      }
    
    } else if (registrationStep === 'profile') {
      if (!firstName || !lastName || !country) {
        Alert.alert('Missing Information', 'Please fill in all required fields');
        return;
      }
      
      try {
        await authService.createAccount({
          email,
          password,
          firstName,
          lastName,
          verificationCode,
          country,
          // Optional fields
          phoneNumber: '',
          companyName: '',
          jobTitle: ''
        });
        // On successful registration, the user will be redirected by the parent component
      } catch (err) {
        console.error('Registration failed:', err);
      }
    }
  };

  const renderStep = () => {
    switch (registrationStep) {
      case 'email':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.hint}>Expected format: name@example.com</Text>
          </View>
        );
      case 'verification':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Please check your inbox!</Text>
            <Text style={styles.subtitle}>We have sent you an e-mail with a 6-digit verification code</Text>
            
            <Text style={[styles.label, { marginTop: 20 }]}>Verification code</Text>
            <TextInput
              style={styles.input}
              value={verificationCode}
              onChangeText={setVerificationCode}
              placeholder="Enter verification code"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              maxLength={6}
            />
            
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              placeholderTextColor="#999"
              secureTextEntry
            />
            <Text style={styles.hint}>Your password must be at least 12 characters long and contain:
              {'\n'}• 1 lowercase letter
              {'\n'}• 1 uppercase letter
              {'\n'}• 1 number
              {'\n'}• 1 special character</Text>
          </View>
        );
      case 'profile':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>First name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              placeholderTextColor="#999"
            />
            
            <Text style={styles.label}>Last name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              placeholderTextColor="#999"
            />
            
            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
              placeholder="Select your country"
              placeholderTextColor="#999"
            />
          </View>
        );
      case 'complete':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Registration Complete!</Text>
            <Text style={styles.subtitle}>Your account has been created successfully.</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderStep()}
      
      {registrationStep !== 'complete' && (
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Processing...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      )}
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={goToLoginPage}>
          <Text style={styles.footerLink}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  stepContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0066FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#99C2FF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#FF3B30',
    marginTop: 10,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
  },
  footerLink: {
    color: '#0066FF',
    fontWeight: '500',
  },
});