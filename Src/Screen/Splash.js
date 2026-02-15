import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React, { useEffect } from 'react';

const Splash = ({navigation}) => {
    useEffect(() => {
     setTimeout(() => {
        navigation.navigate('Login')
     }, 1000);
    }, [])
    
  return (
    <View
      style={{
        backgroundColor: '#141516',
        height: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View>
        <TouchableOpacity style={styles.ImageBtn}>
          <Image source={require('./Images/logo.png')} style={styles.ImageLogo} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  ImageBtn:{
    backgroundColor:'#212121',
    borderRadius:100,
    padding:5,
    width:130,
    height:130,
    alignItems:'center',
    justifyContent:'center'
  },
  ImageLogo:{
    width:100,
    height:100,
    resizeMode:'contain'
  }
})
