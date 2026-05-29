import AsyncStorage from '@react-native-async-storage/async-storage';
import driverData from '../data/driverData.json';

let localData = { ...driverData };

// Helper to simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Get data functions
export const getDriverRoute = async () => {
  await delay();
  return localData.assignedRoute;
};

export const getDriverStudents = async () => {
  await delay();
  return localData.students;
};

export const getDriverAttendance = async () => {
  await delay();
  return localData.attendance;
};

export const getDriverAlerts = async () => {
  await delay();
  return localData.alerts;
};

export const getTodaySchedule = async () => {
  await delay();
  return localData.todaySchedule;
};

export const getReportTypes = async () => {
  await delay();
  return localData.reportTypes;
};

export const getEmergencyContacts = async () => {
  await delay();
  return localData.emergencyContacts;
};

export const getVehicleInfo = async () => {
  await delay();
  return localData.vehicleInfo;
};

export const getTrackingInitialLocation = async () => {
  await delay();
  return localData.tracking.initialLocation;
};

export const getInspectionItems = async () => {
  await delay();
  return localData.vehicleInspection.items;
};

export const getBusCapacity = async () => {
  await delay();
  return { capacity: localData.busCapacity, onboard: localData.students.filter(s => s.status === 'picked').length };
};

// Update functions with parent notifications
export const updateStudentPickupStatus = async (studentId: number, status: 'picked' | 'pending' | 'dropped') => {
  const student = localData.students.find(s => s.id === studentId);
  if (student) {
    student.status = status;
    if (status === 'picked') student.boardedTime = new Date().toISOString();
    if (status === 'dropped') student.droppedTime = new Date().toISOString();
  }
  // Notify parent (simulated)
  console.log(`Parent notified: Student ${studentId} status ${status}`);
  return { success: true };
};

export const updateAttendanceStatus = async (studentId: number, status: 'present' | 'absent') => {
  const record = localData.attendance.find(a => a.id === studentId);
  if (record) {
    record.status = status;
    record.time = status === 'present' ? new Date().toLocaleTimeString() : '-';
  }
  return { success: true };
};

// Real-time GPS simulation with speed and progress
let trackingInterval: NodeJS.Timeout | null = null;
export const startLocationTracking = (callback: (data: any) => void) => {
  let lat = localData.tracking.initialLocation.lat;
  let lng = localData.tracking.initialLocation.lng;
  let speed = 0;
  let completedStops = localData.assignedRoute.stops.filter(s => s.completed).length;
  const totalStops = localData.assignedRoute.stops.length;
  trackingInterval = setInterval(() => {
    lat += 0.0001;
    lng += 0.0001;
    speed = 40 + Math.random() * 20;
    const progress = (completedStops / totalStops) * 100;
    const remainingStops = totalStops - completedStops;
    const etaMinutes = remainingStops * 5;
    callback({ lat, lng, speed, progress, remainingStops, eta: `${etaMinutes} min` });
  }, 3000);
  return () => clearInterval(trackingInterval!);
};
export const stopLocationTracking = () => {
  if (trackingInterval) clearInterval(trackingInterval);
};

// Trip management
export const startTrip = async () => {
  localData.tripLogs.push({ startTime: new Date().toISOString(), active: true });
  console.log("Trip started");
  return { success: true };
};
export const endTrip = async () => {
  const lastTrip = localData.tripLogs[localData.tripLogs.length - 1];
  if (lastTrip) lastTrip.endTime = new Date().toISOString();
  console.log("Trip ended");
  return { success: true };
};

// Fuel tracking
export const addFuelLog = async (log: any) => {
  localData.fuelLogs.push({ ...log, date: new Date().toISOString() });
  return { success: true };
};
export const getFuelLogs = async () => {
  await delay();
  return localData.fuelLogs;
};

// Incident report
export const submitIncidentReport = async (report: any) => {
  localData.incidentReports.push({ ...report, date: new Date().toISOString() });
  return { success: true };
};

// Emergency SOS
export const sendEmergencySOS = async (type: string, location: any) => {
  console.log(`SOS sent: ${type} at ${location.lat},${location.lng}`);
  return { success: true };
};

// Mark stop as completed
export const markStopCompleted = async (stopId: number) => {
  const stop = localData.assignedRoute.stops.find(s => s.id === stopId);
  if (stop) stop.completed = true;
  return { success: true };
};

// Offline queue support
export const queueAction = async (action: any) => {
  const queue = await AsyncStorage.getItem('offlineQueue');
  const parsed = queue ? JSON.parse(queue) : [];
  parsed.push(action);
  await AsyncStorage.setItem('offlineQueue', JSON.stringify(parsed));
};
export const syncOfflineQueue = async () => {
  const queue = await AsyncStorage.getItem('offlineQueue');
  if (queue) {
    const actions = JSON.parse(queue);
    for (const action of actions) {
      // replay each action to server (simulated)
      console.log("Syncing offline action:", action);
    }
    await AsyncStorage.removeItem('offlineQueue');
  }
};