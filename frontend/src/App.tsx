import { Hero } from './components/Hero'
import { BrandFilm } from './components/BrandFilm'
import { WhyDifferent } from './components/WhyDifferent'
import { HayMilk } from './components/HayMilk'
import { Pasteurization } from './components/Pasteurization'
import { TasteMessage } from './components/TasteMessage'
import { HowToTaste } from './components/HowToTaste'
import { SubscriptionPreview } from './components/SubscriptionPreview'
import { SignupForm } from './components/SignupForm'
import { ShareSection } from './components/ShareSection'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'
import { env } from './env'

function App() {
  const scrollToSignup = () => {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main>
      <Hero onCtaClick={scrollToSignup} launchDate={env.launchDate} />
      <BrandFilm videoId={env.brandFilmId} homepageUrl={env.brandHomepage} />
      <WhyDifferent />
      <HayMilk />
      <Pasteurization />
      <TasteMessage />
      <HowToTaste />
      <SubscriptionPreview launchDate={env.launchDate} />
      <SignupForm />
      <ShareSection />
      <FAQ />
      <Footer homepageUrl={env.brandHomepage} />
    </main>
  )
}

export default App
