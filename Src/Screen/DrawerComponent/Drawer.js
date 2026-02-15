import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Platform, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutSuccess } from "../Redux-Toolkit/Slices/AuthSlices/AuthSlices";
import { CreateTokenDataClear } from "../Redux-Toolkit/Slices/createTokenSlice/CreateTokenSlice";
import { PresaleListnull } from "../Redux-Toolkit/Slices/PresaleSlice/PresaleSlice";
import AntDesign from "react-native-vector-icons/AntDesign";
import { sign } from "crypto";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import global from "../../../global";
// import { useSelector,useDispatch } from 'react-redux';
// import { logoutSuccess } from '../../redux/reducers/authSlice';
// import { fetchTokenApi, getAllBalanceApi, getTokenBalanceApi, getWalletsApi } from '../../utils/api';
// import { selectWallets, setBNBBalance, setBNBTokens, setBUSDBalance, setETHBalance, setETHTokens, setMATICBalance, setMATICTokens, setUSDCBalance, setUSDTBalance, setWallets } from '../../redux/reducers/walletSlice';
// import {tokenUsdtAddress, tokenUsdcAddress, tokenBusdAddress} from '../../contractAddress/TokenUsdtAddress'
const DrawerC = ({ ...props }) => {
    const dispatch = useDispatch();
    const UserDetails = useSelector((state) => state.auth.UserDetails);
    const wallet_Blanace = useSelector((state) => state.CreateToken.wallet_Blanace);
    const WalletBalance = useSelector((state) => state.auth);
    // console.log(WalletBalance,'wallet balance')
    // console.log(mainBalance.wallet_Blanace,'main balance')
    const [loading, setLoading] = useState(false);
    // const [userEmail, setUserEmail] = useState(isAuth[0]?.email);
    // const [userName, setUserName] = useState(isAuth[0]?.name);
    // const [userImage, setUserImage] = useState(isAuth[0]?.selfie);
    // console.log(userEmail, 'userEmail---');
    signOut = async () => {
        try {
            await GoogleSignin.signOut();
        } catch (error) {
            console.error(error);
        }
    };

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
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.user}>
                <View style={styles.profile}>
                    <View>
                        <Image
                            source={
                                UserDetails?.image !== null
                                    ? {
                                          uri: `https://apic.myreview.website:8444/${UserDetails?.image}`,
                                      }
                                    : require("../Images/profile.png")
                            }
                            style={{
                                height: 55,
                                width: 55,
                                resizeMode: "cover",
                                borderRadius: 50,
                            }}
                        />
                    </View>
                </View>
                <View style={styles.userDetails}>
                    <View>
                        <Text
                            style={{
                                fontWeight: "900",
                                fontSize: 20,
                                color: "#9004fd",
                                fontWeight: "600",
                                left: 5,
                            }}
                        >
                            {UserDetails?.fullName === "" || null ? "User" : UserDetails?.fullName}
                        </Text>
                    </View>
                    <View style={{paddingVertical:3}}>
                        <Text style={{ fontSize: 14, fontWeight: "400", color: "#fff", textAlign: "left", paddingHorizontal: 5 }}>{UserDetails?.email === undefined || null ? "user@gmail.com" : UserDetails?.email}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 14, fontWeight: "400", color: "#fff", textAlign: "left", paddingHorizontal: 5 }}>{`Bal: ${String(wallet_Blanace / 10 ** 18).slice(0, 8)} ${global.currecy}`}</Text>
                    </View>
                </View>
            </View>
            <View style={{ marginTop: 20 }}></View>
            <DrawerContentScrollView
                style={styles.list}
                {...props}
                // contentContainerStyle={{ backgroundColor: '#fff' }}
                StickyHeaderComponent={() => {
                    return <View style={{ height: 25, backgroundColor: "#9004fd", width: 45 }}></View>;
                }}
                stickyHeaderHiddenOnScroll={true}
            >
                <DrawerItemList {...props} />
                {/* <DrawerItem label={"Home"}
        labelStyle={styles.drawerlabel}
        icon={() =>
          <View style={{ backgroundColor: '#DFBD74', padding: 6, borderRadius: 50 }}>
            <AntDesign name='lock' color='#000000' size={15} />
          </View>}
        onPress={() => props.navigation.navigate("Home")} /> */}
            </DrawerContentScrollView>
            <TouchableOpacity
                onPress={() => {
                    HandleLogout();
                }}
                style={{
                    height: 50, 
                    backgroundColor: "#9004fd",
                    justifyContent: "center", 
                    marginBottom: 25,
                    borderRadius: 10,
                    marginHorizontal: 15,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingRight: 10, 
                    }}
                >
                    <View style={{ width: "70%" }}>
                        <Image source={require("../../Screen/Images/logout.png")} resizeMode="contain" style={{ width: "25%" }} />
                    </View>
                      <View style={{ alignSelf: "center", justifyContent: "flex-start" }}>
                        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Logout</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default DrawerC;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: "#212121",
    },

    list: {
        width: "100%",
        margintop: "2%",
        bottom: Platform.OS === "ios" ? 55 : null,
    },

    user: {
        // width: '95%',
        // height: '15%',
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#424242",
        gap: 5,
        borderStyle: Platform.OS === "ios" ? null : "dashed",
        backgroundColor: "#212121",
        bottom: Platform.OS === "ios" ? null : 10,
    },

    profile: {
        width: 70,
        height: 70,
        backgroundColor: "#141516",
        alignSelf: "center",
        borderRadius: 100,
        justifyContent: "center",
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#321E1E",
    },

    profileText: {
        alignSelf: "center",
        color: "#0456A2",
        overflow: "hidden",
    },

    userDetails: {
        width: "70%",
        height: "30%",
        alignSelf: "center",
        justifyContent: "center",
    },

    userDetailsText1: {
        fontSize: 20,
        color: "#fff",
    },

    userDetailsText2: {
        color: "#fff",
    },
});
