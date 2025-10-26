import React from 'react'
import { FileText, CheckCircle2, AlertCircle } from "lucide-react";

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
          Upload a <span className="font-semibold">.csv file</span> with exactly <span className="font-semibold">2 columns</span>:
        </p>

        {/* Column List */}
        <div className="grid gap-1.5">
          {[
            { name: 'rosterId', desc: 'unique identifier of the roster' },
            { name: 'studentId', desc: 'unique identifier of the student' }
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
                    <th className="text-left px-3 py-2 font-semibold text-gray-700 border-b-2 border-gray-200">rosterId</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-700 border-b-2 border-gray-200">studentId</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-3 py-2 text-gray-700 font-mono border-b border-gray-100">1</td>
                    <td className="px-3 py-2 text-gray-700 font-mono border-b border-gray-100">S10232</td>
                  </tr>
                  <tr className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-3 py-2 text-gray-700 font-mono border-b border-gray-100">2</td>
                    <td className="px-3 py-2 text-gray-700 font-mono border-b border-gray-100">S10441</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Warning Note */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-3 flex gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <p className="font-semibold mb-1">Important Note:</p>
            <p>
              This process adds students to existing rosters. Ensure that both the{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded font-semibold">rosterId</code> and{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded font-semibold">studentId</code> already exist
              in the system before uploading your CSV.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CsvHint
