import { createTimetableApi } from '@/app/utils/axiosInstance';
import React, { useState } from 'react';

const TimetableApp = () => {
  const classes = ['1-b', '4-A', '4-b', '5-a', '6-A', '7-b', '8-A', '9-B'];
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM'];

  const [selectedClass, setSelectedClass] = useState('4-b');
  const [selectedDay, setSelectedDay] = useState('MON');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    time: '09:00 AM',
    subject: '',
    teacher: ''
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        classSectionId: selectedClass,
        periods: [{
          day: selectedDay,
          subjectId: formData.subject,
          teacherId: formData.teacher,
          startTime: formData.time,
          endTime: "1 Hour"
        }]
      };
      await createTimetableApi.post('/api/student/create/timetable', payload);
      alert('Timetable entry added successfully!');
      setModalOpen(false);
    } catch (error) {
      alert('Error saving timetable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-[#2C3E50]">
      <h1 className="text-3xl font-bold mb-6">Manage Timetable</h1>

      {/* Class Selection */}
      <div className="mb-8">
        <p className="font-semibold mb-3">Select Class:</p>
        <div className="flex flex-wrap gap-3">
          {classes.map(cls => (
            <button key={cls} onClick={() => setSelectedClass(cls)}
              className={`px-6 py-2 rounded-full border transition ${selectedClass === cls ? 'bg-[#FF9800] text-white border-[#FF9800]' : 'bg-white border-slate-200'}`}>
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Day Selection */}
      <div className="flex gap-4 mb-8">
        {days.map(day => (
          <button key={day} onClick={() => setSelectedDay(day)}
            className={`px-6 py-2 rounded-lg font-bold transition ${selectedDay === day ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>
            {day}
          </button>
        ))}
      </div>

      {/* Add Slot Button */}
      <button onClick={() => setModalOpen(true)} className="bg-[#00BCD4] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0097A7] transition">
        + Add Class to {selectedDay}
      </button>

      {/* Modal for Details */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Add Session Details</h2>
            
            <label className="block mb-2 font-semibold">Time Slot</label>
            <select className="w-full p-4 mb-4 bg-slate-50 rounded-xl" onChange={(e) => setFormData({...formData, time: e.target.value})}>
              {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <input placeholder="Subject ID" className="w-full p-4 mb-4 bg-slate-50 rounded-xl" onChange={(e) => setFormData({...formData, subject: e.target.value})} />
            <input placeholder="Teacher ID" className="w-full p-4 mb-6 bg-slate-50 rounded-xl" onChange={(e) => setFormData({...formData, teacher: e.target.value})} />
            
            <div className="flex gap-4">
              <button onClick={handleSave} className="flex-1 bg-[#00BCD4] text-white py-3 rounded-xl font-bold">{loading ? "Saving..." : "Save"}</button>
              <button onClick={() => setModalOpen(false)} className="flex-1 bg-slate-100 py-3 rounded-xl font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableApp;