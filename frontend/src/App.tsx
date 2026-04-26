import { Hero } from './components/Hero'
import { BrandFilm } from './components/BrandFilm'
import { WhyDifferent } from './components/WhyDifferent'
import { TasteMessage } from './components/TasteMessage'
import { SubscriptionPreview } from './components/SubscriptionPreview'
import { SignupForm } from './components/SignupForm'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'
import { env } from './env'

function App() {
  const scrollToSignup = () => {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main>
      <Hero
        onCtaClick={scrollToSignup}
        launchDate={env.launchDate}
        smartstoreUrl={env.smartstoreUrl}
      />
      <BrandFilm videoId={env.brandFilmId} homepageUrl={env.brandHomepage} />
      <WhyDifferent />
      <TasteMessage />
      <SubscriptionPreview launchDate={env.launchDate} smartstoreUrl={env.smartstoreUrl} />
      <SignupForm />
      <FAQ />
      <Footer homepageUrl={env.brandHomepage} smartstoreUrl={env.smartstoreUrl} />
    </main>
  )
}

export default App
