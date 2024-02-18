import { get, onValue, ref, remove, set, update } from "firebase/database";
import { db } from ".";
import { errormsg } from "../../components/toastify";

const readData = async (path) => {
  try {
    const reference = ref(db, path);
    const snapshot = await get(reference);
    return snapshot.val();
  } catch (error) {
    errormsg(error.message);
    console.error("Error reading data:", error);
  }
};
const updateData = async (path, newData) => {
  try {
    const reference = ref(db, path);
    await update(reference, newData);
  } catch (error) {
    errormsg(error.message);
  }
};

const deleteData = async (path) => {
  try {
    const reference = ref(db, path);
    await remove(reference);
  } catch (error) {
    errormsg(error.message);
  }
};

const createData = async (path, newData) => {
  try {
    const reference = ref(db, path);
    await set(reference, newData);
  } catch (error) {
    console.error("Error adding data:", error);
  }
};
export { deleteData, updateData, readData, createData };
