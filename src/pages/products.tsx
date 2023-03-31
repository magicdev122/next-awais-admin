import React, { ReactNode, useEffect } from 'react'
import { useState } from 'react'
import { mdiForwardburger, mdiBackburger, mdiMenu } from '@mdi/js'
import menuAside from '../menuAside'
import menuNavBar from '../menuNavBar'
import BaseIcon from '../components/BaseIcon'
import NavBar from '../components/NavBar'
import NavBarItemPlain from '../components/NavBarItemPlain'
import AsideMenu from '../components/AsideMenu'
import PillTag from '../components/ProductPillTag'
import { setUser } from '../stores/mainSlice'
import { useAppDispatch, useAppSelector } from '../stores/hooks'

import Icon from '@mdi/react';
import { mdiAccountCircleOutline,mdiCubeOutline ,mdiSquareEditOutline ,mdiTrashCanOutline} from '@mdi/js';
import { useRouter } from 'next/router'

import JsCookies from 'js-cookie'
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
  const [show3, setShow3] = useState(false);

const [category,setCategory]:any=useState("")
const [csvFile,setCsvFile]:any=useState(null)

const [allCategories,setAllCategories]:any=useState({})
const [allProducts,setAllProducts]:any=useState({})
const [searchedProducts,setSearchedProducts]:any=useState({})
const [selected,setSelected]:any=useState("")
const [formData,setFormData]:any=useState({
  category:"",
  brandName:""
})
const [formData2,setFormData2]:any=useState({
  category:"",
  brandName:""
})
const [filters,setFilterData]:any=useState({
  brandName:""
  ,category:""

})
let isAlready=0
const [showModal, setShowModal] = useState(false);
const [modalId,setModalId]:any=useState("")
const handleDelete = () => {
  deleteProduct(modalId);
  setShowModal(false);
};
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);
const handleClose2 = () => setShow2(false);
const handleShow2 = () => setShow2(true);
const handleClose3 = () => setShow3(false);
const handleShow3 = (prod:any) => {
  setSelected(prod.id)
  setFormData2({brandName:prod.brandName,category:prod.category})
  setShow3(true)
  
  }


  useEffect(() => {
    if(JsCookies.get('admin_type')==='admin'){
    if(Object.entries(allCategories).length<=0 || Object.entries(allProducts).length<=0 ||
    Object.entries(searchedProducts).length<=0){
      getData()
      getProducts()
    }}
    else{
      router.push('/')
    }
    
  })

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
  const handleSubmit2=async(e:any)=>{
    e.preventDefault()
isExists()
setTimeout(()=>{
  uploadData2()

},1000)
    
     

  }
  const isExists=async()=>{
    
    
    const dbRef = ref(database);
    get(child(dbRef, `Categories/`)).then((snapshot)=>{
      if(snapshot.exists()){
        const res=snapshot.val()
        Object.entries(res).forEach(([key,value]:any)=>{
          

          if(value.category===category){
            isAlready=1
              toast.error("category  already exists")

            
          }
        })
        
       
      }


    })

  }
  const getData=async()=>{
    
    
    const dbRef = ref(database);
    get(child(dbRef, `Categories/`)).then((snapshot)=>{
      if(snapshot.exists()){
        const res=snapshot.val()
        setAllCategories(res)
        
       
      }


    })
    
    

  }
  const getProducts=async()=>{
    const dbRef = ref(database);
    get(child(dbRef, `Products/`)).then((snapshot)=>{
      if(snapshot.exists()){
        const res=snapshot.val()
        setAllProducts(res)
        setSearchedProducts(res)
        
       
      }


    })
    
    


  }
  const uploadData2=async()=>{
    if(isAlready===0){
      const uniqueId = new Date().getTime().toString()
      const newRef=ref(database,`Categories/${uniqueId}`)
    
    await update(newRef,{
    id:uniqueId,
    category
    }).then(()=>{
      toast.success("Category Added Successfully")
      handleClose2()
      getData()
      
    
      
    
    }).catch((error:any)=>{
      console.log(error);
      toast.error(error.message)
      
    })
    }

  
  
  
   
  
    }
  const uploadData=async()=>{

  const uniqueId = new Date().getTime().toString()
  const newRef=ref(database,`Products/${uniqueId}`)

await update(newRef,{
id:uniqueId,
...formData
}).then(()=>{
  toast.success("Product Added Successfully")
  handleClose()
getProducts()

  

}).catch((error:any)=>{
  console.log(error);
  toast.error(error.message)
  
})


 

  }
  const filter=async()=>{
    const filteredData = Object.entries(allProducts).filter((row:any) => {
      
  
    const cityMatch = (filters.brandName)
      ? row[1]?.brandName.toLowerCase().includes(filters.brandName.toLowerCase())
      : true;
    const chainMatch = (filters.category !== null)
      ? row[1]?.category.toLowerCase().includes(filters.category.toLowerCase())
      : true;
    
    
    
    return   cityMatch && chainMatch ;
  });
  let arr:any={}
  filteredData.map((item:any)=>{
  const obj={[item[0]]:item[1]}
  
  arr={...arr,...obj}
  
  
  })
  
  setSearchedProducts(arr)
}
 const deleteProduct=async(id:any)=>{
  const dbRef = ref(database,`/Products/${id}`);
  remove(dbRef).then(()=>{
    toast.success("product Deleted")
    getProducts()
    getData()
  })


}
const updateProduct=async(e:any)=>{
  e.preventDefault()
  const newRef=ref(database,`Products/${selected}`)
  await update(newRef,{
    id:selected,
    ...formData2
    }).then(()=>{
      toast.success("Product updated")
    })
getProducts()
getData()
handleClose3()
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
          const newRef = ref(database, `Products/${uniqueId}`);
      
          return update(newRef, {
            id: uniqueId,
            ...item,
          });
        });
      
        await Promise.all(promises);
        toast.success("Products Added Successfully");
        getProducts()
        handleClose()
      } catch (error) {
        console.log(error);
        getProducts()
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
          {/* <NavBarItemPlain useMargin>
            <Formik
              initialValues={{
                search: '',
              }}
              onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
            >
              <Form>
                <FormField isBorderless isTransparent>
                  <Field name="search" placeholder="Search" />
                </FormField>
              </Form>
            </Formik>
          </NavBarItemPlain> */}
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
      <div className='flex justify-between  items-center flex-wrap gap-4 ml-2 mr-6 mb-6'>
      <div className="flex  flex-wrap pt-4 gap-4 items-center">
  

  <div className="">
    <label className="block mb-2  text-gray-700" style={{color:"#28419a",fontWeight:"600"}} >
      Product Name
    </label>
    <input  onChange={(e)=>setFilterData({...filters,brandName:e.target.value})} style={{width:"12rem",marginTop:"-2rem"}}  className="w-full bg-gray-100 border-2 border-gray-200 p-2 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500" type="text" id="westCode" name="westCode"/>
  </div>
  <div className="">
    <label className="block mb-2  text-gray-700" style={{color:"#28419a",fontWeight:"600"}}>
      Category 
    </label>
    <select style={{width:"12rem",marginTop:"-1rem"}} onChange={(e)=>setFilterData({...filters,category:e.target.value})}  className="w-full bg-gray-100 border-2 border-gray-200 p-2 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500" id="user-selection" name="user-selection">
      <option value="">All Categories</option>
      {
    Object.entries(allCategories).length>0  && Object.entries(allCategories).map(([key,val]:any)=>{
    
    return   <option value={val.category} key={val.id + "4567"}>{val.category}</option>
    })
    
   
    
   }
    </select>
  </div>
  <div className="">
    <button  onClick={filter} className=" w-auto text-white font-md py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" style={{background:"#2ec5e3",fontWeight:"600",marginTop:"1.5rem"}}>
      Apply Filters
    </button>
  </div>
</div>
       <div className='flex gap-2 flex-wrap'>
       <Button onClick={handleShow2} className='btn sm:w-100 text-white font-medium' style={{background:"#28419a",height:"2.5rem"}}>Add New Category</Button>
       <Button onClick={handleShow} className='btn sm:w-100 text-white font-medium' style={{background:"#28419a",height:"2.5rem"}}>Add New Product</Button>
        
       </div>

        
     

        </div>
       
       <div className='flex   flex-wrap  gap-4 ' >

        {
          Object.entries(searchedProducts).length>0 && Object.entries(searchedProducts).map(([key,value]:any)=>{
       
       return <div key={value.id} className=" flex flex-col sm:flex-row  border-2 border-black items-center border shadow border-black rounded w-{50}  sm:w-auto md:w-auto p-2">
    
     
      <Icon path={mdiCubeOutline} style={{color:"#28419a",fontWeight:"500 !important"}} className=" mb-2 sm:mb-0 sm:mr-4" size={1.5} />
      
      
     <div className="flex flex-col justify-center items-center sm:items-start"  >

        <h3 className="text-sm font-bold  text-black">Product Name : {value.brandName}</h3>
         <p className="text-xs text-black-500 mb-2 sm:mb-0">Category : <span className="font-bold">{value.category}</span></p>
       </div>
       <div className="flex ml-auto mt-2 flex-col  ml-2 items-end sm:mt-0">
         <button className="  " onClick={()=>handleShow3(value)}>
           <div className="flex font-sm" style={{fontSize:"14px",color:"#28419a"}} >
           Edit
         <Icon path={mdiSquareEditOutline} size={0.8}  />
           </div>
         
         </button>
         <button className="   " onClick={()=> {setModalId(value.id); setShowModal(true)}}>
           <div className="flex "style={{fontSize:"14px",color:"#28419a"}}>
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
      <Modal show={show}  onHide={handleClose}>
      <Modal.Header closeButton>
      <h3 className='font-sm' style={{color:"#2ec5e3",fontSize:"18px"}}>Add New Product</h3>
          
        </Modal.Header>
        <Modal.Body >
          <Form onSubmit={handleSubmit}>
          <Form.Select aria-label="Product Category" value={formData.category} 
    onChange={(e)=>{setFormData({...formData, category: e.target.value})}} required>
    <option value="">Select a category</option>
   {
    Object.entries(allCategories).length>0  && Object.entries(allCategories).map(([key,val]:any)=>{
    
    return   <option value={val.category} key={val.id + "321"}>{val.category}</option>
    })
    
   
    
   }
  </Form.Select>
      <Form.Group className='mt-4'>
        
        <Form.Control type="text" placeholder="Enter brand name" value={formData.brandName}
         onChange={(e)=>{setFormData({...formData,brandName:e.target.value})}} required />
      </Form.Group>
    
<div className='flex  flex-wrap justify-start mt-4'>
<div className='flex gap-4'>
<Button style={{background:"#2ec5e3",border:"none",height:"2.5rem",width:"7rem"}} type="submit">
        Add 
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
      <Modal show={show2}  onHide={handleClose2}>
      <Modal.Header closeButton>
      <h3 className='font-sm' style={{color:"#2ec5e3",fontSize:"18px"}}>Add New Category</h3>
          
        </Modal.Header>
        <Modal.Body >
          <Form onSubmit={handleSubmit2}>
      <Form.Group className='mt-0'>
        
        <Form.Control type="text" placeholder="Enter category name" value={category}
         onChange={(e)=>{setCategory(e.target.value)}}  required />
      </Form.Group>
      
    
<div className='flex justify-end gap-4 mt-4'>

<Button style={{background:"#2ec5e3",border:"none"}} type="submit">
        Add Category
      </Button>
</div>
      
    </Form>
          
        </Modal.Body>
        
      </Modal>
      <Modal show={show3}  onHide={handleClose3}>
      <Modal.Header closeButton>
      <h3 className='font-sm' style={{color:"#2ec5e3",fontSize:"18px"}}>Add New Product</h3>
          
        </Modal.Header>
        <Modal.Body >
          <Form onSubmit={updateProduct}>
          <Form.Select aria-label="Product Category" value={formData2.category} 
    onChange={(e)=>{setFormData2({...formData2, category: e.target.value})}} required>
    <option value="">Select a category</option>
   {
    Object.entries(allCategories).length>0  && Object.entries(allCategories).map(([key,val]:any)=>{
    
    return   <option value={val.category} key={val.id + "4321"}>{val.category}</option>
    })
    
   
    
   }
  </Form.Select>
      <Form.Group className='mt-4'>
        
        <Form.Control type="text" placeholder="Enter brand name" value={formData2.brandName}
         onChange={(e)=>{setFormData2({...formData2,brandName:e.target.value})}} required />
      </Form.Group>
    
<div className='flex justify-end gap-4 mt-4'>

<Button style={{background:"#2ec5e3",border:"none"}} type="submit">
        Update  Product
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
          Are you sure you want to delete Product ?
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
