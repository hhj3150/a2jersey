interface BrandFilmProps {
  videoId: string
  homepageUrl: string
}

export function BrandFilm({ videoId, homepageUrl }: BrandFilmProps) {
  return (
    <section className="section bg-surface" aria-labelledby="brand-film-title">
      <div className="container-app">
        <p className="section-eyebrow text-center">Brand Film</p>
        <h2 id="brand-film-title" className="section-title text-center">
          송영신목장 이야기
        </h2>

        <div className="relative mt-8 w-full overflow-hidden rounded-2xl border border-line bg-ink"
             style={{ aspectRatio: '16 / 9' }}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
            title="송영신목장 브랜드 필름"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>

        <div className="mt-6 text-center">
          <a
            href={homepageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            송영신목장 브랜드 스토리 자세히 보기 →
          </a>
        </div>
      </div>
    </section>
  )
}
