import React from "react";
import Icon from '@mdi/react';
import { mdiAccountCircleOutline,mdiCubeOutline ,mdiSquareEditOutline ,mdiTrashCanOutline} from '@mdi/js';

const PillTag = () => {
  return (

    <div className=" flex flex-col sm:flex-row items-center border shadow border-black rounded w-{50} md:w-auto p-2">
    
     
      <Icon path={mdiCubeOutline} style={{color:"#28419a",fontWeight:"500 !important"}} className=" mb-2 sm:mb-0 sm:mr-4" size={1.5} />
      
      
     <div className="flex flex-col justify-center items-center sm:items-start">

        <h3 className="text-sm font-bold  text-black">Product Name : ABC</h3>
         <p className="text-xs text-black-500 mb-2 sm:mb-0">Category : <span className="font-bold">Category A</span></p>
       </div>
       <div className="flex ml-auto mt-2 flex-col  ml-4 items-end sm:mt-0">
         <button className="  ">
           <div className="flex font-sm" style={{fontSize:"14px",color:"#28419a"}} >
           Edit
         <Icon path={mdiSquareEditOutline} size={0.8}  />
           </div>
         
         </button>
         <button className="   ">
           <div className="flex "style={{fontSize:"14px",color:"#28419a"}}>
           Delete
         <Icon path={mdiTrashCanOutline} size={0.8} />
           </div>
         
         </button>
         </div>
  </div>
        )
  }
  export default PillTag
        
