import LoadIn from './LoadIn/LoadIn'
import { useState, useEffect } from 'react';

export default function MainLayout({ children }) {
    const [isLoaded, setIsLoaded] = useState(false);

    // useEffect(() => {
    //     setTimeout(() => setIsLoaded(true), 3500)
    // }, [])

    return (
        <>
            <main>
                <LoadIn
                    isLoaded={isLoaded}
                />
                {children}
            </main>
        </>
    )
}