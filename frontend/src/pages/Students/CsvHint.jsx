import React from 'react'
import { FileText, CheckCircle2 } from "lucide-react";

const CsvHint = () => {
  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-xl overflow-hidden shadow-sm border border-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5">
        <div className="flex items-center gap-2 text-white">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm">CSV Format Requirements</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <p className="text-xs text-gray-700">
          Upload a <span className="font-semibold">.csv file</span> with exactly <span className="font-semibold">5 columns</span>:
        </p>

        {/* Column List */}
        <div className="grid gap-1.5">
          {[
            { name: 'studentId', desc: 'unique identifier' },
            { name: 'name', desc: 'full name' },
            { name: 'email', desc: 'contact email' },
            { name: 'phone', desc: 'phone number' },
            { name: 'className', desc: 'class/section' }
          ].map((field, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
              <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
              <code className="text-xs font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                {field.name}
              </code>
              <span className="text-gray-600 text-xs">– {field.desc}</span>
            </div>
          ))}
        </div>

        {/* Example */}
        <div className="space-y-2">
          <p className="font-semibold text-xs text-gray-900 flex items-center gap-2">
            <span className="w-1 h-4 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></span>
            Example Format
          </p>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="text-left px-3 py-2 font-semibold text-gray-700 border-b-2 border-gray-200">studentId</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-700 border-b-2 border-gray-200">name</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-700 border-b-2 border-gray-200">email</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-700 border-b-2 border-gray-200">phone</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-700 border-b-2 border-gray-200">className</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-3 py-2 text-gray-700 font-mono border-b border-gray-100">S10122</td>
                    <td className="px-3 py-2 text-gray-700 border-b border-gray-100">John Doe</td>
                    <td className="px-3 py-2 text-gray-600 border-b border-gray-100">john@example.com</td>
                    <td className="px-3 py-2 text-gray-600 font-mono border-b border-gray-100">1234 5678</td>
                    <td className="px-3 py-2 text-gray-700 border-b border-gray-100">CS102</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CsvHint