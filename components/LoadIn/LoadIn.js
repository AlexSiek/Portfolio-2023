import styles from './styles.module.css';
import React, { useState, useEffect } from 'react';

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

    //Load in animation - 750ms
    //if isLoaded -> clear animation - 2500
    //else 1s delay, load out animation - 750ms

    /*
    if promises are delcare to a const, it will run as the const is treated as the reply container.
    thus we put them in a function that returns the promise, so we can trigger the promise when intended.
    */

    const [animationState, setAnimationState] = useState("loadingIn")//LoadingIn, loadedIn, loadingOut, loaded Out, clearing , cleared

    const loadInPromise = () => new Promise((resolve) => {
        setMode(0, "loadIn")
        setTimeout(() => setMode(1, "loadIn"), 500);
        setTimeout(() => setMode(2, "loadIn"), 550);
        setTimeout(() => {
            resolve()
            setAnimationState("loadedIn")
        }, 750);
    });

    const loadOutPromise = () => new Promise((resolve) => {
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
        setTimeout(() => {
            resolve()
            setAnimationState("loadedOut")
        }, 750);
    });

    const clearAnimationPromise = () => new Promise((resolve) => {
        setAnimationState("Clearing")
        setTimeout(() => setFrameState("inProgress"), 500);
        setTimeout(() => setFrameState("completed"), 1500); //Extra 1s for flip animation
        setTimeout(() => setFrameState("remove"), 2500);
        setTimeout(() => setFrameState("removed"), 2750);
        setTimeout(() => {
            resolve()
        }, 2500);
    });

    const delayPromise = (state) => new Promise((resolve) => {
        setAnimationState(state)
        setTimeout(resolve, 1000);
    });

    useEffect(() => {
        //First load in
        
    }, [])

    return (
        <>
            <div className={cx(styles.backdrop)}>
                <div className={cx(...stylesLookup[frameState].frame)}>
                    <hr className={cx(...stylesLookup[lineState[0]].line1)} />
                    <hr className={cx(...stylesLookup[lineState[1]].line2)} />
                    <hr className={cx(...stylesLookup[lineState[2]].line3)} />
                </div>
            </div>
        </>
    )
}