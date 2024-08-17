import {useState,useEffect} from 'react'
import axios from "axios";
export function useDeleteSource(url) {

    const [isAnySourceSelected, setIsAnySourceSelected] = useState(false)
    const [sourcesToBeDeleted, setSourcesToBeDeleted] = useState([])
    const handleSourceSelectionChange = (event,itemId) => {
        const { checked } = event.target;
        if (checked) {
            setSourcesToBeDeleted([...sourcesToBeDeleted, itemId]);
        } else {
            setSourcesToBeDeleted(sourcesToBeDeleted.filter(id => id !== itemId));
        }
    }
    const isChecked = (itemId) => sourcesToBeDeleted.includes(itemId);
    useEffect(() => {
        sourcesToBeDeleted.length > 0 ? setIsAnySourceSelected(true) : setIsAnySourceSelected(false)
    }, [sourcesToBeDeleted])

    const handleDelete = async() => {

     try {
         const res= await axios.delete(url,{data:{
                 id:sourcesToBeDeleted
             }});
      alert("Data has been deleted")
     }catch (e){
         alert(e.response.data.error)
     }
    }
    return {handleSourceSelectionChange, isAnySourceSelected, handleDelete,isChecked}
}