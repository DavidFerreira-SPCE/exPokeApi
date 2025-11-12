import axios from 'axios';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from './styles';

// --- COMPONENTE FILHO: EXIBIÇÃO DE DETALHES DO POKÉMON ---
const PokemonCard = ({ pokemon }) => {
  if (!pokemon) return null;

  // Extrai os tipos, formatando em uma string (ex: "grass, poison")
  const typesList = pokemon.types.map(t => t.type.name).join(', ');
  // Altura (height) e Peso (weight) na PokeAPI vêm em decímetros e hectogramas. 
  // Dividimos por 10 para obter metros e quilogramas, respectivamente.
  const heightInMeters = (pokemon.height / 10).toFixed(1);
  const weightInKg = (pokemon.weight / 10).toFixed(1);

  return (
    <View style={cardStyles.container}>
      <Text style={cardStyles.nameText}>
        #{pokemon.id} - {pokemon.name.toUpperCase()}
      </Text>

      <Image
        // A URL para o sprite frontal
        source={{ uri: pokemon.sprites.front_default }}
        style={cardStyles.image}
        contentFit="contain"
      />

      <View style={cardStyles.dataRow}>
        <Text style={cardStyles.label}>Tipo(s):</Text>
        <Text style={cardStyles.value}>{typesList}</Text>
      </View>
      <View style={cardStyles.dataRow}>
        <Text style={cardStyles.label}>Altura:</Text>
        <Text style={cardStyles.value}>{heightInMeters} m</Text>
      </View>
      <View style={cardStyles.dataRow}>
        <Text style={cardStyles.label}>Peso:</Text>
        <Text style={cardStyles.value}>{weightInKg} kg</Text>
      </View>
    </View>
  );
};


// --- COMPONENTE PRINCIPAL ---
export default function SearchPokemon() {
  const [userInput, setUserInput] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [initialPokemons, setInitialPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const searchPokemon = async () => {
    if (!userInput.trim()) {
      Alert.alert("Atenção", "Por favor, digite o nome ou número do Pokémon.");
      return;
    }

    setLoading(true);
    setError('');
    setPokemonData(null);

    const searchIDOrName = userInput.trim().toLowerCase();

    try {
      // Busca o Pokémon específico
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchIDOrName}`);
      setPokemonData(response.data);

    } catch (err) {
      console.error("Erro ao buscar Pokémon");
      setError(`Pokémon "${userInput}" não encontrado. Tente novamente.`);
      setPokemonData(null);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para carregar a lista inicial de Pokémon (CORRIGIDO)
  useEffect(() => {
    const loadInitialPokemons = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=10');
        setInitialPokemons(response.data.results);
      } catch (err) {
        console.error("Erro ao carregar lista inicial:", err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialPokemons();
  }, []);


  return (
    <SafeAreaView style={Styles.body}>
      <ScrollView contentContainerStyle={
        {
          // width: '100%', // Já coberto pelo flex: 1 no containerBody, pode ser redundante
          paddingHorizontal: 20,
          paddingVertical: 10,
          flexGrow: 1 // <<< Garante que o conteúdo pode rolar mesmo se não preencher
        }
      } style={Styles.containerBody}>
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
            placeholderTextColor={'#e7e7e7ff'}
            value={userInput}
            onChangeText={setUserInput}
            onSubmitEditing={searchPokemon}
          />

          <View>
            <TouchableOpacity
              style={Styles.julio}
              onPress={searchPokemon}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Pesquisar</Text>
            </TouchableOpacity>
          </View>

          {/* --- FEEDBACK PARA O USUÁRIO --- */}
          {loading && <ActivityIndicator size="large" color="#a01010ff" style={{ marginVertical: 20 }} />}

          {error ? (
            <Text style={[Styles.texto, { backgroundColor: '#FFD700', color: 'red' }]}>
              {error}
            </Text>
          ) : null}

          {/* --- EXIBIÇÃO DO POKÉMON ENCONTRADO --- */}
          {pokemonData && (
            <PokemonCard pokemon={pokemonData} />
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Estilos específicos para o cartão de resultado
const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    borderWidth: 2,
    borderColor: '#a01010ff',
    borderRadius: 16,
    padding: 15,
    margin: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#333',
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
});
