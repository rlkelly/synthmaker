import React from 'react';

const AudioCtx = React.createContext(new AudioContext());

function Context({ children }) {
    return (
        <AudioCtx.Provider>
            {children}
        </AudioCtx.Provider>
    )
}

export default Context;
export { AudioCtx };
