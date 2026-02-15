import React from 'react';
// import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View, Text } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Video from 'react-native-video';
const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonVideo: {
    width: 350,
    margin:'auto',
    alignSelf:'center',
    height: 300,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode:'contain'
  },
  
});
 
const slides = [
    {
      key: 1,
      title: 'hello',
      video:require('../Images/log.mp4'),
      backgroundColor: '#59b2ab',
        
    },
    {
        key: 2,
        title: 'hello',
        video:require('../Images/log.mp4'),
        backgroundColor: '#59b2ab',
          
      }
  ];
 
export default class App extends React.Component {
 _renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>
        {/* <Image source={item.image} /> */}
        <Video source={item.video} style={styles.buttonVideo} resizeMode='cover' />
        <Text style={styles.text}>{item.title}</Text>
      </View>
    );
  }
  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        {/* <Ion
          name="md-arrow-round-forward"
          color="rgba(255, 255, 255, .9)"
          size={24}
        /> */}
      </View>
    );
  };
  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        {/* <Ion
          name="md-checkmark"
          color="rgba(255, 255, 255, .9)"
          size={24}
        /> */}
      </View>
    );
  };
  render() {
    return (
      <AppIntroSlider
        data={slides}
        renderDoneButton={this._renderDoneButton}
        renderNextButton={this._renderNextButton}
        renderItem={this._renderItem}
      />
    );
  }
}