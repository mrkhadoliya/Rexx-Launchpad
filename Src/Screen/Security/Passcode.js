import { StyleSheet, Text, View, TextInput, StatusBar, Alert, ToastAndroid, SafeAreaView, TouchableOpacity, ImageBackground } from "react-native";
import React, { useRef, useState } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Passcode = ({ navigation, route }) => {
    const pass = useSelector((state)=> state.auth.passcodeActive);
    const [isVisible, setIsVisible] = useState(false);
    const dispatch = useDispatch();
    const handlePass = async () => {
        setIsVisible(true);
        const otpString = otpDigits.join("");
        if(otpString==pass){
            navigation.reset(
                {
                    index: 0,
                    routes: [{ name: 'MyDrawer' }], 
                  }
            )
        }
    };
    const numberOfOtpFields = 4; // Corrected to 4 for a 4-digit OTP
    const otpInputRefs = useRef([]);

    // Store the OTP digits in state
    const [otpDigits, setOtpDigits] = useState(new Array(numberOfOtpFields).fill(""));

    // Helper function to focus the next OTP input field
    const focusNextField = (index) => {
        if (index < numberOfOtpFields - 1) {
            otpInputRefs.current[index + 1].focus();
        }
    };

    // Helper function to focus the previous OTP input field
    const focusPreviousField = (index) => {
        if (index > 0) {
            otpInputRefs.current[index - 1].focus();
        }
    };

    // Handle OTP input change
    const handleOtpInputChange = (index, value) => {
        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = value;
        setOtpDigits(newOtpDigits);

        // Move focus to the next input field
        if (value && index < numberOfOtpFields - 1) {
            focusNextField(index);
        }
    };

    // Handle OTP input deletion
    const handleOtpInputDelete = (index, value) => {
        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = value;
        setOtpDigits(newOtpDigits);

        // Move focus to the previous input field
        if (index > 0) {
            focusPreviousField(index);
        }
    };

    return (
        <SafeAreaView style={styles.SafeAreaViewContainer}>
            <StatusBar backgroundColor="#38ACE9" barStyle="dark-content" />
             <ImageBackground
        source={require('../Images/backimage.png')}
        style={[styles.SafeAreaViewContainer,{padding:15}]}>
            <View style={styles.passcodeHead}>
                <Text style={styles.passcodeHeading}>ENTER PASSCODE !</Text>
                <Text style={styles.passcodesub}>Please enter your passcode!</Text>
            </View>
            <View style={{ marginTop: 50, width:'100%' }}>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", gap:10 }}>
                    {otpDigits.map((digit, index) => (
                        <TextInput
                            secureTextEntry
                            key={index}
                            style={styles.TextInputs}
                            value={digit}
                            onChangeText={(value) => {
                                handleOtpInputChange(index, value);
                                console.log(otpDigits);
                            }}
                            onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === "Backspace") {
                                    handleOtpInputDelete(index, "");
                                }
                            }}
                            ref={(ref) => (otpInputRefs.current[index] = ref)}
                            keyboardType="numeric"
                            maxLength={1}
                        />
                    ))}
                </View>
                <View style={{marginTop:40}}>
                    <TouchableOpacity style={styles.ContinueBtn} onPress={()=>{
                        handlePass();
                    }}>
                        <Text style={{fontSize:18, fontWeight:'600',color:"#fff"}}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default Passcode;

const styles = StyleSheet.create({
    SafeAreaViewContainer: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        width:'100%',
        // paddingHorizontal:15
    },
    passcodeHead: {},
    passcodeHeading: {
        fontSize: 25,
        fontWeight: "500",
        color: "#131415",
        textAlign: "center",
        marginBottom: 10,
    },
    passcodesub: {
        textAlign: "center",
        color: "#607274",
    },
    TextInputs: {
        width: 60,
        height:60,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: "#38ACE9",
        flexDirection: "row",
        paddingHorizontal: 20,
        fontSize: 30,
        backgroundColor: "#F3F0CA", 
        fontFamily: "SF Pro Display",
        textAlign: "center",
        fontWeight:'700',
        color:"#000"
    },
    ContinueBtn:{
        backgroundColor: "#38ACE9",
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "#B4D4FF",
        width:'100%',
        height:45,
        alignItems:'center',
        justifyContent:'center'
    }
});
