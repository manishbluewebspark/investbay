import { SiGoogleanalytics } from "react-icons/si";
import { MdSwapCalls } from "react-icons/md";
import Dashboard from "../../../assets/sidebar/dashboard.svg";
import Course from "../../../assets/sidebar/course.svg";
import Earning from "../../../assets/sidebar/Earning.svg";
import Plan from "../../../assets/sidebar/plan.svg";


const sidebarLinks = [
  {
    name: "Dashboard",
    icon: Dashboard,
    path: "/admin/dashboard",
    roles: ["admin", "RA"],
  },
        {
    name: "Plans",
    icon: Plan,
    path: "/admin/plan",
    roles: ["RA"],
  },
  {
    name: "Research analyst",
    icon: SiGoogleanalytics,
    path: "/admin/research-analyst",
    roles: ["admin"],
  },
  {
    name: "Signals",
    icon: MdSwapCalls,
    path: "/admin/signals",
    roles: ["RA"],
  },
  {
    name: "Courses",
    icon: Course,
    path: "/admin/courses",
    roles: ["RA"],
  },
    {
    name: "Earnings",
    icon: Earning,
    path: "/admin/earning",
    roles: ["RA"],
  },

];

export default sidebarLinks;
