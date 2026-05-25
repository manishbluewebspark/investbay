import RaProfile from "./RaProfile";
import AdminProfile from "./AdminProfile";

export default function Profile() {


    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user?.role;

 



  return (
    <>
      {role === "ra" && <RaProfile />}
      {role === "admin" && <AdminProfile />}
    </>
  );
}
