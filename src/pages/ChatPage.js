import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { allUsersRoute, host, recieveMessageRoute, sendMessageRoute } from "../utils/ApiRoutes";
import { io } from "socket.io-client";
import startLogo from "../assets/robot.gif"
import Loader from "../components/Loader";
import {format} from "timeago.js";

export const ChatPage = () => {
  const [text, setText] = useState("");
  const [bannerLoading, setbannerLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const locationUrl = useLocation();
  const userId = locationUrl.pathname.slice("1");
  const navigate = useNavigate()
  const socket = useRef();
  const scrollRef = useRef();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [activeUser, setActiveUser] = useState("");
  const [onlineUserArray, setOnlineUserArray] = useState([]);

  const reloadFunc = async ({stopLoading}) => {
    if(stopLoading === false){
    setbannerLoading(true)
    }
    const { data } = await axios.get(allUsersRoute);
    const filter = data.find((elem) => {
      return elem._id === userId
    })
    setUser(filter)
    if (filter) {
      setbannerLoading(false)
    } else {
      setbannerLoading(false)
    }

    const userData = await JSON.parse(
      localStorage.getItem("user-login-details")
    );
    const response = await axios.post(recieveMessageRoute, {
      from: userData._id,
      to: userId,
    });
    setMessages(response.data);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (text !== "") {
      setLoading(true)
      const data = await JSON.parse(
        localStorage.getItem("user-login-details")
      );
      socket.current.emit("send-msg", {
        to: userId,
        from: data._id,
        msg: text,
      });
      const chatData = await axios.post(sendMessageRoute, {
        from: data._id,
        to: userId,
        message: text,
      });
      if (chatData.data) {
        setLoading(false)
      }
      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: text });
      setMessages(msgs);
      setText("")
      reloadFunc({stopLoading: true})
    }
  };

  
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
      // socket.current.on("get-online-users", (getUsersArray) => {
      //   setOnlineUserArray(getUsersArray)
      // });
    }
  }, [currentUser]);


  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.on("get-online-users", (getUsersArray) => {
        setOnlineUserArray(getUsersArray)
      });
    }
  }, [currentUser])

  useEffect(() => {
   if(user){
    const findActiveUser = onlineUserArray.find((x) => {
      return x.userId === user._id
    })
    if(findActiveUser){
      setActiveUser(findActiveUser.userId)
    }
     
   }
  }, [onlineUserArray])

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        reloadFunc({stopLoading: true})
      });
    }
  });

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user-login-details")) === null) {
      navigate("/login")
    }

    reloadFunc({stopLoading: false});
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("user-login-details")) {
      navigate("/login");
    } else {
      setCurrentUser(
        JSON.parse(
          localStorage.getItem("user-login-details")
        )
      );
    }
  }, []);
  

  return (
    <div style={{ height: "100vh", backgroundColor: "#f8f8f8" }}>
      <div className="navbar navbar-light bg-light" style={{position: "sticky", left: "0", top: "0"}}>
        <div
          className="container-fluid"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div style={{ display: "flex" }}>
            <div style={{ marginTop: "18px" }}>
              <NavLink to="/">
                <span className="input-group-text border-0" id="search-addon">
                  <i
                    style={{ fontSize: "23px" }}
                    className="fas fa-arrow-left"
                  ></i>
                </span>
              </NavLink>
            </div>
            <div>
              {user.avatarImage === "" ? (
                <div
                  style={{
                    backgroundColor: "#4169e1 ",
                    padding: "5px 14px",
                    fontSize: "20px",
                    borderRadius: "50%",
                    color: "white",
                    marginTop: "10px"
                  }}
                >
                  {user.fullName.slice("", 1).toUpperCase()}
                </div>
              ) : (
                <img
                  src={user.avatarImage}
                  alt=""
                  style={{ width: "45px", height: "45px", marginTop: "8px" }}
                  className="rounded-circle"
                />
              )}
            </div>
            <div style={{ margin: "5px 0 0 15px" }}>
              <p className="fw-bold mb-1" style={{ textDecoration: "capitalise" }}>{user.fullName}</p>
              <p className="fw-bold mb-1" style={{marginTop: "-10px"}}>{activeUser === user._id?<span style={{color: "green"}}>Online</span>:"Offline"}</p>
            </div>
          </div>
          <div style={{ color: "grey" }}>
            <span className="input-group-text border-0" id="search-addon">
              <li
                className="nav-item dropdown me-3 me-lg-1"
                style={{ listStyle: "none" }}
              >
                <span
                  className="nav-link dropdown-toggle hidden-arrow"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-mdb-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-ellipsis-vertical fa-lg"></i>
                </span>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  {/* <li>
                    <a className="dropdown-item" href="#">
                      Profile
                    </a>
                  </li> */}
                </ul>
              </li>
            </span>
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "5px" }}><i className="fas fa-lock"></i> Messages</div>
      <div id="chat-container" style={{
        padding: "1rem 1.5rem",
        gap: "1rem",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        height: "75vh",
        maxWidth: "700px",
        // display: "block",
        margin: "auto",
        border: "1px solid light-grey",
        padding: "25px",
        borderRadius: "5px",
        backgroundColor: "white"
      }}>
        {
          bannerLoading
            ?
            <Loader />
            :
            messages.length === 0
              ?
              <div>
                <img src={startLogo} alt="start chat" width="100%" />
              </div>
              :
              messages.map((elem, ind) => (
                <div key={ind} ref={scrollRef} style={elem.fromSelf ? {
                  width: "100%", display: "flex",
                  flexDirection: "column", textAlign: "end", alignItems: "end"
                } : {
                  width: "100%", display: "flex",
                  flexDirection: "column", textAlign: "start", alignItems: "start"
                }}>

                  <div style={elem.fromSelf ? {
                    padding: "0.5rem 2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.2rem",
                    overflow: "auto",
                    border: "1px solid white",
                    backgroundColor: "#4169e1",
                    borderRadius: "15px",
                    color: "white",
                    // width: "50%"
                  } : {
                    padding: "0.5rem 2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.2rem",
                    overflow: "auto",
                    border: "1px solid white",
                    backgroundColor: "#f8f8f8",
                    borderRadius: "15px",
                    // width: "50%"
                  }}>
                    <span>{elem.fromSelf ? "You" : user.fullName}</span>
                    <b style={{ fontSize: "20px" }}>{elem.message}</b>
                  </div>
                  <p>{format(elem.time)}</p>

                </div>
              ))
        }
      </div>
      <div
        style={{
          position: "fixed",
          left: "0",
          bottom: "3vh",
          right: "0",
          margin: "5px 20px",
        }}
      >
        <form
          onSubmit={(e) => submitHandler(e)}
          className="d-flex input-group"
          style={{
            maxWidth: "700px",
            margin: "auto",
            border: "1px solid light-grey",
            padding: "5px 10px",
            boxShadow: "2px 2px 10px 1px #e5e5df",
            borderRadius: "5px",
            backgroundColor: "white"
          }}
        >
          <input
            type="text"
            className="form-control rounded"
            placeholder="Write message..."
            aria-label="Search"
            aria-describedby="search-addon"
            onChange={(e) => {
              setText(e.target.value);
            }}
            value={text}
            disabled={loading ? true : false}
          />
          {
            loading
              ?
              <span
                className="input-group-text"
                id="search-addon"
                disabled={loading ? true : false}
              >
                <i className="fas fa-ban"></i>
              </span>
              :
              <span
                onClick={(e) => submitHandler(e)}
                className="input-group-text"
                id="search-addon"
                disabled={loading ? true : false}
              >
                <i className="far fa-paper-plane"></i>
              </span>
          }
        </form>
      </div>
    </div>
  );
};
