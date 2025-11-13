import { auth } from "../src/firebase";

export const sendData = async (data: any) => {
  try {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error("User not authenticated");

    const res = await fetch("http://localhost:5000/addData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ${token}",
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    console.error("Error sending data:", err);
  }
};