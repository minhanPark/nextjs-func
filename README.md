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
