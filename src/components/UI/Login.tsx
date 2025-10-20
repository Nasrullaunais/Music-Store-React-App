"use client";

import React from "react";
import {Button, Input, Checkbox, Link as NextLink, Form} from "@heroui/react";
import {Icon} from "@iconify/react";
import {LoginCredentials} from "@/types";
import { FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface LoginProps {
    onLogin: (credentials: LoginCredentials) => void;
    onSwitchToRegister: () => void;
    error?: string | null;
}

export default function Login({ onLogin, onSwitchToRegister, error }: LoginProps) {
    const [isVisible, setIsVisible] = React.useState(false);
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [errors, setErrors] = React.useState<{ username?: string; password?: string }>({});
    const [isLoading, setIsLoading] = React.useState(false);
    const navigate = useNavigate();

    const toggleVisibility = () => setIsVisible(!isVisible);

    const validateForm = () => {
        const newErrors: { username?: string; password?: string } = {};

        if (!username.trim()) {
            newErrors.username = "Username is required";
        } else if (username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await onLogin({ username, password });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="rounded-large flex w-9/10 max-w-sm flex-col gap-4 p-8">
                <div className="flex flex-col items-center pb-6 transition-all duration-500">
                    <div className={`transition-all duration-500 ${error ? 'scale-110 mb-3' : 'mb-5'}`}>
                        {error ? (
                            <div className="p-3 bg-danger/20 rounded-full animate-shake">
                                <FiAlertCircle className="h-12 w-12 text-danger" />
                            </div>
                        ) : (
                            <img alt="logo" className="h-12 w-12 accent-purple-800" src="/logo-dark.svg"/>
                        )}
                    </div>
                    <div className={`transition-all duration-500 text-center ${error ? 'animate-header-to-error' : ''}`}>
                        <p className={`text-xl font-medium transition-all duration-500 ${
                            error ? 'text-danger' : 'text-foreground'
                        }`}>
                            {error ? 'Authentication Failed' : 'Welcome Back'}
                        </p>
                        <p className={`text-small transition-all duration-500 mt-1 ${
                            error ? 'text-danger/80' : 'text-default-500'
                        }`}>
                            {error || 'Log in to your account to continue'}
                        </p>
                    </div>
                </div>
                <Form className="flex flex-col gap-6" validationBehavior="native" onSubmit={handleSubmit}>
                    <Input
                        isRequired
                        label="Username"
                        name="username"
                        type="text"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            if (errors.username) setErrors({ ...errors, username: undefined });
                        }}
                        isInvalid={!!errors.username}
                        errorMessage={errors.username}
                        classNames={{
                            inputWrapper: "bg-white/50 backdrop-blur-lg border-purple-300/50"
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
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors({ ...errors, password: undefined });
                        }}
                        isInvalid={!!errors.password}
                        errorMessage={errors.password}
                        classNames={{
                            inputWrapper: "bg-white/50 backdrop-blur-lg border-purple-300/50"
                        }}
                    />
                    <div className="flex w-full items-center justify-between px-1 py-2 ">
                        <Checkbox name="remember" size="sm" color={ "primary" } defaultSelected={true}>
                            Remember me
                        </Checkbox>
                        <NextLink
                            className="text-default-500 cursor-pointer"
                            onClick={() => navigate('/forgot-password')}
                            size="sm"
                        >
                            Forgot password?
                        </NextLink>
                    </div>
                    <Button
                        className="w-full text-white"
                        color={"primary"}
                        type="submit"
                        isLoading={isLoading}
                    >
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
