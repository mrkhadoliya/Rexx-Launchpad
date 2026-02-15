import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Button,
  Alert,
  ToastAndroid,
  ImageBackground,
  Pressable,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import DatePicker from 'react-native-date-picker';
import global from '../../global';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import CustomModal from './components/CustomModal';
import OTPTextView from 'react-native-otp-textinput';
import {
  setAdharcardData,
  setisKycVerified,
  setpandcardData,
} from './Redux-Toolkit/Slices/AuthSlices/AuthSlices';
import {apiCall} from './utils/ApiComponent';

const KycScreen = ({navigation}) => {
  const token = useSelector(state => state.auth.authToken);
  const isKycVerified = useSelector(state => state.auth.isKycVerified);
  // console.log(isKycVerified,'sdfdsfsdf')
  const pancardDetails = useSelector(state => state.auth.pancardDetails);
  const AdharcardDetails = useSelector(state => state.auth.AdharcardDetails);
  // console.log(pancardDetails, AdharcardDetails, 'hello i am data');
  const [isVisible, setIsVisible] = useState(false);
  const [adharNoTrue, setAdharNoTrue] = useState(true);
  const [isVisible1, setIsVisible1] = useState(false);
  const [errorMessage, setErrrorMessage] = useState('');
  const [type, setType] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [isAadhaarValid, setAadhaarValid] = useState(true);
  const [pancardNumber, setPancardNumber] = useState('');
  const [pancardNumbertrue, setPancardNumbertrue] = useState(true);
  const [otpTextInput, setOtpTextInput] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [refrenceId, setRefrenceId] = useState('');
  const [data, setData] = useState(null);
  const dispatch = useDispatch();

  const isAadharTrue = adhar => {
    const regexPattern = /^[1-9][0-9]{11}$/;
    const isadharNumber = regexPattern.test(adhar);
    return isadharNumber;
  };
  const formatAadhaarNumber = input => {
    const cleanedInput = input.replace(/\D/g, '');
    const formattedInput = cleanedInput.replace(
      /(\d{4})(\d{4})(\d{4})/,
      '$1 $2 $3',
    );
    setAadhaarNumber(formattedInput);
  };

  const handlePrevious = () => {
    setActiveStep(activeStep - 1);
  };

  const isPancardTrue = text => {
    const panCardRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    const isPanNumber = panCardRegex.test(text);
    console.log(isPanNumber, 'result');
    return isPanNumber;
  };

  const handleAdharCard = async () => {
    const AdharNumber = aadhaarNumber.replace(/\s/g, '');
    setIsVisible(true);
    const header = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer 153e37c7-cdd1-427f-8702-fa2efb86a962',
    };
    const body = {aadhaar_no: AdharNumber};
    try {
      // const response = await apiCall(header, subUri, method, data);
      let response = await axios.post(
        `https://api.kychub.com/kyc/india/v2/initiate-aadhaar`,
        body,
        {
          headers: header,
        },
      );
      console.log(body, 'body');
      console.log(response.data, 'response from login  screen');

      if (response.data.statusCode == 2200) {
        setRefrenceId(response.data.data.referenceId);
        // console.log('2009');
        ToastAndroid.show(
          response.data.data.message,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        setActiveStep(activeStep + 1);
        setIsVisible(false);
      } else if (response.data.statusCode == 4001) {
        // console.log('2007');
        setType('error');
        setErrrorMessage('Please enter valid Adhar number');
        setIsVisible1(true);
        setIsVisible(false);
      } else if (response.data.statusCode == 402) {
        console.log('2007');
        setType('error');
        setErrrorMessage(response.data.data);
        setIsVisible1(true);
        setIsVisible(false);
      } else {
        // setType('error');
        // setErrrorMessage("Please enter valid Adhar number");
        // setIsVisible1(true)
        //   setIsVisible(false);
        setType('error');
        setErrrorMessage(response?.data.data.message);
        setIsVisible1(true);
        setIsVisible(false);
        console.log('error in else part');
      }
    } catch (err) {
      setType('error');
      setErrrorMessage('Error in fetching Adhaar card details');
      setIsVisible1(true);
      setIsVisible(false);
    }
  };
  const HandleAdharOtp = async () => {
    setIsVisible(true);
    const lastFourDigits = aadhaarNumber.slice(-4);
    const header = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer 153e37c7-cdd1-427f-8702-fa2efb86a962',
    };
    const body = {
      share_code: lastFourDigits,
      aadhaar_otp: otpTextInput,
      reference_id: refrenceId,
    };

    console.log(body, 'sdfoudsofuodsufsodufdos');
    try {
      // const response = await apiCall(header, subUri, method, data);
      let response = await axios.post(
        `https://api.kychub.com/kyc/india/v2/submit-aadhaar`,
        body,
        {
          headers: header,
        },
      );
      // console.log(response.data.data, 'response from login  screen');

      if (response.data.statusCode == 2202) {
        dispatch(setAdharcardData(response.data.data));
        console.log(response.data, 'respomse');
        ToastAndroid.show(
          response.data.data.message,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        setData(response?.data?.data);
        setActiveStep(activeStep + 1);
        setIsVisible(false);
      } else if (response.data.statusCode == 402) {
        console.log('2007');
        setType('error');
        setErrrorMessage(response.data.data);
        setIsVisible1(true);
        setIsVisible(false);
      } else {
        setType('error');
        setErrrorMessage(response?.data.data.message);
        setIsVisible1(true);
        setIsVisible(false);
        console.log('error in else part');
      }
    } catch (err) {
      setType('error');
      setErrrorMessage('Error in fetching pancard details');
      setIsVisible1(true);
      setIsVisible(false);
    }
  };
  const handlepanCard = async () => {
    setIsVisible(true);
    const header = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer 153e37c7-cdd1-427f-8702-fa2efb86a962',
    };
    const body = {pan: pancardNumber};
    try {
      // const response = await apiCall(header, subUri, method, data);
      let response = await axios.post(
        `https://api.kychub.com/kyc/india/v2/fetch-pan`,
        body,
        {
          headers: header,
        },
      );
      // console.log(response.data.data, 'response from login  screen');

      if (response.data.statusCode == 2009) {
        dispatch(setpandcardData(response.data.data));
        // console.log('2009');
        ToastAndroid.show(
          response.data.data.message,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        setActiveStep(activeStep + 1);
        setIsVisible(false);
      } else {
        console.log('2007');
        setType('error');
        setErrrorMessage(response.data.data.message);
        setIsVisible1(true);
        setIsVisible(false);
      }
    } catch (err) {
      setType('error');
      setErrrorMessage('Error in fetching pancard details');
      setIsVisible1(true);
      setIsVisible(false);
    }
  };

  console.log(aadhaarNumber, pancardNumber, 'dataaaa');
  const hanldeCompletedStep = async () => {
    const AdharNumber = aadhaarNumber.replace(/\s/g, '');
    setIsVisible(true);
    const header = {
      'content-Type': 'application/json',
      'x-access-token': token,
    };
    const body = {
      aadhar_card: AdharNumber,
      pan_card: pancardNumber,
      data: data,
    };
    const method = 'post';
    const subUri = '/account/user-online-kyc';
    console.log(body, 'completed api body');
    try {
      let response = await apiCall(header, subUri, method, body);
      // console.log(response, ' response in calling');
      console.log(response.data, ' data in calling>>>>>>>>>>>>>>>');
      if (response.status == 200 || response.status == 201) {
        console.log(response?.data, 'asdjkasdj-----aklsdjaksl');
        // dispatch(userImage(response?.data?.result?.selfie))
        dispatch(setisKycVerified(1));

        setIsVisible(false);
      } else {
        // Alert.alert(response);

        console.log(response, 1);
        setIsVisible(false);
      }
    } catch (err) {
      if (err.data) {
        setType('error');
        setErrrorMessage(err?.data?.response);
        setIsVisible(true);
        // Alert.alert(err.data.response);
        console.log(err?.response, 2);
        setIsVisible(false);
      } else {
        // Alert.alert(err.response.data.error);
        setType('error');
        setErrrorMessage(err?.response?.data?.error);
        setIsVisible1(true);
        console.log(err?.message, 3);
        setIsVisible(false);
      }
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor:'#141516'}}>
      <StatusBar barStyle={'light-content'} backgroundColor="#212121" />
      <View>
        <Modal animationType="fade" visible={isVisible} transparent={true}>
          <View style={[styles.modalView]}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size="large" color="#9004fd" />
            </View>
          </View>
        </Modal>
      </View>
      <ScrollView style={{height: '100%'}}>
        {isKycVerified == 0 && (
          <>
            <View style={{flex: 1}}>
              <ProgressSteps
                progressBarColor="#B0A695"
                disabledStepIconColor="#B0A695"
                completedLabelColor="#9004fd"
                labelColor="#fff"
                activeStepIconBorderColor="#9004fd"
                activeLabelColor="#9004fd"
                activeStepNumColor="white"
                activeStepIconColor="#9004fd"
                completedStepIconColor="#9004fd"
                completedProgressBarColor="#9004fd"
                // activeStepIconBorderColor="blue"
                borderWidth={2}
                activeStep={activeStep}>
                <ProgressStep
                  label="Adhaar Card"
                  previousBtnText=""
                  nextBtnText=""
                  nextBtnStyle={{display: 'none'}}
                  previousBtnStyle={{display: 'none'}}
                  nextBtn={() => {}}
                  previousBtn={() => {}}
                  renderNextButton={() => <View />}
                  renderPreviousButton={() => <View />}>
                  <View style={{marginHorizontal: 15}}>
                    <Text style={styles.lableStyle}> Adhaar Card Number </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {height: Platform.OS === 'ios' ? 45 : null},
                      ]}
                      placeholder="Enter Your Adhaar number"
                      placeholderTextColor={'#fff'}
                      value={aadhaarNumber}
                      onChangeText={text => {
                        formatAadhaarNumber(text);
                        // setAadhaarNumber(text)
                        setAadhaarValid(isAadharTrue(text));
                      }}
                      keyboardType="numeric"
                    />
                    {!isAadhaarValid && (
                      <>
                        <Text
                          style={{
                            color: 'red',
                            fontSize: 14,
                            fontWeight: '400',
                            top: 10,
                          }}>
                          Invalid Aadhaar number. Please enter a 12-digit
                          Aadhaar number.
                        </Text>
                      </>
                    )}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        marginHorizontal: 20,
                        marginTop: 25,
                        // bottom:80
                      }}>
                      <TouchableOpacity
                        onPress={() => handleAdharCard()}
                        disabled={aadhaarNumber ? false : true}
                        style={styles.buttonCOntainer}>
                        <Text style={styles.buttonCOntainerText}>Next</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ProgressStep>

                <ProgressStep
                  label="Adhaar verify"
                  previousBtnText=""
                  nextBtnText=""
                  nextBtnStyle={{display: 'none'}}
                  previousBtnStyle={{display: 'none'}}
                  nextBtn={() => {}}
                  previousBtn={() => {}}
                  renderNextButton={() => <View />}
                  renderPreviousButton={() => <View />}>
                  <View style={{alignItems: 'center'}}>
                    <Text
                      style={[
                        styles.lableStyle,
                        {paddingHorizontal: 20, marginBottom: 15},
                      ]}>
                      We texted you a verification code to your Registered
                      Mobile no.
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                      }}>
                      <OTPTextView
                        handleTextChange={e => {
                          setOtpTextInput(e);
                        }}
                        containerStyle={styles.textInputContainer}
                        textInputStyle={styles.roundedTextInput}
                        inputCount={6}
                        tintColor="#9004fd"
                        inputCellLength={1}
                        offTintColor={[
                          '#fff',
                          '#fff',
                          '#fff',
                          '#fff',
                          '#fff',
                          '#fff',
                        ]}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent:
                          activeStep === 0 ? 'flex-end' : 'space-between',
                        alignItems: 'center',
                        marginHorizontal: 20,
                        marginTop: 25,
                        gap:10
                      }}>
                      <TouchableOpacity
                        onPress={() => handlePrevious()}
                        style={styles.buttonCOntainer}>
                        <Text style={styles.buttonCOntainerText}>Previous</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => HandleAdharOtp()}
                        style={styles.buttonCOntainer}>
                        <Text style={styles.buttonCOntainerText}>Next</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ProgressStep>

                <ProgressStep
                  label="PAN Card"
                  previousBtnText=""
                  nextBtnText=""
                  nextBtnStyle={{display: 'none'}}
                  previousBtnStyle={{display: 'none'}}
                  nextBtn={() => {}}
                  previousBtn={() => {}}
                  renderNextButton={() => <View />}
                  renderPreviousButton={() => <View />}>
                  <View style={{marginHorizontal: 15}}>
                    <Text style={styles.lableStyle}> PAN Card Number </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {height: Platform.OS === 'ios' ? 45 : null},
                      ]}
                      placeholder="Enter Your PAN Card number."
                      placeholderTextColor={'#fff'}
                      value={pancardNumber}
                      onChangeText={text => {
                        setPancardNumber(text);
                        setPancardNumbertrue(isPancardTrue(text));
                      }}
                      keyboardType="email-address"
                    />
                    {!pancardNumbertrue && (
                      <>
                        <Text
                          style={{
                            color: 'red',
                            fontSize: 14,
                            fontWeight: '400',
                            top: 10,
                          }}>
                          Invalid PAN card number. Please enter a valid PAN card
                          number.
                        </Text>
                      </>
                    )}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        // marginHorizontal: 20,
                        marginTop: 25,
                        gap:10
                      }}>
                      <TouchableOpacity
                        onPress={() => handlePrevious()}
                        style={styles.buttonCOntainer}>
                        <Text style={styles.buttonCOntainerText}>Previous</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handlepanCard()}
                        style={styles.buttonCOntainer}>
                        <Text style={styles.buttonCOntainerText}>Next</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ProgressStep>

                <ProgressStep
                  label="Completed"
                  previousBtnText=""
                  nextBtnText=""
                  nextBtnStyle={{display: 'none'}}
                  previousBtnStyle={{display: 'none'}}
                  nextBtn={() => {}}
                  previousBtn={() => {}}
                  renderNextButton={() => <View />}
                  renderPreviousButton={() => <View />}>
                  <View style={{alignItems: 'center'}}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '500',
                        width: '90%',
                        color: '#FFF',
                      }}>
                      You're Verified! Now, the Last Step to Unlock
                      Everything!🌐
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-betweenS',
                        alignItems: 'center',
                        // marginHorizontal: 20,
                        marginTop: 25,
                        // bottom:80
                        gap:10
                      }}>
                      <TouchableOpacity
                        onPress={handlePrevious}
                        style={styles.buttonCOntainer}>
                        <Text style={styles.buttonCOntainerText}>Previous</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => hanldeCompletedStep()}
                        style={styles.buttonCOntainer}>
                        <Text style={styles.buttonCOntainerText}>
                          Completed
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ProgressStep>
              </ProgressSteps>
              {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: activeStep === 0 ? "flex-end" : "space-between",
              alignItems: 'center',
              marginHorizontal: 20,
              marginTop: 25,
              // bottom:80
            }}>
            {activeStep === 0 ? null : (
              <TouchableOpacity
                onPress={handlePrevious}
                style={styles.buttonCOntainer}>
                <Text style={styles.buttonCOntainerText}>Previous</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleNext}
              style={styles.buttonCOntainer}>
              <Text style={styles.buttonCOntainerText}>
                {activeStep === 3 ? 'Complete' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View> */}
            </View>
          </>
        )}
        {isKycVerified == 1 && (
          <>
            <>
              <View style={styles.outinputview}>
                <Image
                  source={require('./Images/KycSuccess.png')}
                  style={{height: 250, width: 250, resizeMode: 'contain',alignSelf:"center"}}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 20,
                  }}>
                  <MaterialIcons
                    name="verified"
                    size={35}
                    color="green"
                    style={{paddingRight: 10}}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      width: '90%',
                      color: 'gray',
                    }}>
                    KYC Verified! Welcome to the Verified User Club!..
                  </Text>
                </View>
              </View>
            </>
          </>
        )}
        <CustomModal
          MainTitle={errorMessage}
          isVisible1={isVisible1}
          setIsVisible1={setIsVisible1}
          OkButtonPressed={() => setIsVisible1(!isVisible1)}
          type={type}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default KycScreen;
const styles = StyleSheet.create({
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
  mainContainer: {
    backgroundColor: 'red',
    height: '100%',
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  buttonCOntainer: { 
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    width: '50%',
    backgroundColor: '#9004fd',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonCOntainerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  input: { 
    paddingLeft: 10,
    borderRadius: 5,
    width: '100%',
    color: '#fff',
    marginTop: 15,
    backgroundColor:'#424242'
  },
  roundedTextInput: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
    color:'#fff'
  },
  lableStyle: {
    color: '#fff',
    width: '100%',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
