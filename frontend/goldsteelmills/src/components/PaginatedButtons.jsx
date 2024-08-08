// import {Button} from "./Button.jsx";

// // eslint-disable-next-line react/prop-types
// export const PaginatedButtons=({currentPage,setCurrentPage,totalDataCount,hasMore,ITEMS_PER_PAGE,goOnPrevPage,goOnNextPage})=>{

//     return   <div className="flex items-center justify-between">
//         <div className="flex items-center">
//             <span>Page:</span>
//             <select
//                 name="page-number"
//                 onChange={(e) => setCurrentPage(parseInt(e.target.value))}
//                 value={currentPage}
//                 className="mx-2"
//             >
//                 {Array.from(Array(Math.ceil(totalDataCount / ITEMS_PER_PAGE)), (_, i) => i + 1).map((val,index) => (
//                     <option key={index}>{val}</option>
//                 ))}
//             </select>
//         </div>
//         <div className="flex space-x-2">
//             {currentPage>1?<Button
//                 title="Prev"
//                 onClickHandler={goOnPrevPage}

//             />:''}
//             {hasMore&&<Button
//                 title="Next"
//                 onClickHandler={goOnNextPage}
//             />}
//         </div>
//     </div>
// }

import { Box, Select, Button as ChakraButton } from '@chakra-ui/react';
import { Button } from './Button.jsx';

// eslint-disable-next-line react/prop-types
export const PaginatedButtons = ({ currentPage, setCurrentPage, totalDataCount, hasMore, ITEMS_PER_PAGE, goOnPrevPage, goOnNextPage }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
      <Box display="flex" alignItems="center">
        <span>Page:</span>
        <Select
          ml={2}
          value={currentPage}
          onChange={(e) => setCurrentPage(parseInt(e.target.value))}
        >
          {Array.from(Array(Math.ceil(totalDataCount / ITEMS_PER_PAGE)), (_, i) => i + 1).map((val, index) => (
            <option key={index} value={val}>{val}</option>
          ))}
        </Select>
      </Box>
      <Box display="flex" gap={2}>
        {currentPage > 1 && <Button title="Prev" onClickHandler={goOnPrevPage} />}
        {hasMore && <Button title="Next" onClickHandler={goOnNextPage} />}
      </Box>
    </Box>
  );
};
