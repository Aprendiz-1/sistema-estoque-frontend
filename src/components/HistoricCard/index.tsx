import { BsArrowUpShort } from "react-icons/bs";
import styles from "./styles.module.scss";

type HistoricProps = {
  _id: string;
  total: number;
  amount: number;
};

interface CardProps {
  data: HistoricProps;
}

export default function HistoricCard({ data }: CardProps) {
  return (
    <div className={styles.card}>
      <label>
        <BsArrowUpShort size={25} color="#1f812f" />
      </label>
      <h3>R$ {data.total.toFixed(2)}</h3>
      <span>QTD: {data.amount}</span>
    </div>
  );
}
