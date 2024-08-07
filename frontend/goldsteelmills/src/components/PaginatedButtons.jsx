import {Button} from "./Button.jsx";

// eslint-disable-next-line react/prop-types
export const PaginatedButtons=({currentPage,setCurrentPage,totalDataCount,hasMore,ITEMS_PER_PAGE,goOnPrevPage,goOnNextPage})=>{

    return   <div className="flex items-center justify-between">
        <div className="flex items-center">
            <span>Page:</span>
            <select
                name="page-number"
                onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                value={currentPage}
                className="mx-2"
            >
                {Array.from(Array(Math.ceil(totalDataCount / ITEMS_PER_PAGE)), (_, i) => i + 1).map((val,index) => (
                    <option key={index}>{val}</option>
                ))}
            </select>
        </div>
        <div className="flex space-x-2">
            {currentPage>1?<Button
                title="Prev"
                onClickHandler={goOnPrevPage}

            />:''}
            {hasMore&&<Button
                title="Next"
                onClickHandler={goOnNextPage}
            />}
        </div>
    </div>
}