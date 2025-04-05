import { useState, useEffect } from 'react'
import { MainLayout } from './components/layout/MainLayout'
import { RecordPage } from './pages/RecordPage'
import { HistoryPage } from './pages/HistoryPage'
import { LocationsPage } from './pages/LocationsPage'
import { SearchPage } from './pages/SearchPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('record')

  const renderPage = () => {
    switch (currentPage) {
      case 'record':
        return <RecordPage />
      case 'history':
        return <HistoryPage />
      case 'locations':
        return <LocationsPage />
      case 'search':
        return <SearchPage />
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
