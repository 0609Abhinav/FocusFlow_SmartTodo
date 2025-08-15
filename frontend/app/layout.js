import "./globals.css";
import React from "react";

export const metadata = {
  title: "FocusFlow - Smart Todo with AI",
  description: "Assignment build",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen text-gray-800">
        <div className="max-w-6xl mx-auto p-4">
          {/* Header */}
          <header className="sticky top-0 bg-white/80 backdrop-blur-md rounded-lg shadow-sm px-6 py-4 flex flex-col sm:flex-row justify-between items-center mb-6 z-50 border border-gray-200">
            {/* Logo / Title */}
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="text-blue-600">Focus</span>Flow
              <span className="text-gray-600 text-sm ml-2">Smart Todo with AI</span>
            </h1>

            {/* Navigation */}
            <nav className="flex space-x-4 mt-3 sm:mt-0">
              <a
                href="/"
                className="px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
              >
                Dashboard
              </a>
              <a
                href="/task/new"
                className="px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
              >
                New Task
              </a>
              <a
                href="/context"
                className="px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
              >
                Context
              </a>
            </nav>
          </header>

          {/* Page Content */}
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
