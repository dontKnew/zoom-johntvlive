import React from "react";
import { AlertTriangle } from "lucide-react";
import "./DemoExpired.css";
import { Link } from "react-router-dom";

const DemoExpired = () => {
  return (
    <div className="demo-wrapper">
      <div className="demo-box shadow-lg border">

        <div className="icon-box">
          <AlertTriangle size={70} className="warning-icon" />
        </div>

        <h1 className="demo-heading">Demo Account Expired</h1>

        <p className="demo-text">
          Your demo account has been expired.
        </p>

        <p className="demo-text">
          Please contact support or purchase a full
          version to continue using the application.
        </p>

        <Link to="/" className="demo-btn">
            Back to Login
        </Link>

      </div>
    </div>
  );
};

export default DemoExpired;