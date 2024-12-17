export default function ProviderDashboard() {
  return (
    <div>
      <main className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Welcome to Provider Dashboard</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Site Settings</h3>
            <p className="text-muted-foreground">Configure your site preferences and global settings</p>
          </div>
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">User Management</h3>
            <p className="text-muted-foreground">Manage users, roles, and permissions</p>
          </div>
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Organization</h3>
            <p className="text-muted-foreground">Manage your organization structure and settings</p>
          </div>
        </div>
      </main>
    </div>
  );
}
