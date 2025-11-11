import { Image } from 'expo-image';
import React from 'react';
import { ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from './styles';

export default function Index() {
  return (
    <SafeAreaView style={Styles.body}>
      <ScrollView>
      <Image
          source={require("../assets/images/pokeapi.png")}
          style={Styles.logo}
      />
      </ScrollView>
    </SafeAreaView>
  );
}
