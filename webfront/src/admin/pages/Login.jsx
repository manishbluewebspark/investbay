// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FiEye, FiEyeOff } from "react-icons/fi";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");

//   const navigate = useNavigate();
//   const apiUrl = import.meta.env.VITE_API_URL;

//   const submit = async (e) => {
//     e.preventDefault();
//     setErr("");
//     setLoading(true);

//     try {
//       const response = await axios.post(`${apiUrl}/auth/login`, {
//         email,      
//         password,
//       });

//       const { token, user } = response.data;

//       if (token) {
//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(user));
//         navigate("/admin/dashboard", { replace: true });
//       } else {
//         setErr("Invalid response from server");
//       }
//     } catch (error) {
//       console.error(error);
//       setErr(error.response?.data?.message || "Login failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row px-4 py-4">
//       <div
//         className="hidden md:flex md:w-2/5 bg-cover bg-center text-white flex-col justify-between rounded-[20px] p-10"
//         style={{ backgroundImage: "url('/login.png')" }}
//       >
//         <div className="flex flex-col justify-between h-full">
//           <div className="rounded-full p-2 mt-4 w-60">
//             <img
//               src="/adminlogo.svg"
//               alt="Logo"
//               className="h-10 w-50"
//               draggable={false}
//             />
//           </div>
//           <div className="mb-6">
//             <p className="text-white text-4xl">
//               Next-Gen Investing for the Modern Trader.
//             </p>
//           </div>
//         </div>
//       </div>
//       <div className="w-full md:w-3/5 flex items-center justify-center bg-gray-50">
//         <form onSubmit={submit} className="w-full max-w-lg p-8">
//           <h1 className="text-3xl mb-1">
//             Welcome Back to{" "}
//             <span className="gradient-text font-semibold">InvestBay</span>
//           </h1>
//           <p className="text-sm text-gray-500 mb-6">
//             Securely log in to access your personalized investment dashboard.
//           </p>
//           <label className="block text-sm mb-1">
//             Email or User ID
//           </label>
//           <input
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             type="text"
//             placeholder="Enter email or user ID"
//           />
//           <label className="block text-sm mb-1">Password</label>
//           <div className="relative mb-4">
//             <input
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter password"
//             />

//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
//             >
//               {showPassword ? <FiEyeOff /> : <FiEye />}
//             </button>
//           </div>

//           {err && <p className="text-sm text-red-600 mb-2">{err}</p>}

//           <div className="flex justify-end mb-3">
//             <a
//               href="/admin/forgot-password"
//               className="text-sm text-blue-500 hover:underline"
//             >
//               Forgot Password?
//             </a>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-black text-white rounded-lg py-2 font-medium hover:opacity-90 disabled:opacity-60"
//           >
//             {loading ? "Logging in…" : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  // const submit = async (e) => {
  //   e.preventDefault();
  //   setErr("");
  //   setLoading(true);

  //   try {
  //     // Use admin login endpoint
  //     const response = await axios.post(`${apiUrl}/auth/admin/login`, {
  //       email,      
  //       password,
  //     });

  //     const { token, user } = response.data;

  //     if (token && user.isAdmin) {
  //       localStorage.setItem("token", token);
  //       localStorage.setItem("user", JSON.stringify(user));
  //       localStorage.setItem("isAdmin", "true");
        
  //       navigate("/admin/dashboard", { replace: true });
  //     } else {
  //       setErr("Invalid admin credentials");
  //     }
  //   } catch (error) {
  //     console.error("Admin login error:", error);
      
  //     // If admin login fails, try regular login
  //     if (error.response?.status === 401 || error.response?.status === 404) {
  //       // Try regular user login
  //       try {
  //         const regularResponse = await axios.post(`${apiUrl}/auth/login`, {
  //           email,
  //           password,
  //         });
          
  //         const { token, user } = regularResponse.data;
          
  //         if (token) {
  //           localStorage.setItem("token", token);
  //           localStorage.setItem("user", JSON.stringify(user));
            
  //           // Redirect based on user role
  //           if (user.role === 'admin') {
  //             navigate("/admin/dashboard", { replace: true });
  //           } else {
  //             navigate("/admin/dashboard", { replace: true });
  //           }
  //         }
  //       } catch (regularError) {
  //         setErr(regularError.response?.data?.message || "Login failed. Please try again.");
  //       }
  //     } else {
  //       setErr(error.response?.data?.message || "Login failed. Please try again.");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };





  const submit = async (e) => {
  e.preventDefault();
  setErr("");
  setLoading(true);

  // Clear any existing auth data (for safety)
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("isAdmin");

  try {
    // First, try admin login endpoint
    const response = await axios.post(`${apiUrl}/auth/admin/login`, {
      email: email.trim().toLowerCase(),
      password,
    });

    const { token, user, success, message } = response.data;

    if (success && token && user) {
      // Store authentication data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Store role-specific flag
      if (user.role === 'admin' || user.isAdmin) {
        localStorage.setItem("isAdmin", "true");
      }

      // Determine redirect path based on user role
      let redirectPath = "/dashboard"; // Default fallback
      
      switch (user.role?.toLowerCase()) {
        case 'admin':
          redirectPath = "/admin/dashboard";
          break;
        case 'ra': // Research Analyst
          redirectPath = "/admin/dashboard";
          break;
        case 'user':
          redirectPath = "/user/dashboard";
          break;
        case 'moderator':
          redirectPath = "/moderator/dashboard";
          break;
        default:
          redirectPath = "/dashboard";
      }

      // Show success message briefly before redirecting
      setErr("Login successful! Redirecting...");
      
      // Delay redirect slightly to show success message
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 500);

      return; // Exit early on success
    } else {
      // If admin login returns success:false but no error code
      setErr(message || "Invalid admin credentials");
    }
  } catch (error) {
    console.error("Admin login error:", error);
    
    // Check if it's an admin-specific error (admin not found or not authorized)
    const isAdminError = error.response?.status === 401 || 
                         error.response?.status === 403 || 
                         error.response?.status === 404;
    
    if (isAdminError) {
      // User exists but is not an admin, try regular login
      try {
        const regularResponse = await axios.post(`${apiUrl}/auth/login`, {
          email: email.trim().toLowerCase(),
          password,
        });
        
        const { token, user, success, message } = regularResponse.data;
        
        if (success && token && user) {
          // Store authentication data
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          
          // Store role-specific flag
          if (user.role === 'admin') {
            localStorage.setItem("isAdmin", "true");
          }

          // Determine redirect path based on user role
          let redirectPath = "/dashboard";
          let welcomeMessage = `Welcome, ${user.name || user.email}!`;
          
          switch (user.role?.toLowerCase()) {
            case 'admin':
              redirectPath = "/admin/dashboard";
              welcomeMessage = "Admin login successful!";
              break;
            case 'ra':
              redirectPath = "/admin/dashboard";
              welcomeMessage = "Research Analyst login successful!";
              break;
            case 'user':
              redirectPath = "/user/dashboard";
              break;
            case 'moderator':
              redirectPath = "/moderator/dashboard";
              break;
            default:
              // Check for custom roles or fallback
              if (user.role) {
                redirectPath = `/${user.role.toLowerCase()}/dashboard`;
              }
          }

          // Show role-specific success message
          setErr(welcomeMessage);
          
          // Delay redirect to show message
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 500);
          
          return; // Exit on successful regular login
        } else {
          setErr(message || "Login failed. Please check your credentials.");
        }
      } catch (regularError) {
        // Handle regular login errors
        console.error("Regular login error:", regularError);
        
        const errorMessage = regularError.response?.data?.message ||
                           regularError.message ||
                           "Login failed. Please try again.";
        
        // Specific error messages based on status code
        if (regularError.response?.status === 401) {
          setErr("Invalid email or password");
        } else if (regularError.response?.status === 403) {
          setErr("Account is disabled. Please contact support.");
        } else if (regularError.response?.status === 404) {
          setErr("Account not found. Please check your email.");
        } else if (regularError.response?.status === 429) {
          setErr("Too many login attempts. Please try again later.");
        } else if (regularError.response?.status === 500) {
          setErr("Server error. Please try again later.");
        } else {
          setErr(errorMessage);
        }
      }
    } else {
      // Handle other admin login errors (network, server errors, etc.)
      if (error.code === 'ERR_NETWORK') {
        setErr("Network error. Please check your connection.");
      } else if (error.response?.status === 500) {
        setErr("Server error. Please try again later.");
      } else if (error.response?.status === 429) {
        setErr("Too many login attempts. Please wait and try again.");
      } else {
        setErr(error.response?.data?.message || "Login failed. Please try again.");
      }
    }
  } finally {
    setLoading(false);
  }
};


  const handleUserLoginRedirect = () => {
    navigate("/user-login"); // Regular user login page
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row px-4 py-4">
      <div
        className="hidden md:flex md:w-2/5 bg-cover bg-center text-white flex-col justify-between rounded-[20px] p-10"
        style={{ backgroundImage: "url('/login.png')" }}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="rounded-full p-2 mt-4 w-60">
            <img
              src="/adminlogo.svg"
              alt="Logo"
              className="h-10 w-50"
              draggable={false}
            />
          </div>
          <div className="mb-6">
            <p className="text-white text-4xl">
              Admin Portal
            </p>
            <p className="text-white text-lg mt-2">
              Next-Gen Investing Platform
            </p>
          </div>
        </div>
      </div>
      <div className="w-full md:w-3/5 flex items-center justify-center bg-gray-50">
        <form onSubmit={submit} className="w-full max-w-lg p-8">
          <h1 className="text-3xl mb-1">
            Login
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Secure access to InvestBay Admin Dashboard
          </p>
          
          <label className="block text-sm mb-1 text-gray-700">
            Email / UserId
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="enter email or user id"
            required
          />
          
          <label className="block text-sm mb-1 text-gray-700">
            Password
          </label>
          <div className="relative mb-6">
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {err && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-black text-white rounded-lg py-3 font-medium hover:opacity-90 disabled:opacity-60 transition duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging...
              </span>
            ) : "Login"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 mb-2">
              Forgot password? Contact system administrator
            </p>
            <p className="text-xs text-gray-500">
              Regular user?{" "}
              <button
                type="button"
                onClick={handleUserLoginRedirect}
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                User Login
              </button>
            </p>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700 font-medium mb-1">Default Admin Credentials:</p>
            <p className="text-xs text-yellow-600">
              Email: <span className="font-mono">admin@investbay.com</span><br/>
              Password: <span className="font-mono">Admin@123</span>
            </p>
            <p className="text-xs text-yellow-600 mt-2">
              Run <span className="font-mono">/api/auth/seed</span> to create admin if not exists
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}