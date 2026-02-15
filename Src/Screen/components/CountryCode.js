import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Modal, StyleSheet } from 'react-native';
import CountryCodes from '../countryCodejson/CountryCodes.json';

const CountryCode = ({ style, country, setCountry, countryCode, setCountryCode }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(CountryCodes);

    const handleSearch = (text) => {
        setSearchQuery(text);

        const startingWithText = CountryCodes.filter(item =>
            item.name.toLowerCase().startsWith(text.toLowerCase())
        );

        const containingText = CountryCodes.filter(item =>
            item.name.toLowerCase().includes(text.toLowerCase()) && !startingWithText.includes(item)
        );

        const combinedResults = startingWithText.concat(containingText);

        setFilteredData(combinedResults);
    };

    const resetFilter = () => {
        setSearchQuery('');
        setFilteredData(CountryCodes);
    };

    return (
        <View>
            <TouchableOpacity style={styles.countryInput} onPress={() => {setModalVisible(true); resetFilter();}}>
                <Text style={{ fontWeight: '500', color:'#fff' }}>{country} ({countryCode})</Text>
            </TouchableOpacity>

            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.modalContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search countries"
                            onChangeText={handleSearch}
                            placeholderTextColor='#fff'
                        />
                        <FlatList
                            data={filteredData}
                            initialNumToRender={100}
                            maxToRenderPerBatch={100}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalVisible(false);
                                        setCountry(item.code);
                                        setCountryCode(item.dial_code);
                                    }}>
                                    <View style={styles.listItem}>
                                        <Text style={styles.countryName}>{item.name}</Text>
                                        <Text style={styles.emoji}>{item.emoji}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    countryInput: {
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 20,
        borderRadius: 5, 
        backgroundColor:'#212121',
        top:-5
    },
    modalContainer: {
        backgroundColor: '#212121',
        padding: 25,
        borderRadius: 30,
        width: '100%',
        height: '90%',
        borderColor: '#000',
        borderWidth: 0.4,
        margin:10
    },
    searchInput: {
        height: 45,
        backgroundColor: '#414141', 
        marginBottom: 15,
        paddingLeft: 15,
        borderRadius: 5,
        color:'#fff'
    },
    listItem: {
        height: 50,
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#414141',
        alignItems: 'center'
    },
    countryName: {
        color: '#fff',
        fontSize: 15,
        width: '70%',
    },
    emoji: {
        color: 'gray',
        fontSize: 15,
    },
});

export default memo(CountryCode);
