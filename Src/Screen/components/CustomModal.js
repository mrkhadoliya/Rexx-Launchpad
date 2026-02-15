import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CustomModal = ({MainTitle, isVisible1, setIsVisible1,type,OkButtonPressed }) => {
  return (
    <>
     {type == 'success' &&    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible1}
        onRequestClose={() => {
          setIsVisible1(!isVisible1);
        }}>
        <View style={styles.centeredView}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              borderRadius: 50,
              height: 60,
              width: 60,
              top: 30,
              zIndex: 10,
            }}>
            <MaterialIcons name="check" size={40} color="green" />
          </View>
          <View style={styles.modalView}>
            
              <Text style={styles.modalText}>{MainTitle ? MainTitle : ''}</Text>
           

            <View style={styles.DeactivateButtonContainer}>
              <TouchableOpacity
                onPress={() => OkButtonPressed()}
                style={styles.cancelButtonContainer}>
                <Text style={styles.cancelButtonContainerText}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>}
    {type == 'error' &&    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible1}
        onRequestClose={() => {
          setIsVisible1(!isVisible1);
        }}>
        <View style={styles.centeredView}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              borderRadius: 50,
              height: 60,
              width: 60,
              top: 30,
              zIndex: 10,
            }}>
            <MaterialIcons name="error-outline" size={40} color="red" />
          </View>
          <View style={styles.modalView}>
            
              <Text style={styles.modalText}>{MainTitle ? MainTitle : ''}</Text>
           

            <View style={styles.DeactivateButtonContainer}>
              <TouchableOpacity
                onPress={() => OkButtonPressed()}
                style={styles.cancelButtonContainer}>
                <Text style={styles.cancelButtonContainerText}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>}
    </>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#FEFEFE',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 1,
    width: '90%',
    // height:'20%',
    borderColor: 'gray',
    borderWidth: 0.1,
    height: Platform.OS === 'android' ? '26%' : '22%',
  },
  modalText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    paddingBottom: 5,
    marginTop: 20,
  },
  subtiltleText: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'left',
    marginTop: 10,
    color: '#001524',
  },
  DeactivateButtonContainer: {
    alignItems: 'center',
    marginTop: 15,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: '100%',
  },
  cancelButtonContainer: {
    backgroundColor: '#38ACE9',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: '35%',
    borderRadius: 10,
  },
  cancelButtonContainerText: {fontSize: 18, fontWeight: '600', color: '#fff'},
});
