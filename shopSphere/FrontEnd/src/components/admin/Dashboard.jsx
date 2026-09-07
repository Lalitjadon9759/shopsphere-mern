import React from "react";

const DashboardCard = ({
  title,
  value,
  icon,
  color = "bg-blue-600",
}) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>
        </div>

        <div
          className={`${color} rounded-xl p-4 text-white`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;