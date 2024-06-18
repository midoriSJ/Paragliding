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
        const response = await axios.get('http://121.127.99.208:5000/api/getPosts', {
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
        const response = await axios.post('http://121.127.99.208:5000/api/weather', {
          factoryName: selectedFactory,
        }, {
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
    if (selectedFactory) {
      fetchWeather();
    }
  }, [selectedFactory]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/parachute.png')} style={styles.logo} />
        <Text style={styles.siteName}>GlideMate</Text>
      </View>
      <View style={styles.weatherSection}>
        <Text style={styles.sectionTitle}>활공장: {selectedFactory}</Text>
        <View style={styles.weatherCard}>
          <Text style={styles.weatherLocation}>{region || '활공장 정보 없음'}</Text>
          <View style={styles.weatherInfo}>
            <Text style={styles.temperature}>{weather.temperature ? `${weather.temperature}°C` : '-'}</Text>
            <Text style={styles.weatherDetails}>{weather.weather || '날씨 정보 없음'}</Text>
          </View>
          <View style={styles.weatherStats}>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatLabel}>풍향</Text>
              <Text style={styles.weatherStatValue}>{weather.wind_direction || '-'}</Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatLabel}>풍속</Text>
              <Text style={styles.weatherStatValue}>{weather.wind_speed ? `${weather.wind_speed} m/s` : '-'}</Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatLabel}>구름양</Text>
              <Text style={styles.weatherStatValue}>{weather.cloud_coverage || '-'}</Text>
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
    justifyContent: 'center',
    padding: 20,
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
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  weatherCard: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
  },
  weatherLocation: {
    fontSize: 18,
    marginBottom: 10,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    marginRight: 10,
  },
  weatherDetails: {
    fontSize: 18,
  },
  weatherStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherStat: {
    alignItems: 'center',
  },
  weatherStatLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  weatherStatValue: {
    fontSize: 16,
  },
  boardSection: {
    padding: 20,
  },
  boardCard: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
  },
});