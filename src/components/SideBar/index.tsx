import Link from "next/link";
import styles from "./styles.module.scss";
import { AiFillHome } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { MdComputer } from "react-icons/md";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";

export default function SideBar() {
  const items = [
    {
      icon: <AiFillHome size={25} color="#fff" />,
      text: "Dashboard",
      route: "/dashboard",
    },
    {
      icon: <BiCategoryAlt size={25} color="#fff" />,
      text: "Categorias",
      route: "/categories",
    },
    {
      icon: <MdComputer size={25} color="#fff" />,
      text: "Produtos",
      route: "/products",
    },
    {
      icon: <HiOutlineClipboardDocumentList size={25} color="#fff" />,
      text: "Histórico",
      route: "/historic",
    },
  ];

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.titleContent}>
          <Link href="/dashboard">
            <span>
              Estoke<strong>System</strong>
            </span>
          </Link>
        </div>

        {items.map((item) => (
          <Link href={item.route} key={item.text}>
            <label>
              <span>{item.icon}</span>
              <p>{item.text}</p>
            </label>
          </Link>
        ))}
      </div>
    </>
  );
}
