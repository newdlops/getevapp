import React from 'react';
import {Text, TextInput, View} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';


const SearchHeader: React.FC = () => {


  return (
    <View style={{height: 70, flexDirection: 'row', justifyContent:'center', alignItems: 'center'}}>
      <View style={{backgroundColor: '#DDDDDD', flexDirection: 'row',justifyContent: 'center', alignItems: 'center', height: 40, width: 379, paddingLeft: 5}}>
        <Icon size={24} name={'search'} color={'gray'}/>
        <TextInput style={{height: 40, width: 350}}></TextInput>
      </View>
    </View>
  )
};


export default SearchHeader;
