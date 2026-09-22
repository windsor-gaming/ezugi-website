import { useState } from 'react'
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

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Navbar/>
     <Hero/>
     <Intro/>
     <WhoWeAre/>
     <Features/>
     <Services/>
     <BrandReveal/>
     <HowItWorks/>
    </>
  )
}

export default App
