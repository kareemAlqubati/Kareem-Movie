'use client'

import {MdLightMode, MdDarkMode} from 'react-icons/md'
import {useTheme} from 'next-themes'

export default function Darkmode() {
    const {theme, setTheme , systemTheme} = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;
  return (
    <div>
        { 
            currentTheme === 'dark' ?(
            <MdLightMode onClick={()=> setTheme('Light')} 
            className=' cursor-pointer hover:text-blue-600' />
           )
             :
            (
            <MdDarkMode onClick={()=> setTheme('dark')} 
            className=' cursor-pointer hover:text-blue-600' />

             )}
    </div>
  );
}
