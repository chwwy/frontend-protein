/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import Kemenkes from "../assets/kemenkes.png";
import { useEffect, useState } from "react";


const LoginPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
    const navigate = useNavigate();


<<<<<<< HEAD
	const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3987/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });
            const data = await response.json();
=======

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch("http://localhost:3987/admin/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					password
				}),
			});

			const data = await response.json();
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

>>>>>>> 45562d93c0d8cdec59be6f1566a5f8c86c503530

            if (response.ok) {
                navigate("/dashboard");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
        }
	};

	return (
		<div className="flex items-center justify-center h-screen w-screen bg-gray-100">
			<div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6 m-10">
				<div className="flex flex-col items-center mb-6">
					<img
						src={Kemenkes}
						alt="Kemenkes Logo"
						className="w-full h-full mb-4"
					/>
					<p className="text-sm text-gray-500 text-center">
						Layanan Kesehatan Berkualitas Untuk Indonesia
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                        htmlFor="username"
                        className="block text-md font-medium text-gray-700"
                        >
                        Username
                        </label>
                        <input
                        type="text"
                        id="username"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        />
                    </div>

                    <div>
                        <label
                        htmlFor="password"
                        className="block text-md font-medium text-gray-700"
                        >
                        Kata Sandi
                        </label>
                        <input
                        type="password"
                        id="password"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-teal-600 text-white rounded-md shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        Log In
                    </button>
					<p className="text-sm text-center"><Link to="/dashboard">Masuk tanpa login</Link></p>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
