
import React, {useState} from "react";
import {useFetchSource} from "../hooks/useFetchSource.js";
import {Forms} from "../Forms.js";
import axios from "axios";

export const PurchaseCreate=()=>{
    const [error,setError]=useState('')
    const {data}=useFetchSource('suppliers');
    const handlePurchaseCreate=async (e)=>{
        try {
            e.preventDefault()
            const formData=new FormData(e.currentTarget)
            const res=await axios.post("purchase/store",{
                supplierInfo:JSON.parse(formData.get('supplierInfo')),
                quantity:formData.get('quantity'),
                price:formData.get('price'),
                itemName:formData.get('itemName'),
                kaat:formData.get('kaat')
            })

            if(res.status===201){
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
    return (
        <div className="max-w-md mx-auto mt-8  bg-white">
            <h2 className="text-xl font-semibold mb-6">User Information</h2>

            <form onSubmit={handlePurchaseCreate}>
                <div className="mb-4">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                       Supplier Name
                    </label>
                    <select className={'w-full block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'} name="supplierInfo" id="supplierInfo">
                        {data?.suppliers?.map((supplier,index)=>{
                                return <option key={index} value={JSON.stringify({firstName:supplier.firstName,id:supplier.id})}>{supplier.firstName}</option>
                        })}
                    </select>
                </div>
                {
                    Forms.PURCHASE_CREATE.map((field,index)=>{
                        return <div key={index} className="mb-4">
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                {field.label}
                            </label>
                            <input

                                name={field.name}
                                type={field.type}
                                placeholder={field.placeholder}
                                className="block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                            />
                        </div>
                    })
                }
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                    >
                        Create
                    </button>
                    <div className={'h-10'}>

                        {
                            error.length?<h1 className={'p-2 text-sm text-red-500'}>{error}</h1>:''
                        }
                    </div>
                </div>
            </form>
        </div>
    )
}