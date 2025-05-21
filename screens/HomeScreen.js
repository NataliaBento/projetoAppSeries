import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [shows, setShows] = useState([]);

  const searchShows = async () => {
    try {
      const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
      setShows(response.data);
    } catch (error) {
      console.error(error);
      setShows([]);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Digite o nome da série..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <Button mode="contained" onPress={searchShows} style={styles.button} buttonColor='#FF71CE'>
        Buscar
      </Button>

      <FlatList
        data={shows}
        keyExtractor={(item) => item.show.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Cover source={{ uri: item.show.image?.medium || 'https://via.placeholder.com/210x295' }} />
            <Card.Content>
              <Title>{item.show.name}</Title>
              <Paragraph>{item.show.premiered}</Paragraph>
              <Paragraph>{item.show.status}</Paragraph>
              <Paragraph>{item.show.language}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate('Details', { id: item.show.id })}>
                Ver Detalhes
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: { height: 40, borderColor: '#7E5A9B', borderWidth: 1, borderRadius: 10, marginBottom: 10, padding: 10 },
  button: { marginBottom: 10 },
  card: { marginBottom: 10 },
});

export default HomeScreen;
