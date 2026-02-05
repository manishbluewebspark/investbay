import { SiGoogleanalytics } from "react-icons/si";
import { MdSwapCalls } from "react-icons/md";
import Dashboard from "../../../assets/sidebar/Dashboard.svg";
import Course from "../../../assets/sidebar/course.svg";
import Earning from "../../../assets/sidebar/Earning.svg";
import Plan from "../../../assets/sidebar/plan.svg";
import Feed from "../../../assets/sidebar/feed.svg";
import Price from "../../../assets/sidebar/price.svg";


const sidebarLinks = [
  {
    name: "Dashboard",
    icon: Dashboard,
    path: "/admin/dashboard",
    roles: ["admin", "ra"],
  },
        {
    name: "Plans",
    icon: Plan,
    path: "/admin/plan",
    roles: ["ra"],
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
    roles: ["ra"],
  },
  {
    name: "Courses",
    icon: Course,
    path: "/admin/courses",
    roles: ["ra"],
  },
  {
    name: "Feed",
    icon: Feed,
    path: "/admin/adminfeed",
    roles: ["ra"],
  },
    {
    name: "Earnings",
    icon: Price,
    path: "/admin/earnings",
    roles: ["ra"],
  },

];

export default sidebarLinks;
