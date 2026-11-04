import React from "react";
import { AlertTriangle } from "lucide-react";
import "./DemoExpired.css";
import { Link } from "react-router-dom";

const DemoAlreadyUsed = () => {
  return (
    <div className="demo-wrapper">
      <div className="demo-box shadow-lg border">

        <div className="icon-box">
          <AlertTriangle size={70} className="warning-icon" />
        </div>

        <h1 className="demo-heading">Demo Already Used</h1>

        <p className="demo-text">
          You have already used the demo account.
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

export default DemoAlreadyUsed;