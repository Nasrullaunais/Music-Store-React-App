"use client";

import React from "react";
import {Button, Input, Checkbox, Link as NextLink, Form} from "@heroui/react";
import {Icon} from "@iconify/react";
import {LoginCredentials} from "@/types";

interface LoginProps {
    onLogin: (credentials: LoginCredentials) => void;
    onSwitchToRegister: () => void;
}

export default function Login({ onLogin, onSwitchToRegister }: LoginProps) {
    const [isVisible, setIsVisible] = React.useState(false);
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onLogin({ username, password });
    };

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="rounded-large flex w-9/10 max-w-sm flex-col gap-4">
                <div className="flex flex-col items-center pb-6">
                    <img alt="logo" className="h-12 w-12 mb-5 accent-purple-800" src="/logo-dark.svg"/>
                    <p className="text-xl font-medium">Welcome Back</p>
                    <p className="text-small text-default-500">Log in to your account to continue</p>
                </div>
                <Form className="flex flex-col gap-4" validationBehavior="native" onSubmit={handleSubmit}>
                    <Input
                        isRequired
                        label="Username"
                        name="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        classNames={{
                            input: "bg-gray-800", // Change input background
                            inputWrapper: "bg-violet-50", // Change wrapper background
                        }}
                    />
                    <Input
                        isRequired
                        endContent={
                            <button type="button" onClick={toggleVisibility}>
                                {isVisible ? (
                                    <Icon
                                        className="text-default-400 pointer-events-none text-2xl mb-1"
                                        icon="solar:eye-closed-linear"
                                    />
                                ) : (
                                    <Icon
                                        className="text-default-400 pointer-events-none text-2xl mb-1"
                                        icon="solar:eye-bold"
                                    />
                                )}
                            </button>
                        }
                        label="Password"
                        name="password"
                        type={isVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        classNames={{
                            input: "bg-gray-800", // Change input background
                            inputWrapper: "bg-violet-50", // Change wrapper background
                        }}

                    />
                    <div className="flex w-full items-center justify-between px-1 py-2 ">
                        <Checkbox name="remember" size="sm" color={ "primary" } defaultSelected={true}>
                            Remember me
                        </Checkbox>
                        <NextLink className="text-default-500" href="#" size="sm">
                            Forgot password?
                        </NextLink>
                    </div>
                    <Button className="w-full text-white" color={"primary"} type="submit">
                        Sign In
                    </Button>
                </Form>
                <p className="text-small text-center">
                    Need to create an account?&nbsp;
                    <NextLink onClick={onSwitchToRegister} size="sm">
                        Sign Up
                    </NextLink>
                </p>
            </div>
        </div>
    );
}
