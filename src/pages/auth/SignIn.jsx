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

const SignIn = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { isDarkMode, login } = useApp(); // Add login function from context

    const initialValues = {
        email: '',
        password: '',
    };

    const validate = (values) => {
        const errors = {};

        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.email)) errors.email = 'Invalid email format';
        if (!values.email.trim()) errors.email = 'Email is required';

        if (values.password.length < 6) errors.password = 'Must be at least 6 characters';
        if (!values.password.trim()) errors.password = 'Password is required';

        return errors;
    };

    const handleSubmit = async (values, {resetForm}) => {
        setLoading(true);
        let payload = {
            email: values.email,
            password: values.password
        }
        try {
            await AxiosServices.post(ApiUrlServices.SIGN_IN, payload)
                .then((res) => {
                    // Save user data to localStorage
                    localStorage.setItem("user", JSON.stringify(res.data.result));

                    // Call login function from AppContext to update state
                    login(res.data.result);

                    console.log('Login successful, user logged in:', res.data.result);

                    resetForm();

                    // Navigate to admin dashboard instead of home
                    navigate('/admin/dashboard');
                    // toast.success("Sign In Successfully.")
                })
        } catch (error) {
            const emailError = error?.response?.data?.msg?.email;
            console.error('Login error:', error);
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
                    <h2 className="signin-title">Sign In to your account</h2>
                    <Formik
                        initialValues={initialValues}
                        validate={validate}
                        onSubmit={handleSubmit}
                    >
                        <Form className="signin-form">
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
                                label="Sign In"
                                btnClassName="default-submit-btn signin-btn"
                            />
                        </Form>
                    </Formik>
                    <div className="forgot-pass-signup-link">
                        <p className="already-account">Forgotten password?</p>
                        <button
                            onClick={() => navigate(path.signup)}
                            className="signup-link"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;