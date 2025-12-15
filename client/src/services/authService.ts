// Firebase Authentication Service
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import { User } from '@/types'

// User data interface for Firestore
export interface UserData {
  uid: string
  email: string
  name: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

// Request/Response types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  phone?: string
}

export interface AuthResponse {
  user: User
  token: string
}

/**
 * Register a new user with email and password
 */
export const registerWithEmail = async (
  email: string,
  password: string,
  name: string,
  phone?: string
): Promise<FirebaseUser> => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update user profile with display name
    await updateProfile(user, {
      displayName: name
    })

    // Store additional user data in Firestore
    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      name,
      phone,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await setDoc(doc(db, 'users', user.uid), userData)

    return user
  } catch (error: any) {
    console.error('Registration error:', error)
    throw new Error(getErrorMessage(error.code))
  }
}

/**
 * Sign in with email and password
 */
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error: any) {
    console.error('Login error:', error)
    throw new Error(getErrorMessage(error.code))
  }
}

/**
 * Sign out the current user
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (error: any) {
    console.error('Logout error:', error)
    throw new Error('로그아웃에 실패했습니다')
  }
}

/**
 * Get user data from Firestore
 */
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      return userDoc.data() as UserData
    }
    return null
  } catch (error) {
    console.error('Error getting user data:', error)
    return null
  }
}

/**
 * Convert Firebase error codes to user-friendly Korean messages
 */
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return '이미 사용 중인 이메일입니다'
    case 'auth/invalid-email':
      return '유효하지 않은 이메일 형식입니다'
    case 'auth/operation-not-allowed':
      return '이메일/비밀번호 계정이 활성화되지 않았습니다'
    case 'auth/weak-password':
      return '비밀번호가 너무 약합니다'
    case 'auth/user-disabled':
      return '비활성화된 계정입니다'
    case 'auth/user-not-found':
      return '등록되지 않은 이메일입니다'
    case 'auth/wrong-password':
      return '잘못된 비밀번호입니다'
    case 'auth/invalid-credential':
      return '이메일 또는 비밀번호가 올바르지 않습니다'
    case 'auth/too-many-requests':
      return '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요'
    default:
      return '인증 중 오류가 발생했습니다'
  }
}

/**
 * Convert Firebase User to application User type
 */
const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  const userData = await getUserData(firebaseUser.uid)

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || userData?.name || '',
    phone: userData?.phone,
    createdAt: userData?.createdAt || new Date(),
    updatedAt: userData?.updatedAt || new Date(),
  }
}

/**
 * Auth Service object that matches the expected interface
 */
export const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const firebaseUser = await loginWithEmail(credentials.email, credentials.password)
    const user = await convertFirebaseUser(firebaseUser)
    const token = await firebaseUser.getIdToken()

    return { user, token }
  },

  /**
   * Register a new user
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const firebaseUser = await registerWithEmail(
      userData.email,
      userData.password,
      userData.name,
      userData.phone
    )
    const user = await convertFirebaseUser(firebaseUser)
    const token = await firebaseUser.getIdToken()

    return { user, token }
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    await logout()
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<User> => {
    const firebaseUser = auth.currentUser
    if (!firebaseUser) {
      throw new Error('인증되지 않은 사용자입니다')
    }

    return await convertFirebaseUser(firebaseUser)
  },
}
