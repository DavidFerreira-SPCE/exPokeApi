import { Image } from 'expo-image';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from './styles';
import axios from 'axios'; 

export default function SearchPokemon() {
  const [searchTerm, setSearchTerm] = useState('');
  const [digimonData, setDigimonData] = useState(null);
  const [initialDigimons, setInitialDigimons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
    try {
    const requests = await axios.get('https://pokeapi.co/api/v2/pokemon/{id or name}/');
    if (requests.data.content && requests.data.content.length > 0) {
      setInitialPokes(prevPokes => [...prevPokes, ...requests.data.content]);
      setCurrentPage(requests.data.pageable.currentPage);

    }


return (
  <SafeAreaView style={Styles.body}>
    <ScrollView style={Styles.containerBody}>
      <View>
        <View style={Styles.logoDisplay}>
          <Image
            source={require("../assets/images/pokeapi.png")}
            style={Styles.logo}
          />
        
          <Image
            source={require("../assets/images/pokebola.png")}
            style={Styles.logo}
          />
        </View>
        <Text style={Styles.texto}>
          Welcome to PokeApi Unofficial Searching App
        </Text>

        <TextInput
          style={Styles.textoBusca}
          placeholder='Digite o nome/número do Pokemon que deseja encontrar'
          placeholderTextColor={'white'}
          value={userInput}
          onChangeText={setUserInput}
          onSubmitEditing={() => searchPoke()}
        />
        <TouchableOpacity
        style={Styles.julioBox}
        >
          <Text style={Styles.julio}>Pesquisar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
)};