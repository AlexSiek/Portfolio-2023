import styles from './DynamicCensor.module.css';
import React, { useState, useEffect } from 'react';

export default function DynamicCensor({
    changeInterval = 1000,
    opacitySteps = 5, //step to 100 for full black
    sizeOfBlock = 20,
    width = 10,
    height = 5,
}) {
    //Need to disable flex from shrinking the size of pixeks when row has not enough space
    // But need to check if component can scale and skew afterwards
    const cx = (...classNames) => classNames.join(' ');
    const emptyArrayMatrix = Array.from(Array(height)).map(() => Array.from(Array(width)));
    const [arrayOfPixelMix, setArrayOfPixelMix] = useState(emptyArrayMatrix);
    const fillArrayWithRandomMix = (opacitySteps) => {
        const arrayOfPercentage = Array
            .from(Array(Math.floor(100 / opacitySteps + 1)))
            .map((undefined, idx) => idx * opacitySteps)

        setArrayOfPixelMix(() => emptyArrayMatrix.map((column, rowIdx) =>
            column.map(() => arrayOfPercentage[Math.round(Math.random() * 10)])
        ))
    }

    useEffect(() => {
        fillArrayWithRandomMix(opacitySteps)
        setInterval(() => fillArrayWithRandomMix(opacitySteps), changeInterval)
    }, [])

    return (
        <>
            <div className={cx('bg-black', styles.mwContent)}>
                <div className={cx(styles.pixelContainer)}>
                    {
                        Array.from(Array(height)).map((undefined, rowIdx) => (
                            <div className={cx("d-flex", styles.mwContent)} key={rowIdx}>
                                {
                                    Array.from(Array(width)).map((undefined, columnIdx) => (
                                        <div className={cx(styles.pixelBlur, 'bg-black')} key={columnIdx} style={{
                                            'background-color': `color-mix(in srgb, black ${arrayOfPixelMix[rowIdx][columnIdx]}%, white)`,
                                            width: sizeOfBlock + 'px',
                                            height: sizeOfBlock + 'px',
                                        }}>
                                        </div>
                                    ))
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}