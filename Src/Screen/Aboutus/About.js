import { View, Text, ScrollView, Image, SafeAreaView, ImageBackground, Modal, ActivityIndicator, StyleSheet, Dimensions, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import { apiCall } from "../utils/ApiComponent";
import { useSelector } from "react-redux";
import RenderHTML from "react-native-render-html";

const About = ({ navigation }) => {
    const getAboutData = useSelector((state) => state.auth.aboutusData);
    console.log(getAboutData, "get");
    // const [aboutData, setAboutData] = useState(null);
    // const [isVisible, setIsVisible] = useState(false);
    // const [webviewContent, setWebViewContent] = useState(null);

    // const getAboutUsData = async () => {
    //   setIsVisible(true);
    //   const header = {
    //     'content-Type': 'application/json',
    //   };
    //   const method = 'get';
    //   const subUri = '/news/about-us';
    //   const body = {};
    //   try {
    //     let response = await apiCall(header, subUri, method, body);
    //     // console.log(response.data, ' rep in calling');

    //     if (response.status == 200 || response.status == 201) {
    //       //   dispatch(setNotifCount(0))
    //       // console.log(response.data.result,response.data.result[0].description,'sunil data')
    //       setAboutData(response?.data?.result);
    //       setWebViewContent(response?.data?.result[0].description);
    //       setIsVisible(false);
    //     } else {
    //       // Alert.alert(response);
    //       console.log(response, 1);
    //       setIsVisible(false);
    //     }
    //   } catch (err) {
    //     if (err.data) {
    //       // Alert.alert(err.data.response);
    //       console.log(err.response, 2);
    //       setIsVisible(false);
    //     } else {
    //       // Alert.alert(err.message);
    //       console.log(err.message, 3);
    //       setIsVisible(false);
    //     }
    //   }
    // };
    // if(webviewContent.length > 0){
    // /
    // }

    const [data, setData] = useState(null);

    useEffect(() => {
        // const arrayToString = (array) => {
        //       const string = String.fromCharCode(...array);
        //       return string;
        //     };
        //     // Example usage
        //     const result = arrayToString(getAboutData);
        //     setData(result)
    }, []);

    const width = Dimensions.get("screen").width;

    const source = getAboutData;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#141516", paddingHorizontal: 10 }}>
            <StatusBar barStyle="light-content" backgroundColor="#212121" />
            <View>
                <ScrollView>
                    <View style={{ flex: 1 }}>
                        <RenderHTML
                            baseStyle={{
                                fontSize: 14,
                                color: "#c1c1c1",
                                letterSpacing: 0.5,
                                fontWeight: "400",
                                textAlign: "justify",
                            }}
                            contentWidth={width}
                            source={{ html: getAboutData }}
                        />
                    </View>
                    {/* <Text>{getAboutData}</Text> */}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default About;

const styles = StyleSheet.create({
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
