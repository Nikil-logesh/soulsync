// "use client";

// import { useRouter } from "next/navigation";
// import { useSafeAuth } from '../contexts/useSafeAuth';

// // Disable SSR for this page
// export const dynamic = 'force-dynamic';

// export default function HomePage() {
//   const router = useRouter();
//   const { user, loading } = useSafeAuth();
  
//   const isAuthenticated = !!user;

//   // Loading state
//   if (loading) {
//     return (
//       <div style={{ 
//         minHeight: '100vh', 
//         backgroundColor: '#f0f0f0', 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'center',
//         fontFamily: 'Arial, sans-serif'
//       }}>
//         <div style={{ textAlign: 'center' }}>
//           <h2 style={{ color: '#333', marginBottom: '10px' }}>SoulSync</h2>
//           <p style={{ color: '#666' }}>Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{
//       minHeight: '100vh',
//       backgroundColor: '#ffffff',
//       fontFamily: 'Arial, sans-serif',
//       margin: 0,
//       padding: 0
//     }}>
//       {/* Simple Header */}
//       <header style={{
//         backgroundColor: '#4169e1',
//         color: 'white',
//         padding: '40px 20px',
//         textAlign: 'center'
//       }}>
//         <h1 style={{ margin: 0, fontSize: '36px' }}>SoulSync</h1>
//         <p style={{ margin: '10px 0 0 0', fontSize: '18px' }}>
//           Mental Wellness Platform
//         </p>
//       </header>

//       {/* Simple Navigation */}
//       <nav style={{
//         backgroundColor: '#f8f9fa',
//         borderBottom: '1px solid #ddd',
//         padding: '15px 20px',
//         textAlign: 'center'
//       }}>
//         <button
//           onClick={() => router.push('/about')}
//           style={{
//             backgroundColor: 'transparent',
//             border: 'none',
//             padding: '10px 20px',
//             margin: '0 10px',
//             cursor: 'pointer',
//             fontSize: '16px',
//             color: '#4169e1',
//             textDecoration: 'underline'
//           }}
//         >
//           About
//         </button>
//         <button
//           onClick={() => router.push('/contact')}
//           style={{
//             backgroundColor: 'transparent',
//             border: 'none',
//             padding: '10px 20px',
//             margin: '0 10px',
//             cursor: 'pointer',
//             fontSize: '16px',
//             color: '#4169e1',
//             textDecoration: 'underline'
//           }}
//         >
//           Contact
//         </button>
//       </nav>

//       {/* Main Content */}
//       <main style={{ padding: '40px 20px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
//         <h2 style={{ color: '#333', marginBottom: '20px', fontSize: '32px', fontWeight: 'bold' }}>
//           Your Mental Wellness Journey Starts Here
//         </h2>
//         <p style={{ 
//           color: '#666', 
//           fontSize: '20px', 
//           lineHeight: '1.7', 
//           maxWidth: '700px', 
//           margin: '0 auto 40px auto',
//           fontWeight: '400'
//         }}>
//           SoulSync provides secure, personalized mental health support with AI-powered guidance, 
//           professional screenings, and seamless campus integration for students and institutions.
//         </p>

//         {/* Main Action Boxes */}
//         <div style={{ 
//           display: 'flex', 
//           justifyContent: 'center', 
//           flexWrap: 'wrap', 
//           gap: '30px',
//           marginTop: '40px',
//           alignItems: 'stretch'
//         }}>
//           {/* Sign In to SoulSync Box */}
//           <div style={{
//             border: '3px solid #4169e1',
//             borderRadius: '12px',
//             padding: '40px',
//             width: '320px',
//             minHeight: '400px',
//             backgroundColor: '#ffffff',
//             boxShadow: '0 8px 25px rgba(65, 105, 225, 0.15)',
//             cursor: 'pointer',
//             transition: 'all 0.3s ease',
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'space-between'
//           }}
//           onClick={() => router.push(isAuthenticated ? "/dashboard" : "/signin")}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.transform = 'translateY(-5px)';
//             e.currentTarget.style.boxShadow = '0 12px 35px rgba(65, 105, 225, 0.25)';
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.transform = 'translateY(0)';
//             e.currentTarget.style.boxShadow = '0 8px 25px rgba(65, 105, 225, 0.15)';
//           }}
//           >
//             <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//               <div style={{
//                 width: '60px',
//                 height: '60px',
//                 backgroundColor: '#4169e1',
//                 borderRadius: '50%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 margin: '0 auto 20px auto'
//               }}>
//                 <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>🔐</span>
//               </div>
//               <h3 style={{ 
//                 color: '#4169e1', 
//                 marginBottom: '15px', 
//                 fontSize: '24px',
//                 fontWeight: 'bold',
//                 textAlign: 'center'
//               }}>
//                 {isAuthenticated ? "Access Dashboard" : "Sign In to SoulSync"}
//               </h3>
//               <p style={{ 
//                 color: '#666', 
//                 lineHeight: '1.6', 
//                 marginBottom: '25px',
//                 fontSize: '16px',
//                 textAlign: 'center',
//                 flex: 1
//               }}>
//                 {isAuthenticated 
//                   ? "Welcome back! Access your personalized mental wellness dashboard with all your tools and progress."
//                   : "Get secure access to your personalized mental wellness platform with AI support, screenings, and resources."
//                 }
//               </p>
//             </div>
//             <button style={{
//               backgroundColor: '#4169e1',
//               color: 'white',
//               border: 'none',
//               padding: '14px 28px',
//               cursor: 'pointer',
//               fontSize: '16px',
//               fontWeight: '600',
//               borderRadius: '8px',
//               width: '100%',
//               transition: 'all 0.2s ease',
//               marginTop: 'auto'
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor = '#3151c7';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor = '#4169e1';
//             }}
//             >
//               {isAuthenticated ? "Go to Dashboard" : "Sign In Now"}
//             </button>
//           </div>

//           {/* Campus Integration Box */}
//           <div style={{
//             border: '3px solid #28a745',
//             borderRadius: '12px',
//             padding: '40px',
//             width: '320px',
//             minHeight: '400px',
//             backgroundColor: '#ffffff',
//             boxShadow: '0 8px 25px rgba(40, 167, 69, 0.15)',
//             cursor: 'pointer',
//             transition: 'all 0.3s ease',
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'space-between'
//           }}
//           onClick={() => router.push('/integrate-campus')}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.transform = 'translateY(-5px)';
//             e.currentTarget.style.boxShadow = '0 12px 35px rgba(40, 167, 69, 0.25)';
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.transform = 'translateY(0)';
//             e.currentTarget.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.15)';
//           }}
//           >
//             <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//               <div style={{
//                 width: '60px',
//                 height: '60px',
//                 backgroundColor: '#28a745',
//                 borderRadius: '50%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 margin: '0 auto 20px auto'
//               }}>
//                 <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>🏫</span>
//               </div>
//               <h3 style={{ 
//                 color: '#28a745', 
//                 marginBottom: '15px', 
//                 fontSize: '24px',
//                 fontWeight: 'bold',
//                 textAlign: 'center'
//               }}>
//                 Campus Integration
//               </h3>
//               <p style={{ 
//                 color: '#666', 
//                 lineHeight: '1.6', 
//                 marginBottom: '25px',
//                 fontSize: '16px',
//                 textAlign: 'center',
//                 flex: 1
//               }}>
//                 Connect SoulSync with your educational institution for seamless access to mental health resources and campus counseling services.
//               </p>
//             </div>
//             <button style={{
//               backgroundColor: '#28a745',
//               color: 'white',
//               border: 'none',
//               padding: '14px 28px',
//               cursor: 'pointer',
//               fontSize: '16px',
//               fontWeight: '600',
//               borderRadius: '8px',
//               width: '100%',
//               transition: 'all 0.2s ease',
//               marginTop: 'auto'
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor = '#1e7e34';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor = '#28a745';
//             }}
//             >
//               Request Integration
//             </button>
//           </div>
//         </div>

//         {/* Additional Info Section */}
//         <div style={{ 
//           marginTop: '60px',
//           padding: '50px 30px',
//           backgroundColor: '#f8f9fb',
//           borderRadius: '12px',
//           border: '1px solid #e6e9ef'
//         }}>
//           <h3 style={{ color: '#333', marginBottom: '30px', fontSize: '28px', fontWeight: 'bold' }}>
//             Why Choose SoulSync?
//           </h3>
//           <div style={{
//             display: 'flex',
//             justifyContent: 'center',
//             flexWrap: 'wrap',
//             gap: '40px',
//             marginTop: '40px'
//           }}>
//             <div style={{ maxWidth: '250px', textAlign: 'center' }}>
//               <div style={{
//                 width: '50px',
//                 height: '50px',
//                 backgroundColor: '#4169e1',
//                 borderRadius: '50%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 margin: '0 auto 15px auto'
//               }}>
//                 <span style={{ color: 'white', fontSize: '20px' }}>🔒</span>
//               </div>
//               <h4 style={{ color: '#4169e1', marginBottom: '12px', fontSize: '18px', fontWeight: 'bold' }}>
//                 Private & Secure
//               </h4>
//               <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.5' }}>
//                 Your mental health data is protected with enterprise-grade security and privacy controls.
//               </p>
//             </div>
//             <div style={{ maxWidth: '250px', textAlign: 'center' }}>
//               <div style={{
//                 width: '50px',
//                 height: '50px',
//                 backgroundColor: '#28a745',
//                 borderRadius: '50%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 margin: '0 auto 15px auto'
//               }}>
//                 <span style={{ color: 'white', fontSize: '20px' }}>🏫</span>
//               </div>
//               <h4 style={{ color: '#28a745', marginBottom: '12px', fontSize: '18px', fontWeight: 'bold' }}>
//                 Campus Ready
//               </h4>
//               <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.5' }}>
//                 Seamlessly integrates with educational institutions for comprehensive student support.
//               </p>
//             </div>
//             <div style={{ maxWidth: '250px', textAlign: 'center' }}>
//               <div style={{
//                 width: '50px',
//                 height: '50px',
//                 backgroundColor: '#17a2b8',
//                 borderRadius: '50%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 margin: '0 auto 15px auto'
//               }}>
//                 <span style={{ color: 'white', fontSize: '20px' }}>🤖</span>
//               </div>
//               <h4 style={{ color: '#17a2b8', marginBottom: '12px', fontSize: '18px', fontWeight: 'bold' }}>
//                 AI-Powered Support
//               </h4>
//               <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.5' }}>
//                 Advanced AI provides personalized guidance and evidence-based mental health tools.
//               </p>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Simple Footer */}
//       <footer style={{
//         backgroundColor: '#f8f9fa',
//         borderTop: '1px solid #ddd',
//         padding: '20px',
//         textAlign: 'center',
//         marginTop: '40px'
//       }}>
//         <p style={{ color: '#666', margin: 0 }}>
//           © 2024 SoulSync Mental Wellness Platform. All rights reserved.
//         </p>
//       </footer>
//     </div>
//   );
// }




// "use client";

// import { useRouter } from "next/navigation";
// import { useSafeAuth } from "../contexts/useSafeAuth";

// // Disable SSR for this page
// export const dynamic = "force-dynamic";

// export default function HomePage() {
//   const router = useRouter();
//   const { user, loading } = useSafeAuth();
//   const isAuthenticated = !!user;

//   // Loading state
//   if (loading) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           background: "linear-gradient(135deg,#4169e1,#28a745)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontFamily: "Arial, sans-serif",
//         }}
//       >
//         <div style={{ textAlign: "center" }}>
//           <h2 style={{ color: "white", marginBottom: "10px" }}>SoulSync</h2>
//           <p style={{ color: "#f0f0f0" }}>Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   const cardStyle = (borderColor: string, shadowColor: string) => ({
//     border: `2px solid ${borderColor}`,
//     borderRadius: "16px",
//     padding: "40px 30px",
//     width: "320px",
//     minHeight: "420px",
//     backgroundColor: "#ffffff",
//     boxShadow: `0 8px 20px ${shadowColor}`,
//     cursor: "pointer",
//     display: "flex",
//     flexDirection: "column" as const,
//     justifyContent: "space-between",
//     transition: "transform .25s ease, box-shadow .25s ease",
//   });

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         backgroundColor: "#ffffff",
//         fontFamily: "'Poppins', Arial, sans-serif",
//         margin: 0,
//         padding: 0,
//       }}
//     >
//       {/* Hero */}
//       <header
//         style={{
//           background: "linear-gradient(135deg,#4169e1,#28a745)",
//           color: "white",
//           padding: "60px 20px",
//           textAlign: "center",
//         }}
//       >
//         <h1 style={{ margin: 0, fontSize: "44px", fontWeight: 700 }}>SoulSync</h1>
//         <p style={{ margin: "15px 0 0", fontSize: "20px", opacity: 0.9 }}>
//           Your Partner in Mental Wellness
//         </p>
//       </header>

//       {/* Sticky Nav */}
//       <nav
//         style={{
//           position: "sticky",
//           top: 0,
//           backgroundColor: "#ffffffcc",
//           backdropFilter: "blur(6px)",
//           borderBottom: "1px solid #ddd",
//           padding: "12px 20px",
//           display: "flex",
//           justifyContent: "center",
//           gap: "20px",
//           zIndex: 10,
//         }}
//       >
//         {[
//           { name: "About", path: "/about" },
//           { name: "Contact", path: "/contact" },
//         ].map((item) => (
//           <button
//             key={item.path}
//             onClick={() => router.push(item.path)}
//             style={{
//               backgroundColor: "transparent",
//               border: "none",
//               padding: "8px 16px",
//               fontSize: "16px",
//               color: "#4169e1",
//               fontWeight: 500,
//               cursor: "pointer",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.color = "#3151c7")}
//             onMouseLeave={(e) => (e.currentTarget.style.color = "#4169e1")}
//           >
//             {item.name}
//           </button>
//         ))}
//       </nav>

//       {/* Main Content */}
//       <main
//         style={{
//           padding: "60px 20px",
//           textAlign: "center",
//           maxWidth: "1200px",
//           margin: "0 auto",
//         }}
//       >
//         <h2
//           style={{
//             color: "#333",
//             marginBottom: "20px",
//             fontSize: "32px",
//             fontWeight: "bold",
//           }}
//         >
//           Your Mental Wellness Journey Starts Here
//         </h2>
//         <p
//           style={{
//             color: "#666",
//             fontSize: "20px",
//             lineHeight: "1.7",
//             maxWidth: "700px",
//             margin: "0 auto 50px",
//             fontWeight: "400",
//           }}
//         >
//           SoulSync provides secure, personalized mental health support with
//           AI-powered guidance, professional screenings, and seamless campus
//           integration for students and institutions.
//         </p>

//         {/* Cards */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             flexWrap: "wrap",
//             gap: "30px",
//             marginTop: "40px",
//             alignItems: "stretch",
//           }}
//         >
//           {/* Sign In Card */}
//           <div
//             style={cardStyle("#4169e1", "rgba(65,105,225,0.15)")}
//             onClick={() =>
//               router.push(isAuthenticated ? "/dashboard" : "/signin")
//             }
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = "scale(1.03)";
//               e.currentTarget.style.boxShadow =
//                 "0 12px 30px rgba(65,105,225,0.25)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = "scale(1)";
//               e.currentTarget.style.boxShadow =
//                 "0 8px 20px rgba(65,105,225,0.15)";
//             }}
//           >
//             <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//               <div
//                 style={{
//                   width: "60px",
//                   height: "60px",
//                   background: "linear-gradient(135deg,#4169e1,#3151c7)",
//                   borderRadius: "50%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   margin: "0 auto 20px",
//                 }}
//               >
//                 <span
//                   style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}
//                 >
//                   🔐
//                 </span>
//               </div>
//               <h3
//                 style={{
//                   color: "#4169e1",
//                   marginBottom: "15px",
//                   fontSize: "24px",
//                   fontWeight: "bold",
//                   textAlign: "center",
//                 }}
//               >
//                 {isAuthenticated ? "Access Dashboard" : "Sign In to SoulSync"}
//               </h3>
//               <p
//                 style={{
//                   color: "#666",
//                   lineHeight: "1.6",
//                   marginBottom: "25px",
//                   fontSize: "16px",
//                   textAlign: "center",
//                   flex: 1,
//                 }}
//               >
//                 {isAuthenticated
//                   ? "Welcome back! Access your personalized mental wellness dashboard with all your tools and progress."
//                   : "Get secure access to your personalized mental wellness platform with AI support, screenings, and resources."}
//               </p>
//             </div>
//             <button
//               style={{
//                 backgroundColor: "#4169e1",
//                 color: "white",
//                 border: "none",
//                 padding: "14px 28px",
//                 cursor: "pointer",
//                 fontSize: "16px",
//                 fontWeight: "600",
//                 borderRadius: "8px",
//                 width: "100%",
//                 transition: "background-color .2s ease",
//                 marginTop: "auto",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.backgroundColor = "#3151c7";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = "#4169e1";
//               }}
//             >
//               {isAuthenticated ? "Go to Dashboard" : "Sign In Now"}
//             </button>
//           </div>

//           {/* Campus Integration Card */}
//           <div
//             style={cardStyle("#28a745", "rgba(40,167,69,0.15)")}
//             onClick={() => router.push("/integrate-campus")}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = "scale(1.03)";
//               e.currentTarget.style.boxShadow =
//                 "0 12px 30px rgba(40,167,69,0.25)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = "scale(1)";
//               e.currentTarget.style.boxShadow =
//                 "0 8px 20px rgba(40,167,69,0.15)";
//             }}
//           >
//             <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//               <div
//                 style={{
//                   width: "60px",
//                   height: "60px",
//                   background: "linear-gradient(135deg,#28a745,#1e7e34)",
//                   borderRadius: "50%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   margin: "0 auto 20px",
//                 }}
//               >
//                 <span
//                   style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}
//                 >
//                   🏫
//                 </span>
//               </div>
//               <h3
//                 style={{
//                   color: "#28a745",
//                   marginBottom: "15px",
//                   fontSize: "24px",
//                   fontWeight: "bold",
//                   textAlign: "center",
//                 }}
//               >
//                 Campus Integration
//               </h3>
//               <p
//                 style={{
//                   color: "#666",
//                   lineHeight: "1.6",
//                   marginBottom: "25px",
//                   fontSize: "16px",
//                   textAlign: "center",
//                   flex: 1,
//                 }}
//               >
//                 Connect SoulSync with your educational institution for seamless
//                 access to mental health resources and campus counseling
//                 services.
//               </p>
//             </div>
//             <button
//               style={{
//                 backgroundColor: "#28a745",
//                 color: "white",
//                 border: "none",
//                 padding: "14px 28px",
//                 cursor: "pointer",
//                 fontSize: "16px",
//                 fontWeight: "600",
//                 borderRadius: "8px",
//                 width: "100%",
//                 transition: "background-color .2s ease",
//                 marginTop: "auto",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.backgroundColor = "#1e7e34";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = "#28a745";
//               }}
//             >
//               Request Integration
//             </button>
//           </div>
//         </div>

//         {/* Why Choose Section */}
//         <section
//           style={{
//             marginTop: "80px",
//             padding: "60px 30px",
//             background: "linear-gradient(180deg,#f8f9fb 0%,#ffffff 100%)",
//             borderRadius: "16px",
//             border: "1px solid #e6e9ef",
//           }}
//         >
//           <h3
//             style={{
//               color: "#333",
//               marginBottom: "30px",
//               fontSize: "32px",
//               fontWeight: "700",
//               textAlign: "center",
//             }}
//           >
//             Why Choose SoulSync?
//           </h3>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               flexWrap: "wrap",
//               gap: "50px",
//               marginTop: "40px",
//             }}
//           >
//             <div style={{ maxWidth: "250px", textAlign: "center" }}>
//               <div
//                 style={{
//                   width: "50px",
//                   height: "50px",
//                   backgroundColor: "#4169e1",
//                   borderRadius: "50%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   margin: "0 auto 15px",
//                 }}
//               >
//                 <span style={{ color: "white", fontSize: "20px" }}>🔒</span>
//               </div>
//               <h4
//                 style={{
//                   color: "#4169e1",
//                   marginBottom: "12px",
//                   fontSize: "18px",
//                   fontWeight: "bold",
//                 }}
//               >
//                 Private & Secure
//               </h4>
//               <p style={{ color: "#666", fontSize: "15px", lineHeight: "1.5" }}>
//                 Your mental health data is protected with enterprise-grade
//                 security and privacy controls.
//               </p>
//             </div>
//             <div style={{ maxWidth: "250px", textAlign: "center" }}>
//               <div
//                 style={{
//                   width: "50px",
//                   height: "50px",
//                   backgroundColor: "#28a745",
//                   borderRadius: "50%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   margin: "0 auto 15px",
//                 }}
//               >
//                 <span style={{ color: "white", fontSize: "20px" }}>🏫</span>
//               </div>
//               <h4
//                 style={{
//                   color: "#28a745",
//                   marginBottom: "12px",
//                   fontSize: "18px",
//                   fontWeight: "bold",
//                 }}
//               >
//                 Campus Ready
//               </h4>
//               <p style={{ color: "#666", fontSize: "15px", lineHeight: "1.5" }}>
//                 Seamlessly integrates with educational institutions for
//                 comprehensive student support.
//               </p>
//             </div>
//             <div style={{ maxWidth: "250px", textAlign: "center" }}>
//               <div
//                 style={{
//                   width: "50px",
//                   height: "50px",
//                   backgroundColor: "#17a2b8",
//                   borderRadius: "50%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   margin: "0 auto 15px",
//                 }}
//               >
//                 <span style={{ color: "white", fontSize: "20px" }}>🤖</span>
//               </div>
//               <h4
//                 style={{
//                   color: "#17a2b8",
//                   marginBottom: "12px",
//                   fontSize: "18px",
//                   fontWeight: "bold",
//                 }}
//               >
//                 AI-Powered Support
//               </h4>
//               <p style={{ color: "#666", fontSize: "15px", lineHeight: "1.5" }}>
//                 Advanced AI provides personalized guidance and evidence-based
//                 mental health tools.
//               </p>
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer
//         style={{
//           backgroundColor: "#f8f9fa",
//           borderTop: "1px solid #ddd",
//           padding: "30px 20px",
//           textAlign: "center",
//           marginTop: "60px",
//           fontSize: "14px",
//         }}
//       >
//         <p style={{ color: "#666", margin: 0 }}>
//           © 2024 SoulSync Mental Wellness Platform — All rights reserved.
//         </p>
//       </footer>
//     </div>
//   );
// }

// 'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

// export default function HomePage() {
//   const router = useRouter();

//   // optional: floating dots state
//   const [dots, setDots] = useState<
//     { id: number; top: string; left: string; size: string }[]
//   >([]);

//   useEffect(() => {
//     // create random dots
//     const newDots = Array.from({ length: 8 }).map((_, i) => ({
//       id: i,
//       top: `${Math.random() * 80}%`,
//       left: `${Math.random() * 90}%`,
//       size: `${8 + Math.random() * 12}px`
//     }));
//     setDots(newDots);
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col bg-white">
//       {/* NAVBAR */}
//       <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <img src="/logo.png" alt="SoulSync" className="h-10 w-auto" />
//             <span className="font-bold text-xl text-gray-800">SoulSync</span>
//           </div>
//           <div className="hidden md:flex gap-6">
//             <button
//               className="text-gray-700 hover:text-indigo-600 font-medium"
//               onClick={() => router.push('/solutions')}
//             >
//               Our Solutions
//             </button>
//             <button
//               className="text-gray-700 hover:text-indigo-600 font-medium"
//               onClick={() => router.push('/blog')}
//             >
//               Blog
//             </button>
//             <button
//               className="text-gray-700 hover:text-indigo-600 font-medium"
//               onClick={() => router.push('/festival')}
//             >
//               Festival of Joy
//             </button>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={() => router.push('/signin')}
//               className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-50 font-medium"
//             >
//               Login / Signup
//             </button>
//             <button
//               onClick={() => router.push('/demo')}
//               className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 font-medium"
//             >
//               Book a Demo
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* HERO SECTION */}
//       <section className="relative bg-gradient-to-b from-indigo-50 to-white flex-1 overflow-hidden">
//         {/* floating dots */}
//         {dots.map((dot) => (
//           <span
//             key={dot.id}
//             className="absolute rounded-full bg-indigo-200 opacity-60 animate-pulse"
//             style={{
//               top: dot.top,
//               left: dot.left,
//               width: dot.size,
//               height: dot.size
//             }}
//           />
//         ))}

//         <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
//           <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
//             Build Happier & Thriving Organisations
//           </h1>
//           <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
//             Transform your organisation by building a proactive culture of care,
//             resilience and well-being. Join the leaders who transformed
//             <span className="font-semibold text-gray-800">
//               {' '}
//               30 Lakh+ individuals
//             </span>{' '}
//             across 500+ organisations.
//           </p>

//           <div className="mt-10 flex justify-center gap-6">
//             <button
//               onClick={() => router.push('/workplaces')}
//               className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-indigo-700"
//             >
//               Workplaces
//             </button>
//             <button
//               onClick={() => router.push('/campuses')}
//               className="bg-indigo-100 text-indigo-700 px-8 py-3 rounded-full text-lg font-medium hover:bg-indigo-200"
//             >
//               Campuses
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* TRUSTED BY */}
//       <section className="py-8 border-t border-gray-100">
//         <div className="max-w-6xl mx-auto px-6">
//           <p className="text-center text-gray-500 font-medium mb-6">
//             Trusted by leading organisations
//           </p>
//           <div className="flex flex-wrap justify-center gap-8">
//             <img src="/logos/ckbirla.png" className="h-8" alt="CK Birla" />
//             <img src="/logos/freshworks.png" className="h-8" alt="Freshworks" />
//             <img src="/logos/hcltech.png" className="h-8" alt="HCLTech" />
//             <img src="/logos/iimb.png" className="h-8" alt="IIMB" />
//           </div>
//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer className="bg-gray-50 border-t border-gray-200 py-6 text-center text-sm text-gray-500">
//         © {new Date().getFullYear()} SoulSync Mental Wellness Platform — All rights reserved.
//       </footer>
//     </div>
//   );
// }






// 'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

// export default function HomePage() {
//   const router = useRouter();

//   // floating dots state
//   const [dots, setDots] = useState<
//     { id: number; top: string; left: string; size: string }[]
//   >([]);

//   useEffect(() => {
//     const newDots = Array.from({ length: 6 }).map((_, i) => ({
//       id: i,
//       top: `${Math.random() * 80}%`,
//       left: `${Math.random() * 90}%`,
//       size: `${10 + Math.random() * 10}px`
//     }));
//     setDots(newDots);
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col bg-white">
//       {/* NAVBAR */}
//       <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//           {/* logo + title */}
//           <div className="flex items-center gap-3">
//             {/* replace with your own logo if you have */}
//             <span className="font-bold text-xl text-gray-800">SoulSync</span>
//           </div>

//           {/* nav links */}
//           <div className="hidden md:flex gap-6">
//             <button
//               className="text-gray-700 hover:text-indigo-600 font-medium"
//               onClick={() => router.push('/about')}
//             >
//               About
//             </button>
//             <button
//               className="text-gray-700 hover:text-indigo-600 font-medium"
//               onClick={() => router.push('/contact')}
//             >
//               Contact
//             </button>
//           </div>

//           {/* right side actions */}
//           <div className="flex gap-3">
//             <button
//               onClick={() => router.push('/signin')}
//               className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-50 font-medium"
//             >
//               Sign In
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* HERO SECTION */}
//       <section className="relative bg-gradient-to-b from-indigo-50 to-white flex-1 overflow-hidden">
//         {/* floating dots */}
//         {dots.map((dot) => (
//           <span
//             key={dot.id}
//             className="absolute rounded-full bg-indigo-200 opacity-50 animate-pulse"
//             style={{
//               top: dot.top,
//               left: dot.left,
//               width: dot.size,
//               height: dot.size
//             }}
//           />
//         ))}

//         <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
//           <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
//             Your Mental Wellness Journey Starts Here
//           </h1>
//           <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
//             SoulSync provides secure, personalized mental health support with AI-powered guidance and seamless campus integration for students and institutions.
//           </p>

//           <div className="mt-10 flex justify-center gap-6 flex-wrap">
//             {/* Sign-in / Dashboard */}
//             <button
//               onClick={() => router.push('/signin')}
//               className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-indigo-700"
//             >
//               {/** You can change text depending on auth state */}
//               Sign In / Dashboard
//             </button>

//             {/* Campus integration */}
//             <button
//               onClick={() => router.push('/integrate-campus')}
//               className="bg-green-100 text-green-700 px-8 py-3 rounded-full text-lg font-medium hover:bg-green-200"
//             >
//               Campus Integration
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* WHY CHOOSE / FEATURE STRIP */}
//       <section className="py-12 border-t border-gray-100 bg-gray-50">
//         <div className="max-w-6xl mx-auto px-6">
//           <h3 className="text-center text-2xl font-bold text-gray-800 mb-10">
//             Why Choose SoulSync?
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8 text-center">
//             <div>
//               <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600 text-white text-2xl">
//                 🔒
//               </div>
//               <h4 className="mt-4 font-semibold text-indigo-600">
//                 Private & Secure
//               </h4>
//               <p className="mt-2 text-gray-600 text-sm">
//                 Your mental health data is protected with enterprise-grade security and privacy controls.
//               </p>
//             </div>
//             <div>
//               <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-green-600 text-white text-2xl">
//                 🏫
//               </div>
//               <h4 className="mt-4 font-semibold text-green-600">
//                 Campus Ready
//               </h4>
//               <p className="mt-2 text-gray-600 text-sm">
//                 Seamlessly integrates with educational institutions for comprehensive student support.
//               </p>
//             </div>
//             <div>
//               <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-sky-600 text-white text-2xl">
//                 🤖
//               </div>
//               <h4 className="mt-4 font-semibold text-sky-600">
//                 AI-Powered Support
//               </h4>
//               <p className="mt-2 text-gray-600 text-sm">
//                 Advanced AI provides personalized guidance and evidence-based mental health tools.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
//         © {new Date().getFullYear()} SoulSync Mental Wellness Platform — All rights reserved.
//       </footer>
//     </div>
//   );
// }




'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const router = useRouter();

  // floating dots state
  const [dots, setDots] = useState<
    { id: number; top: string; left: string; size: string }[]
  >([]);

  useEffect(() => {
    const newDots = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 80}%`,
      left: `${Math.random() * 90}%`,
      size: `${10 + Math.random() * 10}px`
    }));
    setDots(newDots);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* logo + title */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl text-gray-800">SoulSync</span>
          </div>

          {/* nav links */}
          <div className="hidden md:flex gap-6">
            <button
              className="text-gray-700 hover:text-indigo-600 font-medium"
              onClick={() => router.push('/about')}
            >
              About
            </button>
            <button
              className="text-gray-700 hover:text-indigo-600 font-medium"
              onClick={() => router.push('/contact')}
            >
              Contact
            </button>
          </div>

          {/* right side actions */}
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/signin')}
              className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-50 font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-indigo-50 to-white flex-1 overflow-hidden">
        {/* floating dots */}
        {dots.map((dot) => (
          <span
            key={dot.id}
            className="absolute rounded-full bg-indigo-200 opacity-50 animate-pulse"
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size
            }}
          />
        ))}

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Your Mental Wellness Journey Starts Here
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            SoulSync provides secure, personalized mental health support with AI-powered guidance and seamless campus integration for students and institutions.
          </p>

          <div className="mt-10 flex justify-center gap-6 flex-wrap">
            {/* Sign-in / Dashboard */}
            <button
              onClick={() => router.push('/signin')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-indigo-700"
            >
              Sign In / Dashboard
            </button>

            {/* Campus integration */}
            <button
              onClick={() => router.push('/integrate-campus')}
              className="bg-green-100 text-green-700 px-8 py-3 rounded-full text-lg font-medium hover:bg-green-200"
            >
              Campus Integration
            </button>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE / FEATURE STRIP */}
      <section className="py-12 border-t border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-center text-2xl font-bold text-gray-800 mb-10">
            Why Choose SoulSync?
          </h3>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">
                PS
              </div>
              <h4 className="mt-4 font-semibold text-indigo-600">
                Private & Secure
              </h4>
              <p className="mt-2 text-gray-600 text-sm">
                Your mental health data is protected with enterprise-grade security and privacy controls.
              </p>
            </div>
            <div>
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold">
                CR
              </div>
              <h4 className="mt-4 font-semibold text-green-600">
                Campus Ready
              </h4>
              <p className="mt-2 text-gray-600 text-sm">
                Seamlessly integrates with educational institutions for comprehensive student support.
              </p>
            </div>
            <div>
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-sky-600 text-white text-xs font-bold">
                AI
              </div>
              <h4 className="mt-4 font-semibold text-sky-600">
                AI-Powered Support
              </h4>
              <p className="mt-2 text-gray-600 text-sm">
                Advanced AI provides personalized guidance and evidence-based mental health tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SoulSync Mental Wellness Platform — All rights reserved.
      </footer>
    </div>
  );
}