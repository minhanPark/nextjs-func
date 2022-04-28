# Nextjs 기능 정리

## Middlwares

nextjs에서 **미들웨어는 사용자의 요청 -> 서버의 응답 사이에서 작동하는 것**이다.

pages의 밑에 \_middleware.ts 이름으로 만들면 된다.  
해당 디렉토리에 요청이 들어왔을 때 미들웨어가 작동된다.

> pages/\_middleware.ts 는 모든 페이지 요청에 미들웨어가 작동  
> pages/api/\_middleware.ts 는 모든 api 요청에 미들웨어가 작동한다.
> 만약 pages/about/\_middleware.ts와 pages/about/team/\_middleware.ts가 있다면 먼저 /about/\_middleware가 먼저 실행되고, about/team/\_middleware가 실행된다.

```js
// export를 쓸거면 이름은 middleware가 되어야 함.
export function middleware(req: NextRequest, ev: NextFetchEvent) {
  console.log("Hello World", req.ua);
}

// exports default를 쓸거면 아무이름이나 가능함.
exports default function 아무이름(req: NextRequest, ev: NextFetchEvent) {
  console.log("Hello World", req.ua);
}
```

## Dynamic Imports

동적 import를 사용하면 유저가 실제로 그 컴포넌트를 필요로 할 때만 코드를 불러옴

```js
import dynamic from "next/dynamic";

const Temp = dynamic(() => import("../components/temp"), { ssr: false });

return (...)<Temp />(...);
```

다이나믹 렌더링을 하지 않는다면 일단 모든 코드를 다운로드한 뒤 리액트가 상황에 따라서만 렌더링을 시키는 것이다. 위의 코드처럼 동적 import를 시키면 해당 코드가 사용될 때 next.js가 코드를 불러올 것이다. 또한 ssr 설정을 넣을 수 있는데, 만약 서버사이드 렌더링이 지원되지 않는 컴포넌트라면 위 처럼 동적 import해서 ssr 속성을 false해준다면 next.js에서 사용할 수 있다.

## suspense 나 loading 사용하기

만약 동적으로 컴포넌트를 로딩할 때 시간이 오래 걸린다면 무엇을 할 수 있을까? next.js에서는 loading 옵션을 제공하고, 리액트에서는 suspense를 제공한다.

```js
const Temp = dynamic(() => new Promise((resolve) => setTimeout(() => resolve(import("../components/temp")), 10000)), { ssr: false, loading: () => <span>loading</span> });

return (...)<Temp />(...);
```

위와 같은 상황일 때(promise와 setTimeout으로 10초뒤에 컴포넌트가 렌더링 되도록 설정) 10초 동안 사용자는 빈칸을 보는 것이 아니라 loading 속성에 적혀 있는 컴포넌트를 보게 될 것이다.

```js
(...나머지 동일)
import { Suspense } from "react";

const Temp = dynamic(() => new Promise((resolve) => setTimeout(() => resolve(import("../components/temp")), 10000)), { ssr: false, suspense: true });

return (
  <Suspense fallback={<span>loading</span>}>
    <Temp />
  </Suspense>);
```

리액트에서 제공하는 suspense를 활용하려면 위와 같이 동적 import시 suspense 속성의 값을 true로 설정해주어야 한다.

## \_document.tsx 와 폰트

\_document.tsx는 페이지 렌더링 시 html과 head, body 태그의 청사진을 그릴 수 있다. 서버에서 한번 렌더링이 된다. 여기에 구글 폰트 등을 삽입해주면 된다. 또한 next는 빌드 시에 구글 폰트를 바로 코드로 넣어주기 때문에 사용자는 \_document.tsx에서 한번 코드를 읽은 후 그 다음부터는 바로 사용가능하게 된다.

```
import Document, { Head, Html, Main, NextScript } from "next/document";

class CustomDocument extends Document {
  render(): JSX.Element {
    console.log("DOCUMENT IS RUNNING");
    return (
      <Html lang="ko">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
```

확인해보면 **\_document.tsx.는 페이지가 처음 렌더링 될 때 한번 실행하고, 그 후부터는 실행하지 않음**

## Script

next에서는 script도 최적화해서 사용가능하도록 해준다.

```js
import Script from "next/script";
```

위와 같이 부를 수 있음. script에는 3가지 전략을 사용할 수 있는데, beforeInteractive, afterInteractive, lazyOnload이다.

> beforeInteractive는 서버에서 초기 HTML에 주입되고 자체 번들 자바스크립트가 실행되기 전에 코드를 읽는다. 페이지가 상호작용하기전에 실행되길 원한다면 해당 전략을 사용하면 된다.  
> afterInteractive(기본값)는 클라이언트 사이드에서 삽입되고, Next.js가 하이드레이트 할 때 실행된다. 페이지가 상호작용 가능할 떄 즉시 실행된다.  
> lazyOnload는 모든 리소스가 읽히고 난 뒤 유휴시간에 로드된다. 낮은 우선순위의 스크립트의 경우 사용하기에 좋다.

```js
<Script src="src" strategy="lazyOnload" />
```

또한 onLoad를 활용하면 스크립트가 로드되었을 때 바로 실행할 코드를 작성할 수 있다.

```js
<Script
  src="https://connect.facebook.net/en_US/sdk.js"
  onLoad={() => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: "your-app-id",
        autoLogAppEvents: true,
        xfbml: true,
        version: "v13.0",
      });
    };
  }}
/>
```

## getServerSideProps

사용자가 페이지에 들어왔을 때 로딩 화면이라도 보여주고 데이터를 보여줄 수도 있고, 조금 더 시간이 걸리더라도 데이터를 다 로드한 뒤 로딩 없이 화면을 보여줄 수 있다.  
후자가 더 좋다고 판단했을 시에 사용하는게 getServerSideProps다

```js
<SWRConfig
  value={{
    fallback: {
      "/api/products": {
        ok: true,
        products,
      },
    },
  }}
>
  <Home />
</SWRConfig>
```

getServerSideProps를 사용하더라도 SWR을 사용할 수 있다.(기존 캐시, Optimistic 적용을 위해서 SWR을 사용하는게 좋음.)  
**fallback을 사용**하면됨

## getStaticProps

정적 페이지를 생성해준다.  
정적 페이지는 **데이터의 변동이 없는 페이지를 정적 페이지라고 한다.**

빌드 시에 next가 정적 페이지를 만들 수 있도록 이용가능해야하고, 데이터를 공개적으로 캐시할 수 있다. 또한 seo를 위해 미리 렌더링된다.

> getServerSideProps는 요청 마다 새로 실행되지만 getStaticProps는 빌드 후 한번 요청때만 요청된다.

## getStaticPath

동적 라우트([id.tsx] 같은 형태)를 갖는 페이지에서 getStaticProps를 사용할 때 필요하다. Next에게 정적 페이지를 어느 정도 만들어야 하는 지 알려준다.

> getStaticProps는 빌드 시에 바로 static file이 된다. 그래서 이 후 수정이 불가능하다.  
> SSG(Static Site Generation)이 됨  
> 호출 시 마다 data fetch가 없으니 성능면에서 제일 좋음

> getServerSideProps는 페이지가 요청 받을 때마다 호출되어 pre-rendering을 한다.  
> SSR(Server Side Rendering)이다.  
> pre-rendering이 필요한 동적데이터가 있는 페이지에서 사용하면 되고, 내용이 언제든 동적 데이터에 의해서 수정이 가능하다.
