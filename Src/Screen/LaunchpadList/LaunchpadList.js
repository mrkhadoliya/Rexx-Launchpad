import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {ProgressBar, MD3Colors} from 'react-native-paper';
import Upcoming from '../Upcomingtab/Upcoming';
import Completed from '../CompletedTab/Completed';
import {useDispatch, useSelector} from 'react-redux';
import {apiCall} from '../utils/ApiComponent';
import {PresaleList} from '../Redux-Toolkit/Slices/PresaleSlice/PresaleSlice';
import CustomModal from '../components/CustomModal';

const LaunchpadList = ({navigation}) => {
  const presaleUpdate = useSelector(state => state.presale.autoUpdate);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);
  const dispatch = useDispatch();
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [screeName, setScreenName] = useState('0');
  const [livePresaledata, setLivePresaledata] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState([]);

  const DataFetch = async () => {
    setIsVisible(true);

    const header = {
      'content-Type': 'application/json',
    };
    const body = {};
    const method = 'post';
    const subUri = '/lounchpaid/presaleContracts';
    console.log(body, 'this!!!!!!!!!!!!');
    try {
      let response = await apiCall(header, subUri, method, body);
      // console.log(response, " rep in calling");
      // console.log(response.data, ' data in calling');

      if (response.status == 200 || response.status == 201) {
        let data = response?.data?.result;
        dispatch(PresaleList(data));
        setData(data);
        setIsVisible(false);
      } else {
        Alert.alert('failed', response.status.message);
        console.log(response, 1);
        setIsVisible(false);
      }
    } catch (err) {
      if (err.data) {
        // Alert.alert(err?.data?.response.message);
        console.log(err?.response, 2);
        setIsVisible(false);
      } else {
        // Alert.alert(err?.message);
        console.log(err);
        setIsVisible(false);
        console.log('iamcatch',err.response.data.message)
      }
    }
  };

  useEffect(() => {
    DataFetch();
  }, [presaleUpdate]);

  let valueLoading = 'Loading';
  if (isVisible === true) {
    valueLoading = 'Loading';
  } else if (data.length === 0) {
    valueLoading = 'You have not Created any Token yet!';
  } else {
    valueLoading = '';
  }
  const filterPresaleItem = data?.filter(item => item.status === 'live');

  const renderItem = ({item, index}) => {
    const time = new Date(JSON.parse(item?.data?.endTime * 1000));
    const day = String(time.getDate()).padStart(2, 0);
    const month = String(time.getMonth() + 1).padStart(2, 0);
    const year = String(time.getUTCFullYear()).padStart(2, 0);
    console.log(item, '0p0p0p');
    return (
      <View key={index}>
        <View
          style={{
            paddingHorizontal: 10,
            alignSelf: 'center',
            padding: 5,
            marginTop: 15,
            marginBottom: 20,
            borderRadius: 15,
            backgroundColor: '#212121',
            borderColor: '#424242',
            borderWidth: 1.5,
            width: '96%',
            margin: 'auto',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              display: 'flex',
              width: '96%',
              alignSelf: 'center',
              borderRadius: 5,
            }}>
            <View>
              <View
                style={{
                  height: 60,
                  width: 60,
                  borderWidth: 1,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: '#3887BE',
                }}>
                <Image
                  source={{
                    uri: `https://apic.myreview.website:8444/${item.data.tokenImage}`,
                  }}
                  style={{
                    height: 50,
                    width: 50,
                    resizeMode: 'contain',
                    borderRadius: 50,
                  }}
                />
              </View>
              <Image
                source={require('../Images/logo.png')}
                style={{
                  height: 30,
                  width: 30,
                  resizeMode: 'contain',
                  position: 'absolute',
                  bottom: 5,
                  right: -15,
                }}
              />
            </View>

            <View style={{}}>
              <TouchableOpacity
                onPress={() => {}}
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                  borderRadius: 5,
                  textAlign: 'center',
                  width: '100%',
                  backgroundColor: '#6cc81b',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: '800',
                  }}>
                  <Image source={require('../Images/lock.png')} style={{}} />{' '}
                  Live{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text
              style={{
                color: '#fff',
                fontSize: 20,
                fontWeight: '700',
              }}>
              {`${String(item?.data?.symbol).toLocaleUpperCase()}/Docoin`}
            </Text>
            <Text
              style={{
                color: '#fff',
                fontSize: 14,
                fontWeight: '400',
              }}>
              Fair Launch - Max buy 3 BNB
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              display: 'flex',
              width: '100%',
              alignSelf: 'center',
              borderRadius: 5,
              paddingTop: 8,
            }}>
            <View>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 18,
                  fontWeight: '700',
                }}>
                Soft/Hard
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 18,
                  fontWeight: '700',
                }}>
                {`${String(item.data.softCap).slice(0, 2)} ${
                  item?.data?.symbol
                }`}
              </Text>
            </View>
          </View>
          <View style={{}}>
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                paddingBottom: 5,
                paddingTop: 10,
                fontWeight: '500',
              }}>
              Progress ({Number(item.data.progress_cent).toFixed(2)}%)
            </Text>
            <ProgressBar
              progress={item.data.progress_cent / 100}
              color={MD3Colors.error50}
              style={{backgroundColor: '#9004fd', padding: 0.9, marginVertical:10}}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              display: 'flex',
              width: '100%',
              alignSelf: 'center',
              borderRadius: 5,
              paddingTop: 5,
            }}>
            <View>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: '500',
                }}>
                {`0 ${item?.data?.symbol}`}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: '500',
                }}>
                {`${String(item.data.softCap).slice(0, 2)} ${
                  item?.data?.symbol
                }`}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              display: 'flex',
              width: '100%',
              alignSelf: 'center',
              borderRadius: 5,
              paddingTop: 10,
            }}>
            <View>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 17,
                  fontWeight: '700',
                }}>
                Liquidity
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: '400',
                }}>
                {`${item.data.liquidityPercent}%`}
              </Text>
            </View>
          </View>
          {/* <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      display: 'flex',
                      width: '100%',
                      alignSelf: 'center',
                      borderRadius: 5,
                    }}>
                    <View>
                      <Text
                        style={{
                          color: '#000000',
                          fontSize: 17,
                          fontWeight: '700',
                        }}>
                        Lockup Time
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: '#000000',
                          fontSize: 15,
                          fontWeight: '400',
                        }}>
                        180 days
                      </Text>
                    </View>
                  </View> */} 
          <View
            style={{
              marginTop:20,
              backgroundColor:'#414141',
              padding:8,
              borderRadius:8
            }}>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: '600',
                }}>
                Sale Ends In
              </Text>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 17,
                  fontWeight: '700',
                }}>
                {`${day}/${month}/${year} ${time.toLocaleTimeString()}`}
                {/* {`${WeekDay}/${day}`} {`${hour}/${minutes}`} */}
              </Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('View Presale', {livePresale: item.data})
                }
                style={{
                  paddingHorizontal: 25,
                  paddingVertical: 10,
                  borderRadius: 5,
                  textAlign: 'center',
                  width: '100%',
                  backgroundColor: '#38ACE9',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: '600',
                  }}>View
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{height: '100%', backgroundColor:'#141516'}}>
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
        <View showsVerticalScrollIndicator={false}>
          <View style={{color: '#000', height: '100%'}}>
            {/* <View style={{paddingHorizontal: 10}}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 30,
                  fontWeight: '700',
                  paddingBottom: 5,
                }}> 
                Current Presales
              </Text>
            </View> */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                display: 'flex',
                width: '95%',
                alignSelf: 'center',
                paddingBottom: 10,
                borderRadius: 5,
                gap:10
              }}>
              <View style={{width: '32%'}}>
                <TouchableOpacity
                  onPress={() => setScreenName('0')}
                  style={{
                    borderColor: screeName === '0' ? '#9004fd' : '#212121',
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderRadius: 5,
                    textAlign: 'center',
                    width: '100%',
                    backgroundColor: screeName === '0' ? '#9004fd' : '#212121',
                    marginTop: 10,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: screeName === '0' ? '#fff' : '#9004fd',
                      fontSize: 16,
                      fontWeight: '700',
                    }}>Live 
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{width: '32%'}}>
                <TouchableOpacity
                  onPress={() => setScreenName('1')}
                  style={{
                    borderColor: screeName === '1' ? '#9004fd' : '#212121',
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderRadius: 5,
                    textAlign: 'center',
                    width: '100%',
                    marginTop: 10,
                    alignItems: 'center',
                    backgroundColor: screeName === '1' ? '#9004fd' : '#212121',
                  }}>
                  <Text
                    style={{
                      color: screeName === '1' ? '#fff' : '#9004fd',
                      fontSize: 16,
                      fontWeight: '700',
                    }}> 
                    Upcoming 
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{width: '32%'}}>
                <TouchableOpacity
                  onPress={() => setScreenName('2')}
                  style={{
                    borderColor: screeName === '2' ? '#9004fd' : '#212121',
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderRadius: 5,
                    textAlign: 'center',
                    width: '100%',
                    marginTop: 10,
                    alignItems: 'center',
                    backgroundColor: screeName === '2' ? '#9004fd' : '#212121',
                  }}>
                  <Text
                    style={{
                      color: screeName === '2' ? '#fff' : '#9004fd',
                      fontSize: 16,
                      fontWeight: '700',
                    }}> Completed 
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {screeName === '0' ? (
              <>
                {filterPresaleItem?.length > 0 ? (
                  <>
                    <FlatList
                      nestedScrollEnabled
                      data={filterPresaleItem}
                      renderItem={renderItem}
                    />
                  </>
                ) : null}
              </>
            ) : null}
            {screeName === '1' ? (
              <>
                <ScrollView>
                  <Upcoming />
                </ScrollView>
              </>
            ) : null}
            {screeName === '2' ? (
              <>
                <ScrollView>
                  <Completed />
                </ScrollView>
              </>
            ) : null}
          </View>
        </View> 
    </SafeAreaView>
  );
};

export default LaunchpadList;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#BCC3C7',
    paddingLeft: 10,
    borderRadius: 5,
    width: '100%',
    color: '#000',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'red',
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  separator: {
    marginVertical: 10,
    height: 0,
    width: '80%',
  },
  sds: {
    position: 'absolute',
    backgroundColor: 'red',
  },

  dropdown: {
    height: 46,
    borderColor: '#BCC3C7',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    color: '#000',
    width: 300,
  },

  icon: {
    marginRight: 5,
  },

  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 0,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    display: 'none',
  },

  placeholderStyle: {
    fontSize: 16,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#BCC3C7',
    paddingLeft: 10,
    borderRadius: 5,
    color: '#fff',
    padding: 8,
  },

  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },

  iconStyle: {
    width: 20,
    height: 20,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  itemTextStyle: {
    color: '#000',
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
    width: '110%',
    flex: 1,
    right: 20,
  },
});
