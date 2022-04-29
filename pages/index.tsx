import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

const Temp = dynamic(() => import("../components/temp"), { ssr: false });

const Home: NextPage = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Head>
        <title>NextJS Func</title>
        <meta name="description" content="Nextjs 기능 정리" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Running Water</h1>
      <Link href="/bye">
        <a>바이 페이지</a>
      </Link>
      <div>
        <h2>count</h2>
        <p>{count}</p>
        <button onClick={() => setCount((prev) => prev + 1)}>올리기</button>
      </div>
    </div>
  );
};

export default Home;
