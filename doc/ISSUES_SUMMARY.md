# Gear Freak NestJS 마이그레이션 이슈 전체 요약

작성일: 2026-01-07

---

## 📋 문서 구조

본 프로젝트는 3개의 상세 이슈 문서로 구성됩니다:

1. **CODE_REVIEW.md** - 코드 품질, 보안, 성능 이슈
2. **SCHEMA_MISMATCH.md** - 데이터베이스 스키마 불일치
3. **ADDITIONAL_ISSUES.md** - DB 인덱스, API 엔드포인트 누락

이 문서는 **전체 이슈를 한눈에 파악**하기 위한 요약본입니다.

---

## 🚨 Critical Issues (P0) - 즉시 수정 필요

### 1. Enum 값 불일치 (6개)

**영향:** Flutter 클라이언트와 데이터 불일치 → 앱 작동 불가

| Enum | 상태 | 문서 |
|------|------|------|
| ProductCategory | ❌ 완전히 다름 | CODE_REVIEW.md |
| ProductCondition | ❌ 다름 | CODE_REVIEW.md |
| ChatRoomType | ❌ direct ↔ oneToOne | CODE_REVIEW.md |
| MessageType | ❌ file ↔ video | CODE_REVIEW.md |
| ReportReason | ❌ 일부 다름 | CODE_REVIEW.md |
| ReportStatus | ❌ 값 다름 | CODE_REVIEW.md |

### 2. TypeORM 문법 오류

**파일:** `chat.service.ts`
**문제:** MongoDB 문법 사용 (`$ne`)
**영향:** PostgreSQL에서 작동 안 함

```typescript
// ❌ 4곳에서 발생
senderId: { $ne: userId } as any

// ✅ 수정
import { Not } from 'typeorm';
senderId: Not(userId)
```

**참고:** CODE_REVIEW.md

### 3. TransactionReview 필드 문제

| 필드 | 현재 | 필요 |
|------|------|------|
| chatRoomId | nullable | required |
| rating | float | int |
| Unique index | productId + reviewerId + reviewType | productId + **chatRoomId** + reviewerId + reviewType |

**참고:** SCHEMA_MISMATCH.md

### 4. ChatMessage 필드 누락

| 필드 | 현재 | 필요 |
|------|------|------|
| content | nullable | required |
| attachmentName | ❌ 없음 | 추가 필요 |
| attachmentSize | ❌ 없음 | 추가 필요 |

**참고:** SCHEMA_MISMATCH.md

### 5. DB 인덱스 전부 누락 ⚠️⚠️⚠️

**현재 상태:** 인덱스 0개

**영향:** 심각한 성능 저하
- 채팅 메시지 조회: O(n) 전체 스캔
- 상품 검색: 전체 테이블 스캔
- 알림 조회: 느린 쿼리

**필요 인덱스:**
- Product: 3개 (sellerId, category, createdAt)
- ChatRoom: 3개
- ChatMessage: 3개 (복합 인덱스 포함)
- ChatParticipant: 2개
- Notification: 3개
- ProductReport: 3개
- TransactionReview: 4개

**참고:** ADDITIONAL_ISSUES.md

### 6. API 엔드포인트 10개 누락

**High Priority (즉시 구현):**
- `GET /chat/product/:productId/rooms` - 상품별 채팅방
- `GET /chat/product/:productId/my-rooms` - 내 채팅방
- `GET /chat/room/:id/last-message` - 마지막 메시지
- `POST /chat/room/:id/upload-url` - 채팅 이미지 업로드
- `POST /review/seller` - 판매자 리뷰 작성
- `GET /product/stats/:userId` - 유저 통계

**Medium Priority:**
- `POST /chat/room/:id/join` - 채팅방 입장
- `POST /chat/room/:id/leave` - 채팅방 퇴장
- `PATCH /chat/room/:id/notification` - 알림 설정

**참고:** ADDITIONAL_ISSUES.md

---

## ⚠️ High Priority Issues (P1)

### 7. AuthGuard 보안 취약점

**파일:** `auth.guard.ts`
**문제:** 인증 실패 시 명확한 에러 메시지 없음

```typescript
// ❌ 현재
if (!request.user) return false;

// ✅ 수정
if (!request.user) {
  throw new UnauthorizedException('인증 토큰이 필요합니다.');
}
```

**참고:** CODE_REVIEW.md

### 8. Apple 토큰 서명 미검증

**파일:** `auth.service.ts`
**문제:** decode만 하고 서명 검증 안 함
**영향:** 위조된 토큰 허용 가능

**참고:** CODE_REVIEW.md

### 9. FcmToken Unique Index 오류

```typescript
// ❌ 현재
@Unique(['token'])

// ✅ 수정
@Unique(['userId', 'token'])
```

**참고:** SCHEMA_MISMATCH.md

### 10. ProductReport processNote 누락

```typescript
// ✅ 추가
@Column({ nullable: true })
processNote: string;
```

**참고:** SCHEMA_MISMATCH.md

### 11. Cascade 설정 불완전

**영향:** User 삭제 시 orphan 데이터 발생

**문제 Entity:**
- Favorite
- ProductView
- ProductReport
- ChatParticipant
- Notification
- TransactionReview

**참고:** ADDITIONAL_ISSUES.md

---

## 📝 Medium Priority Issues (P2)

### 12. 타입 안정성 - `any` 사용

**파일:** `auth.service.ts`
```typescript
// ❌
async verifyBearerToken(...): Promise<any>

// ✅
async verifyBearerToken(...): Promise<JwtPayload>
```

**참고:** CODE_REVIEW.md

### 13. 환경변수 필수값 처리

**파일:** `s3.service.ts`
```typescript
// ❌
configService.get(...) || ''

// ✅
configService.getOrThrow(...)
```

**참고:** CODE_REVIEW.md

### 14. DTO Validation 보완

- ChatMessage: content OR attachmentUrl 중 하나 필수
- Review: rating 1~5 범위 검증

**참고:** ADDITIONAL_ISSUES.md

---

## 🔧 Low Priority Issues (P3)

### 15. N+1 쿼리 최적화

**파일:** `chat.service.ts` - `getTotalUnreadChatCount()`

**참고:** CODE_REVIEW.md

### 16. TransactionInterceptor 개선

**파일:** `transaction.interceptor.ts`
**문제:** Observable과 async 혼용

**참고:** CODE_REVIEW.md

---

## ✅ 잘 된 부분 (유지)

| 항목 | 평가 |
|------|------|
| ChatParticipant `lastReadMessageId` | Serverpod보다 정확함 (시간 기반 → ID 기반) |
| Notification `data` 타입 | TypeORM 자동 파싱 (String → Object) |
| Notification `referenceId/Type` | 추가 필드로 개선됨 |
| User 인증 구조 | 자체 구현이 더 간단함 |

---

## 📊 전체 통계

| 우선순위 | 이슈 수 | 예상 시간 |
|---------|---------|----------|
| P0 (Critical) | 6개 | 5-6시간 |
| P1 (High) | 5개 | 5-6시간 |
| P2 (Medium) | 3개 | 2-3시간 |
| P3 (Low) | 2개 | 2-3시간 |
| **총계** | **16개** | **14-18시간** |

---

## 🎯 수정 작업 순서

### Step 1: Enum 값 수정 (1시간)
- [ ] ProductCategory
- [ ] ProductCondition
- [ ] ChatRoomType
- [ ] MessageType
- [ ] ReportReason
- [ ] ReportStatus

### Step 2: Entity 필드 수정 (2시간)
- [ ] TransactionReview (chatRoomId, rating, unique)
- [ ] ChatMessage (content, attachment 필드들)
- [ ] FcmToken (unique index)
- [ ] ProductReport (processNote)

### Step 3: DB 인덱스 추가 (2-3시간)
- [ ] Product
- [ ] ChatRoom
- [ ] ChatMessage
- [ ] ChatParticipant
- [ ] Notification
- [ ] ProductReport
- [ ] TransactionReview

### Step 4: TypeORM 문법 수정 (30분)
- [ ] chat.service.ts - `$ne` → `Not()`

### Step 5: Cascade 설정 (1시간)
- [ ] Favorite
- [ ] ProductView
- [ ] ProductReport
- [ ] ChatParticipant
- [ ] Notification
- [ ] TransactionReview

### Step 6: API 엔드포인트 구현 (3-4시간)
- [ ] Chat 엔드포인트 6개
- [ ] Review 엔드포인트 1개
- [ ] Product 엔드포인트 1개

### Step 7: 보안 개선 (2-3시간)
- [ ] AuthGuard 에러 처리
- [ ] Apple 토큰 서명 검증

### Step 8: 타입 안정성 및 기타 (2-3시간)
- [ ] `any` → 구체적 타입
- [ ] 환경변수 필수값 처리
- [ ] DTO Validation 보완

### Step 9: 데이터베이스 마이그레이션 (1-2시간)
- [ ] 마이그레이션 파일 생성
- [ ] 테스트 DB 검증
- [ ] Production 적용

---

## 📚 관련 문서

| 문서 | 내용 |
|------|------|
| CODE_REVIEW.md | 코드 품질, 보안, 성능 이슈 |
| SCHEMA_MISMATCH.md | 데이터베이스 스키마 불일치 상세 |
| ADDITIONAL_ISSUES.md | DB 인덱스, API 엔드포인트 누락 |
| ISSUES_SUMMARY.md | 이 문서 - 전체 요약 |

---

## ⚡ Quick Start (수정 시작하기)

```bash
# 1. 브랜치 생성
git checkout -b fix/migration-issues

# 2. Enum 값 수정부터 시작
# src/product/entity/product.entity.ts
# src/chat/entity/chat-*.entity.ts
# src/product/entity/product-report.entity.ts

# 3. 빌드 확인
pnpm build

# 4. 마이그레이션 생성
pnpm migration:generate -- src/migrations/FixMigrationIssues

# 5. 커밋
git add .
git commit -m "fix: 마이그레이션 이슈 수정 (Enum, Entity 필드)"
```

---

**마지막 업데이트:** 2026-01-07
**작성자:** Claude Code
**리뷰 상태:** 초안 완료, 수정 대기
