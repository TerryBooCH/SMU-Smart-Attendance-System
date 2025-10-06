import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, School, Video, FileText, ArrowRight } from "lucide-react";

const QuickNav = () => {
  // Call useNavigate at the component level, not inside a function
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const navItems = [
    {
      id: "sessions",
      title: "Manage Sessions",
      description:
        "Set up and monitor attendance sessions with course details and real-time status.",
      icon: School,
      primary: true,
      gradient: "from-blue-600 to-blue-700",
      path: "/sessions",
    },
    {
      id: "students",
      title: "Manage Students",
      description:
        "Enroll students and manage profiles with facial recognition data.",
      icon: Users,
      gradient: "from-purple-600 to-purple-700",
      path: "/students",
    },
    {
      id: "recognition",
      title: "Live Recognition",
      description: "Real-time face detection and automatic attendance marking.",
      icon: Video,
      gradient: "from-emerald-600 to-emerald-700",
      path: "/recognition",
    },
    {
      id: "reports",
      title: "Generate Reports",
      description:
        "Comprehensive analytics and export options for attendance data.",
      icon: FileText,
      gradient: "from-orange-600 to-orange-700",
      path: "/reports",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-8 pb-16 flex-1">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h2>
        <p className="text-gray-600">
          Choose an action to get started with your attendance management.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Action - Larger card */}
        <div
          className="lg:col-span-1 group cursor-pointer transform hover:scale-[1.02] transition-all duration-300"
          onClick={() => handleNavigation(navItems[0].path)}
        >
          <div className="relative overflow-hidden bg-white rounded-3xl p-8 h-full shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-300">
            {/* Background gradient overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${navItems[0].gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
            ></div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`p-4 rounded-2xl bg-gradient-to-br ${navItems[0].gradient} shadow-lg`}
                >
                  {React.createElement(navItems[0].icon, {
                    size: 32,
                    className: "text-white",
                    strokeWidth: 2,
                  })}
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  Primary
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                {navItems[0].title}
              </h3>

              <p className="text-gray-600 leading-relaxed mb-6">
                {navItems[0].description}
              </p>

              <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all duration-300">
                Get Started
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Actions Grid */}
        <div className="space-y-6">
          {navItems.slice(1).map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer transform hover:scale-[1.02] transition-all duration-300"
              onClick={() => handleNavigation(item.path)}
            >
              <div className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300">
                {/* Background gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>

                {/* Content */}
                <div className="relative z-10 flex items-start gap-5">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} shadow-md flex-shrink-0`}
                  >
                    <item.icon
                      size={24}
                      className="text-white"
                      strokeWidth={2}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900 text-lg group-hover:text-gray-700 transition-colors">
                        {item.title}
                      </h4>
                      <ArrowRight
                        size={16}
                        className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                      />
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickNav;
