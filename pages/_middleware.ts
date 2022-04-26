import type { NextFetchEvent, NextRequest } from "next/server";

export default function mmid(req: NextRequest, ev: NextFetchEvent) {
  console.log(req.ua);
}
