import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function MeScreen() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDate = today.getDate();

  const monthName = today.toLocaleDateString('en-US', { month: 'long' });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Mock data — which days have outfits logged
  const loggedDays = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,
                      16,17,18,19,20,21,22,23,24,25,27,29];
  const missedDays = [26, 28];

  const totalDays = todayDate;
  const loggedCount = loggedDays.filter(d => d <= todayDate).length;
  const missedCount = missedDays.filter(d => d <= todayDate).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.monthTitle}>{monthName.toLowerCase()}</Text>
          <TouchableOpacity style={styles.shareBtn}>
            <Text style={styles.shareBtnText}>share</Text>
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <Text style={styles.statText}>{loggedCount} outfits logged</Text>
          <Text style={styles.statDot}>·</Text>
          <Text style={styles.statText}>{missedCount} gaps</Text>
        </View>

        {/* Day of week headers */}
        <View style={styles.dayHeaders}>
          {DAYS_OF_WEEK.map((d, i) => (
            <Text key={i} style={styles.dayHeader}>{d}</Text>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.calGrid}>
          {/* Empty cells before first day */}
          {[...Array(firstDay)].map((_, i) => (
            <View key={`empty-${i}`} style={styles.dayEmpty} />
          ))}

          {/* Day cells */}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const isToday = day === todayDate;
            const isLogged = loggedDays.includes(day);
            const isMissed = missedDays.includes(day);
            const isFuture = day > todayDate;

            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayCell,
                  isLogged && styles.dayCellLogged,
                  isMissed && styles.dayCellMissed,
                  isFuture && styles.dayCellFuture,
                  isToday && styles.dayCellToday,
                ]}
                activeOpacity={isLogged ? 0.7 : 1}
              >
                <Text style={[
                  styles.dayNum,
                  isToday && styles.dayNumToday,
                  isLogged && styles.dayNumLogged,
                ]}>
                  {day}
                </Text>
                {isMissed && <View style={styles.missedDot} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Fill in gaps nudge */}
        {missedCount > 0 && (
          <TouchableOpacity style={styles.nudgeCard} activeOpacity={0.7}>
            <Text style={styles.nudgeText}>
              {missedCount} gap{missedCount > 1 ? 's' : ''} — want to fill them in?
            </Text>
            <Text style={styles.nudgeAction}>fill in →</Text>
          </TouchableOpacity>
        )}

        {/* Past months */}
        <Text style={styles.sectionLabel}>past months</Text>
        <View style={styles.archiveRow}>
          {['february', 'january', 'december'].map((m, i) => (
            <TouchableOpacity key={i} style={styles.archiveCard} activeOpacity={0.7}>
              <Text style={styles.archiveMonth}>{m}</Text>
              <Text style={styles.archiveCount}>{28 - i * 3} outfits</Text>
              <View style={styles.archiveMiniGrid}>
                {[...Array(28)].map((_, j) => (
                  <View
                    key={j}
                    style={[
                      styles.archiveDot,
                      j % 5 !== 0 && styles.archiveDotFilled,
                    ]}
                  />
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

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
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0ed',
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
    letterSpacing: -0.5,
  },
  shareBtn: {
    backgroundColor: '#f0f0ed',
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  shareBtnText: {
    fontSize: 12,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  statText: {
    fontSize: 11,
    color: '#bbb',
  },
  statDot: {
    fontSize: 11,
    color: '#ddd',
  },
  dayHeaders: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    color: '#ccc',
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 3,
  },
  dayCell: {
    width: '13%',
    aspectRatio: 1,
    borderRadius: 6,
    backgroundColor: '#f5f5f2',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dayCellLogged: {
    backgroundColor: '#e8e8e4',
  },
  dayCellMissed: {
    backgroundColor: '#f9f9f7',
  },
  dayCellFuture: {
    backgroundColor: 'transparent',
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: '#555',
    backgroundColor: 'transparent',
  },
  dayNum: {
    fontSize: 9,
    color: '#bbb',
  },
  dayNumLogged: {
    color: '#888',
  },
  dayNumToday: {
    color: '#333',
    fontWeight: '600',
  },
  missedDot: {
    position: 'absolute',
    bottom: 3,
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#ccc',
  },
  dayEmpty: {
    width: '13%',
    aspectRatio: 1,
  },
  nudgeCard: {
    marginHorizontal: 14,
    marginTop: 14,
    backgroundColor: '#f5f5f2',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nudgeText: {
    fontSize: 12,
    color: '#888',
  },
  nudgeAction: {
    fontSize: 12,
    color: '#444',
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 11,
    color: '#bbb',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  archiveRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 30,
  },
  archiveCard: {
    flex: 1,
    backgroundColor: '#f5f5f2',
    borderRadius: 12,
    padding: 10,
  },
  archiveMonth: {
    fontSize: 10,
    fontWeight: '500',
    color: '#333',
  },
  archiveCount: {
    fontSize: 9,
    color: '#bbb',
    marginTop: 2,
    marginBottom: 6,
  },
  archiveMiniGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1.5,
  },
  archiveDot: {
    width: 5,
    height: 5,
    borderRadius: 1,
    backgroundColor: '#e0e0dc',
  },
  archiveDotFilled: {
    backgroundColor: '#c8c8c4',
  },
});