/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream:    '#FAF7F2',
        surface:  '#FFFFFF',
        ink:      '#1A1A1A',
        mute:     '#6B6B6B',
        soil:     '#8B6F47',
        'soil-dark': '#6B5436',
        line:     '#E8E2D8',
        forest:   '#1F2E25',
        gold:     '#C8A867',
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'Helvetica Neue',
          '"Segoe UI"',
          '"Apple SD Gothic Neo"',
          '"Noto Sans KR"',
          'sans-serif',
        ],
      },
      maxWidth: {
        'reading': '36rem',
      },
      letterSpacing: {
        'tight-kr': '-0.02em',
      },
    },
  },
  plugins: [],
}
