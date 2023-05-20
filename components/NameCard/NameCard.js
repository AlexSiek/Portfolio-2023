import styles from './NameCard.module.css';
import Image from 'next/image';
import { useState, useTransition } from 'react';

export default function NameCard({
    isShown,
    setIsShown
}) {
    const cx = (...classNames) => classNames.join(' ');
    return (
        <>
            <div className={cx('desktop-only', 'bg-black', styles.cardContainer)}>
                <div className={cx(styles.card)}>
                    <div className={cx(styles.cardFront)}>

                    </div>
                    <div className={cx(styles.cardBack)}>

                    </div>
                </div>
            </div>

            <div className={cx('mobile-only', 'bg-black', styles.cardContainer)}>
                <div className={cx(styles.card)}>
                    <div className={cx(styles.cardFront)}>

                    </div>
                    <div className={cx(styles.cardBack)}>

                    </div>
                </div>
            </div>
        </>
    )
}