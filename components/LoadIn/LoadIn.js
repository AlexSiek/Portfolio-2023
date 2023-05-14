import styles from './styles.module.css';
import { useState, useEffect } from 'react';

export default function LoadIn({isLoaded}) {
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
        default: {
            frame: [styles.animationContainer],
        },
        inProgress: {
            frame: [styles.animationContainer, styles.animationContainerFlip]
        },
        completed: {
            frame: [styles.animationContainer, styles.animationContainerFlip, styles.flippedProperties]
        },
        remove: {
            frame: [styles.animationContainer, styles.animationContainerFlip, styles.flippedProperties, styles.removeContainer]
        },
        removed: {
            frame: ["d-none"]
        },
    }

    const [lineState, setLineState] = useState(["standBy", "standBy", "standBy"])
    const [frameState, setFrameState] = useState("default")
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

    const animationLoop = () => {
        const loop = () => {
            loadInAnimation()
            setTimeout(() => {
                if (isLoaded) {
                    // 500ms pause before flip animation
                    setTimeout(() => setFrameState("inProgress"), 500);
                    setTimeout(() => setFrameState("completed"), 1500); //Extra 1s for flip animation
                    setTimeout(() => setFrameState("remove"), 2500);
                    setTimeout(() => setFrameState("removed"), 2750);
                }else {
                    // wait 2s before loading out, wait another 2s then repeat function
                    setTimeout(() => loadOutAnimation(), 2000);
                    setTimeout(() => loop(), 4000);
                }
            }, 750)
        }
        
        loop();
    }
    
    useEffect(() => {
        animationLoop()
    }, [])

    // useEffect(() => {
    //     setStateCutLoop(isLoaded)
    // }, [isLoaded])


    return (
        <>
            <div className={cx(styles.backdrop, "bg-black")}>
                <div className={cx(...stylesLookup[frameState].frame)}>
                    <hr className={cx(...stylesLookup[lineState[0]].line1)} />
                    <hr className={cx(...stylesLookup[lineState[1]].line2)} />
                    <hr className={cx(...stylesLookup[lineState[2]].line3)} />
                </div>
            </div>
        </>
    )
}