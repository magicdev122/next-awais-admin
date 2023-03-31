import React, { ReactNode, useEffect } from 'react'
import { useState } from 'react'
import { mdiForwardburger, mdiBackburger, mdiMenu ,mdiAccountCircleOutline ,mdiSquareEditOutline ,mdiTrashCanOutline} from '@mdi/js'
import menuAside from '../menuAside'
import menuNavBar from '../menuNavBar'
import BaseIcon from '../components/BaseIcon'
import NavBar from '../components/NavBar'
import NavBarItemPlain from '../components/NavBarItemPlain'
import AsideMenu from '../components/AsideMenu'
import FooterBar from '../components/FooterBar'
import { setUser } from '../stores/mainSlice'
import { useAppDispatch, useAppSelector } from '../stores/hooks'
import JsCookies from 'js-cookie'

import {  ref, child, get,update ,remove} from "firebase/database";
import { Modal, Button, Form } from 'react-bootstrap';
import {toast,Toaster} from 'react-hot-toast'
import {database} from '../../firebase'
import Icon from '@mdi/react';

import { useRouter } from 'next/router'



type Props = {
  children: ReactNode
}

export default function LayoutAuthenticated({ children }: Props) {
  const dispatch = useAppDispatch()

const [show, setShow] = useState(false);
const [allUsers,setAllUsers]:any=useState({})
const [searchedUsers,setSearchedUsers]:any=useState({})
const [show2, setShow2] = useState(false);
const [selected,setSelected]:any=useState()
const [formData,setFormData]:any=useState({
  username:"",
  
  password:""
})
const [formData2,setFormData2]:any=useState({
    username:"",
    password:""
  })
const [user,setUser]:any=useState("")
let isAlready=0

const handleClose = () => setShow(false);
const handleShow = () => setShow(true);
const handleClose2 = () => setShow2(false);
const handleShow2 = (user:any) => {
  setFormData2({username:user.username,password:user.password})
  setSelected(user.id)
  
  
  setShow2(true)
}

  useEffect(() => {
    if(JsCookies.get('admin_type')==='admin'){

  if(Object.entries(allUsers).length<=0){
    getUsers()
  }}else{
    router.push("/")

  }
  })

  const darkMode = useAppSelector((state) => state.style.darkMode)

  const [isAsideMobileExpanded, setIsAsideMobileExpanded] = useState(false)
  const [isAsideLgActive, setIsAsideLgActive] = useState(false)

  const router = useRouter()
  const [showModal, setShowModal] = useState(false);
  const [modalId,setModalId]:any=useState("")
  const handleDelete = () => {
    deleteUser(modalId);
    setShowModal(false);
  };
  
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
     isExists()
     setTimeout(()=>{
      uploadData()

     },2000)

  }
  const isExists=async()=>{
    
    isAlready=0
    const dbRef = ref(database);
    get(child(dbRef, `SubAdmins/`)).then((snapshot)=>{
      if(snapshot.exists()){
        const res=snapshot.val()
        Object.entries(res).forEach(([key,value]:any)=>{
          

          if(value.username===formData.username){
            isAlready=1
              toast.error("username already exists")

            
          }
        })
        
       
      }


    })

  }
  const uploadData=async()=>{
    



    
    
if(isAlready===0){
  const uniqueId = new Date().getTime().toString()
  const newRef=ref(database,`SubAdmins/${uniqueId}`)



await update(newRef,{
id:uniqueId,
...formData
}).then(()=>{
  toast.success("Account created Successfully")

  handleClose()
  getUsers()

}).catch((error:any)=>{
  console.log(error);
  toast.error(error.message)
  
})
}

 

  }
  const getUsers=async()=>{
    const dbRef = ref(database);
    get(child(dbRef, `SubAdmins/`)).then((snapshot)=>{
      if(snapshot.exists()){
        const res=snapshot.val()
        setAllUsers(res)
        setSearchedUsers(res)
        
       
      }


    })
    
    
  }
  const filter=async()=>{
    const filteredData = Object.entries(allUsers).filter((row:any) => {
    const userMatch = (user)
    ? row[1]?.username?.toLowerCase().includes(user.toLowerCase())
    : true;
  return userMatch
    
  })
  let arr:any={}
filteredData.map((item:any)=>{
const obj={[item[0]]:item[1]}

arr={...arr,...obj}




})



setSearchedUsers(arr)

  }
  const deleteUser=async(id:any)=>{
    const dbRef = ref(database,`/SubAdmins/${id}`);
    remove(dbRef).then(()=>{
      toast.success("user Deleted")
      getUsers()
    })

  }

  const updateUser=async(e:any)=>{
    e.preventDefault()
    const newRef=ref(database,`SubAdmins/${selected}`)
    
    
    await update(newRef,{
      id:selected,
      ...formData2
      }).then(()=>{
        toast.success("User updated")
      })
      handleClose2()
      getUsers()
  
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
        {/* <FooterBar>
          Get more with{` `}
          <a
            href="https://tailwind-react.justboil.me/dashboard"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600"
          >
            Premium version
          </a>
        </FooterBar> */}
       <div className='m-4'>
        <div className='flex justify-between items-center flex-wrap gap-4 ml-2 mr-6 mb-6'>
<div className="flex flex-wrap gap-2 pt-4 items-center justify-start">
      
<div className="" style={{width:"12rem",marginTop:"-2rem"}}>
    <label className="block mb-2 font-md text-gray-700" style={{color:"#28419a",fontWeight:"600"}}>
      Select Username
    </label>
    <select onChange={(e)=>setUser(e.target.value)}  className="w-full bg-gray-100 border-2 border-gray-200 p-2 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500" id="user-selection" name="user-selection">
      <option value="">All users</option>
      {
    Object.entries(allUsers).length>0  && Object.entries(allUsers).map(([key,val]:any)=>{
    
    return   <option value={val.username} key={val.id}>{val.username}</option>
    })
    
   
    
   }
    </select>
  </div>
  <button  onClick={filter} className="w-full md:w-auto  text-white font-md py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" style={{background:"#2ec5e3",fontWeight:"600",height:"2.6rem"}}>
      Apply Filters
    </button>
       </div>

        <Button onClick={handleShow} className='btn  text-white font-medium' style={{background:"#28419a",height:"2.6rem"}}>Add New Sub Admin</Button>
        
     

        </div>

<div className='flex   flex-wrap  gap-4 ' >
  
{
  Object.entries(searchedUsers).length>0 && Object.entries(searchedUsers).map(([key,value]:any)=>{
    return  <div key={value.id} className=" flex flex-col sm:flex-row  border-2 border-black items-center border shadow border-black rounded w-{50} sm:w-auto md:w-auto p-2">
    
     
    <Icon path={mdiAccountCircleOutline} style={{color:"#28187c",fontWeight:"500 !important"}} className=" mb-2 sm:mb-0 sm:mr-4" size={1.5} />
    
    
   <div className="flex flex-col justify-center items-center sm:items-start">

      <h3 className="text-sm font-bold  text-black">{value.username }</h3>
       <p className="text-xs text-black-500  -mt-2 sm:mb-0">{value.password}</p>
     </div>
     <div className="flex ml-2 mt-2 flex-col  items-end sm:mt-0">
       <button className=" " onClick={()=>handleShow2(value)}>
         <div className="flex font-sm" style={{fontSize:"14px",color:"#28419a"}} >
         Edit
       <Icon path={mdiSquareEditOutline} size={0.8} />
         </div>
       
       </button>
       <button className="   " onClick={()=> {setModalId(value.id); setShowModal(true)}}>
         <div className="flex " style={{fontSize:"14px",color:"#28419a"}}>
         Delete
       <Icon path={mdiTrashCanOutline} size={0.8} />
         </div>
       
       </button>
       </div>
</div>
  })
}
    

</div>


   
   
    
    




       

       </div>
       
      </div>
      <Modal show={show} style={{}} onHide={handleClose}>
      <Modal.Header closeButton>
      <h3 className='font-sm' style={{color:"#2ec5e3",fontSize:"18px"}}>Add New User</h3>
          
        </Modal.Header>
        <Modal.Body >
          <Form onSubmit={handleSubmit}>
      <Form.Group className='mt-0'>
        
        <Form.Control type="text" placeholder="Enter user name" value={formData.username}
         onChange={(e)=>{setFormData({...formData,username:e.target.value})}}  required />
      </Form.Group>
    
      

      

      <Form.Group className='mt-4' >
        
        <Form.Control type="password" placeholder="Enter Password"
        value={formData.password}
        onChange={(e)=>{setFormData({...formData,password:e.target.value})}}  required />
      </Form.Group>
<div className='flex justify-end gap-4 mt-4'>

<Button style={{background:"#2ec5e3",border:"none"}} type="submit">
        Add User
      </Button>
</div>
      
    </Form>
          
        </Modal.Body>
        
      </Modal>
      <Modal show={show2} style={{}} onHide={handleClose2}>
      <Modal.Header closeButton>
      <h3 className='font-sm' style={{color:"#2ec5e3",fontSize:"18px"}}>Update User</h3>
          
        </Modal.Header>
        <Modal.Body >
          <Form onSubmit={updateUser}>
      <Form.Group className='mt-0'>
        
        <Form.Control type="text" placeholder="Enter user name" value={formData2.username}
         onChange={(e)=>{setFormData2({...formData2,username:e.target.value})}}  required />
      </Form.Group>
      <Form.Group className='mt-4' >
        
        <Form.Control type="password" placeholder="Enter Password"
        value={formData2.password}
        onChange={(e)=>{setFormData2({...formData2,password:e.target.value})}}  required />
      </Form.Group>
<div className='flex justify-end gap-4 mt-4'>

<Button style={{background:"#2ec5e3",border:"none"}} type="submit">
        Update User
      </Button>
</div>
      
    </Form>
          
        </Modal.Body>
        
      </Modal>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete user ?
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
