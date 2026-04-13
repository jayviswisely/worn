import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PostScreen() {
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  const handlePost = () => {
    Alert.alert('Coming soon', 'Camera will open here!');
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>today's fit</Text>
        <Text style={styles.date}>{dateString}</Text>
      </View>

      {/* Camera area */}
      <TouchableOpacity 
        style={styles.cameraArea} 
        activeOpacity={0.8}
        onPress={handlePost}
      >
        <View style={styles.cameraIcon}>
          <Text style={styles.cameraIconText}>📷</Text>
        </View>
        <Text style={styles.cameraLabel}>tap to take or upload</Text>
      </TouchableOpacity>

      {/* Backfill section */}
      <View style={styles.backfillSection}>
        <Text style={styles.backfillLabel}>fill in a past day</Text>
        <View style={styles.backfillRow}>
          {[...Array(6)].map((_, i) => {
            const day = new Date();
            day.setDate(today.getDate() - (5 - i));
            const filled = i !== 2 && i !== 4;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.backfillDay, filled && styles.backfillFilled]}
                activeOpacity={0.7}
              >
                {!filled && (
                  <Text style={styles.backfillDayNum}>{day.getDate()}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Progress card */}
      <View style={styles.progressCard}>
        <View>
          <Text style={styles.progressTitle}>this month so far</Text>
          <Text style={styles.progressSub}>28 of 30 days logged</Text>
        </View>
        <Text style={styles.progressPercent}>93%</Text>
      </View>

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
    gap: 10,
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
  },
  backfillSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
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
    borderWidth: 1,
    borderColor: '#e8e8e4',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backfillFilled: {
    backgroundColor: '#e8e8e4',
    borderWidth: 0,
    borderStyle: 'solid',
  },
  backfillDayNum: {
    fontSize: 10,
    color: '#bbb',
  },
  progressCard: {
    marginHorizontal: 16,
    backgroundColor: '#f5f5f2',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  progressSub: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 2,
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});