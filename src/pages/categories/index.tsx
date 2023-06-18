import Head from "next/head";
import { useEffect, useState } from "react";
import { api } from "../../services/apiClient";
import { AiOutlinePlus, AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import SideBar from "../../components/SideBar";
import styles from "./styles.module.scss";
import Link from "next/link";
import { canSSRAuth } from "../../utils/canSSRAuth";
import Container from "../../components/Container";

type ProductProps = {
  _id: string;
  name: string;
  price: number;
  category: string;
};

interface CategoryProps {
  _id: string;
  name: string;
  products: ProductProps[];
}

export default function Categories() {
  const [categories, setCategories] = useState<Array<CategoryProps>>([]);
  const [products, setProducts] = useState<Array<ProductProps>>([]);
  const [selectedCatID, setSelectedCatID] = useState("");

  useEffect(() => {
    api
      .get("/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function getProducts(prods: Array<ProductProps>) {
    if (products.length === 0) {
      setProducts(prods);
      let catID = prods.map((item) => item.category);
      setSelectedCatID(catID[0]);
    } else {
      setProducts([]);
      setSelectedCatID("");
    }
  }

  return (
    <Container title="Categorias">
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          marginTop: 15,
        }}
      >
        {categories.length > 0 ? (
          categories.map((item) => (
            <>
              <div key={item._id} className={styles.categoryCard}>
                <p>{item.name}</p>
                <button onClick={() => getProducts(item.products)}>
                  {selectedCatID === item._id ? (
                    <AiFillCaretUp size={22} color="#222" />
                  ) : (
                    <AiFillCaretDown size={22} color="#222" />
                  )}
                </button>
              </div>
              {/* mesmo com o selectedCatId vazio, a renderização é feita. Por quê? Como limpar esse código? */}
              {selectedCatID === item._id && (
                <div className={styles.productsContent}>
                  <div className={styles.productsCard}>
                    {products.map((prod) => (
                      <>
                        <h4 key={prod._id}>{prod.name}</h4>
                        <span>R$ {prod.price.toFixed(2)}</span>
                      </>
                    ))}
                  </div>
                </div>
              )}
            </>
          ))
        ) : (
          <h3>Nenhuma categoria foi criada!</h3>
        )}
      </div>
    </Container>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
