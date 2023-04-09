import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute, registerOtpRoute, registerRoute } from '../utils/ApiRoutes';

const toastOptions = {
  position: "bottom-right",
  autoClose: 8000,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

function Login() {
  const [fullName, setFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPass, setRegConfirmPass] = useState("");
  const [otpBox, setOtpBox] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    if (loginEmail === "" && loginPass === "") {
      toast.error("Email and Password is required.", toastOptions);
    } else {
      if (loginEmail === "" || loginPass === "") {
        if (loginEmail === "") {
          toast.error("Email is required.", toastOptions);
        }
        if (loginPass === "") {
          toast.error("Password is required.", toastOptions);
        }
      } else {
        if (loginPass.length < 8) {
          toast.error("Password should be minimum 8 characters.", toastOptions);
        }
        else {
          setLoading(true)
          try {
            const { data } = await axios.post(loginRoute, {
              email: loginEmail,
              password: loginPass,
            })
            if (data.status) {
              toast.success("Success.", toastOptions);
              localStorage.setItem("user-login-details",
                JSON.stringify(data.user)
              );
              setLoading(false)
              navigate("/");
            }
            if (data.status === false) {
              toast.error(data.msg, toastOptions);
              setLoading(false)
            }
          } catch (error) {
            toast.error("Something went wrong and try again.", toastOptions);
            setLoading(false)
          }
        }
      }
    }
  }
  const registerOtpHandler = async (e) => {
    e.preventDefault();
    if (fullName === "" && regEmail === "" && regPassword === "" && regConfirmPass === "") {
      toast.error("All fields are required.", toastOptions);
    } else {
      if (fullName === "" || regEmail === "" || regPassword === "" || regConfirmPass === "") {
        toast.error("All fields are required.", toastOptions);
      } else {
        if (regPassword.length < 8) {
          toast.error("Password should be minimum 8 characters.", toastOptions);
        }
        if (regPassword !== regConfirmPass) {
          toast.error("Password did not match.", toastOptions);
        }
        if (fullName.length < 3) {
          toast.error("Full Name should have minimum 3 characters.", toastOptions);
        } else {
          if (regPassword.length >= 8 && regPassword === regConfirmPass) {
            setLoading(true)
            const { data } = await axios.post(registerOtpRoute, {
              fullName,
              email: regEmail,
              password: regPassword,
            });
            if (data.status) {
              toast.success(`Otp has been sent to ${regEmail}.`, toastOptions);
              setOtpBox(true)
              setOtpToken(data.otpToken)
              setLoading(false)
            }
            if (data.status === false) {
              toast.error(data.msg, toastOptions);
              setLoading(false)
            }
          }
        }
      }
    }
  }


  const registerHandler = async (e) => {
    e.preventDefault();
    if (fullName === "" && regEmail === "" && regPassword === "" && regConfirmPass === "") {
      toast.error("All fields are required.", toastOptions);
    } else {
      if (fullName === "" || regEmail === "" || regPassword === "" || regConfirmPass === "") {
        toast.error("All fields are required.", toastOptions);
      } else {
        if (regPassword.length < 8) {
          toast.error("Password should be minimum 8 characters.", toastOptions);
        }
        if (regPassword !== regConfirmPass) {
          toast.error("Password did not match.", toastOptions);
        }
        if (fullName.length < 3) {
          toast.error("Full Name should have minimum 3 characters.", toastOptions);
        } else {
          if (regPassword.length >= 8 && regPassword === regConfirmPass) {
            setLoading(true)
            const { data } = await axios.post(registerRoute, {
              fullName,
              email: regEmail,
              password: regPassword,
              otpToken,
              otp
            });
            if (data.status) {
              toast.success(`Registration has been successful.`, toastOptions);
              setOtpBox(true)
              setOtpToken(data.otpToken)
              setLoading(false)
              localStorage.setItem("user-login-details",
                JSON.stringify(data.user)
              );
              navigate("/");
            }
            if (data.status === false) {
              toast.error(data.msg, toastOptions);
              setLoading(false)
            }
          }
        }
      }
    }
  }

  useEffect(() => {
    const userFromLs = window.localStorage.getItem("user-login-details");
    if (JSON.parse(userFromLs) !== null) {
      navigate("/")
    }
  }, [])

  return (
    <div>
      <div style={{ width: "90%", margin: "auto", marginTop: "2vh" }}>
        <div style={{ textAlign: "center", marginBottom: "5vh" }}>
          <b style={{ color: "#0084c7", fontSize: "25px" }}>Welcome!</b>{" "}
          <span style={{ fontSize: "20px" }}>to Chatnow</span>
        </div>
        <div
          style={{
            maxWidth: "400px",
            display: "block",
            margin: "auto",
            border: "1px solid light-grey",
            padding: "25px",
            boxShadow: "2px 2px 10px 1px #e5e5df",
            borderRadius: "5px",
            backgroundColor: "white"
          }}
        >
          <ul
            className="nav nav-pills nav-justified mb-3"
            id="ex1"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <a
                className="nav-link active"
                id="tab-login"
                data-mdb-toggle="pill"
                href="#pills-login"
                role="tab"
                aria-controls="pills-login"
                aria-selected="true"
              >
                Login
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className="nav-link"
                id="tab-register"
                data-mdb-toggle="pill"
                href="#pills-register"
                role="tab"
                aria-controls="pills-register"
                aria-selected="false"
              >
                Register
              </a>
            </li>
          </ul>
          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="pills-login"
              role="tabpanel"
              aria-labelledby="tab-login"
            >
              <form onSubmit={(e) => loginHandler(e)}>
                <div className="form mb-4">
                  <label className="form-label" htmlFor="loginName">
                    Email
                  </label>
                  <input
                    style={{ width: "100%" }}
                    type="email"
                    id="loginName"
                    className="form-control"
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                    }}
                    value={loginEmail}
                  />
                </div>

                <div className="form mb-4">
                  <label className="form-label" htmlFor="loginPassword">
                    Password
                  </label>
                  <input
                    style={{ width: "100%" }}
                    type="password"
                    id="loginPassword"
                    className="form-control"
                    onChange={(e) => {
                      setLoginPass(e.target.value);
                    }}
                    value={loginPass}
                  />
                </div>

                <div className="row mb-4" style={{ width: "100%" }}>
                  <div className="col-md-6 d-flex justify-content-center">
                    <div className="form-check mb-3 mb-md-0">
                      <input
                        className="form-c100ck-input"
                        type="checkbox"
                        value=""
                        id="loginCheck"
                      />
                      <label className="form-check-label" htmlFor="loginCheck">
                        {" "}
                        Remember me{" "}
                      </label>
                    </div>
                  </div>

                  <div className="col-md-6 d-flex justify-content-center">
                    <NavLink>Forgot password?</NavLink>
                  </div>
                </div>

                <button
                  style={{ width: "100%" }}
                  type="submit"
                  className="btn btn-primary btn-block mb-4"
                  disabled={loading ? true : false}
                >
                  {loading ? "Loading..." : "Sign in"}
                </button>
              </form>
            </div>
            <div
              className="tab-pane fade"
              id="pills-register"
              role="tabpanel"
              aria-labelledby="tab-register"
            >
              <form onSubmit={(e) => otpBox ? registerHandler(e) : registerOtpHandler(e)}>
                <div className="form mb-4">
                  <label className="form-label" htmlFor="registerName">
                    Full Name
                  </label>
                  <input
                    style={{ width: "100%" }}
                    type="text"
                    id="registerName"
                    className="form-control"
                    onChange={(e) => setFullName(e.target.value)}
                    value={fullName}
                    disabled={otpBox ? true : false}
                  />
                </div>
                <div className="form mb-4">
                  <label className="form-label" htmlFor="registerEmail">
                    Email
                  </label>
                  <input
                    style={{ width: "100%" }}
                    type="email"
                    id="registerEmail"
                    className="form-control"
                    onChange={(e) => setRegEmail(e.target.value)}
                    value={regEmail}
                    disabled={otpBox ? true : false}
                  />
                </div>
                <div className="form mb-4">
                  <label className="form-label" htmlFor="registerPassword">
                    Password
                  </label>
                  <input
                    style={{ width: "100%" }}
                    type="password"
                    id="registerPassword"
                    className="form-control"
                    onChange={(e) => setRegPassword(e.target.value)}
                    value={regPassword}
                    disabled={otpBox ? true : false}
                  />
                </div>
                <div className="form mb-4">
                  <label className="form-label" htmlFor="registerRepeatPassword">
                    Confirm password
                  </label>
                  <input
                    style={{ width: "100%" }}
                    type="password"
                    id="registerRepeatPassword"
                    className="form-control"
                    onChange={(e) => setRegConfirmPass(e.target.value)}
                    value={regConfirmPass}
                    disabled={otpBox ? true : false}
                  />
                </div>
                {otpBox && (
                  <div className="form">
                    <label className="form-label" htmlFor="otp">
                      Otp
                    </label>
                    <input
                      style={{ width: "100%" }}
                      className="form-control"
                      type="number"
                      id="otp"
                      aria-describedby="registerCheckHelpText"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                )}
                <br />
                <button
                  style={{ width: "100%" }}
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading ? true : false}
                >
                  {loading ? "Loading..." : otpBox ? "Verify Otp" : "Send Otp"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Login
