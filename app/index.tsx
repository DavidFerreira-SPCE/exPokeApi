import axios from 'axios';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

import Styles from './styles';

// --- INTERFACES DO TYPESCRIPT ---

interface PokemonTypeSlot {
  type: {
    name: string;
  };
}

interface PokemonData {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: PokemonTypeSlot[];
  height: number;
  weight: number;
}

interface PokemonCardProps {
  pokemon: PokemonData;
}


// --- COMPONENTE DO CARTÃO ---
const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  const typesList = pokemon.types.map(t => t.type.name).join(', ');
  const heightInMeters = (pokemon.height / 10).toFixed(1);
  const weightInKg = (pokemon.weight / 10).toFixed(1);

  return (
    <View style={cardStyles.container}>
      <Text style={cardStyles.nameText}>
        #{pokemon.id} - {pokemon.name.toUpperCase()}
      </Text>
      <Image
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


// --- COMPONENTE PRINCIPAL ---
export default function SearchPokemon() {
  const [userInput, setUserInput] = useState('');
  const [searchedPokemon, setSearchedPokemon] = useState<PokemonData | null>(null);
  const [displayedPokemons, setDisplayedPokemons] = useState<PokemonData[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState('');

  const POKEMON_PER_PAGE = 5;

  const loadMorePokemons = async () => {
    setLoadingList(true);
    setError('');
    setSearchedPokemon(null); 

    const offset = displayedPokemons.length;

    try {
      const listResponse = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_PER_PAGE}&offset=${offset}`
      );
      
      const results = listResponse.data.results;

      const detailPromises = results.map((p: { url: string }) => axios.get(p.url));
      const detailResponses = await Promise.all(detailPromises);
      const newPokemonsData = detailResponses.map(res => res.data);

      setDisplayedPokemons(prevList => [...prevList, ...newPokemonsData]);

    } catch (err) {
      console.error("Erro ao carregar lista", err);
      setError("Não foi possível carregar a lista de Pokémon.");
    } finally {
      setLoadingList(false);
    }
  };

  const searchPokemon = async () => {
    if (!userInput.trim()) {
      Alert.alert("Atenção", "Por favor, digite o nome ou número do Pokémon.");
      return;
    }

    setLoadingSearch(true);
    setError('');
    setSearchedPokemon(null); 

    const searchIDOrName = userInput.trim().toLowerCase();

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchIDOrName}`);
      setSearchedPokemon(response.data); 

    } catch (err) {
      console.error("Erro ao buscar Pokémon", err);
      setError(`Pokémon "${userInput}" não encontrado.`);
      setSearchedPokemon(null);
    } finally {
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    loadMorePokemons();
  }, []);

  useEffect(() => {
    if (!userInput.trim()) {
      setSearchedPokemon(null);
      setError(''); 
    }
  }, [userInput]);

  
  return (
    <SafeAreaView style={Styles.body}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          flexGrow: 1
        }}
        style={Styles.containerBody}
      >
        <View>
          {/* --- LOGOS E TÍTULO --- */}
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

          {/* --- BARRA DE BUSCA E BOTÃO --- */}
          <TextInput
            style={Styles.textoBusca}
            placeholder='Digite o nome/número do Pokemon'
            placeholderTextColor={'#e7e7e7ff'}
            value={userInput}
            onChangeText={setUserInput}
            onSubmitEditing={searchPokemon}
          />
          <View>
            <TouchableOpacity
              style={Styles.julio}
              onPress={searchPokemon}
              disabled={loadingSearch}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                {loadingSearch ? "Buscando..." : "Pesquisar"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Mostra erro, se houver */}
          {error ? (
            <Text style={[Styles.texto, { backgroundColor: '#FFD700', color: 'red', marginVertical: 10, padding: 10, borderRadius: 5 }]}>
              {error}
            </Text>
          ) : null}


          {/* --- ÁREA DE RESULTADO (LÓGICA CONDICIONAL) --- */}
          
          {/* Se TIVER um Pokémon pesquisado, mostre SÓ ele: */}
          {searchedPokemon ? (
            <PokemonCard pokemon={searchedPokemon} />
          ) : (
            
            /* Senão, mostre a LISTA: */
            <>
              {displayedPokemons.map(pokemon => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
              
              {/* Indicador de loading da LISTA */}
              {loadingList && <ActivityIndicator size="large" color="#a01010ff" style={{ marginVertical: 20 }} />}
              
              {/* Botão "Ver mais" (só aparece se não estiver carregando) */}
              {!loadingList && (
                <View>
                  <TouchableOpacity
                    style={Styles.julio}
                    onPress={loadMorePokemons}
                  >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                      Ver mais
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};