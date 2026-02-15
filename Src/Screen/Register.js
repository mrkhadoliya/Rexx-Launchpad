import { View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, ScrollView, Image, Platform, Alert, Modal, ActivityIndicator, ToastAndroid } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import BASE_URI from "./utils/BASE_URI";
import { apiCall } from "./utils/ApiComponent";
import { loginSuccess } from "./Redux-Toolkit/Slices/AuthSlices/AuthSlices";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountryCode from "./components/CountryCode";
import { CheckBox } from "react-native-elements";
import CustomModal from "./components/CustomModal";

const Register = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [emailTrue, setEmailTrue] = useState(true);
    const [passwrd, setPassword] = useState("");
    const [passwordTrue, setPasswordTrue] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassowrd, setShowPassword] = useState(false);
    const [samePassword, setSamePassword] = useState(true);
    const [showConfirmPassowrd, setShowConfirmPassword] = useState(false);
    const [deviceToken, setDeviceToken] = useState(null);
    const [phoneno, setPhoneno] = useState("");
    const [phonenoTrue, setPhonenoTrue] = useState(true);
    const [country, setCountry] = useState("IN");
    const [countryCode, setCountryCode] = useState("+91");
    const [check1, setCheck1] = useState(false);
    const [isVisible1, setIsVisible1] = useState(false);
    const [errorMessage, setErrrorMessage] = useState("");
    const [type, setType] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        getToken();
    }, [getToken]);

    const getToken = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem("FCMToken");
            setDeviceToken(token);
        } catch (error) {
            console.log(error, "error");
        }
    }, []);
    const isEmailTrue = (email) => {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        // const allowedProviders = ['gmail.com', 'yahoo.com', 'outlook.com'];
        // const emailProvider = email.toLowerCase().split('@')[1];
        return emailRegex.test(email);
        //  && allowedProviders.includes(emailProvider);
    };
    const isPasswordTrue = (password) => {
        const capitalRegex = /[A-Z]/;
        const smallRegex = /[a-z]/;
        const symbolRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
        const digitRegex = /[0-9]/;

        const hasCapital = capitalRegex.test(password);
        const hasSmall = smallRegex.test(password);
        const hasSymbol = symbolRegex.test(password);
        const hasDigit = digitRegex.test(password);

        return hasCapital && hasSmall && hasSymbol && hasDigit && password.length > 7;
    };

    const isPhoneNoTrue = (phoneno) => {
        const NumbersRegex = /^\d{10}$/;
        const hasNumbers = NumbersRegex.test(phoneno);
        return hasNumbers;
    };

    const register = async () => {
        if (check1) {
            setErrrorMessage("");
            setIsVisible(true);
            const header = { "Content-Type": "application/json" };
            const subUri = "/user/register";
            const method = "post";
            const data = {
                email,
                password: passwrd,
                refferalTo: "",
                fullname: name,
                phoneno: `${countryCode}${phoneno}`,
                // app_type:1
            };

            try {
                const response = await apiCall(header, subUri, method, data);
                console.log(response, "response from ragister screen");
                if (response.status == 200 || response.status == 201) {
                    const userId = response?.data.data;
                    // Alert.alert('Success', response?.data?.message);
                    navigation.navigate("OTP", {
                        userId: userId,
                        email: email,
                        fcmToken: deviceToken,
                    });
                    setIsVisible(false);
                } else {
                    setIsVisible(false);
                    Alert.alert("Error", response.data.error);
                    console.log("try eror");
                }
            } catch (err) {
                console.log(err, "errorororor");
                if (err.response.data.error) {
                    setIsVisible(false);
                    // Alert.alert(err.response.data.error);
                    setType("error");
                    setErrrorMessage(err.response.data.error);
                    setIsVisible1(true);
                    // Alert.alert('Error', err.response.data.error);
                    console.log("catch if eror");
                } else {
                    setIsVisible(false);
                    // Alert.alert(err.message);
                    Alert.alert("Error", err.message);
                    console.log("catch else eror");
                }
            }
        } else {
            setType("error");
            setErrrorMessage("You must agree to Terms and Privacy Policy");
            setIsVisible1(true);
        }
    };

    return (
        <SafeAreaView style={{ height: "100%", backgroundColor: "#141516" }}>
            <View>
                <Modal animationType="fade" visible={isVisible} transparent={true}>
                    <View style={[styles.modalView]}>
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                            <ActivityIndicator size="large" color="#9004fd" />
                        </View>
                    </View>
                </Modal>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ color: "#fff", height: "100%" }}>
                    <View style={{ paddingHorizontal: 10 }}>
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 30,
                                fontWeight: "700",
                                paddingBottom: 5,
                                paddingTop: 50,
                                textAlign: "center",
                            }}
                        >
                            Hi, Welcome Back!
                        </Text>
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 15,
                                fontWeight: "400",
                                textAlign: "center",
                            }}
                        >
                            Enter Your Details to SignUp
                        </Text>

                        <View style={{ marginTop: 50 }}>
                            <Text style={styles.lableText}>
                                Name
                            </Text>
                            <TextInput
                                style={[styles.input, { height: Platform.OS === "ios" ? 45 : null }]}
                                placeholder="Enter your full name"
                                placeholderTextColor={"#424242"}
                                keyboardType={"email-address"}
                                value={name}
                                onChangeText={(Text) => setName(Text)}
                            />
                            <Text style={styles.lableText}>
                                Email
                            </Text>
                            <TextInput
                                style={[styles.input, { height: Platform.OS === "ios" ? 45 : null }]}
                                placeholder="Enter Your Email Address"
                                placeholderTextColor={"#424242"}
                                keyboardType={"email-address"}
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    setEmailTrue(isEmailTrue(text));
                                }}
                            />
                            {!emailTrue && (
                                <View>
                                    <Text style={{ color: "#9004fd" }}>Email must be valid and be provided by valid providers such as gmail, yahoo and outlook.</Text>
                                </View>
                            )}

                            <View style={{ width: "100%",}}>
                                <Text style={styles.lableText}>
                                    Phone
                                </Text>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center", 
                                        width: "100%",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <CountryCode
                                        MainContainer={{ width: "30%", color: "#fff" }}
                                        country={country}
                                        setCountry={setCountry}
                                        countryCode={countryCode}
                                        setCountryCode={setCountryCode}
                                        placeholderTextColor="#fff"
                                        style={{
                                            placeholderTextColor: {
                                                color: "#FFF",
                                            },
                                        }}
                                    />
                                    <TextInput
                                        keyboardType="number-pad"
                                        placeholder={"EnterPhone"}
                                        maxLength={10}
                                        placeholderTextColor={"#424242"}
                                        style={[
                                            styles.input,
                                            {
                                                height: Platform.OS === "ios" ? 45 : null,
                                                width: "70%",
                                            },
                                        ]}
                                        onChangeText={(text) => {
                                            setPhoneno(text);
                                            setPhonenoTrue(isPhoneNoTrue(text));
                                        }}
                                    />
                                </View>

                                {phoneno && (
                                    <View>
                                        {!phonenoTrue && (
                                            <Text style={{ color: "#9004fd" }}>
                                                {/* {getTranslation('PasswordRegex', selectedLanguage)}{' '} */}
                                                Phone Number should contain 10 Digits.
                                            </Text>
                                        )}
                                    </View>
                                )}
                            </View>

                            <Text style={styles.lableText}>
                                Password
                            </Text>
                            <View style={{position:'relative'}}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            height: Platform.OS === "ios" ? 45 : null,
                                        },
                                    ]}
                                    placeholder="***********"
                                    placeholderTextColor={"#424242"}
                                    secureTextEntry={showPassowrd ? false : true}
                                    value={passwrd}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        setPasswordTrue(isPasswordTrue(text));
                                        if (text !== confirmPassword) {
                                            setSamePassword(false);
                                        } else {
                                            setSamePassword(true);
                                        }
                                    }}
                                />
                                <TouchableOpacity style={styles.eyesBtn} onPress={() => setShowPassword(!showPassowrd)}>
                                    <Ionicons name={showPassowrd ? "eye" : "eye-off"} size={25} style={{ right: 25 }} color="#fff" />
                                </TouchableOpacity>
                            </View>
                            {passwrd && <View>{!passwordTrue && <Text style={{ color: "#9004fd" }}>Password should be atleast 8 characters long and must contain numbers, characters, capital and minimal letters.</Text>}</View>}
                            <Text style={styles.lableText}>
                                Confirm Password
                            </Text>
                            <View  style={{  position:'relative' }}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            height: Platform.OS === "ios" ? 45 : null,
                                        },
                                    ]}
                                    placeholder="***********"
                                    placeholderTextColor={"#424242"}
                                    secureTextEntry={showConfirmPassowrd ? false : true}
                                    value={confirmPassword}
                                    onChangeText={(text) => {
                                        setConfirmPassword(text);
                                        if (text !== passwrd) {
                                            setSamePassword(false);
                                        } else {
                                            setSamePassword(true);
                                        }
                                    }}
                                />
                                <TouchableOpacity style={styles.eyesBtn} onPress={() => setShowConfirmPassword(!showConfirmPassowrd)}>
                                    <Ionicons name={showConfirmPassowrd ? "eye" : "eye-off"} size={25} style={{ right: 15 }} color={"#fff"} />
                                </TouchableOpacity>
                            </View>
                            {!samePassword && (
                                <View>
                                    <Text style={{ color: "#9004fd" }}>Passwords do not match.</Text>
                                </View>
                            )}
 
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    right: 20,
                                }}
                            >
                                <CheckBox center checked={check1} onPress={() => setCheck1(!check1)} />
                                <Text style={[styles.agreeTextStyle, { color: "#fff" }]}>I have read and agree to the</Text>
                                <TouchableOpacity onPress={() => navigation.navigate("Terms and Services")}>
                                    <Text style={[styles.agreeTextStyle, { color: "#9004fd", fontWeight: "bold" }]}>Terms and Privacy Policy</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (name == "" && email == "" && passwrd == "" && phoneno == "") {
                                            // setType("error");
                                            // setErrrorMessage("Please Fill all the required feilds");
                                            // setIsVisible1(true);
                                            ToastAndroid.showWithGravityAndOffset(
                                              'Please Fill all the required feilds',
                                              ToastAndroid.SHORT,
                                              ToastAndroid.CENTER,
                                              25,
                                              50,
                                            )


                                        } else if (passwrd.length < 8 || samePassword.length < 8) {
                                            // setType("error");
                                            // setErrrorMessage("Password must atleast be 8 characters minimum");
                                            // setIsVisible1(true);

                                            ToastAndroid.showWithGravityAndOffset(
                                              'Password must atleast be 8 characters minimum',
                                              ToastAndroid.SHORT,
                                              ToastAndroid.CENTER,
                                              25,
                                              50,
                                            )

                                        } else {
                                            emailTrue && passwordTrue && confirmPassword && samePassword && email ? register() : console.log("else part");
                                        }
                                    }}
                                    style={{
                                        paddingHorizontal: 10,
                                        paddingVertical: 10,
                                        borderRadius: 5,
                                        width: "100%",
                                        backgroundColor: "#9004fd",
                                        marginTop: 20,
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        flexDirection: "row",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#fff",
                                            fontSize: 18,
                                            fontWeight: "700",
                                        }}
                                    >
                                        Sign Up
                                    </Text>
                                    <Image source={require("./Images/arrows.png")} />
                                </TouchableOpacity>
                            </View>

                            <View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        paddingTop: 10,
                                        justifyContent: "center",
                                        gap: 10,
                                    }}
                                >
                                    <Text style={{ color: "#fff", textAlign: "center" }}>Already have an account ?</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                        <Text
                                            style={{
                                                color: "#9004fd",
                                                fontWeight: "800",
                                                fontSize: 16,
                                                letterSpacing: 0.5,
                                            }}
                                        >
                                            Log in
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <CustomModal MainTitle={errorMessage !== "" ? errorMessage : "Email or Phone number can not be empty!"} isVisible1={isVisible1} setIsVisible1={setIsVisible1} OkButtonPressed={() => setIsVisible1(!isVisible1)} type={type} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Register;

const styles = StyleSheet.create({
  lableText:{
      color: "#fff",
      fontSize: 15,
      paddingBottom: 5,
      fontWeight: "500",
      paddingTop: 10,
  },
    input: {
        backgroundColor: "#212121",
        paddingLeft: 10,
        borderRadius: 5,
        width: "100%",
        color: "#fff",
        marginBottom:10
    },
    eyesBtn:{
      position:'absolute',
      right:0,
      top:0,
      bottom:0,
      alignItems:'center',
      justifyContent:'center'
    },
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
        backgroundColor: "#212121",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
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
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "100%",
        flex: 1,
    },

    agreeTextStyle: {
        color: "#fff",
        fontWeight: "500",
        fontSize: 14,
        letterSpacing: 0.2,
        right: 16,
    },
});
