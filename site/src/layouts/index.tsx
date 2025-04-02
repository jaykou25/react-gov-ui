import { Link, Outlet } from "umi";
import styles from "./index.less";

export default function Layout() {
  return (
    <div className={styles.navs}>
      <ul>
        <li>
          <Link to="/">组件</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
