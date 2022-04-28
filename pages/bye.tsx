import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import Link from "next/link";

const Bye: NextPage = () => {
  return (
    <div>
      <Head>
        <title>NextJS Func</title>
        <meta name="description" content="Nextjs 기능 정리" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Running Water Bye</h1>
      <Link href="/">
        <a>인덱스 페이지</a>
      </Link>
    </div>
  );
};

export default Bye;
