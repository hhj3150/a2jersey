import { useEffect } from 'react'

const COMPANY = '농업회사법인 디투오'
const REPRESENTATIVE = '송영신'
const BIZ_REG_NO = '266-88-01121'
const TS_NO = '2025-경기안성-0841'
const ADDRESS = '경기도 안성시 미양면 미양로 466'
const PHONE = '031-674-3150'
const DPO_NAME = '송영신'
const DPO_TITLE = '대표이사'
const DPO_EMAIL = 'hhj3150@hanmail.net'
const EFFECTIVE_DATE = '2026년 4월 29일'

export function Privacy() {
  useEffect(() => {
    document.title = '개인정보 처리방침 | 송영신목장 A2 Jersey Hay Milk'
  }, [])

  return (
    <main className="min-h-screen bg-cream">
      <div className="container-app max-w-3xl py-10 md:py-14">
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center text-sm text-soil-dark hover:underline"
          >
            ← 홈으로
          </a>
        </div>

        <header className="mb-10 border-b border-line pb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-ink">
            개인정보 처리방침
          </h1>
          <p className="mt-3 text-sm text-mute">
            시행일: {EFFECTIVE_DATE}
          </p>
        </header>

        <article className="prose-policy">
          <p>
            {COMPANY}(이하 “회사”)는 정보주체의 자유와 권리를 보호하기 위해
            「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여 적법하게
            개인정보를 처리하고 안전하게 관리하고 있습니다. 회사는
            「개인정보 보호법」 제30조에 따라 정보주체에게 개인정보 처리에
            관한 절차 및 기준을 안내합니다.
          </p>
          <p>
            본 처리방침은 송영신목장 A2 Jersey Hay Milk 정기구독 사전회원
            모집 페이지(이하 “본 사이트”)에 적용됩니다.
          </p>

          <section>
            <h2>제1조 (개인정보의 처리목적)</h2>
            <p>
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고
              있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
              이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에
              따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ol>
              <li>정기구독 사전회원 등록 및 본인 식별·확인</li>
              <li>정기구독 오픈 사실 안내 및 가입 절차 안내</li>
              <li>
                (마케팅 수신 동의자에 한함) 신제품·이벤트·할인 등 마케팅
                정보 발송
              </li>
              <li>중복 가입 방지 및 분쟁 발생 시 대응</li>
              <li>가입 통계 산출 및 서비스 개선을 위한 분석</li>
            </ol>
          </section>

          <section>
            <h2>제2조 (처리하는 개인정보의 항목)</h2>
            <h3>1. 필수 수집항목 (사전회원 가입 시)</h3>
            <ul>
              <li>이름</li>
              <li>휴대폰 번호</li>
              <li>우편번호, 도로명주소, 지번주소, 상세주소</li>
              <li>관심 상품(택1 이상)</li>
              <li>만 14세 이상 여부 확인</li>
            </ul>
            <h3>2. 선택 수집항목</h3>
            <ul>
              <li>마케팅 수신 동의 여부</li>
            </ul>
            <h3>3. 자동 수집 항목</h3>
            <ul>
              <li>접속 IP 주소, User-Agent(브라우저 정보), 접속 일시</li>
              <li>유입 경로(ref 파라미터: cafe, share, direct 등)</li>
              <li>
                동의 일시(개인정보 수집·이용 동의 일시, 마케팅 수신 동의
                일시)
              </li>
            </ul>
            <p className="text-sm text-mute">
              본 사이트는 마케팅·광고 트래킹용 쿠키(GA, Facebook Pixel
              등)를 사용하지 않습니다.
            </p>
          </section>

          <section>
            <h2>제3조 (개인정보의 처리 및 보유기간)</h2>
            <ol>
              <li>
                회사는 정보주체로부터 개인정보를 수집할 때 동의받은 보유 및
                이용기간 내에서 개인정보를 처리·보유합니다.
              </li>
              <li>
                사전회원 정보는 가입일로부터 <strong>1년</strong>간
                보유하며, 보유기간 만료 시 지체없이 파기합니다.
              </li>
              <li>
                정기구독 서비스가 정식 오픈된 후 정기구독 회원으로 전환된
                이용자의 정보는 별도의 동의 절차를 거쳐 정기구독 회원 약관
                및 처리방침에 따라 처리됩니다.
              </li>
            </ol>
          </section>

          <section>
            <h2>제4조 (개인정보의 제3자 제공)</h2>
            <p>
              회사는 정보주체의 개인정보를 제1조에서 명시한 목적 범위 내에서만
              처리하며, 정보주체의 사전 동의 또는 「개인정보 보호법」
              제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게
              제공합니다. <strong>현재 회사는 사전회원 정보를 제3자에게 제공하지 않습니다.</strong>
            </p>
          </section>

          <section>
            <h2>제5조 (개인정보 처리의 위탁)</h2>
            <p>
              회사는 원활한 서비스 제공을 위하여 다음과 같이 개인정보 처리
              업무를 위탁하고 있습니다.
            </p>
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>수탁자</th>
                    <th>위탁업무</th>
                    <th>위탁 항목</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>(주)솔라피 (Solapi)</td>
                    <td>마케팅 SMS/LMS 메시지 발송</td>
                    <td>이름, 휴대폰 번호</td>
                  </tr>
                  <tr>
                    <td>Railway Corp.(미국)</td>
                    <td>사전회원 데이터베이스 호스팅</td>
                    <td>본 방침 제2조 1·2호 항목 전부 + 자동수집 항목</td>
                  </tr>
                  <tr>
                    <td>Netlify, Inc.(미국)</td>
                    <td>웹사이트 정적 파일 호스팅 및 접속 로그</td>
                    <td>접속 IP 주소, User-Agent</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              회사는 위탁계약 체결 시 「개인정보 보호법」 제26조에 따라
              위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치,
              재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에
              관한 사항을 계약서 등 문서에 명시하고 수탁자가 개인정보를
              안전하게 처리하는지 감독하고 있습니다.
            </p>
            <h3>국외 이전 안내</h3>
            <p>
              회사는 미국 소재 위탁사(Railway, Netlify)에 개인정보를
              국외이전하고 있으며, 본 방침의 게시로써 「개인정보 보호법」
              제28조의8에 따른 국외이전에 관한 사항을 안내합니다.
            </p>
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>이전받는 자</th>
                    <th>국가</th>
                    <th>이전 시점 및 방법</th>
                    <th>이전 항목</th>
                    <th>보유 기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Railway Corp.</td>
                    <td>미국</td>
                    <td>사전회원 등록 시점, 네트워크 전송</td>
                    <td>제2조 1·2호 항목 + 자동수집 항목</td>
                    <td>1년</td>
                  </tr>
                  <tr>
                    <td>Netlify, Inc.</td>
                    <td>미국</td>
                    <td>사이트 접속 시점, 자동 전송</td>
                    <td>접속 IP, User-Agent</td>
                    <td>Netlify 자체 정책(통상 30일 이내)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>
              제6조 (정보주체와 법정대리인의 권리·의무 및 그 행사방법)
            </h2>
            <ol>
              <li>
                정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·
                처리정지 요구 등의 권리를 행사할 수 있습니다.
              </li>
              <li>
                권리 행사는 「개인정보 보호법 시행령」 제41조 제1항에 따라
                서면, 전자우편을 통하여 하실 수 있으며 회사는 이에 대해
                지체없이 조치하겠습니다.
              </li>
              <li>
                권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등
                대리인을 통하여 하실 수 있습니다. 이 경우 「개인정보 처리
                방법에 관한 고시」 별지 제11호 서식에 따른 위임장을
                제출하셔야 합니다.
              </li>
              <li>
                개인정보 열람 및 처리정지 요구는 「개인정보 보호법」 제35조
                제4항, 제37조 제2항에 의하여 정보주체의 권리가 제한될 수
                있습니다.
              </li>
            </ol>
            <p>
              요청 접수처: <a href={`mailto:${DPO_EMAIL}`}>{DPO_EMAIL}</a>{' '}
              (제10조 개인정보 보호책임자 참조)
            </p>
          </section>

          <section>
            <h2>제7조 (개인정보의 파기)</h2>
            <ol>
              <li>
                회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
                불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
              </li>
              <li>
                회사는 자동 파기 작업을 매일 1회(KST 04:00) 실행하며,
                보유기간 1년이 경과한 데이터는 즉시 영구 삭제됩니다.
              </li>
              <li>
                파기방법: 전자적 파일 형태의 정보는 복원이 불가능한
                방법으로 영구 삭제(데이터베이스 레코드 삭제 + 정기 백업
                자동 만료)합니다.
              </li>
            </ol>
          </section>

          <section>
            <h2>제8조 (개인정보의 안전성 확보 조치)</h2>
            <p>
              회사는 「개인정보 보호법」 제29조에 따라 다음과 같이 안전성
              확보에 필요한 기술적·관리적 조치를 하고 있습니다.
            </p>
            <ol>
              <li>관리적 조치: 개인정보 보호책임자 지정, 접근권한 최소화 운영</li>
              <li>
                기술적 조치
                <ul>
                  <li>HTTPS(TLS 1.2 이상) 통신 강제</li>
                  <li>관리자 페이지 인증 및 강화된 비밀번호 정책</li>
                  <li>SQL 파라미터 바인딩, LIKE 검색 이스케이프, Rate-Limit, CSP 헤더 적용</li>
                  <li>가입 동시요청 race condition 방지 (DB 유니크 제약)</li>
                </ul>
              </li>
              <li>
                물리적 조치: 위탁사(Railway, Netlify)의 데이터센터 물리
                보안 정책에 의함
              </li>
            </ol>
          </section>

          <section>
            <h2>
              제9조 (개인정보 자동수집 장치의 설치·운영 및 거부에 관한
              사항)
            </h2>
            <ol>
              <li>
                본 사이트는 가입 요청 시 서버 로그에 접속 IP, User-Agent,
                접속 일시를 기록하며, 이는 부정 가입 방지·통계 목적으로
                사용됩니다.
              </li>
              <li>
                본 사이트는 마케팅·광고 트래킹용 쿠키(GA, Facebook Pixel
                등)를 사용하지 않습니다.
              </li>
              <li>
                자동수집 거부는 브라우저의 쿠키 설정 변경 또는 본 사이트
                미이용을 통해 가능하며, 거부할 경우 일부 기능이 제한될 수
                있습니다.
              </li>
            </ol>
          </section>

          <section>
            <h2>제10조 (개인정보 보호책임자)</h2>
            <p>
              회사는 개인정보 처리에 관한 업무를 총괄하여 책임지고,
              개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을
              위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <ul>
              <li>
                <strong>개인정보 보호책임자</strong>
              </li>
              <li>성명 / 직책: {DPO_NAME} / {DPO_TITLE}</li>
              <li>전화: {PHONE}</li>
              <li>
                이메일:{' '}
                <a href={`mailto:${DPO_EMAIL}`}>{DPO_EMAIL}</a>
              </li>
            </ul>
          </section>

          <section>
            <h2>제11조 (정보주체의 권익침해 구제방법)</h2>
            <p>
              정보주체는 개인정보침해로 인한 구제를 받기 위하여
              개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터
              등에 분쟁해결이나 상담 등을 신청할 수 있습니다.
            </p>
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>기관명</th>
                    <th>전화</th>
                    <th>홈페이지</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>개인정보분쟁조정위원회</td>
                    <td>1833-6972</td>
                    <td>www.kopico.go.kr</td>
                  </tr>
                  <tr>
                    <td>개인정보침해신고센터(KISA)</td>
                    <td>(국번없이) 118</td>
                    <td>privacy.kisa.or.kr</td>
                  </tr>
                  <tr>
                    <td>대검찰청 사이버수사과</td>
                    <td>(국번없이) 1301</td>
                    <td>spo.go.kr</td>
                  </tr>
                  <tr>
                    <td>경찰청 사이버수사국</td>
                    <td>(국번없이) 182</td>
                    <td>ecrm.cyber.go.kr</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-mute">
              「개인정보 보호법」 제35조(개인정보의 열람), 제36조(개인정보의
              정정·삭제), 제37조(개인정보의 처리정지 등)의 규정에 의한
              요구에 대하여 공공기관의 장이 행한 처분 또는 부작위로 인하여
              권리 또는 이익의 침해를 받은 자는 행정심판법이 정하는 바에
              따라 행정심판을 청구할 수 있습니다.
            </p>
          </section>

          <section>
            <h2>제12조 (처리방침의 변경)</h2>
            <ol>
              <li>본 처리방침은 {EFFECTIVE_DATE}부터 적용됩니다.</li>
              <li>
                본 처리방침의 내용 추가, 삭제 및 수정이 있을 경우에는
                변경사항의 시행 7일 전부터 본 사이트의 공지사항을 통하여
                안내드립니다. 다만, 이용자의 권리에 중요한 변경이 있는
                경우에는 30일 전에 안내합니다.
              </li>
            </ol>
          </section>

          <hr className="my-10 border-line" />

          <section>
            <h2>사업자 정보</h2>
            <ul>
              <li>상호: {COMPANY}</li>
              <li>대표자: {REPRESENTATIVE}</li>
              <li>사업자등록번호: {BIZ_REG_NO}</li>
              <li>통신판매업신고번호: {TS_NO}</li>
              <li>주소: {ADDRESS}</li>
              <li>전화: {PHONE}</li>
              <li>
                이메일:{' '}
                <a href={`mailto:${DPO_EMAIL}`}>{DPO_EMAIL}</a>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </main>
  )
}
