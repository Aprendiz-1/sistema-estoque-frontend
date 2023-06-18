import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import Head from "next/head";
import styles from "../../../styles/home.module.scss";
import { canSSRGuest } from "../../utils/canSSRGuest";
import { setupAPIClient } from "../../services/api";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Router from "next/router";
import { toast } from "react-toastify";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [urlAvatar, setUrlAvatar] = useState("");
  const [password, setPassword] = useState("");

  function saveAvatar(e: ChangeEvent<HTMLInputElement>) {
    try {
      let image = e.target.files[0];
      let imageURL = URL.createObjectURL(image);
      setUrlAvatar(imageURL);
      setAvatar(image);
    } catch (error) {
      console.log(error);
    }
  }

  async function register(e: FormEvent) {
    e.preventDefault();

    if (name === "" || email === "" || password === "") {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const data = new FormData();

      data.append("name", name);
      data.append("email", email);
      data.append("file", avatar);
      data.append("password", password);

      const apiClient = setupAPIClient();
      await apiClient.post("/user", data);

      toast.success("Conta criada com sucesso!");
      Router.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.signup_form_content}>
        <form onSubmit={register}>
          <label>
            <span>
              <AiOutlinePlus size={25} color="#fff" />
            </span>

            <input type="file" accept="image/*" onChange={saveAvatar} />

            {!urlAvatar ? (
              <img
                src="https://cdn1.iconfinder.com/data/icons/rcons-user-action/512/woman-1024.png"
                alt="User"
              />
            ) : (
              <img src={urlAvatar} alt="Avatar" />
            )}
          </label>

          <input
            placeholder="Nome"
            className={styles.text_input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
        style={{ justifyContent: "flex-start" }}
        className={styles.link_content}
      >
        <button
          onClick={() => Router.push("/")}
          style={{ marginRight: 10 }}
          className={styles.link_button}
        >
          <AiOutlineArrowLeft size={25} color="#fff" />
        </button>
        <span>Acesse sua conta</span>
      </div>
    </div>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
