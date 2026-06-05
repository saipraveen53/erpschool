import React, { useEffect, useState } from "react";
import {
  Bell,
  Search,
  AlertTriangle,
  BookOpen,
  Megaphone,
} from "lucide-react";
import { noticeApi } from "@/app/utils/axiosInstance";

const NoticeManagement = () => {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    const filtered = notices.filter(
      (notice) =>
        notice.noticeName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        notice.noticeDescription
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        notice.noticeType
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    setFilteredNotices(filtered);
  }, [searchTerm, notices]);

  const fetchNotices = async () => {
    try {
      setLoading(true);

      const response = await noticeApi.get(
        "/api/student/notice/all"
      );

      setNotices(response.data || []);
      setFilteredNotices(response.data || []);
    } catch (error) {
      console.error("Notice Fetch Error:", error);
      alert("Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  const getNoticeIcon = (type) => {
    switch (type) {
      case "ACADEMIC":
        return <BookOpen size={18} />;

      case "EMERGENCY":
        return <AlertTriangle size={18} />;

      default:
        return <Megaphone size={18} />;
    }
  };

  const getNoticeStyle = (type) => {
    switch (type) {
      case "ACADEMIC":
        return {
          bg: "bg-cyan-50",
          text: "text-cyan-700",
          badge: "bg-cyan-100 text-cyan-700",
        };

      case "EMERGENCY":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          badge: "bg-red-100 text-red-700",
        };

      default:
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          badge: "bg-blue-100 text-blue-700",
        };
    }
  };

  return (
    <div
      className="w-full bg-slate-50"
      style={{
        height: "calc(100vh - 80px)",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div className="max-w-7xl mx-auto p-4 md:p-6 pb-20">

        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-50 p-3 rounded-2xl">
              <Bell
                className="text-[#00BCD4]"
                size={24}
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-[#2C3E50]">
                Notice Management
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                View and manage all school notices
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 mb-6">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-3 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={fetchNotices}
            disabled={loading}
            className="bg-[#00BCD4] hover:bg-cyan-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
          >
            {loading
              ? "Loading..."
              : "Refresh Notices"}
          </button>
        </div>

        {/* Notice Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => {
              const style = getNoticeStyle(
                notice.noticeType
              );

              return (
                <div
                  key={notice.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`${style.bg} ${style.text} p-3 rounded-2xl`}
                    >
                      {getNoticeIcon(
                        notice.noticeType
                      )}
                    </div>

                    <span
                      className={`${style.badge} px-3 py-1 rounded-full text-xs font-semibold`}
                    >
                      {notice.noticeType}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-[#2C3E50] mb-2">
                    {notice.noticeName}
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {notice.noticeDescription}
                  </p>

                  <div className="border-t border-slate-100 pt-3">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-slate-500">
                        Notice ID
                      </span>

                      <span className="font-semibold text-slate-700">
                        {notice.id}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">
                        Date
                      </span>

                      <span className="font-semibold text-slate-700">
                        {notice.noticeDate}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2">
              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center">
                <Bell
                  size={40}
                  className="mx-auto text-slate-400 mb-3"
                />

                <p className="text-slate-500 text-sm">
                  No Notices Found
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NoticeManagement;