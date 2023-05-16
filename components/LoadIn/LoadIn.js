import styles from './LoadIn.module.css';
import React, { useState, useEffect, useRef } from 'react';

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

    const [animationState, setAnimationState] = useState()// loadingIn ,loadedIn, delayOut, loadingOut, loadedOut, delayIn, clearing , cleared

    const loadInPromise = () => new Promise((resolve) => {
        setAnimationState("loadingIn")
        setMode(0, "loadIn")
        setTimeout(() => setMode(1, "loadIn"), 500);
        setTimeout(() => setMode(2, "loadIn"), 550);
        setTimeout(() => {
            resolve()
            setAnimationState("loadedIn")
        }, 750);
    });

    const loadOutPromise = () => new Promise((resolve) => {
        setAnimationState("loadingOut")
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

    const animationDetails = {
        totalDuration: 3500,
        loadIn: {
            promise: loadInPromise,
            duration: 750,
            accumDuration: 0,
        },
        delayOut: {
            promise: delayPromise,
            duration: 1000,
            animationState: "delayOut",
            accumDuration: 750,
        },
        loadOut: {
            promise: loadOutPromise,
            duration: 750,
            accumDuration: 1750,
        },
        delayIn: {
            promise: delayPromise,
            duration: 1000,
            animationState: "delayIn",
            accumDuration: 2500,
        },
        clearAnimation: {
            promise: clearAnimationPromise,
            duration: 2750,
        }
    };
    const intervalsRefs = useRef([]);
    const timeoutsRefs = useRef([]);
    useEffect(() => {
        if (!isLoaded) {
            /* 
            Because promises cannot be cancelled,
            we can only clear the setIntervals and setTimeouts 
            to cancel the future states of animation 
            */
            [
                animationDetails.loadIn,
                animationDetails.delayOut,
                animationDetails.loadOut,
                animationDetails.delayIn
            ].forEach((animationStateToQueue) => {
                // First animation
                timeoutsRefs.current.push(
                    setTimeout(() => {
                        animationStateToQueue.animationState ?
                            animationStateToQueue.promise(animationStateToQueue.animationState) :
                            animationStateToQueue.promise()
                    }, animationStateToQueue.accumDuration)
                );
                // Subsequent Animations
                timeoutsRefs.current.push(
                    setTimeout(() => {
                        intervalsRefs.current.push(
                            setInterval(() => {
                                animationStateToQueue.animationState ?
                                    animationStateToQueue.promise(animationStateToQueue.animationState) :
                                    animationStateToQueue.promise()
                            }, animationDetails.totalDuration)
                        )
                    }, animationStateToQueue.accumDuration)
                )
            })
        } else {
            // Cut animation at loadedIn, then clearAnimation depending on the state
            intervalsRefs.current.forEach((singleInterval) => clearInterval(singleInterval));
            timeoutsRefs.current.forEach((singleTimeout) => clearInterval(singleTimeout))
            switch (animationState) {
                // loadingIn ,loadedIn, delayOut, loadingOut, loadedOut, delayIn
                case "loadingIn":
                    delayPromise("loadedIn")
                        .then(() => clearAnimationPromise());
                    break;
                case "loadedIn":
                    clearAnimationPromise();
                    break;
                case "delayOut":
                    delayPromise("loadedOut")
                        .then(() => loadOutPromise())
                        .then(() => delayPromise("loadedOut"))
                        .then(() => loadInPromise())
                        .then(() => clearAnimationPromise());
                    break;
                case "loadingOut":
                    delayPromise("loadedOut")
                        .then(() => loadInPromise())
                        .then(() => clearAnimationPromise());
                    break;
                case "loadedOut":
                    loadInPromise()
                        .then(() => clearAnimationPromise());
                    break;
            }
        }
    }, [isLoaded])
    return (
        <>
            <div className={cx(styles.backdrop, "absolute")}>
                <div className={cx(...stylesLookup[frameState].frame)}>
                    <hr className={cx(...stylesLookup[lineState[0]].line1)} />
                    <hr className={cx(...stylesLookup[lineState[1]].line2)} />
                    <hr className={cx(...stylesLookup[lineState[2]].line3)} />
                </div>
            </div>
        </>
    )
}