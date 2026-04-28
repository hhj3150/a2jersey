import { z } from 'zod'

export const interestEnum = z.enum([
  '750ml',
  '180ml',
  'yogurt-plain',
  'yogurt-protein',
  'softserve',
  'other',
  'yogurt',
])
export type Interest = z.infer<typeof interestEnum>

export const interestLabels: Record<Interest, string> = {
  '750ml': '750ml A2 저지 헤이밀크',
  '180ml': '180ml A2 저지 헤이밀크',
  'yogurt-plain': '500ml A2 저지 플래인 요거트',
  'yogurt-protein': '500ml A2 저지 프로틴 요거트',
  softserve: '소프트아이스크림 · 카페 방문',
  other: '기타',
  yogurt: '요거트 (구버전)',
}

const PHONE_REGEX = /^01[016789]\d{7,8}$/

export const normalizePhone = (raw: string): string =>
  raw.replace(/[^0-9]/g, '')

const POSTCODE_REGEX = /^\d{5}$/

export const registerSchema = z.object({
  name: z
    .string({ required_error: '이름을 입력해주세요' })
    .trim()
    .min(1, '이름을 입력해주세요')
    .max(50, '이름이 너무 깁니다'),
  phone: z
    .string({ required_error: '휴대폰 번호를 입력해주세요' })
    .transform(normalizePhone)
    .pipe(
      z
        .string()
        .regex(PHONE_REGEX, '올바른 휴대폰 번호 형식이 아닙니다 (010으로 시작)'),
    ),
  postcode: z
    .string({ required_error: '우편번호를 입력해주세요' })
    .trim()
    .regex(POSTCODE_REGEX, '우편번호는 5자리 숫자입니다 (주소찾기 사용)'),
  addressRoad: z
    .string({ required_error: '도로명 주소가 필요합니다 (주소찾기 사용)' })
    .trim()
    .min(1, '도로명 주소가 필요합니다')
    .max(200, '주소가 너무 깁니다'),
  addressJibun: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => v || null),
  addressDetail: z
    .string()
    .trim()
    .max(100, '상세주소가 너무 깁니다')
    .optional()
    .transform((v) => v || null),
  region: z
    .string()
    .trim()
    .max(100)
    .optional(),
  interests: z
    .array(interestEnum)
    .min(1, '관심 상품을 1개 이상 선택해주세요'),
  smsConsent: z.boolean(),
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: '개인정보 수집·이용에 동의해주세요' }),
  }),
  ageConsent: z.literal(true, {
    errorMap: () => ({
      message: '만 14세 이상만 가입할 수 있습니다',
    }),
  }),
  ref: z
    .string()
    .trim()
    .max(20)
    .optional()
    .transform((v) => v || 'direct'),
})

export const deriveRegion = (road: string): string => {
  const parts = road.split(/\s+/)
  return parts.slice(0, 2).join(' ').slice(0, 100) || road.slice(0, 100)
}

export type RegisterInput = z.infer<typeof registerSchema>
