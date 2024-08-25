// export const Button = ({
//   title,
//   onClickHandler,
//   disabled = false,
//   children,
//   type = "info",
//   size = "md",
// }) => {
//   return (
//     <button
//       disabled={disabled}
//       onClick={onClickHandler}
//       className={`flex items-center ${
//         size === "sm" ? "px-1 py-1" : "px-2 py-2"
//       }  sm:text-sm text-md  text-slate-100 capitalize transition-colors duration-300 transform ${
//         type === "danger" ? "bg-red-500" : "bg-blue-500"
//       } rounded-lg `}
//     >
//       {children}
//       <span className="mx-1">{title}</span>
//     </button>
//   );
// };


import { Button as ChakraButton} from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';

// eslint-disable-next-line react/prop-types
export const Button = ({ title, onClickHandler, disabled = false, children, type = "info", size = "md" }) => {
  return (
    <ChakraButton
      disabled={disabled}
      onClick={onClickHandler}
      bg={type === "danger" ? "red" : "teal.600"}
      size={size}
      leftIcon={children}
    >
      <Text color={type === "danger" ? "white" : "white"}>{title}</Text>
    </ChakraButton>
  );
};
