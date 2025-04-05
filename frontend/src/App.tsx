import { useState, useEffect } from 'react'
import { MainLayout } from './components/layout/MainLayout'
import { RecordPage } from './pages/RecordPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('record')

  const renderPage = () => {
    switch (currentPage) {
      case 'record':
        return <RecordPage />
      case 'history':
        return <div className="container mx-auto py-6"><h1 className="text-3xl font-bold mb-6">历史记录</h1><p>历史记录页面 - 开发中</p></div>
      case 'locations':
        return <div className="container mx-auto py-6"><h1 className="text-3xl font-bold mb-6">地点</h1><p>地点页面 - 开发中</p></div>
      case 'search':
        return <div className="container mx-auto py-6"><h1 className="text-3xl font-bold mb-6">记忆检索</h1><p>记忆检索页面 - 开发中</p></div>
      default:
        return <RecordPage />
    }
  }

  const handleNavigation = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const closestLink = target.closest('a')
    
    if (closestLink && closestLink.getAttribute('href')?.startsWith('/')) {
      e.preventDefault()
      const path = closestLink.getAttribute('href')
      const pageName = path?.substring(1) // Remove leading slash
      
      if (pageName) {
        setCurrentPage(pageName)
        window.history.pushState(null, '', path)
      }
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleNavigation as any)
    return () => document.removeEventListener('click', handleNavigation as any)
  }, [])

  return (
    <MainLayout>
      {renderPage()}
    </MainLayout>
  )
}

export default App
