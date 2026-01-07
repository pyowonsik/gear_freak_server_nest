# 최종 발견 이슈 (Production 준비 관련)

마지막 심층 검토 결과

작성일: 2026-01-07

---

## 🚨 Security Issues (보안)

### 1. CORS 완전 개방 ⚠️

**파일:** `src/main.ts`

```typescript
// ❌ 현재 - 모든 도메인 허용
app.enableCors({
  origin: '*',
  credentials: true,
});

// ✅ 수정 필요
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

**영향:** CSRF 공격 가능성

---

### 2. Rate Limiting 없음 ⚠️

**현재:** API 호출 제한 없음
**영향:** DDoS 공격, Brute Force 공격 취약

```bash
# 필요한 패키지
pnpm add @nestjs/throttler
```

```typescript
// ✅ app.module.ts에 추가
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
})
```

**적용 필요 엔드포인트:**
- 로그인: 5회/분
- 회원가입: 3회/시간
- 비밀번호 재설정: 3회/시간

---

### 3. Helmet 미적용

**현재:** HTTP 보안 헤더 없음

```bash
pnpm add helmet
```

```typescript
// ✅ main.ts에 추가
import helmet from 'helmet';

app.use(helmet());
```

---

### 4. Logger 설정 문제

**파일:** `src/main.ts`

```typescript
// ❌ 현재 - 프로덕션에서도 verbose
const app = await NestFactory.create(AppModule, {
  logger: ['verbose'],
});

// ✅ 수정
const app = await NestFactory.create(AppModule, {
  logger: process.env.NODE_ENV === 'production'
    ? ['error', 'warn']
    : ['verbose'],
});
```

---

## 📦 Missing Features

### 5. Database Migrations 미구성 ⚠️⚠️

**현재 상태:**
- ✅ synchronize: true (개발 환경)
- ❌ migrations 폴더 없음
- ❌ migration 스크립트 없음

**문제:**
- 프로덕션에서 synchronize: true는 **절대 금지**
- 스키마 변경 추적 불가
- 롤백 불가

**해결:**
```bash
# 1. migrations 폴더 생성
mkdir -p src/migrations

# 2. package.json에 스크립트 추가
"scripts": {
  "migration:generate": "typeorm migration:generate -d src/data-source.ts",
  "migration:create": "typeorm migration:create",
  "migration:run": "typeorm migration:run -d src/data-source.ts",
  "migration:revert": "typeorm migration:revert -d src/data-source.ts"
}

# 3. data-source.ts 생성 (TypeORM CLI용)
```

**참고:** TypeORM 0.3.x 이상에서는 별도 DataSource 파일 필요

---

### 6. 관리자 기능 미구현

**Serverpod에 있지만 NestJS에 없는 기능:**

#### 6.1 ProductReport 처리 (관리자)
- `processProductReport()` - 신고 처리
- DTO: `ProcessProductReportRequestDto`

**필요 엔드포인트:**
```typescript
// ✅ product-report.controller.ts 생성 필요
@Patch('report/:id/process')
@RBAC(Role.admin)
async processReport(
  @UserId() adminId: number,
  @Param('id', ParseIntPipe) reportId: number,
  @Body() dto: ProcessProductReportDto,
): Promise<void> {
  // 관리자가 신고 처리
}
```

#### 6.2 User 관리 (관리자)
- 유저 차단/해제
- 탈퇴 처리

---

### 7. Redis 미구현

**현재:**
- 환경변수에만 정의됨 (`REDIS_HOST`, `REDIS_PORT`)
- 실제 사용 코드 없음

**Serverpod에서 Redis 용도:**
- 세션 관리
- 캐싱 (상품 목록, 조회수 등)

**선택사항:** 나중에 성능 최적화 시 추가

---

## 🔧 Code Quality Issues

### 8. Compression 미적용

**영향:** 네트워크 대역폭 낭비

```bash
pnpm add compression
```

```typescript
// ✅ main.ts에 추가
import compression from 'compression';

app.use(compression());
```

---

### 9. Request ID 추적 없음

**문제:** 로그 추적 어려움

```bash
pnpm add express-request-id
```

```typescript
// ✅ main.ts에 추가
import addRequestId from 'express-request-id';

app.use(addRequestId());
```

---

### 10. Health Check 엔드포인트 없음

**필요:**
- `GET /health` - 서버 상태
- `GET /health/db` - DB 연결 상태

```bash
pnpm add @nestjs/terminus
```

```typescript
// ✅ health.controller.ts
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}
```

---

## 📝 Documentation Issues

### 11. README.md 부실

**현재:** NestJS 기본 템플릿
**필요:**
- 프로젝트 소개
- 설치 방법
- 환경 변수 설명
- API 문서 링크
- 배포 가이드

---

### 12. API Response 일관성 없음

**문제:** 일부는 `{ message: string }`, 일부는 객체 직접 반환

**통일 필요:**
```typescript
// ✅ 모든 응답을 래핑
export class ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
```

---

## 전체 이슈 총정리

### Critical (P0) - 이미 발견됨
1. Enum 값 불일치 (6개)
2. TypeORM 문법 오류
3. TransactionReview 필드
4. ChatMessage 필드
5. DB 인덱스 전부 누락
6. API 엔드포인트 10개 누락

### High (P1)
1. AuthGuard 보안
2. Apple 토큰 검증
3. FcmToken Unique
4. ProductReport processNote
5. Cascade 설정
6. **CORS 완전 개방** ← 신규
7. **Rate Limiting 없음** ← 신규
8. **Migrations 미구성** ← 신규

### Medium (P2)
1. 타입 안정성
2. 환경변수 필수값
3. DTO Validation
4. **Helmet 미적용** ← 신규
5. **Logger 설정** ← 신규
6. **Compression 미적용** ← 신규

### Low (P3)
1. N+1 쿼리 최적화
2. TransactionInterceptor 개선
3. **관리자 기능 미구현** ← 신규
4. **Health Check 없음** ← 신규
5. **Request ID 추적 없음** ← 신규

---

## Production Checklist

배포 전 필수 체크리스트:

### Security
- [ ] CORS 도메인 제한
- [ ] Rate Limiting 적용
- [ ] Helmet 적용
- [ ] Environment variables validation
- [ ] Secrets 관리 (AWS Secrets Manager, Vault)

### Database
- [ ] Migrations 구성
- [ ] synchronize: false (프로덕션)
- [ ] Connection pooling 설정
- [ ] 백업 전략 수립

### Monitoring
- [ ] Logging (Winston, Pino)
- [ ] APM (Sentry, DataDog)
- [ ] Health Check 엔드포인트
- [ ] Metrics (Prometheus)

### Performance
- [ ] Compression 적용
- [ ] Caching (Redis)
- [ ] DB 인덱스 확인
- [ ] N+1 쿼리 제거

### Documentation
- [ ] README.md 업데이트
- [ ] API 문서 (Swagger)
- [ ] 배포 가이드
- [ ] 환경 변수 문서

---

## 최종 통계

| 카테고리 | 이슈 수 |
|---------|---------|
| Critical (P0) | 6개 |
| High (P1) | 8개 |
| Medium (P2) | 6개 |
| Low (P3) | 5개 |
| **총 이슈** | **25개** |

**예상 작업 시간:**
- P0 이슈: 5-6시간
- P1 이슈: 6-8시간
- P2 이슈: 3-4시간
- P3 이슈: 3-4시간
- **총 예상:** 17-22시간

---

## 관련 문서

1. **ISSUES_SUMMARY.md** - 전체 요약 (먼저 보세요)
2. **CODE_REVIEW.md** - 코드 품질 이슈
3. **SCHEMA_MISMATCH.md** - Schema 불일치
4. **ADDITIONAL_ISSUES.md** - 인덱스, API 누락
5. **FINAL_ISSUES.md** - 이 문서 (Production 준비)

---

**작성일:** 2026-01-07
**최종 체크:** 완료 ✅
**다음 단계:** P0, P1 이슈 수정 시작
