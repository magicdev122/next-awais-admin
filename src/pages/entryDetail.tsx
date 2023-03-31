import React, { ReactNode, useEffect } from 'react'
import { useState } from 'react'
import Icon from '@mdi/react';
import {  ref, child, get,update } from "firebase/database";
import { saveAs } from 'file-saver';
import { writeFile } from 'xlsx';
import {storage} from '../../firebase'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { format,parse } from 'date-fns'
import JsCookies from 'js-cookie'
import Link from 'next/link'
import * as XLSX from 'xlsx';


import {ref as sRef,getDownloadURL} from 'firebase/storage'
import { Modal, Button, Form,Carousel  } from 'react-bootstrap';
import {toast,Toaster} from 'react-hot-toast'
import {database} from '../../firebase'
import menuAside from '../menuAside'
import menuNavBar from '../menuNavBar'
import BaseIcon from '../components/BaseIcon'
import NavBar from '../components/NavBar'
import NavBarItemPlain from '../components/NavBarItemPlain'
import AsideMenu from '../components/AsideMenu'
import axios from 'axios';


import { useAppDispatch, useAppSelector } from '../stores/hooks'
import Image from 'next/image';

import { useRouter } from 'next/router'
import { mdiForwardburger, mdiTextBoxSearchOutline,mdiBackburger, mdiMenu,mdiSquareEditOutline ,mdiTrashCanOutline } from '@mdi/js'





type Props = {
  children: ReactNode
}

export default function LayoutAuthenticated({ children }: Props) {
  const dispatch = useAppDispatch()
  

  const [entries,setEntries]:any=useState({})

const [allCategories,setAllCategories]:any=useState({})

const [allUsers,setAllUsers]:any=useState({})
const query=useRouter().query
const entryId=query.id;
const [entry,setEntry]:any=useState({})
  

  useEffect(() => {
    

    if(JsCookies.get('admin_type')==='admin'){


    
    if(Object.entries(entries).length<=0 ){
      getEntries()
      getUsers()

    }}else{
      router.push('/')
    }
  })
  const getUsers=async()=>{
    let dbRef = ref(database);
    get(child(dbRef, `Users/`)).then((snapshot)=>{
      if(snapshot.exists()){
        const res=snapshot.val()
        setAllUsers(res)
        
        
       
      }


    })
     dbRef = ref(database);
    get(child(dbRef, `Categories/`)).then((snapshot)=>{
      if(snapshot.exists()){
        const res=snapshot.val()
        setAllCategories(res)
        
       
      }


    })
    
    
  }
  const darkMode = useAppSelector((state) => state.style.darkMode)

  const [isAsideMobileExpanded, setIsAsideMobileExpanded] = useState(false)
  const [isAsideLgActive, setIsAsideLgActive] = useState(false)
  const [allImages,setAllImages]:any=useState([])

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
const getEntries=async()=>{
    
  const dbRef = ref(database);
    get(child(dbRef, `Entries/`)).then((snapshot)=>{
      if(snapshot.exists()){
        const res=snapshot.val()
        setEntries(res)

        Object.entries(res).map(([key,ent])=>{
        
            
            
            if(key===entryId){
                
                setEntry(ent)
                return
                
            }
        })
        
       
      }


    })

  
    
    
}




  return (
    
    <div className={`${darkMode ? 'dark' : ''}  bg-white overflow-hidden lg:overflow-visible`}>
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
     <div className='m-4'>
       


     <Link href="/entries" className='m-2 mb-4'>
        <span className="btn btn-secondary mr-4">
          
          Back
        </span>
      </Link>
     <div className="flex flex-col lg:flex-row w-full mt-4">
  <div className="w-full lg:w-1/2 border rounded flex flex-col items-center pt-2 pb-2">  
  
<span className='mt-2 mb-2 font-bold'> Φωτογραφία καταστήματος</span>    
<Carousel >
    {
        
             entry.urlListQ4?.map((image:any)=>{
                return <Carousel.Item key={image} >
                     <img src={image} alt="img" style={{ height: "50vh", width: "100%", objectFit: "contain" }} />
                     </Carousel.Item>
            })
        
    }
    
    </Carousel>
  </div>
  <div className="w-full lg:w-1/2 border flex flex-col items-center rounded pt-2 pb-2">
  <span className='mt-2 mb-2 font-bold'> Φωτογραφία Ψυγείου</span>
    <Carousel>
    {
        
        entry.urlListQ5?.map((image:any)=>{
           return <Carousel.Item  key={image}>
                <img src={image} alt="img" style={{ height: "50vh", width: "100%", objectFit: "contain" }} />
                </Carousel.Item>
       })
   
}
    </Carousel>
    <style>{`
    .modal-90w {
      max-width: 60vw;
      max-height: 50vh;
    }
    .carousel-control-prev-icon,
    .carousel-control-next-icon {
      background-color: black;
      border-radius: 10%;
      padding: 0.5rem;
    }
  `}</style>
  </div>
</div>

<div className="container mx-auto">

<div className='flex flex-wrap flex-col lg:flex-row w-full'>

<div className="flex m-2 justify-between p-2 mb-4 border sm:w-100 md:w-1/2 lg:w-1/3 ">
  <div className=" font-bold  ">{"Date"}</div>
  <div className="">{entry.date}</div>
</div>
<div className="flex m-2 justify-between p-2 mb-4 border sm:w-100 md:w-1/2 lg:w-1/3 ">
  <div className=" font-bold  ">{"User"}</div>
  <div className="">{entry.username}</div>
</div><div className="flex m-2 justify-between p-2 mb-4 border sm:w-100 md:w-1/2 lg:w-1/3 ">
  <div className=" font-bold  ">{"West code"}</div>
  <div className="">{entry.store?.westCode}</div>
</div><div className="flex m-2 justify-between p-2 mb-4 border sm:w-100 md:w-1/2 lg:w-1/3 ">
  <div className=" font-bold  ">{"customer Id"}</div>
  <div className="">{entry.store?.customerId}</div>
</div><div className="flex m-2 justify-between p-2 mb-4 border sm:w-100 md:w-1/2 lg:w-1/3 ">
  <div className=" font-bold  ">{"Street"}</div>
  <div className="">{entry.store?.street}</div>
</div><div className="flex m-2 justify-between p-2 mb-4 border sm:w-100 md:w-1/2 lg:w-1/3 ">
  <div className=" font-bold  ">{"City"}</div>
  <div className="">{entry.store?.city}</div>
</div><div className="flex m-2 justify-between p-2 mb-4 border sm:w-100 md:w-1/2 lg:w-1/3 ">
  <div className=" font-bold  ">{"chain"}</div>
  <div className="">{entry.store?.chain}</div>
</div><div className="flex m-2 justify-between p-2 mb-4 border sm:w-100 md:w-1/2 lg:w-1/3 ">
  <div className=" font-bold  ">{"Τηρείται το πλανόγραμμα"}</div>
  <div className="">{entry?.question1}</div>
</div><div className="flex m-2 justify-between p-2 mb-4 border sm:w-100 md:w-1/2 lg:w-1/3 ">
  <div className=" font-bold  ">{"Έχει καλή εικόνα το ψυγείο"}</div>
  <div className="">{entry?.question2}</div>
</div><div className="flex m-2 justify-between p-2 mb-4 border sm:w-100 md:w-1/2 lg:w-1/3 ">
  <div className=" font-bold  ">{"Καταγραφή OOS Προϊόντων"}</div>
  <div className="">{entry.productsList?.[0]?.brandName},{entry.productsList?.[1]?.brandName},{entry.productsList?.[2]?.brandName}</div>
</div>

</div>


</div>
     
    
       
     
       </div>
      </div>
    </div>
  
  )


 
}
