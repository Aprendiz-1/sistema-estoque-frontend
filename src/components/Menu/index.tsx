import Router from 'next/router';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaBell } from 'react-icons/fa';
import styles from './styles.module.scss';

export default function Menu() {
    return (
        <div className={styles.menuContent}>
            <button onClick={null}>
                <FaBell size={20} color='#fff'/>
            </button>

            <button onClick={() => Router.push('/profile')}>
                <BsFillPersonFill size={25} color='#fff'/>
            </button>
        </div>
    )
}