import Head from "next/head";
import styles from "./styles.module.scss";
import SideBar from "../../components/SideBar";
import { AiOutlinePlus } from "react-icons/ai";
import { ChangeEvent, FormEvent, useState } from "react";
import Router from "next/router";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";
import Container from "../../components/Container";

type CategoryProps = {
  _id: string;
  name: string;
};

interface PageProps {
  categories: CategoryProps[];
}

export default function NewProduct({ categories }: PageProps) {
  const [image, setImage] = useState(null);
  const [productURL, setProductURL] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  function saveImage(e: ChangeEvent<HTMLInputElement>) {
    try {
      let imageFile = e.target.files[0];
      let imageURL = URL.createObjectURL(imageFile);
      setProductURL(imageURL);
      setImage(imageFile);
    } catch (error) {
      console.log(error);
    }
  }

  async function createProduct(e: FormEvent) {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", name);
      data.append("description", description);
      data.append("price", price);
      data.append("file", image);
      data.append("amount", amount);
      data.append("category", category);

      const apiClient = setupAPIClient();
      await apiClient.post("/product", data);

      toast.success("Produto criado com sucesso!");
      Router.push("/products");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container title="Novo produto">
      <form className={styles.form} onSubmit={createProduct}>
        <label>
          <span>
            <AiOutlinePlus size={25} color="cadetblue" />
          </span>

          <input type="file" accept="image/*" onChange={saveImage} />

          {!productURL ? (
            <img
              src="https://th.bing.com/th/id/R.2726df0e07f8e25429d056a59d43e232?rik=53NtLTbkwcOK3w&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_341225.png&ehk=3Jmji0gECYAN3LyNeEpbINptOiLq5C3jTX1JlE08rFU%3d&risl=&pid=ImgRaw&r=0"
              alt="Product"
            />
          ) : (
            <img src={productURL} alt="Product" />
          )}
        </label>

        <div className={styles.inputsContent}>
          <div>
            <p>Nome do produto</p>
            <input
              placeholder="Ex.: Barbeador"
              className={styles.text_input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <p>Descrição (opcional)</p>
            <input
              placeholder="Digite aqui"
              className={styles.text_input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <p>Preço</p>
            <input
              placeholder="Ex.: 20,00"
              className={styles.text_input}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <p>Quantidade</p>
            <input
              placeholder="Ex.: 100"
              className={styles.text_input}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <p>Categoria</p>
            <select onChange={(e) => setCategory(e.target.value)}>
              <option value={null}>Nenhuma</option>

              {categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>

            <button type="submit">Confirmar</button>
          </div>
        </div>
      </form>
    </Container>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/categories");

    return {
      props: {
        categories: response.data,
      },
    };
  } catch (error) {
    console.log(error);
  }
});
