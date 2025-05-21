import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Portal, Dialog } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailsScreen = ({ route }) => {
  const { id } = route.params;
  const [show, setShow] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

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

      setDialogVisible(true); // Abre o Dialog
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
          <Paragraph>Descrição: {show.summary.replace(/<[^>]*>?/gm, '')}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={addToFavorites}>Adicionar aos Favoritos</Button>
        </Card.Actions>
      </Card>

      {/* Modal de alerta moderno */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Sucesso!</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Série adicionada aos favoritos!</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
});

export default DetailsScreen;
