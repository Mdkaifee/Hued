
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';

export default function TempScreen() {
  const data = [
    {
      name: 'Tanmay',
      age: 22,
    },
    {
      name: 'hello',
      age: 22,
    },
  ];
  const _renderItem = ({item}) => (
    <View>
      <Text>{item.name}</Text>
    </View>
  );
  return (
    <View style={{flex: 1, backgroundColor: 'green'}}>
      <FlatList data={data} renderItem={_renderItem} />
    </View>
  );
}

const styles = StyleSheet.create({});
