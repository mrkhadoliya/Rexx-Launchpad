import { StyleSheet, Text, View, ImageBackground, Pressable, TextInput, StatusBar, Modal, Image, ActivityIndicator, Alert, Platform, BackHandler } from "react-native";
import React, { useRef, useState, useEffect } from "react";

import AntDesign from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OTPTextView from "./CustomOtpInput";
import { apiCall } from "./utils/ApiComponent";
import { loginSuccess, setAuthToken, setisEditProfile, setisKycVerified, userImage } from "./Redux-Toolkit/Slices/AuthSlices/AuthSlices";
import CustomModal from "./components/CustomModal";
import { SafeAreaView } from "react-native";

const OTP = ({ navigation, route }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [otpTextInput, setOtpTextInput] = useState("");
    const { email, userId, fcmToken, signin } = route.params || {};
    const [isVisible1, setIsVisible1] = useState(false);
    const [errorMessage, setErrrorMessage] = useState("");
    const [type, setType] = useState("");

    const setmail = useSelector((state) => state.auth.isEditProfile);
    console.log(setmail, "gggggggggggggggggggg");
    const dispatch = useDispatch();

    const handelOTP = async () => {
        setIsVisible(true);
        const header = {
            "content-Type": "application/json",
        };
        const body = { userId, otp: otpTextInput, fcm_token: fcmToken, app_type: "1" };
        const method = "post";
        const subUri = "/user/verify";
        console.log(otpTextInput, "this");
        try {
            let response = await apiCall(header, subUri, method, body);
            // console.log(response, ' response in calling');
            console.log(response.data, " data in calling>>>>>>>>>>>>>>>");
            if (response.status == 200 || response.status == 201) {
                // console.log(response?.data?.result.user.selfie,'asdjkasdj-----aklsdjaksl');
                let AuthToken = response?.data?.result?.token;
                let data = response?.data?.result;
                await AsyncStorage.setItem("authToken", AuthToken);
                await AsyncStorage.setItem("userEmail", email);
                dispatch(loginSuccess(data));
                dispatch(setAuthToken(AuthToken));
                dispatch(setisKycVerified(response?.data?.result?.user?.isKycVerified));
                dispatch(userImage(response?.data?.result?.user?.selfie));
                // dispatch(userImage(response?.data?.result?.selfie))
                setIsVisible(false);
            } else {
                // Alert.alert(response);

                console.log(response, 1);
                setIsVisible(false);
            }
        } catch (err) {
            if (err.data) {
                setType("error");
                setErrrorMessage(err.data.response);
                setIsVisible(true);
                // Alert.alert(err.data.response);
                console.log(err.response, 2);
                setIsVisible(false);
            } else {
                // Alert.alert(err.response.data.error);
                setType("error");
                setErrrorMessage(err.response.data.error);
                setIsVisible1(true);
                console.log(err.message, 3);
                setIsVisible(false);
            }
        }
    };
    // const handelOTP = async () => {
    //   try {
    //     setIsVisible(true);
    //     const header = {
    //       'content-Type': 'application/json',
    //     };
    //     const body = { userId, otp: otpTextInput, fcm_token: fcmToken };
    //     const method = 'post';
    //     const subUri = '/user/verify';

    //     console.log(otpTextInput, 'this');

    //     const response = await apiCall(header, subUri, method, body);

    //     console.log(response.data, 'data in calling>>>>>>>>>>>>>>>');

    //     if (response.status === 200 || response.status === 201) {
    //       console.log(response?.data);
    //       const authToken = response?.data?.result.token;
    //       const data = response?.data?.result;

    //       await AsyncStorage.setItem('authToken', authToken);
    //       await AsyncStorage.setItem('userEmail', email);

    //       dispatch(
    //         loginSuccess({
    //           user: data,
    //         })
    //       );
    //       dispatch(setAuthToken(authToken));
    //     } else {
    //       console.log(response, 1);
    //     }
    //   } catch (error) {
    //     if (error.response) {
    //       Alert.alert(error.response.data.response || 'An error occurred.');
    //       console.log(error.response, 2);
    //     } else if (error.request) {
    //       Alert.alert('Network request failed. Please check your internet connection.');
    //       console.log(error.request, 3);
    //     } else {
    //       Alert.alert(error.message || 'An error occurred.');
    //       console.log(error, 4);
    //     }
    //   } finally {
    //     setIsVisible(false);
    //   }
    // };
    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            dispatch(setisEditProfile(!setmail));
            navigation.navigate("Login");
            return true;
        });

        return () => backHandler.remove();
    }, []);

    return (
        <SafeAreaView style={styles.backgroundContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#141516" />
            <View>
                <Modal animationType="fade" visible={isVisible} transparent={true}>
                    <View style={[styles.modalView]}>
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                            <ActivityIndicator size="large" color="#9004fd" />
                        </View>
                    </View>
                </Modal>
            </View>
            <View style={styles.container}>
                <View style={{ paddingBottom: 20 }}>
                    <Text style={styles.headingWelcome}>Enter Your OTP?</Text>
                    <Text style={styles.headingDescription}>We texted you a verification code to your Registered {signin !== undefined && signin == "google" ? "E-mail" : "mobile number"}.</Text>
                </View>
                <View style={{ width: "100%" }}>
                    <View
                        style={{
                            width: "100%",
                            flexDirection: "column",
                            alignContent: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                            <OTPTextView
                                handleTextChange={(e) => {
                                    setOtpTextInput(e);
                                }}
                                containerStyle={styles.textInputContainer}
                                textInputStyle={styles.roundedTextInput}
                                inputCount={4}
                                tintColor="#9004fd"
                                inputCellLength={1}
                                offTintColor={["#212121", "#212121", "#212121", "#212121"]}
                            />
                        </View>
                    </View>
                    <View style={{ marginVertical: 30, width: "100%" }}>
                        <Pressable
                            style={styles.GetStartBtn}
                            onPress={() => {
                                handelOTP();
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 19,
                                    fontFamily: "SF Pro Display",
                                    fontWeight: "700",
                                }}
                            >
                                Continue
                            </Text>
                            <AntDesign name="arrowright" size={25} color="#fff" />
                        </Pressable>
                    </View>
                    <View></View>
                </View>
            </View>
            <CustomModal
                MainTitle={errorMessage}
                isVisible1={isVisible1}
                setIsVisible1={setIsVisible1}
                type={type}
                OkButtonPressed={() => {
                    setIsVisible1(!isVisible1);
                }}
            />
        </SafeAreaView>
    );
};

export default OTP;

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
        fontSize: 30,
        color: "#fff",
        fontWeight: "700",
    },
    headingDescription: {
        fontSize: 16,
        color: "#fff",
        paddingVertical: 15,
        fontFamily: "SF Pro Display",
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
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#000000bd",
    },
    modalView: {
        margin: 20,
        width: "95%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalView: {
        backgroundColor: "#3c40434d",
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "100%",
        flex: 1,
    },
    roundedTextInput: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#65BA0D",
        color:'#fff'
    },
});
