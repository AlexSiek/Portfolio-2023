import LoadIn from './LoadIn/LoadIn'
import { useState, useEffect } from 'react';

export default function MainLayout({ children }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsLoaded(true),5000)
    }, [])

    return (
        <>
            {false ? (
                <main>{children}</main>
            ) : 
            (
                <LoadIn
                    isLoaded={isLoaded}
                />
            )}
        </>
    )
}