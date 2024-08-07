import React, { useState } from 'react';
import {Button} from "./Button.jsx";
import {CloseCircleOutlined} from "@ant-design/icons";

export const Modal = ({children,title}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative flex justify-center">
          <Button title={title} onClickHandler={()=>setIsOpen(true)}></Button>

            {isOpen && (
                <div
                    aria-labelledby="modal-title"
                    aria-modal="true"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    role="dialog"
                >

                    <div
                        className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
                        onClick={() => setIsOpen(false)}
                    >
                            <span aria-hidden="true" className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
                        <div
                            className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl rtl:text-right  sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
                            onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
                        >
                            <CloseCircleOutlined  style={{ fontSize: '20px' }} onClick={()=>setIsOpen(false)}/>

                            {/*content here*/}
                            {children}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


