import { Hero } from './components/Hero'
import { BrandFilm } from './components/BrandFilm'
import { WhyDifferent } from './components/WhyDifferent'
import { CraftCardGrid } from './components/CraftCardGrid'
import { SubscriptionPreview } from './components/SubscriptionPreview'
import { SignupForm } from './components/SignupForm'
import { ShareSection } from './components/ShareSection'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'
import { useDDay } from './lib/useDDay'
import { env } from './env'

function App() {
  const dday = useDDay(env.launchDate)
  // 6/1 자정(KST) 이후엔 사전회원 모집 종료 — 홍보 페이지로 자동 전환.
  // 정기구독은 스마트스토어가 처리. 이 앱의 SignupForm은 oversub 위험 + 책임 혼선 방지를 위해 미렌더.
  const isLaunched = dday.phase === 'live' || dday.phase === 'today'

  const scrollToSignup = () => {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main>
      <Hero onCtaClick={scrollToSignup} launchDate={env.launchDate} />
      <BrandFilm videoId={env.brandFilmId} homepageUrl={env.brandHomepage} />
      <WhyDifferent />
      <CraftCardGrid />
      <SubscriptionPreview launchDate={env.launchDate} />
      {!isLaunched && <SignupForm />}
      <ShareSection launchDate={env.launchDate} />
      <FAQ />
      <Footer homepageUrl={env.brandHomepage} />
    </main>
  )
}

export default App
