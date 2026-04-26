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

export const interestOptions: { value: Interest; label: string }[] = [
  { value: '750ml',          label: '750ml A2 저지 헤이밀크' },
  { value: '180ml',          label: '180ml A2 저지 헤이밀크' },
  { value: 'yogurt-plain',   label: '500ml A2 저지 플래인 요거트' },
  { value: 'yogurt-protein', label: '500ml A2 저지 프로틴 요거트' },
  { value: 'softserve',      label: '소프트아이스크림 · 카페 방문' },
  { value: 'other',          label: '기타' },
]

const PHONE_REGEX = /^01[016789]-?\d{3,4}-?\d{4}$/
const POSTCODE_REGEX = /^\d{5}$/

export const registerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, '이름을 입력해주세요')
    .max(50, '이름이 너무 깁니다'),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, '올바른 휴대폰 번호 형식이 아닙니다 (010으로 시작)'),
  postcode: z
    .string()
    .trim()
    .regex(POSTCODE_REGEX, '주소찾기 버튼으로 주소를 선택해주세요'),
  addressRoad: z
    .string()
    .trim()
    .min(1, '주소찾기 버튼으로 주소를 선택해주세요')
    .max(200),
  addressJibun: z.string().trim().max(200).optional(),
  addressDetail: z
    .string()
    .trim()
    .max(100, '상세주소가 너무 깁니다')
    .optional(),
  interests: z
    .array(interestEnum)
    .min(1, '관심 상품을 1개 이상 선택해주세요'),
  smsConsent: z.boolean(),
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: '개인정보 수집·이용에 동의해주세요' }),
  }),
})

export type RegisterFormValues = z.infer<typeof registerFormSchema>
