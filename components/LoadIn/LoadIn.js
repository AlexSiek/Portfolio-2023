import styles from './styles.module.css';
import { useState, useEffect } from 'react';

export default function LoadIn({ isLoaded }) {
    const cx = (...classNames) => classNames.join(' ');
    const stylesLookup = {
        standBy: {
            line1: [styles.line1],
            line2: [styles.line2],
            line3: [styles.line3],
        },
        loadIn: {
            line1: [styles.line1, styles.w55, styles.loadLine1],
            line2: [styles.line2, styles.w27, styles.loadLine2],
            line3: [styles.line3, styles.w55, styles.loadLine3],
        },
        loadOut: {
            line1: [styles.line1, styles.w55, styles.unloadLine1],
            line2: [styles.line2, styles.w27, styles.unloadLine2],
            line3: [styles.line3, styles.w55, styles.unloadLine3],
        },
    }

    const [lineState, setLineState] = useState(["standBy","standBy","standBy"])
    const setMode = (idx, state) => {
        setLineState((prevState) => {
            //Must use spread operator, else newArr will be treated as a pointer. React only rerenders if values are replaced
            let newArr = [...prevState]; 
            newArr[idx] = state;
            return newArr;
        })
    }

    const loadInAnimation = () => {
        setMode(0, "loadIn")
        setTimeout(() => setMode(1, "loadIn"), 500);
        setTimeout(() => setMode(2, "loadIn"), 550);
    }

    const loadOutAnimation = () => {
        setMode(2, "loadOut")
        setTimeout(() => {
            setMode(2, "standBy")
            setMode(1, "loadOut")
        }, 500);
        setTimeout(() => {
            setMode(1, "standBy")
            setMode(0, "loadOut")
        }, 550);
        setTimeout(() => setMode(0, "standBy"), 750);
    }

    useEffect(() => {
        loadInAnimation() 
        setTimeout(() => loadOutAnimation(), 2750);
        // loadInAnimation();
        // lineStyles.forEach(x => console.log(...x))
        // setTimeout(() => loadOutAnimation(), 2750);
    }, [])

    /*
    if loading is not done - isLoaded = false;
    if animating in is not done - lineProgress = true;
    if animating out is not done - lineProgress = false;
    */


    return (
        <>
            <div className={cx(styles.backdrop, "bg-black")}>
                <div className={styles.animationContainer}>
                    <hr className={cx(...stylesLookup[lineState[0]].line1)}/>
                    <hr className={cx(...stylesLookup[lineState[1]].line2)}/>
                    <hr className={cx(...stylesLookup[lineState[2]].line3)}/>
                </div>
            </div>
        </>
    )
}