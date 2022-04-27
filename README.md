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
