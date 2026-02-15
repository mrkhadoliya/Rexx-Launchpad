import { View, Text, Image, TouchableOpacity, FlatList, ImageBackground, TouchableHighlight, ScrollView, SafeAreaView, Alert, Platform, Modal, StyleSheet, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { logoutSuccess } from "../Redux-Toolkit/Slices/AuthSlices/AuthSlices";
import { CreateTokenDataClear } from "../Redux-Toolkit/Slices/createTokenSlice/CreateTokenSlice";
import { PresaleListnull } from "../Redux-Toolkit/Slices/PresaleSlice/PresaleSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import global from "../../../global";
import { apiCall } from "../utils/ApiComponent";
import { StatusBar } from "react-native";

const Setting = ({ navigation }) => {
    const UserDetails = useSelector((state) => state.auth.UserDetails);
    console.log(UserDetails.image, "iimmaaggee");
    const AuthToken = useSelector((state) => state.auth.authToken);
    // console.log(UserDetails.image, 'userdetails');
    const [email, setEmail] = useState(UserDetails.email);
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isVisible1, setIsVisible1] = useState(false);
    const dispatch = useDispatch(false);
    // console.log(createPreSale?.data[0].selfie)
    const handleLogOutPermission = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Logout",
                    onPress: () => {
                        HandleLogout();
                    },
                },
            ],
            { cancelable: false }
        );
    };

    signOut = async () => {
        try {
            await GoogleSignin.signOut();
        } catch (error) {
            console.error(error);
        }
    };
    const BiometricStatus = useSelector((state) => state.auth.BioMetric);
    console.log(BiometricStatus, "bio");

    const HandleLogout = async () => {
        setLoading(true);
        try {
            const removeAuthRoken = await AsyncStorage.removeItem("authToken");
            const removeEmail = await AsyncStorage.removeItem("userEmail");
            signOut();
            dispatch(logoutSuccess());
            dispatch(CreateTokenDataClear());
            dispatch(PresaleListnull());
            setLoading(false);
        } catch (error) {
            console.log(error, "error while logging out");
            setLoading(false);
        }
    };

    const handleDeleteaccount = async () => {
        setLoading(true);
        const header = {
            "content-Type": "application/json",
            "x-access-token": AuthToken,
        };
        const subUri = "/user/AccountSetting";
        const method = "post";
        const data = {
            status: 2,
            type: "delete",
        };
        try {
            const res = await apiCall(header, subUri, method, data);
            console.log(res.data, "res ponse in claim token api");
            if (res.status == 200 || res.status == 201) {
                console.log(res.data, "response data");
                HandleLogout();
                setLoading(false);
            } else {
                setLoading(false);
                Alert.alert("Error", res?.data?.error);
                console.log("try eror");
            }
        } catch (err) {
            if (err.data) {
                Alert.alert(err?.data?.response);
                console.log(err?.response);
                setLoading(false);
            } else {
                Alert.alert(err?.response?.data?.message);
                console.log(err?.message);
                setLoading(false);
            }
        }
    };

    const handleDeactiveAccount = async () => {
        setLoading(true);
        const header = {
            "content-Type": "application/json",
            "x-access-token": AuthToken,
        };
        const subUri = "/user/AccountSetting";
        const method = "post";
        const data = {
            status: 1,
            type: "deactivate",
        };
        try {
            const res = await apiCall(header, subUri, method, data);
            console.log(res.data, "res ponse in claim token api");
            if (res.status == 200 || res.status == 201) {
                console.log(res.data, "response data");
                HandleLogout();
                setLoading(false);
            } else {
                setLoading(false);
                Alert.alert("Error", res?.data?.error);
                console.log("try eror");
            }
        } catch (err) {
            if (err.data) {
                Alert.alert(err?.data?.response);
                console.log(err?.response);
                setLoading(false);
            } else {
                Alert.alert(err?.response?.data?.message);
                console.log(err?.message);
                setLoading(false);
            }
        }
    };

    return (
        <SafeAreaView style={{ height: "100%", backgroundColor: "#141516", flex: 1 }}>
            <StatusBar backgroundColor="#9004fd" barStyle="light-content" />
            <View>
                <Modal animationType="fade" visible={loading} transparent={true}>
                    <View style={[styles.Loader]}>
                        <View
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <ActivityIndicator size="large" color="#9004fd" />
                        </View>
                    </View>
                </Modal>
            </View>
            <ScrollView>
                <View style={{ height: "100%", flex: 1 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            display: "flex",
                            width: "100%",
                            alignSelf: "center",
                            justifyContent: "flex-start",
                            backgroundColor: "#9004fd",
                            paddingHorizontal: 10,
                            padding: 10,
                            marginBottom: 20,
                            borderBottomLeftRadius: 12,
                            borderBottomRightRadius: 12,
                        }}
                    >
                        <View>
                            <Image
                                source={
                                    UserDetails.image !== null
                                        ? {
                                              uri: `${global.imageGlobalPath}${UserDetails.image}`,
                                          }
                                        : require("../Images/profile.png")
                                }
                                style={{
                                    height: 60,
                                    width: 60,
                                    resizeMode: Platform.OS === "android" ? "contain" : "cover",
                                    borderRadius: 50,
                                }}
                            />
                        </View>
                        <View style={{ marginLeft: 10 }}>
                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 20,
                                    marginTop: 5,
                                    fontWeight: "700",
                                }}
                            >
                                {UserDetails.fullName !== "" ? UserDetails.fullName : "user"}
                            </Text>
                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 15,
                                    fontWeight: "400",
                                    paddingBottom: 5,
                                }}
                            >
                                {email.length > 0 ? email : "user@gmail.com"}
                            </Text>
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.menuBtns}>
                            <View style={{ width: "90%", flexDirection: "row" }}>
                                <FontAwesome name="user" size={22} color="#fff" />
                                <Text
                                    style={{
                                        fontSize: 17,
                                        color: "#fff",
                                        fontWeight: "500",
                                        verticalAlign: "top",
                                        marginLeft: 10,
                                    }}
                                >
                                    Profile
                                </Text>
                            </View>
                            <View style={{}}>
                                <FontAwesome name="angle-right" size={22} color="#fff" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Default Wallet")} style={styles.menuBtns}>
                            <View style={{ width: "90%", flexDirection: "row" }}>
                                <Ionicons name="wallet" size={22} color="#fff" />
                                <Text
                                    style={{
                                        fontSize: 17,
                                        color: "#fff",
                                        fontWeight: "500",
                                        verticalAlign: "top",
                                        marginLeft: 10,
                                    }}
                                >
                                    Default Wallet
                                </Text>
                            </View>
                            <View style={{}}>
                                <FontAwesome name="angle-right" size={22} color="#fff" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate("Kyc")} style={styles.menuBtns}>
                            <View style={{ width: "90%", flexDirection: "row" }}>
                                <MaterialIcons name="edit-document" size={25} color="#fff" />
                                <Text
                                    style={{
                                        fontSize: 17,
                                        color: "#fff",
                                        fontWeight: "500",
                                        verticalAlign: "top",
                                        marginLeft: 8,
                                    }}
                                >
                                    Kyc
                                </Text>
                            </View>
                            <View style={{}}>
                                <FontAwesome name="angle-right" size={22} color="#fff" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Notifications")} style={styles.menuBtns}>
                            <View style={{ width: "90%", flexDirection: "row" }}>
                                <Ionicons name="notifications" size={22} color="#fff" />
                                <Text
                                    style={{
                                        fontSize: 17,
                                        color: "#fff",
                                        fontWeight: "500",
                                        verticalAlign: "top",
                                        marginLeft: 8,
                                    }}
                                >
                                    Notifications
                                </Text>
                            </View>
                            <View style={{}}>
                                <FontAwesome name="angle-right" size={22} color="#fff" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate("Privacypolicy")} style={styles.menuBtns}>
                            <View style={{ width: "90%", flexDirection: "row" }}>
                                <MaterialIcons name="privacy-tip" size={22} color="#fff" />
                                <Text
                                    style={{
                                        fontSize: 17,
                                        color: "#fff",
                                        fontWeight: "500",
                                        verticalAlign: "top",
                                        marginLeft: 8,
                                    }}
                                >
                                    Privacy & Policy
                                </Text>
                            </View>
                            <View style={{}}>
                                <FontAwesome name="angle-right" size={22} color="#fff" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Security")} style={styles.menuBtns}>
                            <View style={{ width: "90%", flexDirection: "row" }}>
                                <MaterialIcons name="security" size={22} color="#fff" />
                                <Text
                                    style={{
                                        fontSize: 17,
                                        color: "#fff",
                                        fontWeight: "500",
                                        verticalAlign: "top",
                                        marginLeft: 8,
                                    }}
                                >
                                    Security
                                </Text>
                            </View>
                            <View style={{}}>
                                <FontAwesome name="angle-right" size={22} color="#fff" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Support")} style={styles.menuBtns}>
                            <View style={{ width: "90%", flexDirection:'row', alignItems:'center' }}>
                              <AntDesign name="customerservice" size={22} color="#fff" />
                                <Text
                                    style={{
                                        fontSize: 17,
                                        color: "#fff",
                                        fontWeight: "500",
                                        verticalAlign: "top",
                                    }}
                                >  Help and Support
                                </Text>
                            </View>
                            <View style={{}}>
                                <FontAwesome name="angle-right" size={22} color="#fff" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate("About")} style={styles.menuBtns}>
                            <View style={{ width: "90%", flexDirection:'row', alignItems:'center', gap:10 }}>
                                <AntDesign name="infocirlce" size={22} color="#fff" />
                                <Text
                                    style={{
                                        fontSize: 17,
                                        color: "#fff",
                                        fontWeight: "500",
                                        verticalAlign: "top",
                                    }}
                                >
                                  About Us
                                </Text>
                            </View>
                            <View style={{}}>
                                <FontAwesome name="angle-right" size={22} color="#fff" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{paddingHorizontal:10}}>
                      <TouchableOpacity
                          onPress={() => handleLogOutPermission()}
                          style={[styles.menuBtns, {backgroundColor:'#9004fd', justifyContent:'space-between', alignItems:'center'}]}
                      >
                          <AntDesign name="logout" size={22} color="#fff" />
                          <Text
                              style={{
                                  fontSize: 17,
                                  color: "#fff",
                                  fontWeight: "500", 
                                  textAlign: "center", 
                              }}>Logout </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginHorizontal: 10,
                            marginBottom:25
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => setIsVisible1(!isVisible1)}
                            style={{
                                backgroundColor: "#d42c2b",
                                height: 45,
                                width: "45%",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 5,
                            }}
                        >
                            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Delete account</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setIsVisible(!isVisible)}
                            style={{
                                backgroundColor: "#9004fd26",
                                height: 45,
                                width: "45%",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: "#9004fd",
                            }}
                        >
                            <Text style={{ color: "#9004fd", fontWeight: "700", fontSize: 15 }}>Deactivate account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setIsVisible(!isVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Do you want to deactivate your account?</Text>
                            <View style={{ height: 1, backgroundColor: "#B3A492", marginTop: 5 }} />
                            <Text style={styles.subtiltleText}>You need to contact admin to recover your account in the future. Your funds and wallet are safe with us.</Text>
                            <View style={styles.DeactivateButtonContainer}>
                                <TouchableOpacity onPress={() => setIsVisible(!isVisible)} style={styles.cancelButtonContainer}>
                                    <Text style={styles.cancelButtonContainerText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeactiveAccount()} style={[styles.cancelButtonContainer, { backgroundColor: "#d42c2b" }]}>
                                    <Text style={styles.cancelButtonContainerText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isVisible1}
                    onRequestClose={() => {
                        setIsVisible1(!isVisible1);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Do you want to Delete your account?</Text>
                            <View style={{ height: 1, backgroundColor: "#B3A492", marginTop: 5 }} />
                            <Text style={styles.subtiltleText}>In an account delete case, Your all account settings and wallet funds will be lost. You can't recover the account in the future. </Text>
                            <View style={styles.DeactivateButtonContainer}>
                                <TouchableOpacity onPress={() => setIsVisible1(!isVisible1)} style={styles.cancelButtonContainer}>
                                    <Text style={styles.cancelButtonContainerText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeleteaccount()} style={[styles.cancelButtonContainer, { backgroundColor: "#d42c2b" }]}>
                                    <Text style={styles.cancelButtonContainerText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

export default Setting;
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    menuBtns: {
        flexDirection: "row",
        marginBottom: 15,
        width: "100%",
        borderRadius: 5,
        padding: 10,
        display: "flex",
        flex: 1,
        backgroundColor: "#1b1b1b",
        borderColor:'#262626',
        borderWidth:1,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    modalView: {
        backgroundColor: "#424242",
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
    },
    modalText: { 
        fontSize: 20,
        fontWeight: "500",
        color: "#fff",
    },
    subtiltleText: {
        fontSize: 16,
        fontWeight: "400",
        textAlign: "left",
        marginTop: 10,
        color: "#fff",
    },
    DeactivateButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15,
    },
    cancelButtonContainer: {
        backgroundColor: "#9004fd",
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        width: "35%",
        borderRadius: 10,
    },
    cancelButtonContainerText: { fontSize: 15, fontWeight: "600", color: "#fff" },
    Loader: {
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
