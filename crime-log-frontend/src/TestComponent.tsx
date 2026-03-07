import {useEffect, useState} from "react";
import api from "./api/client.ts";
import {Link} from "react-router-dom";

function TestComponent() {
    const [adminConnectionTest, setAdminConnectionTest] = useState("");
    const [publicConnectionTest, setPublicConnectionTest] = useState("");

    useEffect(() => {
        api.get("/hello/admin")
            .then(res => setAdminConnectionTest(res.data))
            .catch(err => setAdminConnectionTest(err.response?.data?.message ?? "Request failed"))

        api.get("/hello/public")
            .then(res => setPublicConnectionTest(res.data))
            .catch(err => setPublicConnectionTest(err.response?.data?.message ?? "Request failed"))
    }, [])

    return (
        <>
            <h1 className="text-center mb-3">Testing...</h1>
            <p className="text-gray-600 text-start">
                Admin Connection: {adminConnectionTest || "Loading..."}<br/>
                Public Connection: {publicConnectionTest || "Loading..."}
            </p>
            <br/>
            <Link to="/login">
                <button className='bg-blue-300 rounded-2xl p-2 hover:bg-blue-400 hover:border'>Login to get Authenticated</button>
            </Link>
        </>
    );
}

export default TestComponent;