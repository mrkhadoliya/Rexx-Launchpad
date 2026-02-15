import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  Alert,
  formData,
  Modal,
  ActivityIndicator,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import ImageCropPicker from 'react-native-image-crop-picker';
import CountryCode from '../components/CountryCode';
import { apiCall } from '../utils/ApiComponent';
import Toast from 'react-native-simple-toast';
import { userDetailsEditable } from '../Redux-Toolkit/Slices/AuthSlices/AuthSlices';
import global from '../../../global';
import { PERMISSIONS, check } from 'react-native-permissions';
import { ButtonGroup } from 'react-native-elements';
import { StatusBar } from 'react-native';
const Profile = ({ navigation, route }) => {
  // const genders = ['Male', 'Female', 'Others'];

  const UserData = useSelector(state => state.auth.userData);
  const UserDetails = useSelector(state => state.auth.UserDetails);
  const EditProfile = useSelector(state => state.auth.isEditProfile);
  console.log(EditProfile,'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
  const dispatch = useDispatch();
  console.log(UserDetails, 'jjj');
  let UserId = UserData[0]?.userId;
  console.log(UserId, 'UserID');
  const TokenSelfi = useSelector(state => state.auth.tokenImage);
  const [email, setEmail] = useState(UserDetails?.email);
  const [name, setName] = useState(UserDetails?.fullName);
  const [gender, setGender] = useState(UserDetails?.gender);
  const [coinImage, setCoinImage] = useState(UserDetails?.image);
  const [editEnable, setEditEnable] = useState(false);
  const [phoneno, setPhoneno] = useState(UserDetails?.mobileNumber);
  const [address, setAddress] = useState(UserDetails?.address);
  console.log(address, 'address')
  const [phonenoTrue, setPhonenoTrue] = useState(true);
  const [country, setCountry] = useState('IN');
  const [countryCode, setCountryCode] = useState('+91');
  const [updateImage, setUpdateImage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const handleuploadImage = async () => {
    await ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        // console.log(image.path, 'image path');
        // setCoinImage(image.path);
        setUpdateImage(image.path);
      })
      .catch(error => {
        console.log(error, 'error in image picker');
      });
  };

  const isPhoneNoTrue = phoneno => {
    const NumbersRegex = /^\d{10}$/;
    const hasNumbers = NumbersRegex.test(phoneno);
    return hasNumbers;
  };

  const genders = ['Male', 'Female', 'Others'];
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleGenderSelection = (index) => {
    setSelectedIndex(index);
    setGender(genders[index])
};

useEffect(() => {
  if(gender !== null){
   const genderCapital = gender.charAt(0).toUpperCase() + gender.slice(1)
   const fetchedGenderIndex = genders.indexOf(genderCapital);
   if (fetchedGenderIndex !== -1) {
     setSelectedIndex(fetchedGenderIndex);
   //   setGenderedit(genders[gender])
   }
  }
 }, [gender]);
 

  const handleEditProfileImage = async () => {

    setIsVisible(true);
    const bodyData = new FormData();
    bodyData.append('userId', UserId);
    bodyData.append('name', name);
    bodyData.append('address', address);
    bodyData.append('gender', gender);
    bodyData.append('phoneno', `${phoneno}`);
    if (updateImage !== '') {
      bodyData.append('photo', {
        uri: updateImage,
        type: 'image/jpg',
        name: 'imageName.jpg',
      });
    } else {
      bodyData.append('photo', {
        uri: `https://apic.myreview.website:8444/api/${coinImage}`,
        type: 'image/jpg',
        name: 'imageName.jpg',
      });
    }
    const header = { 'Content-Type': 'multipart/form-data' };
    const subUri = '/user/profile_update';
    const method = 'post';
    const data = bodyData;
    console.log(header, subUri, method, data._parts, 'api calling params');
    try {
      const response = await apiCall(header, subUri, method, data);
      console.log(response, 'response from ragister screen');
      if (response.status == 200 || response.status == 201) {
        console.log(response.data, 'response ++++++++++++++++');
        dispatch(
          userDetailsEditable({
            image: response?.data?.result?.selfie,
            fullName: response?.data?.result?.name,
            gender: response?.data?.result?.gender,
            mobileNumber: response?.data?.result?.mobileno,
            address: response?.data?.result?.address,
            email: email,
          }),
        );
        setCoinImage(response?.data?.result?.selfie);
        setName(response?.data?.result?.name);
        setPhoneno(response?.data?.result?.mobileno);
        setGender(response?.data?.result?.gender);
        if (Platform.OS === 'ios') {
          Toast.show(response.data.message, Toast.SHORT);
        } else {
          ToastAndroid.show(
            response.data.message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        }
        setIsVisible(false);
        setEditEnable(false);
      } else {
        setIsVisible(false);
        Alert.alert('Error', response.data.error);
        console.log('try eror');
      }
    } catch (err) {
      console.log(err, 'errorororor');
      if (err.response.data.error) {
        setIsVisible(false);
        // Alert.alert(err.response.data.error);
        Alert.alert('Error', err.response.data.error);
        console.log('catch if eror');
      } else {
        setIsVisible(false);
        // Alert.alert(err.message);
        Alert.alert('Error', err.message);
        console.log('catch else eror');
      }
    }
    // setEditEnable(false)
  };

  const handleBackPress = () => {
   setEditEnable(false)
    return true;
  };

  useEffect(() => {
    if(editEnable){
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => backHandler.remove();
    }
  }, [handleBackPress]);


  return (
    <SafeAreaView style={{ height: '100%', backgroundColor:'#141516' }}>
      <StatusBar backgroundColor="#212121" barStyle='light-content' />
      <View>
        <Modal animationType="fade" visible={isVisible} transparent={true}>
          <View style={[styles.modalView]}>
            <View
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="large" color="#9004fd" />
            </View>
          </View>
        </Modal>
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={{marginHorizontal: 15 }}>
            {editEnable === false ? (
              <>
                {/* <Text
                  style={{
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: '700',
                    paddingBottom: 20,
                    paddingTop: 20,
                    textAlign: 'center',
                  }}>Personal Info
                </Text> */}

                <View
                  style={{
                    alignSelf: 'center',
                    marginVertical: 20,
                    position: 'relative',
                    height: 90,
                    width: 90,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: '#321E1E',
                    borderRadius: 100
                  }}>
                  <Image
                    source={
                      coinImage === null
                        ? require('../Images/man.png')
                        : {
                          uri: `${global.imageGlobalPath}${coinImage}`,
                        }
                    }
                    resizeMode="contain"
                    style={{
                      width: 80,
                      height: 80,
                      resizeMode: 'cover',
                      borderRadius: 100,

                    }}
                  />
                </View>

                <Text style={styles.lablename}>
                  Full Name
                </Text>
                <Text style={styles.input}>
                  {name !== null ? name : 'User'}
                </Text>

                <Text style={styles.lablename}> 
                  Email
                </Text>
                <Text style={styles.input}>
                  {email !== null ? email : 'User@gmail.com'}
                </Text>

                <Text style={styles.lablename}>
                  Phone Number
                </Text>
                <Text style={styles.input}>
                  {phoneno !== null ? phoneno : '7891023456'}
                </Text>

                <Text style={styles.lablename}>
                  Gender
                </Text>
                <Text style={styles.input}>
                  {gender !== null ? gender : 'Male'}
                </Text>
                <Text style={styles.lablename}>
                  Address
                </Text>
                <Text style={styles.input}>
                  {address !== null ? address : 'loren street'}
                </Text>
                <View style={{ marginBottom: 20 }}>
                  <TouchableOpacity
                    onPress={() => setEditEnable(true)}
                    style={{ 
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      borderRadius: 5,
                      width: '100%',
                      backgroundColor: '#9004fd',
                      marginTop: 20,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: '700',
                      }}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
            {editEnable === true ? (
              <>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 20,
                    fontWeight: '500',
                    paddingBottom: 20,
                    paddingTop: 20,
                    textAlign: 'center',
                  }}> 
                  Personal Edit
                </Text>

                <View
                  style={{
                    alignSelf: 'center',
                    marginBottom: 20,
                    position: 'relative',

                  }}>
                  <Image
                    source={
                      coinImage === null
                        ? require('../Images/man.png')
                        : {
                          uri:
                            updateImage !== ''
                              ? updateImage
                              : `${global.imageGlobalPath}${coinImage}`,
                        }
                    }
                    resizeMode="contain"
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 100,
                      resizeMode: 'cover',
                      // borderWidth:2,
                      // borderColor:"#321E1E"
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => handleuploadImage()}
                    style={{ alignSelf: 'flex-end', bottom: 25 }}>
                    <Feather name="edit" size={25} color="#fff" style={{ position: "absolute", right: -5, zIndex: 1 }} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.lablename}>
                  Full Name
                </Text>
                <TextInput
                  placeholder={name !== null ? name : 'user'}
                  value={name}
                  placeholderTextColor="gray"
                  style={[
                    styles.input,
                    { 
                      height: 50,
                    },
                  ]}
                  onChangeText={text => setName(text)}
                />

                <Text style={styles.lablename}>
                  Email
                </Text>
                <TextInput
                  placeholder={email !== null ? email : 'user'}
                  value={email}
                  placeholderTextColor="gray"
                  style={[
                    styles.input,
                    { 
                      height: 50,
                    },
                  ]}
                  onChangeText={text => setEmail(text)}
                />

                <Text style={styles.lablename}>
                  Mobile Number
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                    width: '100%',
                  }}>
                  <View style={{top:5}}>
                  <CountryCode
                    MainContainer={{ width: '30%',}} 
                    country={country}
                    setCountry={setCountry}
                    countryCode={countryCode}
                    setCountryCode={setCountryCode}
                  />
                  </View>
                  <TextInput
                    placeholder={phoneno !== null ? phoneno : '9876543210'}
                    value={phoneno}
                    placeholderTextColor="#000"
                    keyboardType="decimal-pad"
                    maxLength={12}
                    style={[
                      styles.input,
                      { 
                        height: 50,
                        width: '70%',
                      },
                    ]}
                    onChangeText={text => {
                      setPhoneno(text);
                      setPhonenoTrue(isPhoneNoTrue(text));
                    }}
                  />
                </View>
                {phoneno && (
                  <View>
                    {!phonenoTrue && (
                      <Text style={{ color: 'red' }}>
                        {/* {getTranslation('PasswordRegex', selectedLanguage)}{' '} */}
                        Phone Number should contain 10 Digits.
                      </Text>
                    )}
                  </View>
                )}
                <Text style={styles.lablename}>
                  Gender
                </Text>
                <View>
                  <ButtonGroup
                    onPress={handleGenderSelection}
                    selectedIndex={selectedIndex}
                    buttons={genders}
                    containerStyle={{ width: "100%", right: 10, backgroundColor:'#1b1b1b', borderWidth:1, borderColor:'#262626'  }}
                    selectedTextStyle={{
                      color:'#fff', 
                    }}
                    selectedButtonStyle={{
                      backgroundColor:'#9004fd'
                    }}
                  />
                </View>
                <Text style={styles.lablename}>
                  Address
                </Text>
                <TextInput
                  placeholder={address !== null ? address : 'lorem city'}
                  value={address}
                  placeholderTextColor="gray"
                  style={[
                    styles.input,
                    { 
                      height: 50,
                    },
                  ]}
                  onChangeText={text => setAddress(text)}
                />
                <View style={{ marginBottom: 20 }}>
                  <TouchableOpacity
                    onPress={() => handleEditProfileImage()}
                    style={{ 
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      borderRadius: 5,
                      width: '100%',
                      backgroundColor: '#9004fd',
                      marginTop: 20,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: '700',
                      }}>
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  lablename:{ 
      color: '#fff',
      fontSize: 14,
      paddingBottom: 5,
      fontWeight: '400',
      paddingTop: 10,
     
  },
  input: {
    backgroundColor: "#1b1b1b",
    borderColor:'#262626',
    borderRadius: 5,
    // width: '100%',
    color: '#fff',
    marginHorizontal: 5,
    fontSize: 15,
    paddingVertical: 15,
    borderWidth: 1,
    height: Platform.OS === 'android' ? null : 45,
    paddingHorizontal: 10,
    fontWeight:'400'
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

//drawer screen updated,new security screen and editProfile screen made,edit profile api done,modify setting scrren UI,
