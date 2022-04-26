import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export default function mmid(req: NextRequest, ev: NextFetchEvent) {
  if (req.ua?.isBot) {
    return new Response("Be human", { status: 403 });
  }
  //   if (!req.url.includes("/api")) {
  //     if (!req.url.includes("/enter") && !req.cookies.carrotsession) {
  //       return NextResponse.redirect("/enter");
  //     }
  //   }
  // 미들웨어에서의 장점은 useUser에서는 실제 페이지에 들어갔다가 확인하고, 사용자를 리다이렉트 시키느라
  // 잔상이 남을 수 있지만 여기서는 페이지에 들어가지도 못하고 /enter 페이지로 가게될 것이다.
  // 즉 미들웨어가 먼저 실행된다
  // Response를 사용할 땐 항상 return 해주자
}
