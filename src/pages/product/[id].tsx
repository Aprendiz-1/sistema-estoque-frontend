import { ChangeEvent, FormEvent, useState } from "react";
import Head from "next/head";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";
import { MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import SideBar from "../../components/SideBar";
import styles from "./styles.module.scss";
import { api } from "../../services/apiClient";
import Router from "next/router";
import Container from "../../components/Container";

interface ProductProps {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  amount: number;
}

interface DetailProps {
  product: ProductProps;
}

export default function Product({ product }: DetailProps) {
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(product.name);
  const [newDescription, setNewDescription] = useState(product.description);
  const [newPrice, setNewPrice] = useState(`${product.price}`);
  const [newImage, setNewImage] = useState(null);
  const [productURL, setProductURL] = useState("");
  const [newAmount, setNewAmount] = useState(`${product.amount}`);
  const [showModal, setShowModal] = useState(false);

  function changeImage(e: ChangeEvent<HTMLInputElement>) {
    try {
      let file = e.target.files[0];
      let fileURL = URL.createObjectURL(file);
      setProductURL(fileURL);
      setNewImage(file);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateProduct(e: FormEvent) {
    //e.preventDefault();

    if (
      newName === product.name &&
      newDescription === product.description &&
      Number(newPrice) === product.price &&
      newImage === product.image &&
      Number(newAmount) === product.amount
    ) {
      alert("Faça alguma edição!");
      return;
    }

    try {
      const data = new FormData();

      data.append("product_id", product._id);
      data.append("name", newName);
      data.append("description", newDescription);
      data.append("price", newPrice);
      data.append("file", newImage);
      data.append("amount", newAmount);

      const apiClient = setupAPIClient();
      await apiClient.put("/product/update", data);

      toast.success("Produto atualizado com sucesso!");
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteProduct() {
    try {
      await api.delete("/product/delete", {
        params: {
          product_id: product._id,
        },
      });

      toast.success("Produto deletado com sucesso!");
      Router.push("/products");
    } catch (error) {
      console.log(error);
    }
  }

  function renderImage() {
    if (productURL.length === 0 && !product.image) {
      return (
        <img
          src="https://th.bing.com/th/id/R.2726df0e07f8e25429d056a59d43e232?rik=53NtLTbkwcOK3w&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_341225.png&ehk=3Jmji0gECYAN3LyNeEpbINptOiLq5C3jTX1JlE08rFU%3d&risl=&pid=ImgRaw&r=0"
          alt="Product"
        />
      );
    } else if (productURL.length !== 0) {
      return <img src={productURL} alt="Product" />;
    } else {
      return <img src={product.image} alt="Product" />;
    }
  }

  return (
    <Container title={product.name}>
      <div className={styles.infoContent}>
        {!editMode ? (
          <>
            <label>
              {!product.image ? (
                <img
                  src="https://th.bing.com/th/id/R.2726df0e07f8e25429d056a59d43e232?rik=53NtLTbkwcOK3w&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_341225.png&ehk=3Jmji0gECYAN3LyNeEpbINptOiLq5C3jTX1JlE08rFU%3d&risl=&pid=ImgRaw&r=0"
                  alt="Product"
                />
              ) : (
                <img src={product.image} alt="Product" />
              )}
            </label>

            <h2>{product.name}</h2>
            <p>{product.description}</p>

            <div className={styles.rowContent}>
              <p>
                <strong>Preço:</strong> R${product.price.toFixed(2)}
              </p>
              <hr />
              <p>
                <strong>Quantidade:</strong> {product.amount}
              </p>
            </div>

            <button
              className={styles.edit_button}
              onClick={() => setEditMode(true)}
            >
              Editar
            </button>
            <button
              className={styles.delete_button}
              onClick={() => setShowModal(true)}
            >
              Deletar
            </button>
          </>
        ) : (
          <form onSubmit={updateProduct}>
            <label>
              <span>
                <MdEdit size={20} color="#fff" />
              </span>

              <input type="file" accept="image/*" onChange={changeImage} />
              {renderImage()}
            </label>

            <div className={styles.inputsContent}>
              <input
                placeholder={product.name}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />

              <input
                placeholder={
                  !product.description ? "Descrição" : product.description
                }
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>

            <div className={styles.inputsContent}>
              <div>
                <p>
                  <strong>Preço:</strong>
                </p>
                <input
                  placeholder={`${product.price}`}
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </div>

              <div>
                <p>
                  <strong>Quantidade:</strong>
                </p>
                <input
                  placeholder={`${product.amount}`}
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.editButons}>
              <button
                className={styles.cancelButton}
                onClick={() => setEditMode(false)}
              >
                Cancelar
              </button>
              <button type="submit" className={styles.saveButton}>
                Salvar
              </button>
            </div>
          </form>
        )}
      </div>

      {showModal && (
        <div className={styles.modalContainer}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setShowModal(false)}
            >
              <IoClose size={30} color="#222" />
            </button>

            <span>
              Você tem certeza que quer deletar "{product.name}"
              permanentemente?
            </span>

            <button className={styles.confirmButton} onClick={deleteProduct}>
              Confirmar
            </button>
          </div>
        </div>
      )}
    </Container>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const { id } = ctx.params;

  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/product/detail", {
      params: {
        product_id: id,
      },
    });

    return {
      props: {
        product: response.data,
      },
    };
  } catch (error) {
    console.log(error);
  }
});
