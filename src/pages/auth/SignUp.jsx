import React, { useState } from 'react';
import "./signin.scss";
import { Form, Formik } from "formik";
import CustomInput from "../../components/customInput/CustomInput.jsx";
import CustomButton from "../../components/customButton/CustomButton.jsx";
import AxiosServices from "../../components/network/AxiosServices.jsx";
import ApiUrlServices from "../../components/network/ApiUrlServices.jsx";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import path from "../../routes/path.jsx";

const SignUp = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { isDarkMode } = useApp(); // Use the context

    const initialValues = {
        name: '',
        email: '',
        password: '',
    };

    const validate = (values) => {
        const errors = {};

        if (!values.name) errors.name = "Name is required";

        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.email)) errors.email = 'Invalid email format';
        if (!values.email.trim()) errors.email = 'Email is required';

        if (values.password.length < 6) errors.password = 'Must be at least 6 characters';
        if (!values.password.trim()) errors.password = 'Password is required';

        return errors;
    };

    const handleSubmit = async (values, {resetForm}) => {
        setLoading(true);
        let payload = {
            name: values.name,
            email: values.email,
            password: values.password
        }
        try {
            await AxiosServices.post(ApiUrlServices.SIGN_UP, payload)
                .then((res) => {
                    resetForm();
                    // navigate(path.login); // Fix the path reference
                    navigate(path.signin);
                    // toast.success("Sign Up Successfully.")
                })
        } catch (error) {
            const emailError = error?.response?.data?.msg?.email;
            // if (emailError?.length) {
            //     toast.error(emailError[0]);
            // } else {
            //     toast.error("Something went wrong.");
            // }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`signIn_container ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="signin-card">
                <div className="image">
                    <div className='img' style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50%',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}>
                        S
                    </div>
                </div>
                <div className="signin-content">
                    <h2 className="signin-title">Sign Up your account</h2>
                    <Formik
                        initialValues={initialValues}
                        validate={validate}
                        onSubmit={handleSubmit}
                    >
                        <Form className="signin-form">
                            <div className="mb-3">
                                <CustomInput
                                    name="name"
                                    type="text"
                                    label="Name"
                                    placeholder="Enter your name"
                                    labelClassName="signin-label"
                                    inputClassName="signin-input"
                                />
                            </div>
                            <div className="mb-3">
                                <CustomInput
                                    name="email"
                                    type="email"
                                    label="Email"
                                    placeholder="Enter your email"
                                    labelClassName="signin-label"
                                    inputClassName="signin-input"
                                />
                            </div>
                            <div className="mb-3">
                                <CustomInput
                                    name="password"
                                    label="Password"
                                    placeholder="Enter your password"
                                    type="password"
                                    labelClassName="signin-label"
                                    inputClassName="signin-input"
                                />
                            </div>
                            <CustomButton
                                isLoading={loading}
                                type="submit"
                                label="Sign Up"
                                btnClassName="default-submit-btn signin-btn"
                            />
                        </Form>
                    </Formik>
                    <div className="forgot-pass-signup-link">
                        <p className="already-account">Already have an account?</p>
                        <button
                            onClick={() => navigate(path.signin)}
                            className="signup-link"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;