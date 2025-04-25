import { useSelector } from "react-redux"

export default function ThemeProvider({children}) {
    const {theme} = useSelector(state => state.theme);//themeSlice.js theke anbe data
  return (
    //akhaner color gulai show korbe screen ae.theme onujayi
    <div className={theme}>
        <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen">
            {children}
        </div>
    </div>
  )
}
