import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign'


const CustomDropDown = () => {
  const [openSelector, setOpenSelector] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  return (
    <View style={{marginBottom: 8,}}>
      <Text style={styles.label}>Select College List</Text>
      <Pressable
        style={styles.TextInput}
        onPress={() => setOpenSelector(prev => !prev)}>
        <View
          style={[
            styles.flexDirection,
            {justifyContent: 'space-between', width: '100%'},
          ]}>
          <View>
            <Text style={{color: GlobalTheme.App_Theme.PrimaryText}}>
              {' '}
              {selectedValue == null ? 'Select College List' : selectedValue}
            </Text>
          </View>
          <View>
            {!openSelector ? (
              <AntDesign
                name="down"
                color={GlobalTheme.App_Theme.PrimaryText}
                size={18}
              />
            ) : (
              <AntDesign
                name="up"
                color={GlobalTheme.App_Theme.PrimaryText}
                size={18}
              />
            )}
          </View>
        </View>
      </Pressable>
      {openSelector && (
        <View style={styles.openSelectorContainer}>
          <Pressable
            onPress={() => setSelectedValue('Akashdeep Public School')}
            style={styles.selectPressable}>
            <Text style={styles.selectText}>Akashdeep Public School</Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedValue('Birla Public School')}
            style={styles.selectPressable}>
            <Text style={styles.selectText}>Birla Public School</Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedValue('Cambridge Court High School')}
            style={styles.selectPressable}>
            <Text style={styles.selectText}>Cambridge Court High School</Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedValue('Delhi Public School')}
            style={styles.selectPressable}>
            <Text style={styles.selectText}>Delhi Public School</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default CustomDropDown;

const styles = StyleSheet.create({
  label: {
    color: GlobalTheme.App_Theme.PrimaryText,
    fontSize: 14,
    marginVertical: 5,
  },

  TextInput: {
    backgroundColor: GlobalTheme.App_Theme.BackgroundPurpleDark,
    borderWidth: 1,
    borderColor: GlobalTheme.App_Theme.BorderPurpleDark,
    borderRadius: 8,
    color: GlobalTheme.App_Theme.PrimaryText,
    fontWeight: '400',
    letterSpacing: 0.2,
    paddingHorizontal: 15,
    width: '100%',
    height: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  openSelectorContainer: {
    backgroundColor: GlobalTheme.App_Theme.BackgroundColor,
    borderWidth: 1,
    borderColor: GlobalTheme.App_Theme.BorderPurpleDark,
    padding: 5,
    borderRadius: 12,
    width: '100%',
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  selectPressable: {
    backgroundColor: GlobalTheme.App_Theme.PrimaryText,
    padding: 10,
    marginVertical: 3,
    borderRadius: 5,
  },
  selectText: {
    color: GlobalTheme.App_Theme.BackgroundColor,
    fontSize: 15,
    fontWeight: '500',
  },
});
