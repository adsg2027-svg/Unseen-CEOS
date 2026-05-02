import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, displayName, userType) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });
    await setDoc(doc(db, 'users', credential.user.uid), {
      displayName,
      email,
      userType,
      createdAt: new Date().toISOString(),
    });
    setUserProfile({ displayName, email, userType });
    return credential;
  }

  async function login(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, 'users', credential.user.uid));
    if (snap.exists()) {
      setUserProfile(snap.data());
      return { userType: snap.data().userType };
    }
    return { userType: null };
  }

  // Returns { isNewUser: boolean, userType: string|null }
  async function signInWithGoogle() {
    const credential = await signInWithPopup(auth, googleProvider);
    const { user: googleUser } = credential;
    const snap = await getDoc(doc(db, 'users', googleUser.uid));
    if (snap.exists()) {
      setUserProfile(snap.data());
      return { isNewUser: false, userType: snap.data().userType };
    }
    // New Google user — profile will be created after they pick a role
    return { isNewUser: true, userType: null };
  }

  async function saveUserType(userType) {
    if (!auth.currentUser) return;
    const { uid, displayName, email } = auth.currentUser;
    const profile = {
      displayName: displayName ?? email,
      email,
      userType,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', uid), profile);
    setUserProfile(profile);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (snap.exists()) {
          setUserProfile(snap.data());
        } else {
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    user,
    userProfile,
    userType: userProfile?.userType ?? null,
    signup,
    login,
    signInWithGoogle,
    saveUserType,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
