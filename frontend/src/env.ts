export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  brandHomepage:
    import.meta.env.VITE_BRAND_HOMEPAGE || 'https://www.a2jerseymilk.com',
  brandFilmId: import.meta.env.VITE_BRAND_FILM_ID || 'bI5EmgK0i2A',
  launchDate: import.meta.env.VITE_LAUNCH_DATE || '2026-06-01',
  // 정기구독 트래픽이 향할 공식 쇼핑몰 (현재 아임웹 자체몰 준비 중, 5월 말 연결 예정).
  // 비어 있으면 UI는 "오픈 예정" 안내만 표시하고 외부 링크 버튼을 숨긴다.
  shopUrl: import.meta.env.VITE_SHOP_URL || '',
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
