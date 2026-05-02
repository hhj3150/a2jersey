import { Hero } from './components/Hero'
import { BrandFilm } from './components/BrandFilm'
import { WhyDifferent } from './components/WhyDifferent'
import { CraftCardGrid } from './components/CraftCardGrid'
import { SubscriptionPreview } from './components/SubscriptionPreview'
import { SignupForm } from './components/SignupForm'
import { ShareSection } from './components/ShareSection'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'
import { env } from './env'

function App() {
  // 정체성: 마케팅 채널 (영구 운영). 정기구독 신청은 스마트스토어가 처리하고,
  // 이 폼은 "송영신목장 소식 받기" 채널로 영구 운영. 6/1 자정에 SignupForm 카피·SuccessPanel만
  // phase별로 자동 전환됨 (사전회원 → 소식 받기 톤).
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
      <SignupForm launchDate={env.launchDate} />
      <ShareSection launchDate={env.launchDate} />
      <FAQ />
      <Footer
        homepageUrl={env.brandHomepage}
        facebookUrl={env.facebookUrl}
        instagramUrl={env.instagramUrl}
        naverBlogUrl={env.naverBlogUrl}
      />
    </main>
  )
}

export default App
