import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ToastAndroid,
  ImageBackground,
  Dimensions,
  Platform,
} from 'react-native';
import React, {useState, useRef} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {apiCall} from './utils/ApiComponent';
import CustomModal from './components/CustomModal';

const PasswordForget = ({navigation}) => {
  const [passwordVisible1, setPasswordVisible1] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const [samePassword, setSamePassword] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordTrue, setPasswordTrue] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isVisible1, setIsVisible1] = useState(false);
  const [errorMessage, setErrrorMessage] = useState('');
  const [type,setType] = useState('')

  const handleOtp = async otpDigits => {
    setType('')
    setErrrorMessage('');
    setIsVisible(true);
    const otpString = otpDigits.join('');
    console.log(otpString, otpDigits, 'kkk');
    const header = {'Content-Type': 'application/json'};
    const subUri = '/user/updateForgetPassword';
    const method = 'post';
    const data = {
      otp: otpString,
      password: password,
    };
    try {
      const response = await apiCall(header, subUri, method, data);
        console.log(response.data.message,'lllkksdf')
      if (response.status == 200 || response.status == 201) {
        console.log(response.data, ' data in calling');
        setType('success')
        setErrrorMessage(response?.data?.message);
        setIsVisible1(true);;
        // navigation.navigate('Login');
        setIsVisible(false);
      } else {
        setType('error')
        setIsVisible(false);
        setIsVisible1(true);
        setErrrorMessage(response?.data?.error);
        // Alert.alert(response?.data?.error);
      }
    } catch (err) {
      if (err.response.data.error) {
        setIsVisible(false);
        // Alert.alert(err.response.data.error);
        setType('error')
        setErrrorMessage(err.response.data.error);
        setIsVisible1(true);
        console.log(err, 'error in catch if ');
      } else {
        setIsVisible(false);
        setType('error')
        setErrrorMessage(err.message);
        setIsVisible1(true);
        // Alert.alert(err.message);
      }
    }
  };
  const isPasswordTrue = password => {
    const capitalRegex = /[A-Z]/;
    const smallRegex = /[a-z]/;
    const symbolRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    const digitRegex = /[0-9]/;

    const hasCapital = capitalRegex.test(password);
    const hasSmall = smallRegex.test(password);
    const hasSymbol = symbolRegex.test(password);
    const hasDigit = digitRegex.test(password);

    return (
      hasCapital && hasSmall && hasSymbol && hasDigit && password.length > 7
    );
  };
  const resendOtp = async () => {
    try {
      console.log('resendOTP Try block');
      const response = await resOtp(userId);
      Alert.alert('Otp Sent');
    } catch {
      console.log('resendOTP catch block');
      Alert.alert('Error Occured');
    }
  };

  // const textEdit1 = useRef();
  // const textEdit2 = useRef();
  // const textEdit3 = useRef();
  // const textEdit4 = useRef();

  const numberOfOtpFields = 4; // Corrected to 4 for a 4-digit OTP
  const otpInputRefs = useRef([]);

  // Store the OTP digits in state
  const [otpDigits, setOtpDigits] = useState(
    new Array(numberOfOtpFields).fill(''),
  );

  // Helper function to focus the next OTP input field
  const focusNextField = index => {
    if (index < numberOfOtpFields - 1) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  // Helper function to focus the previous OTP input field
  const focusPreviousField = index => {
    if (index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  // Handle OTP input change
  const handleOtpInputChange = (index, value) => {
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    // Move focus to the next input field
    if (value && index < numberOfOtpFields - 1) {
      focusNextField(index);
    }
  };

  // Handle OTP input deletion
  const handleOtpInputDelete = (index, value) => {
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    // Move focus to the previous input field
    if (index > 0) {
      focusPreviousField(index);
    }
  };

  const {height, width} = Dimensions.get('screen');

  return (
    <>
      <Modal animationType="fade" visible={isVisible} transparent={true}>
        <View style={[styles.modalView]}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size="large" color="#9004fd" />
          </View>
        </View>
      </Modal>
      <ImageBackground
        source={require('./Images/backimage.png')}
        style={{height: height, width: width}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.wlcmcontainer}>
            <Text style={styles.wlcmtext}>Enter OTP</Text>
          </View>
          <View style={[styles.textInputContainer, {}]}>
            <View style={styles.outinputview}>
              <View style={[styles.container2, {marginBottom: 25}]}>
                {otpDigits.map((digit, index) => (
                  <TextInput
                    secureTextEntry
                    key={index}
                    style={[
                      styles.input,
                      {
                        height: Platform.OS === 'ios' ? 55 : null,
                        width: 55,
                        textAlign: 'center',
                        borderColor: '#38ACE9',
                      },
                    ]}
                    value={digit}
                    onChangeText={value => {
                      handleOtpInputChange(index, value);
                      console.log(otpDigits);
                    }}
                    onKeyPress={({nativeEvent}) => {
                      if (nativeEvent.key === 'Backspace') {
                        handleOtpInputDelete(index, '');
                      }
                    }}
                    ref={ref => (otpInputRefs.current[index] = ref)}
                    keyboardType="numeric"
                    maxLength={1}
                  />
                ))}
              </View>
              <View style={[styles.outinputview, {marginTop: 10}]}>
                <View style={styles.lableouter}>
                  <Text style={styles.lable}>Password</Text>
                </View>
                <TextInput
                  secureTextEntry={passwordVisible1}
                  style={
                    samePassword && passwordTrue
                      ? styles.input
                      : styles.falseInput
                  }
                  placeholder=""
                  onChangeText={text => {
                    setPassword(text);
                    setPasswordTrue(isPasswordTrue(text));
                    if (text !== confirmPassword) {
                      setSamePassword(false);
                    } else {
                      setSamePassword(true);
                    }
                  }}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 15,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    setPasswordVisible1(!passwordVisible1);
                  }}>
                  {passwordVisible1 ? (
                    <Ionicons name="eye-off" size={25} />
                  ) : (
                    <Ionicons name="eye" size={25} />
                  )}
                </TouchableOpacity>
              </View>
              {password && (
                <View>
                  {!passwordTrue && (
                    <Text style={{color: 'red'}}>
                      {' '}
                      Password should be atleast 8 characters long and must
                      contain numbers, characters, capital and minimal letters.
                    </Text>
                  )}
                </View>
              )}
              <View style={[styles.outinputview]}>
                <View style={styles.lableouter}>
                  <Text style={styles.lable}>ConfirmPassword</Text>
                </View>
                <TextInput
                  secureTextEntry={passwordVisible2}
                  style={
                    samePassword && passwordTrue
                      ? styles.input
                      : styles.falseInput
                  }
                  placeholder=""
                  onChangeText={text => {
                    setConfirmPassword(text);
                    if (text !== password) {
                      setSamePassword(false);
                    } else {
                      setSamePassword(true);
                    }
                  }}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 15,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    setPasswordVisible2(!passwordVisible2);
                  }}>
                  {passwordVisible2 ? (
                    <Ionicons name="eye-off" size={25} />
                  ) : (
                    <Ionicons name="eye" size={25} />
                  )}
                </TouchableOpacity>
              </View>
              {!samePassword && (
                <View>
                  <Text style={{color: 'red'}}>Passwords do not match.</Text>
                </View>
              )}
            </View>
            <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
              <Pressable
                style={
                  passwordTrue && password && confirmPassword && samePassword
                    ? [styles.LoginButton]
                    : [styles.falseLoginButton]
                }
                activeOpacity={0.8}
                onPress={() => {
                  if (password.length == '' && confirmPassword.length == '') {
                    setType('error')
                    setErrrorMessage(
                      'Password can not be Empty!',
                    );

                    setIsVisible1(true);
                  } else if (password.length < 8 || samePassword.length < 8) {
                    setType('error')
                    setErrrorMessage(
                      'Password must atleast be 8 characters minimum',
                    );
                    setIsVisible1(true);
                  } else {
                    passwordTrue && password && confirmPassword && samePassword
                      ? handleOtp(otpDigits)
                      : null;
                  }
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: 17,
                    fontWeight: '500',
                  }}>
                  Submit
                </Text>
                <AntDesign name="right" size={20} color="#fff" />
              </Pressable>
            </View>
          </View>
          <CustomModal
            MainTitle={errorMessage}
            isVisible1={isVisible1}
            setIsVisible1={setIsVisible1}
            type={type}
            OkButtonPressed={()=>{navigation.navigate('Login'),setIsVisible1(!isVisible1)}}
          />
        </ScrollView>
      </ImageBackground>
    </>
  );
};

export default PasswordForget;

const styles = StyleSheet.create({
  modalView: {
    width: '100%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  wlcmcontainer: {
    paddingBottom: 20,
    marginTop: 45,
    paddingHorizontal: 15,
  },
  wlcmtext: {
    fontSize: 25,
    fontWeight: '500',
    color: '#38ACE9',
    paddingBottom: 5,
  },
  continuetext: {
    fontSize: 15,
    color: '#fff',
  },
  textInputContainer: {
    paddingHorizontal: 15,
    paddingVertical: 25,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  outinputview: {
    paddingVertical: 10,
    position: 'relative',
  },
  lableouter: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
  },
  lable: {
    fontWeight: '500',
    color: 'gray',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    fontWeight: '500',
    height: Platform.OS === 'ios' ? 50 : null,
  },
  LoginButton: {
    paddingVertical: 13,
    width: '50%',
    backgroundColor: '#38ACE9',
    borderTopEndRadius: 100,
    borderBottomEndRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  sign: {
    textAlign: 'center',
    paddingVertical: 15,
    color: '#fff',
    fontWeight: '500',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  falseInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'red',
    paddingHorizontal: 15,
    fontWeight: '500',
    height: Platform.OS === 'ios' ? 50 : null,
  },
  falseLoginButton: {
    paddingVertical: 13,
    width: '50%',
    backgroundColor: '#565656',
    borderTopEndRadius: 100,
    borderBottomEndRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  modalView: {
    backgroundColor: '#3c40434d',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    flex: 1,
  },
});
