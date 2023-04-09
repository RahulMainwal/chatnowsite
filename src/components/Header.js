import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export const Header = () => {
    const [avatar, setAvatar] = useState(null);
    const userFromLs = window.localStorage.getItem("user-login-details");
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.clear("user-login-details")
        navigate("/login")
    }


    useEffect(() => {
        if (JSON.parse(userFromLs) === null) {
            navigate("/login")
        }
    }, [userFromLs])

    useEffect(() => {
        if (JSON.parse(userFromLs)) {
            setAvatar(JSON.parse(userFromLs).avatarImage)
        } else {
            setAvatar(null)
        }
    }, [])

    return (
        JSON.parse(userFromLs) && <nav className="navbar navbar-light bg-light" style={{position: "sticky", left: "0", top: "0", zIndex; "1"}}>
        <div className="container-fluid">
            <NavLink
                className="navbar-brand"
                to="/"
                style={{ paddingLeft: "18px" }}
            >
                Chatnow
            </NavLink>
            <div className="d-flex input-group w-auto">
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
                            {
                                avatar === null
                                    ?
                                    ""
                                    :
                                    avatar === ""
                                        ?
                                        <div style={{ padding: "2px 10px", borderRadius: "50%", fontSize: "18px", backgroundColor: "#4169e1", color: "white" }}>{JSON.parse(userFromLs).fullName.slice("", 1).toUpperCase()}</div>
                                        :
                                        <img
                                            src={avatar}
                                            alt=""
                                            style={{ width: "30px", height: "30px", marginTop: "0px" }}
                                            className="rounded-circle"
                                        />
                            }
                        </span>
                        <ul
                            className="dropdown-menu dropdown-menu-end"
                            aria-labelledby="navbarDropdownMenuLink"
                        >
                            <li>
                            <NavLink className="dropdown-item" to={`/profile/${JSON.parse(userFromLs)._id}`}>
                                    Profile
                                </NavLink>
                            </li>
                            <li>
                                <span
                                    className="dropdown-item"
                                    onClick={() => logoutHandler()}
                                >
                                    Logout
                                </span>
                            </li>
                        </ul>
                    </li>
                </span>
            </div>
        </div>
</nav>
    );
};
