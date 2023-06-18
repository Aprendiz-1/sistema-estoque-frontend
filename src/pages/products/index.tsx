import Head from "next/head";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import SideBar from "../../components/SideBar";
import styles from "./styles.module.scss";
import ProductCard from "../../components/ProductCard";
import Link from "next/link";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
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
  category: {
    _id: string;
    name: string;
  };
}

interface PageProps {
  products: ProductProps[];
}

export default function Products({ products: listProducts }: PageProps) {
  const [change, setChange] = useState(false);
  const [products, setProducts] = useState(listProducts);
  const [selectedProduct, setSelectedProduct] = useState<ProductProps>();
  const [amountRegister, setAmountRegister] = useState(1);
  const [newAmounts, setNewAmounts] = useState<Array<ProductProps>>([]);
  const [showModal, setShowModal] = useState(false);

  function hasChange(info: boolean) {
    setChange(info);
  }

  function getNewAmounts(prods: ProductProps) {
    const indexProduct = newAmounts.findIndex((item) => item._id === prods._id);

    if (indexProduct !== -1) {
      let prodList = newAmounts;
      prodList[indexProduct].amount = prods.amount;

      setNewAmounts(prodList);
      return;
    }

    setNewAmounts((data) => [...data, prods]);
  }

  async function updateAmounts() {
    try {
      await api.put("/update/amounts", { products: newAmounts });
      alert("Produtos atualizados!");
    } catch (error) {
      console.log(error);
    }
  }

  function chooseProduct(prod: ProductProps) {
    setSelectedProduct(prod);
    setShowModal(true);
  }

  async function registerSale() {
    if (amountRegister === 0) {
      return;
    }

    try {
      await api.post("/product/sale", {
        saleAmount: amountRegister,
        productAmount: selectedProduct.amount - amountRegister,
        total: selectedProduct.price * amountRegister,
        product_id: selectedProduct._id,
      });

      toast.success("Saída registrada com sucesso!");
      Router.push("/products");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container title="Produtos">
      <div className={styles.cardsContent}>
        {products.length > 0 ? (
          products.map((item) => (
            <ProductCard
              key={item._id}
              data={item}
              checkChange={hasChange}
              teste={getNewAmounts}
              showRegister={() => chooseProduct(item)}
            />
          ))
        ) : (
          <h3>Nenhum produto foi adicionado!</h3>
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

            <input
              placeholder="Quantidade"
              value={amountRegister}
              onChange={(e) => setAmountRegister(Number(e.target.value))}
            />

            {amountRegister > selectedProduct.amount && (
              <span className={styles.error_message}>
                A quantidade máxima é: {selectedProduct.amount}
              </span>
            )}

            <div className={styles.totalContent}>
              <span>
                <strong>Total</strong>
              </span>
              <span>
                R$ {(amountRegister * selectedProduct.price).toFixed(2)}
              </span>
            </div>

            <button className={styles.confirmButton} onClick={registerSale}>
              Confirmar
            </button>
          </div>
        </div>
      )}

      {change === true && (
        <button className={styles.changeButton} onClick={updateAmounts}>
          Aplicar mudanças
        </button>
      )}
    </Container>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/products");

    return {
      props: {
        products: response.data,
      },
    };
  } catch (error) {
    console.log(error);
  }
});
