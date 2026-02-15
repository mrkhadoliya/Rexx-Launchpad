import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ImageBackground, 
  Switch,
  Alert,
  ToastAndroid,
  Modal,
  ActivityIndicator,
  BackHandler,
  Platform,
  PermissionsAndroid,
  Linking
} from 'react-native';
import TouchID from 'react-native-touch-id';
import {useDispatch, useSelector} from 'react-redux';
import {
  BioMetricUpdate,
  PasscodeActiveUpdate,
  SetRouteName,
  setPushNotificationStatus,
} from '../Redux-Toolkit/Slices/AuthSlices/AuthSlices';
import {apiCall} from '../utils/ApiComponent';
import Toast from 'react-native-simple-toast';
import { PERMISSIONS, check,request } from 'react-native-permissions';
import CustomModal from '../components/CustomModal';
const Security = ({navigation}) => {
  const dispatch = useDispatch();
  const notifcationStatus = useSelector(state => state.auth.PushNotificationStatus)
  const passActiveStatus = useSelector(state => state.auth.passcodeActive)

  // console.log(String(passActiveStatus).length,'jsdhfjsdfh')
  const [isVisible, setIsVisible] = useState(false);
  const token = useSelector(state => state.auth.authToken);
  const bioActive = useSelector(state => state.auth.BioMetric);
  const [isPinEnabled, setIsPinEnabled] = useState(String(passActiveStatus).length > 3 ? true : false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(
    bioActive == 1 ? true : false,
  );
  const [isSmsEnabled, setIsSmsEnabled] = useState(false);
  const [isNotiEnabled, setIsNotiEnabled] = useState(notifcationStatus);
  const [errorMessage, setErrrorMessage] = useState('');
  const [type, setType] = useState('')
  const [isVisible1, setIsVisible1] = useState(false);

  const toggleSwitch = (is, set, setting) => {
    set(!is);
  };
  const handleFingerApi = async status => {
    setIsVisible(true);
    const header = {
      'content-Type': 'application/json',
      'x-access-token': token,
    };
    const body = {
        statusCode:status,
      app_type_isAction: 'isBioActive1',
    };
    const method = 'post';
    const subUri = '/user/appSettings';
    try {
      let response = await apiCall(header, subUri, method, body);
      // console.log(response, " rep in calling");

      if (response.status == 200 || response.status == 201) {
        console.log(response.data,'response data')
        if (Platform.OS === 'ios') {
          Toast.show(res.data.message, Toast.SHORT);
        } else {
          ToastAndroid.show(
            response.data.message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        }
        dispatch(BioMetricUpdate(!bioActive));
        setIsVisible(false);
      } else {
        Alert.alert(response);
        console.log(response, 1);
        setIsVisible(false);
      }
    } catch (err) {
      if (err.data) {
        Alert.alert(err.data.response);
        console.log(err.response, 2);
        setIsVisible(false);
      } else {
        const er = JSON.parse(err.request.response);
        Alert.alert(er.error);
        console.log(err.message, 3);
        setIsVisible(false);
      }
    }
  };
  const handlePinApi = async () => {};
  const handlePinTrue = async () => {
  
  };

  const pressHandler = () => {
    TouchID.isSupported(optionalConfigObject)
      .then(biometryType => {
        if (biometryType === 'FaceID') {
          console.log('FaceID is supported.');
        } else {
          console.log('TouchID is supported.');
          // if (isAuth) {
          //   console.log(isAuth,"isAuth")
          //   return null;
          // }
          TouchID.authenticate('', optionalConfigObject)
            .then(success => {
              //   setIsFigprintEnable(true);
              handleFingerApi('1');

              console.log(success, 'success');
            })
            .catch(async err => {
              //   setIsFigprintEnable(false);
            //   BackHandler.exitApp(err);
            //   dispatch(logoutSuccess());
            });
        }
      })
      .catch(err => {
        // setVisible(true);
        // setType('error');
        // setMessage('Please enable finger print in your device');
        console.log(err, 'err');
      });
  };



  const checkNotificationSettings = async () => {
    console.log(isNotiEnabled,'isnortoto')
    try {
      const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      console.log(result,'resultsdsd')
      if(result === 'denied'){
       
        dispatch(setPushNotificationStatus(false))
        Linking.openSettings()
      }else{
        dispatch(setPushNotificationStatus(true))
        Linking.openSettings()
      }
    } catch (error) {
      console.error('Error checking notification settings:', error);
    }
  };

  const optionalConfigObject = {
    title: 'Do App Locked', // Android
    imageColor: '#e00606', // Android
    imageErrorColor: '#ff0000', // Android
    sensorDescription: 'Touch the fingerPrint sensor', // Android
    sensorErrorDescription: 'Fingerprint not verified', // Android
    cancelText: 'Cancel', // Android
    fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
  };

 const handleSetPincode = async()=>{
  if(String(passActiveStatus).length > 3){
      setIsVisible(true);
          const header = {
              'content-Type': "application/json",
              'x-access-token': token
          };
          const body = { app_type_isAction: 'passcode1', statusCode: '0' };
          const method = 'post';
          const subUri = '/user/appSettings';
          console.log(body, 'this')
          try {
              let response = await apiCall(header, subUri, method, body);
              // console.log(response, " rep in calling");
              console.log(response.data, " data in calling App setting api");

              if (response.status == 200 || response.status == 201) {
                  // await AsyncStorage.setItem('authToken',response?.data.result.token)
                  //    await DataFetch(response);
                  // dispatch(loginSuccess({ isAuthenticated:true, user: uId.userId, balance: response?.data.result.user.fiatBalance, refferalCode:response?.data.result.user.refferalCode, email:response?.data.result.user.email, name:response?.data.result.user.name, phoneno:response?.data.result.user.mobileno}));
                  //     dispatch(updateAuthToken(response?.data.result.token))
                  //     console.log(response?.data.result.token,'token')
                  //     dispatch(changeGender(response?.data.result.gender))
                  // route.params.setFEditable(false);
                  // route.params.setPEditable(true);
                  setIsPinEnabled(!isPinEnabled)
                  dispatch(PasscodeActiveUpdate('0'));
                  setIsVisible(false)
                  if (Platform.OS === 'ios') {
                      Toast.show(response?.data?.message, Toast.SHORT);
                    } else {
                      ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT, ToastAndroid.BOTTOM);

                    }
                  // navigation.pop()

              } else {
                  // Alert.alert(response);
                  console.log(response, 1);
                  setIsVisible(false);
              }
          } catch (err) {

              if (err.data) {
                  // Alert.alert(err.data.response);
                  console.log(err.response, 2);
                  setIsVisible(false);

              } else {
                  if (Platform.OS === 'ios') {
                      Toast.show(err.response.data.error?err.response.data.error:err.message, Toast.SHORT);
                    } else {
                      ToastAndroid.show(err.response.data.error?err.response.data.error:err.message,ToastAndroid.SHORT,ToastAndroid.BOTTOM)

                    }
                  
                  console.log(err.message, 3);
                  setIsVisible(false);

              }
          }
  }else{
    navigation.navigate('SetPasscode', {
      setIsPinEnabled: setIsPinEnabled,
      isPinEnabled:isPinEnabled
    });
  }
 }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#212121" />
      <View>
        <Modal animationType="fade" visible={isVisible} transparent={true}>
          <View style={[styles.modalView]}>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size="large" color="#9004fd" />
            </View>
          </View>
        </Modal>
      </View>
      <View 
        style={styles.ImageBackgroundContainer}>
        <View>
          <View style={styles.SwitchContainer}>
            <View>
              <Text style={styles.SecurityName}>PIN ID</Text>
            </View>
            <View>
              <Switch
                trackColor={{false: '#414141', true: '#9004fd'}}
                thumbColor={isPinEnabled ? '#9004fd' : '#424242'}
                ios_backgroundColor="#E4E7EB"
                onValueChange={() => {
                  // if (!isPinEnabled) {
                  //   handlePinTrue();
                  // } else {
                  //   handlePinApi();
                  //   setIsPinEnabled(!isPinEnabled);
                  // }

                  handleSetPincode()
                }}
                value={isPinEnabled ? true : false}
              />
            </View>
          </View>
          <View style={styles.SwitchContainer}>
            <View>
              <Text style={styles.SecurityName}>Biometric ID</Text>
            </View>
            <View>
              <Switch
                trackColor={{false: '#414141', true: '#9004fd'}}
                thumbColor={bioActive ? '#9004fd' : '#424242'}
                ios_backgroundColor="#E4E7EB"
                onValueChange={() => {
               if(Platform.OS ==='android'){
                if (!isBiometricEnabled) {
                    pressHandler();
                  } else {
                    toggleSwitch(
                      isBiometricEnabled,
                      setIsBiometricEnabled,
                      'bio',
                    );
                    handleFingerApi('0');
                  }
               }else{
                   console.log('hello')
               }
                }}
                value={bioActive ? true : false}
              />
            </View>
          </View>
          <View style={styles.SwitchContainer}>
            <View>
              <Text style={styles.SecurityName}>SMS Authenticator</Text>
            </View>
            <View>
              <Switch
                trackColor={{false: '#414141', true: '#9004fd'}}
                thumbColor={isSmsEnabled ? '#9004fd' : '#424242'}
                ios_backgroundColor="#E4E7EB"
                onValueChange={() =>
                  toggleSwitch(isSmsEnabled, setIsSmsEnabled)
                }
                value={isSmsEnabled}
              />
            </View>
          </View>
          <View style={styles.SwitchContainer}>
            <View>
              <Text style={styles.SecurityName}>Notification</Text>
            </View>
            <View> 
              <Switch
                trackColor={{false: '#414141', true: '#9004fd'}}
                thumbColor={isNotiEnabled ? '#9004fd' : '#424242'}
                ios_backgroundColor="#E4E7EB"
                onValueChange={() =>{
                 
                    checkNotificationSettings();
                 

                  // navigation.navigate('Passcode', {
                  //   setIsPinEnabled: setIsPinEnabled,
                  //   isPinEnabled:isPinEnabled
                  // });
                }}
                value={isNotiEnabled ? true : false}
              />
              <CustomModal 
              
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  ImageBackgroundContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#141516',
    resizeMode: 'contain',
  },
  SwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: "#1b1b1b",
    borderColor:'#262626',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
  },
  SecurityName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
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

export default Security;
