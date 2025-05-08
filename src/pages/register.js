import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      alert(authError.message);
      return;
    }

    const user = authData.user;

    if (user) {
      // Insert into your original "users" table
      const { error: dbError1 } = await supabase
        .from("users")
        .insert([{ id: user.id, email, name, last_name: lastName }]);

      // Insert into "user_profiles" table for profile page
      const { error: dbError2 } = await supabase.from("user_profiles").insert([
        {
          id: user.id,
          email: user.email,
          full_name: name + " " + lastName,
          avatar_url: "", // optional: can be updated later
          bio: "", // default empty
        },
      ]);

      if (dbError1 || dbError2) {
        alert(
          dbError1?.message || dbError2?.message || "Something went wrong..."
        );
      } else {
        alert("Account created!");
        navigate("/login");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <Link to="/login" className="back-link">
          Back
        </Link>
        <h3 className="text-center">Fill up the form</h3>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
