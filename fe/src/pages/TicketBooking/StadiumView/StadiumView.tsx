import React from 'react';
import styles from "./StadiumView.module.scss";
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface StadiumViewProps {
  match: any;
  sections: { id: number; name: string }[];
  onSelectSection: (section: any) => void;
}

function StadiumView({ match, sections, onSelectSection }: StadiumViewProps) {
  // Hàm chọn khu vực
  const handleClick = (sectionName: string) => {
    const section = sections.find(s => s.name === sectionName);
    if (section) onSelectSection(section);
  };

  return (
    <div className={cx('stadium-container')}>
      <img src="/stadium.png" alt="stadium" className={cx('stadium-image')} />

      {/* Các vùng click overlay */}
      <div className={cx('hotspot', 'east-lower')} onClick={() => handleClick('East-Lower')}></div>
      <div className={cx('hotspot', 'east-middle')} onClick={() => handleClick('East-Middle')}></div>
      <div className={cx('hotspot', 'east-upper')} onClick={() => handleClick('East-Upper')}></div>
      <div className={cx('hotspot', 'east-vip')} onClick={() => handleClick('East-Vip')}></div>

      <div className={cx('hotspot', 'west-lower')} onClick={() => handleClick('West-Lower')}></div>
      <div className={cx('hotspot', 'west-middle')} onClick={() => handleClick('West-Middle')}></div>
      <div className={cx('hotspot', 'west-upper')} onClick={() => handleClick('West-Upper')}></div>
      <div className={cx('hotspot', 'west-vip')} onClick={() => handleClick('West-Vip')}></div>

      <div className={cx('hotspot', 'north-lower')} onClick={() => handleClick('North-Lower')}></div>
      <div className={cx('hotspot', 'north-middle')} onClick={() => handleClick('North-Middle')}></div>
      <div className={cx('hotspot', 'north-upper')} onClick={() => handleClick('North-Upper')}></div>
      <div className={cx('hotspot', 'north-vip')} onClick={() => handleClick('North-Vip')}></div>

      <div className={cx('hotspot', 'south-lower')} onClick={() => handleClick('South-Lower')}></div>
      <div className={cx('hotspot', 'south-middle')} onClick={() => handleClick('South-Middle')}></div>
      <div className={cx('hotspot', 'south-upper')} onClick={() => handleClick('South-Upper')}></div>
      <div className={cx('hotspot', 'south-vip')} onClick={() => handleClick('South-Vip')}></div>
    </div>
  );
}

export default StadiumView;
