import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../../firebase-config';  // Asegúrate de importar correctamente tu instancia de Firebase
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export default AuthProvider
