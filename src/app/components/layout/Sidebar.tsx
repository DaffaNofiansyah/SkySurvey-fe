"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TableCellsIcon,
  DocumentChartBarIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Survei", href: "/Surveys", icon: DocumentChartBarIcon },
  { name: "Data Respons", href: "/DataTable", icon: TableCellsIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 shadow-md">
        <h1 className="text-xl font-bold text-white">SkySurvey</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
              }`}
            >
              <item.icon
                className={`w-5 h-5 mr-3 transition-colors ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
