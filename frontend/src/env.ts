export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  brandHomepage:
    import.meta.env.VITE_BRAND_HOMEPAGE || 'https://www.a2jerseymilk.com',
  brandFilmId: import.meta.env.VITE_BRAND_FILM_ID || 'bI5EmgK0i2A',
  launchDate: import.meta.env.VITE_LAUNCH_DATE || '2026-06-01',
  smartstoreUrl:
    import.meta.env.VITE_SMARTSTORE_URL || 'https://smartstore.naver.com/a2milk_hay',
  facebookUrl:
    import.meta.env.VITE_FACEBOOK_URL ||
    'https://www.facebook.com/profile.php?id=100010048209772',
  instagramUrl:
    import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/songyoungshin_farm/',
  naverBlogUrl:
    import.meta.env.VITE_NAVER_BLOG_URL || 'https://blog.naver.com/78redmoon',
  youtubeUrl:
    import.meta.env.VITE_YOUTUBE_URL || 'https://www.youtube.com/@songyoungshin_farm',
} as const
