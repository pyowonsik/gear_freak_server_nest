# 추가 발견 이슈 보고서

Serverpod 원본과 NestJS 마이그레이션 심층 비교

작성일: 2026-01-07

---

## Critical Issues (즉시 수정 필요)

### 1. 데이터베이스 인덱스 전부 누락 ⚠️⚠️⚠️

**영향:** 성능 심각한 저하 (특히 채팅, 상품 검색)

**현재 상태:** TypeORM entity에 **인덱스가 하나도 없음**

```bash
# 확인 결과
$ grep -r "@Index" src --include="*.entity.ts"
(결과 없음)
```

#### 누락된 인덱스 목록

**Product**
```yaml
# Serverpod 원본
indexes:
  seller_id_idx:
    fields: sellerId
  category_idx:
    fields: category
  created_at_idx:
    fields: createdAt
```

**ChatRoom**
```yaml
indexes:
  product_id_idx:
    fields: productId
  last_activity_idx:
    fields: lastActivityAt
  chat_room_type_idx:
    fields: chatRoomType
```

**ChatMessage**
```yaml
indexes:
  chat_room_messages_idx:
    fields: chatRoomId, createdAt  # 복합 인덱스!
  sender_messages_idx:
    fields: senderId, createdAt    # 복합 인덱스!
  message_type_idx:
    fields: messageType
```

**ChatParticipant**
```yaml
indexes:
  active_participants_idx:
    fields: chatRoomId, isActive
  user_participations_idx:
    fields: userId, isActive
```

**Notification**
```yaml
indexes:
  user_notifications_idx:
    fields: userId, createdAt
  user_unread_idx:
    fields: userId, isRead
  notification_type_idx:
    fields: notificationType
```

**ProductReport**
```yaml
indexes:
  product_reports_idx:
    fields: productId, createdAt
  reporter_reports_idx:
    fields: reporterId, createdAt
  status_idx:
    fields: status, createdAt
```

**TransactionReview**
```yaml
indexes:
  product_reviews_idx:
    fields: productId
  reviewee_reviews_idx:
    fields: revieweeId
  reviewer_reviews_idx:
    fields: reviewerId
  review_created_at_idx:
    fields: createdAt
```

#### 수정 방법

```typescript
// ✅ Product entity에 추가
import { Entity, Column, Index } from 'typeorm';

@Entity()
@Index(['sellerId'])
@Index(['category'])
@Index(['createdAt'])
export class Product extends BaseTable {
  // ...
}

// ✅ ChatMessage entity에 추가
@Entity()
@Index(['chatRoomId', 'createdAt'])  // 복합 인덱스
@Index(['senderId', 'createdAt'])    // 복합 인덱스
@Index(['messageType'])
export class ChatMessage extends BaseTable {
  // ...
}
```

**성능 영향:**
- 채팅 메시지 조회: O(n) → O(log n)
- 상품 검색: 전체 테이블 스캔 → 인덱스 스캔
- 알림 조회: 심각한 성능 저하 → 빠른 조회

---

### 2. API 엔드포인트 누락 (10개 이상)

**영향:** Flutter 클라이언트가 호출할 API가 없음

| Serverpod 엔드포인트 | NestJS 구현 여부 | 필요성 |
|---------------------|----------------|--------|
| **Chat** |  |  |
| getChatRoomsByProductId | ❌ 없음 | High - 상품별 채팅방 목록 |
| getUserChatRoomsByProductId | ❌ 없음 | High - 유저의 상품별 채팅방 |
| joinChatRoom | ❌ 없음 | Medium - 채팅방 입장 (WebSocket이 대체?) |
| leaveChatRoom | ❌ 없음 | Medium - 채팅방 퇴장 |
| getChatParticipants | ❌ 없음 | Low - 참여자 목록 |
| getLastMessageByChatRoomId | ❌ 없음 | High - 마지막 메시지 (목록 UI) |
| generateChatRoomImageUploadUrl | ❌ 없음 | High - 채팅 이미지 업로드 |
| updateChatRoomNotification | ❌ 없음 | Medium - 채팅방 알림 설정 |
| **Product** |  |  |
| getProductStatsByUserId | ❌ 없음 | Medium - 다른 유저 통계 |
| **Review** |  |  |
| createSellerReview | ❌ 없음 | High - 판매자가 구매자 리뷰 |
| deleteReviewsByProductId | ❌ 없음 | Low - 상품 삭제 시 자동 (CASCADE) |
| **User** |  |  |
| getUserScopes | ❌ 없음 | Low - 권한 관리 (미구현) |

#### High Priority (즉시 구현 필요)

```typescript
// ✅ chat.controller.ts에 추가
@Get('product/:productId/rooms')
async getChatRoomsByProductId(
  @Param('productId', ParseIntPipe) productId: number,
  @UserId() userId?: number,
): Promise<ChatRoomResponseDto[]> {
  // 상품에 대한 모든 채팅방 (관리자용)
}

@Get('product/:productId/my-rooms')
async getUserChatRoomsByProductId(
  @UserId() userId: number,
  @Param('productId', ParseIntPipe) productId: number,
): Promise<ChatRoomResponseDto[]> {
  // 내가 참여한 상품별 채팅방
}

@Get('room/:id/last-message')
async getLastMessage(
  @Param('id', ParseIntPipe) chatRoomId: number,
): Promise<ChatMessageResponseDto> {
  // 마지막 메시지 (채팅방 목록에서 미리보기용)
}

@Post('room/:id/upload-url')
async generateChatRoomImageUploadUrl(
  @UserId() userId: number,
  @Param('id', ParseIntPipe) chatRoomId: number,
  @Body() dto: GeneratePresignedUrlDto,
): Promise<PresignedUrlResponseDto> {
  // 채팅 이미지 업로드 URL
}

// ✅ review.controller.ts에 추가
@Post('seller')
async createSellerReview(
  @UserId() userId: number,
  @Body() dto: CreateReviewDto,
): Promise<ReviewResponseDto> {
  // 판매자가 구매자에게 리뷰 작성
}

// ✅ product.controller.ts에 추가
@Get('stats/:userId')
async getProductStatsByUserId(
  @Param('userId', ParseIntPipe) userId: number,
): Promise<ProductStatsDto> {
  // 특정 유저의 상품 통계
}
```

---

### 3. User 엔티티 구조 불일치

**영향:** 인증 방식 다름

| Serverpod (원본) | NestJS (현재) |
|------------------|---------------|
| auth 모듈 사용 (module:auth:UserInfo) | 직접 구현 (socialId, socialProvider) |
| userInfoId로 auth 연결 | socialId + socialProvider 컬럼 |

**Serverpod 원본:**
```yaml
# user.spy.yaml
fields:
  userInfo: module:auth:UserInfo?, relation  # auth 모듈 사용
  nickname: String?
  # ... socialId, socialProvider 없음
```

**NestJS 현재:**
```typescript
// user.entity.ts
@Column({ unique: true })
socialId: string;  // 직접 관리

@Column({ type: 'enum', enum: SocialProvider })
socialProvider: SocialProvider;

// userInfo 관계 없음
```

**평가:**
- ✅ NestJS 방식이 더 간단하고 명확함
- ✅ Serverpod의 auth 모듈은 복잡도 증가
- 유지 권장, 하지만 **문서화 필수**

---

## High Priority Issues

### 4. Cascade 설정 불완전

**영향:** User 삭제 시 orphan 데이터 발생 가능

#### Favorite - User 관계에 Cascade 없음

```typescript
// ❌ 현재 (user.entity.ts에서)
@ManyToOne(() => User)  // cascade 없음!
@JoinColumn({ name: 'userId' })
user: User;
```

**문제:**
- User 삭제 시 Favorite 레코드가 남아있음
- Foreign Key constraint 위반 가능

**수정 필요:**
```typescript
// ✅ 옵션 1: Cascade 삭제
@ManyToOne(() => User, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'userId' })
user: User;

// ✅ 옵션 2: SET NULL (userId를 nullable로 변경)
@ManyToOne(() => User, { onDelete: 'SET NULL' })
@JoinColumn({ name: 'userId' })
user: User;
```

#### 같은 문제가 있는 Entity들

- `ProductView` - User 관계
- `ProductReport` - reporter 관계
- `ChatParticipant` - User 관계
- `Notification` - User 관계
- `TransactionReview` - reviewer, reviewee 관계

**권장:**
- User 삭제 시 관련 데이터를 모두 CASCADE 삭제
- 또는 `withdrawalDate`만 설정하고 실제 삭제는 하지 않음 (Soft Delete)

---

### 5. Default 값 불일치

**ChatParticipant**
```typescript
// ❌ 현재
@Column({ default: true })
isActive: boolean;

@Column({ default: true })  // ← Serverpod는 기본값 없음
isNotificationEnabled: boolean;
```

**Serverpod 원본:**
```yaml
isActive: bool  # default 없음
isNotificationEnabled: bool  # default 없음
```

**평가:**
- 기본값은 비즈니스 로직에 따라 다를 수 있음
- NestJS에서 `default: true`는 합리적 (신규 참여자는 활성)
- 문서화만 하면 OK

---

## Medium Priority Issues

### 6. DTO Validation 누락 가능성

**확인 필요:**
- ChatMessage에서 content와 attachmentUrl 중 하나는 필수
- Review rating은 1~5 범위

```typescript
// ✅ 추가 필요
export class SendMessageDto {
  @ValidateIf(o => !o.attachmentUrl)
  @IsNotEmpty()
  content?: string;

  @ValidateIf(o => !o.content)
  @IsNotEmpty()
  attachmentUrl?: string;
}

export class CreateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
```

---

### 7. Serverpod Auth 모듈 미구현

**Serverpod 원본:**
```
module:auth:UserInfo
```

**NestJS:**
- 자체 JWT 인증 구현
- SocialProvider enum으로 대체

**평가:**
- ✅ 자체 구현이 더 유연함
- 유지 권장

---

## 전체 이슈 요약

### P0 - Critical (Blocker)
1. ✅ **Enum 값 불일치** (6개) - SCHEMA_MISMATCH.md 참고
2. ✅ **TypeORM `$ne` 문법 오류** - CODE_REVIEW.md 참고
3. ✅ **TransactionReview 필드** - SCHEMA_MISMATCH.md 참고
4. ✅ **ChatMessage 필드** - SCHEMA_MISMATCH.md 참고
5. ⚠️ **DB 인덱스 전부 누락** ← 신규 발견
6. ⚠️ **API 엔드포인트 10개 누락** ← 신규 발견

### P1 - High
1. ✅ **AuthGuard 보안** - CODE_REVIEW.md 참고
2. ✅ **Apple 토큰 검증** - CODE_REVIEW.md 참고
3. ✅ **FcmToken Unique** - SCHEMA_MISMATCH.md 참고
4. ✅ **ProductReport processNote** - SCHEMA_MISMATCH.md 참고
5. ⚠️ **Cascade 설정** ← 신규 발견

### P2 - Medium
1. 타입 안정성 (`any` 제거)
2. 환경변수 필수값 처리
3. Default 값 차이 (문서화)
4. DTO Validation 보완

### P3 - Low
1. N+1 쿼리 최적화
2. TransactionInterceptor 개선

---

## 수정 작업 순서

### Phase 1: 데이터 모델 수정 (P0)
1. Enum 값 수정 (6개)
2. TransactionReview 수정
3. ChatMessage 수정
4. FcmToken Unique 수정
5. **DB 인덱스 추가** (모든 entity)

### Phase 2: API 구현 (P0-P1)
1. TypeORM `$ne` → `Not()` 수정
2. 누락된 엔드포인트 10개 구현
3. Cascade 설정 추가

### Phase 3: 보안 (P1)
1. AuthGuard 에러 처리
2. Apple 토큰 서명 검증

### Phase 4: 개선 (P2-P3)
1. 타입 안정성
2. DTO Validation
3. 성능 최적화

### Phase 5: 데이터베이스 마이그레이션
1. 마이그레이션 파일 생성
2. 테스트 DB에서 검증
3. Production 적용

---

## 예상 작업 시간

- Phase 1 (데이터 모델): 2-3시간
- Phase 2 (API): 3-4시간
- Phase 3 (보안): 2-3시간
- Phase 4 (개선): 2-3시간
- Phase 5 (마이그레이션): 1-2시간

**총 예상:** 10-15시간

---

## 관련 문서

- `CODE_REVIEW.md` - 코드 품질 이슈
- `SCHEMA_MISMATCH.md` - Schema 불일치 상세
- `ADDITIONAL_ISSUES.md` - 이 문서

---

**작성일:** 2026-01-07
**최종 업데이트:** 2026-01-07
