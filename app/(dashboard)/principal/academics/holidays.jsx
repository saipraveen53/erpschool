import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  FlatList, 
  useWindowDimensions, 
  Platform 
} from 'react-native';
import * as Icons from 'lucide-react-native';

// Heavy Static Data for Holidays and Academic Calendar Announcements
const mockHolidays = [
  { id: 'HOL-2026-01', title: 'Summer Vacation Break', type: 'Holiday', category: 'Gazetted', dateScope: '01 June 2026 - 30 June 2026', totalDays: 30, status: 'Upcoming', description: 'Official summer break for all students and teaching faculty.' },
  { id: 'HOL-2026-02', title: 'Id-ul-Zuha (Bakrid)', type: 'Holiday', category: 'Gazetted', dateScope: '27 June 2026', totalDays: 1, status: 'Upcoming', description: 'Declared declaration under state holiday list.' },
    { id: 'HOL-2026-06', title: 'Diwali', type: 'Holiday', category: 'Gazetted', dateScope: '28 November 2026', totalDays: 2, status: 'Upcoming', description: 'Festival of Lights celebration Government holiday .' },
  { id: 'EVT-2026-01', title: 'First Term Mid-Board Examinations', type: 'Academic Event', category: 'Academic', dateScope: '14 July 2026 - 25 July 2026', totalDays: 12, status: 'Scheduled', description: 'Centralized assessments for Grades 6 to 12.' },
  { id: 'HOL-2026-03', title: 'Muharram Climax Leave', type: 'Holiday', category: 'Restricted', dateScope: '26 July 2026', totalDays: 1, status: 'Scheduled', description: 'Optional restricted holiday for administrative staff.' },
  { id: 'EVT-2026-02', title: 'Annual Parent-Teacher Conference (PTM)', type: 'Academic Event', category: 'Academic', dateScope: '08 August 2026', totalDays: 1, status: 'Scheduled', description: 'Mandatory performance discussion tracking and sheet sign-offs.' },
  { id: 'HOL-2026-04', title: 'Independence Day Celebrations', type: 'Academic Event', category: 'Academic', dateScope: '15 August 2026', totalDays: 1, status: 'Scheduled', description: 'Flag hoisting attendance mandatory for all staff and students.' },
  { id: 'HOL-2026-05', title: 'Raksha Bandhan Break', type: 'Holiday', category: 'Gazetted', dateScope: '28 August 2026', totalDays: 1, status: 'Scheduled', description: 'Institution wide closure declaration.' },
];

export default function HolidaysAndCalendar() {
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const isLargeScreen = width >= 768;

  const filteredData = mockHolidays.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'All' ? true : item.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const getCategoryTheme = (category) => {
    switch(category) {
      case 'Gazetted': 
        return { bg: '#dcfce7', text: '#16a34a', icon: 'CalendarDays' };
      case 'Restricted': 
        return { bg: '#fef3c7', text: '#F4A460', icon: 'Clock' };
      case 'Academic': 
        return { bg: '#A0522D15', text: '#A0522D', icon: 'GraduationCap' };
      default: 
        return { bg: '#f5ebe0', text: '#8c7664', icon: 'Bookmark' };
    }
  };

  const renderItem = ({ item }) => {
    const theme = getCategoryTheme(item.category);

    if (isLargeScreen) {
      return (
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.cellCategory]}>
            <View style={[styles.typeBadge, { backgroundColor: theme.bg }]}>
              <Text style={[styles.typeBadgeText, { color: theme.text }]}>{item.category}</Text>
            </View>
          </View>
          <View style={[styles.tableCell, styles.cellTitleBlock]}>
            <Text style={styles.itemTitleText}>{item.title}</Text>
            <Text style={styles.itemDescriptionText}>{item.description}</Text>
          </View>
          <Text style={[styles.tableCell, styles.cellDateScope]}>{item.dateScope}</Text>
          <Text style={[styles.tableCell, styles.cellDuration]}>{item.totalDays} {item.totalDays > 1 ? 'Days' : 'Day'}</Text>
          <View style={[styles.tableCell, styles.cellStatus]}>
            <Text style={[styles.statusMarker, item.status === 'Upcoming' ? styles.statusUpcoming : styles.statusScheduled]}>
              • {item.status}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.mobileCard}>
        <View style={styles.cardTopRow}>
          <View style={[styles.typeBadge, { backgroundColor: theme.bg }]}>
            <Text style={[styles.typeBadgeText, { color: theme.text }]}>{item.category}</Text>
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationBadgeText}>{item.totalDays}d</Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.dateMetaRow}>
            <Icons.Calendar size={14} color="#8c7664" />
            <Text style={styles.dateMetaText}>{item.dateScope}</Text>
          </View>
          <Text style={[styles.statusMarker, item.status === 'Upcoming' ? styles.statusUpcoming : styles.statusScheduled]}>
            {item.status}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <View>
          <Text style={styles.mainTitle}>Holidays & Academic Calendar</Text>
          <Text style={styles.mainSubtitle}>Configure terms, track scheduled institutional events, and deploy vacation announcements.</Text>
        </View>
        <Icons.Calendar size={45} color="#A0522D" opacity={0.3} />
      </View>

      {/* Controls Toolbar */}
      <View style={[styles.controlsRow, { flexDirection: isLargeScreen ? 'row' : 'column', alignItems: isLargeScreen ? 'center' : 'stretch' }]}>
        <View style={styles.searchBarContainer}>
          <Icons.Search color="#8c7664" size={18} style={styles.searchIconPadding} />
          <TextInput
            style={styles.searchBarInput}
            placeholder="Search calendar by title, description or ID..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#a89a8c"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icons.X size={16} color="#8c7664" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.actionBtnPrimary}>
          <Icons.CalendarPlus color="#ffffff" size={18} />
          <Text style={styles.actionBtnPrimaryText}>Add Event / Holiday</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainerBorder}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContentArea}>
          {['All', 'Gazetted', 'Restricted', 'Academic'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabFilterChip, isActive && styles.tabFilterChipActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabFilterChipText, isActive && styles.tabFilterChipTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Desktop Table Header */}
      {isLargeScreen && (
        <View style={styles.desktopTableHeaderGrid}>
          <Text style={[styles.tableHeaderCell, styles.cellCategory]}>Category</Text>
          <Text style={[styles.tableHeaderCell, styles.cellTitleBlock]}>Event & Description</Text>
          <Text style={[styles.tableHeaderCell, styles.cellDateScope]}>Date Range</Text>
          <Text style={[styles.tableHeaderCell, styles.cellDuration]}>Duration</Text>
          <Text style={[styles.tableHeaderCell, styles.cellStatus]}>Status</Text>
        </View>
      )}

      {/* FlatList */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainerPaddingOffset}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBoxFallback}>
            <Icons.CalendarX color="#d6c5b5" size={50} />
            <Text style={styles.emptyBoxFallbackText}>No matching holidays or events found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {  flex: 1, backgroundColor: '#F5F5DC', padding: 16,  },
 headerWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',  marginBottom: 20, },
  mainTitle: {  fontSize: 24,  fontWeight: '700',  color: '#A0522D', },
  mainSubtitle: {fontSize: 13,color: '#8c7664',  marginTop: 4,  lineHeight: 18,},
  /* Controls */
  controlsRow: { gap: 12, marginBottom: 16,  },
  searchBarContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff',  borderWidth: 1,  borderColor: '#eaddcc',  borderRadius: 12,  paddingHorizontal: 12,  height: 44, },
  searchIconPadding: {   marginRight: 8, },
  searchBarInput: {
    flex: 1,
    fontSize: 14,
    color: '#1e1b18',
  },
  actionBtnPrimary: {
    backgroundColor: '#A0522D',
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnPrimaryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  /* Tabs */
  tabsContainerBorder: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eaddcc',
  },
  tabsScrollContentArea: {
    gap: 8,
    paddingBottom: 10,
  },
  tabFilterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#A0522D',
  },
  tabFilterChipActive: {
    backgroundColor: '#A0522D',
  },
  tabFilterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A0522D',
  },
  tabFilterChipTextActive: {
    color: '#ffffff',
  },

  /* Desktop Table */
  desktopTableHeaderGrid: {
    flexDirection: 'row',
    backgroundColor: '#f5ebe0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderColor: '#eaddcc',
    alignItems: 'center',
  },
  tableHeaderCell: {
    fontSize: 13,
    fontWeight: '700',
    color: '#A0522D',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaddcc',
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 13,
    color: '#4a3e3d',
  },
  cellCategory: {
    flex: 0.8,
  },
  cellTitleBlock: {
    flex: 2.2,
    paddingRight: 12,
  },
  cellDateScope: {
    flex: 1.5,
  },
  cellDuration: {
    flex: 0.6,
  },
  cellStatus: {
    flex: 0.6,
  },
  itemTitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e1b18',
  },
  itemDescriptionText: {
    fontSize: 12,
    color: '#8c7664',
    marginTop: 3,
    lineHeight: 16,
  },

  /* Mobile Cards */
  listContainerPaddingOffset: {
    paddingBottom: 32,
  },
  mobileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eaddcc',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  durationBadge: {
    backgroundColor: '#f5ebe0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A0522D',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e1b18',
  },
  cardDesc: {
    fontSize: 13,
    color: '#8c7664',
    marginTop: 6,
    lineHeight: 18,
  },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f5ebe0',},
  dateMetaRow: {  flexDirection: 'row',  alignItems: 'center',  gap: 6,},
  dateMetaText: {  fontSize: 12,  fontWeight: '500',  color: '#8c7664',},
  /* Badges */
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start'},
  typeBadgeText: { fontSize: 11, fontWeight: '700',},
  statusMarker: { fontSize: 12, fontWeight: '600',},
  statusUpcoming: {color: '#A0522D',},
  statusScheduled: {  color: '#8c7664',},
  /* Empty State */
  emptyBoxFallback: {  alignItems: 'center',  justifyContent: 'center',  padding: 48,  gap: 12,
  },
  emptyBoxFallbackText: {  color: '#a89a8c', fontSize: 14, textAlign: 'center', lineHeight: 20,
  },
});