import { StyleSheet, Text, View, ImageBackground, Pressable, TextInput, StatusBar, Modal, Image, ActivityIndicator, Alert, ToastAndroid, SafeAreaView } from "react-native";
import React, { useRef, useState } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomModal from '../components/CustomModal';
import { apiCall } from "../utils/ApiComponent";
import Toast from 'react-native-simple-toast';
import { PasscodeActiveUpdate } from "../Redux-Toolkit/Slices/AuthSlices/AuthSlices";

const SetPasscode = ({ navigation, route }) => {
  const token = useSelector(state => state.auth.authToken);
  const{setIsPinEnabled,isPinEnabled} = route.params || {};
  const dispatch = useDispatch()
    const [isVisible1, setIsVisible1] = useState(false);
    const [errorMessage, setErrrorMessage] = useState('');
    const [type, setType] = useState('')
    const [isVisible,setIsVisible] = useState(false);
    // const DataFetch = async (response) => {
    //     const header = {
    //         'content-Type': "application/json",
    //         'x-access-token': response?.data.result.token
    //     };
    //     const body = { userid: userId };
    //     const method = 'post';
    //     const subUri = '/user/wallet_home';
    //     console.log(body, 'this')
    //     try {
    //         let result = await callApi(header, body, method, subUri);
    //         // console.log(response, " rep in calling");
    //         console.log(result.data, " data in calling");

    //         if (result.status == 200 || result.status == 201) {
    //             dispatch(updateWalletDetails(result.data))
    //             dispatch(loginSuccess({ isAuthenticated: true, user: uId.userId, balance: response?.data.result.user.fiatBalance, refferalCode: response?.data.result.user.refferalCode, email: response?.data.result.user.email, name: response?.data.result.user.name, phoneno: response?.data.result.user.mobileno }));
    //             dispatch(updateAuthToken(response?.data.result.token))
    //             console.log(response?.data.result.token, 'token')
    //             dispatch(changeGender(response?.data.result.gender))
    //             setIsVisible(false)

    //         } else {
    //             Alert.alert(response);
    //             console.log(response, 1);
    //             setIsVisible(false);
    //         }
    //     } catch (err) {

    //         if (err.data) {
    //             Alert.alert(err.data.response);
    //             console.log(err.response, 2);
    //             setIsVisible(false);

    //         } else {
                
    //             ToastAndroid.show(err.response.data.error?err.response.data.error:err.message,ToastAndroid.SHORT,ToastAndroid.BOTTOM)
                
    //             // setType('error')
    //             // setErrrorMessage(err.message ? err.message : err.response.data.message)
    //             // setIsVisible1(true)
    //             console.log(err.message, 3);
    //             setIsVisible(false);

    //         }
    //     }
    // }
    const handlePasscode = async () => {
        setIsVisible(true);
        const otpString = otpDigits.join('');
        if (otpString.length < 4) {

            setType('error')
            setErrrorMessage('Passcode should atleast be 4 digits.')
            setIsVisible1(true)
            setIsVisible(false)
        }
        else {
            const header = {
                'content-Type': "application/json",
                'x-access-token': token
            };
            const body = { app_type_isAction: 'passcode1', statusCode: otpString };
            const method = 'post';
            const subUri = '/user/appSettings';
            console.log(body, 'this')
            try {
                let response = await apiCall(header, subUri, method, body);
                // console.log(response, " rep in calling");
                console.log(response.data, " data in calling");

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
                    dispatch(PasscodeActiveUpdate(otpString));
                    setIsVisible(false)
                    if (Platform.OS === 'ios') {
                        Toast.show(response.data.message, Toast.SHORT);
                      } else {
                        ToastAndroid.show(response.data.message, ToastAndroid.SHORT, ToastAndroid.BOTTOM);

                      }
                    navigation.pop()

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
        }
    }
    const numberOfOtpFields = 4; // Corrected to 4 for a 4-digit OTP
    const otpInputRefs = useRef([]);

    // Store the OTP digits in state
    const [otpDigits, setOtpDigits] = useState(new Array(numberOfOtpFields).fill(''));

    // Helper function to focus the next OTP input field
    const focusNextField = (index) => {
        if (index < numberOfOtpFields - 1) {
            otpInputRefs.current[index + 1].focus();
        }
    };

    // Helper function to focus the previous OTP input field
    const focusPreviousField = (index) => {
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

    return (
        <SafeAreaView style={styles.backgroundContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#212121" />
            <View>
                <Modal
                    animationType='fade'
                    visible={isVisible}
                    transparent={true}

                >
                    <View style={[styles.modalView]}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                            <ActivityIndicator size="large" color="#9004fd" />
                        </View>
                    </View>
                </Modal>
            </View>
            <View style={styles.container}>
                <View style={{ paddingBottom: 20 }}>
                    <Text style={styles.headingWelcome}>Enter Your Passcode?</Text>
                     {/* <Text style={styles.headingDescription}>We texted you a verification code to your Email.</Text>  */}
                </View>
                <View style={{ paddingVertical: 20, width: "100%" }}>
                    <View style={{ width: "100%", marginVertical: 25, flexDirection: "column", alignContent: "center", justifyContent: "space-between" }}>
                        {/* <TextInput keyboardType="number-pad" maxLength={1} onChangeText={(text) => setOtp1(text)} style={styles.TextInputs} />
                        <TextInput keyboardType="number-pad" maxLength={1} onChangeText={(text) => setOtp2(text)} style={styles.TextInputs} />
                        <TextInput keyboardType="number-pad" maxLength={1} onChangeText={(text) => setOtp3(text)} style={styles.TextInputs} />
                        <TextInput keyboardType="number-pad" maxLength={1} onChangeText={(text) => setOtp4(text)} style={styles.TextInputs} /> */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }} >
                            {otpDigits.map((digit, index) => (
                                <TextInput
                                    secureTextEntry
                                    key={index}
                                    style={styles.TextInputs}
                                    value={digit}
                                    onChangeText={(value) => { handleOtpInputChange(index, value); console.log(otpDigits) }}
                                    onKeyPress={({ nativeEvent }) => {
                                        if (nativeEvent.key === 'Backspace') {
                                            handleOtpInputDelete(index, '');
                                        }
                                    }}
                                    ref={(ref) => (otpInputRefs.current[index] = ref)}
                                    keyboardType="numeric"
                                    maxLength={1}
                                />
                            ))}
                        </View>
                    </View>
                    <View style={{ marginVertical: 30, width: "100%" }}>
                        <Pressable style={styles.GetStartBtn} onPress={() => {
                            handlePasscode()
                        }}>
                            <Text style={{ color: "#fff", fontSize: 19, fontFamily: "SF Pro Display", fontWeight: "600" }}>Set Passcode</Text>
                            <AntDesign name="arrowright" size={25} color="#fff" />
                        </Pressable>
                    </View>
                    <View>
                        {/* <Modal
                            animationType="slide"

                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                Alert.alert("Modal has been closed.");
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <View>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
                                            <Image source={verifiyImage} style={{ width: 150, height: 150, resizeMode: 'contain' }} />
                                        </View>
                                        <Text style={[styles.headingWelcome, { fontWeight: '600', textAlign: 'center', paddingTop: 20, color: "#5AA8FF" }]}>OTP Verified!</Text>
                                        <Text style={[styles.headingDescription, { paddingVertical: 20, textAlign: 'center' }]}>Congratulations! Your OTP verified is confirmed</Text>
                                    </View>
                                    <Pressable style={[styles.GetStartBtn, { marginVertical: 15 }]}
                                        onPress={() => navigation.navigate("reset password")}
                                    // onPress={() => setModalVisible(!modalVisible)}
                                    >
                                        <Text style={{ color: "#fff", fontSize: 19, fontFamily: "SF Pro Display", fontWeight: "600" }}>Continue</Text>
                                        <AntDesign name="arrowright" size={25} color="#fff" />
                                    </Pressable>
                                </View>
                            </View>
                        </Modal> */}
                    </View>
                </View>
            </View>

            <CustomModal
                MainTitle={errorMessage}
                isVisible1={isVisible1}
                setIsVisible1={setIsVisible1}
                type={type}
                ErrorButtonPressed={() => setIsVisible1(!isVisible1)}
            />
        </SafeAreaView>
    );
};

export default SetPasscode;

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        resizeMode: "contain",
        padding: 15,
        backgroundColor: "#141516",
    },
    container: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center",
        width: "100%",
    },
    headingWelcome: {
        fontFamily: "SF Pro Display",
        fontSize: 25,
        color: "#fff",
        fontWeight: "700",
    },
    headingDescription: {
        fontSize: 16,
        color: "#fff",
        paddingVertical: 15,
        fontFamily: "SF Pro Display",
    },
    TextInputs: {
        width: "22%",
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "#1b1b1b",
        borderColor:'#262626',
        flexDirection: "row",
        paddingHorizontal: 20,
        fontSize: 17,
        borderStyle: "solid",
        fontFamily: "SF Pro Display",
        textAlign: 'center',
        color:'#fff'
    },
    GetStartBtn: {
        flexDirection: "row",
        width: "100%",
        backgroundColor: "#9004fd",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "space-between",
    },

    // Modal Css 

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#000000bd',
    },
    modalView: {
        margin: 20,
        width: '95%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
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
        flex: 1
    },
});
