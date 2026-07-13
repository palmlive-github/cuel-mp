import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Header from './Header.jsx'

// Layout ตามต้นแบบ: header fixed สูง 58px, sidebar ขาว 230px (พับได้), main margin-left ตาม sidebar
export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen">
      <Header onToggleSidebar={() => setCollapsed((c) => !c)} />
      <div className="pt-[58px] flex">
        <Sidebar collapsed={collapsed} />
        <main
          className={`flex-1 min-w-0 p-6 transition-[margin-left] duration-200 ${
            collapsed ? 'ml-0' : 'ml-[230px]'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
