import { View, Text, Image, TouchableOpacity, FlatList, ImageBackground, TouchableHighlight, ScrollView, SafeAreaView, Platform, StatusBar, Alert, StyleSheet, Modal, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { check, PERMISSIONS, RESULTS } from "@react-native-permissions/react-native-permissions";
import { apiCall } from "../utils/ApiComponent";

const Dashboard = ({ navigation }) => {
    let token = useSelector((state) => state.auth.authToken);
    const [isVisible, setIsVisible] = useState(false);
    const [launchpadsDetail, setLaunchpadDetails] = useState(null);

    // Call the function to check notification settings

    // useEffect(() => {
    //   checkNotificationSettings()
    // }, [])

    const launchpaidDetails = async () => {
        setIsVisible(true);
        const header = {
            "content-Type": "application/json",
            "x-access-token": token,
        };
        const method = "get";
        const subUri = "/lounchpaid/launchpaidDetails";
        const body = {};
        try {
            let response = await apiCall(header, subUri, method, body);
            console.log(response.data, " rep in calling");
            console.log(response.data, " data in calling");

            if (response.status == 200 || response.status == 201) {
                //   dispatch(setNotifCount(0))
                // console.log(response.data.result,'response data')
                setLaunchpadDetails(response?.data?.result);
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

    useEffect(() => {
        launchpaidDetails();
    }, []);

    return (
        <SafeAreaView style={{flex:1, backgroundColor:'#141516', paddingHorizontal:10, paddingVertical:15}}>
            <View>
                <Modal animationType="fade" visible={isVisible} transparent={true}>
                    <View style={[styles.modalView]}>
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
            <StatusBar barStyle="light-content" backgroundColor="#212121" />
            <View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{backgroundColor:'#212121', padding:10, borderRadius:12}}>
                        <View>
                            <Image source={require("../Images/rexx-crypto-lunchpad.png")} resizeMode="contain" style={{ width: '100%', height:220, }} />
                        </View>
                        <View style={{paddingVertical:10}}>
                            <Text style={{ fontSize: 25, color: "#fff", fontWeight: "700",}}>
                                The Launchpad Protocol for Everyone!
                            </Text>
                            <Text
                                style={{ fontSize: 15, color: "#fff", fontWeight: "400", lineHeight: 20, marginTop: 8, lineHeight: 24, }} >
                                Docoin helps everyone to create their own tokens and token sales in few seconds. Tokens created on Docoin will be verified and published on explorer websites.
                            </Text>
                        </View>
                    </View>
                    <View style={{}}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Create Token")}
                            style={styles.CreateTokenBtn}
                        >
                            <Text style={{ color: "#fff",fontSize: 18,fontWeight: "700",}}> 
                                Create Token 
                            </Text>
                        </TouchableOpacity>
                    </View> 
                    
                        <View>  
                            <View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems:'center', flexWrap:'wrap', gap:10}}  >
                                    <View style={styles.backgroundColorContent}>
                                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                          <Text style={styles.PriceText}>
                                              ₹ {launchpadsDetail?.totalRaised}
                                          </Text>
                                          <Text style={styles.presalepticeName}>
                                              Total liquidity Raised
                                          </Text>
                                      </View> 
                                    </View>
                                    <View style={styles.backgroundColorContent}>
                                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                          <Text style={styles.PriceText}>
                                              {launchpadsDetail?.totalPresale}
                                          </Text>
                                          <Text style={styles.presalepticeName}>
                                              Total Presale
                                          </Text>
                                      </View>
                                     </View> 
                                    <View style={styles.backgroundColorContent}>
                                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                            <Text style={styles.PriceText}>
                                                {launchpadsDetail?.myTokens}
                                            </Text>
                                            <Text style={styles.presalepticeName}> My Tokens 
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.backgroundColorContent}>
                                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                            <Text style={styles.PriceText}>
                                                {launchpadsDetail?.myPresale}
                                            </Text>
                                            <Text style={styles.presalepticeName}>
                                                My Presale
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={{ textAlign: "center", paddingTop: 15 }}>
                                <Text
                                    style={{
                                        fontSize: 20,
                                        color: "#fff",
                                        fontWeight: "700", 
                                    }}
                                >
                                    A Suite of Tools for Token Sales.
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#fff",
                                        fontWeight: "400",
                                        lineHeight: 22, 
                                        marginTop: 5,
                                    }}
                                >
                                    A suite of tools were built to help you create your own tokens and launchpads in a fast, simple and cheap way, with no prior code knowledge required and 100% decentralized!
                                </Text>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    display: "flex",
                                    width: "100%",
                                    alignSelf: "center",
                                    padding: 0,
                                    borderRadius: 5,
                                    marginTop: 20,
                                }}
                            >
                                <View
                                    style={{
                                        width: "100%",
                                        alignItems: "center",
                                        padding: 12,
                                        borderRadius: 5,
                                        width: "49%",
                                        backgroundColor: "#212121",
                                        borderRadius: 15,
                                    }}
                                >
                                    <Image source={require("../Images/standard.png")} resizeMode="contain" style={{ width: "100%" }} />
                                    <Text
                                        style={{
                                            fontSize: 22,
                                            color: "#fff",
                                            fontWeight: "700",
                                            lineHeight: 26,
                                            paddingTop: 20,
                                        }}
                                    >
                                        Standard
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: "#fff",
                                            fontWeight: "600",
                                            textAlign: "center",
                                            lineHeight: 18,
                                        }}
                                    >
                                        Mint standard tokens on ETH, BSC, AVAX, Fantom, Polygon.
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        width: "100%",
                                        alignItems: "center",
                                        padding: 12,
                                        borderRadius: 5,
                                        width: "49%",
                                        backgroundColor: "#212121",
                                        borderRadius: 15,
                                    }}
                                >
                                    <Image source={require("../Images/standard.png")} resizeMode="contain" style={{ width: "100%" }} />
                                    <Text
                                        style={{
                                            fontSize: 22,
                                            color: "#fff",
                                            fontWeight: "700",
                                            lineHeight: 26,
                                            paddingTop: 20,
                                            letterSpacing: 1,
                                        }}
                                    >
                                        Deflationary
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: "#fff",
                                            fontWeight: "600",
                                            textAlign: "center",
                                            lineHeight: 18,
                                        }}
                                    >
                                        Generate deflationary tokens with tax and/or charity functions.
                                    </Text>
                                </View>
                            </View>

                            <View style={{ textAlign: "center", padding: 10 }}>
                                <Text
                                    style={{
                                        fontSize: 25,
                                        color: "#9004fd",
                                        fontWeight: "700",
                                        paddingTop: 15,
                                        paddingBottom: 10,
                                        textAlign: "center",
                                    }}
                                >
                                    Disclaimer
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#ddd",
                                        paddingBottom: 10,
                                        fontWeight: "400",
                                        lineHeight: 20,
                                        textAlign: "center",
                                    }}
                                >
                                    Docoin will never endorse or encourage that you invest in any of the projects listed and therefore, accept no liability for any loss occasioned. It is the user(s) responsibility to do their own research
                                    and seek financial advice from a professional.
                                </Text>
                            </View>
                        </View>
                     
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
  CreateTokenBtn:{  
    borderRadius: 5, 
    backgroundColor: "#9004fd",
    marginVertical: 20,
    alignItems: "center",
    height:50,
    alignItems:'center',
    justifyContent:'center'
},
backgroundColorContent:{
  backgroundColor:'#424242',
  width:'100%',
  padding:15,
  borderRadius:10,
  borderBottomWidth:3,
  borderBottomColor:'#565c6c',
  borderRightWidth:3,
  borderRightColor:'#565c6c', 
},
PriceText:{
  fontSize: 25,
  color: "#fff",
  fontWeight: "700",
  lineHeight: 26, 
},
presalepticeName:{
  fontSize: 16,
  color: "#fff",
  fontWeight: "500", 
  lineHeight: 22,
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
