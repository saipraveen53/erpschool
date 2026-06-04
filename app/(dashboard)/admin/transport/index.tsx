import React, { useState } from "react";
import {
  UserPlus,
  Bus,
  Users,
  MapPin,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { addRouteApi } from "@/app/utils/axiosInstance";

const TransportManagement = () => {
  const [currentView, setCurrentView] = useState("dashboard");

  const navButtons = [
    {
      id: "assignDriver",
      label: "Add Transport Route",
      icon: <UserPlus />,
    },
    {
      id: "addStudents",
      label: "Add Students to Route",
      icon: <Bus />,
    },
    {
      id: "getAllStudents",
      label: "Get All Students",
      icon: <Users />,
    },
    {
      id: "getStudentsByRoute",
      label: "Get Students by Route",
      icon: <MapPin />,
    },
    {
      id: "getDriverIssues",
      label: "Get Driver Issues",
      icon: <AlertTriangle />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-[#2C3E50] p-8">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-[#2C3E50]">
          Transport Management
        </h1>

        <p className="text-slate-500 mt-2">
          Manage your fleet, drivers, and student allocations.
        </p>
      </header>

      {currentView === "dashboard" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setCurrentView(btn.id)}
              className="p-8 bg-white rounded-3xl border-2 border-slate-200 hover:border-[#00BCD4] hover:shadow-xl transition-all duration-300 text-left group flex items-center gap-4"
            >
              <div className="text-[#00BCD4] bg-cyan-50 p-4 rounded-2xl group-hover:bg-[#00BCD4] group-hover:text-white transition">
                {btn.icon}
              </div>

              <h3 className="font-bold text-lg">{btn.label}</h3>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <button
            onClick={() => setCurrentView("dashboard")}
            className="flex items-center gap-2 text-[#00BCD4] font-bold hover:underline mb-8"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <RenderView viewId={currentView} />
        </div>
      )}
    </div>
  );
};

const RenderView = ({ viewId }) => {
  const [loading, setLoading] = useState(false);

  const titles = {
    addStudents: "Add Students to Route",
    getAllStudents: "Student Directory",
    getStudentsByRoute: "Route-wise Student List",
    getDriverIssues: "Reported Driver Issues",
  };

  const handleAddRoute = async () => {
    try {
      setLoading(true);

      const payload = {
        routeName: "Lb nagar",
        pickupStartTime: "8:00AM",
        dropStartTime: "9:00AM",
        vehicleName: "BUS",
        vehicleNumber: "TS05ER6789",
      };

      console.log("Sending Payload:", payload);

      const response = await addRouteApi.post(
        "/api/student/transport/route",
        payload
      );

      console.log("Success Response:", response.data);

      alert(
        `Route Created Successfully!\nRoute ID: ${response.data.routeId}`
      );
    } catch (error) {
      console.error("Add Route Error:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      }

      alert("Failed to Create Route");
    } finally {
      setLoading(false);
    }
  };

  if (viewId === "assignDriver") {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">
          Create Transport Route
        </h2>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
          <div className="space-y-2 mb-6">
            <p>
              <strong>Route Name:</strong> LB Nagar
            </p>

            <p>
              <strong>Pickup Time:</strong> 8:00 AM
            </p>

            <p>
              <strong>Drop Time:</strong> 9:00 AM
            </p>

            <p>
              <strong>Vehicle Name:</strong> BUS
            </p>

            <p>
              <strong>Vehicle Number:</strong> TS05ER6789
            </p>
          </div>

          <button
            onClick={handleAddRoute}
            disabled={loading}
            className="bg-[#00BCD4] text-white px-6 py-3 rounded-xl hover:bg-cyan-600 disabled:opacity-50"
          >
            {loading ? "Creating Route..." : "Create Route"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">
        {titles[viewId]}
      </h2>

      <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <p className="text-slate-500">
          This section will be connected to its API later.
        </p>
      </div>
    </div>
  );
};

export default TransportManagement;