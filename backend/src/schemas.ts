import { z } from 'zod'

export const interestEnum = z.enum(['750ml', '180ml', 'yogurt', 'softserve', 'other'])
export type Interest = z.infer<typeof interestEnum>

export const interestLabels: Record<Interest, string> = {
  '750ml': '750ml 정기구독',
  '180ml': '180ml 어린이/체험용',
  yogurt: '요거트',
  softserve: '소프트아이스크림 / 카페 방문',
  other: '기타',
}

const PHONE_REGEX = /^01[016789]\d{7,8}$/

export const normalizePhone = (raw: string): string =>
  raw.replace(/[^0-9]/g, '')

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
  region: z
    .string({ required_error: '거주 지역을 입력해주세요' })
    .trim()
    .min(1, '거주 지역을 입력해주세요')
    .max(100, '지역명이 너무 깁니다'),
  interests: z
    .array(interestEnum)
    .min(1, '관심 상품을 1개 이상 선택해주세요'),
  smsConsent: z.boolean(),
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: '개인정보 수집·이용에 동의해주세요' }),
  }),
  ref: z
    .string()
    .trim()
    .max(20)
    .optional()
    .transform((v) => v || 'direct'),
})

export type RegisterInput = z.infer<typeof registerSchema>
