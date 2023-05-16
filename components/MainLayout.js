import LoadIn from './LoadIn/LoadIn'
import DynamicCensor from './DynamicCensor/DynamicCensor'
import Image from 'next/image';
import { useState, useTransition } from 'react';

export default function MainLayout({ children }) {
    const cx = (...classNames) => classNames.join(' ');

    const [isLoaded, setIsLoaded] = useState(false);
    const [isPending, startTransition] = useTransition();

    return (
        <>
            <main>
                {/* <LoadIn
                    isLoaded={isLoaded}
                />
                <button onClick={() => {
                    startTransition(() => {
                        setIsLoaded(true);
                    });
                }}>Cut Animation</button>
                <button onClick={() => {
                    startTransition(() => {
                        setIsLoaded(false);
                    });
                }}>Reset Animation</button> */}
                {children}
                <DynamicCensor
                    changeInterval={1000}
                    sizeOfBlock={20}
                    opacitySteps={5}
                    width={30}
                    height={10}
                />
            </main>
        </>
    )
}