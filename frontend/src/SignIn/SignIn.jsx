import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const [showFacebookLogin, setShowFacebookLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = () => {
      const currentUser = localStorage.getItem("currentUser");
      const authToken = localStorage.getItem("authToken");
      
      if (currentUser) {
        try {
          const userData = JSON.parse(currentUser);
          if (userData.isLoggedIn && authToken) {
            setIsLoggedIn(true);
            // Redirect to home page if already logged in
            navigate("/");
            return;
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };

    checkAuthStatus();
  }, [navigate]);

  // Function to generate avatar based on username/email
  const generateAvatar = (name, email) => {
    const initials = name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase();
    const colors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    return {
      initials,
      color,
      imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}&background=${color.replace('#', '')}&color=fff&bold=true&size=128`
    };
  };

  // Google Login Handler
  const handleGoogleLogin = () => {
    setShowGoogleLogin(true);
    setShowFacebookLogin(false);
  };

  // Facebook Login Handler
  const handleFacebookLogin = () => {
    setShowFacebookLogin(true);
    setShowGoogleLogin(false);
  };

  // Real Google Authentication
  const handleGoogleAuth = (googleEmail, googlePassword) => {
    if (!googleEmail || !googlePassword) {
      setErrorMessage("Please enter both Google email and password");
      return;
    }

    setSuccessMessage("Signing in with Google...");
    setErrorMessage("");
    
    // Simulate Google authentication
    setTimeout(() => {
      const userName = googleEmail.split('@')[0];
      const avatar = generateAvatar(userName, googleEmail);
      
      const googleUser = {
        name: userName,
        email: googleEmail,
        username: userName,
        provider: "google",
        avatar: avatar.imageUrl,
        initials: avatar.initials,
        color: avatar.color,
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem("authToken", "google-auth-token");
      localStorage.setItem("userDetails", JSON.stringify(googleUser));
      localStorage.setItem("currentUser", JSON.stringify(googleUser));
      setSuccessMessage("Google login successful!");
      setTimeout(() => navigate("/"), 1000); // Redirect to home page
    }, 1500);
  };

  // Real Facebook Authentication
  const handleFacebookAuth = (facebookEmail, facebookPassword) => {
    if (!facebookEmail || !facebookPassword) {
      setErrorMessage("Please enter both Facebook email/phone and password");
      return;
    }

    setSuccessMessage("Signing in with Facebook...");
    setErrorMessage("");
    
    // Simulate Facebook authentication
    setTimeout(() => {
      const userName = facebookEmail.split('@')[0];
      const avatar = generateAvatar(userName, facebookEmail);
      
      const facebookUser = {
        name: userName,
        email: facebookEmail,
        username: userName,
        provider: "facebook",
        avatar: avatar.imageUrl,
        initials: avatar.initials,
        color: avatar.color,
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem("authToken", "facebook-auth-token");
      localStorage.setItem("userDetails", JSON.stringify(facebookUser));
      localStorage.setItem("currentUser", JSON.stringify(facebookUser));
      setSuccessMessage("Facebook login successful!");
      setTimeout(() => navigate("/"), 1000); // Redirect to home page
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (isSignUp) {
      if (!username || !email || !password) {
        setErrorMessage("All fields are required for sign up.");
        return;
      }
      
      const avatar = generateAvatar(username, email);
      
      const newUser = {
        name: username,
        email,
        username,
        password,
        phone: "",
        location: "",
        budget: "",
        favoriteDestination: "",
        travelType: "",
        bio: "",
        avatar: avatar.imageUrl,
        initials: avatar.initials,
        color: avatar.color,
        isLoggedIn: false
      };
      
      localStorage.setItem("userDetails", JSON.stringify(newUser));
      setSuccessMessage("Sign up successful! Please sign in.");
      setUsername("");
      setEmail("");
      setPassword("");
      setIsSignUp(false);
    } else {
      const storedUser = JSON.parse(localStorage.getItem("userDetails"));
      
      if (storedUser && storedUser.email === email && storedUser.password === password) {
        // Update user with login info and avatar
        const updatedUser = {
          ...storedUser,
          isLoggedIn: true,
          loginTime: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        
        // If user doesn't have avatar, generate one
        if (!updatedUser.avatar) {
          const avatar = generateAvatar(updatedUser.name, updatedUser.email);
          updatedUser.avatar = avatar.imageUrl;
          updatedUser.initials = avatar.initials;
          updatedUser.color = avatar.color;
        }
        
        localStorage.setItem("userDetails", JSON.stringify(updatedUser));
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        localStorage.setItem("authToken", "mock-token-12345");
        
        setSuccessMessage("Sign in successful!");
        setErrorMessage("");
        setTimeout(() => navigate("/"), 1000); // Redirect to home page
      } else {
        setErrorMessage("Invalid email or password. Please try again.");
      }
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleForgotPasswordClose = () => {
    setShowForgotPassword(false);
    setSuccessMessage("");
  };

  const handlePasswordResetSuccess = () => {
    setShowForgotPassword(false);
    setSuccessMessage("Password reset successfully! Please sign in with your new password.");
    setEmail("");
    setPassword("");
  };

  // If user is already logged in, show a message and redirect
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-cyan-400 mb-2">Already Logged In</h2>
          <p className="text-gray-400 mb-6">You are already signed in. Redirecting to home page...</p>
          <button
            onClick={() => navigate("/")}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
          >
            Go to Home Page
          </button>
        </motion.div>
      </div>
    );
  }

  // Google Login Form Component
  const GoogleLoginForm = ({ onCancel, onGoogleAuth }) => {
    const [googleEmail, setGoogleEmail] = useState("");
    const [googlePassword, setGooglePassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-black/50 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-blue-500/10">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Sign in with Google</h3>
            <p className="text-gray-400">Enter your Google account details</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email or phone</label>
              <input
                type="text"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                className="w-full bg-black/30 backdrop-blur-sm border border-gray-600 text-white p-3 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300"
                placeholder="Enter your Google email or phone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={googlePassword}
                onChange={(e) => setGooglePassword(e.target.value)}
                className="w-full bg-black/30 backdrop-blur-sm border border-gray-600 text-white p-3 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300"
                placeholder="Enter your Google password"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center text-gray-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                />
                Remember me
              </label>
              <button className="text-blue-400 text-sm hover:text-blue-300">
                Forgot password?
              </button>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onCancel}
              className="bg-black/50 backdrop-blur-sm border border-gray-600 text-gray-300 hover:border-gray-500 font-semibold px-5 py-2 rounded-xl transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={() => onGoogleAuth(googleEmail, googlePassword)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold px-5 py-2 rounded-xl transition-all duration-300"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Facebook Login Form Component
  const FacebookLoginForm = ({ onCancel, onFacebookAuth }) => {
    const [facebookEmail, setFacebookEmail] = useState("");
    const [facebookPassword, setFacebookPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-black/50 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-blue-500/10">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Log in to Facebook</h3>
            <p className="text-gray-400">Enter your Facebook account details</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email or phone number</label>
              <input
                type="text"
                value={facebookEmail}
                onChange={(e) => setFacebookEmail(e.target.value)}
                className="w-full bg-black/30 backdrop-blur-sm border border-gray-600 text-white p-3 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300"
                placeholder="Email or phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={facebookPassword}
                onChange={(e) => setFacebookPassword(e.target.value)}
                className="w-full bg-black/30 backdrop-blur-sm border border-gray-600 text-white p-3 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300"
                placeholder="Facebook password"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center text-gray-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                />
                Remember me
              </label>
              <button className="text-blue-400 text-sm hover:text-blue-300">
                Forgotten account?
              </button>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onCancel}
              className="bg-black/50 backdrop-blur-sm border border-gray-600 text-gray-300 hover:border-gray-500 font-semibold px-5 py-2 rounded-xl transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={() => onFacebookAuth(facebookEmail, facebookPassword)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold px-5 py-2 rounded-xl transition-all duration-300"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Forgot Password Form Component
  const ForgotPasswordForm = ({ onCancel, onPasswordResetSuccess }) => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleResetPassword = () => {
      setError("");
      setSuccess("");

      const storedUser = JSON.parse(localStorage.getItem("userDetails"));

      if (!email || !newPassword || !confirmNewPassword) {
        setError("Email, new password, and confirmation are required.");
        return;
      }

      if (!storedUser || storedUser.email !== email) {
        setError("Email not found. Please sign up if you don't have an account.");
        return;
      }

      if (newPassword !== confirmNewPassword) {
        setError("New passwords do not match.");
        return;
      }

      if (newPassword.length < 8) {
        setError("New password must be at least 8 characters long.");
        return;
      }

      const updatedUser = { ...storedUser, password: newPassword };
      localStorage.setItem("userDetails", JSON.stringify(updatedUser));
      setSuccess("Password reset successfully! You can now sign in with your new password.");
      onPasswordResetSuccess();
    };

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-cyan-500/10">
          <h3 className="text-2xl font-bold text-cyan-400 mb-6 text-center">Reset Password</h3>
          {error && <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-center">{error}</div>}
          {success && <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-3 rounded-xl mb-4 text-center">{success}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Registered Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/30 backdrop-blur-sm border border-cyan-500/30 text-cyan-200 p-3 rounded-xl focus:outline-none focus:border-cyan-400 transition-all duration-300"
                placeholder="Enter your registered email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-black/30 backdrop-blur-sm border border-cyan-500/30 text-cyan-200 p-3 rounded-xl focus:outline-none focus:border-cyan-400 transition-all duration-300"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Re-enter New Password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full bg-black/30 backdrop-blur-sm border border-cyan-500/30 text-cyan-200 p-3 rounded-xl focus:outline-none focus:border-cyan-400 transition-all duration-300"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onCancel}
              className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 text-cyan-400 hover:border-cyan-400/50 font-semibold px-5 py-2 rounded-xl transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleResetPassword}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-semibold px-5 py-2 rounded-xl transition-all duration-300"
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-black min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-cyan-900/10 to-black" />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-cyan-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-cyan-500/10 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 animate-pulse" />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-cyan-500/10 hover:border-cyan-400/50 transition-all duration-500"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-500 mb-2">
              {isSignUp ? "Create Account" : "Sign In"}
            </h2>
            <div className="inline-flex items-center gap-3 bg-cyan-500/20 border border-cyan-500/30 px-4 py-2 rounded-full backdrop-blur-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150" />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300" />
              </div>
              <p className="text-cyan-300 text-sm font-medium">
                {isSignUp ? "Start Your Journey" : "Welcome Back"}
              </p>
            </div>
          </motion.div>

          {/* Messages */}
          {successMessage && (
            <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-3 rounded-xl mb-4 text-center backdrop-blur-sm">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-center backdrop-blur-sm">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="group">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-black/30 backdrop-blur-sm border border-cyan-500/30 text-cyan-200 p-4 rounded-xl focus:outline-none focus:border-cyan-400 transition-all duration-300 placeholder-cyan-200/50"
                />
                <div className="w-0 h-0.5 bg-cyan-400 mt-1 group-focus-within:w-full transition-all duration-300" />
              </div>
            )}

            <div className="group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/30 backdrop-blur-sm border border-cyan-500/30 text-cyan-200 p-4 rounded-xl focus:outline-none focus:border-cyan-400 transition-all duration-300 placeholder-cyan-200/50"
              />
              <div className="w-0 h-0.5 bg-cyan-400 mt-1 group-focus-within:w-full transition-all duration-300" />
            </div>

            <div className="group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/30 backdrop-blur-sm border border-cyan-500/30 text-cyan-200 p-4 rounded-xl focus:outline-none focus:border-cyan-400 transition-all duration-300 placeholder-cyan-200/50"
              />
              <div className="w-0 h-0.5 bg-cyan-400 mt-1 group-focus-within:w-full transition-all duration-300" />
            </div>

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-bold py-4 rounded-xl hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </motion.button>
          </form>

          {/* Forgot Password Link */}
          {!isSignUp && (
            <motion.p 
              className="text-sm text-right mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span
                className="text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors duration-300"
                onClick={handleForgotPasswordClick}
              >
                Forgot Password?
              </span>
            </motion.p>
          )}

          {/* Social Login */}
          <motion.div 
            className="flex justify-center mt-6 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={handleGoogleLogin}
              className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 text-cyan-400 p-3 rounded-xl hover:border-cyan-400/50 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </motion.button>
            <motion.button
              onClick={handleFacebookLogin}
              className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 text-cyan-400 p-3 rounded-xl hover:border-cyan-400/50 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </motion.button>
          </motion.div>

          {/* Toggle between Sign In and Sign Up */}
          <motion.p 
            className="text-sm text-center mt-6 text-cyan-300/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              className="text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors duration-300 font-semibold"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setSuccessMessage("");
                setErrorMessage("");
                setEmail("");
                setPassword("");
                setUsername("");
              }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </span>
          </motion.p>
        </motion.div>
      </div>

      {/* Background Text */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-0 pointer-events-none">
        <motion.h1
          initial={{ opacity: 0.05 }}
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="text-[8vw] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400/10 to-cyan-500/10 select-none"
          style={{ whiteSpace: "nowrap" }}
        >
          GO VICKY GO
        </motion.h1>
      </div>

      {/* Modals */}
      {showForgotPassword && (
        <ForgotPasswordForm 
          onCancel={handleForgotPasswordClose} 
          onPasswordResetSuccess={handlePasswordResetSuccess} 
        />
      )}

      {showGoogleLogin && (
        <GoogleLoginForm 
          onCancel={() => setShowGoogleLogin(false)} 
          onGoogleAuth={handleGoogleAuth} 
        />
      )}

      {showFacebookLogin && (
        <FacebookLoginForm 
          onCancel={() => setShowFacebookLogin(false)} 
          onFacebookAuth={handleFacebookAuth} 
        />
      )}

      {/* Floating Elements */}
      <div className="absolute bottom-8 right-8 opacity-20 z-20">
        <div className="flex space-x-3">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-float" />
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-float delay-1000" />
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-float delay-2000" />
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default SignIn;