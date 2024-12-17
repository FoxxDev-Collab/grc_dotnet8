'use client'

export default function RMFPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Risk Management Framework (RMF)</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">
          The Risk Management Framework (RMF) provides a structured approach to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Identify security categorization and impact levels</li>
          <li>Select appropriate security controls</li>
          <li>Implement security controls</li>
          <li>Assess control effectiveness</li>
          <li>Authorize the system</li>
          <li>Monitor security controls</li>
        </ul>
      </div>
    </div>
  )
}
