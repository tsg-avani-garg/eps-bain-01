// import React, { useState } from "react";
// import "../Styling/AuthForm.css";
// import Login from "./Login";
// import Signup from "./Signup";

// export default function AuthForm() {
//   const [isLogin, setIsLogin] = useState(true);

//   const toggleLogin = () => setIsLogin(true);
//   const toggleSignup = () => setIsLogin(false);

//   return (
//     <div className="container">
//       <div className="form-container">
//         <div className="form-toggle">
//           <button className={isLogin ? "active" : ""} onClick={toggleLogin}>
//             Login
//           </button>
//           <button className={!isLogin ? "active" : ""} onClick={toggleSignup}>
//             Signup
//           </button>
//         </div>
//         {isLogin ? (
//           <Login toggleSignup={toggleSignup} />
//         ) : (
//           <Signup toggleLogin={toggleLogin} />
//         )}
//       </div>
//     </div>
//   );
// }
