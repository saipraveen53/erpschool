import React, { useState } from "react";
import { CalendarPlus, Calendar, Search } from "lucide-react";
import {
  holidayApi,
  getHolidaysApi,
} from "@/app/utils/axiosInstance";

const HolidayManagement = () => {
  const [holidayData, setHolidayData] = useState({
    date: "",
    title: "",
    description: "",
    fullDay: true,
  });

  const [year, setYear] = useState(
    new Date().getFullYear()
  );

  const [month, setMonth] = useState(
    String(new Date().getMonth() + 1).padStart(2, "0")
  );

  const [holidays, setHolidays] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setHolidayData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleCreateHoliday = async () => {
    try {
      setCreateLoading(true);

      const response = await holidayApi.post(
        "/api/student/calender/holiday",
        {
          date: holidayData.date,
          title: holidayData.title,
          description: holidayData.description,
          fullDay: holidayData.fullDay,
        }
      );

      console.log(response.data);

      alert("Holiday Created Successfully");

      setHolidayData({
        date: "",
        title: "",
        description: "",
        fullDay: true,
      });

      fetchHolidays();
    } catch (error) {
      console.error(error);
      alert("Failed to Create Holiday");
    } finally {
      setCreateLoading(false);
    }
  };

  const fetchHolidays = async () => {
    try {
      setFetchLoading(true);

      const response = await getHolidaysApi.get(
        `/api/student/calender/${year}/${month}`
      );

      setHolidays(response.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to Fetch Holidays");
    } finally {
      setFetchLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 md:p-8">

        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-50 p-4 rounded-2xl">
              <Calendar
                className="text-[#00BCD4]"
                size={30}
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-[#2C3E50]">
                Holiday Management
              </h1>

              <p className="text-slate-500 mt-1">
                Create and manage school holidays
              </p>
            </div>
          </div>
        </div>

        {/* Create Holiday */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <CalendarPlus
              className="text-[#00BCD4]"
              size={24}
            />

            <h2 className="text-2xl font-bold text-[#2C3E50]">
              Create Holiday
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 font-medium text-slate-600">
                Holiday Date
              </label>

              <input
                type="date"
                name="date"
                value={holidayData.date}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-600">
                Holiday Title
              </label>

              <input
                type="text"
                name="title"
                value={holidayData.title}
                onChange={handleInputChange}
                placeholder="Enter Holiday Title"
                className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="block mb-2 font-medium text-slate-600">
              Description
            </label>

            <textarea
              rows={4}
              name="description"
              value={holidayData.description}
              onChange={handleInputChange}
              placeholder="Enter Holiday Description"
              className="w-full border border-slate-300 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <input
              type="checkbox"
              name="fullDay"
              checked={holidayData.fullDay}
              onChange={handleInputChange}
              className="h-5 w-5 accent-cyan-500"
            />

            <label className="font-medium text-slate-700">
              Full Day Holiday
            </label>
          </div>

          <button
            onClick={handleCreateHoliday}
            disabled={createLoading}
            className="mt-6 bg-[#00BCD4] hover:bg-cyan-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
          >
            {createLoading
              ? "Creating Holiday..."
              : "Create Holiday"}
          </button>
        </div>

        {/* Get Holidays */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Search
              className="text-[#00BCD4]"
              size={24}
            />

            <h2 className="text-2xl font-bold text-[#2C3E50]">
              View Holidays
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div>
              <label className="block mb-2 font-medium text-slate-600">
                Year
              </label>

              <input
                type="number"
                value={year}
                onChange={(e) =>
                  setYear(e.target.value)
                }
                className="w-full border border-slate-300 rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-600">
                Month
              </label>

              <select
                value={month}
                onChange={(e) =>
                  setMonth(e.target.value)
                }
                className="w-full border border-slate-300 rounded-xl p-3"
              >
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchHolidays}
                disabled={fetchLoading}
                className="w-full bg-[#00BCD4] hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-semibold"
              >
                {fetchLoading
                  ? "Loading..."
                  : "Get Holidays"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-left">Full Day</th>
                </tr>
              </thead>

              <tbody>
                {holidays.length > 0 ? (
                  holidays.map((holiday) => (
                    <tr
                      key={holiday.id}
                      className="border-t border-slate-200 hover:bg-slate-50"
                    >
                      <td className="p-4">{holiday.id}</td>
                      <td className="p-4">{holiday.date}</td>
                      <td className="p-4">{holiday.title}</td>
                      <td className="p-4">
                        {holiday.description}
                      </td>
                      <td className="p-4">
                        {holiday.fullDay
                          ? "Yes"
                          : "No"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center p-8 text-slate-500"
                    >
                      No Holidays Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HolidayManagement;