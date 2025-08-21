import React, {useState, useCallback, useEffect} from "react";
import {ErrorMessage, useField, useFormikContext} from "formik";
import Cropper from "react-easy-crop";
import {Button, Slider} from "@mui/material";
import "./customFileUpload.scss";
import getCroppedImg from "./CropImage.jsx";
import {FaCloudUploadAlt} from "react-icons/fa";

function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(reader.result));
        reader.readAsDataURL(file);
    });
}

const CustomFileUploadWithPreview = ({
                                         label,
                                         labelClassName = "",
                                         uploadText = "Upload File",
                                         accept = "*/*",
                                         previewWidth = 200,
                                         previewHeight = 200,
                                         cropperWidth = 400,
                                         cropperHeight = 300,
                                         icon: IconComponent = null,
                                         className = "",
                                         multiple = false,
                                         enableCrop = false,
                                         aspect = 1,
                                         existingImageUrl = null,
                                         ...props
                                     }) => {
    const [field, meta] = useField(props);
    const {setFieldValue} = useFormikContext();
    const error = meta.touched && meta.error;

    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [previewFiles, setPreviewFiles] = useState([]);
    const [hasExistingImage, setHasExistingImage] = useState(false);

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Initialize existing image on component mount
    useEffect(() => {
        if (existingImageUrl && previewFiles.length === 0) {
            setPreviewFiles([{
                file: null,
                preview: existingImageUrl,
                isExisting: true
            }]);
            setHasExistingImage(true);
        }
    }, [existingImageUrl]);

    // Handle file input change
    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Clear existing image when new file is selected
        setHasExistingImage(false);

        if (multiple) {
            // For multiple files, read all and set previews
            const allFiles = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const preview = await readFile(file);
                allFiles.push({file, preview, isExisting: false});
            }
            setPreviewFiles(allFiles);
            setFieldValue(field.name, Array.from(files));
            setImageSrc(null);
        } else {
            // Single file
            const file = files[0];
            if (enableCrop && file.type.startsWith("image/")) {
                const imageDataUrl = await readFile(file);
                setImageSrc(imageDataUrl);
            } else {
                const preview = await readFile(file);
                setPreviewFiles([{file, preview, isExisting: false}]);
                setImageSrc(null);
            }
            setFieldValue(field.name, file);
        }
    };

    // Show cropped image & update formik field with cropped blob
    const showCroppedImage = async () => {
        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            setFieldValue(field.name, croppedBlob);

            // Update preview with cropped image URL
            const croppedPreviewUrl = URL.createObjectURL(croppedBlob);
            setPreviewFiles([{file: croppedBlob, preview: croppedPreviewUrl, isExisting: false}]);

            setImageSrc(null);
            setHasExistingImage(false);
        } catch (e) {
            console.error(e);
        }
    };

    // Remove preview & reset
    const handleRemovePreview = () => {
        setPreviewFiles([]);
        setImageSrc(null);
        setHasExistingImage(false);
        setFieldValue(field.name, multiple ? [] : null);
    };

    // Handle clicking on existing image to replace
    const handleReplaceExistingImage = () => {
        const fileInput = document.getElementById(props.id || props.name);
        fileInput?.click();
    };

    return (
        <div className={`custom-file-upload-wrapper ${className}`} style={{marginBottom: "1rem"}}>
            {label && (
                <label
                    htmlFor={props.id || props.name}
                    className={labelClassName}
                    style={{display: "block", marginBottom: "6px", fontWeight: "bold", textAlign: "left"}}
                >
                    {label}
                </label>
            )}

            {/* Main container for upload/preview - keeps consistent position */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start", // Changed from center to flex-start
                    gap: "12px"
                }}
            >
                {/* If preview exists, show preview */}
                {previewFiles.length > 0 && (
                    <div
                        className="preview-container"
                        style={{
                            display: "flex",
                            gap: "12px",
                            flexWrap: "wrap",
                            // Removed justifyContent: "center" to prevent centering
                        }}
                    >
                        {previewFiles.map(({preview, isExisting}, idx) => (
                            <div
                                key={idx}
                                style={{
                                    position: "relative",
                                    width: previewWidth,
                                    height: previewHeight,
                                    borderRadius: "6px",
                                    overflow: "hidden",
                                    border: "1px solid #ccc",
                                    backgroundColor: "#fafafa",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                                }}
                            >
                                {/* Image preview */}
                                {preview && (
                                    <img
                                        src={preview}
                                        alt={`preview-${idx}`}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            cursor: isExisting ? "pointer" : "default"
                                        }}
                                        onClick={isExisting ? handleReplaceExistingImage : undefined}
                                        title={isExisting ? "Click to replace image" : undefined}
                                    />
                                )}

                                {/* Remove button */}
                                <button
                                    type="button"
                                    onClick={handleRemovePreview}
                                    style={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        background: "rgba(255,255,255,0.95)",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: 28,
                                        height: 28,
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                                        color: "#666",
                                        transition: "all 0.2s ease"
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.background = "rgba(255,255,255,1)";
                                        e.target.style.color = "#333";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background = "rgba(255,255,255,0.95)";
                                        e.target.style.color = "#666";
                                    }}
                                    aria-label="Remove preview"
                                >
                                    ×
                                </button>

                                {/* Replace button for existing images */}
                                {isExisting && (
                                    <button
                                        type="button"
                                        onClick={handleReplaceExistingImage}
                                        style={{
                                            position: "absolute",
                                            bottom: 8,
                                            right: 8,
                                            background: "rgba(0,123,255,0.9)",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            padding: "4px 8px",
                                            cursor: "pointer",
                                            fontSize: "10px",
                                            fontWeight: "bold",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                            transition: "all 0.2s ease"
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.background = "rgba(0,123,255,1)";
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.background = "rgba(0,123,255,0.9)";
                                        }}
                                        aria-label="Replace image"
                                    >
                                        Replace
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload button - only show if no preview or crop UI active */}
                {!imageSrc && previewFiles.length === 0 && (
                    <label
                        htmlFor={props.id || props.name}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            cursor: "pointer",
                            userSelect: "none",
                            gap: 8,
                            border: "2px dashed #007bff",
                            padding: "16px 24px",
                            borderRadius: "8px",
                            width: previewWidth,
                            height: previewHeight,
                            justifyContent: "center",
                            color: "#007bff",
                            flexDirection: "column",
                            backgroundColor: "#f8f9fa",
                            transition: "all 0.3s ease",
                            boxSizing: "border-box"
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = "#e3f2fd";
                            e.target.style.borderColor = "#0056b3";
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = "#f8f9fa";
                            e.target.style.borderColor = "#007bff";
                        }}
                    >
                        {IconComponent && <IconComponent size={32}/>}
                        <span style={{
                            textAlign: "center",
                            fontSize: "14px",
                            fontWeight: "500"
                        }}>
                            {uploadText}
                        </span>
                    </label>
                )}
            </div>

            <input
                id={props.id || props.name}
                type="file"
                accept={accept}
                style={{display: "none"}}
                multiple={multiple}
                onChange={handleFileChange}
                {...props}
            />

            {/* Crop UI */}
            {imageSrc && enableCrop && (
                <div
                    className="crop-container"
                    style={{
                        position: "relative",
                        width: cropperWidth,
                        height: cropperHeight,
                        background: "#333",
                        borderRadius: "8px",
                        overflow: "hidden",
                        marginTop: "16px",
                        marginBottom: "16px"
                    }}
                >
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        style={{
                            containerStyle: {width: "100%", height: "100%"},
                            mediaStyle: {borderRadius: "8px"},
                        }}
                    />

                    {/* Controls container */}
                    <div style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "16px",
                        background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4))",
                        backdropFilter: "blur(4px)"
                    }}>
                        <Slider
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e, z) => setZoom(z)}
                            style={{
                                width: "80%",
                                marginBottom: "12px",
                                color: "#fff"
                            }}
                            sx={{
                                color: '#fff',
                                '& .MuiSlider-thumb': {
                                    backgroundColor: '#fff',
                                },
                                '& .MuiSlider-track': {
                                    backgroundColor: '#fff',
                                },
                                '& .MuiSlider-rail': {
                                    backgroundColor: 'rgba(255,255,255,0.3)',
                                }
                            }}
                        />
                        <div style={{display: "flex", gap: "12px"}}>
                            <Button
                                onClick={showCroppedImage}
                                variant="contained"
                                color="primary"
                                size="small"
                                style={{
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    fontWeight: "600"
                                }}
                            >
                                Crop & Upload
                            </Button>
                            <Button
                                onClick={() => {
                                    setImageSrc(null);
                                    // Restore existing image if available
                                    if (existingImageUrl && hasExistingImage) {
                                        setPreviewFiles([{
                                            file: null,
                                            preview: existingImageUrl,
                                            isExisting: true
                                        }]);
                                    }
                                }}
                                variant="outlined"
                                size="small"
                                style={{
                                    borderColor: "#fff",
                                    color: "#fff",
                                    backgroundColor: "rgba(255,255,255,0.1)"
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <small
                    className="error-text"
                    style={{
                        color: "#dc3545",
                        display: "block",
                        marginTop: "8px",
                        fontSize: "12px",
                        fontWeight: "500"
                    }}
                >
                    {meta.error}
                </small>
            )}
        </div>
    );
};

export default CustomFileUploadWithPreview;