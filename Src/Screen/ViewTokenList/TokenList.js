import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ImageBackground,
  StatusBar,
  Alert,
  Modal,
  ActivityIndicator,
  FlatList,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiCall} from '../utils/ApiComponent';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
const {height, width} = Dimensions.get('screen');

const TokenList = props => {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState([]);
  const AuthToken = useSelector(state => state.auth.authToken);
  const UserData = useSelector(state => state.auth.userData);
  let userId = UserData[0]?.userId;
  const DataFetch = useCallback(async () => {
    setIsVisible(true);
    const header = {
      'content-Type': 'application/json',
      'x-access-token': AuthToken,
    };
    const body = {};
    const method = 'get';
    const subUri = '/user/wallet_homesonu';
    console.log(body, 'this');
    try {
      let response = await apiCall(header, subUri, method, body);
      // console.log(response, " rep in calling");
      console.log(response.data, ' data in calling');

      if (response.status == 200 || response.status == 201) {
        setIsVisible(false);
        let coinList = response?.data?.erc20;
        setData(coinList);
        // console.log(response.data, 'response from inner');
      } else {
        Alert.alert(response.status);
        console.log(response.status, 1);
        setIsVisible(false);
      }
    } catch (err) {
      if (err.data) {
        Alert.alert(err?.data?.response);
        console.log(err?.response, 2);
        setIsVisible(false);
      } else {
        Alert.alert(err?.message);
        console.log(err?.response, 'kkkk');
        setIsVisible(false);
      }
    }
  }, [AuthToken, userId]);

  useEffect(() => {
    DataFetch();
  }, [DataFetch]);

  let value = 'Loading';
  if (isVisible === true) {
    value = 'Loading';
  } else if (data.length === 0) {
    value = 'You have not Created any Token yet!';
  } else {
    value = '';
  }

  const handleDateItem = async (item, index) => {
    // console.log(item,index,'itemmmmm')
  };
  const copyToClipboard = async(tokenAddress) => {
    // console.log(tokenAddress,'hello i am address')
    try {
        await Clipboard.setString(tokenAddress);
        if (Platform.OS === 'ios') {
          Toast.show('Token address copied', Toast.SHORT);
        } else {
          ToastAndroid.show(
            'Token address copied',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        }
    } catch (error) {
      
    }
  };
  return (
    <SafeAreaView style={{height: '100%', flex: 1, backgroundColor:'#141516', padding:12}}>
      <StatusBar barStyle="light-content" backgroundColor="#212121" />
      <View>
        <Modal animationType="fade" visible={isVisible} transparent={true}>
          <View style={[styles.modalView]}>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size="large" color="#9004fd" />
            </View>
          </View>
        </Modal>
      </View>
       
        <View>
          {data.length > 0 ? (
            <>
              <FlatList
                nestedScrollEnabled
                data={data}
                renderItem={({item, index}) => {
                  console.log(item,'item')
                  var num = Number(item.value) / Number(`1e${item.decimals}`);
                  // console.log(typeof item.tokenImage,'itemmmmmmmmmmm')
                  return (
                    <View key={index}>
                      <TouchableOpacity
                        style={styles.BtnContainerTokenPrice}
                        activeOpacity={0.8}
                        onPress={() => handleDateItem(item, index)}>
                        <View style={[styles.flexDisplay, {paddingBottom: 15}]}>
                          <View style={styles.borderCoinIMage}>
                            <Image
                              source={
                                item.tokenImage === null
                                  ? require('../Images/logo.png')
                                  : {
                                      // uri: `https://apic.myreview.website/lounchpaid/public/${item.tokenImage}`,
                                      uri: `https://apic.myreview.website:8444/${item.tokenImage}`,
                                    }
                              }
                              style={styles.coinImage}
                            />
                          </View>
                          <View>
                            <Text style={styles.nameCoinText}>
                              {String(item.name).toUpperCase()}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 5,
                              }}>
                              <Text style={styles.ranking}>
                                {item.decimals}
                              </Text>
                              <Text style={styles.subCoinPoint}>
                                {item.symbol.toUpperCase()}
                              </Text>
                            </View>
                          </View>
                          <View style={{alignItems: 'flex-end', flex: 1}}>
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                              onPress={() => copyToClipboard(item.tokenAddress)}>
                              <Ionicons name="copy" size={22} color='#fff'/>
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap:5
                          }}>
                          <Text style={styles.currentPriceToken}>
                            <FontAwesome name="inr" size={17} color="#fff" />
                            {item.formatted}
                          </Text>
                          <Text style={{color: '#9004fd'}}>
                            Balance:
                            {/* {(
                              Number(item.formatted) /
                              Number(`1e${item.decimals}`)
                            ).toFixed(2)} */}
                            {item.value}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </>
          ) : null}

          <Text
            style={{
              textAlign: 'center',
              alignSelf: 'center',
              marginTop: 25,
              fontWeight: 'bold',
              color: '#fff',
            }}>
            {value}
          </Text>
        </View>
       
    </SafeAreaView>
  );
};

export default TokenList;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#BCC3C7',
    paddingLeft: 10,
    // backgroundColor: '#fff',
    borderRadius: 5,
    width: '100%',
    color: '#000',
    height: 40,
  },
  modalView: {
    margin: 20,
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
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
  },
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
  ScrollContainerCharts: {},
  BtnContainerTokenPrice: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: '100%',
    backgroundColor: '#212121',
    marginVertical: 5,
    borderRadius: 8,
  },
  flexDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  borderCoinIMage: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#68788E',
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinImage: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
    borderRadius: 100,
  },
  nameCoinText: {
    fontWeight: '700',
    color: '#fff',
    fontSize: 15,
    fontFamily: 'SF Pro Display',
    paddingBottom: 5,
  },
  ranking: {
    backgroundColor: '#B5C0D0',
    paddingHorizontal: 2,
    borderRadius: 5,
    color: '#9004fd',
    fontSize: 8, 
    paddingHorizontal:5
  },
  subCoinPoint: {
    color: '#9004fd',
    fontSize: 11,
  },
  currentPriceToken: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 14,
    textAlign: 'right',
  },

  prasentCoinPricDwon: {
    color: ' ',
    fontSize: 18,
  },
});
