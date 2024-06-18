import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

export default function WritePostScreen() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState('자유게시판');
  const navigation = useNavigation();

  const requestStoragePermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to allow access to your photos to add images.');
      return false;
    }
    return true;
  };

  const handleAddImage = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;

    if (images.length < 5) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImages([...images, { uri: result.uri }]);
      }
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('location', location);
      formData.append('content', content);
      formData.append('board', selectedBoard);  // 선택한 게시판 추가
      images.forEach((image, index) => {
        formData.append('image', {
          uri: image.uri,
          type: 'image/jpeg',
          name: `image${index}.jpg`,
        });
      });

      const response = await axios.post('http://121.127.165.28:5000/api/createPosts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 201) {
        Alert.alert('글이 성공적으로 등록되었습니다.');
        navigation.goBack();
      } else {
        Alert.alert('글 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('글 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>글쓰기</Text>
        <TouchableOpacity onPress={handleComplete}>
          <Text style={styles.completeButton}>완료</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="방문한 장소(선택)"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.textArea}
        placeholder="내용"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Picker
        selectedValue={selectedBoard}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setSelectedBoard(itemValue)}
      >
        <Picker.Item label="자유게시판" value="자유게시판" />
        <Picker.Item label="모임게시판" value="모임게시판" />
      </Picker>
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddImage}>
          <Text style={styles.addButtonText}>📷</Text>
        </TouchableOpacity>
        {images.map((image, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Text style={styles.imageText}>{`사진${index + 1}`}</Text>
            <TouchableOpacity onPress={() => handleRemoveImage(index)}>
              <Text style={styles.removeButton}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  completeButton: {
    fontSize: 16,
    color: '#007bff',
    backgroundColor: '#e0f7fa',
    padding: 5,
    borderRadius: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 8,
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 8,
    paddingTop: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  addButtonText: {
    fontSize: 24,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  imageText: {
    width: 60,
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    lineHeight: 60,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#ff0000',
    color: '#fff',
    borderRadius: 10,
    padding: 2,
    fontSize: 12,
  },
});
