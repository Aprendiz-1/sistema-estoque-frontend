import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from "./styles.module.scss";

type CountProps = {
  categories: number;
  products: number;
  sales: number;
};

interface UserCardProps {
  data: CountProps;
}

export default function UserCard({ data }: UserCardProps) {
  const { user } = useContext(AuthContext);

  return (
    <div className={styles.card}>
      <img src={user?.avatar} alt="User" />

      <div className={styles.user_info}>
        <h3>{user?.name}</h3>
        <span>{user?.email}</span>
      </div>
      <hr />
      <div className={styles.system_infos}>
        <span>
          <strong>Categorias:</strong> {data.categories}
        </span>
        <span>
          <strong>Produtos:</strong> {data.products}
        </span>
        <span>
          <strong>Saídas:</strong> {data.sales}
        </span>
      </div>
    </div>
  );
}
