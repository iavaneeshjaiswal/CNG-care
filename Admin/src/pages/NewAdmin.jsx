import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { Admincontext } from "../contexts/admincontext.jsx";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function NewAdmin() {
  const { addAdmin, role } = useContext(Admincontext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    await addAdmin(data);
    navigate("/admins");
  };

  const [Role, setRole] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    setRole(localStorage.getItem("role"));
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex gap-3 w-full" onSubmit={handleSubmit(onSubmit)}>
      <Navbar />
      {Role == "super admin" ? (
        <div className="flex w-full flex-col items-center p-12 gap-3 ">
          <h2>Add Admin</h2>
          <form className="flex w-full h-screen flex-col justify-start gap-5 ">
            <div className="flex flex-col gap-2 ">
              <label htmlFor="Name">Admin Name:</label>
              <input
                type="text"
                placeholder="Enter Admin Name"
                id="Name"
                {...register("name", { required: "Name is required" })}
                className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
              />
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name.message}</p>
              )}{" "}
              {/* Error message */}
            </div>

            <div className="flex w-full gap-2 ">
              <div className="flex w-1/2 flex-col gap-2 ">
                <label htmlFor="username">Username :</label>
                <input
                  type="text"
                  placeholder="Enter Username"
                  id="username"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
                />
                {errors.username && (
                  <p className="text-red-400 text-sm">
                    {errors.username.message}
                  </p>
                )}{" "}
                {/* Error message */}
              </div>
              <div className="flex w-1/2  flex-col gap-2 ">
                <label htmlFor="password">Password :</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
                />
                {errors.password && (
                  <p className="text-red-400 text-sm">
                    {errors.password.message}
                  </p>
                )}{" "}
                {/* Error message */}
              </div>
            </div>

            <div className="flex w-full gap-2 ">
              <div className="flex flex-col gap-2 ">
                <label htmlFor="role">Role :</label>
                <select
                  name="role"
                  id="role"
                  {...register("role", {
                    required: "role is required",
                  })}
                  className="text-black border p-2 rounded-lg"
                >
                  {role.map((item) => {
                    return <option value={item}>{item}</option>;
                  })}
                </select>
                {/* Error message */}
              </div>
            </div>
            <input
              type="submit"
              value="Add Admin"
              style={{ background: "#FC370F" }}
              className="text-white p-1 px-4 text-lg  rounded-lg cursor-pointer"
            />
          </form>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center p-3 w-full text-red-600 text-lg">
          <p>Auth Failed : Only super admin can see this.</p>
        </div>
      )}
    </div>
  );
}
