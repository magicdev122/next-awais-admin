import {
  
  mdiMonitor,
  mdiAccountOutline,
  mdiStorefrontOutline ,
  mdiLogout ,mdiFileDocumentEditOutline ,mdiCubeOutline 
 
} from '@mdi/js'
import { MenuAsideItem } from './interfaces'

const menuAside: MenuAsideItem[] = [
  {
    href: '/entries',
    icon: mdiFileDocumentEditOutline ,
    label: 'Entries',
  },
  {
    href: '/users',
    icon: mdiAccountOutline,
    label: 'users',
  },
  {
    href: '/subAdmins',
    icon: mdiAccountOutline,
    label: 'Sub admins',
  },
  {
    href: '/stores',
    icon: mdiStorefrontOutline,
    label: 'Stores',
  },
  {
    href: '/products',
    icon: mdiCubeOutline ,
    label: 'Products',
  },
  {
    href: '/logout',
    icon: mdiLogout ,
    label: 'Logout',
  },
]

export default menuAside
