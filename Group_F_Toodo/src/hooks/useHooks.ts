import { useEffect, useState } from "react";
import { ethers } from "ethers";
import TodoABI from "../contract/Todo.json";

const contractAddress = "PASTE_YOUR_DEPLOYED_CONTRACT_ADDRESS";
const enableBlockchainIntegration = false;

type Task = {
  id: number;
  text: string;
  completed: boolean;
  completedAt: string | null;
};

const demoTasks: Task[] = [
  { id: 1, text: "Exercise", completed: false, completedAt: null },
  { id: 2, text: "Go to shopping", completed: true, completedAt: "10:30 AM" },
  { id: 3, text: "Meet my friends", completed: false, completedAt: null },
  { id: 4, text: "Responding to client request", completed: false, completedAt: null },
  { id: 5, text: "Finish writing the report", completed: false, completedAt: null },
];

export const useTodo = () => {
  const [tasks, setTasks] = useState<Task[]>(demoTasks);

  const getContract = async () => {
    const ethereum = (window as Window & { ethereum?: ethers.Eip1193Provider })
      .ethereum;

    if (!ethereum) {
      throw new Error("MetaMask not found");
    }

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const abi = TodoABI as unknown as ethers.InterfaceAbi;

    return new ethers.Contract(contractAddress, abi, signer);
  };

  // 1. Fetch all todos
  const fetchTodos = async () => {
    if (!enableBlockchainIntegration) {
      return;
    }

    try {
      const contract = await getContract();
      const todos = await contract.getAllTodos();

      const formatted = todos.map((todo: any) => ({
        id: Number(todo.id),
        text: todo.title,
        completed: todo.completed,
        completedAt:
          Number(todo.timeCompleted) > 0
            ? new Date(Number(todo.timeCompleted) * 1000).toLocaleTimeString()
            : null,
      }));

      setTasks(formatted);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // 2. Mark complete
  const markComplete = async (id: number) => {
    if (!enableBlockchainIntegration) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                completed: true,
                completedAt: new Date().toLocaleTimeString(),
              }
            : task,
        ),
      );
      return;
    }

    try {
      const contract = await getContract();
      const tx = await contract.markCompleted(id);
      await tx.wait();

      await fetchTodos();
    } catch (err) {
      console.error("Mark complete error:", err);
    }
  };

  // 3. Delete todo
  const deleteTodo = async (id: number) => {
    if (!enableBlockchainIntegration) {
      setTasks((prev) => prev.filter((task) => task.id !== id));
      return;
    }

    try {
      const contract = await getContract();
      const tx = await contract.deleteTodo(id);
      await tx.wait();

      await fetchTodos();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    tasks,
    markComplete,
    deleteTodo,
  };
};
