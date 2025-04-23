"use client";

import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";

export default  function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [gotoclient,setGotoclient]=useState(true)
  const router = useRouter();

  useEffect(() => {
    // Pre-warm DB connection by hitting the warmup route
    fetch("/api/warmup");
  }, []);


  const API_BASE_URL = "/api/login";  // Use Next.js internal API route
  const handleLogin = async () => {
    setError("");  // Reset error before submitting
    setLoading(true);  // Start loading

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();
      setLoading(false);  // Stop loading

      if (response.ok) {
        const { token } = data; // Capture the token from the response
        alert(`✅ Logged in as: ${name}`);

        // Optionally store token (you may want to use cookies for production)
        localStorage.setItem("auth_token", token);  // Or set in cookies
       if(gotoclient === true){
        router.push("/home");  // Redirect to home page after login
       }
       else{
        router.push("/doctorProfile");  // Redirect to home page after login
       }
       

      } else {
        setError(data.error || "Unknown error");
      }
    } catch (error) {
      setLoading(false);
      console.error("❌ Server error:", error);
      setError("❌ Unable to connect to server");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 relative">
        <div className="text-center mb-6 m-4">
          <h2 className="text-3xl font-bold text-gray-700">ET-HEALTH</h2>
          <h2 className="text-3xl font-bold text-red-700">Mike,4645</h2>

        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-gray-600 text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="#" className="text-blue-500 hover:underline">Forgot Password?</a>
          </div>

          {loading ? (
            <div>Loading...</div>  // You can replace this with a spinner component
          ) : (
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Log in
            </button>
          )}
          
          <button
            type="button"
            className="w-full bg-blue-900 text-white p-2 rounded-lg font-semibold hover:bg-blue-600 transition"
            onClick={() => alert("Register functionality not implemented yet!")}
          >
            Register
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Can't access your account?
          </p>
        </form>

        <div className="absolute top-4 right-4">
       <select
    className="p-1 border rounded-md bg-white"
     onChange={(e) => setGotoclient(e.target.value === "patient")}
      >
     <option value="patient">Patient (PR)</option>
    <option value="doctor">Doctor (DR)</option>
  </select>
</div>
      </div>
    </div>
  );
}

