import { SiGoogleanalytics ,} from "react-icons/si";
import { FaUser } from "react-icons/fa";
import { IoLogIn } from "react-icons/io5";
import { MdSwapCalls } from "react-icons/md";
import { FaNewspaper } from "react-icons/fa6";
import Dashboard from "../../../assets/sidebar/Dashboard.svg";
import Course from "../../../assets/sidebar/course.svg";
import Earning from "../../../assets/sidebar/Earning.svg";
import Plan from "../../../assets/sidebar/plan.svg";
import Feed from "../../../assets/sidebar/feed.svg";
import Price from "../../../assets/sidebar/price.svg";

const userRole = JSON.parse(localStorage.getItem('user'))?.role;
const feedTitle = userRole === 'admin' ? 'Feeds' : 'My Feeds';
console.log(feedTitle)


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
    name: "Users",
    icon: FaUser,
    path: "/admin/users",
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
    name: feedTitle,
    icon: Feed,
    path: "/admin/adminfeed",
    roles: ["admin","ra"],
  },
  {
    name: "News",
    icon: FaNewspaper,
    path: "/admin/News",
    roles: ["admin"],
  },

  {
    name: "Logs",
    icon: IoLogIn,
    path: "/admin/logs",
    roles: ["admin"],
  },

    {
    name: "Earnings",
    icon: Price,
    path: "/admin/earnings",
    roles: ["ra"],
  },

];

export default sidebarLinks;
