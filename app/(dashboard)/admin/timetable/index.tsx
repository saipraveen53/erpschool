import React, { useState } from "react";

// ── Static Data ────────────────────────────────────────────────────────────
const CLASSES = ["1-b", "2-A", "3-C", "4-A", "4-b", "5-a", "6-A", "7-b", "8-A", "9-B", "10-A"];
const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];

const SUBJECT_COLORS = {
  Mathematics:  { bg: "#FFF3E0", border: "#00BCD4", text: "#00BCD4", icon: "📐" },
  Physics:      { bg: "#E3F2FD", border: "#00BCD4", text: "#00BCD4", icon: "⚛️" },
  Chemistry:    { bg: "#F3E5F5", border: "#00BCD4", text: "#00BCD4", icon: "🧪" },
  English:      { bg: "#E8F5E9", border: "#00BCD4", text: "#00BCD4", icon: "📖" },
  History:      { bg: "#FCE4EC", border: "#00BCD4", text: "#00BCD4", icon: "🏛️" },
  Geography:    { bg: "#E0F7FA", border: "#00BCD4", text: "#00BCD4", icon: "🌍" },
  Biology:      { bg: "#F1F8E9", border: "#00BCD4", text: "#00BCD4", icon: "🔬" },
  "Computer Science": { bg: "#E8EAF6", border: "#00BCD4", text: "#00BCD4", icon: "💻" },
  "Physical Education": { bg: "#FBE9E7", border: "#00BCD42", text: "#00BCD4", icon: "🏃" },
  Art:          { bg: "#FFF8E1", border: "#00BCD4", text: "#00BCD4", icon: "🎨" },
  Music:        { bg: "#F8BBD9", border: "#00BCD4", text: "#00BCD4", icon: "🎵" },
  Economics:    { bg: "#E0F2F1", border: "#00BCD4", text: "#00BCD4", icon: "📊" },
};

const TIMETABLE_DATA = {
  "1-b": {
    MON: [{ period: 1, time: "8:00 – 8:45", subject: "Mathematics", teacher: "Mr. Sharma", room: "101" }, { period: 2, time: "8:45 – 9:30", subject: "English", teacher: "Ms. Priya", room: "102" }, { period: 3, time: "9:45 – 10:30", subject: "Art", teacher: "Ms. Kavya", room: "Art Room" }, { period: 4, time: "10:30 – 11:15", subject: "Physical Education", teacher: "Mr. Ravi", room: "Ground" }, { period: 5, time: "11:30 – 12:15", subject: "Music", teacher: "Ms. Ananya", room: "Music Room" }, { period: 6, time: "12:15 – 1:00", subject: "English", teacher: "Ms. Priya", room: "102" }],
    TUE: [{ period: 1, time: "8:00 – 8:45", subject: "Art", teacher: "Ms. Kavya", room: "Art Room" }, { period: 2, time: "8:45 – 9:30", subject: "Mathematics", teacher: "Mr. Sharma", room: "101" }, { period: 3, time: "9:45 – 10:30", subject: "English", teacher: "Ms. Priya", room: "102" }, { period: 4, time: "10:30 – 11:15", subject: "Music", teacher: "Ms. Ananya", room: "Music Room" }, { period: 5, time: "11:30 – 12:15", subject: "Physical Education", teacher: "Mr. Ravi", room: "Ground" }, { period: 6, time: "12:15 – 1:00", subject: "Mathematics", teacher: "Mr. Sharma", room: "101" }],
    WED: [{ period: 1, time: "8:00 – 8:45", subject: "English", teacher: "Ms. Priya", room: "102" }, { period: 2, time: "8:45 – 9:30", subject: "Art", teacher: "Ms. Kavya", room: "Art Room" }, { period: 3, time: "9:45 – 10:30", subject: "Mathematics", teacher: "Mr. Sharma", room: "101" }, { period: 4, time: "10:30 – 11:15", subject: "English", teacher: "Ms. Priya", room: "102" }, { period: 5, time: "11:30 – 12:15", subject: "Music", teacher: "Ms. Ananya", room: "Music Room" }, { period: 6, time: "12:15 – 1:00", subject: "Physical Education", teacher: "Mr. Ravi", room: "Ground" }],
    THU: [{ period: 1, time: "8:00 – 8:45", subject: "Mathematics", teacher: "Mr. Sharma", room: "101" }, { period: 2, time: "8:45 – 9:30", subject: "Music", teacher: "Ms. Ananya", room: "Music Room" }, { period: 3, time: "9:45 – 10:30", subject: "English", teacher: "Ms. Priya", room: "102" }, { period: 4, time: "10:30 – 11:15", subject: "Art", teacher: "Ms. Kavya", room: "Art Room" }, { period: 5, time: "11:30 – 12:15", subject: "Mathematics", teacher: "Mr. Sharma", room: "101" }, { period: 6, time: "12:15 – 1:00", subject: "Physical Education", teacher: "Mr. Ravi", room: "Ground" }],
    FRI: [{ period: 1, time: "8:00 – 8:45", subject: "Physical Education", teacher: "Mr. Ravi", room: "Ground" }, { period: 2, time: "8:45 – 9:30", subject: "English", teacher: "Ms. Priya", room: "102" }, { period: 3, time: "9:45 – 10:30", subject: "Art", teacher: "Ms. Kavya", room: "Art Room" }, { period: 4, time: "10:30 – 11:15", subject: "Mathematics", teacher: "Mr. Sharma", room: "101" }, { period: 5, time: "11:30 – 12:15", subject: "English", teacher: "Ms. Priya", room: "102" }, { period: 6, time: "12:15 – 1:00", subject: "Music", teacher: "Ms. Ananya", room: "Music Room" }],
    SAT: [{ period: 1, time: "8:00 – 8:45", subject: "Art", teacher: "Ms. Kavya", room: "Art Room" }, { period: 2, time: "8:45 – 9:30", subject: "Mathematics", teacher: "Mr. Sharma", room: "101" }, { period: 3, time: "9:45 – 10:30", subject: "Music", teacher: "Ms. Ananya", room: "Music Room" }, { period: 4, time: "10:30 – 11:15", subject: "English", teacher: "Ms. Priya", room: "102" }],
  },
  "4-b": {
    MON: [{ period: 1, time: "8:00 – 8:45", subject: "Mathematics", teacher: "Mr. Arjun", room: "201" }, { period: 2, time: "8:45 – 9:30", subject: "English", teacher: "Ms. Sneha", room: "202" }, { period: 3, time: "9:45 – 10:30", subject: "Science", teacher: "Mr. Kiran", room: "Lab 1" }, { period: 4, time: "10:30 – 11:15", subject: "History", teacher: "Ms. Divya", room: "203" }, { period: 5, time: "11:30 – 12:15", subject: "Geography", teacher: "Mr. Suresh", room: "204" }, { period: 6, time: "12:15 – 1:00", subject: "Physical Education", teacher: "Mr. Ravi", room: "Ground" }],
    TUE: [{ period: 1, time: "8:00 – 8:45", subject: "English", teacher: "Ms. Sneha", room: "202" }, { period: 2, time: "8:45 – 9:30", subject: "Mathematics", teacher: "Mr. Arjun", room: "201" }, { period: 3, time: "9:45 – 10:30", subject: "Geography", teacher: "Mr. Suresh", room: "204" }, { period: 4, time: "10:30 – 11:15", subject: "Art", teacher: "Ms. Kavya", room: "Art Room" }, { period: 5, time: "11:30 – 12:15", subject: "History", teacher: "Ms. Divya", room: "203" }, { period: 6, time: "12:15 – 1:00", subject: "Mathematics", teacher: "Mr. Arjun", room: "201" }],
    WED: [{ period: 1, time: "8:00 – 8:45", subject: "History", teacher: "Ms. Divya", room: "203" }, { period: 2, time: "8:45 – 9:30", subject: "English", teacher: "Ms. Sneha", room: "202" }, { period: 3, time: "9:45 – 10:30", subject: "Mathematics", teacher: "Mr. Arjun", room: "201" }, { period: 4, time: "10:30 – 11:15", subject: "Physical Education", teacher: "Mr. Ravi", room: "Ground" }, { period: 5, time: "11:30 – 12:15", subject: "Art", teacher: "Ms. Kavya", room: "Art Room" }, { period: 6, time: "12:15 – 1:00", subject: "Geography", teacher: "Mr. Suresh", room: "204" }],
    THU: [{ period: 1, time: "8:00 – 8:45", subject: "Geography", teacher: "Mr. Suresh", room: "204" }, { period: 2, time: "8:45 – 9:30", subject: "Mathematics", teacher: "Mr. Arjun", room: "201" }, { period: 3, time: "9:45 – 10:30", subject: "English", teacher: "Ms. Sneha", room: "202" }, { period: 4, time: "10:30 – 11:15", subject: "History", teacher: "Ms. Divya", room: "203" }, { period: 5, time: "11:30 – 12:15", subject: "Physical Education", teacher: "Mr. Ravi", room: "Ground" }, { period: 6, time: "12:15 – 1:00", subject: "Art", teacher: "Ms. Kavya", room: "Art Room" }],
    FRI: [{ period: 1, time: "8:00 – 8:45", subject: "Art", teacher: "Ms. Kavya", room: "Art Room" }, { period: 2, time: "8:45 – 9:30", subject: "History", teacher: "Ms. Divya", room: "203" }, { period: 3, time: "9:45 – 10:30", subject: "English", teacher: "Ms. Sneha", room: "202" }, { period: 4, time: "10:30 – 11:15", subject: "Geography", teacher: "Mr. Suresh", room: "204" }, { period: 5, time: "11:30 – 12:15", subject: "Mathematics", teacher: "Mr. Arjun", room: "201" }, { period: 6, time: "12:15 – 1:00", subject: "Physical Education", teacher: "Mr. Ravi", room: "Ground" }],
    SAT: [{ period: 1, time: "8:00 – 8:45", subject: "Mathematics", teacher: "Mr. Arjun", room: "201" }, { period: 2, time: "8:45 – 9:30", subject: "English", teacher: "Ms. Sneha", room: "202" }, { period: 3, time: "9:45 – 10:30", subject: "History", teacher: "Ms. Divya", room: "203" }, { period: 4, time: "10:30 – 11:15", subject: "Art", teacher: "Ms. Kavya", room: "Art Room" }],
  },
  "9-B": {
    MON: [{ period: 1, time: "8:00 – 8:45", subject: "Physics", teacher: "Dr. Mehta", room: "Lab 2" }, { period: 2, time: "8:45 – 9:30", subject: "Mathematics", teacher: "Mr. Verma", room: "301" }, { period: 3, time: "9:45 – 10:30", subject: "Chemistry", teacher: "Ms. Rao", room: "Chem Lab" }, { period: 4, time: "10:30 – 11:15", subject: "English", teacher: "Ms. Iyer", room: "302" }, { period: 5, time: "11:30 – 12:15", subject: "Biology", teacher: "Mr. Nair", room: "Bio Lab" }, { period: 6, time: "12:15 – 1:00", subject: "Computer Science", teacher: "Ms. Reddy", room: "CS Lab" }],
    TUE: [{ period: 1, time: "8:00 – 8:45", subject: "Mathematics", teacher: "Mr. Verma", room: "301" }, { period: 2, time: "8:45 – 9:30", subject: "Chemistry", teacher: "Ms. Rao", room: "Chem Lab" }, { period: 3, time: "9:45 – 10:30", subject: "Physics", teacher: "Dr. Mehta", room: "Lab 2" }, { period: 4, time: "10:30 – 11:15", subject: "Computer Science", teacher: "Ms. Reddy", room: "CS Lab" }, { period: 5, time: "11:30 – 12:15", subject: "English", teacher: "Ms. Iyer", room: "302" }, { period: 6, time: "12:15 – 1:00", subject: "Biology", teacher: "Mr. Nair", room: "Bio Lab" }],
    WED: [{ period: 1, time: "8:00 – 8:45", subject: "English", teacher: "Ms. Iyer", room: "302" }, { period: 2, time: "8:45 – 9:30", subject: "Biology", teacher: "Mr. Nair", room: "Bio Lab" }, { period: 3, time: "9:45 – 10:30", subject: "Mathematics", teacher: "Mr. Verma", room: "301" }, { period: 4, time: "10:30 – 11:15", subject: "Physics", teacher: "Dr. Mehta", room: "Lab 2" }, { period: 5, time: "11:30 – 12:15", subject: "Chemistry", teacher: "Ms. Rao", room: "Chem Lab" }, { period: 6, time: "12:15 – 1:00", subject: "Economics", teacher: "Mr. Pillai", room: "303" }],
    THU: [{ period: 1, time: "8:00 – 8:45", subject: "Chemistry", teacher: "Ms. Rao", room: "Chem Lab" }, { period: 2, time: "8:45 – 9:30", subject: "Physics", teacher: "Dr. Mehta", room: "Lab 2" }, { period: 3, time: "9:45 – 10:30", subject: "Economics", teacher: "Mr. Pillai", room: "303" }, { period: 4, time: "10:30 – 11:15", subject: "Mathematics", teacher: "Mr. Verma", room: "301" }, { period: 5, time: "11:30 – 12:15", subject: "Computer Science", teacher: "Ms. Reddy", room: "CS Lab" }, { period: 6, time: "12:15 – 1:00", subject: "English", teacher: "Ms. Iyer", room: "302" }],
    FRI: [{ period: 1, time: "8:00 – 8:45", subject: "Biology", teacher: "Mr. Nair", room: "Bio Lab" }, { period: 2, time: "8:45 – 9:30", subject: "Economics", teacher: "Mr. Pillai", room: "303" }, { period: 3, time: "9:45 – 10:30", subject: "English", teacher: "Ms. Iyer", room: "302" }, { period: 4, time: "10:30 – 11:15", subject: "Chemistry", teacher: "Ms. Rao", room: "Chem Lab" }, { period: 5, time: "11:30 – 12:15", subject: "Physics", teacher: "Dr. Mehta", room: "Lab 2" }, { period: 6, time: "12:15 – 1:00", subject: "Mathematics", teacher: "Mr. Verma", room: "301" }],
    SAT: [{ period: 1, time: "8:00 – 8:45", subject: "Mathematics", teacher: "Mr. Verma", room: "301" }, { period: 2, time: "8:45 – 9:30", subject: "Physics", teacher: "Dr. Mehta", room: "Lab 2" }, { period: 3, time: "9:45 – 10:30", subject: "Computer Science", teacher: "Ms. Reddy", room: "CS Lab" }, { period: 4, time: "10:30 – 11:15", subject: "Economics", teacher: "Mr. Pillai", room: "303" }],
  },
};

const DEFAULT_TIMETABLE = {
  MON: [{ period: 1, time: "8:00 – 8:45", subject: "Mathematics", teacher: "Mr. Kumar", room: "101" }, { period: 2, time: "8:45 – 9:30", subject: "English", teacher: "Ms. Singh", room: "102" }, { period: 3, time: "9:45 – 10:30", subject: "History", teacher: "Mr. Das", room: "103" }, { period: 4, time: "10:30 – 11:15", subject: "Geography", teacher: "Ms. Joshi", room: "104" }, { period: 5, time: "11:30 – 12:15", subject: "Art", teacher: "Ms. Kavya", room: "Art Room" }, { period: 6, time: "12:15 – 1:00", subject: "Physical Education", teacher: "Mr. Ravi", room: "Ground" }],
  TUE: [{ period: 1, time: "8:00 – 8:45", subject: "English", teacher: "Ms. Singh", room: "102" }, { period: 2, time: "8:45 – 9:30", subject: "Mathematics", teacher: "Mr. Kumar", room: "101" }, { period: 3, time: "9:45 – 10:30", subject: "Art", teacher: "Ms. Kavya", room: "Art Room" }, { period: 4, time: "10:30 – 11:15", subject: "History", teacher: "Mr. Das", room: "103" }, { period: 5, time: "11:30 – 12:15", subject: "Physical Education", teacher: "Mr. Ravi", room: "Ground" }, { period: 6, time: "12:15 – 1:00", subject: "Geography", teacher: "Ms. Joshi", room: "104" }],
  WED: [{ period: 1, time: "8:00 – 8:45", subject: "Geography", teacher: "Ms. Joshi", room: "104" }, { period: 2, time: "8:45 – 9:30", subject: "History", teacher: "Mr. Das", room: "103" }, { period: 3, time: "9:45 – 10:30", subject: "Mathematics", teacher: "Mr. Kumar", room: "101" }, { period: 4, time: "10:30 – 11:15", subject: "English", teacher: "Ms. Singh", room: "102" }, { period: 5, time: "11:30 – 12:15", subject: "Art", teacher: "Ms. Kavya", room: "Art Room" }, { period: 6, time: "12:15 – 1:00", subject: "Physical Education", teacher: "Mr. Ravi", room: "Ground" }],
  THU: [{ period: 1, time: "8:00 – 8:45", subject: "History", teacher: "Mr. Das", room: "103" }, { period: 2, time: "8:45 – 9:30", subject: "Mathematics", teacher: "Mr. Kumar", room: "101" }, { period: 3, time: "9:45 – 10:30", subject: "English", teacher: "Ms. Singh", room: "102" }, { period: 4, time: "10:30 – 11:15", subject: "Geography", teacher: "Ms. Joshi", room: "104" }, { period: 5, time: "11:30 – 12:15", subject: "Physical Education", teacher: "Mr. Ravi", room: "Ground" }, { period: 6, time: "12:15 – 1:00", subject: "Art", teacher: "Ms. Kavya", room: "Art Room" }],
  FRI: [{ period: 1, time: "8:00 – 8:45", subject: "Art", teacher: "Ms. Kavya", room: "Art Room" }, { period: 2, time: "8:45 – 9:30", subject: "Geography", teacher: "Ms. Joshi", room: "104" }, { period: 3, time: "9:45 – 10:30", subject: "History", teacher: "Mr. Das", room: "103" }, { period: 4, time: "10:30 – 11:15", subject: "Mathematics", teacher: "Mr. Kumar", room: "101" }, { period: 5, time: "11:30 – 12:15", subject: "English", teacher: "Ms. Singh", room: "102" }, { period: 6, time: "12:15 – 1:00", subject: "Physical Education", teacher: "Mr. Ravi", room: "Ground" }],
  SAT: [{ period: 1, time: "8:00 – 8:45", subject: "Mathematics", teacher: "Mr. Kumar", room: "101" }, { period: 2, time: "8:45 – 9:30", subject: "English", teacher: "Ms. Singh", room: "102" }, { period: 3, time: "9:45 – 10:30", subject: "History", teacher: "Mr. Das", room: "103" }, { period: 4, time: "10:30 – 11:15", subject: "Geography", teacher: "Ms. Joshi", room: "104" }],
};

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState("4-b");
  const [selectedDay, setSelectedDay] = useState("MON");
  const [hoveredPeriod, setHoveredPeriod] = useState(null);

  const getTimetable = () => (TIMETABLE_DATA[selectedClass] || DEFAULT_TIMETABLE)[selectedDay] || [];
  const periods = getTimetable();
  const todayIdx = ["MON","TUE","WED","THU","FRI","SAT"].indexOf(["SUN","MON","TUE","WED","THU","FRI","SAT"][new Date().getDay()]);

  return (
    <div style={styles.root}>
      <main style={styles.main}>
        <div style={styles.content}>
          <div style={styles.pageHeader}>
            <div>
              <h1 style={styles.pageTitle}>Manage Timetable</h1>
              <p style={styles.pageSubtitle}>Academic Year 2024–25 · View and manage class schedules</p>
            </div>
            <div style={styles.headerStats}>
              <div style={styles.statPill}>
                <span style={{ color: "#00BCD4", fontWeight: 700 }}>{periods.length}</span>
                <span style={styles.statPillLabel}>periods today</span>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <p style={styles.sectionLabel}><span style={styles.sectionDot} /> Select Class</p>
            <div style={styles.classRow}>
              {CLASSES.map(cls => (
                <button key={cls} onClick={() => setSelectedClass(cls)} style={{ ...styles.classBtn, ...(selectedClass === cls ? styles.classBtnActive : {}) }}>{cls}</button>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <p style={styles.sectionLabel}><span style={styles.sectionDot} /> Select Day</p>
            <div style={styles.dayRow}>
              {DAYS.map((day, i) => (
                <button key={day} onClick={() => setSelectedDay(day)} style={{ ...styles.dayBtn, ...(selectedDay === day ? styles.dayBtnActive : {}), ...(i === todayIdx ? styles.dayBtnToday : {}) }}>
                  {day}
                  {i === todayIdx && <span style={styles.todayDot} />}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.tableHeader}>
              <div style={styles.tableHeaderLeft}>
                <span style={styles.tableTitle}>Class {selectedClass} — {selectedDay} Schedule</span>
                <span style={styles.periodCount}>{periods.length} Periods</span>
              </div>
              <button style={styles.addBtn}>+ Add Period</button>
            </div>

            <div style={styles.periodsGrid}>
              {periods.map((p, i) => {
                const col = SUBJECT_COLORS[p.subject] || { bg: "#F5F5F5", border: "#9E9E9E", text: "#424242", icon: "📌" };
                const isHovered = hoveredPeriod === i;
                return (
                  <div key={i}>
                    <div style={{ ...styles.periodCard, borderLeftColor: col.border, backgroundColor: isHovered ? col.bg : "#fff", transform: isHovered ? "translateY(-2px)" : "translateY(0)", boxShadow: isHovered ? `0 8px 24px rgba(0,0,0,0.10), 0 0 0 1px ${col.border}40` : "0 2px 8px rgba(45,63,73,0.07)" }} onMouseEnter={() => setHoveredPeriod(i)} onMouseLeave={() => setHoveredPeriod(null)}>
                      <div style={{ ...styles.periodNum, backgroundColor: col.border + "18", color: col.text }}><span style={styles.periodNumText}>P{p.period}</span></div>
                      <div style={{ ...styles.subjectIconWrap, backgroundColor: col.bg, borderColor: col.border + "40" }}><span style={{ fontSize: 22 }}>{col.icon}</span></div>
                      <div style={styles.periodInfo}>
                        <span style={{ ...styles.subjectName, color: col.text }}>{p.subject}</span>
                        <span style={styles.teacherName}>{p.teacher}</span>
                      </div>
                      <div style={styles.periodMeta}>
                        <span style={styles.periodTime}>🕐 {p.time}</span>
                        <span style={styles.roomBadge}>📍 {p.room}</span>
                      </div>
                      <div style={styles.periodActions}><button style={styles.editBtn}>✏️</button><button style={{ ...styles.editBtn, color: "#ef5350" }}>🗑</button></div>
                    </div>
                    {(i === 1 || i === 3) && (
                      <div style={styles.breakRow}>
                        <div style={styles.breakLine} /><span style={styles.breakLabel}>{i === 1 ? "☕ Short Break · 15 min" : "🍱 Lunch Break · 30 min"}</span><div style={styles.breakLine} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  root: { display: "flex", height: "100vh", width: "100vw", fontFamily: "'Nunito', 'Segoe UI', sans-serif", backgroundColor: "#f0f4f6", overflow: "hidden" },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  content: { flex: 1, overflowY: "auto", padding: "24px 28px" },
  pageHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 },
  pageTitle: { fontSize: 26, fontWeight: 800, color: "#1e2d36", margin: 0 },
  pageSubtitle: { fontSize: 13, color: "#7a96a4", marginTop: 4 },
  headerStats: { display: "flex", gap: 8, alignItems: "center" },
  statPill: { backgroundColor: "#fff", border: "1px solid #e4eaed", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#2D3F49" },
  statPillLabel: { color: "#7a96a4", fontWeight: 400 },
  section: { marginBottom: 24 },
  sectionLabel: { fontSize: 11.5, fontWeight: 700, color: "#7a96a4", textTransform: "uppercase", letterSpacing: 1, display: "flex", alignItems: "center", gap: 7, marginBottom: 10 },
  sectionDot: { width: 6, height: 6, borderRadius: "50%", backgroundColor: "#00BCD4", display: "inline-block" },
  classRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  classBtn: { padding: "7px 18px", borderRadius: 50, border: "1.5px solid #e4eaed", background: "#fff", fontSize: 13, fontWeight: 600, color: "#2D3F49", cursor: "pointer" },
  classBtnActive: { background: "linear-gradient(135deg, #00BCD4, #00BCD4)", borderColor: "#00BCD4", color: "#fff" },
  dayRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  dayBtn: { padding: "9px 22px", borderRadius: 10, border: "1.5px solid #e4eaed", background: "#fff", fontSize: 13, fontWeight: 700, color: "#2D3F49", cursor: "pointer", position: "relative" },
  dayBtnActive: { background: "linear-gradient(135deg, #00BCD4, #0097A7)", borderColor: "#00BCD4", color: "#fff" },
  dayBtnToday: { borderColor: "#00BCD4" },
  todayDot: { position: "absolute", top: 4, right: 6, width: 5, height: 5, borderRadius: "50%", backgroundColor: "#00BCD4" },
  tableHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  tableHeaderLeft: { display: "flex", alignItems: "center", gap: 10 },
  tableTitle: { fontSize: 15, fontWeight: 800, color: "#1e2d36" },
  periodCount: { backgroundColor: "rgba(0,188,212,0.1)", color: "#00BCD4", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 },
  addBtn: { padding: "8px 18px", borderRadius: 10, background: "linear-gradient(135deg, #00BCD4, #0097A7)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  periodsGrid: { display: "flex", flexDirection: "column", gap: 0 },
  periodCard: { display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", backgroundColor: "#fff", borderLeft: "4px solid #ccc", borderRadius: 12, marginBottom: 8, cursor: "pointer", transition: "all 0.18s ease" },
  periodNum: { width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  periodNumText: { fontSize: 11, fontWeight: 800 },
  subjectIconWrap: { width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid" },
  periodInfo: { flex: 1, display: "flex", flexDirection: "column" },
  subjectName: { fontSize: 14.5, fontWeight: 800 },
  teacherName: { fontSize: 12, color: "#7a96a4", marginTop: 2, fontWeight: 500 },
  periodMeta: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 },
  periodTime: { fontSize: 12, color: "#2D3F49", fontWeight: 600 },
  roomBadge: { fontSize: 11.5, color: "#7a96a4", fontWeight: 500, backgroundColor: "#f5f7f9", padding: "2px 8px", borderRadius: 6 },
  periodActions: { display: "flex", gap: 4, marginLeft: 8 },
  editBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 14, padding: "4px 6px" },
  breakRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8, paddingLeft: 8 },
  breakLine: { flex: 1, height: 1, backgroundColor: "#e4eaed" },
  breakLabel: { fontSize: 11, color: "#a0b4bc", fontWeight: 600 }
};