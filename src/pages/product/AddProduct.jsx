import React, {useState, useEffect} from 'react';
import {Formik, Form, Field, ErrorMessage, FieldArray} from 'formik';
import {useNavigate} from 'react-router-dom';
import AxiosServices from '../../components/network/AxiosServices.jsx';
import ApiUrlServices from '../../components/network/ApiUrlServices.jsx';
import CustomButton from "../../components/customButton/CustomButton.jsx";
import path from "../../routes/path.jsx";
import {FaCloudUploadAlt, FaUpload} from "react-icons/fa";
import CustomSelect from "../../components/customselect/CustomSelect.jsx";
import CustomFileUploadWithPreview from "../../components/customFileUpload/CustomFileUpload.jsx";
import CustomInput from "../../components/customInput/CustomInput.jsx";

const AddProduct = ({product, onSuccess, categoryList}) => {

    const optionsRole = [
        {label: "Home", value: "home"},
        {label: "Away", value: "away"},
        {label: "Special", value: "special"},
        {label: "Others", value: "others"},
    ];

    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();

    const initialValues = {
        name: product?.name || '',
        price: product?.price || '',
        description: product?.description || '',
        role: product?.role || '',
        team: product?.team || '',
        image: null,
        category_id: product?.category_id || "",
        variants: product?.variants?.length > 0 ? product.variants : [
            {color: '', size: '', stock: ''}
        ]
    };

    useEffect(() => {
        if (product?.image) {
            // Image is now a complete Cloudinary URL
            setPreviewImage(product.image);
        }
    }, [product]);

    const validate = (values) => {
        const errors = {};
        if (!values.category_id.toString().trim()) errors.category_id = 'Please select category';
        if (!values.name.trim()) errors.name = 'Product name is required';
        if (!values.price.toString().trim()) errors.price = 'Product price is required';
        if (!values.team.trim()) errors.team = 'Team name is required';
        if (!values.role.trim()) errors.role = 'Role is required';
        if (!values.description.trim()) errors.description = 'Description is required';
        if (!product && !values.image) errors.image = 'Image is required';

        // Variants validation
        const variantErrors = [];
        values.variants.forEach((variant, index) => {
            const variantError = {};
            if (!variant.color.trim()) variantError.color = 'Color is required';
            if (!variant.size.trim()) variantError.size = 'Size is required';
            if (!variant.stock.toString().trim()) variantError.stock = 'Stock is required';
            if (Object.keys(variantError).length > 0) {
                variantErrors[index] = variantError;
            }
        });

        if (variantErrors.length > 0) {
            errors.variants = variantErrors;
        }
        return errors;
    };

const handleSubmit = async (values) => {
    console.log('Submitting values:', values)
    setLoading(true);

    // Validate at least one variant
    const filteredVariants = values.variants.filter(
        v => v.color.trim() && v.size.trim() && v.stock.toString().trim()
    );
    if (filteredVariants.length === 0) {
        alert("Please add at least one variant");
        setLoading(false);
        return;
    }

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('price', values.price);
    formData.append('description', values.description);
    formData.append('role', values.role);
    formData.append('team', values.team);
    formData.append('category_id', values.category_id);

    // Only append image if new file is selected
    if (values.image) {
        formData.append('image', values.image);
    }

    filteredVariants.forEach((variant, index) => {
        formData.append(`variants[${index}][color]`, variant.color);
        formData.append(`variants[${index}][size]`, variant.size);
        formData.append(`variants[${index}][stock]`, variant.stock);
    });

    try {
        let response;
        if (product) {
            // ✅ Add method spoofing for Laravel PUT request
            formData.append('_method', 'PUT');
            
            // Use POST but Laravel will treat it as PUT
            response = await AxiosServices.post(
                ApiUrlServices.UPDATE_PRODUCT(product.id),
                formData,
                true // multipart/form-data
            );
        } else {
            // Create new product
            response = await AxiosServices.post(
                ApiUrlServices.ADD_PRODUCT,
                formData,
                true // multipart/form-data
            );
        }

        console.log('Product saved successfully:', response.data);
        alert(product ? 'Product updated successfully!' : 'Product created successfully!');

        if (onSuccess) {
            onSuccess();
        } else {
            navigate(path.home);
        }
    } catch (error) {
        console.error('Error saving product:', error);

        const errorMessage = error.response?.data?.message ||
                             error.response?.data?.error ||
                             'Failed to save product. Please try again.';

        if (error.response?.data?.errors) {
            const validationErrors = Object.values(error.response.data.errors).flat().join('\n');
            alert(`Validation Errors:\n${validationErrors}`);
        } else {
            alert(errorMessage);
        }
    } finally {
        setLoading(false);
    }
};

    const handleImageChange = (setFieldValue, file) => {
        setFieldValue('image', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            // If editing and no new file selected, keep the existing preview
            if (product?.image) {
                setPreviewImage(product.image);
            } else {
                setPreviewImage(null);
            }
        }
    };

    return (
        <div>
            <Formik
                initialValues={initialValues}
                validate={validate}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({setFieldValue}) => (
                    <Form encType="multipart/form-data">
                        <div className="textbox">
                            <div className="mb-3">
                                <CustomSelect
                                    name="category_id"
                                    label="Category"
                                    placeholder="Please select category"
                                    options={categoryList.map((item) => ({
                                        label: item.category_name.toUpperCase(),
                                        value: item.id,
                                    }))}
                                />
                            </div>
                            <div className="mb-3">
                                <CustomInput
                                    name="name"
                                    label="Product name"
                                    placeholder="Enter product name"
                                    labelClassName="signin-label"
                                    inputClassName="signin-input"
                                />
                            </div>
                            <div className="mb-3">
                                <CustomInput
                                    name="price"
                                    label="Product price"
                                    placeholder="Enter product price"
                                    labelClassName="signin-label"
                                    inputClassName="signin-input"
                                />
                            </div>
                            <div className="mb-3">
                                <CustomInput
                                    name="team"
                                    label="Team name"
                                    placeholder="Enter team name"
                                    labelClassName="signin-label"
                                    inputClassName="signin-input"
                                />
                            </div>
                            <div className="mb-3">
                                <CustomSelect
                                    name="role"
                                    label="role"
                                    placeholder="Please select role"
                                    options={optionsRole.map((item) => ({
                                        label: item.label.toUpperCase(),
                                        value: item.value,
                                    }))}
                                />
                            </div>

                            <div className="mb-3 mt-3">
                                <CustomFileUploadWithPreview
                                    name="image"
                                    label="Product Image"
                                    labelClassName="my-label-class mb-2"
                                    className="my-custom-upload"
                                    uploadText="Click to Upload Product Image"
                                    accept="image/*"
                                    previewWidth={250}
                                    previewHeight={250}
                                    cropperWidth={250}
                                    cropperHeight={250}
                                    icon={FaCloudUploadAlt}
                                    multiple={false}
                                    enableCrop={false}
                                    aspect={1}
                                    existingImageUrl={product?.image}
                                />
                                {/*<ErrorMessage name="image" component="div" className="error-message"/>*/}
                            </div>

                            <div className="mb-3">
                                <CustomInput
                                    name="description"
                                    label="Product description"
                                    placeholder="Enter product description"
                                    labelClassName="signin-label"
                                    inputClassName="signin-input"
                                />
                            </div>

                            <hr/>
                            <FieldArray name="variants">
                                {({push, remove, form}) => (
                                    <>
                                        {form.values.variants.map((variant, index) => {
                                            const isFirst = index === 0;
                                            const suffix = isFirst ? '' : ` ${index}`;
                                            return (
                                                <div key={index} className="variant-group"
                                                     style={{
                                                         marginBottom: '1.5rem',
                                                         border: '1px solid #ddd',
                                                         padding: '1rem',
                                                         borderRadius: '6px',
                                                         position: 'relative'
                                                     }}
                                                >

                                                    {/* Header row with title and buttons */}
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginBottom: '1rem'
                                                    }}>
                                                        <h5 style={{margin: 0}}>Product
                                                            Variant {isFirst ? '' : index}</h5>
                                                        <div style={{display: 'flex', gap: '0.5rem'}}>
                                                            {form.values.variants.length > 1 && (
                                                                <CustomButton
                                                                    isLoading={loading}
                                                                    type="button"
                                                                    label="❌ Remove"
                                                                    onClick={() => remove(index)}
                                                                    btnClassName="default-submit-btn signin-btn"
                                                                    style={{
                                                                        background: '#ef4444',
                                                                        padding: '0.5rem 1rem',
                                                                        fontSize: '0.875rem'
                                                                    }}
                                                                />
                                                            )}
                                                            <CustomButton
                                                                isLoading={loading}
                                                                type="button"
                                                                label="+ Add Variant"
                                                                onClick={() => push({color: '', size: '', stock: ''})}
                                                                btnClassName="default-submit-btn signin-btn"
                                                                style={{
                                                                    padding: '0.5rem 1rem',
                                                                    fontSize: '0.875rem'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Inputs */}
                                                    <div style={{marginTop: '1rem'}}>
                                                        <div className="mb-3">
                                                            <CustomInput
                                                                name={`variants[${index}].color`}
                                                                label={`Color${suffix}`}
                                                                placeholder="Enter color"
                                                                labelClassName="signin-label"
                                                                inputClassName="signin-input"
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <CustomInput
                                                                name={`variants[${index}].size`}
                                                                label={`Size${suffix}`}
                                                                placeholder="Enter size"
                                                                labelClassName="signin-label"
                                                                inputClassName="signin-input"
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <CustomInput
                                                                name={`variants[${index}].stock`}
                                                                label={`Stock${suffix}`}
                                                                placeholder="Enter stock"
                                                                labelClassName="signin-label"
                                                                inputClassName="signin-input"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                            </FieldArray>
                        </div>
                        <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '2rem'}}>
                            <CustomButton
                                isLoading={loading}
                                type="submit"
                                label={product ? "Update Product" : "Add Product"}
                                btnClassName="default-submit-btn signin-btn"
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddProduct;