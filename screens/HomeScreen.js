import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_FRIENDS = [
  { id: '1', name: 'sarah', initial: 'sa', date: 'Mon 30', late: false, color: '#e4e0db' },
  { id: '2', name: 'nura', initial: 'nu', date: 'Sun 29', late: true, color: '#dde0e4' },
  { id: '3', name: 'hana', initial: 'ha', date: 'Mon 30', late: false, color: '#e0e4dd' },
];

export default function HomeScreen({ navigation }) {
  const hasPostedToday = false;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>worn</Text>
        </View>

        {/* Your outfit prompt */}
        {hasPostedToday ? (
          <View style={styles.postedCard}>
            <View style={styles.postedThumb} />
            <View style={styles.postedInfo}>
              <Text style={styles.postedName}>you · today</Text>
              <Text style={styles.postedSub}>posted</Text>
            </View>
            <View style={styles.doneBadge}>
              <Text style={styles.doneText}>✓ done</Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.promptCard} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Post')}
          >
            <View style={styles.promptIcon}>
              <Text style={styles.promptIconText}>+</Text>
            </View>
            <View style={styles.promptInfo}>
              <Text style={styles.promptTitle}>what are you wearing today?</Text>
              <Text style={styles.promptSub}>tap to post your fit</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Friends label */}
        <Text style={styles.sectionLabel}>friends today</Text>

        {/* Friends feed */}
        {MOCK_FRIENDS.map((friend) => (
          <View key={friend.id} style={styles.feedItem}>
            <View style={styles.feedHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{friend.initial}</Text>
              </View>
              <View>
                <Text style={styles.friendName}>{friend.name}</Text>
                <Text style={styles.friendSub}>
                  {friend.late ? 'today · late post' : 'today'}
                </Text>
              </View>
            </View>

            {/* Outfit photo placeholder */}
            <View style={[styles.outfitPhoto, { backgroundColor: friend.color }]}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateBadgeText}>{friend.date}</Text>
              </View>
              {friend.late && (
                <View style={styles.lateBadge}>
                  <Text style={styles.lateBadgeText}>late</Text>
                </View>
              )}
            </View>
          </View>
        ))}

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
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0ed',
  },
  logo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
    letterSpacing: -0.5,
  },
  promptCard: {
    margin: 14,
    borderWidth: 1,
    borderColor: '#e8e8e4',
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fafafa',
  },
  promptIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#f0f0ed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptIconText: {
    fontSize: 22,
    color: '#ccc',
    fontWeight: '300',
  },
  promptInfo: {
    flex: 1,
  },
  promptTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  promptSub: {
    fontSize: 11,
    color: '#bbb',
    marginTop: 2,
  },
  postedCard: {
    margin: 14,
    borderWidth: 0.5,
    borderColor: '#e8e8e4',
    borderRadius: 14,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fafafa',
  },
  postedThumb: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#e4e4e0',
  },
  postedInfo: {
    flex: 1,
  },
  postedName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#222',
  },
  postedSub: {
    fontSize: 10,
    color: '#bbb',
    marginTop: 1,
  },
  doneBadge: {
    backgroundColor: '#f0f0ed',
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  doneText: {
    fontSize: 10,
    color: '#888',
  },
  sectionLabel: {
    fontSize: 11,
    color: '#bbb',
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  feedItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5f5f2',
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    paddingHorizontal: 14,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e8e8e4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
  friendName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#222',
  },
  friendSub: {
    fontSize: 10,
    color: '#bbb',
  },
  outfitPhoto: {
    width: '100%',
    aspectRatio: 3 / 4,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  dateBadge: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dateBadgeText: {
    fontSize: 10,
    color: '#555',
  },
  lateBadge: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    backgroundColor: 'rgba(240,240,237,0.9)',
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  lateBadgeText: {
    fontSize: 10,
    color: '#aaa',
  },
});