import { ChangeEvent, FormEvent, useContext, useState } from "react";
import Head from "next/head";
import styles from "./styles.module.scss";
import SideBar from "../../components/SideBar";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import Container from "../../components/Container";

interface UserProps {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  password: string;
}

interface ProfileProps {
  user: UserProps;
}

export default function Profile({ user }: ProfileProps) {
  const { signOut } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [newEmail, setNewEmail] = useState(user.email);
  const [urlAvatar, setUrlAvatar] = useState("");
  const [newAvatar, setNewAvatar] = useState(null);
  const [newPassword, setNewPassword] = useState("* * * * *");

  function changeAvatar(e: ChangeEvent<HTMLInputElement>) {
    try {
      let image = e.target.files[0];
      let imageURL = URL.createObjectURL(image);
      setUrlAvatar(imageURL);
      setNewAvatar(image);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateUser(e: FormEvent) {
    //e.preventDefault();

    if (
      newName === user.name &&
      newEmail === user.email &&
      newAvatar === user.avatar
    ) {
      return;
    }

    try {
      const data = new FormData();

      data.append("name", newName);
      data.append("email", newEmail);
      data.append("file", newAvatar);

      const apiClient = setupAPIClient();
      await apiClient.put("/user/update", data);

      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      console.log(error);
    }
  }

  function renderImage() {
    if (urlAvatar.length === 0 && !user.avatar) {
      return (
        <img
          src="https://cdn1.iconfinder.com/data/icons/rcons-user-action/512/woman-1024.png"
          alt="Avatar"
        />
      );
    } else if (urlAvatar.length !== 0) {
      return <img src={urlAvatar} alt="Avatar" />;
    } else {
      return <img src={user.avatar} alt="Avatar" />;
    }
  }

  return (
    <Container title="Seu perfil">
      <div className={styles.infoContent}>
        {!editMode ? (
          <>
            <label>
              {!user.avatar ? (
                <img
                  src="https://cdn1.iconfinder.com/data/icons/rcons-user-action/512/woman-1024.png"
                  alt="User"
                />
              ) : (
                <img src={user.avatar} alt="User" />
              )}
            </label>

            <h2>{user.name}</h2>

            <div className={styles.columnContent}>
              <p>
                <strong>Email: </strong>
                {user.email}
              </p>
              <hr />
              <p>
                <strong>Senha: </strong>* * * * *
              </p>
            </div>

            <button onClick={() => setEditMode(true)}>Editar</button>
            <button className={styles.signOutButton} onClick={signOut}>
              Sair
            </button>
          </>
        ) : (
          <form onSubmit={updateUser}>
            <label>
              <span>
                <MdEdit size={20} color="#fff" />
              </span>

              <input type="file" accept="image/*" onChange={changeAvatar} />
              {renderImage()}
            </label>

            <input
              placeholder={user.name}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <div className={styles.inputsContent}>
              <div>
                <p>
                  <strong>Email:</strong>
                </p>
                <input
                  placeholder={user.email}
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <div>
                <p>
                  <strong>Senha:</strong>
                </p>
                <input
                  placeholder="Digite a nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
              <button className={styles.saveButton} type="submit">
                Salvar
              </button>
            </div>
          </form>
        )}
      </div>
    </Container>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/user/detail");

    return {
      props: {
        user: response.data,
      },
    };
  } catch (error) {
    console.log(error);
  }
});
