import { useState } from "react";
import styles from "./styles.module.scss";
import Router from "next/router";
import { FiEdit } from "react-icons/fi";

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

interface CardProps {
  data: ProductProps;
  checkChange: (credentials: boolean) => void;
  teste: (credentials: ProductProps) => void;
  showRegister: () => void;
}

export default function ProductCard({
  data,
  checkChange,
  teste,
  showRegister,
}: CardProps) {
  const [amount, setAmount] = useState(data.amount);

  function diminuir() {
    if (amount === 0) {
      return;
    }

    if (amount - 1 !== data.amount) {
      checkChange(true);
    } else {
      checkChange(false);
    }

    setAmount((item) => item - 1);
    let prod = { ...data, amount: amount };
    teste(prod);
  }

  function aumentar() {
    if (amount + 1 !== data.amount) {
      checkChange(true);
    } else {
      checkChange(false);
    }

    setAmount((item) => item + 1);
    let prod = { ...data, amount: amount };
    teste(prod);
  }

  return (
    <div className={styles.productCard}>
      <div className={styles.imageContent}>
        {!data.image ? (
          <img
            src="https://th.bing.com/th/id/R.2726df0e07f8e25429d056a59d43e232?rik=53NtLTbkwcOK3w&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_341225.png&ehk=3Jmji0gECYAN3LyNeEpbINptOiLq5C3jTX1JlE08rFU%3d&risl=&pid=ImgRaw&r=0"
            alt="Product"
          />
        ) : (
          <img
            src={`http://localhost:4000/uploads/${data.image}`}
            alt="Product"
          />
        )}
        <div>
          <h3>{data.name}</h3>
          <span>{data?.category?.name}</span>
        </div>
      </div>

      <div className={styles.amountContent}>
        <label>
          <strong>QTD: </strong>
          {amount}
        </label>
      </div>

      <div className={styles.priceContent}>
        <span>
          <strong>Preço:</strong> R$ {data.price.toFixed(2)}
        </span>

        <div style={{ display: "flex", alignItems: "center" }}>
          <button className={styles.registerButton} onClick={showRegister}>
            Registar saída
          </button>

          <button
            className={styles.navButton}
            onClick={() => Router.push(`/product/${data._id}`)}
          >
            <FiEdit size={20} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}
