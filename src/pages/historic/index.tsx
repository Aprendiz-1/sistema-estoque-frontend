import Container from "../../components/Container";
import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { BsArrowUpShort } from "react-icons/bs";
import styles from "./styles.module.scss";

type ProductProps = {
  _id: string;
  name: string;
  image: string;
};

type HistoricProps = {
  _id: string;
  total: number;
  amount: number;
  product: ProductProps;
  createdAt: string;
};

interface HistoricPageProps {
  historic: HistoricProps[];
}

export default function Historic({ historic }: HistoricPageProps) {
  return (
    <Container title="Histórico de saídas">
      <div className={styles.content}>
        {historic.map((item) => {
          return (
            <div className={styles.card} key={item._id}>
              <div className={styles.leftCard}>
                <img
                  src={`http://localhost:4000/uploads/${item.product?.image}`}
                  alt="Produto"
                />

                <div className={styles.infosContent}>
                  <h3>{item.product?.name}</h3>
                  <span>{item.createdAt}</span>
                </div>
              </div>

              <div className={styles.rightCard}>
                <label>
                  <h3>R$ {item.total.toFixed(2)}</h3>
                  <BsArrowUpShort size={30} color="#1f812f" />
                </label>
                <span>QTD: {item.amount}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/historic/list");

    return {
      props: {
        historic: response.data,
      },
    };
  } catch (error) {
    console.log(error);
  }
});
