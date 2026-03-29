import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>📊 PollMaster</div>
            <div className={styles.links}>
                <Link to="/">Create New Poll</Link>
                <Link to="/polls">Existing Polls</Link>
            </div>
        </nav>
    );
}