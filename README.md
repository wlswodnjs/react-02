# 진재원 202430131

👍 [Next.js 공식 문서](https://nextjs.org/docs) <br/>

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
