import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Alert,
  ToastAndroid,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ImageBackground,
  SafeAreaView
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import {apiCall} from './utils/ApiComponent';
import { autoUpdateApp } from './Redux-Toolkit/Slices/AuthSlices/AuthSlices';
import CustomModal from './components/CustomModal';
import Toast from 'react-native-simple-toast';
const DefualtWallet = ({navigation}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [walletList, setWalletList] = useState([]);
  const [isVisible1, setIsVisible1] = useState(false);
  const [errorMessage, setErrrorMessage] = useState('');
  const [type,setType] = useState('')
  const dispatch = useDispatch();
  const selectedWallet = useSelector(state => state.CreateToken);
  console.log(selectedWallet,'lkikiki');
  // const userid =useSelector((state)=>state.auth.user);
  const token = useSelector(state => state.auth.authToken);
  const Userid = useSelector(state => state.auth.userData[0].userId);
  const DefaultWalletAddress = useSelector(state => state.auth.userData[0].selectedAccount);
  const AutoUpatedStatus = useSelector(state => state.auth.autoUpdate);
  console.log(AutoUpatedStatus,'defualt wallet address ++++++++++')
  console.log(Userid);
  const walletHome = async() => {
    setIsVisible(true)
    const header = {
      'content-Type': 'application/json',
      // 'x-access-token': token
    };
    const body = {userid: Userid};
    const method = 'post';
    const subUri = '/user/all_wallet_balance';
    try {
      let response = await apiCall(header, subUri, method, body);
      // console.log(response, " rep in calling");
      console.log(response.data, ' data in calling');

      if (response.status == 200 || response.status == 201) {
        // dispatch(updateWalletDetails(response.data))
        let result = response?.data?.wallet_details;
        setWalletList(result);
       
        setIsVisible(false);
      } else {
        Alert.alert(response);
        console.log(response, 1);
        setIsVisible(false);
      }
    } catch (err) {
      if (err.data) {
        setType('error')
        setErrrorMessage(err.data.response)
        setIsVisible1(true)
        // Alert.alert(err.data.response);
        // console.log(err.response, 2);
        setIsVisible(false);
      } else {
        setType('error')
        setErrrorMessage(err.message)
        setIsVisible1(true)
        // Alert.alert(err.message);
        // console.log(err.message, 3);
        setIsVisible(false);
      }
    }
  };

  useEffect(() => {
    walletHome(); 
    return () =>{}
  }, []);

  const selectDefaultWallet = async (address) => {
    setIsVisible(true);
    const header = {
      'content-Type': 'application/json',
      'x-access-token': token,
    };
    const body = {userid:Userid,address:address};
    const method = 'post';
    const subUri = '/user/default_Wallet';
    try {
      let response = await apiCall(header, subUri, method, body);
      console.log(response, ' rep in calling');
      // console.log(response.data, " data in calling");

      if (response.status == 200 || response.status == 201) {
        if (Platform.OS === 'ios') {
            Toast.show(response.data.message, Toast.SHORT);
          } else {
            ToastAndroid.show(
                response.data.message,
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          }
          navigation.pop()
          dispatch(autoUpdateApp(!AutoUpatedStatus))
        setIsVisible(false);
      } else {
        Alert.alert(response);
        console.log(response, 1);
        setIsVisible(false);
      }
    } catch (err) {
      if (err.data) {
        setType('error')
        setErrrorMessage(err.data.response)
        setIsVisible1(true)
        // Alert.alert(err.data.response);
        // console.log(err.response, 2);
        setIsVisible(false);
      } else {
        setType('error')
        setErrrorMessage(err.message)
        setIsVisible1(true)
        // Alert.alert(err.message);
        // console.log(err.message, 3);
        setIsVisible(false);
      }
    }
  };
  return (
    <SafeAreaView style={{height: '100%', backgroundColor:'#141516', flex:1}}>
          <StatusBar backgroundColor="#212121" barStyle="light-content" />
         <View>
          <Modal animationType="fade" visible={isVisible} transparent={true}>
            <View style={[styles.Loader]}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ActivityIndicator size="large" color="#9004fd" />
              </View>
            </View>
          </Modal>
        </View>
      <View>
        <View style={{paddingHorizontal: 15}}>
          <View>
            <Modal animationType="fade" visible={isVisible} transparent={true}>
              <View style={[styles.modalView]}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator size="large" color="#9004fd" />
                </View>
              </View>
            </Modal>
          </View>
          <FlatList
            data={walletList}
            renderItem={item => {
              return (
                <TouchableOpacity
                  style={styles.ListContainerSS}
                  onPress={() => {
                    item.item.wallet_address != DefaultWalletAddress
                      ? selectDefaultWallet(item.item.wallet_address)
                      : null;
                  }}>
                  <View style={[styles.ListContainer]}>
                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: '600',
                          marginBottom: 8,
                          color: '#fff',
                        }}>
                        {item.item.account_name}
                      </Text>
                    </View>
                    <View>
                      {item.item.wallet_address == DefaultWalletAddress ? (
                        <Feather
                          name="check-square"
                          size={20}
                          color="#9004fd"
                        />
                      ) : null}
                    </View>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#ababab',
                        lineHeight: 20,
                        fontWeight: '400',
                        letterSpacing: 0.2,
                      }}>
                      {item.item.wallet_address}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <CustomModal
            MainTitle={errorMessage}
            isVisible1={isVisible1}
            setIsVisible1={setIsVisible1}
            type={type}
            OkButtonPressed={()=>{setIsVisible1(!isVisible1)}}
          />
      </View>
    </SafeAreaView>
  );
};

export default DefualtWallet;

const styles = StyleSheet.create({
  ListContainerSS: {
    backgroundColor: "#1b1b1b",
    borderColor:'#262626',
    borderWidth: 1,
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
  },
  ListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  Loader: {
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
