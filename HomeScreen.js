import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ route }) {
  const [posts, setPosts] = useState([]);
  const [weather, setWeather] = useState({});
  const selectedFactory = route.params?.selectedFactory;
  const region = route.params?.region;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('http://121.127.174.92:5000/api/getPosts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Posts fetched:', response.data);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        Alert.alert('오류', '게시물을 가져오는 중 오류가 발생했습니다.');
      }
    };

    const fetchWeather = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.post('http://121.127.174.92:5000/api/weather', {
          region,
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Weather fetched:', response.data);
        setWeather(response.data);
      } catch (error) {
        console.error('Error fetching weather:', error);
        Alert.alert('오류', '날씨 정보를 가져오는 중 오류가 발생했습니다.');
      }
    };

    fetchPosts();
    if (region) {
      fetchWeather();
    }
  }, [region]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/parachute.png')} style={styles.logo} />
        <Text style={styles.siteName}>GlideMate</Text>
      </View>
      <View style={styles.weatherSection}>
        <Text style={styles.sectionTitle}>활공장: {selectedFactory}</Text>
        <View style={styles.weatherCard}>
          <Text style={styles.weatherLocation}>{weather.location || '활공장 정보 없음'}</Text>
          <View style={styles.weatherInfo}>
            <Image source={{ uri: weather.icon || 'https://i.imgur.com/llF5iyg.png' }} style={styles.weatherIcon} />
            <Text style={styles.temperature}>{weather.temperature || '-'}</Text>
            <Text style={styles.weatherDetails}>{weather.alert || '날씨특보 없음'}</Text>
          </View>
          <View style={styles.weatherStats}>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatLabel}>풍향</Text>
              <Text style={styles.weatherStatValue}>{weather.windDirection || '-'}</Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatLabel}>풍속</Text>
              <Text style={styles.weatherStatValue}>{weather.windSpeed || '-'}</Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatLabel}>구름양</Text>
              <Text style={styles.weatherStatValue}>{weather.cloudCoverage || '-'}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.boardSection}>
        <Text style={styles.sectionTitle}>게시판</Text>
        <View style={styles.boardCard}>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <Text key={index}>{`${post.boardType} (${post.title})`}</Text>
            ))
          ) : (
            <Text>게시물이 없습니다.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingLeft: 16,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  siteName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  weatherSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  weatherCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  weatherLocation: {
    fontSize: 16,
    marginBottom: 10,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    marginRight: 10,
  },
  weatherDetails: {
    fontSize: 14,
    color: '#666',
  },
  weatherStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherStat: {
    alignItems: 'center',
  },
  weatherStatLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  weatherStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  boardSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  boardCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
