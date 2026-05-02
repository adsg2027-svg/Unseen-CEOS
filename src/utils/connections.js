import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

// Sort by createdAt desc on the client so we don't need a Firestore composite index
// for every (where + where + orderBy) combination.
function sortByCreatedAtDesc(records) {
  return records.sort((a, b) => {
    const aMs = a.createdAt?.toMillis?.() ?? 0;
    const bMs = b.createdAt?.toMillis?.() ?? 0;
    return bMs - aMs;
  });
}

// Fetch all platform users of a given type
export async function getUsersByType(userType) {
  const q = query(collection(db, 'users'), where('userType', '==', userType));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
}

// Fetch all full funder profiles
export async function getFundersProfiles() {
  const snap = await getDocs(collection(db, 'funders'));
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
}

// Venture sends a funding request to a specific funder
export async function sendFundingRequest({ ventureUid, ventureName, funderUid, funderName, message }) {
  return addDoc(collection(db, 'connections'), {
    type: 'venture_to_funder',
    fromUid: ventureUid,
    fromName: ventureName,
    toUid: funderUid,
    toName: funderName,
    message,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

// Funder sends a connect request to a venture user
export async function sendConnectRequest({ funderUid, funderName, ventureUid, ventureName, message }) {
  return addDoc(collection(db, 'connections'), {
    type: 'funder_to_venture',
    fromUid: funderUid,
    fromName: funderName,
    toUid: ventureUid,
    toName: ventureName,
    message,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

// Funder expresses interest in a mock-data entrepreneur profile
export async function sendProfileInterest({ funderUid, funderName, entrepreneurId, entrepreneurName, message }) {
  return addDoc(collection(db, 'connections'), {
    type: 'funder_to_profile',
    fromUid: funderUid,
    fromName: funderName,
    entrepreneurId,
    entrepreneurName,
    message,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

// Get outgoing requests from a venture user
export async function getVentureOutgoingRequests(ventureUid) {
  const q = query(
    collection(db, 'connections'),
    where('fromUid', '==', ventureUid),
    where('type', '==', 'venture_to_funder')
  );
  const snap = await getDocs(q);
  return sortByCreatedAtDesc(snap.docs.map(d => ({ id: d.id, ...d.data() })));
}

// Get incoming funder connections for a venture user
export async function getVentureIncomingConnections(ventureUid) {
  const q = query(
    collection(db, 'connections'),
    where('toUid', '==', ventureUid),
    where('type', '==', 'funder_to_venture')
  );
  const snap = await getDocs(q);
  return sortByCreatedAtDesc(snap.docs.map(d => ({ id: d.id, ...d.data() })));
}

// Get incoming funding requests for a funder
export async function getFunderIncomingRequests(funderUid) {
  const q = query(
    collection(db, 'connections'),
    where('toUid', '==', funderUid),
    where('type', '==', 'venture_to_funder')
  );
  const snap = await getDocs(q);
  return sortByCreatedAtDesc(snap.docs.map(d => ({ id: d.id, ...d.data() })));
}

// Get funder's sent profile interests
export async function getFunderSentConnections(funderUid) {
  const q = query(
    collection(db, 'connections'),
    where('fromUid', '==', funderUid),
    where('type', '==', 'funder_to_profile')
  );
  const snap = await getDocs(q);
  return sortByCreatedAtDesc(snap.docs.map(d => ({ id: d.id, ...d.data() })));
}

// Update a connection's status (accept / decline)
export async function updateConnectionStatus(connectionId, status) {
  return updateDoc(doc(db, 'connections', connectionId), { status });
}
