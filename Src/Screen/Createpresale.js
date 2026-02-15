import { View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, ScrollView, Image, Platform, ToastAndroid, Button, Alert, Modal, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-simple-toast";
import DatePicker from "react-native-date-picker";
import { apiCall } from "./utils/ApiComponent";
import { CreatePreSaleSuccess } from "./Redux-Toolkit/Slices/AuthSlices/AuthSlices";
import { AutoPresaleDataUpdate } from "./Redux-Toolkit/Slices/PresaleSlice/PresaleSlice";
import CustomModal from "./components/CustomModal";
import { useNavigation } from "@react-navigation/native";
const Createpresale = () => {
    const countries = ["Egypt", "Canada", "Australia", "Ireland"];
    const [isVisible, setIsVisible] = useState(false);
    const [saleRate, setSaleRate] = useState("");
    const [hardCap, setHardCap] = useState("");
    const [softCap, setSoftCap] = useState("");
    const [liquidity, setLiquidity] = useState("");
    const [saleTimeStart, setSaleTimeStart] = useState("");
    const [endTimeStart, setEndTimeStart] = useState("");
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [date1, setDate1] = useState(new Date(date));
    const [open1, setOpen1] = useState(false);
    const [tokenAddress, settokenAddress] = useState("");
    const [isVisible1, setIsVisible1] = useState(false);
    const [errorMessage, setErrrorMessage] = useState("");
    const [type, setType] = useState("");

    const navigation = useNavigation();

    const dateObject = new Date(date);
    const dateObject2 = new Date(date1);

    // Extract date components
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1; // Months are zero-based
    const day = dateObject.getDate();
    const yearend = dateObject2.getFullYear();
    const monthend = dateObject2.getMonth() + 1; // Months are zero-based
    const dayend = dateObject2.getDate();
    const CreateTokenResult = useSelector((state) => state.CreateToken.tokenResultData);
    const createPreSale = useSelector((state) => state.auth.createPreSale);
    const dispatch = useDispatch();
    const AuthToken = useSelector((state) => state.auth.authToken);

    const handleCreatePresale = async () => {
        setIsVisible(true);
        if (saleRate && hardCap && liquidity) {
            const header = {
                "content-Type": "application/json",
                "x-access-token": AuthToken,
            };
            const subUri = "/lounchpaid/createPreasale";
            const method = "post";
            const data = {
                tokenAddress: tokenAddress,
                rate: saleRate,
                softCap: softCap,
                hardCap: hardCap,
                liquidityPercent: liquidity,
                openingTime: saleTimeStart,
                closingTime: endTimeStart,
            };
            try {
                const res = await apiCall(header, subUri, method, data);

                if (res.status == 200 || res.status == 201) {
                    if (Platform.OS === "ios") {
                        Toast.show(res.data.message, Toast.SHORT);
                    } else {
                        ToastAndroid.show(res.data.message, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                    }
                    dispatch(CreatePreSaleSuccess(res?.data.result));
                    dispatch(AutoPresaleDataUpdate(true));
                    setHardCap("");
                    setSaleTimeStart("");
                    setEndTimeStart("");
                    setLiquidity("");
                    setSaleRate("");
                    setIsVisible(false);
                    navigation.navigate("Presales List");
                } else {
                    setIsVisible(false);
                    Alert.alert("Error", res?.data?.error);
                    console.log("try eror");
                }
            } catch (err) {
                if (err.data) {
                    // setType('error')
                    // setErrrorMessage(err?.response?.data?.message)
                    // setIsVisible1(true)
                    // Alert.alert('Failed',err?.data?.response.message,);
                    console.log(err?.data?.response);
                    setIsVisible(false);
                } else {
                    // setType("error");
                    // setErrrorMessage(err?.response?.data?.message);
                    // setIsVisible1(true);

                    ToastAndroid.showWithGravityAndOffset(
                        (err?.response?.data?.message),
                        ToastAndroid.CENTER,
                        ToastAndroid.LONG,
                        25,
                        50,
                      );

                    // Alert.alert('Failed1',err?.response?.data?.message,);
                    console.log(err?.response?.data, "lololo");
                    setIsVisible(false);
                }
            }
        } else {
            Alert.alert("Please fill all the required inputs");
            setIsVisible(false);
        }
    };
    console.log(tokenAddress, "tokensuasdhfeuhhjsdjshjdshj");
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
            <ScrollView>
                <View style={{ color: "#000", height: "100%" }}>
                    <View style={{ paddingHorizontal: 10 }}>
                        {/* <Text style={{ color: '#000', fontSize: 30, fontWeight: '700', paddingBottom: 5, }}> Create Presale</Text> */}

                        <View style={{ marginTop: 10 }}>
                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 15,
                                    paddingBottom: 5,
                                    fontWeight: "500",
                                    paddingTop: 10,
                                }}
                            >
                                Token Address
                            </Text>
                            <TextInput
                                style={[styles.input, { height: Platform.OS === "android" ? null : 45 }]}
                                placeholder="0x8A7022dcc4D3...."
                                placeholderTextColor={"#808080"}
                                value={tokenAddress}
                                onChangeText={(text) => settokenAddress(text)}
                            />
                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 15,
                                    paddingBottom: 5,
                                    fontWeight: "500",
                                    paddingTop: 10,
                                }}
                            >
                                Sale Rate
                            </Text>
                            <TextInput
                                style={[styles.input, { height: Platform.OS === "android" ? null : 45 }]}
                                placeholder="Sale Rate.."
                                placeholderTextColor={"#808080"}
                                keyboardType="decimal-pad"
                                value={saleRate}
                                onChangeText={(text) => setSaleRate(text)}
                            />
                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 15,
                                    paddingBottom: 5,
                                    fontWeight: "500",
                                    paddingTop: 10,
                                }}
                            >
                                Soft Cap in ETH
                            </Text>
                            <TextInput
                                style={[styles.input, { height: Platform.OS === "android" ? null : 45 }]}
                                placeholder="Soft Cap.."
                                placeholderTextColor={"#808080"}
                                keyboardType="decimal-pad"
                                value={softCap}
                                onChangeText={(text) => setSoftCap(text)}
                            />

                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 15,
                                    paddingBottom: 5,
                                    fontWeight: "500",
                                    paddingTop: 10,
                                }}
                            >
                                Hard Cap in ETH
                            </Text>
                            <TextInput
                                style={[styles.input, { height: Platform.OS === "android" ? null : 45 }]}
                                placeholder="Hard Cap.."
                                placeholderTextColor={"#808080"}
                                keyboardType="decimal-pad"
                                value={hardCap}
                                onChangeText={(text) => setHardCap(text)}
                            />

                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 15,
                                    paddingBottom: 5,
                                    fontWeight: "500",
                                    paddingTop: 10,
                                }}
                            >
                                Liquidity %
                            </Text>
                            <TextInput
                                style={[styles.input, { height: Platform.OS === "android" ? null : 45 }]}
                                placeholder="percent in number.."
                                placeholderTextColor={"#808080"}
                                keyboardType="decimal-pad"
                                value={liquidity}
                                onChangeText={(text) => setLiquidity(text)}
                            />

                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 15,
                                    paddingBottom: 5,
                                    fontWeight: "500",
                                    paddingTop: 10,
                                }}
                            >
                                Sale Time Start
                            </Text>
                            {/* <TextInput
                            style={[
                              styles.input,
                              {height: Platform.OS === 'android' ? null : 45},
                            ]}
                            placeholderTextColor={'#000'}
                          /> */}
                            <View
                                style={{
                                    height: 50,
                                    backgroundColor: "#212121",
                                    borderRadius: 5,
                                    marginTop: 5,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingHorizontal: 10,
                                }}
                            >
                                <View></View>
                                <Text style={{ width: "75%", color: "#fff" }}>{`${date.toLocaleTimeString()}     ${year}/${month}/${day}`}</Text>

                                <TouchableOpacity onPress={() => setOpen(true)}>
                                    <Text
                                        style={{
                                            alignSelf: "flex-end",
                                            textAlign: "right",
                                            fontSize: 15,
                                            color: "#9004fd",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Select Time
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <DatePicker
                                modal
                                open={open}
                                minimumDate={new Date()}
                                mini
                                date={date}
                                onConfirm={(date) => {
                                    setOpen(false);
                                    setDate(date);
                                    // console.log(date,'dateaaaaaaa000')
                                }}
                                onCancel={() => {
                                    setOpen(false);
                                }}
                            />
                            <DatePicker
                                modal
                                open={open1}
                                minimumDate={new Date()}
                                mini
                                date={date1}
                                onConfirm={(Enddate) => {
                                    const dateSecond = Math.floor(date.getTime() / 1000);
                                    const endDate = Math.floor(Enddate.getTime() / 1000);
                                    console.log(dateSecond, endDate, "eheheheheh");
                                    if (dateSecond < endDate) {
                                        setSaleTimeStart(dateSecond);
                                        setEndTimeStart(endDate);
                                        setDate1(Enddate);
                                        setOpen1(false);
                                    } else {
                                        Alert.alert("End Time should be greater then start time");
                                        setOpen1(false);
                                        console.log("wrong");
                                    }
                                }}
                                onCancel={() => {
                                    setOpen1(false);
                                }}
                            />

                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 15,
                                    paddingBottom: 5,
                                    fontWeight: "500",
                                    paddingTop: 10,
                                }}
                            >
                                Sale Time End
                            </Text>
                            {/* <TextInput
                                style={[
                                  styles.input,
                                  {height: Platform.OS === 'android' ? null : 45},
                                ]}
                                placeholderTextColor={'#000'}
                              /> */}
                            <View
                                style={{
                                    height: 50,
                                    backgroundColor: "#212121",
                                    borderRadius: 5,
                                    marginTop: 5,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingHorizontal: 10,
                                }}
                            >
                                <Text style={{ width: "75%", color: "#fff" }}>{`${date1.toLocaleTimeString()}     ${yearend}/${monthend}/${dayend}`}</Text>
                                <TouchableOpacity onPress={() => setOpen1(true)}>
                                    <Text
                                        style={{
                                            alignSelf: "flex-end",
                                            textAlign: "right",
                                            fontSize: 15,
                                            color: "#9004fd",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Select Time
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ textAlign: "center" }}>
                                <TouchableOpacity
                                    onPress={() => handleCreatePresale()}
                                    style={{
                                        paddingHorizontal: 10,
                                        paddingVertical: 10,
                                        borderRadius: 5,
                                        textAlign: "center",
                                        width: "100%",
                                        backgroundColor: "#9004fd",
                                        marginTop: 20,
                                        alignItems: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#fff",
                                            fontSize: 18,
                                            fontWeight: "700",
                                        }}
                                    >
                                        Create Presale
                                    </Text>
                                    {/* <Image source={require("./Images/arrows.png")} /> */}
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: 20 }}></View>
                        </View>
                    </View>
                </View>
                <CustomModal MainTitle={errorMessage} isVisible1={isVisible1} setIsVisible1={setIsVisible1} OkButtonPressed={() => setIsVisible1(!isVisible1)} type={type} />
            </ScrollView>
        </SafeAreaView>
    );
};
export default Createpresale;

const styles = StyleSheet.create({
    input: {
        backgroundColor: "#1b1b1b",
        borderColor:'#262626',
        borderWidth:1,
        paddingLeft: 10,
        borderRadius: 5,
        width: "100%",
        color: "#fff",
        marginBottom: 8,
    },
    modalView: {
        backgroundColor: "#3c40434d",
        // padding: 35,
        alignItems: "center",
        shadowOffset:
            Platform.OS === "android"
                ? {
                      width: 0,
                      height: 2,
                  }
                : null,
        shadowOpacity: Platform.OS === "android" ? 0.25 : null,
        shadowRadius: Platform.OS === "android" ? 4 : null,
        elevation: Platform.OS === "android" ? 5 : null,
        // elevation: 5,
        width: "100%",
        flex: 1,
        right: 25,
    },
});
