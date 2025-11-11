import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from './styles';

export default function Index() {
  return (
    <SafeAreaView style={Styles.body}>
      <ScrollView>
      <View>
      <Image
          source={require("../assets/images/pokeapi.png")}
          style={Styles.logo}
      />
      </View>
      <View style={}>
      <Text style={}>Welcome to PokeApi Unofficial Searching App</Text>

      <TextInput
          style={}
          placeholder='Digite o nome/número do Pokemon que deseja encontrar'
          value={userInput}
          onChangeText={setUserInput}
          onSubmitEditing={() => searchPoke()}
        />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
