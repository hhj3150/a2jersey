/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_BRAND_HOMEPAGE: string
  readonly VITE_BRAND_FILM_ID: string
  readonly VITE_LAUNCH_DATE: string
  readonly VITE_SMARTSTORE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
