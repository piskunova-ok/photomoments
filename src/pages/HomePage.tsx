import { Advantages } from '../components/Advantages.tsx'
import { Calculator } from '../components/Calculator.tsx'
import { Footer } from '../components/Footer.tsx'
import { Formats } from '../components/Formats.tsx'
import { Header } from '../components/Header.tsx'
import { Hero } from '../components/Hero.tsx'
import { HowToOrder } from '../components/HowToOrder.tsx'
import { PickupPoints } from '../components/PickupPoints.tsx'
import { YandexFormSlot } from '../components/YandexFormSlot.tsx'
import { useCalculator } from '../hooks/useCalculator.ts'

export default function HomePage() {
  const calculator = useCalculator()

  return (
    <>
      <a className="skip-link" href="#calculator">
        Перейти к калькулятору
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Advantages />
        <Formats />
        <Calculator controller={calculator} />
        <YandexFormSlot
          payload={calculator.payload}
          onIncompleteAttempt={calculator.markQuantityTouched}
        />
        <HowToOrder />
        <PickupPoints />
      </main>
      <Footer />
    </>
  )
}
