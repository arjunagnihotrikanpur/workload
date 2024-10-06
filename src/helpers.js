import Cookies from "universal-cookie";
import { initializeApp } from "firebase/app";
import {
  getDoc,
  setDoc,
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyABaJeFfuFbvo5QOBbIpyzexu2oknHhSGg",
  authDomain: "workload-b9894.firebaseapp.com",
  projectId: "workload-b9894",
  storageBucket: "workload-b9894.appspot.com",
  messagingSenderId: "908306325406",
  appId: "1:908306325406:web:3d9e2ef68b2b1eb0fe408f",
  measurementId: "G-K6VRT7JKY8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

// User Authentication

// Sign up a new user (Admin or Employee)
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Function to create a user with a specific role (admin or employee)
export const signUpWithRole = async (email, password, role) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Save user role in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: role, // 'admin' or 'employee'
    });

    return user;
  } catch (error) {
    throw error;
  }
};

// Log in user and set auth cookie
export const logIn = async (email, password) => {
  const cookies = new Cookies();
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Set the cookie on successful login
    cookies.set("auth", true, { path: "/", maxAge: 3600 });
    return userCredential.user;
  } catch (error) {
    console.error("Login failed:", error);
    throw error; // Rethrow the error for handling in the UI
  }
};

// Get user role from Firestore
export const getUserRole = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data().role; // Ensure 'role' field exists
    } else {
      throw new Error("User role not found");
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
    throw error; // Re-throw the error to be handled elsewhere
  }
};
// Sign in with role and set auth cookie
export const signInWithRole = async (email, password) => {
  const cookies = new Cookies();
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // After successful login
    const role = await getUserRole(userCredential.user.uid);
    cookies.set("auth", true, { path: "/", maxAge: 3600, sameSite: "lax" });
    cookies.set("employeeId", userCredential.user.uid, {
      path: "/",
      maxAge: 3600,
      sameSite: "lax",
    });
    return { user: userCredential.user, role };
  } catch (error) {
    console.error("Login failed:", error);
    throw error; // Rethrow the error to be handled in the component
  }
};

// Log out the user
export const logOut = async () => {
  const cookies = new Cookies();
  try {
    await signOut(auth);
    cookies.remove("auth", { path: "/" });
  } catch (error) {
    throw error;
  }
};

// Task Management

// Add a new task (Admin functionality)
export const addTask = async (
  title,
  description,
  assignedTo,
  assignedBy,
  deadline
) => {
  try {
    const taskRef = await addDoc(collection(db, "tasks"), {
      title,
      description,
      assignedTo,
      assignedBy,
      deadline,
      status: "Yet to start",
      createdAt: serverTimestamp(),
    });
    return taskRef.id;
  } catch (error) {
    throw error;
  }
};

// Get all tasks (Admin and Employee can view tasks)
export const getTasks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    return tasks;
  } catch (error) {
    throw error;
  }
};

// Update task status (Employee functionality)
export const updateTaskStatus = async (taskId, status) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { status });
  } catch (error) {
    throw error;
  }
};

// Function to add a comment to a task
export const addComment = async (taskId, comment) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      comments: arrayUnion(comment), // Assuming comments is an array in Firestore
    });
  } catch (error) {
    throw error;
  }
};

// Function to delete a task
export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
  } catch (error) {
    throw error;
  }
};

// Fetch all employees
export const getAllEmployees = async () => {
  try {
    const employees = [];
    const querySnapshot = await getDocs(collection(db, "users"));

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.role === "employee") {
        employees.push({ id: doc.id, ...data });
      }
    });

    return employees;
  } catch (error) {
    throw error;
  }
};

// Fetch tasks for a specific employee
export const getTasksForEmployee = async (employeeId) => {
  try {
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("assignedTo", "==", employeeId));
    const querySnapshot = await getDocs(q);

    const tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    return tasks;
  } catch (error) {
    throw error;
  }
};

// Assign a new task to an employee
export const assignTask = async (
  assignedTo,
  description,
  deadline,
  assignedBy
) => {
  try {
    await addDoc(collection(db, "tasks"), {
      assignedTo,
      description,
      deadline,
      assignedBy,
      status: "Yet to start",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};
