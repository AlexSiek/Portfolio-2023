import LoadIn from './LoadIn/LoadIn'
import { useState, useTransition } from 'react';

export default function MainLayout({ children }) {
    const cx = (...classNames) => classNames.join(' ');

    const [isLoaded, setIsLoaded] = useState(false);
    const [isPending, startTransition] = useTransition();

    return (
        <>
            <main>
                <LoadIn
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
                }}>Reset Animation</button>
                {children}
            </main>
        </>
    )
}