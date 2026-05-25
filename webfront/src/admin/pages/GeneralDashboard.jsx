import Dashboard from "./Dashboard";
import RaDashboard from "./RaDashboard";

export default function GeneralDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.role) {
        return <div>User not found or role missing</div>;
    }
    if (user.role === 'admin') {
        return <Dashboard />;
    }

    if (user.role === 'RA') {
        return <RaDashboard />;
    }

}