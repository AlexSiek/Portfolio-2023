import LoadIn from './LoadIn/LoadIn'
import { useState, useEffect } from 'react';

export default function MainLayout({ children }) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <>
            {isLoaded ? (
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