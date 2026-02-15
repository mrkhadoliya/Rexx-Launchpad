import { View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, ScrollView, Image, ImageBackground, Platform, Alert, Modal, ActivityIndicator, StatusBar, ToastAndroid } from "react-native";
import React, { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { apiCall } from "./utils/ApiComponent";
import CustomModal from "./components/CustomModal";
const Forgotpassword = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [isVisible1, setIsVisible1] = useState(false);
    const [errorMessage, setErrrorMessage] = useState("");
    const [type, setType] = useState("");
    let arrayBackName = "chevron-back-outline";

    if (Platform.OS === "ios") {
        arrayBackName = "chevron-back-outline";
    } else {
        arrayBackName = "arrow-back";
    }

    const handleForgetPassword = async () => {
        setErrrorMessage("");
        if (email.length > 0) {
            setIsVisible(true);
            const header = { "Content-Type": "application/json" };
            const subUri = "/user/forgetAppPassword";
            const method = "post";
            const data = {
                email,
            };
            try {
                const response = await apiCall(header, subUri, method, data);
                // console.log(response, ' rep in calling');
                // console.log(response.data, ' data in calling');

                if (response.status == 200 || response.status == 201) {
                    console.log(response, " data in calling");
                    // Alert.alert(response?.data?.message);
                    navigation.navigate("Change Password");
                    setIsVisible(false);
                } else {
                    setIsVisible(false);
                    Alert.alert(response?.data?.error);
                }
            } catch (err) {
                if (err.response.data.error) {
                    setIsVisible(false);
                    setType("error");
                    setErrrorMessage(err?.response?.data?.error);
                    setIsVisible1(true);
                    // Alert.alert(err.response.data.error);
                    console.log(err, "error in catch if ", err.response.data.error);
                } else {
                    setIsVisible(false);
                    Alert.alert(err.message);
                }
            }
        } else {
            // setType("error");
            // setErrrorMessage("Email or Phone number can not be empty");
            // setIsVisible1(true);
            ToastAndroid.showWithGravityAndOffset(
              'Email or Password can not be empty',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
              25,
              50,
            )
        }
    };

    return (
        <SafeAreaView style={{ height: "100%", backgroundColor: "#141516" }}>
            <StatusBar barStyle="light-content" backgroundColor="#212121" />
            <View>
                <Modal animationType="fade" visible={isVisible} transparent={true}>
                    <View style={[styles.modalView]}>
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                            <ActivityIndicator size="large" color="#9004fd" />
                        </View>
                    </View>
                </Modal>
            </View>
            <ScrollView>
                <View style={{ height: "100%" }}>
                    <View style={{ paddingHorizontal: 10 }}>
                        <View
                            style={{
                                alignItems: "center",
                                flexDirection: "row",
                                paddingTop: 50,
                                paddingBottom: 5,
                            }}
                        > 

                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 30,
                                    fontWeight: "700",
                                    textAlign: "center",
                                    flex: 1,
                                    right: 10,
                                }}
                            >
                                Forgot Password
                            </Text>
                        </View>
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 15,
                                fontWeight: "400",
                                textAlign: "center",
                            }}
                        >
                            Recover your account Password
                        </Text>

                        <View style={{ marginTop: 50 }}>
                            <Text style={styles.lableText}>Email / Phone Number</Text>
                            <TextInput style={styles.input} placeholder="Enter Email or Phone Number" placeholderTextColor={"#424242"} keyboardType={"email-address"} value={email} onChangeText={(text) => setEmail(text)} />

                            <View style={{}}>
                                <TouchableOpacity
                                    onPress={() => handleForgetPassword()}
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
                                        Continue
                                    </Text>
                                    <Image source={require("./Images/arrows.png")} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <CustomModal MainTitle={errorMessage !== "" ? errorMessage : "Email or Phone number can not be empty!"} isVisible1={isVisible1} setIsVisible1={setIsVisible1} type={type} OkButtonPressed={() => setIsVisible1(!isVisible1)} />
            </ScrollView>
        </SafeAreaView>
    );
};
export default Forgotpassword;

const styles = StyleSheet.create({
    lableText: {
        color: "#fff",
        fontSize: 15,
        paddingBottom: 10,
        fontWeight: "500",
        paddingTop: 10,
    },
    input: {
        backgroundColor: "#212121",
        paddingLeft: 15,
        borderRadius: 5,
        width: "100%",
        color: "#fff",
        height: 50,
        marginBottom: 15,
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
