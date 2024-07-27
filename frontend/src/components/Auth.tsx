import { SignupType } from "@adityatheprogrammer/common";
import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config";
import axios from "axios";

export const Auth = ({type}: {type: "signup" | "signin"}) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupType>({
        name: "",
        email: "",
        password: ""
    })

    async function sendRequest() {
        try{
            const response = await axios.get(
                `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
                postInputs
            )
            const jwt = response.data
            localStorage.setItem("token", jwt)
            navigate("/blogs")
        } catch(e){
            alert("Error while signing up")
        }
    }

    return <>
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div>
                    <div className="px-10">
                        <div className="text-3xl font-extrabold">
                            {type === "signup" ? "Create an account" : "Log into your account"}
                        </div>
                        <div className="text-slate-400">
                            {type === "signin" ? "Don't have an account" : "Already have an account"}
                            <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                                {type === "signin" ? "Sign up": "Sign in"}
                            </Link>
                        </div>
                    </div>
                    <div className="pt-8">
                        {type === "signup" ? (
                            <LabelledInput 
                                label="Name"
                                placeholder="John Doe"
                                onChange={(e) => {
                                    setPostInputs((c) => ({
                                        ...c,
                                        name: e.target.value
                                    }))
                                }}
                            />
                        ) : null}
                        <LabelledInput
                            label="Email"
                            placeholder="john.doe@email.com"
                            onChange={(e) => {
                                setPostInputs((c) => ({
                                    ...c,
                                    email: e.target.value
                                }))
                            }}    
                        />
                        <LabelledInput
                            label="Password"
                            type={"password"}
                            placeholder="Password"
                            onChange={(e) => {
                                setPostInputs((c) => ({
                                    ...c,
                                    password: e.target.value
                                }))
                            }}    
                        />
                        <button
                            onClick={sendRequest}
                            type="button"
                            className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus: ring-4 focus:ring-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                        >
                            {type === "signup" ? "Sign up" : "Sign in"}
                        </button>
                    </div>
                </div>

            </div>

        </div>
    </>
}

interface LabelledInputType{
    label: string
    placeholder: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    type?: string
}

function LabelledInput({
    label, placeholder, onChange, type
}: LabelledInputType){
    return <>
        <div>
            <label className="block mb-2 text-sm font-semibold text-black pt-4">
                {label}
            </label>
            <input 
            type={type || "text"}
            onChange={onChange}
            id="first_name"
            className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-900 block w-full p-2.5"
            placeholder={placeholder}
            required 
            />
        </div>
    </>
}