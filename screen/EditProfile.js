import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const EditProfile = ({ navigation, route }) => {
  const user = route.params.user;
  const [username, setUsername] = useState(user.username);
  const [phone, setPhone] = useState(user.sdt);
  const [avatar, setAvatar] = useState(user.avatar);
  const [email, setEmail] = useState(user.email);
  const initialBirthday = user.birthDay ? new Date(user.birthDay) : new Date();
  const [birthday, setBirthday] = useState(initialBirthday);
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [user]); // The dependency array ensures that this runs only when `user` changes

  const onChange = (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  const handleSelectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access the media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const updatePost = async (idUser, username, avatar, sdt, email, birthDay) => {
    try {
      // Format birthDay to 'YYYY-MM-DD' in local time
      const formatBirthDay = (birthDay) => {
        // Create a new Date object from the input string
        const date = new Date(birthDay);
  
        // Adjust the date based on the local timezone offset (in minutes)
        const localOffset = date.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
        const localDate = new Date(date.getTime() - localOffset);
  
        // Return the date as 'YYYY-MM-DD'
        return localDate.toISOString().split('T')[0];
      };
    
      const formattedBirthDay = formatBirthDay(birthDay);
    
      // Send the API request with the formatted birthDay
      const response = await axios.put('http://192.168.1.4:3000/updateProfile', {
        idUser,
        username,
        avatar,
        sdt,
        email,
        birthDay: formattedBirthDay, // Use the formatted birthDay
      });
    
      if (response.status === 200) {
        Alert.alert("Thành công", "Cập nhật thông tin thành công!");
        fetchUserData(); // Fetch the updated user data after the update
      } else {
        Alert.alert("Lỗi", "Đã xảy ra lỗi khi cập nhật thông tin!");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      Alert.alert("Lỗi", "Không thể kết nối tới máy chủ.");
    }
  };
  
  
  const fetchUserData = async () => {
    try {
      // Fetch the updated user data from the server
      const response = await axios.get(`http://192.168.1.4:3000/data?id=${user.idUser}`);
      if (response.status === 200) {
        // If the request is successful, update the user data in the state
        const updatedUser = response.data[0];
        setUsername(updatedUser.username);
        setPhone(updatedUser.sdt);
        setAvatar(updatedUser.avatar);
        setEmail(updatedUser.email);
        setBirthday(new Date(updatedUser.birthDay)); // Assuming birthDay is in the format you want
        console.log("Dữ liệu người dùng đã được cập nhật:", updatedUser);
      } else {
        Alert.alert("Lỗi", "Không thể lấy dữ liệu người dùng!");
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      Alert.alert("Lỗi", "Không thể kết nối tới máy chủ.");
    }
  };

  const update = () => {
    updatePost(user.idUser, username, avatar, phone, email, birthday);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={{ uri: avatar }} />
        <AntDesign
          style={styles.editIcon}
          name="edit"
          size={24}
          color="gray"
          onPress={handleSelectImage}
        />
      </View>

      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholder="Enter your username"
      />

      <TextInput
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="Enter your phone number"
      />

      <TextInput
        style={styles.input}
        value={birthday.toLocaleDateString()}
        placeholder="Select your birthday"
        onFocus={() => setShow(true)}
        showSoftInputOnFocus={false}
      />

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={birthday}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}

      <TextInput
        style={styles.input}
        value={email}
        placeholder="Enter your email"
        onChangeText={setEmail}
      />

      <TouchableOpacity
        onPress={update}
        style={styles.saveButton}
      >
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    height: 200,
    width: 200,
    borderRadius: 100,
    resizeMode: 'cover',
  },
  editIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 50,
    elevation: 5,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
  },
  saveButton: {
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfile;
