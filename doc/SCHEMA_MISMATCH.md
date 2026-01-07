# Schema 불일치 보고서

Serverpod 원본과 NestJS 마이그레이션 비교 결과

작성일: 2026-01-07

---

## Critical Issues (데이터 구조 불일치)

### 1. ChatParticipant - 읽음 처리 방식 다름 ⚠️

**영향:** 채팅 읽음 처리 로직이 완전히 다름

| Serverpod (원본) | NestJS (현재) |
|------------------|---------------|
| `lastReadAt: DateTime?` | `lastReadMessageId: number?` |
| 마지막 읽은 시간 저장 | 마지막 읽은 메시지 ID 저장 |

**Serverpod 원본:**
```yaml
# chat_participant.spy.yaml
fields:
  lastReadAt: DateTime?  # 마지막 읽은 시간
```

**NestJS 현재:**
```typescript
// chat-participant.entity.ts
@Column({ nullable: true })
lastReadMessageId: number;  // 메시지 ID
```

**비즈니스 로직 차이:**
- **Serverpod:** 시간 기반으로 읽음 처리 (그 시간 이전 메시지는 읽음)
- **NestJS:** 메시지 ID 기반으로 읽음 처리 (그 ID 이전 메시지는 읽음)

**평가:**
- ✅ NestJS 방식이 더 정확함 (시간 기반은 동시성 이슈 발생 가능)
- ✅ 기능적으로 NestJS 버전 유지 권장
- 📝 문서화 필요

---

### 2. TransactionReview - chatRoomId 필수/선택 불일치

**영향:** 리뷰 생성 시 chatRoomId 필수 여부 다름

| Serverpod (원본) | NestJS (현재) |
|------------------|---------------|
| `chatRoomId: int` (required) | `chatRoomId: number?` (nullable) |
| Unique: productId + chatRoomId + reviewerId + reviewType | Unique: productId + reviewerId + reviewType |
| rating: int (1~5) | rating: float |

**Serverpod 원본:**
```yaml
# transaction_review.spy.yaml
fields:
  chatRoomId: int, relation(parent=chat_room, onDelete=Cascade)  # 필수
  rating: int  # 정수
indexes:
  unique_review_idx:
    fields: productId, chatRoomId, reviewerId, reviewType
    unique: true
```

**NestJS 현재:**
```typescript
// transaction-review.entity.ts
@Column({ nullable: true })  // nullable!
chatRoomId: number;

@Column({ type: 'float' })  // float!
rating: number;

@Unique(['productId', 'reviewerId', 'reviewType'])  // chatRoomId 없음!
```

**문제점:**
1. **chatRoomId가 nullable이면** → 같은 상품에 대해 여러 리뷰 작성 가능 (동일 상품 구매 시)
2. **Unique index에서 chatRoomId 누락** → 같은 채팅방에서 여러 리뷰 작성 가능
3. **rating 타입 다름** → float는 불필요 (1~5 정수 평점)

**수정 필요:**
```typescript
// ✅ 수정
@Column()  // required
chatRoomId: number;

@Column({ type: 'int' })  // int
rating: number;

@Unique(['productId', 'chatRoomId', 'reviewerId', 'reviewType'])
```

---

### 3. ChatMessage - 첨부파일 필드 누락

**영향:** 파일 메타데이터 손실

| Serverpod (원본) | NestJS (현재) |
|------------------|---------------|
| `attachmentUrl: String?` | `mediaUrl: string?` |
| `attachmentName: String?` | ❌ 없음 |
| `attachmentSize: int?` | ❌ 없음 |
| `content: String` (required) | `content: text?` (nullable) |

**Serverpod 원본:**
```yaml
# chat_message.spy.yaml
fields:
  content: String  # 필수
  attachmentUrl: String?
  attachmentName: String?  # 파일 이름
  attachmentSize: int?     # 파일 크기 (bytes)
```

**NestJS 현재:**
```typescript
// chat-message.entity.ts
@Column('text', { nullable: true })  // nullable!
content: string;

@Column({ nullable: true })
mediaUrl: string;
// attachmentName, attachmentSize 없음!
```

**문제점:**
1. **content가 nullable** → 텍스트 없이 파일만 보내는 경우 고려?
2. **파일명, 크기 정보 누락** → UI에서 파일 정보 표시 불가

**수정 필요:**
```typescript
// ✅ 수정
@Column('text')  // required (이미지만 보낼 때도 빈 문자열)
content: string;

@Column({ nullable: true })
attachmentUrl: string;

@Column({ nullable: true })
attachmentName: string;

@Column({ nullable: true })
attachmentSize: number;

// mediaUrl 삭제하고 attachmentUrl 사용
```

---

## Medium Issues (필드 누락/차이)

### 4. ProductReport - processNote 필드 누락

**영향:** 관리자가 신고 처리 시 메모 작성 불가

**Serverpod 원본:**
```yaml
# product_report.spy.yaml
fields:
  processNote: String?  # 처리 메모 (관리자 메모)
  processedBy: int?, relation(parent=user)
  processedAt: DateTime?
```

**NestJS 현재:**
```typescript
// product-report.entity.ts
@Column({ nullable: true })
processedById: number;

@Column({ nullable: true })
processedAt: Date;

// ❌ processNote 없음
```

**수정 필요:**
```typescript
// ✅ 추가
@Column({ nullable: true })
processNote: string;
```

---

### 5. FcmToken - Unique Index 차이

**영향:** 동일 유저가 같은 토큰 여러 번 등록 가능

| Serverpod (원본) | NestJS (현재) |
|------------------|---------------|
| Unique: (userId, token) | Unique: token만 |
| deviceType: String? (nullable) | deviceType: enum (required) |

**Serverpod 원본:**
```yaml
# fcm_token.spy.yaml
fields:
  deviceType: String?  # nullable, string
indexes:
  user_id_token_unique_idx:
    fields: userId, token
    unique: true
```

**NestJS 현재:**
```typescript
// fcm-token.entity.ts
@Entity()
@Unique(['token'])  // token만 unique!
export class FcmToken extends BaseTable {
  @Column({ type: 'enum', enum: DeviceType })  // required, enum
  deviceType: DeviceType;
}
```

**문제점:**
1. **Unique index가 token만** → 다른 유저가 같은 토큰 사용 시 충돌
2. **deviceType이 required** → Serverpod는 nullable

**평가:**
- ⚠️ Unique index는 (userId, token) 조합으로 변경 필요
- ✅ deviceType enum은 타입 안정성 측면에서 NestJS 방식이 나음
- ✅ required로 해도 문제없음 (클라이언트가 항상 보냄)

**수정 필요:**
```typescript
// ✅ 수정
@Entity()
@Unique(['userId', 'token'])  // 조합 unique
export class FcmToken extends BaseTable {
  // deviceType은 enum + required 유지
}
```

---

### 6. ProductView - viewedAt 필드명 차이

**영향:** 의미 명확성

| Serverpod (원본) | NestJS (현재) |
|------------------|---------------|
| `viewedAt: DateTime?` | BaseTable의 `createdAt` 사용 |

**Serverpod 원본:**
```yaml
# product_view.spy.yaml
fields:
  viewedAt: DateTime?  # 조회일
```

**NestJS 현재:**
```typescript
// product-view.entity.ts
// viewedAt 필드 없음, BaseTable의 createdAt 사용
```

**평가:**
- ⚠️ 기능적으로는 동일하나 의미가 명확하지 않음
- 📝 `createdAt` = "조회 기록 생성일" = "조회일"이므로 작동은 함
- 선택사항: 명확성을 위해 `viewedAt` alias 추가 가능

**선택적 개선:**
```typescript
// ✅ 개선 (선택사항)
@Column()
viewedAt: Date;  // createdAt 대신 명확한 이름
```

---

### 7. Notification - data 타입 차이

**영향:** JSON 파싱 필요 여부

| Serverpod (원본) | NestJS (현재) |
|------------------|---------------|
| `data: String?` (JSON string) | `data: Record<string, any>` (simple-json) |
| - | `referenceId: number?` 추가 |
| - | `referenceType: string?` 추가 |

**Serverpod 원본:**
```yaml
# notification.spy.yaml
fields:
  data: String?  # JSON string
```

**NestJS 현재:**
```typescript
// notification.entity.ts
@Column('simple-json', { nullable: true })
data: Record<string, any>;  // TypeORM이 자동 파싱

@Column({ nullable: true })
referenceId: number;  // 추가됨

@Column({ nullable: true })
referenceType: string;  // 추가됨
```

**평가:**
- ✅ NestJS 방식이 더 좋음 (TypeORM이 자동 파싱)
- ✅ referenceId, referenceType 추가는 유용한 개선사항
- 유지 권장

---

## Minor Issues (Enum 값 불일치)

이미 CODE_REVIEW.md에 정리됨:
- ProductCategory
- ProductCondition
- ChatRoomType
- MessageType
- ReportReason
- ReportStatus

---

## 정리 및 우선순위

### P0 - Critical (즉시 수정 필요)

| 항목 | 파일 | 수정 내용 |
|------|------|----------|
| TransactionReview chatRoomId | transaction-review.entity.ts | nullable → required, Unique index 수정 |
| TransactionReview rating | transaction-review.entity.ts | float → int |
| ChatMessage 필드 | chat-message.entity.ts | content required, attachmentName/Size 추가 |

### P1 - High (빠른 수정 권장)

| 항목 | 파일 | 수정 내용 |
|------|------|----------|
| FcmToken Unique | fcm-token.entity.ts | Unique를 (userId, token) 조합으로 |
| ProductReport processNote | product-report.entity.ts | processNote 필드 추가 |
| Enum 값들 | 여러 entity | CODE_REVIEW.md 참고 |

### P2 - Medium (개선사항)

| 항목 | 파일 | 수정 내용 |
|------|------|----------|
| ChatParticipant | - | 문서화 (NestJS 방식 유지) |
| ProductView | product-view.entity.ts | viewedAt 별칭 추가 (선택) |
| Notification | - | 현재 방식 유지 (개선됨) |

---

## 다음 단계

1. **P0 수정** (TransactionReview, ChatMessage)
2. **P1 수정** (FcmToken, ProductReport, Enums)
3. **데이터베이스 마이그레이션 재생성**
4. **테스트**

---

**작성일:** 2026-01-07
