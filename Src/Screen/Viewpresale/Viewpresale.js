import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  ToastAndroid,
  ImageBackground,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {apiCall} from '../utils/ApiComponent';
import Toast from 'react-native-simple-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomModal from '../components/CustomModal';
const Viewpresale = ({navigation, route}) => {
  const {livePresale} = route.params || {};
  const {
    contractAddress,
    endTime,
    startTime,
    tokenAddress,
    tokenImage,
    userAddress,
    name,
    symbol,
    liquidityPercent,
    
  } = livePresale;
  console.log(livePresale, 'livesdfsdfsdfsd');

  const startime = new Date(JSON.parse(startTime*1000))
  const day = String(startime.getUTCDate()).padStart(2,0)
  const month =  String(startime.getUTCMonth() + 1).padStart(2,0)
  const year =  String(startime.getUTCFullYear()).padStart(2,0)
  const Hour =  String(startime.getUTCHours()).padStart(2,0)
  const minute =  String(startime.getUTCMinutes()).padStart(2,0)
  const endtime = new Date(JSON.parse(endTime*1000))
  const Endday = String(endtime.getUTCDate()).padStart(2,0)
  const Endmonth =  String(endtime.getUTCMonth() + 1).padStart(2,0)
  const ENdyear =  String(endtime.getUTCFullYear()).padStart(2,0)
  const EndHour =  String(startime.getUTCHours()).padStart(2,0)
  const Endminute =  String(startime.getUTCMinutes()).padStart(2,0)
  const [isVisible, setIsVisible] = useState(false);
  const AuthToken = useSelector(state => state.auth.authToken);
  const [isVisible1, setIsVisible1] = useState(false);
  const [errorMessage, setErrrorMessage] = useState('');
  const [type,setType] = useState('')
  const handleClaimToken = async () => {
    setIsVisible(true);
    const header = {
      'content-Type': 'application/json',
      'x-access-token': AuthToken,
    };
    const subUri = '/lounchpaid/preasale/claimTokens';
    const method = 'post';
    const data = {
      preasaleContract: contractAddress,
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
      } else {
        setIsVisible(false);
        Alert.alert('Error', res?.data?.error);
        console.log('try eror');
      }
    } catch (err) {
      if (err.data) {
        // Alert.alert(err?.data?.response);
        console.log(err?.response);
        setIsVisible(false);
      } else {
        setType('error')
        setErrrorMessage(err?.response?.data?.message)
        setIsVisible1(true)
        // Alert.alert(err?.response?.data?.message);
        console.log(err?.message);
        setIsVisible(false);
      }
    }
  };

  let iconImage;
  if (Platform.OS === 'android') {
    iconImage = 'arrow-back-outline';
  } else {
    iconImage = 'chevron-back';
  }

  return (
    <ImageBackground
      source={require('../Images/backimage.png')}
      style={{flex: 1}}>
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
      <ScrollView style={{flex: 1, paddingHorizontal: 15}}>
          <View
            style={{
              borderRadius: 5,
              marginTop: 15,
              width:"100%"
            }}>
           <View style={{flexDirection:"row",alignItems:"center",}}>
           <TouchableOpacity
              style={{marginRight: 25}}
              onPress={() => navigation.goBack()}>
              <Ionicons name={iconImage} size={30} color="#000" />
            </TouchableOpacity>
           <Image
              source={{
                uri: `https://apic.myreview.website:8444/${tokenImage}`,
              }}
              style={{
                height: 50,
                // width: 20,
                resizeMode: 'contain',
                borderRadius: 50,
                // marginLeft:50
              }}
            />
            {/* <Image source={require('../Images/ETHss.png')} /> */}
            <Text
              style={{
                color: '#000',
                fontSize: 20,
                // paddingTop: 10,
                fontWeight: '700',
                // paddingBottom: 5,
                // marginLeft:10
              }}>
              {' '}
              {`${symbol}/Docoin`}
            </Text>
           </View>

          <View
            style={{
              paddingHorizontal: 10,
              alignSelf: 'center',
              marginTop: 15,
              marginBottom: 20,
              borderRadius: 15,
              backgroundColor: '#F2F2F2',
              borderColor: '#C2C2C2',
              borderWidth: 1.5,
              width: '100%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                display: 'flex',
                width: '100%',
                alignSelf: 'center',
                borderRadius: 5,
                justifyContent: 'space-between',
                paddingTop: 8,
                paddingBottom: 8,
              }}>
              <View>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 17,
                    paddingTop: 10,
                    fontWeight: '700',
                    paddingBottom: 5,
                  }}>
                  Presale Address
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: '#4F4F4F',
                    fontSize: 15,
                    paddingTop: 10,
                    fontWeight: '400',
                    paddingBottom: 5,
                  }}>
                    
                  {`${String(contractAddress).slice(0,20)}...`}
                </Text>
              </View>
            </View>
            <Text style={{borderWidth: 0.5, borderColor: '#CECECE', height: 1}}>
              .
            </Text>
            {/* <View
              style={{
                flexDirection: 'row',
                display: 'flex',
                width: '100%',
                alignSelf: 'center',
                borderRadius: 5,
                justifyContent: 'space-between',
                paddingTop: 8,
                paddingBottom: 8,
              }}>
              <View>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 17,
                    paddingTop: 10,
                    fontWeight: '700',
                    paddingBottom: 5,
                  }}>
                  Token Name
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: '#4F4F4F',
                    fontSize: 15,
                    paddingTop: 10,
                    fontWeight: '400',
                    paddingBottom: 5,
                  }}>
                  X.VPN
                </Text>
              </View>
            </View>
            <Text style={{borderWidth: 0.5, borderColor: '#CECECE', height: 1}}>
              .
            </Text> */}
            {/* <View
              style={{
                flexDirection: 'row',
                display: 'flex',
                width: '100%',
                alignSelf: 'center',
                borderRadius: 5,
                justifyContent: 'space-between',
                paddingTop: 8,
                paddingBottom: 8,
              }}>
              <View>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 17,
                    paddingTop: 10,
                    fontWeight: '700',
                    paddingBottom: 5,
                  }}>
                  Token Decimals
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: '#4F4F4F',
                    fontSize: 15,
                    paddingTop: 10,
                    fontWeight: '400',
                    paddingBottom: 5,
                  }}>
                  X.VPN
                </Text>
              </View>
            </View>
            <Text style={{borderWidth: 0.5, borderColor: '#CECECE', height: 1}}>
              .
            </Text> */}
            <View
              style={{
                flexDirection: 'row',
                display: 'flex',
                width: '100%',
                alignSelf: 'center',
                borderRadius: 5,
                justifyContent: 'space-between',
                paddingTop: 8,
                paddingBottom: 8,
              }}>
              <View>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 17,
                    paddingTop: 10,
                    fontWeight: '700',
                    paddingBottom: 5,
                  }}>
                  Token Address
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: '#4F4F4F',
                    fontSize: 15,
                    paddingTop: 10,
                    fontWeight: '400',
                    paddingBottom: 5,
                  }}>
                  {`${String(tokenAddress).slice(0,20)}...`}
                </Text>
              </View>
            </View>
            {/* <Text style={{borderWidth: 0.5, borderColor: '#CECECE', height: 1}}>
              .
            </Text> */}
            {/* <View
              style={{
                flexDirection: 'row',
                display: 'flex',
                width: '100%',
                alignSelf: 'center',
                borderRadius: 5,
                justifyContent: 'space-between',
                paddingTop: 8,
                paddingBottom: 8,
              }}>
              <View>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 17,
                    paddingTop: 10,
                    fontWeight: '700',
                    paddingBottom: 5,
                  }}>
                  Total Supply
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: '#4F4F4F',
                    fontSize: 15,
                    paddingTop: 10,
                    fontWeight: '400',
                    paddingBottom: 5,
                  }}>
                  X.VPN
                </Text>
              </View>
            </View>
            <Text style={{borderWidth: 0.5, borderColor: '#CECECE', height: 1}}>
              .
            </Text> */}
            {/* <View
              style={{
                flexDirection: 'row',
                display: 'flex',
                width: '100%',
                alignSelf: 'center',
                borderRadius: 5,
                justifyContent: 'space-between',
                paddingTop: 8,
                paddingBottom: 8,
              }}>
              <View>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 17,
                    paddingTop: 10,
                    fontWeight: '700',
                    paddingBottom: 5,
                  }}>
                  Tokens Presale
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: '#4F4F4F',
                    fontSize: 15,
                    paddingTop: 10,
                    fontWeight: '400',
                    paddingBottom: 5,
                  }}>
                  X.VPN
                </Text>
              </View>
            </View> */}
            <Text style={{borderWidth: 0.5, borderColor: '#CECECE', height: 1}}>
              .
            </Text>
            {/* <View
              style={{
                flexDirection: 'row',
                display: 'flex',
                width: '100%',
                alignSelf: 'center',
                borderRadius: 5,
                justifyContent: 'space-between',
                paddingTop: 8,
                paddingBottom: 8,
              }}>
              <View>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 17,
                    paddingTop: 10,
                    fontWeight: '700',
                    paddingBottom: 5,
                  }}>
                  Tokens Liquidity
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: '#4F4F4F',
                    fontSize: 15,
                    paddingTop: 10,
                    fontWeight: '400',
                    paddingBottom: 5,
                  }}>
                  X.VPN
                </Text>
              </View>
            </View> */}
            <Text style={{borderWidth: 0.5, borderColor: '#CECECE', height: 1}}>
              .
            </Text>
            <View
              style={{
                flexDirection: 'row',
                display: 'flex',
                width: '100%',
                alignSelf: 'center',
                borderRadius: 5,
                justifyContent: 'space-between',
                paddingTop: 8,
                paddingBottom: 8,
              }}>
              <View>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 17,
                    paddingTop: 10,
                    fontWeight: '700',
                    paddingBottom: 5,
                  }}>
                  Presale Start Time
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: '#4F4F4F',
                    fontSize: 15,
                    paddingTop: 10,
                    fontWeight: '400',
                    paddingBottom: 5,
                  }}>
                  {/* 2023.11.07 04:00 (UTC) */}
                  {`${year}.${month}.${day} ${Hour}:${minute} UTC` }
                </Text>
              </View>
            </View>
            <Text style={{borderWidth: 0.5, borderColor: '#CECECE', height: 1}}>
              .
            </Text>
            <View
              style={{
                flexDirection: 'row',
                display: 'flex',
                width: '100%',
                alignSelf: 'center',
                borderRadius: 5,
                justifyContent: 'space-between',
                paddingTop: 8,
                paddingBottom: 8,
              }}>
              <View>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 17,
                    paddingTop: 10,
                    fontWeight: '700',
                    paddingBottom: 5,
                  }}>
                  Presale End Time
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: '#4F4F4F',
                    fontSize: 15,
                    paddingTop: 10,
                    fontWeight: '400',
                    paddingBottom: 5,
                  }}>
                  {/* 2023.11.07 05:00 (UTC) */}
                  {`${ENdyear}.${Endmonth}.${Endday} ${EndHour}:${Endminute} UTC` }
                </Text>
              </View>
            </View>
            <Text style={{borderWidth: 0.5, borderColor: '#CECECE', height: 1}}>
              .
            </Text>
            <View
              style={{
                flexDirection: 'row',
                display: 'flex',
                width: '100%',
                alignSelf: 'center',
                borderRadius: 5,
                justifyContent: 'space-between',
                paddingTop: 8,
                paddingBottom: 8,
              }}>
              <View>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 17,
                    paddingTop: 10,
                    fontWeight: '700',
                    paddingBottom: 5,
                  }}>
                  Liquidity Percent
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: '#4F4F4F',
                    fontSize: 15,
                    paddingTop: 10,
                    fontWeight: '400',
                    paddingBottom: 5,
                  }}>
                  {' '}
                  {`${liquidityPercent}%`}
                </Text>
              </View>
            </View>
            <Text style={{borderWidth: 0.5, borderColor: '#CECECE', height: 1}}>
              .
            </Text>
            {/* <View
              style={{
                flexDirection: 'row',
                display: 'flex',
                width: '100%',
                alignSelf: 'center',
                borderRadius: 5,
                justifyContent: 'space-between',
                paddingTop: 8,
                paddingBottom: 8,
              }}>
              <View>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 17,
                    paddingTop: 10,
                    fontWeight: '700',
                    paddingBottom: 5,
                  }}>
                  Liquidity Time
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: '#4F4F4F',
                    fontSize: 15,
                    paddingTop: 10,
                    fontWeight: '400',
                    paddingBottom: 5,
                  }}>
                  2023.11.07 05:00 (UTC)
                </Text>
              </View>
            </View> */}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
              paddingHorizontal: 5,
            }}>
            <TouchableOpacity
              onPress={() => handleClaimToken()}
              style={styles.claimTokenButtonContainer}>
              <Text style={styles.ButtonTextStyle}>Claim Token</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('BuyToken',{PresaleData:livePresale})}
              style={styles.claimTokenButtonContainer}>
              <Text style={styles.ButtonTextStyle}>Buy Token</Text>
            </TouchableOpacity>
          </View>
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
      </ScrollView>
    </ImageBackground>
  );
};

export default Viewpresale;
const styles = StyleSheet.create({
  claimTokenButtonContainer: {
    backgroundColor: '#38ACE9',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
    width: '100%',
  },
  ButtonTextStyle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
});
