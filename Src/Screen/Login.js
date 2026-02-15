import { View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, ScrollView, Image, ImageBackground, StatusBar, Alert, Modal, ActivityIndicator, Platform, ToastAndroid } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { apiCall } from "./utils/ApiComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin, GoogleSigninButton, statusCodes } from "@react-native-google-signin/google-signin";
import CustomModal from "./components/CustomModal";
const Login = ({ navigation }) => {
    const isAuthenticated = useSelector((state) => state.auth);
    const setmail = useSelector((state) => state.auth.isEditProfile);
    const [showPassowrd, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [Password, setpassword] = useState("");
    const [deviceToken, setDeviceToken] = useState("");
    const [emailTrue, setEmailTrue] = useState(true);
    const [passwordTrue, setPasswordTrue] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [signInType, setSignInType] = useState("");
    const [fullName, setFullName] = useState("");
    const [userInfo, setUserInfo] = useState(null);
    const [isVisible1, setIsVisible1] = useState(false);
    const [errorMessage, setErrrorMessage] = useState("");
    const [type, setType] = useState("");
    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem("FCMToken");
            setDeviceToken(token);
        } catch (error) {
            console.log(error, "error");
        }
    };

    useEffect(() => {
        setEmail("");
        setpassword("");
    }, [setmail]);

    GoogleSignin.configure();

    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            setEmail(userInfo.user.email);
            setFullName(userInfo.user.name);
            setSignInType("google");
            console.log(userInfo, "##############");
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    };

    // const handleLoginViaGoogle = async () => {
    //   try {
    //     await GoogleSignin.hasPlayServices();
    //     const usrInfo = await GoogleSignin.signIn();
    //     setUserInfo(usrInfo.user);
    //     // console.log(usrInfo.user);
    //     // console.log(usrInfo.user.name, usrInfo.user.email);
    //     setEmail(usrInfo.user.email);
    //     setFullName(usrInfo.user.name);
    //     setSignInType('google');
    //   } catch (error) {
    //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //       // user cancelled the login flow
    //     } else if (error.code === statusCodes.IN_PROGRESS) {
    //       // operation (e.g. sign in) is in progress already
    //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //       // play services not available or outdated
    //     } else {
    //       console.log(error, 'error');
    //     }
    //   }
    // };

    useEffect(() => {
        getToken();
    }, [deviceToken]);

    // const isEmailTrue = email => {
    //   const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    //   const allowedProviders = ['gmail.com', 'yahoo.com', 'outlook.com'];
    //   const emailProvider = email.toLowerCase().split('@')[1];
    // return emailRegex.test(email) && allowedProviders.includes(emailProvider);

    // };

    const isEmailTrue = (email) => {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        // const allowedProviders = ['gmail.com', 'yahoo.com', 'outlook.com'];
        // const emailProvider = email.toLowerCase().split('@')[1];
        const phoneRegex = /^\+[1-9]\d{7,}$/;

        // const isEmail = emailRegex.test(email) && allowedProviders.includes(emailProvider);
        const isEmail = emailRegex.test(email);
        const isPhoneNumber = phoneRegex.test(email);

        return isEmail || isPhoneNumber;
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

    signOut = async () => {
        try {
            await GoogleSignin.signOut();
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogin = async () => {
        setErrrorMessage("");
        setType("");
        setIsVisible(true);
        const header = { "Content-Type": "application/json" };
        const subUri = "/user/login";
        const method = "post";
        const data = {
            email:email,
            password: Password,
            fcm_token: deviceToken,
            loginType: signInType,
            fullname: fullName,
            app_type: 1,
        };
        try {
            const response = await apiCall(header, subUri, method, data);
            console.log(response.data, "response from login  screen");
            if (response.status == 200 || response.status == 201) {
                const userId = response?.data.message;
                signOut();
                navigation.navigate("OTP", {
                    userId: userId,
                    email: email,
                    fcmToken: deviceToken,
                    signin: signInType,
                });

                setIsVisible(false);
            } else {
                setIsVisible(false);
                Alert.alert("Error", response?.data?.error);
                setEmail("");
                setFullName("");
                setSignInType("");
                setpassword("");
                signOut();
                console.log("try eror");
            }
        } catch (err) {
            console.log(err, "errorororor");
            setEmail("");
            setFullName("");
            setSignInType("");
            setpassword("");
            signOut();
            setIsVisible(false);
            if (err?.response?.data?.error) {
                setIsVisible(false);
                // Alert.alert(err.response.data.error);
                console.log("catch if eror");
                setType("error");
                setErrrorMessage(err?.response?.data?.error);
                setIsVisible1(true);
            } else {
                setIsVisible(false);
                // Alert.alert(err.message);
                console.log("catch else eror");
                // Alert.alert('Error', err?.message);
                setType("error");
                setErrrorMessage(err?.message);
                setIsVisible1(true);
            }
        }
    };

    useEffect(() => {
        if (email && fullName && signInType) {
            handleLogin();
        }
    }, [email, fullName, signInType]);

    return (
        <SafeAreaView style={{ height: "100%", flex: 1, backgroundColor: "#141516" }}>
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
                              Enter Your Email or Phone number
                          </Text>
                          <View style={{ marginTop: 50 }}>
                              <Text
                                  style={{
                                      color: "#fff",
                                      fontSize: 15,
                                      paddingBottom: 5,
                                      fontWeight: "500",
                                      paddingTop: 10,
                                  }}
                              >
                                  Email / Phone Number
                              </Text>
                              <TextInput
                                  style={styles.input}
                                  placeholder="Enter Email or phone number"
                                  placeholderTextColor={"#424242"}
                                  keyboardType={"email-address"}
                                  value={email}
                                  onChangeText={(text) => {
                                      setEmail(text), setEmailTrue(isEmailTrue(text));
                                  }}
                              />
                              {!emailTrue && (
                                  <View>
                                      <Text
                                          style={{
                                              color: "#9004fd",
                                              marginTop: Platform.OS === "android" ? 2 : 3,
                                          }}
                                      >
                                          {/* Email must be valid and be provided by valid providers
                    such as gmail, yahoo and outlook. */}
                                          Enter a valid Email or Phone number.
                                      </Text>
                                  </View>
                              )}

                              <Text
                                  style={{
                                      color: "#fff",
                                      fontSize: 15,
                                      paddingBottom: 5,
                                      fontWeight: "500",
                                      paddingTop: 10,
                                  }}
                              >
                                  Password
                              </Text>
                              <View style={{ position:'relative'}}>
                                  <TextInput
                                      style={styles.input}
                                      placeholder="***********"
                                      placeholderTextColor={"#424242"}
                                      secureTextEntry={showPassowrd ? false : true}
                                      value={Password}
                                      onChangeText={(text) => {
                                          setpassword(text), setPasswordTrue(isPasswordTrue(text));
                                      }}
                                  />

                                  <TouchableOpacity style={styles.eyesBtn} onPress={() => setShowPassword(!showPassowrd)}>
                                      <Ionicons name={showPassowrd ? "eye" : "eye-off"} size={25} style={{ right: 20 }} color="#fff" />
                                  </TouchableOpacity>
                              </View>
                              {!passwordTrue && <Text style={{ color: "#9004fd" }}>Password should be atleast 8 characters long and must contain numbers, characters, capital and minimal letters.</Text>}

                              <View style={{ textAlign: "right", paddingTop: 10 }}>
                                  <TouchableOpacity onPress={() => navigation.navigate("Forgotpassword")}>
                                      <Text
                                          style={{
                                              color: "#fff",
                                              width: "100%",
                                              textAlign: "right",
                                              fontWeight: "700",
                                              fontSize: 16,
                                              letterSpacing: 0.2,
                                          }}
                                      >
                                          Forgot Password
                                      </Text>
                                  </TouchableOpacity>
                              </View>

                              <View style={{}}>
                                  <TouchableOpacity
                                      onPress={() => {
                                          if (email && Password) {
                                              handleLogin();
                                          } else {
                                              // setType("error");
                                              // setErrrorMessage("Email or Password can not be empty");
                                              // setIsVisible1(true);
                                              ToastAndroid.showWithGravityAndOffset(
                                                'Email or Password can not be empty',
                                                ToastAndroid.SHORT,
                                                ToastAndroid.CENTER,
                                                25,
                                                50,
                                              );
                                          }
                                      }}
                                      style={{
                                          borderColor: "#fff",
                                          borderWidth: 0,
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
                                          Login
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
                                      }}
                                  >
                                      <Text style={{ color: "#fff", textAlign: "center" }}>Or Continue With</Text>
                                  </View>
                              </View>
 

                              <TouchableOpacity
                                  onPress={() => {
                                      // Platform.OS === 'android'
                                      // ?
                                      signIn();
                                      // {}
                                      // : {};
                                  }}
                                  style={{
                                      width: "100%",
                                      marginTop: 20,
                                      flexDirection: "row",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      gap: 10, 
                                      height: 50, 
                                      borderRadius: 5,
                                      backgroundColor:'#212121'
                                  }}
                              >
                                  <Image
                                      source={require("./Images/google.png")}
                                      style={{
                                          height: 25,
                                          width: 25,
                                          resizeMode: "contain",
                                          alignSelf: "center",
                                      }}
                                  />
                                  <Text
                                      style={{
                                          color: "#fff",
                                          textAlign: "center",
                                          borderColor: "#7B7B7B",
                                          fontSize: 18,
                                          fontWeight: "700",
                                          paddingHorizontal: 0,
                                          paddingVertical: 0,
                                          borderRadius: 5,
                                      }}
                                  >
                                      Continue With google
                                  </Text>
                              </TouchableOpacity>

                              <View>
                                  <View
                                      style={{
                                          flexDirection: "row",
                                          paddingTop: 10,
                                          justifyContent: "center",
                                          gap:5
                                      }}
                                  >
                                      <Text style={{ color: "#fff", textAlign: "center", fontSize: 15 }}>Don't have an account?</Text>
                                      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                                          <Text
                                              style={{
                                                  color: "#9004fd",
                                                  fontWeight: "900",
                                                  fontSize: 16,
                                                  letterSpacing: 0.5,
                                              }}
                                          >
                                              Sign Up
                                          </Text>
                                      </TouchableOpacity>
                                  </View>
                              </View>
                          </View>
                      </View>
                  </View>

                  <CustomModal MainTitle={errorMessage} isVisible1={isVisible1} setIsVisible1={setIsVisible1} type={type} OkButtonPressed={() => setIsVisible1(!isVisible1)} />
              </ScrollView> 
        </SafeAreaView>
    );
};

export default Login;

const styles = StyleSheet.create({
    input: { 
        paddingLeft: 15,
        backgroundColor: '#212121',
        borderRadius: 5,
        width: "100%",
        color: "#fff",
        height: 50,
        marginBottom:10,
        fontSize:16
    },
    eyesBtn:{
      position:'absolute',
      right:0,
      top:0,
      bottom:0,
      alignItems:'center',
      justifyContent:'center'
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
});
