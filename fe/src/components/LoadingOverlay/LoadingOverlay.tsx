import styles from "./LoadingOverlay.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function LoadingOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className={cx("overlay")}>
      <div className={cx("spinner")}></div>
      <p>Đang xử lý...</p>
    </div>
  );
}
