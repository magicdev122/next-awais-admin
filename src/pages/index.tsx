import React, { useState,useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { getDatabase, ref, set, onValue } from "firebase/database";
import { database } from '../../firebase';
import JsCookie from 'js-cookie'
import {toast,Toaster} from 'react-hot-toast';
type FormType = 'admin' | 'sub-admin';

const AdminForm: React.FC = () => {
  const [formType, setFormType] = useState<FormType>('admin');
  const [key, setKey] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
useEffect(()=>{
if(JsCookie.get("admin_type")==="admin"){
  router.push("entries")
}else if(JsCookie.get("admin_type")==="sub-admin"){
  router.push("subAdminEntries")

}
},[])
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    
    
    event.preventDefault();
    if(formType === 'admin'){
      
      
      const starCountRef = ref(database, 'AdminKey');
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        if(data===key){
          JsCookie.set('admin_type', 'admin')

          router.push("/entries",undefined,{shallow:true})
        }else{
          toast.error("Key is incorrect")
        }
      });

      
    }else{

      
      const starCountRef = ref(database, 'SubAdmins');
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
      const user= Object.entries(data).find(([key,user]:any)=>user.username===username && user.password===password)
      if(user){
        JsCookie.set('admin_type', 'sub-admin')

        router.push("/subAdminEntries",undefined,{shallow:true})
      }else{
        toast.error("Username or Password is incorrect")
      }
       
      
      });
    }
    
    
  };

  return (
    <div className="container mx-auto mt-4">
      <Toaster/>
      <div className="flex justify-center mb-4">
        <button
          className={classNames('mr-4', { 'text-blue-500': formType === 'admin' })}
          onClick={() => setFormType('admin')}
        >
          Admin
        </button>
        <button
          className={classNames({ 'text-blue-500': formType === 'sub-admin' })}
          onClick={() => setFormType('sub-admin')}
        >
          Sub-admin
        </button>
      </div>

      <div className="w-full lg:w-1/3 mx-auto rounded shadow border p-4">
        {formType === 'admin' && (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="key">
              <Form.Label>Key</Form.Label>
              <Form.Control type="password" required placeholder="Enter key" value={key} onChange={(e) => setKey(e.target.value)} />
            </Form.Group>
            <Button type="submit" className='mt-2' variant="primary">
              Log in
            </Button>
          </Form>
        )}

        {formType === 'sub-admin' && (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control required type="text" placeholder="Enter username"  value={username} onChange={(e:any)=>setUsername(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control required type="password" placeholder="Enter password"  value={password} onChange={(e:any)=>setPassword(e.target.value)}/>
            </Form.Group>
            <Button type="submit" className='mt-2' variant="primary">
              Log in
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
};

export default AdminForm;
