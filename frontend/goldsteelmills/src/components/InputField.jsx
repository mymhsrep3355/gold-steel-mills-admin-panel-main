// eslint-disable-next-line react/prop-types
export const InputField=({placeholder,value,setValue,name=null})=>{
    return (
        <div>
            <input
                name={name??''}
                value={value}
                onChange={(e)=> {
                    setValue(e.target.value)
                }}
                type="text"
                placeholder={placeholder}
                className="block  w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
            />
        </div>
    )
}