import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, Image, Linking, Modal, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationContainer, createNavigationContainerRef, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "../Splash";
import Login from "../Login";
import Dashboard from "../Dashboard/Dashboard";
import MyTabs from "../Footer";
import Splashslider from "../Splashslider/Splashslider";
import Register from "../Register";
import Forgotpassword from "../Forgotpassword";
import Createtoken from "../Createtoken";
import Createpresale from "../Createpresale";
import LaunchpadList from "../LaunchpadList/LaunchpadList";
import Viewpresale from "../Viewpresale/Viewpresale";
import Upcoming from "../Upcomingtab/Upcoming";
import Completed from "../CompletedTab/Completed";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerC from "../DrawerComponent/Drawer";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Setting from "../Settingpage/Setting";
import About from "../Aboutus/About";
import Privacypolicy from "../Privacypolicy/Privacypolicy";
import Notifications from "../Notification/Notifications";
import Support from "../Supportpage/Support";
import Profile from "../Profilepage/Profile";
import OTP from "../Otp";
import ChangePassword from "../ChangePasword";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { apiCall } from "../utils/ApiComponent";
import TokenList from "../ViewTokenList/TokenList";
import {
    BioMetricUpdate,
    PasscodeActiveUpdate,
    dataUpdate,
    loginSuccess,
    logoutSuccess,
    setAboutUsData,
    setAuthToken,
    setPushNotificationStatus,
    setisKycVerified,
    userDetailsEditable,
    userImage,
} from "../Redux-Toolkit/Slices/AuthSlices/AuthSlices";
import Security from "../Security/Security";
import BuyToken from "../ViewTokenList/BuyToken";
import TermsAndServices from "../TermsAndServices";
import TouchID from "react-native-touch-id";
import { MainWalletBalance, TokenListData } from "../Redux-Toolkit/Slices/createTokenSlice/CreateTokenSlice";
import SetPasscode from "../Security/SetPasscode";
import DefaultWallet from "../DefaultWallet";
import { PERMISSIONS, check, request } from "react-native-permissions";
import Passcode from "../Security/Passcode";
import KycScreen from "../KycScreen";

import rexxLogo from "../Images/REXX-Icons.png";

const Drawer = createDrawerNavigator();

const DashboardIcon = ({ focused, color, size }) => <AntDesign name="home" size={22} color={focused ? "#9004fd" : "#939393"} />;
const Launchpads = ({ focused, color, size }) => <AntDesign name="indent-right" size={22} color={focused ? "#9004fd" : "#939393"} />;
const Tokenlist = ({ focused, color, size }) => <MaterialIcons name="generating-tokens" size={22} color={focused ? "#9004fd" : "#939393"} />;
const Createtokenss = ({ focused, color, size }) => <AntDesign name="questioncircle" size={22} color={focused ? "#9004fd" : "#939393"} />;
const Createpresa = ({ focused, color, size }) => <AntDesign name="exclamationcircle" size={22} color={focused ? "#9004fd" : "#939393"} />;
const KycScreenIcon = ({ focused, color, size }) => <MaterialIcons name="edit-document" size={22} color={focused ? "#9004fd" : "#939393"} />;
const Settings = ({ focused, color, size }) => <AntDesign name="setting" size={22} color={focused ? "#9004fd" : "#939393"} />;

function MyDrawer(props) {
    const navigation = useNavigation();
    const routeName = useSelector((state) => state.auth.routeName);

    const [message, setMessage] = useState("");
    const navigationRef = createNavigationContainerRef();
    const goBack = () => navigationRef?.canGoBack();
    const [isVisible1, setIsVisible1] = useState(false);

    useEffect(() => {
        const backAction = () => {
            // let index = props.navigation.getState().routes[0].state?.index;
            // if (index == 0 && index != undefined) {
            if (goBack) {
                setIsVisible1(true);
                setMessage("Exit App! Are you sure you want to exit? ?");
                return true;
            } else {
                return true;
            }
            // } else {
            // console.log('shubham');
            // }
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, []);
    return (
        <>
            {isVisible1 && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isVisible1}
                    onRequestClose={() => {
                        setIsVisible1(!isVisible1);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#fff",
                                borderRadius: 50,
                                height: 60,
                                width: 60,
                                top: 30,
                                zIndex: 10,
                            }}
                        >
                            <MaterialIcons name="error-outline" size={40} color="red" />
                        </View>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>{message ? message : ""}</Text>

                            <View style={styles.DeactivateButtonContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsVisible1(!isVisible1);
                                    }}
                                    style={styles.cancelButtonContainer}
                                >
                                    <Text style={styles.cancelButtonContainerText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        BackHandler.exitApp();
                                        setIsVisible1(!isVisible1);
                                    }}
                                    style={styles.cancelButtonContainer}
                                >
                                    <Text style={styles.cancelButtonContainerText}>Ok</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
            <Drawer.Navigator
                initialRouteName={routeName}
                options={{
                    headerShown: false,
                    headerTintColor: "#fff",
                }}
                screenOptions={{
                    drawerActiveTintColor: "#9004fd",
                    drawerInactiveTintColor: "#939393",
                }}
                drawerContent={(props) => <DrawerC {...props} />}
            >
                <Drawer.Screen
                    name="Home"
                    component={Dashboard}
                    options={{
                        drawerIcon: DashboardIcon,
                        drawerLabelStyle: {
                            fontSize: 16,
                            fontWeight: "700",
                        },
                        headerTintColor: "#fff",
                        headerStyle: {
                            backgroundColor: "#212121",
                        },
                        headerTitleAlign: "center",
                        headerTitleStyle: {
                            display: "none",
                        },
                        headerRight: () => (
                            <View style={{ right: 15 }}>
                                <Image source={rexxLogo} style={{ width: 35, height: 35 }} resizeMode="contain" />
                            </View>
                        ),
                    }}
                />
                <Drawer.Screen
                    name="Presales List"
                    headerShown={false}
                    component={Stack11}
                    options={{
                        drawerIcon: Launchpads,
                        drawerLabelStyle: {
                            fontSize: 16,
                            fontWeight: "500",
                        },
                        headerStyle: {
                            backgroundColor: "#212121",
                        },
                        headerTintColor: "#fff",
                        headerTitleAlign: "center",
                    }}
                />
                <Drawer.Screen
                    name="Token List"
                    headerShown={false}
                    component={TokenList}
                    options={{
                        drawerIcon: Tokenlist,
                        drawerLabelStyle: {
                            fontSize: 16,
                            fontWeight: "500",
                        },
                        headerStyle: {
                            backgroundColor: "#212121",
                        },
                        headerTintColor: "#fff",
                        headerTitleAlign: "center",
                    }}
                />
                <Drawer.Screen
                    name="Create Token"
                    component={Createtoken}
                    options={{
                        drawerIcon: Createtokenss,
                        drawerLabelStyle: {
                            fontSize: 16,
                            fontWeight: "500",
                        },
                        headerStyle: {
                            backgroundColor: "#212121",
                        },
                        headerTintColor: "#fff",
                        headerTitleAlign: "center",
                    }}
                />
                <Drawer.Screen
                    name="Create Presale"
                    component={Createpresale}
                    options={{
                        drawerIcon: Createpresa,
                        drawerLabelStyle: {
                            fontSize: 16,
                            fontWeight: "500",
                        },
                        headerStyle: {
                            backgroundColor: "#212121",
                        },
                        headerTintColor: "#fff",
                        headerTitleAlign: "center",
                    }}
                />
                {/* <Drawer.Screen
                    name="View Presale"
                    component={Viewpresale}
                    options={{drawerIcon: main}}
                  /> */}
                {/* <Drawer.Screen
                    name="Kyc"
                    component={KycScreen}
                    options={{
                      drawerIcon: KycScreenIcon,
                      drawerLabelStyle: {
                        fontSize: 16,
                        fontWeight: '700',
                      },
                    }}
                  /> */}
                <Drawer.Screen
                    name="Setting"
                    component={Setting}
                    options={{
                        drawerIcon: Settings,
                        drawerLabelStyle: {
                            fontSize: 16,
                            fontWeight: "500",
                        },
                        headerStyle: {
                            backgroundColor: "#9004fd",
                            elevation: 0,
                            shadowOpacity: 0,
                        },
                        headerTintColor: "#fff",
                        headerTitleAlign: "center",
                    }}
                />
            </Drawer.Navigator>
        </>
    );
}

function Stack11() {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initialRouteName="LaunchpadList" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LaunchpadList" component={LaunchpadList} options={{ headerShown: false }} />
            <Stack.Screen
                name="View Presale"
                component={Viewpresale}
                // options={{drawerIcon: main}}
            />
            <Stack.Screen name="BuyToken" options={{ headerShown: false }}>
                {(props) => <BuyToken {...props} />}
            </Stack.Screen>
            {/* <Stack.Screen name="Completed" component={Completed} options={{headerShown: false}} /> */}
        </Stack.Navigator>
    );
}

const MainNavigation = ({ navigation }) => {
    const autoUpdates = useSelector((state) => state.auth.autoUpdate);
    const [visible, setIsVisible] = useState(false);
    const [isBioActiveStatus, setIsBioActiveStatus] = useState("");
    const [passcodeActiveStatus, setPasscodeActiveStatus] = useState("");
    const [initialRoute, setInitialRoute] = useState("Splash");
    const kycStatus = useSelector((state) => state.auth.isKycVerified);
    const getStoredAuthToken = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (token === null) {
                return null;
            }

            return token;
        } catch (error) {
            console.log("Error retrieving token from storage:", error);

            return null;
        }
    };

    const dispatch = useDispatch();

    const getAboutUsData = async () => {
        setIsVisible(true);
        const header = {
            "content-Type": "application/json",
        };
        const method = "get";
        const subUri = "/news/about-us";
        const body = {};
        try {
            let response = await apiCall(header, subUri, method, body);
            // console.log(response.data, ' rep in calling');

            if (response.status == 200 || response.status == 201) {
                let array = response?.data?.result[0].description.data;
                const string = String.fromCharCode(...array);
                dispatch(setAboutUsData(string));
                setIsVisible(false);
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
                // Alert.alert(err.message);
                console.log(err.message, 3);
                setIsVisible(false);
            }
        }
    };

    const checkAuth = async () => {
        setIsVisible(true);
        const authToken = await getStoredAuthToken();
        if (authToken) {
            const header = {
                "content-Type": "application/json",
                "x-access-token": authToken,
            };
            const body = {};
            const method = "post";
            const subUri = "/user/authanticate";
            try {
                let response = await apiCall(header, subUri, method, body);

                if (response.status == 200 || response.status == 201) {
                    // dispatch(updateDob(response.data.data[0].dob));
                    let data = response?.data?.data;
                    dispatch(dataUpdate({ data }));
                    DataFetch(authToken);
                    getAboutUsData();
                    dispatch(loginSuccess(data));
                    dispatch(setAuthToken(authToken));
                    dispatch(userImage(response?.data.data[0].selfie));
                    dispatch(BioMetricUpdate(response?.data.data[0].isBioActive1));
                    dispatch(setisKycVerified(response?.data.data[0].isKycVerified));
                    dispatch(PasscodeActiveUpdate(response?.data.data[0].passcode1));
                    setIsBioActiveStatus(response?.data.data[0].isBioActive1);
                    setPasscodeActiveStatus(response?.data.data[0].passcode1);

                    dispatch(
                        userDetailsEditable({
                            image: response?.data?.data[0]?.selfie,
                            fullName: response?.data?.data[0]?.name,
                            gender: response?.data?.data[0]?.gender,
                            mobileNumber: response?.data?.data[0]?.mobileno,
                            address: response?.data?.data[0]?.address,
                            email: response?.data?.data[0]?.email,
                        })
                    );

                    setIsVisible(false);
                } else {
                    console.log(response);
                    setIsVisible(false);
                }
            } catch (err) {
                console.log(err);
                setIsVisible(false);
            }
        }
    };
    let isAuth = useSelector((state) => state.auth.isAuthenticated);

    // console.log(isAuth, 'isAuth');

    useEffect(() => {
        const fetchData = async () => {
            await checkAuth();
            setIsVisible(false);
        };

        fetchData();
    }, [isAuth, autoUpdates, kycStatus]);

    const pressHandler = () => {
        TouchID.isSupported(optionalConfigObject)
            .then((biometryType) => {
                if (biometryType === "FaceID") {
                    console.log("FaceID is supported.");
                } else {
                    console.log("TouchID is supported.");
                    // if (isAuth) {
                    //   console.log(isAuth,"isAuth")
                    //   return null;
                    // }
                    TouchID.authenticate("", optionalConfigObject)
                        .then((success) => {
                            //   setIsFigprintEnable(true);

                            console.log(success, "success");
                        })
                        .catch(async (err) => {
                            //   setIsFigprintEnable(false);
                            BackHandler.exitApp(err);
                            dispatch(logoutSuccess());
                        });
                }
            })
            .catch((err) => {
                // setVisible(true);
                // setType('error');
                // setMessage('Please enable finger print in your device');
                console.log(err, "err");
            });
    };
    const optionalConfigObject = {
        title: "Do App Locked", // Android
        imageColor: "#e00606", // Android
        imageErrorColor: "#ff0000", // Android
        sensorDescription: "Touch the fingerPrint sensor", // Android
        sensorErrorDescription: "Fingerprint not verified", // Android
        cancelText: "Cancel", // Android
        fallbackLabel: "Show Passcode", // iOS (if empty, then label is hidden)
        unifiedErrors: false, // use unified error messages (default false)
        passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
    };

    const DataFetch = useCallback(async (AuthToken) => {
        // setIsVisible(true)
        const header = {
            "content-Type": "application/json",
            "x-access-token": AuthToken,
        };
        const body = {};
        const method = "get";
        const subUri = "/user/wallet_homesonu";
        // console.log(body, 'this');
        try {
            let response = await apiCall(header, subUri, method, body);
            // console.log(response, " rep in calling");
            // console.log(response.data, ' data in calling user wallet home api');

            if (response.status == 200 || response.status == 201) {
                // setIsVisible(false);
                let coinList = await response?.data?.wallet_details?.amount;
                dispatch(MainWalletBalance(coinList));
                console.log(coinList, "response from inner !!!!!!!!!!!!!!!!!!!!!!!!");
            } else {
                Alert.alert(response.status);
                console.log(response.status, 1);
                // setIsVisible(false);
            }
        } catch (err) {
            if (err.data) {
                // Alert.alert(err?.data?.response);
                console.log(err?.response, 2);
                // setIsVisible(false);
            } else {
                // Alert.alert(err?.message);
                console.log(err?.response, "kkkk");
                // setIsVisible(false);
            }
        }
    }, []);
    const checkNotificationSettings = async () => {
        try {
            const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
            // console.log(result,'resultsdsd')
            if (result === "granted") {
                dispatch(setPushNotificationStatus(true));
            } else {
                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
                dispatch(setPushNotificationStatus(true));
            }
        } catch (error) {
            console.error("Error checking notification settings:", error);
        }
    };

    const notifcationStatus = useSelector((state) => state.auth.PushNotificationStatus);
    // console.log(notifcationStatus,'jsdhfjsdfh')
    // useEffect(() => {

    // }, [])

    // console.log(passcodeActiveStatus,'olloolloollolololoujujujsesesesesese+++++++++++++++++')

    useEffect(() => {
        isBioActiveStatus == 1 ? pressHandler() : null;
        checkNotificationSettings();
        return () => {};
    }, [isBioActiveStatus]);

    // console.log(passcodeActiveStatus,'passcodeactivestatus');

    if (visible === true) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
                <ActivityIndicator size="large" color="#9004fd" />
            </View>
        );
    }

    const Stack = createNativeStackNavigator();

    // {isVisible1 &&
    //     <Modal
    //       animationType="slide"
    //       transparent={true}
    //       visible={isVisible1}
    //       onRequestClose={() => {
    //         setIsVisible1(!isVisible1);
    //       }}>
    //       <View style={styles.centeredView}>
    //         <View
    //           style={{
    //             alignItems: 'center',
    //             justifyContent: 'center',
    //             backgroundColor: '#fff',
    //             borderRadius: 50,
    //             height: 60,
    //             width: 60,
    //             top: 30,
    //             zIndex: 10,
    //           }}>
    //           <MaterialIcons name="error-outline" size={40} color="red" />
    //         </View>
    //         <View style={styles.modalView}>

    //             <Text style={styles.modalText}>{message ? message : ''}</Text>

    //           <View style={styles.DeactivateButtonContainer}>
    //             <TouchableOpacity
    //               onPress={() => {
    //                 BackHandler.exitApp();
    //                 setIsVisible1(!isVisible1)}}
    //               style={styles.cancelButtonContainer}>
    //               <Text style={styles.cancelButtonContainerText}>Ok</Text>
    //             </TouchableOpacity>
    //           </View>
    //         </View>
    //       </View>
    //     </Modal>
    //     }

    if (isAuth === false) {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Splash">
                    <Stack.Screen name="Splash" options={{ headerShown: false }}>
                        {(props) => <Splash {...props} />}
                    </Stack.Screen>
                    <Stack.Screen name="Login" options={{ headerShown: false }}>
                        {(props) => <Login {...props} />}
                    </Stack.Screen>
                    <Stack.Screen name="Register" options={{ headerShown: false }}>
                        {(props) => <Register {...props} />}
                    </Stack.Screen>
                    <Stack.Screen
                        name="Forgotpassword"
                        options={{
                            title: "",
                            headerShown: true,
                            headerTintColor: "#fff",
                            headerStyle: {
                                backgroundColor: "#212121",
                            },
                            headerTitleStyle: {
                                display: "none",
                            },
                        }}
                    >
                        {(props) => <Forgotpassword {...props} />}
                    </Stack.Screen>
                    <Stack.Screen name="OTP" options={{ headerShown: false }}>
                        {(props) => <OTP {...props} />}
                    </Stack.Screen>
                    <Stack.Screen name="Change Password" options={{ headerShown: true, headerTitleAlign: "center" }}>
                        {(props) => <ChangePassword {...props} />}
                    </Stack.Screen>
                    <Stack.Screen name="Terms and Services" options={{ headerShown: true, headerTitleAlign: "center" }}>
                        {(props) => <TermsAndServices {...props} />}
                    </Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        );
    } else {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName={kycStatus == 0 ? "Kyc" : passcodeActiveStatus == "0" ? "Splash" : "Passcode"}>
                    <Stack.Screen name="MyDrawer" options={{ headerShown: false }}>
                        {(props) => <MyDrawer {...props} />}
                    </Stack.Screen>
                    <Stack.Screen name="About"
                        options={{
                            headerShown: true,
                            title: "Privacy Policy",
                            headerStyle: {
                                backgroundColor: "#212121",
                                elevation: 0,
                                shadowOpacity: 0,
                            },
                            headerTintColor: "#fff",
                            headerTitleAlign: "center",
                        }}
                    >
                        {(props) => <About {...props} />}
                    </Stack.Screen>
                    <Stack.Screen
                        name="Privacypolicy"
                        options={{
                            headerShown: true,
                            title: "Privacy Policy",
                            headerStyle: {
                                backgroundColor: "#212121",
                                elevation: 0,
                                shadowOpacity: 0,
                            },
                            headerTintColor: "#fff",
                            headerTitleAlign: "center",
                        }}
                    >
                        {(props) => <Privacypolicy {...props} />}
                    </Stack.Screen>
                    <Stack.Screen
                        name="Security"
                        options={{
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: "#212121",
                                elevation: 0,
                                shadowOpacity: 0,
                            },
                            headerTintColor: "#fff",
                            headerTitleAlign: "center",
                        }}
                    >
                        {(props) => <Security {...props} />}
                    </Stack.Screen>
                    <Stack.Screen
                        name="Notifications"
                        options={{
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: "#212121",
                                elevation: 0,
                                shadowOpacity: 0,
                            },
                            headerTintColor: "#fff",
                            headerTitleAlign: "center",
                        }}
                    >
                        {(props) => <Notifications {...props} />}
                    </Stack.Screen>
                    <Stack.Screen name="Support" 
                        options={{
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: "#212121",
                                elevation: 0,
                                shadowOpacity: 0,
                            },
                            headerTintColor: "#fff",
                            headerTitleAlign: "center",
                        }}
                    >
                        {(props) => <Support {...props} />}
                    </Stack.Screen>
                    <Stack.Screen
                        name="Profile"
                        options={{
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: "#212121",
                                elevation: 0,
                                shadowOpacity: 0,
                            },
                            headerTintColor: "#fff",
                            headerTitleAlign: "center",
                        }}
                    >
                        {(props) => <Profile {...props} />}
                    </Stack.Screen>
                    <Stack.Screen name="BuyToken" options={{ headerShown: true, headerTitleAlign: "center" }}>
                        {(props) => <BuyToken {...props} />}
                    </Stack.Screen>
                    <Stack.Screen
                        name="SetPasscode"
                        options={{
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: "#212121",
                                elevation: 0,
                                shadowOpacity: 0,
                            },
                            headerTintColor: "#fff",
                            headerTitleAlign: "center",
                        }}
                    >
                        {(props) => <SetPasscode {...props} />}
                    </Stack.Screen>
                    <Stack.Screen
                        name="Default Wallet"
                        options={{
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: "#212121",
                                elevation: 0,
                                shadowOpacity: 0,
                            },
                            headerTintColor: "#fff",
                            headerTitleAlign: "center",
                        }}
                    >
                        {(props) => <DefaultWallet {...props} />}
                    </Stack.Screen>
                    <Stack.Screen name="Passcode" options={{ headerShown: true, headerTitleAlign: "center" }}>
                        {(props) => <Passcode {...props} />}
                    </Stack.Screen>
                    <Stack.Screen
                        name="Kyc"
                        options={{
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: "#212121",
                            },
                            headerTintColor: "#fff",
                            headerTitleAlign: "center",
                        }}
                    >
                        {(props) => <KycScreen {...props} />}
                    </Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
};

export default MainNavigation;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        backgroundColor: "#FEFEFE",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 1,
        width: "90%",
        // height:'20%',
        borderColor: "gray",
        borderWidth: 0.1,
        height: Platform.OS === "android" ? "22%" : "18%",
    },
    modalText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "700",
        color: "#000",
        paddingBottom: 5,
        marginTop: 20,
    },
    subtiltleText: {
        fontSize: 16,
        fontWeight: "400",
        textAlign: "left",
        marginTop: 10,
        color: "#001524",
    },
    DeactivateButtonContainer: {
        alignItems: "center",
        marginTop: 15,
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cancelButtonContainer: {
        backgroundColor: "#9004fd",
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        width: "35%",
        borderRadius: 10,
    },
    cancelButtonContainerText: { fontSize: 18, fontWeight: "600", color: "#fff" },
});
