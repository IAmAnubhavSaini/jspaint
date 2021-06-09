import React from 'react';

export default function Canvas(props: any) {
    return (
        <canvas className={`canvas ${props.klas}`} height="100vh" width="100vw">
        </canvas>
    );
}