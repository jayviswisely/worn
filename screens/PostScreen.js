import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ActivityIndicator, Image, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';

export default function PostScreen() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const today = new Date();
  const dateString = selectedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const isToday = selectedDate.toDateString() === today.toDateString();

  // Last 6 days for backfill
  const pastDays = [...Array(6)].map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (5 - i));
    return d;
  });

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow access to your camera.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleChoosePhoto = () => {
    Alert.alert('Add outfit photo', 'Choose how to add your photo', [
      { text: 'Take photo', onPress: takePhoto },
      { text: 'Choose from library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const uploadOutfit = async () => {
    if (!image) {
      Alert.alert('No photo', 'Please choose a photo first.');
      return;
    }
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Convert image to blob
      const response = await fetch(image);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      // Upload to Supabase Storage
      const dateStr = selectedDate.toISOString().split('T')[0];
      const filePath = `${user.id}/${dateStr}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('outfits')
        .upload(filePath, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('outfits')
        .getPublicUrl(filePath);

      // Save outfit record to database
      const isLate = !isToday;
      const { error: dbError } = await supabase
        .from('outfits')
        .upsert({
          user_id: user.id,
          photo_url: publicUrl,
          date: dateStr,
          is_late: isLate,
        });

      if (dbError) throw dbError;

      Alert.alert('Posted!', 'Your outfit has been saved.');
      setImage(null);
      setSelectedDate(new Date());

    } catch (error) {
      Alert.alert('Upload failed', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {isToday ? "today's fit" : 'past fit'}
          </Text>
          <Text style={styles.date}>{dateString}</Text>
        </View>

        {/* Camera / photo area */}
        <TouchableOpacity
          style={styles.cameraArea}
          activeOpacity={0.8}
          onPress={handleChoosePhoto}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <>
              <View style={styles.cameraIcon}>
                <Text style={styles.cameraIconText}>📷</Text>
              </View>
              <Text style={styles.cameraLabel}>tap to take or upload</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Backfill section */}
        <View style={styles.backfillSection}>
          <Text style={styles.backfillLabel}>fill in a past day</Text>
          <View style={styles.backfillRow}>
            {pastDays.map((day, i) => {
              const isSelected = day.toDateString() === selectedDate.toDateString();
              const isCurrentDay = day.toDateString() === today.toDateString();
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.backfillDay,
                    isSelected && styles.backfillSelected,
                    isCurrentDay && styles.backfillToday,
                  ]}
                  onPress={() => {
                    setSelectedDate(day);
                    setImage(null);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.backfillDayNum,
                    isSelected && styles.backfillDayNumSelected,
                  ]}>
                    {day.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Post button */}
        {image && (
          <TouchableOpacity
            style={styles.postBtn}
            onPress={uploadOutfit}
            activeOpacity={0.8}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.postBtnText}>
                {isToday ? 'post today\'s fit' : `post for ${dateString}`}
              </Text>
            )}
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0ed',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    letterSpacing: -0.3,
  },
  date: {
    fontSize: 12,
    color: '#bbb',
  },
  cameraArea: {
    margin: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e8e8e4',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    aspectRatio: 3 / 4,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  cameraIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f0ed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconText: {
    fontSize: 24,
  },
  cameraLabel: {
    fontSize: 13,
    color: '#ccc',
    marginTop: 8,
  },
  backfillSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backfillLabel: {
    fontSize: 11,
    color: '#bbb',
    marginBottom: 8,
  },
  backfillRow: {
    flexDirection: 'row',
    gap: 6,
  },
  backfillDay: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#f5f5f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backfillSelected: {
    backgroundColor: '#222',
  },
  backfillToday: {
    borderWidth: 1.5,
    borderColor: '#222',
    backgroundColor: 'transparent',
  },
  backfillDayNum: {
    fontSize: 11,
    color: '#bbb',
  },
  backfillDayNumSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  postBtn: {
    marginHorizontal: 16,
    marginBottom: 30,
    backgroundColor: '#222',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  postBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
});