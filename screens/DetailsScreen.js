import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailsScreen = ({ route }) => {
  const { id } = route.params;
  const [show, setShow] = useState(null);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await axios.get(`https://api.tvmaze.com/shows/${id}`);
        setShow(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchShowDetails();
  }, [id]);

  const addToFavorites = async () => {
    try {
      const existingFavorites = await AsyncStorage.getItem('favorites') || '[]';
      const favorites = JSON.parse(existingFavorites);
      favorites.push(show);
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      alert('Série adicionada aos favoritos!');
    } catch (error) {
      console.error(error);
    }
  };

  if (!show) {
    return <Paragraph>Carregando...</Paragraph>;
  }

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Cover source={{ uri: show.image?.medium || 'https://via.placeholder.com/210x295' }} />
        <Card.Content>
          <Title>{show.name}</Title>
          <Paragraph>Gêneros: {show.genres.join(', ')}</Paragraph>
          <Paragraph>Estreia: {show.premiered}</Paragraph>
          <Paragraph>{show.summary.replace(/<[^>]*>?/gm, '')}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={addToFavorites}>Adicionar aos Favoritos</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
});

export default DetailsScreen;
