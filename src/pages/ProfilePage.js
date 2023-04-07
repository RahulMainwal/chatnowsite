import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../utils/ApiRoutes';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";

const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };
  

function ProfilePage() {
    const [photo, setPhoto] = useState(undefined);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [val, setVal] = useState(null);
    const [loading, setLoading] = useState(false);
    const locationUrl = useLocation();
    const userId = locationUrl.pathname.slice("9");
    const navigate = useNavigate()

    const getUserDetails = async() => {
        setLoading(true)
        const {data} = await axios.get(`${getUserProfile}/${userId}`)
        if(data){
            setLoading(false)
            setFullName(data.fullName)
            setEmail(data.email)
            setAvatar(data.avatarImage)
            const newObj = {
                avatarImage: data.avatarImage,
                email: data.email,
                fullName: data.fullName,
                isAvatarImageSet: data.isAvatarImageSet,
                _id: data._id
               }

            window.localStorage.setItem("user-login-details", JSON.stringify(newObj))
        }
    }


    const updateHandler = async(e) => {
        e.preventDefault()
        const obj = JSON.parse(window.localStorage.getItem("user-login-details"))
       if(fullName === "" && photo === undefined){
        toast.error("You cannot save blank fields.", toastOptions);
       }else{
        if(photo === undefined && fullName !== ""){
            var formData = new FormData();
            formData.set("fullName", fullName);
          const {data} = await axios.post(`${getUserProfile}/${userId}`,formData, {})
          if(data){
            toast.success("Updated Successful!.", toastOptions);
            getUserDetails()
            setPhoto(undefined)
            setVal("")
          }
        }
        if(fullName === "" && photo !== undefined){
             var formData = new FormData();
        for (const key of Object.keys(photo)) {
          formData.append("avatarImage", photo[key]);
        }
          const {data} = await axios.post(`${getUserProfile}/${userId}`,formData, {})
          if(data){
            toast.success("Updated Successful!.", toastOptions);
            getUserDetails()
            setPhoto(undefined)
            setVal("")
          }
        }
        
        if(fullName !== "" && photo !== undefined){
             var formData = new FormData();
        for (const key of Object.keys(photo)) {
          formData.append("avatarImage", photo[key]);
        }
        formData.set("fullName", fullName);
          const {data} = await axios.post(`${getUserProfile}/${userId}`,formData, {})
          if(data){
            toast.success("Updated Successful!.", toastOptions);
            getUserDetails()
            setPhoto(undefined)
            setVal("")
          }
        }
         }
    }


    useEffect(() => {
        getUserDetails()
        if(JSON.parse(window.localStorage.getItem("user-login-details")) === null){
            navigate("/login")
        }
    }, [])


    return (
        loading
        ?
        <div><Loader />
        <ToastContainer /></div>
        :
        <div>
            <div style={{ width: "100%", margin: "auto", marginTop: "2vh" }}>
                <div style={{ textAlign: "center", marginBottom: "5vh" }}>
                    <b style={{ color: "#0084c7", fontSize: "25px" }}>Profile</b>
                </div>
                <div
                    style={{
                        maxWidth: "700px",
                        display: "block",
                        margin: "auto",
                        border: "1px solid light-grey",
                        padding: "25px",
                        boxShadow: "2px 2px 10px 1px #e5e5df",
                        borderRadius: "5px",
                        backgroundColor: "white"
                    }}
                >
                    <div>
                        <div style={{ width: "100%", textAlign: "center" }}>
                            <img
                                src={avatar}
                                className="rounded-circle"
                                height="150"
                                loading="lazy"
                                alt="profile"
                            />
                        </div>
                        <form onSubmit={(e) => updateHandler(e)}>
                            <div className="form mb-4">
                                <label className="form-label" htmlFor="registerName">
                                    Full Name
                                </label>
                                <input
                                    style={{ width: "100%" }}
                                    type="text"
                                    id="registerName"
                                    name='fullName'
                                    className="form-control"
                                    onChange={(e) => setFullName(e.target.value)}
                                    value={fullName}
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
                                    name='email'
                                    className="form-control"
                                    value={email}
                                    disabled
                                />
                            </div>
                            <div className="form mb-4">
                                <label className="form-label" htmlFor="filePhoto">
                                    Select Profile Image
                                </label>
                                <input
                                    style={{ width: "100%" }}
                                    type="file"
                                    id="filePhoto"
                                    name='avatarImage'
                                    className="form-control"
                                    multiple={false}
                                    value={val}
                                    onChange={(e) => setPhoto(e.target.files)}
                                />
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <img src={photo !== undefined ? URL.createObjectURL(photo[0]) : ""} style={{ width: "200px" }} />
                            </div>
                            {
                                photo === undefined
                                    ?
                                    ""
                                    :
                                    <div><br /></div>
                            }
                            <button
                                style={{ width: "100%" }}
                                type="submit"
                                className="btn btn-primary"
                                onClick={(e) => updateHandler(e)}
                            >
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default ProfilePage
