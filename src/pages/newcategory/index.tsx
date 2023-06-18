import Head from "next/head";
import styles from "./styles.module.scss";
import SideBar from "../../components/SideBar";
import { api } from "../../services/apiClient";
import { toast } from "react-toastify";
import { FormEvent, useState } from "react";
import Router from "next/router";
import { canSSRAuth } from "../../utils/canSSRAuth";
import Container from "../../components/Container";

export default function NewCategory() {
  const [name, setName] = useState("");

  async function createCategory(e: FormEvent) {
    e.preventDefault();

    if (name === "") {
      alert("Digite um nome!");
      return;
    }

    try {
      await api.post("/category", { name });
      toast.success("Categoria criada com sucesso!");
      Router.push("/categories");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container title="Criar categoria">
      <form className={styles.form} onSubmit={createCategory}>
        <h3>Nome da categoria</h3>
        <input
          placeholder="Digite aqui"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit">Confirmar</button>
      </form>
    </Container>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
