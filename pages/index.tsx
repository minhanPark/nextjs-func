import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";

const Temp = dynamic(() => import("../components/temp"), { ssr: false });

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>NextJS Func</title>
        <meta name="description" content="Nextjs 기능 정리" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Running Water</h1>
    </div>
  );
};

export default Home;
