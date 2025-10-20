"use client";

import React, {useState} from "react";
import {Button, Input, Link as NextLink, Checkbox} from "@heroui/react";
import {Icon} from "@iconify/react";
import {RegisterData} from "@/types";
import { FiAlertCircle } from "react-icons/fi";
import { containsCensoredWords } from "@/utils/profanityFilter";

interface RegisterProps {
    onRegister: (userData: RegisterData) => void;
    onSwitchToLogin: () => void;
    error?: string | null;
}

export default function Register({ onRegister, onSwitchToLogin, error}: RegisterProps) {
    const [isVisible, setIsVisible] = React.useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isArtist, setIsArtist] = useState(false);
    const [artistName, setArtistName] = useState('');
    const [errors, setErrors] = useState<{
        username?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        firstName?: string;
        lastName?: string;
        artistName?: string;
    }>({});
    const [isLoading, setIsLoading] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        const newErrors: any = {};

        // Username validation
        if (!username.trim()) {
            newErrors.username = "Username is required";
        } else if (username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        } else if (username.length > 20) {
            newErrors.username = "Username must be less than 20 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            newErrors.username = "Username can only contain letters, numbers, and underscores";
        } else if (containsCensoredWords(username)) {
            newErrors.username = "Username contains inappropriate language";
        }

        // Email validation
        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Password validation
        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        } else if (password.length > 50) {
            newErrors.password = "Password must be less than 50 characters";
        } else if (containsCensoredWords(password)) {
            newErrors.password = "Password contains inappropriate language";
        }

        // Confirm password validation
        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        // First name validation
        if (!firstName.trim()) {
            newErrors.firstName = "First name is required";
        } else if (firstName.length < 2) {
            newErrors.firstName = "First name must be at least 2 characters";
        } else if (containsCensoredWords(firstName)) {
            newErrors.firstName = "First name contains inappropriate language";
        }

        // Last name validation
        if (!lastName.trim()) {
            newErrors.lastName = "Last name is required";
        } else if (lastName.length < 2) {
            newErrors.lastName = "Last name must be at least 2 characters";
        } else if (containsCensoredWords(lastName)) {
            newErrors.lastName = "Last name contains inappropriate language";
        }

        // Artist name validation (if artist is selected)
        if (isArtist && !artistName.trim()) {
            newErrors.artistName = "Artist name is required";
        } else if (isArtist && artistName.length < 2) {
            newErrors.artistName = "Artist name must be at least 2 characters";
        } else if (isArtist && containsCensoredWords(artistName)) {
            newErrors.artistName = "Artist name contains inappropriate language";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            onRegister({
                username,
                email,
                password,
                artistName,
                firstName,
                lastName,
                role: isArtist ? 'ARTIST' : 'CUSTOMER'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="rounded-large flex w-9/10 max-w-sm flex-col gap-4">
                <div className="flex flex-col items-center pb-6 transition-all duration-500">
                    <div className={`transition-all duration-500 ${error ? 'scale-110 mb-1' : 'mb-2'}`}>
                        {error ? (
                            <div className="p-3 bg-danger/20 rounded-full animate-shake">
                                <FiAlertCircle className="h-12 w-12 text-danger" />
                            </div>
                        ) : (
                            <img alt="logo" className="h-12 w-12" src="/logo-dark.svg"/>
                        )}
                    </div>
                    <div className={`transition-all duration-500 text-center ${error ? 'animate-header-to-error' : ''}`}>
                        <p className={`text-xl font-medium transition-all duration-500 ${
                            error ? 'text-danger' : 'text-foreground'
                        }`}>
                            {error ? 'Registration Failed' : 'Welcome'}
                        </p>
                        <p className={`text-small transition-all duration-500 mt-1 ${
                            error ? 'text-danger/80' : 'text-default-500'
                        }`}>
                            {error || 'Create an account to get started'}
                        </p>
                    </div>
                </div>
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <Input
                            isRequired
                            classNames={{
                                base: "-mb-[2px]",
                                inputWrapper:
                                    "rounded-b-none bg-white/50 data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10 mt-3",
                            }}
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
                        />
                        <Input
                            isRequired
                            classNames={{
                                base: "-mb-[2px]",
                                inputWrapper:
                                    "rounded-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10 bg-white/50",
                            }}
                            label="Email Address"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors({ ...errors, email: undefined });
                            }}
                            isInvalid={!!errors.email}
                            errorMessage={errors.email}
                        />
                        <Input
                            isRequired
                            classNames={{
                                base: "-mb-[2px]",
                                inputWrapper:
                                    "rounded-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10 bg-white/50",
                            }}
                            endContent={
                                <button type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <Icon
                                            className="text-default-400 pointer-events-none text-2xl"
                                            icon="solar:eye-closed-linear"
                                        />
                                    ) : (
                                        <Icon
                                            className="text-default-400 pointer-events-none text-2xl"
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
                        />
                        <Input
                            isRequired
                            classNames={{
                                inputWrapper: "rounded-t-none bg-white/50",
                            }}
                            endContent={
                                <button type="button" onClick={toggleConfirmVisibility}>
                                    {isConfirmVisible ? (
                                        <Icon
                                            className="text-default-400 pointer-events-none text-2xl transition-transform duration-300"
                                            icon="solar:eye-closed-linear"
                                        />
                                    ) : (
                                        <Icon
                                            className="text-default-400 pointer-events-none text-2xl transition-transform duration-300"
                                            icon="solar:eye-bold"
                                        />
                                    )}
                                </button>
                            }
                            label="Confirm Password"
                            name="confirmPassword"
                            type={isConfirmVisible ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                            }}
                            isInvalid={!!errors.confirmPassword}
                            errorMessage={errors.confirmPassword}
                        />
                        <Input
                            isRequired
                            classNames={{
                                inputWrapper: "rounded-b-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10 mt-3 bg-white/50",
                            }}
                            label="First Name"
                            name="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => {
                                setFirstName(e.target.value);
                                if (errors.firstName) setErrors({ ...errors, firstName: undefined });
                            }}
                            isInvalid={!!errors.firstName}
                            errorMessage={errors.firstName}
                        />
                        <Input
                            isRequired
                            classNames={{
                                inputWrapper: "rounded-t-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10 bg-white/50",
                            }}
                            label="Last Name"
                            name="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => {
                                setLastName(e.target.value);
                                if (errors.lastName) setErrors({ ...errors, lastName: undefined });
                            }}
                            isInvalid={!!errors.lastName}
                            errorMessage={errors.lastName}
                        />
                        {isArtist && (
                            <Input
                                isRequired
                                classNames={{
                                    inputWrapper: "rounded-b-t data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10 mt-3 transition-all duration-300 bg-white/50",
                                }}
                                label="Artist Name"
                                name="artistName"
                                type="text"
                                value={artistName}
                                onChange={(e) => {
                                    setArtistName(e.target.value);
                                    if (errors.artistName) setErrors({ ...errors, artistName: undefined });
                                }}
                                isInvalid={!!errors.artistName}
                                errorMessage={errors.artistName}
                            />
                        )}
                        <div className="mt-2 ml-3">
                            <Checkbox defaultSelected={false} name="isArtist" size="sm" checked={isArtist} onChange={() => setIsArtist(!isArtist)}>
                                I'm an artist
                            </Checkbox>
                        </div>
                    </div>
                    <Button
                        color="primary text-white"
                        type="submit"
                        isLoading={isLoading}
                    >
                        Sign Up
                    </Button>
                </form>
                <p className="text-small text-center">
                    Already have an account?&nbsp;
                    <NextLink onClick={onSwitchToLogin} size="sm">
                        Log In
                    </NextLink>
                </p>
            </div>
        </div>
    );
}
