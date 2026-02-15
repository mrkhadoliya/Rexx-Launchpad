import { View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, ScrollView, Image, ImageBackground, Button, Platform, Alert, ActivityIndicator, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import { Dropdown } from "react-native-element-dropdown";
import { apiCall } from "./utils/ApiComponent";
import { useDispatch, useSelector } from "react-redux";
import { CreateTokenResult } from "./Redux-Toolkit/Slices/createTokenSlice/CreateTokenSlice";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageCropPicker from "react-native-image-crop-picker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CustomModal from "./components/CustomModal";
import { autoUpdateApp } from "./Redux-Toolkit/Slices/AuthSlices/AuthSlices";
// const data = [
//   {label: 'BNB', value: '1'},
//   {label: 'ETH', value: '2'},
//   {label: 'USDT', value: '3'},
//   {label: 'BUST', value: '4'},
// ];
const data = [{ value: 3 }, { value: 6 }, { value: 9 }, { value: 12 }, { value: 15 }, { value: 18 }];

const Createtoken = ({ navigation }) => {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const handleModal = () => setIsModalVisible(() => !isModalVisible);
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [decimals, setDecimals] = useState("");
    const [totalSupple, setTotalSupple] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [fetchToken, setFetchToken] = useState("");
    const [tokenImage, setTokenImage] = useState("");
    const [dropdown, setDropdown] = useState(null);
    const [selected, setSelected] = useState([]);
    const [isVisible1, setIsVisible1] = useState(false);
    const [errorMessage, setErrrorMessage] = useState("");
    const [type, setType] = useState("");
    //   console.log(value, isFocus, 'lkjhgfdsa');

    const dispatch = useDispatch();

    const renderLabel = () => {
        if (value || isFocus) {
            return <Text style={[styles.label, isFocus && { color: "#fff", borderColor: "#BCC3C7" }]}>Dropdown label</Text>;
        }
        return null;
    };

    const AuthToken = useSelector((state) => state.auth.authToken);
    const autoUpdates = useSelector((state) => state.auth.autoUpdate);
    // console.log(AuthToken,'Auth Token')

    const handleCreateToken = async () => {
        setIsVisible(true);

        if (name && symbol && decimals && totalSupple) {
            const bodyData = new FormData();
            bodyData.append("name", name);
            bodyData.append("symbol", symbol);
            bodyData.append("decimal", decimals);
            bodyData.append("totalSupply", totalSupple);
            // bodyData.append('tokenImage', {
            //   uri: tokenImage,
            //   type: 'image/jpg',
            //   name: 'imageName.jpg',
            // });
            if (tokenImage !== "") {
                bodyData.append("tokenImage", {
                    uri: tokenImage,
                    type: "image/jpg",
                    name: "imageName.jpg",
                });
            } else {
                bodyData.append("tokenImage", null);
            }
            const header = {
                "Content-Type": "multipart/form-data",
                "x-access-token": AuthToken,
            };
            const subUri = "/lounchpaid/createToken";
            const method = "post";
            const data = bodyData;
            try {
                const res = await apiCall(header, subUri, method, data);
                if (res.status == 200 || res.status == 201) {
                    if (Platform.OS === "ios") {
                        Toast.show(res.data.message, Toast.SHORT);
                    } else {
                        ToastAndroid.show(res.data.message, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                    }
                    dispatch(CreateTokenResult(res.data.result));
                    dispatch(autoUpdateApp(!autoUpdates));
                    setDecimals("");
                    setName("");
                    setTotalSupple("");
                    setSymbol("");
                    setTokenImage("");
                    setIsVisible(false);
                } else {
                    setIsVisible(false);
                    Alert.alert("Error", res.data.error);
                    console.log("try eror");
                    setTokenImage("");
                }
            } catch (err) {
                if (err.data) {
                    // Alert.alert(err?.data?.response,'ikol');
                    console.log(err?.response, "5");
                    setType("error");
                    setErrrorMessage(err?.response?.data?.error);
                    setIsVisible1(true);
                    setIsVisible(false);
                } else {
                    // Alert.alert(err?.response?.data?.message,'second alert');
                    console.log(err?.response?.data.error, "second console");
                    setType("error");
                    setErrrorMessage(err?.response?.data.error);
                    setIsVisible1(true);
                    setIsVisible(false);
                }
            }
        } else {
            Alert.alert("Please fill all the required inputs");
            setIsVisible(false);
        }
    };

    const handleuploadImage = async () => {
        await ImageCropPicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        })
            .then((image) => {
                setTokenImage(image.path);
            })
            .catch((error) => {
                console.log(error, "error in image picker");
            });
    };

    console.log(tokenImage, "tokenimage");

    const _renderItem = (item) => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.value}</Text>
            </View>
        );
    };
    return (
        <SafeAreaView style={{flex: 1, backgroundColor:'#141516' }}>
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
                <View style={{ color: "#fff", height: "100%" }}>
                    <View style={{ paddingHorizontal: 10 }}>
                        {/* <Text
                            style={{
                                color: "#fff",
                                fontSize: 25,
                                fontWeight: "700",
                                paddingBottom: 5,
                            }}
                        >
                            {" "}
                            Create Token
                        </Text> */}
                        <View style={{ marginTop: 10 }}>
                            {/* <View style={styles.container}>
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 15,
                                fontWeight: '600',
                                paddingBottom: 5,
                              }}>
                              Token Type
                            </Text>
                            {renderLabel()}
                            <Dropdown
                              style={[styles.dropdown, isFocus && {borderColor: '#fff'}]}
                              placeholderStyle={styles.placeholderStyle}
                              selectedTextStyle={styles.selectedTextStyle}
                              inputSearchStyle={styles.inputSearchStyle}
                              iconStyle={styles.iconStyle}
                              itemTextStyle={styles.itemTextStyle}
                              data={data}
                              maxHeight={160}
                              labelField="label"
                              valueField="value"
                              placeholder={!isFocus ? 'Standard Token' : ''}
                              searchPlaceholder="Search..."
                              value={value}
                              onFocus={() => setIsFocus(true)}
                              onBlur={() => setIsFocus(false)}
                              onChange={item => {
                                setValue(item.label);
                                setIsFocus(false);
                              }}
                            />
                          </View> */}

                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 15,
                                    paddingBottom: 5,
                                    fontWeight: "500",
                                    paddingTop: 10,
                                }}
                            >Name
                            </Text>
                            <TextInput
                                style={[styles.inputs, { height: Platform.OS === "android" ? null : 45 }]}
                                placeholder="Ethereum"
                                placeholderTextColor={"#fff"}
                                textColor="#fff"
                                value={name}
                                onChangeText={(text) => setName(text)}
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
                                {" "}
                                Symbol
                            </Text>
                            <TextInput style={[styles.inputs, { height: Platform.OS === "android" ? null : 45 }]} placeholder="ETH" placeholderTextColor={"#fff"} value={symbol} onChangeText={(text) => setSymbol(text)} />

                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 15,
                                    paddingBottom: 5,
                                    fontWeight: "500",
                                    paddingTop: 10,
                                }}
                            >Decimals
                            </Text>
                            <View
                                style={{
                                    height: 45, 
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    paddingHorizontal: 10, 
                                    borderRadius: 5,
                                    backgroundColor:'#212121'
                                }}
                            >
                                <Text style={{ color: "#fff" }}>{decimals}</Text>

                                <Dropdown
                                    style={{ width: "100%", right: 15,}}
                                    data={data}
                                    valueField="value"
                                    label="Dropdown"
                                    value={dropdown}
                                    onChange={(item) => {
                                        setDropdown(item.value);
                                        setDecimals(item.value);
                                    }}
                                    selectedTextStyle="#212121"
                                    renderItem={(item) => _renderItem(item)}
                                    textError="Error"
                                    mode="default"
                                    placeholder="18"
                                    placeholderStyle={{ marginHorizontal: 10, fontSize: 15, padding: 5 }}
                                    containerStyle={{
                                      backgroundColor:'#414141',
                                      padding:10,
                                      borderRadius:12,
                                      borderWidth:0,
                                      width:'95%'
                                    }}
                                    itemContainerStyle={{
                                      backgroundColor:'#212121',
                                      marginVertical:2,
                                      paddingHorizontal:20,
                                      borderRadius:5
                                    }}
                                    activeColor={{
                                      backgroundColor:'#9004fd',
                                      color:'#fff'
                                    }}
                                />
                            </View>

                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 15,
                                    paddingBottom: 5,
                                    fontWeight: "500",
                                    paddingTop: 10,
                                }}
                            >Total Supply
                            </Text>
                            <TextInput
                                style={[styles.inputs, { height: Platform.OS === "android" ? null : 45 }]}
                                placeholder="Ex:1ffffff"
                                placeholderTextColor={"#fff"}
                                value={totalSupple}
                                onChangeText={(text) => setTotalSupple(text)}
                                maxLength={18}
                                keyboardType="decimal-pad"
                            />
                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 15,
                                    paddingBottom: 5,
                                    fontWeight: "500",
                                    paddingVertical: 10,
                                }}
                            >
                                Upload Token Image
                            </Text>
                            <TouchableOpacity onPress={() => handleuploadImage()} style={styles.HanldeImageContainer}>
                                <Text style={{ fontSize: 16, color: "#fff", fontWeight: "600" }}>Choose File</Text>
                            </TouchableOpacity>

                            {tokenImage ? (
                                <Image
                                    source={{ uri: tokenImage }}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        resizeMode: "contain",
                                        marginTop: 15,
                                        alignSelf: "center",
                                        // backgroundColor: 'red',
                                    }}
                                />
                            ) : null}

                            <View style={{}}>
                                <Text
                                    onPress={() => handleCreateToken()}
                                    style={{
                                        color: "#fff",
                                        fontSize: 18,
                                        fontWeight: "700", 
                                        paddingHorizontal: 10,
                                        textAlign: "center",
                                        paddingVertical: 10,
                                        borderRadius: 5,
                                        width: "100%",
                                        backgroundColor: "#9004fd",
                                        marginTop: 20,
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        flexDirection: "row",
                                    }}
                                >Continue
                                </Text>
                            </View>
                            {/* <Button title="button" onPress={handleModal} /> */}
                        </View>
                    </View>

                    <View style={styles.container}>
                        <View style={styles.separator} />

                        <Modal isVisible={isModalVisible}>
                            <View
                                style={{
                                    alignSelf: "center",
                                    backgroundColor: "#414141",
                                    borderRadius: 20,
                                    minHeight: 100,
                                    color: "#fff",
                                    paddingHorizontal: 10,
                                    alignItems: "center",
                                    paddingTop: 20,
                                }}
                            >
                                <Image source={require("./Images/success.png")} />
                                <Text
                                    style={{
                                        color: "#fff",
                                        fontSize: 25,
                                        fontWeight: 700,
                                        paddingTop: 20,
                                        paddingBottom: 10,
                                    }}
                                >
                                    Create Token Successfully
                                </Text>
                                <Text
                                    style={{
                                        color: "#fff",
                                        fontSize: 15,
                                        fontWeight: 400,
                                        textAlign: "center",
                                        paddingBottom: 20,
                                    }}
                                >
                                    0xc0eF2d9ebfA1669fFC52AF1b Ea47E9819126dAEC
                                </Text>
                                <Text
                                    onPress={handleModal}
                                    style={{
                                        color: "#fff",
                                        fontSize: 18,
                                        fontWeight: "700", 
                                        paddingHorizontal: 10,
                                        textAlign: "center",
                                        paddingVertical: 10,
                                        marginBottom: 30,
                                        borderRadius: 5,
                                        width: "100%",
                                        backgroundColor: "#9004fd",
                                        marginTop: 20,
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        flexDirection: "row",
                                    }}
                                >Continue
                                </Text>
                                {/* <Button style={styles.sds} title="Close" onPress={handleModal} /> */}
                            </View>
                        </Modal>
                    </View>
                    <CustomModal MainTitle={errorMessage} isVisible1={isVisible1} setIsVisible1={setIsVisible1} type={type} OkButtonPressed={() => setIsVisible1(!isVisible1)} />
                </View>
            </ScrollView> 
        </SafeAreaView>
    );
};
export default Createtoken;

const styles = StyleSheet.create({
    inputs: { 
        paddingLeft: 10,
        borderRadius: 5,
        width: "100%",
        color: "#fff",
        backgroundColor:'#212121'
    },

    title: {
        fontSize: 20,
        fontWeight: "bold",
        backgroundColor: "red",
    },

    text: {
        fontSize: 16,
        fontWeight: "400",
        textAlign: "center",
    },
    separator: {
        marginVertical: 10,
        height: 0,
        width: "80%",
    },
    sds: {
        position: "absolute",
        backgroundColor: "red",
    },

    dropdown: {
        height: 46,
        backgroundColor:'#212121',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 8,
        color: "#fff",
    },

    icon: {
        marginRight: 5,
    },

    label: {
        position: "absolute",
        backgroundColor: "#212121",
        left: 22,
        top: 0,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
        display: "none",
    },

    placeholderStyle: {
        fontSize: 16,
        color: "#fff",
    },
    input: {
        borderWidth: 1,
        borderColor: "#BCC3C7",
        paddingLeft: 10,
        borderRadius: 5,
        color: "#fff",
        padding: 8,
    },

    selectedTextStyle: {
        fontSize: 16,
        color: "#fff",
    },

    iconStyle: {
        width: 20,
        height: 20,
    },

    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: "#fff",
    },
    itemTextStyle: {
        color: "#fff",
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
        // shadowColor: '#fff',
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
        width: "115%",
        flex: 1,
        right: 25,
    },
    HanldeImageContainer: {
        height: 50, 
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#414141",
    },
    textItem: {
        flex: 1,
        fontSize: 16,
        color: "#fff",
    },
    item: {
        paddingVertical: 17,
        paddingHorizontal: 4,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});
