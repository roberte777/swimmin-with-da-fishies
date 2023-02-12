import { type NextPage } from "next";
import Head from "next/head";
import { AquaticEnvironment } from "../components";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Swimming with da fishies</title>
        <meta
          name="description"
          content="Procedurally generated aquatic environment with schools of fish and other marine life."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Render aquatic environment into canvas */}
      <AquaticEnvironment />
    </>
  );
};

export default Home;
