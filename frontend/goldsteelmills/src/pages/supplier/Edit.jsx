import { useLocation } from "react-router-dom";
import { Forms } from "../../Forms.js";
import { useState } from "react";
import axios from "axios";

export const SupplierEdit = () => {
    //errors state
    const [error, setError] = useState('');

    //access the inline data passed via navigation
    const { state } = useLocation();

    // Initialize state for each field
    const [formData, setFormData] = useState(() => {
        const initialData = {};
        Forms.SUPPLIER_CREATE.forEach(field => {
            initialData[field.name] = state[field.name] || '';
        });
        return initialData;
    });

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    async function handleSubmit(e) {

        try {
            e.preventDefault();
            //finally add the id of the source in formData
            formData.id=state.id
            const res = await axios.post(`supplier/${state.id}`, formData);
            if (res.status === 204) {
                alert("update successful");
            }

        } catch (e) {
            console.log(e);
            setError(e.response.data.error);
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {
                    Forms.SUPPLIER_CREATE.map((field, index) => (
                        <div key={index} className="mb-4">
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                                {field.label}
                            </label>
                            <input
                                value={formData[field.name]}
                                onChange={handleInputChange}
                                name={field.name}
                                type={field.type}
                                placeholder={field.placeholder}
                                className="block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                            />
                        </div>
                    ))
                }
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                    >
                        Update
                    </button>
                    <div className='h-10'>
                        {error.length ? <h1 className='p-2 text-sm text-red-500'>{error}</h1> : ''}
                    </div>
                </div>
            </form>
        </div>
    );
};