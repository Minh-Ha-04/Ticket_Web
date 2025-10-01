import styles from './TicketAdmin.module.scss';
import className from 'classnames/bind';

const cx = className.bind(styles);

function TicketAdmin() {
  return (
    <div className={cx('TicketAdmin')}>
      TicketAdmin
    </div>
  );
}

export default TicketAdmin;