import {useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Forms} from "../../Forms.js";
import {useFetchSource} from "../../hooks/useFetchSource.js";
import axios from "axios";

export const PurchaseEdit=()=>{
    const { state } = useLocation();

    const [error,setError]=useState('')
    //fetching the suppliers
    const {data}=useFetchSource('suppliers');

    const [formData, setFormData] = useState(() => {
        const initialData = {};
        Forms.PURCHASE_CREATE.forEach(field => {
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
    const handleSubmit=async(e)=>{
        try{
            e.preventDefault()
            //added the id of the source to be edited
            formData.id=state.id
            console.log(state.id)

            const data=new FormData(e.currentTarget)
            console.log({ supplierInfo:JSON.parse(data.get('supplierInfo')), ...formData})
            const res=await axios.post(`purchase/${state.id}`,{
                supplierInfo:JSON.parse(data.get('supplierInfo')),
                ...formData
            })
            if(res.status===204){
                alert('purchase Added successfully..')
            }
        }catch (e){
            console.log(e)
            setError(e.response.data.error)
            setTimeout(()=>{
                setError('')
            },3000)
        }
    }
    return <div>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Supplier Name
                </label>
                <select className={'w-full block mt-2  placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'} name="supplierInfo" id="supplierInfo">
                    {data?.suppliers?.map((supplier,index)=>{
                        return <option selected={supplier.id===state.supplierId} key={index} value={JSON.stringify({firstName:supplier.firstName,id:supplier.id})}>{supplier.firstName}</option>
                    })}
                </select>
            </div>
            {
                Forms.PURCHASE_CREATE.map((field, index) => (
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
            <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
            >
                Update
            </button>
            <div className={'h-10'}>

                {
                    error.length?<h1 className={'p-2 text-sm text-red-500'}>{error}</h1>:''
                }
            </div>
        </form>
    </div>
}