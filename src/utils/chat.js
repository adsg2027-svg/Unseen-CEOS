import {
  collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

export function subscribeToMessages(connectionId, callback) {
  const q = query(
    collection(db, 'chats', connectionId, 'messages'),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export async function sendChatMessage(connectionId, senderUid, senderName, text) {
  if (!text.trim()) return;
  return addDoc(collection(db, 'chats', connectionId, 'messages'), {
    senderUid,
    senderName,
    text: text.trim(),
    createdAt: serverTimestamp(),
  });
}

export async function getConnectionDetails(connectionId) {
  const snap = await getDoc(doc(db, 'connections', connectionId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
