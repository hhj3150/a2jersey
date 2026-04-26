export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  brandHomepage:
    import.meta.env.VITE_BRAND_HOMEPAGE || 'https://www.a2jerseymilk.com',
  brandFilmId: import.meta.env.VITE_BRAND_FILM_ID || 'bI5EmgK0i2A',
  launchDate: import.meta.env.VITE_LAUNCH_DATE || '2026-06-01',
  smartstoreUrl:
    import.meta.env.VITE_SMARTSTORE_URL || 'https://smartstore.naver.com/a2milk_hay',
} as const
