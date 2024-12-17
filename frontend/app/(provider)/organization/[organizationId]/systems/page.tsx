'use client'

export default function SystemsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Systems</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">
          Manage and monitor your organization&apos;s systems and their security configurations.
        </p>
        <div className="grid gap-4">
          <div className="border rounded p-4">
            <h2 className="text-lg font-medium mb-2">System Overview</h2>
            <p className="text-gray-600">View and manage all systems in your organization.</p>
          </div>
          <div className="border rounded p-4">
            <h2 className="text-lg font-medium mb-2">System Security</h2>
            <p className="text-gray-600">Monitor and maintain system security controls.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
