import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Head from "next/head";
import styles from "../../styles/home.module.scss";
import { AiOutlineArrowRight } from "react-icons/ai";
import { canSSRGuest } from "../utils/canSSRGuest";
import Router from "next/router";

export default function Home() {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login(e: FormEvent) {
    e.preventDefault();

    if (email === "" || password === "") {
      alert("Preencha todos os campos!");
      return;
    }

    await signIn({ email, password });
  }

  return (
    <div className={styles.container}>
      <div className={styles.signin_form_content}>
        <form onSubmit={login}>
          <input
            placeholder="Email"
            type="email"
            className={styles.text_input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Senha"
            type="password"
            className={styles.text_input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Confirmar</button>
        </form>
      </div>

      <div
        style={{ justifyContent: "flex-end" }}
        className={styles.link_content}
      >
        <span>Crie uma conta</span>
        <button
          onClick={() => Router.push("/signup")}
          style={{ marginLeft: 10 }}
          className={styles.link_button}
        >
          <AiOutlineArrowRight size={25} color="#fff" />
        </button>
      </div>
    </div>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
