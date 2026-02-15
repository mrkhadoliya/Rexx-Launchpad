import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Alert,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiCall} from '../utils/ApiComponent';

const Notification = props => {
  let token = useSelector(state => state.auth.authToken);
  console.log(token, 'notification screen');
  const dispatch = useDispatch();
  const {navigation} = props;
  const [notifHistory, setNotifHistory] = useState([null]);
  const [TokenAsync, setTokenAsync] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const TokenFromAsync = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      setTokenAsync(token);
    } catch (error) {
      console.log(error, 'error in fetching token');
    }
  };
  useEffect(() => {
    TokenFromAsync();
  }, []);

  const notifHis = async () => {
    setIsVisible(true);
    const header = {
      'content-Type': 'application/json',
      'x-access-token': token ? token : TokenAsync,
    };
    const method = 'get';
    const subUri = '/user/getUserNotifitions/1';
    const body = {};
    try {
      let response = await apiCall(header, subUri, method, body);
      console.log(response.data, ' rep in calling');
      console.log(response.data, ' data in calling');

      if (response.status == 200 || response.status == 201) {
        setNotifHistory(response?.data?.data);
        seenNotif();
        //   dispatch(setNotifCount(0))
        setIsVisible(false);
      } else {
        Alert.alert(response);
        console.log(response, 1);
        setIsVisible(false);
      }
    } catch (err) {
      if (err.data) {
        Alert.alert(err.data.response);
        console.log(err.response, 2);
        setIsVisible(false);
      } else {
        Alert.alert(err.message);
        console.log(err.message, 3);
        setIsVisible(false);
      }
    }
  };
  const seenNotif = async () => {
    const header = {
      'content-Type': 'application/json',
      'x-access-token': token ? token : TokenAsync,
    };
    const body = {};
    const method = 'post';
    const subUri = '/user/seenNotification/1';
    try {
      let response = await apiCall(header, subUri, method, body);
      console.log(response.data, ' rep in calling====');
      console.log(response.data, ' data in calling');

      if (response.status == 200 || response.status == 201) {
        // setNotifHistory(response.data.data)
        // setIsVisible(false);
      } else {
        // Alert.alert(response);
        console.log(response, 1);
        // setIsVisible(false);
      }
    } catch (err) {
      if (err.data) {
        // Alert.alert(err.data.response);
        console.log(err.response, 2);
        // setIsVisible(false);
      } else {
        // Alert.alert(err.message);
        console.log(err.message, 3);
        // setIsVisible(false);
      }
    }
  };
  useEffect(() => {
    notifHis();
    return () => {};
  }, []);

  return (
    <SafeAreaView style={styles.totalPricesContainers}>
      <StatusBar barStyle="light-content" backgroundColor="#212121" />

      {/* <View style={{ paddingVertical: 10 }}>
              <View style={{ position: 'relative' }}>
                <TextInput placeholder="Search...." style={styles.input} />
                <View style={styles.searchicon}>
                  <Ionicons name="search" size={22} />
                </View>
              </View>
            </View> */}
      <View 
        style={{flex: 1}}>
        {isVisible === true ? (
          <>
            <View>
              <Modal
                animationType="fade"
                visible={isVisible}
                transparent={true}>
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
          </>
        ) : notifHistory[0] == undefined ||
          notifHistory == 'No notification' ? (
          <Text style={{alignSelf: 'center'}}>No Notifications</Text>
        ) : (
          <FlatList
            data={notifHistory}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              console.log(item, 'itemmememem');
              return (
                //   <NotificationHistoryList {...props} marketCoin={item} />
                <>
                  <View style={styles.ListContainer}>
                    <View>
                      <Text
                        style={{
                          color: '#555843',
                          marginBottom: 5,
                          fontWeight: '500',
                          lineHeight: 19,
                          letterSpacing: 0.2,
                        }}>
                        {item.action}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: '#39A7FF',
                          textAlign: 'right',
                          fontSize: 11,
                          fontWeight: '500',
                        }}>
                        {item.time}
                      </Text>
                    </View>
                  </View>
                </>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  ScrollContainerHome: {
    //   height: '100%',
    //   paddingHorizontal: 2,
  },
  totalPricesContainers: {
    padding: 10,
    flex: 1,
      backgroundColor: '#141516',
  },
  input: {
    backgroundColor: "#1b1b1b",
    borderColor:'#262626',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 18,
  },
  searchicon: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ListContainer: {
    // alignItems:'center',
    // justifyContent:'space-between',
    // flexDirection:'row',
    paddingVertical: 5,
    backgroundColor: '#FFFBF5',
    marginBottom: 5,
    borderRadius: 5,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#FFF2D8',
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
