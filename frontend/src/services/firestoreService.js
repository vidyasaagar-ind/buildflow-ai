import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'

const projectsCollection = collection(db, 'projects')
const usersCollection = collection(db, 'users')

function removeUndefinedFields(data) {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined))
}

export async function createProject(project, userId) {
  const { id: _ignoredId, ...projectWithoutId } = project || {}
  const payload = removeUndefinedFields({ ...projectWithoutId, userId })
  const created = await addDoc(projectsCollection, payload)
  return { id: created.id, ...payload }
}

export async function getProjects(userId) {
  const q = query(projectsCollection, where('userId', '==', userId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((projectDoc) => ({ id: projectDoc.id, ...projectDoc.data() }))
}

export async function getProjectById(projectId) {
  const projectRef = doc(db, 'projects', projectId)
  const projectSnap = await getDoc(projectRef)
  if (!projectSnap.exists()) return null
  return { id: projectSnap.id, ...projectSnap.data() }
}

export async function updateProject(projectId, data) {
  const projectRef = doc(db, 'projects', projectId)
  const payload = removeUndefinedFields(data || {})
  await updateDoc(projectRef, payload)
}

export async function deleteProject(projectId) {
  const projectRef = doc(db, 'projects', projectId)
  await deleteDoc(projectRef)
}

export async function saveUserSettings(userId, data) {
  const userRef = doc(usersCollection, userId)
  await setDoc(userRef, data, { merge: true })
}

export async function getUserSettings(userId) {
  const userRef = doc(usersCollection, userId)
  const userSnap = await getDoc(userRef)
  if (!userSnap.exists()) return null
  return { id: userSnap.id, ...userSnap.data() }
}
