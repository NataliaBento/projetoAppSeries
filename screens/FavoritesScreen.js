import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const FavoriteItem = ({ item, removeFavorite, navigateToDetails }) => {
  return (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: item.image?.medium || 'https://via.placeholder.com/210x295' }} />
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>{item.premiered}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigateToDetails(item.id)}>Ver Detalhes</Button>
        <Button onPress={() => removeFavorite(item.id)}>Remover dos Favoritos</Button>
      </Card.Actions>
    </Card>
  );
};

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          const storedFavorites = await AsyncStorage.getItem('favorites');
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          }
        } catch (error) {
          console.error(error);
        }
      };
      loadFavorites();
    }, [])
  );

  const removeFavorite = async (id) => {
    try {
      const updatedFavorites = favorites.filter((show) => show.id !== id);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      alert('Série removida dos favoritos!');
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToDetails = (id) => {
    navigation.navigate('Details', { id });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FavoriteItem
            item={item}
            removeFavorite={removeFavorite}
            navigateToDetails={navigateToDetails}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { marginBottom: 10 },
});

export default FavoritesScreen;
