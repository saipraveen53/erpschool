import React, { useState, useEffect } from 'react';
import { rootApi } from '../../../utils/axiosInstance';
import {
  StyleSheet, View, Text, TextInput, ScrollView,
  TouchableOpacity, FlatList, Modal, Alert,
  ActivityIndicator, useWindowDimensions, Platform
} from 'react-native';
import * as Icons from 'lucide-react-native';

const NOTICE_TYPES = ['GENERAL', 'ACADEMIC', 'EXAM', 'EVENT', 'EMERGENCY'];

const emptyForm = {
  noticeName: '',
  noticeDescription: '',
  noticeType: 'GENERAL',
  noticeDate: new Date().toISOString().split('T')[0],
};

export default function CommunicationCenter() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('ALL');

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ─── Fetch all notices ─────────────────────────────────────────────
  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await rootApi.get('/api/student/notice/all');
      setNotices(res.data);
    } catch (error) {
      Alert.alert('Error', 'Could not load notices.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Create notice ─────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!form.noticeName.trim() || !form.noticeDescription.trim()) {
      Alert.alert('Validation', 'Notice name and description are required.');
      return;
    }
    setSaving(true);
    try {
      await rootApi.post('/api/student/notice/create', form);
      Alert.alert('Success', 'Notice created successfully!');
      closeModal();
      fetchNotices();
    } catch (error) {
      const msg = error.response?.data?.message || 'Could not create notice.';
      Alert.alert('Error', typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setSaving(false);
    }
  };

  // ─── Update notice ─────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!form.noticeName.trim() || !form.noticeDescription.trim()) {
      Alert.alert('Validation', 'Notice name and description are required.');
      return;
    }
    setSaving(true);
    try {
      await rootApi.put(`/api/student/notice/update/${selectedId}`, { id: selectedId, ...form });
      Alert.alert('Success', 'Notice updated successfully!');
      closeModal();
      fetchNotices();
    } catch (error) {
      const msg = error.response?.data?.message || 'Could not update notice.';
      Alert.alert('Error', typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete notice ─────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await rootApi.delete(`/api/student/notice/delete/${selectedId}`);
      Alert.alert('Success', 'Notice deleted.');
      setDeleteModalVisible(false);
      setSelectedId(null);
      fetchNotices();
    } catch (error) {
      Alert.alert('Error', 'Could not delete notice.');
    } finally {
      setDeleting(false);
    }
  };

  // ─── Modal helpers ─────────────────────────────────────────────────
  const openCreateModal = () => {
    setIsEditing(false);
    setForm(emptyForm);
    setSelectedId(null);
    setModalVisible(true);
  };

  const openEditModal = (item) => {
    setIsEditing(true);
    setSelectedId(item.id);
    setForm({
      noticeName: item.noticeName,
      noticeDescription: item.noticeDescription,
      noticeType: item.noticeType,
      noticeDate: item.noticeDate,
    });
    setModalVisible(true);
  };

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setDeleteModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setForm(emptyForm);
    setSelectedId(null);
  };

  // ─── Filter logic ──────────────────────────────────────────────────
  const filteredData = notices.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      item.noticeName?.toLowerCase().includes(q) ||
      item.noticeDescription?.toLowerCase().includes(q) ||
      item.id?.toLowerCase().includes(q);
    const matchType = activeType === 'ALL' || item.noticeType === activeType;
    return matchSearch && matchType;
  });

  // ─── Badge color by type ───────────────────────────────────────────
  const getBadgeColors = (type) => {
    switch (type) {
      case 'GENERAL':    return { bg: '#eaddcc', text: '#A0522D' };
      case 'ACADEMIC':   return { bg: '#e8f4fd', text: '#1d6fa4' };
      case 'EXAM':       return { bg: '#fff2e6', text: '#F4A460' };
      case 'EVENT':      return { bg: '#e8fdf0', text: '#16a34a' };
      case 'EMERGENCY':  return { bg: '#ffebee', text: '#E35336' };
      default:           return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  // ─── Render desktop row ────────────────────────────────────────────
  const renderDesktopRow = ({ item, index }) => {
    const badge = getBadgeColors(item.noticeType);
    return (
      <View style={[styles.tableRow, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
        <Text style={[styles.cell, styles.cellId]} numberOfLines={1}>{item.id}</Text>
        <View style={styles.cellTitle}>
          <Text style={styles.titleText} numberOfLines={1}>{item.noticeName}</Text>
          <Text style={styles.descText} numberOfLines={1}>{item.noticeDescription}</Text>
        </View>
        <View style={styles.cellBadge}>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>{item.noticeType}</Text>
          </View>
        </View>
        <Text style={[styles.cell, styles.cellDate]}>{item.noticeDate}</Text>
        <View style={styles.cellActions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => openEditModal(item)}>
            <Icons.Pencil size={14} color="#A0522D" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => openDeleteModal(item.id)}>
            <Icons.Trash2 size={14} color="#E35336" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ─── Render mobile card ────────────────────────────────────────────
  const renderMobileCard = ({ item }) => {
    const badge = getBadgeColors(item.noticeType);
    return (
      <View style={styles.mobileCard}>
        <View style={styles.cardTop}>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>{item.noticeType}</Text>
          </View>
          <Text style={styles.cardDate}>{item.noticeDate}</Text>
        </View>
        <Text style={styles.cardTitle}>{item.noticeName}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.noticeDescription}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardId}>{item.id}</Text>
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.editBtn} onPress={() => openEditModal(item)}>
              <Icons.Pencil size={14} color="#A0522D" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => openDeleteModal(item.id)}>
              <Icons.Trash2 size={14} color="#E35336" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderItem = (props) =>
    isLargeScreen ? renderDesktopRow(props) : renderMobileCard(props);

  const allTypes = ['ALL', ...NOTICE_TYPES];

  return (
    <View style={styles.container}>

      {/* ── Header ── */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.mainTitle}>Communication Hub</Text>
          <Text style={styles.subTitle}>Manage campus notices and announcements</Text>
        </View>
        <TouchableOpacity style={styles.createBtn} onPress={openCreateModal}>
          <Icons.PlusCircle size={16} color="#fff" />
          <Text style={styles.createBtnText}>New Notice</Text>
        </TouchableOpacity>
      </View>

      {/* ── Search ── */}
      <View style={styles.searchBox}>
        <Icons.Search size={16} color="#a07850" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by ID, name, description..."
          placeholderTextColor="#b0967a"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icons.X size={16} color="#a07850" />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Type Filter Tabs ── */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {allTypes.map(type => {
            const isActive = activeType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveType(type)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{type}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Desktop Table Header ── */}
      {isLargeScreen && !loading && (
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.cellId]}>ID</Text>
          <Text style={[styles.headerCell, styles.cellTitle]}>Name & Description</Text>
          <Text style={[styles.headerCell, styles.cellBadge]}>Type</Text>
          <Text style={[styles.headerCell, styles.cellDate]}>Date</Text>
          <Text style={[styles.headerCell, styles.cellActions]}>Actions</Text>
        </View>
      )}

      {/* ── List ── */}
      {loading ? (
        <ActivityIndicator size="large" color="#A0522D" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Icons.MegaphoneOff size={40} color="#A0522D" />
              <Text style={styles.emptyText}>No notices found.</Text>
            </View>
          }
        />
      )}

      {/* ══════════════════════════════════════════
          CREATE / EDIT MODAL
      ══════════════════════════════════════════ */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>

            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{isEditing ? 'Edit Notice' : 'Create Notice'}</Text>
              <TouchableOpacity onPress={closeModal}>
                <Icons.X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Notice Name */}
              <Text style={styles.label}>Notice Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter notice name"
                placeholderTextColor="#b0967a"
                value={form.noticeName}
                onChangeText={v => setForm(f => ({ ...f, noticeName: v }))}
              />

              {/* Description */}
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter description"
                placeholderTextColor="#b0967a"
                value={form.noticeDescription}
                onChangeText={v => setForm(f => ({ ...f, noticeDescription: v }))}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {/* Notice Type */}
              <Text style={styles.label}>Notice Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
                {NOTICE_TYPES.map(type => {
                  const colors = getBadgeColors(type);
                  const selected = form.noticeType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeChip,
                        { borderColor: colors.text },
                        selected && { backgroundColor: colors.bg }
                      ]}
                      onPress={() => setForm(f => ({ ...f, noticeType: type }))}
                    >
                      <Text style={[styles.typeChipText, { color: colors.text }]}>{type}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Date */}
              <Text style={styles.label}>Notice Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#b0967a"
                value={form.noticeDate}
                onChangeText={v => setForm(f => ({ ...f, noticeDate: v }))}
              />

              {/* Submit */}
              <TouchableOpacity
                style={[styles.submitBtn, saving && { opacity: 0.7 }]}
                onPress={isEditing ? handleUpdate : handleCreate}
                disabled={saving}
              >
                {saving
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.submitBtnText}>{isEditing ? 'Save Changes' : 'Create Notice'}</Text>
                }
              </TouchableOpacity>
            </ScrollView>

          </View>
        </View>
      </Modal>

      {/* ══════════════════════════════════════════
          DELETE CONFIRM MODAL
      ══════════════════════════════════════════ */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.modalCard, { alignItems: 'center' }]}>
            <View style={styles.deleteIconBox}>
              <Icons.Trash2 size={32} color="#E35336" />
            </View>
            <Text style={styles.deleteTitle}>Delete Notice?</Text>
            <Text style={styles.deleteSubtitle}>This action cannot be undone.</Text>
            <View style={styles.deleteActions}>
              <TouchableOpacity
                style={styles.cancelDeleteBtn}
                onPress={() => { setDeleteModalVisible(false); setSelectedId(null); }}
                disabled={deleting}
              >
                <Text style={styles.cancelDeleteText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmDeleteBtn, deleting && { opacity: 0.7 }]}
                onPress={handleDelete}
                disabled={deleting}
              >
                {deleting
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.confirmDeleteText}>Delete</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5DC' },

  // ── Header
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  mainTitle: { fontSize: 22, fontWeight: '800', color: '#A0522D' },
  subTitle: { fontSize: 12, color: '#8c7664', marginTop: 2 },
  createBtn: { backgroundColor: '#A0522D', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  createBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // ── Search
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 14, borderWidth: 1, borderColor: '#eaddcc', gap: 8 },
  searchInput: { flex: 1, fontSize: 13, color: '#2e2520' },

  // ── Tabs
  tabsWrapper: { marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#eaddcc' },
  tabsScroll: { gap: 8, paddingBottom: 10 },
  tab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 6, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eaddcc' },
  tabActive: { backgroundColor: '#fff2e6', borderColor: '#F4A460' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#8c7664' },
  tabTextActive: { color: '#A0522D', fontWeight: '700' },

  // ── Desktop Table Header
  tableHeader: { flexDirection: 'row', backgroundColor: '#A0522D', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginBottom: 4 },
  headerCell: { color: '#fff', fontWeight: '700', fontSize: 11 },

  // ── Desktop Row
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 6, marginBottom: 3 },
  rowEven: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eaddcc' },
  rowOdd: { backgroundColor: '#faf6f0', borderWidth: 1, borderColor: '#eaddcc' },
  cell: { fontSize: 12, color: '#555' },
  cellId: { width: 100, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontSize: 11 },
  cellTitle: { flex: 1, paddingRight: 8 },
  cellBadge: { width: 100, alignItems: 'flex-start' },
  cellDate: { width: 100, fontSize: 12, color: '#555' },
  cellActions: { width: 72, flexDirection: 'row', gap: 6, justifyContent: 'flex-end' },
  titleText: { fontSize: 13, fontWeight: '700', color: '#2e2520' },
  descText: { fontSize: 11, color: '#8c7664', marginTop: 1 },

  // ── Mobile Card
  mobileCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#eaddcc' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardDate: { fontSize: 11, color: '#8c7664' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#2e2520', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#8c7664', lineHeight: 18 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f5ebe0' },
  cardId: { fontSize: 11, color: '#bc9e82', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  cardActions: { flexDirection: 'row', gap: 8 },

  // ── Shared Action Buttons
  editBtn: { backgroundColor: '#fff2e6', padding: 7, borderRadius: 6, borderWidth: 1, borderColor: '#F4A460' },
  deleteBtn: { backgroundColor: '#ffebee', padding: 7, borderRadius: 6, borderWidth: 1, borderColor: '#E35336' },

  // ── Badge
  badge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start' },
  badgeText: { fontSize: 10, fontWeight: '700' },

  // ── List
  listContent: { paddingBottom: 32 },

  // ── Empty
  emptyBox: { alignItems: 'center', paddingTop: 48, gap: 12 },
  emptyText: { fontSize: 14, color: '#8c7664', fontWeight: '500' },

  // ── Modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { backgroundColor: '#fff', borderRadius: 14, padding: 20, width: '100%', maxWidth: 480 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#A0522D' },

  // ── Form
  label: { fontSize: 12, fontWeight: '700', color: '#A0522D', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#faf6f0', borderWidth: 1, borderColor: '#eaddcc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#2e2520' },
  textArea: { height: 90, paddingTop: 10 },
  typeScroll: { marginBottom: 4 },
  typeChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, marginRight: 8, backgroundColor: 'transparent' },
  typeChipText: { fontSize: 11, fontWeight: '700' },
  submitBtn: { backgroundColor: '#A0522D', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 20, marginBottom: 8 },
  submitBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  // ── Delete Modal
  deleteIconBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#ffebee', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  deleteTitle: { fontSize: 18, fontWeight: '800', color: '#2e2520', marginBottom: 4 },
  deleteSubtitle: { fontSize: 13, color: '#8c7664', marginBottom: 20 },
  deleteActions: { flexDirection: 'row', gap: 12, width: '100%' },
  cancelDeleteBtn: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eaddcc', alignItems: 'center' },
  cancelDeleteText: { fontWeight: '700', color: '#555' },
  confirmDeleteBtn: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#E35336', alignItems: 'center' },
  confirmDeleteText: { color: '#fff', fontWeight: '700' },
});