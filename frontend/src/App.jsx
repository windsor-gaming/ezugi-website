import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import TrustBar from './components/TrustBar/TrustBar'
import Features from './components/Features/Features'
import Statement from './components/Statement/Statement'
import Services from './components/Services/Services'
import HowItWorks from './components/HowItWorks/HowItWorks'
import BrandReveal from './components/BrandReveal/BrandReveal'
import Intro from './components/Intro/Intro'
import WhoWeAre from './components/WhoWeAre/WhoWeAre'
import Reviews from './components/Reviews/Reviews'
import Careers from './pages/Careers/Careers'
import VacancyDetail from './pages/Careers/VacancyDetail'
import Contact from './pages/Contact/Contact'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Login from './pages/HR/Login'
import HRLayout from './pages/HR/HRLayout'
import VacanciesList from './pages/HR/Vacancies/VacanciesList'
import VacancyForm from './pages/HR/Vacancies/VacancyForm'
import ApplicationsList from './pages/HR/Applications/ApplicationsList'
import ReviewsAdmin from './pages/HR/Reviews/ReviewsAdmin'

function App() {
  const [count, setCount] = useState(0)
  const location = useLocation()
  const isHrRoute = location.pathname.startsWith('/hr')

  return (
    <>
     {!isHrRoute && <Navbar/>}
     <Routes>
       <Route path="/" element={
         <>
           <Hero/>
           <Intro/>
           <WhoWeAre/>
           <Features/>
           <Services/>
           <BrandReveal/>
           <HowItWorks/>
           <Reviews/>
         </>
       } />
       <Route path="/careers" element={<Careers/>} />
       <Route path="/careers/:id" element={<VacancyDetail/>} />
       <Route path="/contact" element={<Contact/>} />

       <Route path="/hr/login" element={<Login/>} />
       <Route path="/hr" element={<ProtectedRoute/>}>
         <Route element={<HRLayout/>}>
           <Route index element={<VacanciesList/>} />
           <Route path="vacancies" element={<VacanciesList/>} />
           <Route path="vacancies/new" element={<VacancyForm/>} />
           <Route path="vacancies/:id/edit" element={<VacancyForm/>} />
           <Route path="applications" element={<ApplicationsList/>} />
           <Route path="reviews" element={<ReviewsAdmin/>} />
         </Route>
       </Route>
     </Routes>
    </>
  )
}

export default App
