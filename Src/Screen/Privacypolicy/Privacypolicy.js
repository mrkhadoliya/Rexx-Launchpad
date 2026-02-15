import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {apiCall} from '../utils/ApiComponent';
import RenderHTML from 'react-native-render-html';
import { StatusBar } from 'react-native';
const Privacypolicy = () => {
  const [visible, setIsVisible] = useState(false);
  const [data, setData] = useState(null);
  const getAboutUsData = async () => {
    setIsVisible(true);
    const header = {
      'content-Type': 'application/json',
    };
    const method = 'get';
    const subUri = '/news/privacy-policy';
    const body = {};
    try {
      let response = await apiCall(header, subUri, method, body);
      // console.log(response.data, ' rep in calling');

      if (response.status == 200 || response.status == 201) {
        let array = response?.data?.result[0].description.data;
        console.log(response.data,'resposne datadafadfadsfasf');
        const string = String.fromCharCode(...array);
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
    getAboutUsData();
  }, []);

  const width = Dimensions.get('screen').width;

  return (
    <SafeAreaView style={{height: '100%', backgroundColor:'#141516'}}>
      <StatusBar backgroundColor="#212121" barStyle='light-content' />
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
      <View 
        style={{flex: 1}}>
        <ScrollView>
          <View style={{height: '100%', flex: 1, paddingHorizontal: 10}}>
            {!visible && data ? (
              <>
                <RenderHTML
                  baseStyle={{
                    fontSize: 14,
                    color: '#c1c1c1',
                    letterSpacing: 0.5,
                    lineHeight: 20,
                    textAlign:"left",
                    fontWeight:"400",
                    textAlign:'justify'
                  }}
                  contentWidth={width}
                  source={{html: data}}
                />
              </>
            ) : null}

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Privacypolicy;
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
});
