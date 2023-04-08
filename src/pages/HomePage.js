import React, { useEffect, useState, useRef } from 'react';
import { Header } from '../components/Header';
import axios from 'axios';
import { allUsersRoute, host } from '../utils/ApiRoutes'
import { NavLink, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { io } from "socket.io-client";

function HomePage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [contactUsers, setContactUsers] = useState([]);
  const [foundContactUsers, setFoundContactUsers] = useState([]);
  const currentUser = JSON.parse(window.localStorage.getItem("user-login-details"))
  const navigate = useNavigate()
  const socket = useRef();

  const onSeachBtnHandler = async (e) => {
    e.preventDefault();
    if (search) {
      const filter = users.filter((elem) => {
        return elem._id !== currentUser._id
      })
      const filterUsers = filter.filter((elem) => {
        return elem.fullName.toLowerCase().match(search.toLowerCase());
      })

      setAllUsers(filterUsers.length === 0 ? null : filterUsers)
    }
  };

  const LoadFunc = async () => {
    setLoading(true)
    const { data } = await axios.get(allUsersRoute);
    setUsers(data)
    if (data) {
      setLoading(false)
    }
  }

  const shortingInUsers = async () => {
    if (currentUser._id) {
      const gotUsers = users.filter((x) => {
        return foundContactUsers.contacts.find((a) => {
          return x._id === a.id
        })
      })
      setContactUsers(gotUsers)
    }
  }

  useEffect(() => {
    if (currentUser === null) {
      navigate("/login")
    }
  }, [])

  useEffect(() => {
    if (search === "") {
      setAllUsers([])
    }
  }, [search])

  useEffect(() => {
    LoadFunc()
  }, [])


  useEffect(() => {
    shortingInUsers()
  }, [foundContactUsers])

  useEffect(() => {
    if (currentUser !== null) {
      const findOwnSelf = users.find(x => {
        return x._id === currentUser._id
      })
      setFoundContactUsers(findOwnSelf)
    }
  })


  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
      socket.current.on("get-online-users", (getUsersArray) => {
        if (getUsersArray.length !== 0) {
          setOnlineUsers(getUsersArray)
        }
      });

    }
  }, []);


  return (
    <div style={{ backgroundColor: "#f8f8f8", height: "100vh" }}>
      {
        loading
          ?
          <Loader />
          :
          <div>
            <Header />
            <div style={{
              // padding: "10px 20px",
              padding: "1rem 1.5rem",
              gap: "1rem",
              display: "flex",
              flexDirection: "column",
              overflow: "auto",
              maxWidth: "700px",
              // display: "block",
              margin: "auto",
              border: "1px solid light-grey",
              padding: "25px",
              borderRadius: "5px",
              backgroundColor: "white"
            }}>
              <ul className="nav nav-tabs nav-fill mb-3" id="ex1" role="tablist">
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link active"
                    id="ex2-tab-1"
                    data-mdb-toggle="tab"
                    href="#ex2-tabs-1"
                    role="tab"
                    aria-controls="ex2-tabs-1"
                    aria-selected="true"
                  >
                    Chats
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    id="ex2-tab-2"
                    data-mdb-toggle="tab"
                    href="#ex2-tabs-2"
                    role="tab"
                    aria-controls="ex2-tabs-2"
                    aria-selected="false"
                  >
                    Find People
                  </a>
                </li>
              </ul>

              <div className="tab-content" style={{
                height: "74vh"
              }} id="ex2-content">
                <div
                  className="tab-pane fade show active"
                  id="ex2-tabs-1"
                  role="tabpanel"
                  aria-labelledby="ex2-tab-1"
                >
                  {
                    contactUsers.map((elem) => (
                      <div key={elem._id}>
                        <NavLink to={`/${elem._id}`}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ display: "flex" }}>
                              <div>
                                {elem.avatarImage === "" ? (
                                  <div style={{ padding: "8px 18px", marginTop: "5px", borderRadius: "50%", fontSize: "18px", backgroundColor: "#4169e1", color: "white" }}>{elem.fullName.slice("", 1).toUpperCase()}</div>
                                ) : (
                                  <img
                                    src={elem.avatarImage}
                                    alt=""
                                    style={{
                                      width: "45px",
                                      height: "45px",
                                      marginTop: "8px"
                                    }}
                                    className="rounded-circle"
                                  />
                                )}
                              </div>
                              <div style={{ marginLeft: "20px" }}>
                                <p className="fw-bold mb-1" style={{ marginTop: "5px", }}>{elem.fullName}</p>
                                {
                                  onlineUsers.find((x) => {
                                    return elem._id === x.userId
                                  })=== undefined?  <p className="text-muted mb-0" style={{marginTop: "-7px"}}>Offline</p>: <p className="fw-bold mb-1" style={{color: "green", marginTop: "-7px"}}>Online</p>
                                }
                              </div>
                            </div>
                            {/* <div style={{ marginRight: "5px", color: "grey" }}>time</div> */}
                          </div>
                        </NavLink>
                        <hr />
                      </div>
                    ))
                  }
                </div>
                <div
                  className="tab-pane fade"
                  id="ex2-tabs-2"
                  role="tabpanel"
                  aria-labelledby="ex2-tab-2"
                >
                  <form
                    onSubmit={(e) => onSeachBtnHandler(e)}
                    className="d-flex input-group w-auto"
                  >
                    <input
                      type="search"
                      className="form-control rounded"
                      placeholder="Search by name"
                      aria-label="Search"
                      aria-describedby="search-addon"
                      onChange={(e) => setSearch(e.target.value)}
                      value={search}
                      autoComplete="true"
                    />
                    <span
                      onClick={(e) => onSeachBtnHandler(e)}
                      className="input-group-text border-0"
                      id="search-addon"
                    >
                      <i className="fas fa-search"></i>
                    </span>
                  </form>
                  <br />

                  {
                    allUsers === null
                      ?
                      <div
                        style={{
                          textAlign: "center",
                          width: "100%"
                        }}
                      >
                        No user found here!
                      </div>
                      :
                      search === ""
                        ?
                        <div
                          style={{
                            textAlign: "center",
                            width: "100%"
                          }}
                        >
                          Please find people here!
                        </div>
                        :
                        allUsers.map((x) => (
                          <div key={x._id}>
                            {/* <NavLink to={`/${elem.uid}`}> */}
                            <div
                              style={{ display: "flex", justifyContent: "space-between" }}
                            >
                              <div style={{ display: "flex" }}>
                                <div>
                                  {x.avatarImage === "" ? (
                                    <div style={{ padding: "8px 18px", marginTop: "5px", borderRadius: "50%", fontSize: "18px", backgroundColor: "#4169e1", color: "white" }}>{x.fullName.slice("", 1).toUpperCase()}</div>
                                  ) : (
                                    <img
                                    src={x.avatarImage}
                                      alt=""
                                      style={{
                                        width: "45px",
                                        height: "45px",
                                        marginTop: "8px"
                                      }}
                                      className="rounded-circle"
                                    />
                                  )}
                                </div>
                                <div style={{ marginLeft: "20px", marginTop: "15px" }}>
                                  <p className="fw-bold mb-1">{x.fullName}</p>
                                </div>
                              </div>
                              <NavLink style={{ marginTop: "15px" }} to={`/${x._id}`}>
                                Start Chat
                              </NavLink>
                            </div>
                            {/* </NavLink> */}
                            <hr />
                          </div>
                        ))
                  }


                </div>
              </div>
            </div>
          </div>
      }
    </div>
  )
}

export default HomePage
