# Gear Freak NestJS 코드 리뷰

마이그레이션 날짜: 2026-01-07
리뷰어: Claude Code

---

## 목차
1. [전체 평가](#전체-평가)
2. [Critical 이슈 (즉시 수정 필요)](#critical-이슈-즉시-수정-필요)
3. [High Priority 이슈](#high-priority-이슈)
4. [Medium Priority 이슈](#medium-priority-이슈)
5. [Low Priority 개선사항](#low-priority-개선사항)
6. [잘 된 부분](#잘-된-부분)

---

## 전체 평가

| 항목 | 평가 | 비고 |
|------|------|------|
| 아키텍처 | ⭐⭐⭐⭐ | 모듈 분리 잘 됨 |
| TypeORM 사용 | ⭐⭐⭐ | Repository 패턴 적절하나 일부 문법 오류 |
| 트랜잭션 처리 | ⭐⭐⭐ | Interceptor 패턴 사용, 개선 여지 있음 |
| DTO 검증 | ⭐⭐⭐⭐ | class-validator 적절히 활용 |
| 에러 핸들링 | ⭐⭐⭐ | NestJS Exception 사용, 일부 개선 필요 |
| 타입 안정성 | ⭐⭐ | any 타입 사용, enum 불일치 |
| 보안 | ⭐⭐ | 토큰 검증 미흡 |
| 성능 | ⭐⭐⭐ | N+1 쿼리 이슈 존재 |
| 문서화 | ⭐⭐⭐⭐ | Swagger 준비 완료 |

**종합 평가:** ⭐⭐⭐ (3/5)
- 기본적인 구조는 잘 잡혀있으나, **데이터 모델 불일치** 및 **보안 이슈** 해결 필요

---

## Critical 이슈 (즉시 수정 필요)

### 1. Enum 값 불일치 (P0 - Blocker)

**영향:** Flutter 클라이언트와 데이터 불일치 → 앱 작동 불가

#### 1.1 ProductCategory - 완전히 다름
**파일:** `src/product/entity/product.entity.ts`

```typescript
// ❌ 현재 (잘못됨)
export enum ProductCategory {
  running = 'running',
  cycling = 'cycling',
  swimming = 'swimming',
  fitness = 'fitness',
  golf = 'golf',
  outdoor = 'outdoor',
  etc = 'etc',
}

// ✅ 수정 필요 (Serverpod 원본)
export enum ProductCategory {
  equipment = 'equipment',      // 운동 장비
  supplement = 'supplement',    // 보충제
  clothing = 'clothing',        // 운동복
  shoes = 'shoes',             // 운동화
  etc = 'etc',
}
```

#### 1.2 ProductCondition - 값 다름
**파일:** `src/product/entity/product.entity.ts`

```typescript
// ❌ 현재 (잘못됨)
export enum ProductCondition {
  new = 'new',
  likeNew = 'likeNew',
  good = 'good',
  fair = 'fair',
  poor = 'poor',
}

// ✅ 수정 필요 (Serverpod 원본)
export enum ProductCondition {
  brandNew = 'brandNew',           // 새 상품
  usedExcellent = 'usedExcellent', // 중고 최상
  usedGood = 'usedGood',           // 중고 좋음
  usedFair = 'usedFair',           // 중고 보통
}
```

#### 1.3 ChatRoomType - 값 다름
**파일:** `src/chat/entity/chat-room.entity.ts`

```typescript
// ❌ 현재
export enum ChatRoomType {
  oneToOne = 'oneToOne',
  group = 'group',
}

// ✅ 수정 필요
export enum ChatRoomType {
  direct = 'direct',  // 1:1 채팅
  group = 'group',
}
```

#### 1.4 MessageType - 값 다름
**파일:** `src/chat/entity/chat-message.entity.ts`

```typescript
// ❌ 현재
export enum MessageType {
  text = 'text',
  image = 'image',
  video = 'video',    // ← 잘못됨
  system = 'system',
}

// ✅ 수정 필요
export enum MessageType {
  text = 'text',
  image = 'image',
  file = 'file',      // ← 파일 전송
  system = 'system',
}
```

#### 1.5 ReportReason - 값 다름
**파일:** `src/product/entity/product-report.entity.ts`

```typescript
// ❌ 현재 (일부만 맞음)
export enum ReportReason {
  inappropriate = 'inappropriate',
  fraud = 'fraud',
  duplicate = 'duplicate',
  incorrectInfo = 'incorrectInfo',
  other = 'other',
}

// ✅ 수정 필요
export enum ReportReason {
  spam = 'spam',                    // 스팸/광고
  inappropriate = 'inappropriate',   // 부적절한 내용
  fake = 'fake',                    // 허위 정보
  prohibited = 'prohibited',        // 금지된 품목
  duplicate = 'duplicate',          // 중복 게시물
  other = 'other',                  // 기타
}
```

#### 1.6 ReportStatus - 값 다름
**파일:** `src/product/entity/product-report.entity.ts`

```typescript
// ❌ 현재
export enum ReportStatus {
  pending = 'pending',
  reviewed = 'reviewed',
  resolved = 'resolved',
  dismissed = 'dismissed',
}

// ✅ 수정 필요
export enum ReportStatus {
  pending = 'pending',       // 대기중
  processing = 'processing', // 처리중
  resolved = 'resolved',     // 처리완료 (신고 수용)
  rejected = 'rejected',     // 기각 (신고 거부)
}
```

---

### 2. TypeORM 문법 오류 (P0 - Bug)

**영향:** 쿼리 실행 실패 → 채팅 기능 작동 불가

**파일:** `src/chat/chat.service.ts`

#### 2.1 MongoDB 문법 사용 (PostgreSQL에서 작동 안 함)

```typescript
// ❌ 잘못된 코드 (Line 167, 183, 369, 375)
where: {
  chatRoomId,
  userId: { $ne: userId } as any,  // MongoDB 문법!
}

// ✅ 수정 필요
import { Not } from 'typeorm';

where: {
  chatRoomId,
  userId: Not(userId),
}
```

**발생 위치:**
- `getChatRoomById()` - Line 167, 183
- `getTotalUnreadChatCount()` - Line 369, 375

---

## High Priority 이슈

### 3. 보안 취약점 (P1)

#### 3.1 AuthGuard - 인증 실패 시 에러 미발생
**파일:** `src/common/guard/auth.guard.ts`

**문제점:** `false` 반환만 하면 403 Forbidden만 발생하고 정확한 에러 메시지가 없음

```typescript
// ❌ 현재
canActivate(context: ExecutionContext): boolean {
  const isPublic = this.reflector.get(Public, context.getHandler());
  if (isPublic) return true;

  const request = context.switchToHttp().getRequest();

  if (!request.user || request.user.type !== 'access') {
    return false;  // ← 단순히 false만 반환
  }

  return true;
}

// ✅ 수정 필요
canActivate(context: ExecutionContext): boolean {
  const isPublic = this.reflector.get(Public, context.getHandler());
  if (isPublic) return true;

  const request = context.switchToHttp().getRequest();

  if (!request.user) {
    throw new UnauthorizedException('인증 토큰이 필요합니다.');
  }

  if (request.user.type !== 'access') {
    throw new UnauthorizedException('유효하지 않은 토큰 타입입니다.');
  }

  return true;
}
```

#### 3.2 Apple 토큰 검증 - 서명 미검증
**파일:** `src/auth/auth.service.ts` (Line 239-257)

**문제점:** Apple ID Token의 서명을 검증하지 않고 decode만 함 → 위조된 토큰 허용 가능

```typescript
// ❌ 현재 (보안 취약)
private async verifyAppleToken(idToken: string): Promise<SocialUserInfo> {
  try {
    const decoded = this.jwtService.decode(idToken) as any;  // 서명 검증 없음!

    if (!decoded || !decoded.sub) {
      throw new UnauthorizedException('애플 토큰 검증에 실패했습니다.');
    }

    return {
      socialId: `apple_${decoded.sub}`,
      email: decoded.email,
      nickname: undefined,
      profileImageUrl: undefined,
    };
  } catch (error) {
    throw new UnauthorizedException('애플 토큰 검증에 실패했습니다.');
  }
}

// ✅ 수정 필요 - Apple 공개키로 서명 검증
// 참고: https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api/verifying_a_user
import { createPublicKey, createVerify } from 'crypto';
import axios from 'axios';

private async verifyAppleToken(idToken: string): Promise<SocialUserInfo> {
  try {
    // 1. Apple 공개키 가져오기
    const appleKeysResponse = await axios.get('https://appleid.apple.com/auth/keys');
    const keys = appleKeysResponse.data.keys;

    // 2. 토큰 헤더에서 kid 추출
    const header = JSON.parse(Buffer.from(idToken.split('.')[0], 'base64').toString());
    const key = keys.find((k: any) => k.kid === header.kid);

    if (!key) {
      throw new UnauthorizedException('유효하지 않은 Apple 토큰입니다.');
    }

    // 3. 공개키로 서명 검증
    const publicKey = createPublicKey({
      key: {
        kty: key.kty,
        n: key.n,
        e: key.e,
      },
      format: 'jwk',
    });

    // 4. JWT 검증 (iat, exp, aud, iss 등)
    const payload = await this.jwtService.verifyAsync(idToken, {
      publicKey,
      algorithms: ['RS256'],
      audience: this.configService.get('APPLE_CLIENT_ID'),
      issuer: 'https://appleid.apple.com',
    });

    return {
      socialId: `apple_${payload.sub}`,
      email: payload.email,
      nickname: undefined,
      profileImageUrl: undefined,
    };
  } catch (error) {
    throw new UnauthorizedException('애플 토큰 검증에 실패했습니다.');
  }
}
```

---

## Medium Priority 이슈

### 4. 타입 안정성 (P2)

#### 4.1 `any` 타입 사용
**파일:** `src/auth/auth.service.ts`

```typescript
// ❌ 현재 (Line 121-132)
async verifyBearerToken(
  token: string,
  isRefreshToken: boolean,
): Promise<any> {  // ← any 사용
  const secret = this.configService.get<string>(
    isRefreshToken
      ? envVariableKeys.refreshTokenSecret
      : envVariableKeys.accessTokenSecret,
  );

  return this.jwtService.verifyAsync(token, { secret });
}

// ✅ 수정 필요
export interface JwtPayload {
  sub: number;
  role: Role;
  socialId: string;
  type: 'access' | 'refresh';
}

async verifyBearerToken(
  token: string,
  isRefreshToken: boolean,
): Promise<JwtPayload> {
  const secret = this.configService.get<string>(
    isRefreshToken
      ? envVariableKeys.refreshTokenSecret
      : envVariableKeys.accessTokenSecret,
  );

  return this.jwtService.verifyAsync<JwtPayload>(token, { secret });
}
```

#### 4.2 Optional Nullable 처리
**파일:** `src/product/product.service.ts`

```typescript
// ❌ 현재 (Line 526-529)
seller: {
  id: product.seller?.id,        // undefined 가능
  nickname: product.seller?.nickname,
  profileImageUrl: product.seller?.profileImageUrl,
}

// ✅ 수정 필요 - 타입 명시
seller: {
  id: product.seller?.id ?? 0,
  nickname: product.seller?.nickname ?? '',
  profileImageUrl: product.seller?.profileImageUrl ?? null,
}
```

### 5. 환경변수 처리 (P2)

**파일:** `src/s3/s3.service.ts` (Line 27-41)

```typescript
// ❌ 현재 - undefined 가능
constructor(private readonly configService: ConfigService) {
  this.region = configService.get<string>(envVariableKeys.awsRegion) || 'ap-northeast-2';
  this.publicBucket = configService.get<string>(envVariableKeys.s3PublicBucket) || '';
  this.privateBucket = configService.get<string>(envVariableKeys.s3PrivateBucket) || '';

  this.s3Client = new S3Client({
    region: this.region,
    credentials: {
      accessKeyId: configService.get<string>(envVariableKeys.awsAccessKeyId) || '',
      secretAccessKey: configService.get<string>(envVariableKeys.awsSecretAccessKey) || '',
    },
  });
}

// ✅ 수정 필요 - 필수값은 getOrThrow 사용
constructor(private readonly configService: ConfigService) {
  // 필수값은 없으면 앱 시작 실패
  this.region = configService.getOrThrow<string>(envVariableKeys.awsRegion);
  this.publicBucket = configService.getOrThrow<string>(envVariableKeys.s3PublicBucket);
  this.privateBucket = configService.getOrThrow<string>(envVariableKeys.s3PrivateBucket);

  this.s3Client = new S3Client({
    region: this.region,
    credentials: {
      accessKeyId: configService.getOrThrow<string>(envVariableKeys.awsAccessKeyId),
      secretAccessKey: configService.getOrThrow<string>(envVariableKeys.awsSecretAccessKey),
    },
  });
}
```

---

## Low Priority 개선사항

### 6. 성능 최적화 (P3)

#### 6.1 N+1 쿼리 문제
**파일:** `src/chat/chat.service.ts` (Line 356-383)

**문제점:** 채팅방마다 반복해서 쿼리 실행

```typescript
// ❌ 현재 - N+1 쿼리
async getTotalUnreadChatCount(userId: number): Promise<number> {
  const participants = await this.participantRepository.find({
    where: { userId, isActive: true },
  });

  let totalUnread = 0;

  for (const participant of participants) {  // ← 반복문에서 쿼리 실행
    const unreadCount = participant.lastReadMessageId
      ? await this.messageRepository.count({  // ← 매번 DB 호출!
          where: {
            chatRoomId: participant.chatRoomId,
            id: MoreThan(participant.lastReadMessageId),
            senderId: { $ne: userId } as any,
          },
        })
      : await this.messageRepository.count({
          where: {
            chatRoomId: participant.chatRoomId,
            senderId: { $ne: userId } as any,
          },
        });

    totalUnread += unreadCount;
  }

  return totalUnread;
}

// ✅ 개선 - 단일 쿼리로 변경
async getTotalUnreadChatCount(userId: number): Promise<number> {
  const participants = await this.participantRepository.find({
    where: { userId, isActive: true },
  });

  if (participants.length === 0) return 0;

  const chatRoomIds = participants.map(p => p.chatRoomId);

  // 단일 쿼리로 모든 채팅방의 읽지 않은 메시지 집계
  const result = await this.messageRepository
    .createQueryBuilder('m')
    .select('m.chatRoomId', 'chatRoomId')
    .addSelect('COUNT(*)', 'count')
    .where('m.chatRoomId IN (:...chatRoomIds)', { chatRoomIds })
    .andWhere('m.senderId != :userId', { userId })
    .andWhere(qb => {
      const subQuery = qb.subQuery()
        .select('p.lastReadMessageId')
        .from(ChatParticipant, 'p')
        .where('p.chatRoomId = m.chatRoomId')
        .andWhere('p.userId = :userId')
        .getQuery();
      return 'm.id > COALESCE((' + subQuery + '), 0)';
    })
    .groupBy('m.chatRoomId')
    .getRawMany();

  return result.reduce((sum, row) => sum + parseInt(row.count, 10), 0);
}
```

### 7. TransactionInterceptor 개선 (P3)

**파일:** `src/common/interceptor/transaction.interceptor.ts`

**문제점:** Observable과 async 혼용

```typescript
// ❌ 현재
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {  // ← async + Observable 혼용
    const request = context.switchToHttp().getRequest();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    request.queryRunner = queryRunner;

    return next.handle().pipe(
      catchError(async (e) => {  // ← async in pipe
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        throw e;
      }),
      tap(async () => {  // ← async in pipe
        await queryRunner.commitTransaction();
        await queryRunner.release();
      }),
    );
  }
}

// ✅ 개선 - from/lastValueFrom 사용
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from, mergeMap } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();

    return from(this.setupTransaction(request)).pipe(
      mergeMap(() => next.handle()),
      mergeMap(async (data) => {
        await this.commitTransaction(request.queryRunner);
        return data;
      }),
      catchError(async (error) => {
        await this.rollbackTransaction(request.queryRunner);
        throw error;
      }),
    );
  }

  private async setupTransaction(request: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    request.queryRunner = queryRunner;
  }

  private async commitTransaction(queryRunner: any) {
    await queryRunner.commitTransaction();
    await queryRunner.release();
  }

  private async rollbackTransaction(queryRunner: any) {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  }
}
```

### 8. 에러 메시지 다국어 처리 (P3)

현재 모든 에러 메시지가 한국어로 하드코딩되어 있음. 향후 글로벌 서비스 시 i18n 적용 필요.

```typescript
// 현재
throw new NotFoundException('상품을 찾을 수 없습니다.');

// 향후 개선 (i18n)
throw new NotFoundException(this.i18n.t('product.notFound'));
```

---

## 잘 된 부분

### ✅ 아키텍처
- 모듈별로 명확하게 분리 (auth, user, product, chat, etc.)
- 각 모듈이 독립적으로 작동
- DI(Dependency Injection) 잘 활용

### ✅ TypeORM 패턴
- Repository 패턴 일관되게 사용
- Entity 관계 설정 적절 (ManyToOne, OneToMany)
- QueryBuilder 활용으로 복잡한 쿼리 처리

### ✅ DTO 검증
- class-validator 데코레이터 적절히 사용
- Swagger 문서화 준비 완료 (@ApiProperty)
- Request/Response DTO 분리

### ✅ Custom Decorator 활용
- `@UserId()` - JWT에서 유저 ID 추출
- `@Public()` - 인증 제외 라우트 표시
- `@QueryRunner()` - 트랜잭션 지원
- `@RBAC()` - 역할 기반 접근 제어

### ✅ 트랜잭션 처리
- TransactionInterceptor로 일관된 트랜잭션 관리
- 필요한 곳에만 적용 (@UseInterceptors)
- 에러 발생 시 자동 롤백

### ✅ Global Guard/Filter
- APP_GUARD로 전역 인증/인가 처리
- APP_FILTER로 일관된 에러 응답
- Exclude 패턴으로 예외 처리

### ✅ 환경 설정
- ConfigModule + Joi로 환경변수 검증
- .env.example 제공
- 타입 안전성 확보 (envVariableKeys)

### ✅ WebSocket 구현
- Socket.io 적절히 통합
- 인증 처리 완료 (handshake token)
- 채팅방 기반 메시징

---

## 수정 우선순위 요약

| 우선순위 | 항목 | 파일 | 영향도 | 이유 |
|---------|------|------|--------|------|
| **P0** | Enum 값 불일치 | product.entity.ts, chat-*.entity.ts, product-report.entity.ts | Critical | Flutter 클라이언트와 데이터 불일치 → 앱 작동 불가 |
| **P0** | TypeORM `$ne` 문법 오류 | chat.service.ts | Critical | PostgreSQL에서 작동 안 함 → 채팅 기능 불가 |
| **P1** | AuthGuard 에러 처리 | auth.guard.ts | High | 보안 및 디버깅 |
| **P1** | Apple 토큰 서명 검증 | auth.service.ts | High | 보안 취약점 |
| **P2** | 타입 안정성 개선 | auth.service.ts, *.service.ts | Medium | 유지보수성 |
| **P2** | 환경변수 필수값 처리 | s3.service.ts | Medium | 런타임 에러 방지 |
| **P3** | N+1 쿼리 최적화 | chat.service.ts | Low | 성능 (채팅방 많을 때) |
| **P3** | TransactionInterceptor 개선 | transaction.interceptor.ts | Low | 코드 품질 |

---

## 다음 단계

1. **P0 이슈 수정** (Blocker)
   - [ ] Enum 값 모두 Serverpod 원본에 맞게 수정
   - [ ] TypeORM `$ne` → `Not()` 변경
   - [ ] 빌드 확인
   - [ ] 마이그레이션 재생성 필요

2. **P1 보안 이슈 수정**
   - [ ] AuthGuard 에러 처리 개선
   - [ ] Apple 토큰 서명 검증 구현

3. **테스트**
   - [ ] 단위 테스트 작성 (AuthService, ProductService, ChatService)
   - [ ] E2E 테스트 작성
   - [ ] Postman/Insomnia 컬렉션 작성

4. **문서화**
   - [ ] Swagger 완성 (모든 엔드포인트)
   - [ ] README.md 업데이트 (실행 방법, API 문서 링크)
   - [ ] 환경 변수 설명

5. **배포 준비**
   - [ ] Docker Compose 설정
   - [ ] CI/CD 파이프라인
   - [ ] 로깅/모니터링 설정

---

## 참고 자료

- [NestJS 공식 문서](https://docs.nestjs.com/)
- [TypeORM 공식 문서](https://typeorm.io/)
- [Apple Sign In 검증](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api/verifying_a_user)
- [Serverpod 원본 코드](../gear_freak/gear_freak_server)

---

**작성일:** 2026-01-07
**마지막 업데이트:** 2026-01-07
