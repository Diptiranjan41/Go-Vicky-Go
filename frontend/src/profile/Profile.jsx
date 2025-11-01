import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Default trips data
const trips = [
  { title: "Goa", date: "July 10, 2025" },
  { title: "Kashmir", date: "July 11, 2025" },
  { title: "Leh-Ladakh", date: "July 12, 2025" },
  { title: "Kashmir", date: "July 11, 2025" },
  { title: "Leh-Ladakh", date: "July 12, 2025" },
];

const defaultUser = {
  name: "Ayan Kumar",
  email: "ayan@example.com",
  username: "ayan123",
  phone: "+91-1234567890",
  location: "Bhubaneswar, India",
  budget: "₹15,000",
  favoriteDestination: "Manali",
  travelType: "Adventure",
  bio: "I'm an adventure lover who enjoys mountain biking and photography.",
};

const defaultSecurity = {
  is2FAEnabled: false,
  lastLogin: "Bhubaneswar, India - July 10, 2025, 08:30 AM",
};

const defaultPreferences = {
  language: "English",
  currency: "INR",
};

const PasswordChangeForm = ({ onCancel, onSave, onPasswordSave }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordSave = () => {
    setError("");

    // --- Safe Validation Logic ---
    const storedUser = JSON.parse(localStorage.getItem("userDetails"));
    const storedPassword = storedUser ? storedUser.password : "";

    if (!storedPassword) {
      setError("No password found. Please contact support.");
      return;
    }

    if (oldPassword !== storedPassword) {
      setError("Incorrect old password.");
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
    // --- End of validation logic ---

    // Pass the new password to the parent component's save handler
    onPasswordSave(newPassword);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full text-white shadow-2xl">
        <h3 className="text-2xl font-bold text-cyan-300 mb-6">Change Password</h3>
        {error && <div className="bg-red-800/50 text-red-300 p-3 rounded-md mb-4">{error}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full bg-gray-800 text-white p-3 rounded-md border border-gray-700 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-gray-800 text-white p-3 rounded-md border border-gray-700 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Re-enter New Password</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full bg-gray-800 text-white p-3 rounded-md border border-gray-700 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handlePasswordSave}
            className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-5 py-2 rounded-lg transition"
          >
            Save Password
          </button>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [user, setUser] = useState(defaultUser);
  const [security, setSecurity] = useState(defaultSecurity);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [completion, setCompletion] = useState(0);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const navigate = useNavigate();

  // Function to generate avatar based on username/email
  const generateAvatar = (name, email) => {
    const initials = name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase();
    const colors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    return {
      initials,
      color,
      imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}&background=${color.replace('#', '')}&color=fff&bold=true&size=150`
    };
  };

  useEffect(() => {
    // Safe initialization of user data
    try {
      const savedUser = localStorage.getItem("userDetails");
      const currentUser = localStorage.getItem("currentUser");
      
      if (!savedUser && !currentUser) {
        // If no user data found, redirect to login
        navigate("/signin");
        return;
      }

      let userData;
      if (currentUser) {
        userData = JSON.parse(currentUser);
      } else if (savedUser) {
        userData = JSON.parse(savedUser);
      }

      // If user data exists but no avatar, generate one
      if (userData && !userData.avatar) {
        const avatar = generateAvatar(userData.name, userData.email);
        userData.avatar = avatar.imageUrl;
        userData.initials = avatar.initials;
        userData.color = avatar.color;
        
        // Save updated user data
        localStorage.setItem("userDetails", JSON.stringify(userData));
        if (currentUser) {
          localStorage.setItem("currentUser", JSON.stringify(userData));
        }
      }

      setUser(userData || defaultUser);

      // Load profile image
      const savedImage = localStorage.getItem("profileImage");
      if (savedImage) {
        setProfileImage(savedImage);
      } else if (userData?.avatar) {
        setProfileImage(userData.avatar);
      }

      const savedSecurity = localStorage.getItem("securityDetails");
      const savedPreferences = localStorage.getItem("userPreferences");

      if (savedSecurity) setSecurity(JSON.parse(savedSecurity));
      if (savedPreferences) setPreferences(JSON.parse(savedPreferences));

    } catch (error) {
      console.error("Error loading profile data:", error);
      navigate("/signin");
    }
  }, [navigate]);

  useEffect(() => {
    const calculateCompletion = () => {
      let fields = [
        user?.name, 
        user?.email, 
        user?.username, 
        user?.phone, 
        user?.location,
        user?.budget, 
        user?.favoriteDestination, 
        user?.travelType, 
        user?.bio,
        profileImage && profileImage !== ""
      ];
      
      // Safely filter fields
      let filledFields = fields.filter(field => {
        if (typeof field === 'string') return field.trim() !== "";
        if (typeof field === 'boolean') return field;
        return false;
      }).length;
      
      setCompletion(Math.round((filledFields / fields.length) * 100));
    };
    
    calculateCompletion();
  }, [user, profileImage]);

  // Safe badge calculation function
  const calculateBadges = () => {
    const badges = [];
    
    // Explorer badge
    if (trips.length >= 3) {
      badges.push({ name: "Explorer", description: "Completed 3 or more trips." });
    }
    
    // Budget King badge - with safe parsing
    if (user?.budget) {
      try {
        // Safely extract numbers from budget string
        const budgetMatch = user.budget.match(/\d+/g);
        if (budgetMatch) {
          const budgetValue = parseInt(budgetMatch.join(''));
          if (!isNaN(budgetValue) && budgetValue < 10000) {
            badges.push({ name: "Budget King", description: "Maintained a budget below ₹10,000." });
          }
        }
      } catch (error) {
        console.error("Error parsing budget:", error);
      }
    }
    
    return badges;
  };

  const badges = calculateBadges();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = () => {
    setIsEditing(false);
    setSuccessMessage("✅ Profile updated successfully!");
    
    // Safe localStorage updates
    try {
      const updatedUser = { ...user };
      
      // If user uploaded a new image, update the avatar
      if (profileImage && profileImage.startsWith('data:image')) {
        updatedUser.avatar = profileImage;
        updatedUser.initials = user.name ? user.name.charAt(0).toUpperCase() : 'U';
      }
      
      localStorage.setItem("userDetails", JSON.stringify(updatedUser));
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      
      if (security) localStorage.setItem("securityDetails", JSON.stringify(security));
      if (preferences) localStorage.setItem("userPreferences", JSON.stringify(preferences));
    } catch (error) {
      console.error("Error saving profile:", error);
      setSuccessMessage("❌ Error saving profile. Please try again.");
    }
    
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setSuccessMessage("❌ Please select a valid image file.");
        setTimeout(() => setSuccessMessage(""), 3000);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setSuccessMessage("❌ Image size should be less than 5MB.");
        setTimeout(() => setSuccessMessage(""), 3000);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setProfileImage(base64);
        localStorage.setItem("profileImage", base64);
        
        // Update user data with new image
        const updatedUser = { ...user, avatar: base64 };
        setUser(updatedUser);
        localStorage.setItem("userDetails", JSON.stringify(updatedUser));
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        
        setSuccessMessage("✅ Profile picture updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      };
      reader.onerror = () => {
        setSuccessMessage("❌ Error uploading image. Please try again.");
        setTimeout(() => setSuccessMessage(""), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePasswordClick = () => {
    setIsChangingPassword(true);
  };

  const handlePasswordChangeComplete = () => {
    setIsChangingPassword(false);
    setSuccessMessage("✅ Password changed successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handlePasswordChangeCancel = () => {
    setIsChangingPassword(false);
  };

  const handleNewPasswordSave = (newPassword) => {
    const updatedUser = { ...user, password: newPassword };
    setUser(updatedUser);
    try {
      localStorage.setItem("userDetails", JSON.stringify(updatedUser));
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error saving new password:", error);
    }
    handlePasswordChangeComplete();
  };

  const handleToggle2FA = () => {
    setSecurity(prev => ({ 
      ...prev, 
      is2FAEnabled: !prev.is2FAEnabled 
    }));
    setSuccessMessage(
      `✅ 2FA has been ${security.is2FAEnabled ? "disabled" : "enabled"}.`
    );
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleShareFacebook = () => {
    const text = `Check out my travel profile! I love traveling to ${user?.favoriteDestination || 'amazing destinations'}.`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleShareWhatsApp = () => {
    const text = `Check out my travel profile on Go Vicky Go! My next trip is to ${user?.favoriteDestination || 'an amazing destination'}. ${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // Safe value getter for user fields
  const getUserValue = (field) => {
    return user?.[field] || "";
  };

  // Get display image - use uploaded image, then avatar, then fallback
  const getDisplayImage = () => {
    if (profileImage && profileImage !== "") {
      return profileImage;
    }
    if (user?.avatar) {
      return user.avatar;
    }
    // Generate fallback avatar
    const avatar = generateAvatar(user?.name, user?.email);
    return avatar.imageUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-black to-purple-900 text-white px-4 py-10 flex flex-col items-center">
      {successMessage && (
        <div className="mb-4 bg-black/80 text-cyan-300 px-6 py-3 rounded-xl shadow-xl text-center max-w-2xl w-full">
          {successMessage}
        </div>
      )}

      {isChangingPassword && (
        <PasswordChangeForm 
          onCancel={handlePasswordChangeCancel} 
          onSave={handlePasswordChangeComplete} 
          onPasswordSave={handleNewPasswordSave}
        />
      )}

      {/* Profile Header */}
      <section className="w-full max-w-5xl bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <img
              src={getDisplayImage()}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-cyan-400 shadow-md object-cover"
              onError={(e) => {
                // If image fails to load, generate a fallback avatar
                const avatar = generateAvatar(user?.name, user?.email);
                e.target.src = avatar.imageUrl;
              }}
            />
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer border-2 border-cyan-400 border-dashed">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="text-center">
                  <div className="text-2xl">📷</div>
                  <span className="text-xs text-white font-medium">Change Photo</span>
                </div>
              </label>
            )}
            {!isEditing && (
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 z-10"></div>
            )}
          </div>
          <div>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={getUserValue("name")}
                  onChange={handleChange}
                  className="text-xl md:text-2xl font-bold text-cyan-300 bg-transparent border-b border-cyan-300 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
                  placeholder="Your Name"
                />
                <input
                  type="email"
                  name="email"
                  value={getUserValue("email")}
                  onChange={handleChange}
                  className="text-sm text-gray-300 bg-transparent border-b border-gray-500 focus:outline-none focus:border-cyan-400 mt-1 transition-colors duration-300"
                  placeholder="your@email.com"
                />
              </>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-bold text-cyan-300">{getUserValue("name")}</h1>
                <p className="text-sm text-gray-300">{getUserValue("email")}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-400">Online</span>
                </div>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              💾 Save Changes
            </button>
            <button
              onClick={handleEditToggle}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              ❌ Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={handleEditToggle}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30 flex items-center gap-2"
          >
            <span>✏️ Edit Profile</span>
          </button>
        )}
      </section>

      {/* Profile Completion Bar & Bio */}
      <section className="w-full max-w-5xl mt-8">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-cyan-300">Profile Completion</h2>
            <span className="text-sm font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              {completion}%
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-cyan-500 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${completion}%` }}
              ></div>
            </div>
          </div>
          {completion < 100 && (
            <p className="text-xs text-gray-400 mt-3">
              💡 Complete your profile by adding your bio, preferences, and profile picture to reach 100%!
            </p>
          )}
          {completion === 100 && (
            <p className="text-xs text-green-400 mt-3">
              🎉 Excellent! Your profile is complete and looking great!
            </p>
          )}

          {/* Bio Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-cyan-300 mb-3 flex items-center gap-2">
              <span>👤</span> About Me
            </h3>
            {isEditing ? (
              <textarea
                name="bio"
                value={getUserValue("bio")}
                onChange={handleChange}
                className="w-full h-24 p-3 bg-white/10 rounded-lg text-sm text-white border border-gray-500 focus:outline-none focus:border-cyan-400 resize-none transition-colors duration-300"
                placeholder="Tell us about yourself, your travel experiences, and what kind of adventures you love..."
              ></textarea>
            ) : (
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm text-gray-300 leading-relaxed">
                  {getUserValue("bio") || "No bio added yet. Share something about yourself and your travel experiences!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Badges, Security, and Social Sharing Section */}
      <section className="w-full max-w-5xl mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Badges */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
            <span>🏆</span> Achievement Badges
          </h2>
          <div className="flex flex-wrap gap-3">
            {badges.length > 0 ? (
              badges.map((badge, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm px-4 py-2 rounded-full border border-purple-400 shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-help"
                  title={badge.description}
                >
                  <div className="flex items-center gap-2">
                    <span>⭐</span>
                    <span>{badge.name}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">🏔️</div>
                <p className="text-sm text-gray-400">No badges yet</p>
                <p className="text-xs text-gray-500 mt-1">Start traveling to earn badges!</p>
              </div>
            )}
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
            <span>🔒</span> Security Settings
          </h2>
          <ul className="space-y-4">
            <li className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <div>
                <span className="text-sm font-medium text-gray-300">Change Password</span>
                <p className="text-xs text-gray-500">Update your password regularly</p>
              </div>
              <button
                onClick={handleChangePasswordClick}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors duration-300"
              >
                Change
              </button>
            </li>
            <li className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <div>
                <span className="text-sm font-medium text-gray-300">Two-Factor Authentication</span>
                <p className="text-xs text-gray-500">Extra security for your account</p>
              </div>
              <button
                onClick={handleToggle2FA}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  security?.is2FAEnabled 
                    ? "bg-green-500 hover:bg-green-600 text-white" 
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                }`}
              >
                {security?.is2FAEnabled ? "Enabled" : "Enable"}
              </button>
            </li>
            <li className="p-3 bg-white/5 rounded-lg border border-white/10">
              <span className="text-sm font-medium text-gray-300 block mb-1">Last Login</span>
              <p className="text-xs text-cyan-400">{security?.lastLogin}</p>
            </li>
          </ul>
        </div>

        {/* Social Sharing */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
            <span>🌐</span> Share Profile
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Share your travel profile with friends and family!
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleShareFacebook}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <span>📘</span>
                Share on Facebook
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <span>💚</span>
                Share on WhatsApp
              </button>
            </div>
            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-sm text-gray-400 mb-2">Your Public Profile Link:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://govickygo.com/profile/${getUserValue("username")}`}
                  className="flex-1 bg-transparent text-cyan-400 text-xs p-2 border border-cyan-500/30 rounded focus:outline-none"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(`https://govickygo.com/profile/${getUserValue("username")}`)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded text-xs font-semibold transition-colors duration-300"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Personal Details */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
            <span>👤</span> Personal Details
          </h2>
          <ul className="space-y-4">
            {["username", "phone", "location"].map((field) => (
              <li key={field} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="text-sm font-medium text-gray-300 capitalize">{field}</span>
                {isEditing ? (
                  <input
                    name={field}
                    value={getUserValue(field)}
                    onChange={handleChange}
                    className="bg-transparent text-white text-sm border-b border-gray-500 focus:outline-none focus:border-cyan-400 text-right w-32 transition-colors duration-300"
                  />
                ) : (
                  <span className="text-sm text-cyan-400">{getUserValue(field)}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Preferences */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
            <span>⚙️</span> Travel Preferences
          </h2>
          <ul className="space-y-4">
            {["budget", "favoriteDestination", "travelType"].map((field) => (
              <li key={field} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="text-sm font-medium text-gray-300 capitalize">{field.replace(/([A-Z])/g, " $1")}</span>
                {isEditing ? (
                  <input
                    name={field}
                    value={getUserValue(field)}
                    onChange={handleChange}
                    className="bg-transparent text-white text-sm border-b border-gray-500 focus:outline-none focus:border-cyan-400 text-right w-32 transition-colors duration-300"
                  />
                ) : (
                  <span className="text-sm text-cyan-400">{getUserValue(field)}</span>
                )}
              </li>
            ))}
            <li className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <span className="text-sm font-medium text-gray-300">Preferred Language</span>
              {isEditing ? (
                <select
                  name="language"
                  value={preferences?.language || "English"}
                  onChange={handlePreferenceChange}
                  className="bg-gray-800 text-white text-sm p-1 rounded border border-gray-600 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                </select>
              ) : (
                <span className="text-sm text-cyan-400">{preferences?.language}</span>
              )}
            </li>
            <li className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <span className="text-sm font-medium text-gray-300">Currency</span>
              {isEditing ? (
                <select
                  name="currency"
                  value={preferences?.currency || "INR"}
                  onChange={handlePreferenceChange}
                  className="bg-gray-800 text-white text-sm p-1 rounded border border-gray-600 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
                >
                  <option value="INR">INR ₹</option>
                  <option value="USD">USD $</option>
                  <option value="EUR">EUR €</option>
                </select>
              ) : (
                <span className="text-sm text-cyan-400">{preferences?.currency}</span>
              )}
            </li>
          </ul>
        </div>
      </section>

      {/* Recent Trips */}
      <section className="w-full max-w-5xl mt-8">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-cyan-300 mb-6 flex items-center gap-2">
            <span>✈️</span> Recent Trips
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {trips.map((trip, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-400/30 rounded-xl p-5 shadow-md hover:shadow-cyan-400/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-cyan-400 text-xl">🏔️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-cyan-200">{trip.title}</h3>
                </div>
                <p className="text-sm text-gray-400 text-center mb-4">Visited on: {trip.date}</p>
                <button className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-400/30 py-2 rounded-lg transition-all duration-300 text-sm font-medium">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;