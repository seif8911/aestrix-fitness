import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase-config"

// User profile operations
export const getUserProfile = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw error
  }
}

export const updateUserProfile = async (userId: string, data: any) => {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// Workout operations
export const addWorkout = async (userId: string, workoutData: any) => {
  try {
    const workoutRef = collection(db, "users", userId, "workouts")
    return await addDoc(workoutRef, {
      ...workoutData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error adding workout:", error)
    throw error
  }
}

export const getWorkouts = async (userId: string) => {
  try {
    const workoutsRef = collection(db, "users", userId, "workouts")
    const q = query(workoutsRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting workouts:", error)
    throw error
  }
}

export const getWorkout = async (userId: string, workoutId: string) => {
  try {
    const workoutRef = doc(db, "users", userId, "workouts", workoutId)
    const docSnap = await getDoc(workoutRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting workout:", error)
    throw error
  }
}

export const updateWorkout = async (userId: string, workoutId: string, data: any) => {
  try {
    const workoutRef = doc(db, "users", userId, "workouts", workoutId)
    await updateDoc(workoutRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating workout:", error)
    throw error
  }
}

export const deleteWorkout = async (userId: string, workoutId: string) => {
  try {
    const workoutRef = doc(db, "users", userId, "workouts", workoutId)
    await deleteDoc(workoutRef)
  } catch (error) {
    console.error("Error deleting workout:", error)
    throw error
  }
}

// Nutrition goal operations
export const updateNutritionGoals = async (userId: string, goals: {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      nutritionGoals: goals,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating nutrition goals:", error);
    throw error;
  }
}

// Wellness tracking operations
export const addWellnessLog = async (userId: string, wellnessData: any) => {
  try {
    const dateStr = wellnessData.date || new Date().toISOString().split('T')[0]
    const wellnessRef = doc(db, "users", userId, "wellness", dateStr)
    
    await setDoc(wellnessRef, {
      ...wellnessData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true })
    
    return wellnessRef
  } catch (error) {
    console.error("Error adding wellness log:", error)
    throw error
  }
}

export const getWellnessLog = async (userId: string, date: string) => {
  try {
    const wellnessRef = doc(db, "users", userId, "wellness", date)
    const docSnap = await getDoc(wellnessRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    }
    return null
  } catch (error) {
    console.error("Error getting wellness log:", error)
    throw error
  }
}

export const getWellnessLogs = async (userId: string, days = 7) => {
  try {
    const wellnessRef = collection(db, "users", userId, "wellness")
    const querySnapshot = await getDocs(wellnessRef)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error("Error getting wellness logs:", error)
    throw error
  }
}

export const getNutritionGoals = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists() && docSnap.data().nutritionGoals) {
      return docSnap.data().nutritionGoals;
    }
    
    // Default goals
    return {
      calories: 2500,
      protein: 180,
      carbs: 250,
      fat: 80
    };
  } catch (error) {
    console.error("Error getting nutrition goals:", error);
    throw error;
  }
}

// Nutrition operations
export const addNutritionLog = async (userId: string, nutritionData: any) => {
  try {
    // Use the date as the document ID for easy retrieval
    const dateStr = nutritionData.date || new Date().toISOString().split("T")[0]
    const nutritionRef = doc(db, "users", userId, "nutrition", dateStr)

    await setDoc(
      nutritionRef,
      {
        ...nutritionData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )

    return nutritionRef
  } catch (error) {
    console.error("Error adding nutrition log:", error)
    throw error
  }
}

export const getNutritionLogs = async (userId: string, days = 7) => {
  try {
    const nutritionRef = collection(db, "users", userId, "nutrition")
    const querySnapshot = await getDocs(nutritionRef)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting nutrition logs:", error)
    throw error
  }
}

export const getNutritionLog = async (userId: string, date: string) => {
  try {
    const nutritionRef = doc(db, "users", userId, "nutrition", date)
    const docSnap = await getDoc(nutritionRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting nutrition log:", error)
    throw error
  }
}

// Recovery tracking operations
export const addRecoveryLog = async (userId: string, recoveryData: any) => {
  try {
    // Use the date as the document ID for easy retrieval
    const dateStr = recoveryData.date || new Date().toISOString().split("T")[0]
    const recoveryRef = doc(db, "users", userId, "recovery", dateStr)

    await setDoc(
      recoveryRef,
      {
        ...recoveryData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )

    return recoveryRef
  } catch (error) {
    console.error("Error adding recovery log:", error)
    throw error
  }
}

export const getRecoveryLogs = async (userId: string, days = 7) => {
  try {
    const recoveryRef = collection(db, "users", userId, "recovery")
    const querySnapshot = await getDocs(recoveryRef)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting recovery logs:", error)
    throw error
  }
}

// Progress photos operations
export const addProgressPhoto = async (userId: string, photoData: any) => {
  try {
    const photosRef = collection(db, "users", userId, "progressPhotos")
    return await addDoc(photosRef, {
      ...photoData,
      createdAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error adding progress photo:", error)
    throw error
  }
}

export const getProgressPhotos = async (userId: string) => {
  try {
    const photosRef = collection(db, "users", userId, "progressPhotos")
    const q = query(photosRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting progress photos:", error)
    throw error
  }
}

// PR (Personal Record) operations
export const updatePR = async (userId: string, exerciseName: string, prData: any) => {
  try {
    const prRef = doc(db, "users", userId, "prs", exerciseName)
    await setDoc(
      prRef,
      {
        ...prData,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  } catch (error) {
    console.error("Error updating PR:", error)
    throw error
  }
}

export const getPRs = async (userId: string) => {
  try {
    const prsRef = collection(db, "users", userId, "prs")
    const querySnapshot = await getDocs(prsRef)

    return querySnapshot.docs.map((doc) => ({
      exercise: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting PRs:", error)
    throw error
  }
}

// Habit tracking operations
export const updateHabitLog = async (userId: string, date: string, habitData: any) => {
  try {
    const habitRef = doc(db, "users", userId, "habits", date)
    await setDoc(
      habitRef,
      {
        ...habitData,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  } catch (error) {
    console.error("Error updating habit log:", error)
    throw error
  }
}

export const getHabitLogs = async (userId: string, days = 7) => {
  try {
    const habitsRef = collection(db, "users", userId, "habits")
    const querySnapshot = await getDocs(habitsRef)

    return querySnapshot.docs.map((doc) => ({
      date: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting habit logs:", error)
    throw error
  }
}
