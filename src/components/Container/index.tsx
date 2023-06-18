import { ReactNode } from "react";
import SideBar from "../SideBar";
import styles from "./styles.module.scss";
import Head from "next/head";

interface ContainerProps {
  children: ReactNode;
  title: string;
}

export default function Container({ children, title }: ContainerProps) {
  return (
    <>
      <Head>
        <title>Estoke System</title>
      </Head>

      <div className={styles.container}>
        <SideBar />
        <h1>{title}</h1>
        <hr />
        {children}
      </div>
    </>
  );
}
