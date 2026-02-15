import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  ImageBackground,
  Modal,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Linking,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {apiCall} from '../utils/ApiComponent';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
const Support = () => {
  const [visible, setIsVisible] = useState(false);
  const [data, setData] = useState();
  const [detail, setDetails] = useState(null);
  const getContactUsData = async () => {
    setIsVisible(true);
    const header = {
      'content-Type': 'application/json',
    };
    const method = 'get';
    const subUri = '/news/contact-us';
    const body = {};
    try {
      let response = await apiCall(header, subUri, method, body);
      // console.log(response.data, ' rep in calling');

      if (response.status == 200 || response.status == 201) {
        let array = response?.data?.result[0].description.data;
        // console.log(response.data.result[0].contact_email,'oooooooo')
        const string = String.fromCharCode(...array);
        // console.log(string, 'string');
        // dispatch(setAboutUsData(string))
        setDetails(response.data.result);
        setData(string);
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
    getContactUsData();
  }, []);

  return (
    <SafeAreaView style={{backgroundColor:'#141516', paddingHorizontal: 10, flex:1}}>
    <StatusBar barStyle="light-content" backgroundColor="#212121" />
      <View>
        <Modal animationType="fade" visible={visible} transparent={true}>
          <View style={[styles.modalView]}>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size="large" color="#9004fd" />
            </View>
          </View>
        </Modal>
      </View>
      <View >
        <ScrollView>
          <View style={{marginTop: 15, marginHorizontal: 5}}>
            {!visible && data ? (
              <>
                <View>
                    <Text style={styles.dataStyle}>{data}</Text>
                </View>
                <View style={{marginVertical:15}}>
                    <TouchableOpacity
                      style={styles.companyDetailsConatiner}
                      onPress={() =>
                        Linking.openURL(`mailto:${detail[0]?.contact_email}`)
                      }>
                      <MaterialIcons name="email" size={25} color={'#9004fd'} />
                      <Text
                        style={[
                          styles.dataStyle,
                          {color: '#9004fd', fontWeight: '700', paddingLeft: 10},
                        ]}>
                        {detail[0]?.contact_email}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.companyDetailsConatiner}
                      onPress={() =>
                        Linking.openURL(`tel:${detail[0]?.contact_number}`)
                      }>
                      <Feather name="phone" size={25} color={'#9004fd'} />
                      <Text
                        style={[
                          styles.dataStyle,
                          {color: '#9004fd', fontWeight: '700', paddingLeft: 10},
                        ]}>
                        {detail[0]?.contact_number}
                      </Text>
                    </TouchableOpacity>
                </View>
                {/* <TouchableOpacity style={styles.ConatctButtonConatainer} onPress={()=>handleContactButtonPress()}>
              <Text style={styles.contactButtonTextStyle}>Contact Us</Text>
            </TouchableOpacity> */}
              </>
            ) : null}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Support;
const styles = StyleSheet.create({
  modalView: {
    backgroundColor: '#3c40434d',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    flex: 1,
  },
  dataStyle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#fff',
    letterSpacing: 0.5,
    lineHeight: 20,
    textAlign: 'justify',
  },
  ConatctButtonConatainer: {
    marginTop: 15,
    backgroundColor: '#38ACE9',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    borderRadius: 10,
  },
  contactButtonTextStyle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 1,
  },
  companyDetailsConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#9004fd26',
    borderWidth:1,
    borderColor:'#9004fd',
    height: 45,
    padding: 10,
    borderRadius: 10,
  },
});
