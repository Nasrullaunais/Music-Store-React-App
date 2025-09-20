"use client";

import React, {useState} from "react";
import {Button, Input, Link as NextLink, Checkbox} from "@heroui/react";
import {Icon} from "@iconify/react";
import {RegistrationData} from "@/types";

interface RegisterProps {
    onRegister: (userData: RegistrationData) => void;
    onSwitchToLogin: () => void;
}

export default function Register({ onRegister, onSwitchToLogin}: RegisterProps) {
    const [isVisible, setIsVisible] = React.useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isArtist, setIsArtist] = useState(false);
    const [error, setError] = useState('');
    const [artistName, setArtistName] = useState('');

    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        onRegister({
            username, email, password, artistName, firstName, lastName, role: isArtist ? 'ARTIST' : 'CUSTOMER'
        })
    }

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="rounded-large flex w-9/10 max-w-sm flex-col gap-4">
                <div className="flex flex-col items-center pb-6">
                    <img alt="logo" className="h-12 w-12 mb-2" src="/logo-dark.svg"/>
                    <p className="text-xl font-medium">Welcome</p>
                    <p className="text-small text-default-500">Create an account to get started</p>
                </div>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex flex-col">
                        <Input
                            isRequired
                            classNames={{
                                base: "-mb-[2px]",
                                inputWrapper:
                                    "rounded-b-none bg-violet-50 data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10 mt-3",
                            }}
                            label="Username"
                            name="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input
                            isRequired
                            classNames={{
                                base: "-mb-[2px]",
                                inputWrapper:
                                    "rounded-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10 bg-violet-50",
                            }}
                            label="Email Address"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            isRequired
                            classNames={{
                                base: "-mb-[2px]",
                                inputWrapper:
                                    "rounded-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10 bg-violet-50",
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
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Input
                            isRequired
                            classNames={{
                                inputWrapper: "rounded-t-none bg-violet-50",
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
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Input
                            isRequired
                            classNames={{
                                inputWrapper: "rounded-b-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10 mt-3 bg-violet-50",
                            }}
                            label="First Name"
                            name="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <Input
                            isRequired
                            classNames={{
                                inputWrapper: "rounded-t-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10 bg-violet-50",
                            }}
                            label="Last Name"
                            name="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        {isArtist && (
                            <Input
                            isRequired
                            classNames={{
                            inputWrapper: "rounded-b-t data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10 mt-3 transition-all duration-300 bg-violet-50",
                            }}
                            label="Artist Name"
                            name="artistName"
                            type="text"
                            value={artistName}
                            onChange={(e) => setArtistName(e.target.value)}
                            />
                        )}
                        <div className="mt-2 ml-3">
                        <Checkbox defaultSelected={false} name="isArtist" size="sm" checked={isArtist} onChange={() => setIsArtist(!isArtist)}>
                            I'm an artist
                        </Checkbox>
                        </div>
                    </div>
                    <Button color="primary" type="submit">
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
