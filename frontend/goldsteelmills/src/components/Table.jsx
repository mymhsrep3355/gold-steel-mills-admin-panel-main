import { useDeleteSource } from "../hooks/useDeleteSource.js";
import {Button} from "./Button.jsx";

// eslint-disable-next-line react/prop-types
export const Table = ({ columns, data,deleteURL,handleNavigation }) => {
    const { handleDelete, isAnySourceSelected, handleSourceSelectionChange,isChecked } = useDeleteSource(deleteURL);

    return (
        <div className="overflow-x-auto">

            <table className="min-w-full bg-white border border-gray-300">
                <thead className="">
                <tr>
                    <th className="px-2 py-1 border border-gray-300"></th>
                    {columns.map((column, index) => (
                        <th
                            key={index}
                            className="px-2 py-1 text-sm border border-gray-300 text-left text-gray-600 uppercase  ">
                            {column}
                        </th>
                    ))}
                    <th className="px-2 py-1 border border-gray-300">Actions</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-100">
                        <td className="px-4 py-2 border border-gray-300">
                            <input
                                value={item.id}
                                onChange={(event) => handleSourceSelectionChange(event, item.id)}
                                type="checkbox"
                                checked={isChecked(item.id)}
                                className="w-4 h-4"
                            />
                        </td>
                        {columns.map((column, colIndex) => (
                            <td
                                key={colIndex}
                                className="px-2 border py-1 border-gray-300 text-sm text-gray-600">
                                {column==='createdAt'?new Date(item[column]).toString():item[column]}
                            </td>
                        ))}
                        <td
                            className="px-2 border py-1  border-gray-300 text-gray-600 " >
                         <Button onClickHandler={()=>handleNavigation(item)} size={'sm'} type={'danger'} title={'Edit'}></Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {isAnySourceSelected&&<div className={'my-6'}>
                <Button onClickHandler={handleDelete} title={'delete'}>
                </Button>
            </div>}
        </div>

    );
};
