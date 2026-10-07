# 진재원 202430131

👍 [Next.js 공식 문서](https://nextjs.org/docs) <br/>

## 2026.10.07 (Week 6)

### await이 없어도 async를 붙여 두는 이유

Next.js 13+의 App Router에서 page.tsx 같은 <u>Server Component는 비동기 렌더링을 전제</u>로 하고 있음.

즉, page.tsx 안에서 <u>데이터를 fetch하는 경우가 많기 때문에</u> async를 기본으로 붙여도 전혀 문제가 없음.

1. 일관성 유지: 같은 프로젝트 안에서 어떤 페이지는 async, 어떤 페이지는 일반 function이면 혼란스러울 수 있음. -> Next.js 공식 문서도 대부분 async function으로 예시를 작성함.

2. 확장성: 지금은 더미 데이터(`posts.find(...)`)를 쓰지만, <u>나중에 DB나 API에서 데이터를 가져올 때 await fetch(...) 같은 코드가 들어갈 수 있기 때문에</u>, 미리 async를 붙여 두면 수정할 필요가 없음.

3. React Server Component 호환성: Server Component는 Promise를 반환할 수 있어야하고, Next.js는 내부적으로 async 함수 패턴에 맞춰 최적화된 렌더링 파이프라인을 갖고 있어서 <u>async가 붙어 있어도 불필요한 오버헤드가 거의 없음.</u>

#### 2.3 느린 네트워크

- 네트워크가 느리거나 불안정한 경우, 링크를 클릭하기 전에 프리페칭이 완료되지 않을 수 있음.
- 이것은 정적 경로와 동적 경로 모두에 영향을 미칠 수 있음.
- 이 경우, loading.tsx 파일이 아직 프리페칭되지 않았기 때문에 즉시 표시되지 않을 수 있음.
- 체감 성능을 개선하기 위해 <u>useLinkStatus Hook을 사용</u>하여 전환이 진행되는 동안 사용자에게 인라인 시각적 피드백을 표시할 수 있음. (링크의 스피너 또는 텍스트 글리머)

```TypeScript
'use client'

import { useLinkStatus } from 'next/link'

export default function LoadingIndicator() {
  const { pending } = useLinkStatus()
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  )
}
```

#### 2.4 프리페칭 비활성화

- `<Link>` 컴포넌트에서 prefetch prop을 false로 설정하여 프리페칭을 사용하지 않도록 선택할 수 있음.

- 이는 대량의 링크 목록(예: 무한 스크롤 테이블)을 렌더링할 때 불필요한 리소스 사용을 방지하는데 유용함.

```TypeScript
<Link prefetch={false} href="/blog">
  Blog
</Link>
```

- 그러나 <u>프리페칭을 비활성화하면 다음과 같은 단점</u>이 있음.
- <u>정적 라우팅</u>은 사용자가 링크를 클릭할 때만 가져옴.
- <u>동적 라우팅</u>은 클라이언트가 해당 경로로 이동하기 전에 서버에서 먼저 렌더링 되어야 함.
- 프리페칭을 완전히 비활성화하지 않고 <u>리소스 사용량을 줄이려면</u>, <u>마우스 호버 시에만 프리페칭을 사용</u>하면 됨.
- 이렇게 하면 <u>뷰포트의 모든 링크가 아닌</u>, 사용자가 <u>방문할 가능성이 높은 경로로만 프리페칭이 제한</u>됨.

#### 2.5 Hydration이 완료되지 않음

- `<Link>`는 클라이언트 컴포넌트이기 때문에 라우팅 페이지를 <u>프리페칭하기 전에 하이드레이션해야</u> 함.
- 초기 방문 시 대용량 JS Bundle로 인해 <u>하이드레이션이 지연되어 프리페칭이 바로 시작되지 않을 수</u> 있음.
- React는 <u>선택적 Hydration을 통해 이를 완화</u>하며, 다음과 같은 방법으로 이를 더욱 개선할 수 있음.
- `@next/bundle-analyzer` 플러그인을 사용하면 대규모 종속성을 제거하여, <u>번들 크기를 식별하고 줄일 수</u> 있음.
- 가능하다면 클라이언트에서 서버로 로직을 이동할 것

### 1. Server && Client Component

- client 환경과 server 환경은 서로 다른 기능을 가지고 있음.
- server 및 client component를 사용하면 사용하는 사례에 따라 각각의 환경에서 필요한 로직을 실행할 수 있음.
- 다음과 같은 항목이 필요할 경우에는 client component를 사용함.
  - state 및 event handler -> `onClick`, `onChange`
  - LifeCycle logic -> `useEffect`
  - 브라우저 전용 API -> `localStorage`, `window`, `Navigator.geolocation` 등
  - 사용자 정의 Hook

- 다음과 같은 항목이 필요할 경우에는 server component를 사용
  - 서버의 데이터베이스 혹은 API에서 data를 가져오는 경우
  - API key, token 및 기타 보안 데이터를 client에 노출하지 않고 사용
  - 브라우저로 전송되는 JS의 양을 줄이고 싶을 때 사용
  - `콘텐츠가 포함된 첫 번째 페인트(First Contentful Paint-FCP)`를 개선하고, 콘텐츠를 client에 점진적으로 스트리밍

## 2026.09.30 (Week 5)

### 1. How navigation works (네비게이션 작동 방식)

- Server Rendering (서버 렌더링)
- Prefetching (프리페칭)
- Streaming (스트리밍)
- Client-side transitions (클라이언트 측 전환)

#### 1.1 Server Rendering

Next.js에서 레이아웃(layout)과 페이지(page)는 기본적으로 React 서버 컴포넌트.

서버 렌더링에는 <u>발생 시점에 따라 두 가지 유형</u>이 있음.

- <u>**정적 렌더링**</u>(사전 렌더링)은 <u>빌드 시점이나 재검증 중에 발생</u>, <u>결과는 캐시(cache)</u>됨.
- <u>**동적 렌더링**</u>은 클라이언트 요청에 대한 응답으로 <u>요청 시점에 발생함</u>.

<u>서버 렌더링의 단점</u>은 클라이언트가 새 경로를 표시하기 전에 <u>서버의 응답을 기다려야 한다는 것</u>임.

Next.js는 <u>사용자가 방문할 가능성이 높은 경로를 미리 가져 오고(prefetching)</u>, 클라이언트 측 전환<u>(client-side transitions)</u>을 수행하여 지연 문제를 해결함.

#### HTML is also generated for the initial visit. (최초 방문을 위해서 HTML이 생성됩니다.)

일반적인 React 앱은 CSR만 사용하며, 처음 페이지를 방문할 때는 빈 HTML + JavaScript 파일만 내려주고, 브라우저가 JS를 실행해야 화면이 렌더링됨.

Next.js에서는

- 사용자가 특정 URL을 처음 방문하면(initial visit) 서버가 해당 페이지의 HTML을 미리 생성해서 브라우저에 전달함.
- 따라서 브라우저는 JS 실행 전에도 즉시 보이는 HTML 뼈대 + 컨텐츠를 표시할 수 있음.
- 이후에 React가 하이드레이션(hydration) 과정을 거쳐 상호작용이 가능해짐.

즉, 초기 방문 시에도 HTML을 생성해서 내려주기에 사용자 경험(UX)이 좋아지고 SEO에도 유리하다는 의미.

#### 1.2 Prefetching

- 프리페칭은 사용자가 해당 경로로 이동하기 전에 백그라운드에서 해당 경로를 로드하는 프로세스.
- 사용자가 링크를 클릭하기 전에 다음 경로를 렌더링하는 데 필요한 데이터가 클라이언트 측에 이미 준비되어 있기 때문에 애플리케이션에서 경로 간 이동이 즉각적으로 느껴짐.
- Next.js는 `<Link>` 컴포넌트와 연결된 경로를 자동으로 사용자 뷰포트에 미리 가져옴.
- `<a>` tag를 사용하면 프리페칭을 하지 않음.

```TypeScript
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav>
          {/* Prefetched when the link is hovered or enters the viewport */}
          <Link href="/blog">Blog</Link>
          {/* No prefetching */}
          <a href="/contact">Contact</a>
        </nav>
        {children}
      </body>
    </html>
  )
}
```

<img src="https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Fdocs%2Fdark%2Fserver-rendering-without-streaming.png&w=3840&q=75">

경로의 <u>어느 정도를 프리페칭할지는 정적 경로인지 동적 경로인지에 따라</u> 달라짐.

- 정적 경로 : <u>전체 경로</u>가 프리페칭
- 동적 경로 : 프리페칭을 <u>건너뛰거나</u>, `loading.tsx`가 있는 경우 경로가 <u>부분적으로 프리페칭</u>

Next.js는 동적 라우팅을 건너뛰거나 부분적으로 프리페칭하는 방법으로 <u>사용자가 방문하지 않을 수도 있는 경로</u>에 대한 <u>서버의 불필요한 작업을 방지</u>함.

하지만 네비게이션 전에 서버 응답을 기다리면 <u>사용자에게 앱이 응답하지 않는다는 인상을 줄 수도</u> 있음.

동적 경로에 대한 <u>네비게이션 환경을 개선하려면 `스트리밍`</u>을 사용할 수 있음.

#### 1.3 Streaming

스트리밍을 사용하면 서버가 전체 경로가 렌더링될 때까지 기다리지 않고, 동적 경로의 일부가 준비되는 즉시 클라이언트에 전송할 수 있음.

즉, 페이지의 일부가 아직 로드 중이더라도 사용자는 더 빨리 컨텐츠를 볼 수 있음.

동적 경로의 경우, 부분적으로 미리 가져올 수 있다는 뜻임.

즉, 공유 레이아웃과 로딩 스켈레톤을 미리 요청할 수 있음.

loading skeletons의 의미는 웹 또는 앱에서 컨텐츠가 로드되는 동안 사용자에게 보여지는 빈 화면의 일종임.

<img src="https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Fdocs%2Fdark%2Fserver-rendering-with-streaming.png&w=3840&q=75">

스트리밍을 사용하려면 <u>라우팅 폴더에 `loading.tsx` 파일을 생성</u>
<img src="https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Fdocs%2Fdark%2Floading-special-file.png&w=3840&q=75">

```TypeScript
export default function Loading() {
  // Add fallback UI that will be shown while the route is loading.
  return <LoadingSkeleton />
}
```

Next.js는 내부적으로 page.tsx 컨텐츠를 `<Suspense>` 경계로 자동 래핑.

미리 가져온 <u>대체 UI는 경로가 로드되는 동안 표시</u>되고, 준비가 되면 <u>실제 컨텐츠로 대체</u>됨.

`<Suspense>` 컴포넌트를 사용하여 <u>중첩된 컴포넌트에 대한 로딩 UI를 만들 수도</u> 있음.

**loading.tsx의 이점**

- 사용자에게 <u>즉각적인 네비게이션과 시각적 피드백 제공</u>
- 공유 레이아웃은 <u>상호 작용 가능</u>, 네비게이션은 중단할 수 있음.
- 개선된 핵심 웹 핵심 지표: TTFB, FCP 및 TTI

네비게이션 환경을 더욱 개선하기 위해 Next.js는 <u>`<Link>` 컴포넌트를 사용하여 클라이언트 측 전환을 수행</u>함.

#### 1.4 Client-side transitions

일반적으로 서버 렌더링 페이지로 이동하면 전체 페이지가 로드됨.

- 이로 인해 state가 삭제되고, 스크롤 위치가 재설정되며, 상호작용이 차단됨.

Next.js는 `<Link>` 컴포넌트를 사용하는 클라이언트 측 전환을 통해 이를 방지함. 페이지를 다시 로딩하는 대신 다음과 같은 방법으로 컨텐츠를 동적으로 업데이트 함.

공유 레이아웃과 UI를 유지함.

현재 페이지를 미리 가져온(prefetching) 로딩 상태 또는 사용 가능한 경우 새 페이지로 바꿈.

클라이언트 측 전환은 서버에서 렌더링된 앱을 클라이언트에서 렌더링된 앱처럼 느껴지게 하는 요소

또한 프리페칭 및 스트리밍과 함께 사용하면 동적 경로에서도 빠른 전환 가능.

### 2. 전환을 느리게 만드는 요인

- Next.js는 <u>최적화를 통해 네비게이션 속도가 빠르게 반응성이 뛰어남.</u>
- 하지만 <u>특정 조건에서는 전환 속도가 여전히 느릴 수</u> 있음.
- 다음은 <u>몇 가지 일반적인 원인과 사용자 경험을 개선하는 방법</u>

#### 2-1 동적 경로 없는 loading.tsx

동적 경로로 이동할 때 클라이언트는 결과를 표시하기 전에 서버의 응답을 기다려야 함.

- 이로 인해 사용자는 앱이 응답하지 않는다는 인상을 받을 수 있음.

부분 프리페칭을 활성화하고, 즉시 네비게이션을 트리거하고, 경로가 렌더링되는 동안 로딩 UI를 표시하려면 동적 경로에 loading.tsx를 추가하는 것이 좋음.

```TypeScript
export default function Loading() {
  return <LoadingSkeleton />
}
```

#### 2.2 동적 세그먼트 없는 generateStaticParams

- 동적 세그먼트는 사전 렌더링 될 수 있지만, generateStaticParams가 누락되어 사전 렌더링되지 않는 경우, 해당 경로는 요청 시점에 동적 렌더링으로 대체됨.
- generateStaticParams를 추가하여 빌드 시점에 경로가 정적으로 생성되도록 할 수 있음.

```TypeScript
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

## 2026.09.23 (Week 4)

### Link Component

`<Link>`는 HTML `<a>` 요소를 확장하여 프리페칭(Prefetching)과 라우트 간 클라이언트 사이드 내비게이션 기능을 제공하는 React 컴포넌트임.
Next.js에서 라우트 간 이동을 위해 주로 사용되는 방법임.

```TypeScript
import Link from "next/Link";

export default function Page() {
  return <Link href="/dashboard">DashBoard</Link>
}
```

다음과 같은 prop을 `<Link>` 컴포넌트에 전달할 수 있음.

`href` -> `href="/dashboard"` / Type: String or Object (필수)

`replace` -> `replace={false}` / Type: Boolean

`scroll` -> `scroll={false}` / Type: Boolean

`prefetch` -> `prefetch={false}` / Type: Boolean

`onNavigate` -> `onNavigate={(e) => {}}` / Type: Function

`transitionTypes` -> `transitionTypes={['slide-in']}` / Type: string[]

`href` 속성을 제외한 나머지 속성은 optional임.

### Creating a nested route(중첩 라우트 만들기)

중첩 라우트는 다중 URL 세그먼트로 구성된 라우트임.

예를 들어, `/blog/[slug]` 경로는 세 개의 세그먼트로 구성됨.

- `/` (Root Segment)
- `blog` (Segment)
- `[slug]` (Leaf Segment)

Next.js에서

- 폴더는 URL 세그먼트에 매핑되는 경로 세그먼트를 정의하는데 사용됨.
- 즉 폴더가 URL 세그먼트가 된다는 의미
- 파일(예: page 및 layout)은 세그먼트에 표시되는 UI를 만드는데 사용됨.
- 폴더를 중첩하면 중첩된 라우트를 만들 수 있음.

예를 들어 `/blog` 에 대한 경로를 추가하려면 app 디렉터리에 blog라는 폴더를 만들고 `/blog` 에 공개적으로 액세스할 수 있도록 하려면 `page.tsx` 파일을 추가하면 됨.

<img src="https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Fdocs%2Fdark%2Fblog-nested-route.png&w=3840&q=75">

폴더를 계속 중첩하여 중첩된 경로를 만들 수 있음.

예를 들어 특정 블로그 게시물에 대한 경로를 만들려면 blog 안에 새 `[slug]` 폴더를 만들고 page 파일을 추가함.

폴더 이름을 대괄호(예: `[slug]`)로 묶으면 데이터에서 여러 페이지를 생성하는데 사용되는 동적 경로 세그먼트가 생성됨. 예) 블로그 게시물, 제품 페이지 등

<img src="https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Fdocs%2Fdark%2Fnested-layouts.png&w=3840&q=75">

### [slug]의 이해

slug는 사이트의 특정 페이지를 쉽게 읽을 수 있는 형태로 식별하는 URL의 일부

- 신문이나 잡지 등에서 핵심 의미를 포함하는 단어만을 조합해 간단 명료하게 제목을 작성하는 것을 슬러그라고 하는 것에서 유래했음.

문서의 경로 `/blog/[slug]`의 `[slug]` 부분은 불러올 데이터의 key를 말함.

따라서 데이터에는 slug key가 반드시 있어야 함.

```TypeScript
// posts.ts
// dummy data

export const posts = [
  {
    slug: "nextjs",
    title: "Next.js 소개",
    content: "Next.js는 React 기반의 풀스택 프레임워크입니다.",
  },
  {
    slug: "routing",
    title: "App Router 알아보기",
    content: "Next.js 13부터는 App Router가 도입되었습니다.",
  },
  {
    slug: "ssr-ssg",
    title: "SSR vs SSG",
    content: "서버 사이드 렌더링과 정적 사이트 생성의 차이를 알아봅니다.",
  },
  {
    slug: "dynamic-routes",
    title: "동적 라우팅",
    content: "Next.js에서 [slug]를 활용한 라우팅 방식입니다.",
  },
];
```

예를 들어 첫번째 데이터를 호출하는 경우라면 `/blog/nextjs` 라고 호출함.

`[slug]`는 반드시 slug일 필요는 없음. 단, `[foo]`라고 했다면 데이터에 반드시 foo key(필드)가 있어야 함.

### Rendering with search params(검색 매개변수를 사용한 렌더링)

**무엇을 언제 사용해야 할까?**

- 페이지에 대한 데이터를 로드하기 위해 검색 매개변수가 필요한 경우(예: 페이지 매김, 데이터베이스에서 필터링) searchParams prop을 사용함.
- 검색 매개변수가 클라이언트에서만 사용되는 경우(예: props를 통해 이미 로딩된 목록을 필터링 하는 경우) useSearchParams를 사용함.
- 콜백이나 이벤트 핸들러에서 new URLSearchParams(window.location.search)를 사용하여 리렌더링을 하지 않고도 검색 매개변수를 읽어올 수 있음.

**searchParams**

- URL의 쿼리 문자열(Query String)을 읽는 방법
- 예시 URL: `/products?category=shoes&page=2`
- 여기서 `category=shoes`, `page=2`가 _search parameters_
- Next.js의 App Router에서 searchParams는 다음과 같이 사용할 수 있음

```TypeScript
export default function ProductPage({ searchParams }) {
  return <p>카테고리: {searchParams.category}</p>
}
```

### 동적 렌더링

Next.js에서 페이지는 크게 정적(static) 또는 동적(dynamic)으로 렌더링될 수 있음.

searchParams는 요청이 들어와야만 값을 알 수 있기 때문에, Next.js는 이 페이지를 정적으로 미리 생성할 수 없고, 요청이 올 때마다 새로 렌더링해야 함.

따라서 해당 페이지는 자동으로 동적 렌더링(dynamic rendering)으로 처리됨.

즉, searchParams를 사용하는 순간 Next.js는 "이 페이지는 요청이 들어와야 동작하네?" -> "그럼 정적으로 미리 만들 수 없겠다!" 라고 판단함.

## 2026.09.16 (Week 3)

### Folder and file conventions (폴더 및 파일 규칙)

#### [병렬 및 가로채기 라우팅] Parallel and Intercepted Routes

- 이러한 기능은 슬롯 기반 레이아웃이나 모달 라우팅과 같은 특정 UI 패턴에 적합함.
- 부모 레이아웃에서 렌더링되는 명명된 슬롯(named slots)에는 @slot을 사용함.
- 인터셉트 패턴을 사용하면 URL을 변경하지 않고도 현재 레이아웃 내에서 다른 경로를 렌더링할 수 있음.
- 예를 들면 목록 위에 모달 형태로 상세 보기를 표시할 때 사용할 수 있음.

| Pattern (docs) | Meaning                        | 일반적인 사용 사례                       |
| -------------- | ------------------------------ | ---------------------------------------- |
| @folder        | 명명된 슬롯(Named slot)        | 사이드바 + 메인 콘텐츠                   |
| (.)folder      | 동일 레벨 가로채기(Intercept)  | 모달에서 형제 라우트 미리보기            |
| (..)folder     | 한 단계 위 가로채기(Intercept) | 부모의 자식 라우트를 오버레이로 열기     |
| (..)(..)folder | 두 단계 위 가로채기(Intercept) | 깊게 중첩된 라우트를 오버레이로 열기     |
| (...)folder    | 루트에서 가로채기(Intercept)   | 현재 화면에 루트 기준의 다른 라우트 표시 |

### Organizing your project

#### [컴포넌트 계층] Component Hierarchy

<img src="https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Fdocs%2Fdark%2Ffile-conventions-component-hierarchy.png&w=3840&q=75">

- 라우트 세그먼트에 정의된 특수 파일은 `layout.js` → `template.js` → `error.js` → `loading.js` → `not-found.js` → `page.js` 또는 중첩된 `layout.js` 순서로 렌더링됨.
- `layout.js`는 라우트 세그먼트의 가장 바깥에서 공통 UI를 제공하며, 하위의 모든 특수 파일과 페이지를 감쌈.
- `template.js`는 `layout.js`와 하위 컴포넌트 사이에 위치하며, 자신의 라우트 세그먼트가 변경되면 고유한 키를 가진 새 인스턴스로 다시 마운트됨.
- `error.js`는 하위 컴포넌트를 React Error Boundary로 감싸고, 오류가 발생하면 대체 UI를 표시함.
- `loading.js`는 하위 컴포넌트를 React Suspense Boundary로 감싸고, 콘텐츠가 준비되는 동안 로딩 UI를 표시함.
- `not-found.js`는 라우트 세그먼트에서 `notFound()`가 호출되었을 때 찾을 수 없음 UI를 렌더링함.
- `page.js`는 해당 경로에서 실제로 표시되는 UI이며, 같은 세그먼트의 컴포넌트 계층에서 가장 안쪽에 위치함.

#### [중첩된 컴포넌트 계층] Nested Component Hierarchy

<img src="https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Fdocs%2Fdark%2Fnested-file-conventions-component-hierarchy.png&w=3840&q=75">

- 특수 파일의 컴포넌트 계층은 중첩 라우트에서도 재귀적으로 적용됨.
- 자식 라우트 세그먼트의 컴포넌트는 부모 세그먼트의 `layout.js`, Error Boundary, Suspense Boundary 내부에 중첩됨.
- 예를 들어 `/dashboard/settings`의 `settings` 세그먼트는 부모인 `dashboard` 세그먼트의 레이아웃과 오류·로딩 UI를 상속하면서 자체 레이아웃과 오류·로딩 UI를 추가할 수 있음.
- 따라서 부모 세그먼트의 공통 UI는 유지되고, 하위 세그먼트별 로딩 상태와 오류 처리를 독립적으로 구성할 수 있음.

#### src folder

프로젝트 파일을 app 폴더에 함께 저장할 수는 있지만 꼭 그럴 필요는 없음.

원한다면 app 디렉터리 외부에 보관할 수도 있음.

<img src="https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Fdocs%2Fdark%2Fproject-organization-project-root.png&w=3840&q=75">

### layout의 기본 구성

- app/layout.tsx -> 프로젝트 전체를 감싸는 루트 레이아웃
- children -> 라우트 전환 시 해당 페이지나 하위 레이아웃이 들어오는 자리
- metadata -> SEO 정보(title, description 등)를 Next.js가 자동으로 `<head>`에 삽입
