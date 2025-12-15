import { Link } from "react-router-dom";

export default function Messages() {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-3">Messages</h1>
      <p className="text-sm text-muted-foreground mb-4">Choose a channel to view and post messages. Messages are ephemeral (auto-delete after ~30s) and are not stored.</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/messages/global" className="p-4 border rounded-lg hover:shadow-md">
          <h2 className="font-medium">Global Messages</h2>
          <p className="text-sm text-muted-foreground">Announcements and public posts for all students.</p>
        </Link>

        <Link to="/messages/personal" className="p-4 border rounded-lg hover:shadow-md">
          <h2 className="font-medium">Personal Messages</h2>
          <p className="text-sm text-muted-foreground">Private messages visible only to you.</p>
        </Link>
      </div>
    </div>
  );
}
