import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Platform,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import iconlogo from '../Images/logo.png';
import swapimg from '../Images/logo.png';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import global from '../../../global';
import Toast from 'react-native-simple-toast';
import {apiCall} from '../utils/ApiComponent';
import CustomModal from '../components/CustomModal';

const BuyToken = ({navigation, route}) => {
  const {PresaleData} = route.params || {};
  const wallet_Balance = useSelector(state => state.CreateToken.wallet_Blanace);
  const WalletAddress = useSelector(state => state.auth.UserDetails.address);
  const AuthToken = useSelector(state => state.auth.authToken);
  const {contractAddress, symbol, tokenImage, tokenAddress, rate} = PresaleData;
  // console.log( rate,tokenImage,`${global.imageGlobalPath}${tokenImage}`, 'contractAddress===');
  const [value, setValue] = useState('');
  const [tokenBalanceFromAPi, setTokenBalaceFromApi] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible1, setIsVisible1] = useState(false);
  const [errorMessage, setErrrorMessage] = useState('');
  const [type,setType] = useState('')
  let iconImage;
  if (Platform.OS === 'android') {
    iconImage = 'arrow-back-outline';
  } else {
    iconImage = 'chevron-back';
  }
  console.log(value, contractAddress, 'aksaksks');

  const handleBuyToken = async () => {
    setIsVisible(true);
    const header = {
      'content-Type': 'application/json',
      'x-access-token': AuthToken,
    };
    const subUri = '/lounchpaid/preasale/buyTokens';
    const method = 'post';
    const data = {
      preasaleContract: contractAddress,
      amount: value,
    };
    try {
      const res = await apiCall(header, subUri, method, data);
      console.log(res.data, 'res ponse in claim token api');
      if (res.status == 200 || res.status == 201) {
        if (Platform.OS === 'ios') {
          Toast.show(res.data.message, Toast.SHORT);
        } else {
          ToastAndroid.show(
            res.data.message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        }
        setIsVisible(false);
        setValue('')
      } else {
        setIsVisible(false);
        Alert.alert('Error', res?.data?.error);
        console.log('try eror');
      }
    } catch (err) {
      if (err.data) {
        Alert.alert(err?.data?.response);
        console.log(err?.response);
        setIsVisible(false);
      } else {
        Alert.alert(err?.response?.data?.message);
        console.log(err?.message);
        setIsVisible(false);
      }
    }
  };
  const tokenBalance = async () => {
    setIsVisible(true);
    const header = {
      'content-Type': 'application/json',
      'x-access-token': AuthToken,
    };
    const subUri = '/account/tokenBalance';
    const method = 'post';
    const data = {
      address: WalletAddress,
      contractAddress: tokenAddress,
    };
    try {
      const res = await apiCall(header, subUri, method, data);
      console.log(res.data, 'response in tokenbalance api');
      if (res.status == 200 || res.status == 201) {
        setTokenBalaceFromApi(res.data.result.formatted);
        setIsVisible(false);
      } else {
        setIsVisible(false);
        Alert.alert('Error', res?.data?.error);
        console.log('try eror');
      }
    } catch (err) {
      if (err.data) {
        Alert.alert(err?.data?.response);
        console.log(err?.response);
        setIsVisible(false);
      } else {
        Alert.alert(err?.response?.data?.message);
        console.log(err?.message);
        setIsVisible(false);
      }
    }
  };

  useEffect(() => {
    tokenBalance();
    return () => {};
  }, []);

  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} backgroundColor="#38ACE9" />
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
      <ImageBackground
        source={require('../Images/backimage.png')}
        style={{padding: 15, height: '100%'}}>
        <View style={styles.Exchangecontainer}>
          <TouchableOpacity
            style={{marginRight: 25}}
            onPress={() => navigation.goBack()}>
            <Ionicons name={iconImage} size={30} color="#000" />
          </TouchableOpacity>
          <Text style={styles.ExchangeText}>Buy Token</Text>
        </View>
        <Text style={[styles.Exchangedisc, {fontSize: 15, fontWeight: '500'}]}>
          It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged.
        </Text>
        <View style={styles.exchansenRow}>
          <View style={styles.FromRow}>
            <View style={styles.displayflex}>
              <Text style={styles.textfron}>From</Text>
              <Text style={styles.textfron}>
                {`Bal: ${String(wallet_Balance / 10 ** 18).slice(0, 8)} ${
                  global.currecy
                }`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <View style={{width: '50%'}}>
                <TextInput
                  placeholder="0.10"
                  placeholderTextColor="#000"
                  value={value}
                  onChangeText={text => setValue(text)}
                  keyboardType='decimal-pad'
                  style={[
                    styles.input,
                    {height: Platform.OS === 'android' ? null : 45},
                  ]}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  justifyContent: 'flex-start',
                }}>
                <View>
                  <Pressable style={styles.maxbtn}>
                    <Text style={{fontWeight: '500', color: '#000'}}>MAX</Text>
                  </Pressable>
                </View>
                <View
                  style={[
                    styles.maxbtn,
                    {flexDirection: 'row', alignItems: 'center', gap: 2},
                  ]}>
                  <Image
                    source={iconlogo}
                    style={{width: 25, height: 25, resizeMode: 'contain'}}
                  />
                  <Text style={{fontWeight: '500', color: '#000'}}>DO</Text>
                </View>
              </View>
            </View>
          </View>
          <Text
            style={{
              color: 'red',
              fontWeight: '500',
              fontSize: 14,
              paddingLeft: 5,
            }}>
            {wallet_Balance / 10 ** 18 < value
              ? 'Amount should be less then the Available balance'
              : null}
          </Text>
          <View style={styles.swapiconrow}>
            <TouchableOpacity
              style={{alignItems: 'center'}}
              onPress={() => console.log('pressed')}>
              <MaterialIcons name="swap-vert" size={40} color="#38ACE9" />
            </TouchableOpacity>
          </View>
          <View style={styles.FromRow}>
            <View style={styles.displayflex}>
              <Text style={styles.textfron}>To</Text>
              <Text style={styles.textfron}>
                Bal:{`${tokenBalanceFromAPi} ${String(symbol).toUpperCase()}`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  width: '70%',
                  backgroundColor: '#fff',
                  height:45,
                  borderRadius: 12,
                  justifyContent: 'center',
                  paddingHorizontal: 15,
                }}>
                {/* <TextInput
                  placeholder="0.10"
                  placeholderTextColor="#000"
                  style={[
                    styles.input,
                    {height: Platform.OS === 'android' ? null : 45},
                  ]}
                /> */}
                <Text style={{color:"#000"}}>{value ? `${value * rate}` : '0'}</Text>
              </View>
              <View>
                <View
                  style={[
                    styles.maxbtn,
                    {flexDirection: 'row', alignItems: 'center', gap: 2},
                  ]}>
                  <Image
                    source={
                      tokenImage == null || undefined
                        ? iconlogo
                        : {uri: `${global.imageGlobalPath}${tokenImage}`}
                    }
                    style={{
                      width: 25,
                      height: 25,
                      resizeMode: 'contain',
                      borderRadius: 50,
                      paddingRight: 2,
                    }}
                  />
                  <Text style={{fontWeight: '500', color: '#000'}}>
                    {symbol}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.ExchangePresRow}>
            <Pressable
              style={styles.ExchangeButton}
              onPress={() => {
                if (value.length > 0) {
                  {
                    handleBuyToken();
                  }
                }else{
                 setType('error')
                 setErrrorMessage('Please enter buy amount')
                 setIsVisible1(true)
                }
              }}>
              <Text style={[styles.textExchangeButton, {fontWeight: '500'}]}>
                Buy Token
              </Text>
            </Pressable>
          </View>
          <CustomModal
            MainTitle={
             errorMessage
            }
            isVisible1={isVisible1}
            setIsVisible1={setIsVisible1}
            OkButtonPressed={()=>setIsVisible1(!isVisible1)}
            type={type}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default BuyToken;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  Exchangecontainer: {
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ExchangeText: {
    color: '#000',
    fontSize: 25,
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
    right: 35,
  },
  Exchangedisc: {
    color: '#000',
    paddingVertical: 11,
  },
  exchansenRow: {
    padding: 11,
    borderRadius: 12,
  },
  FromRow: {
    backgroundColor: '#38ACE9',
    padding: 11,
    borderRadius: 12,
  },
  displayflex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 11,
  },
  textfron: {
    color: '#fff',
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 15,
    fontWeight: '500',
    backgroundColor: '#fff',
    width: '100%',
    color:"#000"
  },
  maxbtn: {
    backgroundColor: '#fff',
    paddingVertical: 13,
    paddingHorizontal: 11,
    borderRadius: 5,
    height: 45,
  },
  swapiconrow: {
    paddingVertical: 20,
  },
  iconSwaps: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
  },
  ExchangePresRow: {
    paddingTop: 15,
    paddingBottom: 11,
  },
  ExchangeButton: {
    padding: 13,
    backgroundColor: '#38ACE9',
    borderRadius: 100,
  },
  textExchangeButton: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
  },
  modalView: {
    backgroundColor: '#3c40434d',
    // padding: 35,
    alignItems: 'center',
    shadowOffset:
      Platform.OS === 'android'
        ? {
            width: 0,
            height: 2,
          }
        : null,
    shadowOpacity: Platform.OS === 'android' ? 0.25 : null,
    shadowRadius: Platform.OS === 'android' ? 4 : null,
    elevation: Platform.OS === 'android' ? 5 : null,
    // elevation: 5,
    width: '115%',
    flex: 1,
    right: 25,
  },
});
