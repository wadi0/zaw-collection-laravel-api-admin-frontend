import { useField } from 'formik';
import "./customInput.scss";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faEnvelope, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const CustomInput = ({ inputOnChange, labelClassName, inputClassName, showEmailIcon = false, ...props }) => {
    const [field, meta] = useField(props);
    const error = meta.touched && meta.error;
    const [showPassword, setShowPassword] = useState(false);

    // Email validation
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleChange = (e) => {
        field.onChange(e);
        if (inputOnChange) {
            inputOnChange(e);
        }
    };

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const isPassword = props.type === 'password';
    const isEmail = props.type === 'email';
    const hasValue = field.value && field.value.length > 0;
    const isEmailValid = isEmail && hasValue && isValidEmail(field.value);
    const isEmailInvalid = isEmail && hasValue && !isValidEmail(field.value);

    return (
        <div className={`custom-input ${error ? 'error' : ''} ${isEmailValid ? 'valid' : ''} ${isEmailInvalid ? 'invalid' : ''}`}>
            {props.label && (
                <label
                    className={labelClassName || ''}
                    htmlFor={props.id || props.name}
                >
                    {props.label}
                    {props.required && <span className="required">*</span>}
                </label>
            )}

            <div className="input-wrapper">
                {/* Email Icon - Left side */}
                {(isEmail || showEmailIcon) && (
                    <span className="email-icon">
                        <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                )}

                <input
                    {...field}
                    {...props}
                    type={isPassword ? (showPassword ? 'text' : 'password') : props.type}
                    onChange={handleChange}
                    className={`input-box ${field.value ? 'filled' : ''} ${inputClassName || ''} ${(isEmail || showEmailIcon) ? 'with-email-icon' : ''}`}
                    aria-invalid={error || isEmailInvalid ? 'true' : 'false'}
                    aria-describedby={error ? `${props.name}-error` : undefined}
                />

                {/* Right side icons container */}
                <div className="right-icons">
                    {/* Email validation icon */}
                    {isEmail && hasValue && !error && (
                        <span className={`validation-icon ${isEmailValid ? 'valid' : 'invalid'}`}>
                            <FontAwesomeIcon icon={isEmailValid ? faCheck : faTimes} />
                        </span>
                    )}

                    {/* Password toggle */}
                    {isPassword && (
                        <button
                            type="button"
                            className="eye-toggle"
                            onClick={togglePassword}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            tabIndex={0}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                    )}
                </div>
            </div>

            {/* Error message */}
            {error && (
                <small
                    className="error-text"
                    id={`${props.name}-error`}
                    role="alert"
                >
                    {meta.error}
                </small>
            )}

            {/* Email validation message */}
            {isEmail && hasValue && !error && isEmailInvalid && (
                <small className="validation-text invalid">
                    Please enter a valid email address
                </small>
            )}

            {/* Success message for valid email */}
            {isEmail && hasValue && !error && isEmailValid && (
                <small className="validation-text valid">
                    Email address looks good!
                </small>
            )}
        </div>
    );
};

export default CustomInput;




// import { useField } from 'formik';
// import "./customInput.scss";
// import { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
//
// const CustomInput = ({ inputOnChange, labelClassName, inputClassName, ...props }) => {
//     const [field, meta] = useField(props);
//     const error = meta.touched && meta.error;
//     const [showPassword, setShowPassword] = useState(false);
//
//     const handleChange = (e) => {
//         field.onChange(e);
//         if (inputOnChange) {
//             inputOnChange(e);
//         }
//     };
//
//     const togglePassword = () => {
//         setShowPassword((prev) => !prev);
//     };
//
//     const isPassword = props.type === 'password';
//
//     return (
//         <div className={`custom-input ${error ? 'error' : ''}`}>
//             {props.label && (
//                 <label
//                     className={labelClassName || ''}
//                     htmlFor={props.id || props.name}
//                 >
//                     {props.label}
//                     {props.required && <span className="required">*</span>}
//                 </label>
//             )}
//
//             <div className="input-wrapper">
//                 <input
//                     {...field}
//                     {...props}
//                     type={isPassword ? (showPassword ? 'text' : 'password') : props.type}
//                     onChange={handleChange}
//                     className={`input-box ${field.value ? 'filled' : ''} ${inputClassName || ''}`}
//                     aria-invalid={error ? 'true' : 'false'}
//                     aria-describedby={error ? `${props.name}-error` : undefined}
//                 />
//
//                 {isPassword && (
//                     <button
//                         type="button"
//                         className="eye-toggle"
//                         onClick={togglePassword}
//                         aria-label={showPassword ? 'Hide password' : 'Show password'}
//                         tabIndex={0}
//                     >
//                         <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
//                     </button>
//                 )}
//             </div>
//
//             {error && (
//                 <small
//                     className="error-text"
//                     id={`${props.name}-error`}
//                     role="alert"
//                 >
//                     {meta.error}
//                 </small>
//             )}
//         </div>
//     );
// };
//
// export default CustomInput;