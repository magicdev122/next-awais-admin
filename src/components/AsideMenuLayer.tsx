import React from 'react'
import {  mdiClose } from '@mdi/js'
import BaseIcon from './BaseIcon'
import Image from 'next/image'
import AsideMenuList from './AsideMenuList'
import { MenuAsideItem } from '../interfaces'
import { useAppSelector } from '../stores/hooks'

type Props = {
  menu: MenuAsideItem[]
  className?: string
  onAsideLgCloseClick: () => void
}

export default function AsideMenuLayer({ menu, className = '', ...props }: Props) {

  const asideScrollbarsStyle = useAppSelector((state) => state.style.asideScrollbarsStyle)
  const darkMode = useAppSelector((state) => state.style.darkMode)



  const handleAsideLgCloseClick = (e: React.MouseEvent) => {
    e.preventDefault()
    props.onAsideLgCloseClick()
  }

  return (
    <aside
      className={`${className} zzz  w-60  fixed flex z-40 top-0 h-screen transition-position overflow-hidden`}
    >
      <div
        className={`lg:rounded-2xl flex-1 flex flex-col overflow-hidden  ` } style={{background:"linear-gradient(to right,#28419a,#28387c)",borderRadius:"0"}}
      >
        <div
          className={`flex flex-row h-14 pt-12 items-center justify-center `}
        >
          <div className="text-center flex  lg:text-left lg:pl-6 xl:text-center xl:pl-0">
            <Image   src={"icon.png"} alt='logo' width={170} height={180}/>
          </div>
          <button
            className="hidden lg:inline-block xl:hidden p-3"
            onClick={handleAsideLgCloseClick}
          >
            <BaseIcon path={mdiClose}  />
          </button>
        </div>
        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden  mt-8 ${
            darkMode ? 'aside-scrollbars-[slate]' : asideScrollbarsStyle
          }`}
        >
          <AsideMenuList menu={menu} />
        </div>
      
      </div>
    </aside>
  )
}
