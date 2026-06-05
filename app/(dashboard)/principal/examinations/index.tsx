import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  ActivityIndicator, Modal, TextInput, ScrollView,
  useWindowDimensions, Alert, RefreshControl, Platform
} from 'react-native';
import {
  Plus, X, BookOpen, Calendar, Clock, Users, CheckCircle,
  Save, FileText, ChevronDown, ChevronUp, Eye, Filter,
  Search, Award, TrendingUp, BarChart3, Book, AlertCircle,
  ChevronRight, GraduationCap, Printer, Download, User
} from 'lucide-react-native';
import { rootApi } from '../../../utils/axiosInstance';

const COLORS = {
  brand: '#A0522D',
  brandLight: '#fdf0e6',
  brandMid: '#e8d5c4',
  green: '#16a34a',
  greenLight: '#dcfce7',
  blue: '#2563eb',
  blueLight: '#eff6ff',
  amber: '#d97706',
  amberLight: '#fffbeb',
  red: '#dc2626',
  redLight: '#fef2f2',
  purple: '#7c3aed',
  purpleLight: '#f5f3ff',
  bg: '#FDF8F0',
  surface: '#ffffff',
  border: '#f0e6dc',
  borderMid: '#eaddcc',
  text: '#1c1410',
  textMid: '#5c4a3a',
  textLight: '#8c7664',
  textFaint: '#b0a090',
};

const STATUS_CONFIG = {
  CREATED: { bg: COLORS.blueLight, text: COLORS.blue, label: 'Created' },
  ONGOING: { bg: COLORS.amberLight, text: COLORS.amber, label: 'Ongoing' },
  COMPLETED: { bg: COLORS.greenLight, text: COLORS.green, label: 'Completed' },
  PUBLISHED: { bg: COLORS.purpleLight, text: COLORS.purple, label: 'Published' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.CREATED;
  return (
    <View style={[s.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[s.badgeText, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

function EmptyState({ icon: Icon, title, body }) {
  return (
    <View style={s.emptyState}>
      <Icon size={48} color={COLORS.borderMid} />
      <Text style={s.emptyTitle}>{title}</Text>
      {body ? <Text style={s.emptyBody}>{body}</Text> : null}
    </View>
  );
}

function ModalShell({ visible, onClose, title, icon: Icon, iconColor, children, width }) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={[s.sheet, width ? { width } : {}]}>
          <View style={s.sheetHeader}>
            <View style={s.sheetTitleRow}>
              <View style={[s.sheetIconBox, { backgroundColor: iconColor + '18' }]}>
                <Icon size={20} color={iconColor} />
              </View>
              <Text style={s.sheetTitle}>{title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={s.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

function ModalButtons({ onCancel, onSubmit, submitLabel, submitting, submitColor }) {
  return (
    <View style={s.modalBtns}>
      <TouchableOpacity style={s.cancelBtn} onPress={onCancel}>
        <Text style={s.cancelBtnText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[s.submitBtn, { backgroundColor: submitColor || COLORS.brand }]}
        onPress={onSubmit}
        disabled={submitting}
      >
        {submitting
          ? <ActivityIndicator size="small" color="#fff" />
          : <Text style={s.submitBtnText}>{submitLabel}</Text>
        }
      </TouchableOpacity>
    </View>
  );
}

export default function ExamManagement() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const modalW = isMobile ? '94%' : 560;

  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selectedExam, setSelectedExam] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCreateExam, setShowCreateExam] = useState(false);

  const [examForm, setExamForm] = useState({
    examName: '',
    academicYear: new Date().getFullYear().toString(),
    startDate: '',
    endDate: ''
  });

  const fetchExams = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const res = await rootApi.get('/api/all-exams');
      setExams(res.data);
    } catch {
      Alert.alert('Error', 'Failed to fetch exams');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const fetchSubjects = useCallback(async () => {
    try {
      const r = await rootApi.get('/api/student/subject/allSubjects');
      setSubjects(r.data);
    } catch { }
  }, []);

  const fetchClasses = useCallback(async () => {
    try {
      const r = await rootApi.get('/api/student/class-sections');
      setClasses(r.data);
    } catch { }
  }, []);

  const fetchTeachers = useCallback(async () => {
    try {
      const r = await rootApi.get('/api/student/teacher/all');
      setTeachers(r.data);
    } catch { }
  }, []);

  useEffect(() => {
    fetchExams();
    fetchSubjects();
    fetchClasses();
    fetchTeachers();
  }, []);

  const createExam = async () => {
    const { examName, academicYear, startDate, endDate } = examForm;
    if (!examName.trim() || !academicYear.trim() || !startDate || !endDate) {
      return Alert.alert('Validation', 'Please fill all required fields');
    }
    if (new Date(startDate) > new Date(endDate)) {
      return Alert.alert('Validation', 'Start date cannot be after end date');
    }
    setSubmitting(true);
    try {
      await rootApi.post('/api/exams', { examName, academicYear, startDate, endDate, status: 'CREATED' });
      Alert.alert('Success', 'Exam created successfully!');
      setShowCreateExam(false);
      setExamForm({ examName: '', academicYear: new Date().getFullYear().toString(), startDate: '', endDate: '' });
      fetchExams();
    } catch {
      Alert.alert('Error', 'Failed to create exam');
    } finally {
      setSubmitting(false);
    }
  };

  const renderExamCard = ({ item }) => (
    <TouchableOpacity
      style={[s.card, isMobile ? s.cardMobile : s.cardDesktop]}
      onPress={() => {
        setSelectedExam(item);
        setShowDetails(true);
      }}
      activeOpacity={0.85}
    >
      <View style={s.cardTop}>
        <View style={s.cardIconWrap}>
          <FileText size={22} color={COLORS.brand} />
        </View>
        <View style={s.cardInfo}>
          <Text style={s.cardTitle} numberOfLines={1}>{item.examName}</Text>
          <View style={s.cardMeta}>
            <Calendar size={11} color={COLORS.textLight} />
            <Text style={s.cardMetaText}>{item.startDate} → {item.endDate}</Text>
          </View>
          <View style={s.cardMeta}>
            <Book size={11} color={COLORS.textLight} />
            <Text style={s.cardMetaText}>AY {item.academicYear}</Text>
          </View>
        </View>
        <StatusBadge status={item.status} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={s.root}>
      <View style={[s.header, isMobile && s.headerMobile]}>
        <View>
          <Text style={s.pageTitle}>Exam Management</Text>
          <Text style={s.pageSubtitle}>Create and manage school examinations</Text>
        </View>
        <TouchableOpacity style={s.createBtn} onPress={() => setShowCreateExam(true)}>
          <Plus size={16} color="#fff" />
          <Text style={s.createBtnText}>Create Exam</Text>
        </TouchableOpacity>
      </View>

      <View style={[s.statsRow, isMobile && s.statsRowMobile]}>
        {[
          { icon: Award, color: COLORS.brand, value: exams.length, label: 'Total Exams' },
          { icon: BookOpen, color: COLORS.green, value: subjects.length, label: 'Subjects' },
          { icon: Users, color: COLORS.blue, value: classes.length, label: 'Classes' },
          { icon: GraduationCap, color: COLORS.purple, value: exams.filter(e => e.status === 'PUBLISHED').length, label: 'Published' },
        ].map(({ icon: Icon, color, value, label }) => (
          <View key={label} style={s.statCard}>
            <View style={[s.statIcon, { backgroundColor: color + '15' }]}>
              <Icon size={18} color={color} />
            </View>
            <Text style={[s.statValue, { color }]}>{value}</Text>
            <Text style={s.statLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {loading ? (
        <View style={s.loader}>
          <ActivityIndicator size="large" color={COLORS.brand} />
          <Text style={s.loaderText}>Loading exams…</Text>
        </View>
      ) : exams.length === 0 ? (
        <EmptyState icon={FileText} title="No exams yet" body='Tap "Create Exam" to get started' />
      ) : (
        <FlatList
          data={exams}
          keyExtractor={item => item.examId}
          renderItem={renderExamCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[s.listPad, !isMobile && s.listPadDesktop]}
          numColumns={isMobile ? 1 : 2}
          key={isMobile ? 'single' : 'double'}
          columnWrapperStyle={!isMobile ? s.columnWrapper : undefined}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchExams(true)}
              tintColor={COLORS.brand}
            />
          }
        />
      )}

      {/* Exam Details Modal */}
      <ModalShell
        visible={showDetails}
        onClose={() => setShowDetails(false)}
        title={selectedExam?.examName || 'Exam Details'}
        icon={FileText}
        iconColor={COLORS.brand}
        width={modalW}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={s.detailCard}>
            <View style={s.detailRow}>
              <Calendar size={16} color={COLORS.brand} />
              <Text style={s.detailLabel}>Start Date:</Text>
              <Text style={s.detailValue}>{selectedExam?.startDate}</Text>
            </View>
            <View style={s.detailRow}>
              <Calendar size={16} color={COLORS.brand} />
              <Text style={s.detailLabel}>End Date:</Text>
              <Text style={s.detailValue}>{selectedExam?.endDate}</Text>
            </View>
            <View style={s.detailRow}>
              <Book size={16} color={COLORS.brand} />
              <Text style={s.detailLabel}>Academic Year:</Text>
              <Text style={s.detailValue}>{selectedExam?.academicYear}</Text>
            </View>
            <View style={s.detailRow}>
              <Award size={16} color={COLORS.brand} />
              <Text style={s.detailLabel}>Status:</Text>
              <StatusBadge status={selectedExam?.status} />
            </View>
          </View>
          <View style={{ height: 16 }} />
        </ScrollView>
      </ModalShell>

      {/* Create Exam Modal */}
      <ModalShell
        visible={showCreateExam}
        onClose={() => setShowCreateExam(false)}
        title="Create Exam"
        icon={FileText}
        iconColor={COLORS.brand}
        width={modalW}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={s.inputGroup}>
            <Text style={s.label}>Exam Name *</Text>
            <TextInput
              style={s.input}
              placeholder="e.g. Annual Exam 2026"
              placeholderTextColor={COLORS.textFaint}
              value={examForm.examName}
              onChangeText={t => setExamForm(f => ({ ...f, examName: t }))}
            />
          </View>
          <View style={s.inputGroup}>
            <Text style={s.label}>Academic Year *</Text>
            <TextInput
              style={s.input}
              placeholder="e.g. 2026"
              placeholderTextColor={COLORS.textFaint}
              value={examForm.academicYear}
              onChangeText={t => setExamForm(f => ({ ...f, academicYear: t }))}
              keyboardType="numeric"
            />
          </View>
          <View style={s.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <View style={s.inputGroup}>
                <Text style={s.label}>Start Date *</Text>
                <TextInput
                  style={s.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={COLORS.textFaint}
                  value={examForm.startDate}
                  onChangeText={t => setExamForm(f => ({ ...f, startDate: t }))}
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={s.inputGroup}>
                <Text style={s.label}>End Date *</Text>
                <TextInput
                  style={s.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={COLORS.textFaint}
                  value={examForm.endDate}
                  onChangeText={t => setExamForm(f => ({ ...f, endDate: t }))}
                />
              </View>
            </View>
          </View>
          <ModalButtons
            onCancel={() => setShowCreateExam(false)}
            onSubmit={createExam}
            submitLabel="Create Exam"
            submitting={submitting}
          />
        </ScrollView>
      </ModalShell>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 20,
    borderBottomWidth: 1, borderBottomColor: COLORS.borderMid,
    backgroundColor: COLORS.surface,
  },
  headerMobile: { paddingHorizontal: 16, paddingVertical: 16 },
  pageTitle: { fontSize: 22, fontWeight: '700', color: COLORS.brand, letterSpacing: -0.3 },
  pageSubtitle: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  createBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.brand,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10,
  },
  createBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  statsRow: {
    flexDirection: 'row', gap: 12,
    paddingHorizontal: 24, paddingVertical: 16,
  },
  statsRowMobile: { paddingHorizontal: 12, gap: 8 },
  statCard: {
    flex: 1, backgroundColor: COLORS.surface,
    borderRadius: 12, padding: 12, alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: COLORS.border,
  },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 10, color: COLORS.textLight, textAlign: 'center' },

  listPad: { padding: 16, paddingBottom: 32 },
  listPadDesktop: { padding: 24 },
  columnWrapper: { gap: 16 },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10, paddingVertical: 60 },
  loaderText: { fontSize: 13, color: COLORS.textLight },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 48, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: COLORS.brand },
  emptyBody: { fontSize: 13, color: COLORS.textFaint, textAlign: 'center' },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
  },
  cardDesktop: { flex: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, gap: 12 },
  cardIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: COLORS.brandLight,
    alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  cardMetaText: { fontSize: 11, color: COLORS.textLight },

  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.2 },

  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderRadius: 20, padding: 24,
    width: '94%', maxHeight: '88%',
  },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sheetIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sheetTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  closeBtn: { padding: 4 },

  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: COLORS.textMid, marginBottom: 6, letterSpacing: 0.2 },
  input: {
    borderWidth: 1, borderColor: COLORS.borderMid, borderRadius: 10,
    padding: 12, fontSize: 14, color: COLORS.text, backgroundColor: COLORS.bg,
  },
  row: { flexDirection: 'row', gap: 10 },

  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancelBtn: {
    flex: 1, paddingVertical: 13, borderRadius: 10,
    borderWidth: 1, borderColor: COLORS.borderMid,
    alignItems: 'center', backgroundColor: COLORS.bg,
  },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.textLight },
  submitBtn: { flex: 1, paddingVertical: 13, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  detailCard: {
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMid,
    width: 100,
  },
  detailValue: {
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
  },
});