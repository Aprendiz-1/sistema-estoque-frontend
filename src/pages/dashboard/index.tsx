import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { canSSRAuth } from "../../utils/canSSRAuth";
import { AiOutlinePlus } from "react-icons/ai";
import styles from "./styles.module.scss";
import Link from "next/link";
import Menu from "../../components/Menu";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { setupAPIClient } from "../../services/api";
import HistoricCard from "../../components/HistoricCard";
import UserCard from "../../components/UserCard";
import Container from "../../components/Container";

type HistoricProps = {
  _id: string;
  total: number;
  amount: number;
};

type CountProps = {
  categories: number;
  products: number;
  sales: number;
};

interface DashboardProps {
  historic: HistoricProps[];
  items: CountProps;
}

export default function Dashboard({ historic, items }: DashboardProps) {
  const { user } = useContext(AuthContext);
  const values = historic.map((item) => item.total);

  const OptionsChartLine = {
    colors: ["#222"],
    tooltip: {
      enabled: true,
      theme: "dark",
    },
    chart: {
      foreColor: "black",
    },
    subtitle: {
      offsetY: 0,
      offsetX: 8,
    },
    markers: {
      size: 5,
      strokeWidth: 2,
      strokeColor: "#fff",
    },
    grid: {
      show: false,
    },
  };

  const SeriesChartLine = [
    {
      name: "Vendas",
      data: values,
    },
  ];

  return (
    <Container title="Dashboard">
      <Menu />
      <div className={styles.content}>
        <div className={styles.balanceContent}>
          <h3>Vendas:</h3>
          <h2>R$ {user?.balance?.toFixed(2)}</h2>
        </div>

        <div className={styles.chartContent}>
          <Chart
            options={OptionsChartLine}
            series={SeriesChartLine}
            height={280}
            width={680}
          />
        </div>

        <div className={styles.historicContent}>
          <h2>Histórico</h2>

          <div className={styles.listHistoric}>
            {historic.reverse().map((item) => (
              <HistoricCard key={item._id} data={item} />
            ))}
          </div>
          <hr />
        </div>

        <div className={styles.linksContent}>
          <Link href="/newproduct">
            <div
              className={styles.addContent}
              style={{
                backgroundColor: "#f09393",
                borderWidth: 3,
                borderStyle: "dashed",
                borderColor: "#8d2c2c",
              }}
            >
              <AiOutlinePlus size={50} color="#000" />
              <h2>Adicionar Produto</h2>
              <p>Adicione um produto ao estoque agora mesmo</p>
            </div>
          </Link>

          <Link href="/newcategory">
            <div
              className={styles.addContent}
              style={{
                backgroundColor: "#7ae99b",
                borderWidth: 3,
                borderStyle: "dashed",
                borderColor: "#1a7234",
              }}
            >
              <AiOutlinePlus size={50} color="#000" />
              <h2>Criar Categoria</h2>
              <p>Crie categorias para seus produtos agora mesmo</p>
            </div>
          </Link>
        </div>
      </div>

      <UserCard data={items} />
    </Container>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const historicResponse = await apiClient.get("/historic/list");
    const countResponse = await apiClient.get("/count");

    return {
      props: {
        historic: historicResponse.data,
        items: countResponse.data,
      },
    };
  } catch (error) {
    console.log(error);
  }
});
