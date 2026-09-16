# 진재원 202430131

👍 [Next.js 공식 문서](https://nextjs.org/docs) <br/>

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
