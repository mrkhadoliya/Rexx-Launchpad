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
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {ProgressBar, MD3Colors} from 'react-native-paper';
import {useSelector} from 'react-redux';


const Completed = () => {
  const data = useSelector(state => state.presale.presaleList);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  const [screeName, setScreenName] = useState('0');

  const filterPresaleItem = data?.filter(item => item.status === 'completed');
  console.log(filterPresaleItem, 'ititiitititiititit');

  const renderItem = ({item, index}) => {
    const time = new Date(JSON.parse(item?.data?.endTime * 1000));
    const day = String(time.getDate()).padStart(2, 0);
    const month = String(time.getMonth() + 1).padStart(2, 0);
    const year = String(time.getUTCFullYear()).padStart(2, 0);
    // console.log(time.toLocaleTimeString(),item?.data?.startTime,'0p0p0p')
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
                  borderColor: '#424242',
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
              {/* <TouchableOpacity
                onPress={() => navigation.navigate('LaunchpadList')}
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                  borderRadius: 5,
                  textAlign: 'center',
                  width: '100%',
                  backgroundColor: '#393C43',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  <Image source={require('../Images/lock.png')} style={{}} />{' '}
                  Live{' '}
                </Text>
              </TouchableOpacity> */}
            </View>
               <Text
              style={{
                color: '#9004fd',
                fontSize: 20,
                fontWeight: '600',
                paddingRight:15,
                textAlign:"center",
                marginTop:15
              }}>
              {`${String(item?.data?.symbol).toUpperCase()}/Docoin`}
            </Text>
          </View>

          <View>
           
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
                  fontWeight: '600',
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
              Progress ({item.data.progress_cent}%)
            </Text>
            <ProgressBar
              progress={item.data.progress_cent/100}
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
                Liquidity %
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
                  color: '#fff',
                  fontSize: 17,
                  fontWeight: '700',
                }}>
                Lockup Time
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#fff',
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
                Sale Ended!
              </Text>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 17,
                  fontWeight: '700',
                }}>
                {`${day}/${month}/${year} ${time.toLocaleTimeString()}`}
              </Text>
            </View>
            <View>
              {/* <TouchableOpacity
                onPress={() => navigation.navigate('View Presale')}
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
                  }}>
                  {' '}
                  View{' '}
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <View style={{color: '#000', height: '100%'}}>
        {filterPresaleItem?.length > 0 ? (
          <>
            <FlatList
              nestedScrollEnabled
              data={filterPresaleItem}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default Completed;

const styles = StyleSheet.create({});
