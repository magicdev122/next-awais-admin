import React, { ReactNode, useEffect } from 'react'
import { useState } from 'react'
import { mdiForwardburger, mdiTextBoxSearchOutline,mdiBackburger, mdiMenu,mdiSquareEditOutline ,mdiTrashCanOutline } from '@mdi/js'

import Icon from '@mdi/react';
import JsCookies from 'js-cookie'


import menuAside from '../menuAside'
import menuNavBar from '../menuNavBar'
import BaseIcon from '../components/BaseIcon'
import NavBar from '../components/NavBar'
import NavBarItemPlain from '../components/NavBarItemPlain'
import AsideMenu from '../components/AsideMenu'
import { setUser } from '../stores/mainSlice'
import { useAppDispatch, useAppSelector } from '../stores/hooks'
import { useRouter } from 'next/router'
import Table from 'react-bootstrap/Table';

import {  ref, child, get,update,remove } from "firebase/database";
import { Modal, Button, Form } from 'react-bootstrap';
import {toast,Toaster} from 'react-hot-toast'
import {database} from '../../firebase'

type Props = {
  children: ReactNode
}

export default function LayoutAuthenticated({ children }: Props) {
  const dispatch = useAppDispatch()
  
const [show, setShow] = useState(false);
const [show2, setShow2] = useState(false);

const [allStores,setAllStores]:any=useState({})
const [searchedStores,setSearchedStores]:any=useState({})
const [selected,setSelected]:any=useState("")
const [csvFile,setCsvFile]:any=useState(null)
const [formData,setFormData]:any=useState({
  westCode:"",
  street:"",
  customerId:"",
  city:"",
  chain:""
})
const [formData2,setFormData2]:any=useState({
  westCode:"",
  street:"",
  customerId:"",
  city:"",
  chain:""
})
const [filters,setFilterData]:any=useState({
  chain:"",
  city:"",
  westCode:""

})
const  isAlready=0

const handleClose = () => setShow(false);
const handleShow = () => setShow(true);
const handleClose2 = () => setShow2(false);
const handleShow2= (store:any) =>{ 
  setFormData2({westCode:store.westCode,street:store.street,customerId:store.customerId,city:store.city,chain:store.chain})
  setSelected(store.id)
  setShow2(true)}


  useEffect(() => {
    if(JsCookies.get('admin_type')==='admin'){
   if(Object.entries(allStores).length<=0 || Object.entries(searchedStores).length<=0){
    getStores()
   }}
   else{
    router.push("/",undefined,{shallow:true})
   }
  })
  const [showModal, setShowModal] = useState(false);
  const [modalId,setModalId]:any=useState("")
  const handleDelete = () => {
    deleteStore(modalId);
    setShowModal(false);
  };
  const darkMode = useAppSelector((state) => state.style.darkMode)

  const [isAsideMobileExpanded, setIsAsideMobileExpanded] = useState(false)
  const [isAsideLgActive, setIsAsideLgActive] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsAsideMobileExpanded(false)
      setIsAsideLgActive(false)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router.events, dispatch])

  const layoutAsidePadding = 'xl:pl-60'

  const handleSubmit=async(e:any)=>{
    e.preventDefault()
     uploadData()
     

  }
 
  const uploadData=async()=>{

  const uniqueId = new Date().getTime().toString()
  const newRef=ref(database,`Stores/${uniqueId}`)

await update(newRef,{
id:uniqueId,
...formData
}).then(()=>{
  toast.success("Store Added Successfully")
handleClose()
getStores()
  

}).catch((error:any)=>{
  console.log(error);
  toast.error(error.message)
  
})


 

  }
  const getStores=async()=>{
    const dbRef = ref(database);
    get(child(dbRef, `Stores/`)).then((snapshot)=>{
      if(snapshot.exists()){
        const res=snapshot.val()
        setAllStores(res)
        setSearchedStores(res)
        
       
      }


    })
    
    
  }
  const filter=async()=>{
    const filteredData = Object.entries(allStores).filter((row:any) => {
      
  
    const cityMatch = (filters.city)
      ? row[1]?.city.toLowerCase().includes(filters.city.toLowerCase())
      : true;
    const chainMatch = (filters.chain !== null)
      ? row[1]?.chain.toLowerCase().includes(filters.chain.toLowerCase())
      : true;
    const categoryMatch = (filters.westCode)
    ? row[1]?.westCode.toLowerCase().includes(filters.westCode.toLowerCase())
      : true;
    
    
    return   cityMatch && chainMatch && categoryMatch;
  });
  let arr:any={}
  filteredData.map((item:any)=>{
  const obj={[item[0]]:item[1]}
  
  arr={...arr,...obj}
  
  
  })
  
  setSearchedStores(arr)
}
const deleteStore=async(id:any)=>{
  const dbRef = ref(database,`/Stores/${id}`);
  remove(dbRef).then(()=>{
    toast.success("store Deleted")
    getStores()
  })


}
const updateStore=async(e:any)=>{
  e.preventDefault()
  const newRef=ref(database,`Stores/${selected}`)
  await update(newRef,{
    id:selected,
    ...formData2
    }).then(()=>{
      toast.success("Store updated")
    })
    getStores()
    handleClose2()
}
const handleFileSelect = (event:any) => {
setCsvFile(event.target.files[0])
}
const readCsv=async()=>{
  if(csvFile){
    readCsvFile(csvFile)

  }else{
    toast.error("Please select a file")
  }

}
const readCsvFile=async(file:any)=>{
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = async(event) => {
    const csvData = event.target.result;
    const dataString = csvData?.toString();
    const dataArr = dataString?.split(/\r?\n|\r/);
    const headers = dataArr?.shift()?.split(',');
    const arr = [];
    dataArr?.forEach((d) => {
      const row = d.split(',');
      const obj = {};
      headers?.forEach((h, i) => {
        obj[h] = row[i];
      });
      arr.push(obj);
    });
    try {
      const promises = arr.map(async (item: any) => {
        const uniqueId = new Date().getTime().toString();
        const newRef = ref(database, `Stores/${uniqueId}`);
    
        return update(newRef, {
          id: uniqueId,
          ...item,
        });
      });
    
      await Promise.all(promises);
      toast.success("Stores Added Successfully");
      getStores()
      handleClose()
    } catch (error) {
      console.log(error);
      getStores()
      handleClose()
    }
    
    
   
  };
}
  return (
    <div className={`${darkMode ? 'dark' : ''}  bg-white overflow-hidden lg:overflow-visible`}>
      <Toaster/>
      <div
        className={`${layoutAsidePadding} ${
          isAsideMobileExpanded ? '' : ''
        } pt-14 min-h-screen w-screen transition-position lg:w-auto `}
      >
        <NavBar
          menu={menuNavBar}
          className={`${layoutAsidePadding} ${isAsideMobileExpanded ?  'bg-white ' : ''}`}
          >
          <NavBarItemPlain
            display="flex lg:hidden"
            onClick={() => setIsAsideMobileExpanded(!isAsideMobileExpanded)}
          >
            <BaseIcon path={isAsideMobileExpanded ? mdiBackburger : mdiForwardburger} size="24" />
          </NavBarItemPlain>
          <NavBarItemPlain
            display="hidden lg:flex xl:hidden"
            onClick={() => setIsAsideLgActive(true)}
          >
            <BaseIcon path={mdiMenu} size="24" />
          </NavBarItemPlain>
         
        </NavBar>
        <AsideMenu
          isAsideMobileExpanded={isAsideMobileExpanded}
          isAsideLgActive={isAsideLgActive}
          menu={menuAside}
          onAsideLgClose={() => setIsAsideLgActive(false)}
        />
        {children}
       
       <div className='m-8'>
       

<div>

<div className='flex flex-wrap gap-4 justify-between items-center ml-2 mr-6 mb-6'>
<div className="flex  flex-wrap pt-4 gap-4 items-center">
  
  <div className="">
    <label className="block mb-2  text-gray-700" style={{color:"#28419a",fontWeight:"600"}} >
      Chain
    </label>
    <input onChange={(e)=>setFilterData({...filters,chain:e.target.value})} style={{width:"12rem",marginTop:"-2rem"}}  className="w-full bg-gray-100 border-2 border-gray-200 p-2 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500" type="text" id="chain" name="chain"/>
  </div>

  <div className="">
    <label className="block mb-2  text-gray-700" style={{color:"#28419a",fontWeight:"600"}} >
      City
    </label>
    <input onChange={(e)=>setFilterData({...filters,city:e.target.value})} style={{width:"12rem",marginTop:"-2rem"}}  className="w-full bg-gray-100 border-2 border-gray-200 p-2 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500" type="text" id="city" name="city"/>
  </div>
  <div className="">
    <label className="block mb-2  text-gray-700" style={{color:"#28419a",fontWeight:"600"}} >
      west Code
    </label>
    <input  onChange={(e)=>setFilterData({...filters,westCode:e.target.value})} style={{width:"12rem",marginTop:"-2rem"}}  className="w-full bg-gray-100 border-2 border-gray-200 p-2 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500" type="text" id="westCode" name="westCode"/>
  </div>
 
  <div className="">
    <button  onClick={filter} className=" w-auto text-white font-md py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" style={{background:"#2ec5e3",fontWeight:"600",marginTop:"1.5rem"}}>
      Apply Filters
    </button>
  </div>
</div>

        <Button onClick={handleShow} className='btn sm:w-100  text-white font-medium' style={{background:"#28419a",height:"2.5rem"}}>Add New Store</Button>
        
     

        </div>
</div>


    <Table striped className='border rounded shadow-sm' responsive hover size="md">
      <thead >
        <tr className=' border' style={{fontSize:"14px",fontWeight:"bold"}} >
          
          
          <th className=' border'>West Code</th>
          <th className='border'>Customer ID</th>
          <th className='border '>Street</th>
          <th className=' border'>City</th>
          <th className=' border'>Chain</th>
          
<th className='border '></th>

        </tr>
      </thead>
      <tbody>
      {
  Object.entries(searchedStores).length>0 && Object.entries(searchedStores).map(([key,value]:any)=>{
    return   <tr key={value.id} style={{fontSize:"12px"}}>
          
          
    <td className='border '>{value.westCode}</td>
    <td className='border '>{value.customerId}</td>
    <td className='border '>{value.street}</td>
    <td className='border '>{value.city}</td>
    <td className='border '>{value.chain}</td>

    
    <td>
<div className='flex gap-2' style={{color:"#28419a"}}>
  <div onClick={()=> {setModalId(value.id); setShowModal(true)}}>
  <Icon path={mdiTrashCanOutline} size={0.8}   />
  </div>

<div onClick={()=>handleShow2(value)}>
<Icon path={mdiSquareEditOutline} size={0.8}  />

</div>
    
</div>
  

    


    


    </td>
  
    


    </tr>
  })
}
       
        
      
     
       
        

       
      </tbody>
    </Table>




       

       </div>
      </div>
      <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
      <h3 className='font-sm' style={{color:"#2ec5e3",fontSize:"18px"}}>Add New Store</h3>
          
        </Modal.Header>
        <Modal.Body >
          <Form onSubmit={handleSubmit}>
      <Form.Group className='mt-0'>
        
        <Form.Control type="text" placeholder="Enter West Code" value={formData.westCose}
         onChange={(e)=>{setFormData({...formData,westCode:e.target.value})}}  required />
      </Form.Group>
      <Form.Group className='mt-4'>
        
        <Form.Control type="text" placeholder="Enter Customer Id" value={formData.customerId}
         onChange={(e)=>{setFormData({...formData,customerId:e.target.value})}} required />
      </Form.Group>
      <Form.Group className='mt-4'>
        
        <Form.Control  className="rounded border-black" type="text" value={formData.street}
         onChange={(e)=>{setFormData({...formData,street:e.target.value})}}
         placeholder="Enter Street" required/>
      </Form.Group>

      

      <Form.Group className='mt-4' >
        
        <Form.Control type="text" placeholder="Enter City"
        value={formData.city}
        onChange={(e)=>{setFormData({...formData,city:e.target.value})}}  required />
      </Form.Group>
      <Form.Group className='mt-4' >
        
        <Form.Control type="text" placeholder="Enter Chain"
        value={formData.chain}
        onChange={(e)=>{setFormData({...formData,chain:e.target.value})}}  required />
      </Form.Group>
<div className='flex flex-wrap justify-start  mt-4'>
<div className='flex gap-4'>
<Button style={{background:"#2ec5e3",border:"none",height:"2.5rem",width:"7rem"}} type="submit">
        Add Store
      </Button>
<Button onClick={readCsv} style={{background:"#2ec5e3",border:"none",height:"2.5rem",width:"7rem"}} type="button">
        Read Csv
      </Button>

<input type="file" onChange={handleFileSelect} />

</div>

</div>
      
    </Form>
          
        </Modal.Body>
        
      </Modal>
      <Modal show={show2} onHide={handleClose2}>
      <Modal.Header closeButton>
      <h3 className='font-sm' style={{color:"#2ec5e3",fontSize:"18px"}}>Update Store</h3>
          
        </Modal.Header>
        <Modal.Body >
          <Form onSubmit={updateStore}>
      <Form.Group className='mt-0'>
        
        <Form.Control type="text" placeholder="Enter West Code" value={formData2.westCode}
         onChange={(e)=>{setFormData2({...formData2,westCode:e.target.value})}}  required />
      </Form.Group>
      <Form.Group className='mt-4'>
        
        <Form.Control type="text" placeholder="Enter Customer Id" value={formData2.customerId}
         onChange={(e)=>{setFormData2({...formData2,customerId:e.target.value})}} required />
      </Form.Group>
      <Form.Group className='mt-4'>
        
        <Form.Control  className="rounded border-black" type="text" value={formData2.street}
         onChange={(e)=>{setFormData2({...formData2,street:e.target.value})}}
         placeholder="Enter Street" required/>
      </Form.Group>

      

      <Form.Group className='mt-4' >
        
        <Form.Control type="text" placeholder="Enter City"
        value={formData2.city}
        onChange={(e)=>{setFormData2({...formData2,city:e.target.value})}}  required />
      </Form.Group>
      <Form.Group className='mt-4' >
        
        <Form.Control type="text" placeholder="Enter Chain"
        value={formData2.chain}
        onChange={(e)=>{setFormData2({...formData2,chain:e.target.value})}}  required />
      </Form.Group>
<div className='flex justify-end gap-4 mt-4'>

<Button style={{background:"#2ec5e3",border:"none"}} type="submit">
        update Store
      </Button>
</div>
      
    </Form>
          
        </Modal.Body>
        
      </Modal>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Store</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete Store ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
