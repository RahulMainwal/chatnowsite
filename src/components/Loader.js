import React from 'react';
import loadingImg from "../assets/loader.gif"

function Loader() {
    return (
        <div style={{ position: "fixed", left: "0", top: "0", zIndex: "1", width: "100%", height: "100vh", backgroundColor: "white", textAlign: "center", bottom: "0", margin: "auto", paddingTop: "35vh" }}>
            <img src={loadingImg} alt="Loading" style={{ width: "150px" }} />
        </div>
    )
}

export default Loader
