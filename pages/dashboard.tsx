import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ListItem {
  id: string;
  content: string;
  isCompleted: boolean;
  time: string | null;
  note: string | null;
}

interface Todo {
  _id: string;
  title: string;
  lists: ListItem[];
}

Modal.setAppElement("#__next");

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [taskNote, setTaskNote] = useState("");
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const router = useRouter();

  const calculateProgress = () => {
    let completed = 0;
    let pending = 0;

    todos.forEach((todo) => {
      todo.lists.forEach((list) => {
        if (list.isCompleted) completed++;
        else pending++;
      });
    });

    return [
      { name: "Completed", value: completed },
      { name: "Pending", value: pending },
    ];
  };

  const fetchTodos = async (date?: string) => {
    try {
      const response = await axios.get<Todo[]>("/api/todo", {
        params: { date },
      });
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const openModal = (todo?: Todo) => {
    if (todo) {
      setIsEditMode(true);
      setTaskTitle(todo.title);
      setTaskTime(todo.lists[0].time || "");
      setTaskNote(todo.lists[0].note || "");
      setSelectedTodo(todo);
    } else {
      setIsEditMode(false);
      setTaskTitle("");
      setTaskTime("");
      setTaskNote("");
      setSelectedTodo(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setTaskTitle("");
    setTaskTime("");
    setTaskNote("");
    setError("");
    setSelectedTodo(null);
  };

  const openDetail = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setSelectedTodo(null);
    setIsDetailOpen(false);
  };

  const addOrUpdateTask = async () => {
    if (!taskTitle) {
      setError("Nama agenda harus diisi.");
      return;
    }

    try {
      if (isEditMode && selectedTodo) {
        const updatedTask = {
          title: taskTitle,
          listId: selectedTodo.lists[0].id,
          time: taskTime || null,
          note: taskNote || null,
          content: taskTitle,
        };

        await axios.patch(`/api/todo?id=${selectedTodo._id}`, updatedTask);

        setTodos(
          todos.map((todo) => {
            if (todo._id === selectedTodo._id) {
              return {
                ...todo,
                title: taskTitle,
                lists: todo.lists.map((list) => ({
                  ...list,
                  content: taskTitle,
                  time: taskTime || null,
                  note: taskNote || null,
                })),
              };
            }
            return todo;
          })
        );
      } else {
        const newTask = {
          title: taskTitle,
          lists: [
            {
              id:
                new Date().toISOString() +
                Math.random().toString(36).substring(2),
              content: taskTitle,
              isCompleted: false,
              time: taskTime || null,
              note: taskNote || null,
            },
          ],
        };
        const response = await axios.post<Todo>("/api/todo", newTask);
        setTodos([...todos, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving task:", error);
      setError("Terjadi kesalahan saat menyimpan agenda.");
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    fetchTodos(e.target.value);
  };

  const deleteTask = async (taskId: string) => {
    try {
      await axios.delete(`/api/todo`, { params: { id: taskId } });
      setTodos(todos.filter((todo) => todo._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Terjadi kesalahan saat menghapus agenda.");
    }
  };

  const toggleListCompletion = async (
    taskId: string,
    listId: string,
    isCompleted: boolean
  ) => {
    try {
      await axios.patch(`/api/todo?id=${taskId}`, {
        listId,
        isCompleted: !isCompleted,
      });
      setTodos(
        todos.map((todo) =>
          todo._id === taskId
            ? {
                ...todo,
                lists: todo.lists.map((list) =>
                  list.id === listId
                    ? { ...list, isCompleted: !isCompleted }
                    : list
                ),
              }
            : todo
        )
      );
    } catch (error) {
      console.error("Error toggling list completion:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      localStorage.removeItem("token");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Notes App</title>
      </Head>
      <div className="flex flex-col items-center bg-slate-100 min-h-screen relative">
        <header className="w-full bg-white shadow p-4 flex justify-between items-center sticky top-0 z-40">
          <h1
            className="flex text-4xl font-bold text-red-600 ml-8"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            <Image className="w-9 h-9" src="icons.svg" alt="..." />
            otes
          </h1>
          <div className="flex">
            <Link href="/dashboard">
              <button className="text-gray-600 mr-6 mt-3">Dashboard</button>
            </Link>
            <button onClick={handleLogout} className="text-gray-600 mr-6">
              Sign Out
            </button>
            <Image className="w-12 mr-7" src="users.svg" alt="user" />
          </div>
        </header>

        <main className="flex flex-col md:flex-row w-full max-w-full px-4">
          {/* Kolom Kiri: Bar Tanggal dan List Agenda */}
          <div className="flex-1 md:mr-4 pl-10 pt-5">
            <div className="mt-6">
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="appearance-none border rounded-lg p-2 w-full"
              />
            </div>

            {/* List Agenda */}
            <div className="mt-4">
              {todos.length === 0 ? (
                <p className="flex flex-col items-center text-center text-gray-500 mt-36">
                  <Image className="w-40 mb-3" src="empty.svg" alt="empty" />
                  Tidak ada daftar agenda.
                </p>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo._id}
                    className="bg-white shadow rounded-md p-4 mt-4"
                  >
                    <h2 className="font-semibold text-lg mb-2">{todo.title}</h2>
                    {todo.lists.map((list) => (
                      <div key={list.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={list.isCompleted}
                          onChange={() =>
                            toggleListCompletion(
                              todo._id,
                              list.id,
                              list.isCompleted
                            )
                          }
                          className="mr-2"
                        />
                        <span
                          className={
                            list.isCompleted ? "line-through text-gray-400" : ""
                          }
                        >
                          {list.content}
                        </span>
                        <span className="text-gray-500 ml-3">
                          {list.time ? `🕒 ${list.time}` : ""}
                        </span>
                        <button
                          onClick={() => openDetail(todo)}
                          className="text-black hover:text-gray-500 ml-auto"
                        >
                          Detail
                        </button>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Kolom Kanan: Progres Agenda */}
          <div className="flex-[0.7] md:ml-4 pr-10 pt-5">
            <Card className="w-full mt-6 sticky top-0">
              <CardHeader>
                <CardTitle
                  className="text-2xl"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  Agenda Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={calculateProgress()}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#4ade80" />
                          <Cell fill="#f87171" />
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-green-500">
                        {todos.length > 0
                          ? Math.round(
                              (calculateProgress()[0].value /
                                (calculateProgress()[0].value +
                                  calculateProgress()[1].value)) *
                                100
                            )
                          : 0}
                        %
                      </h3>
                      <p className="text-gray-600 text-sm">Completion Rate</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-xl font-semibold text-green-500">
                          {calculateProgress()[0].value}
                        </p>
                        <p className="text-gray-600 text-sm">Completed</p>
                      </div>
                      <div>
                        <p className="text-xl font-semibold text-red-400">
                          {calculateProgress()[1].value}
                        </p>
                        <p className="text-gray-600 text-sm">Pending</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <button
          onClick={() => openModal()}
          className="fixed bottom-16 right-28 bg-gray-800 text-white rounded-2xl w-40 h-12 flex items-center justify-center shadow-lg z-10"
        >
          <span className="mr-2 text-3xl font-semibold">+</span>Buat agenda
        </button>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel={isEditMode ? "Edit Agenda" : "Tambah Agenda"}
          className="bg-white p-6 rounded-lg shadow-md mx-auto mt-20 max-w-3xl"
        >
          <h2 className="text-lg font-semibold mb-4">
            {isEditMode ? "Edit Agenda" : "Tambah Agenda"}
          </h2>

          <p className="ml-1 mb-2">Nama Agenda</p>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Masukkan nama agenda"
            className="border rounded-lg p-2 w-full mb-4"
          />

          <p className="ml-1 mb-2">Tanggal Agenda</p>
          <input
            type="date"
            value={taskTime}
            onChange={(e) => setTaskTime(e.target.value)}
            className="border rounded-lg p-2 w-full mb-4"
          />

          <p className="ml-1 mb-2">Catatan tambahan</p>
          <textarea
            value={taskNote}
            onChange={(e) => setTaskNote(e.target.value)}
            placeholder="Tambahkan catatan"
            className="border rounded-lg p-2 w-full mb-4"
          />

          <div className="flex items-center pb-14">
            <button
              onClick={closeModal}
              className="bg-white hover:bg-gray-200 text-black p-2 rounded-md w-20 border border-gray-300 ml-auto"
            >
              Batal
            </button>

            <button
              onClick={addOrUpdateTask}
              className="bg-blue-500 hover:bg-blue-800 text-white p-2 rounded-md w-auto ml-2"
            >
              {isEditMode ? "Simpan Perubahan" : "Tambah Agenda"}
            </button>
          </div>

          {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        </Modal>

        <Modal
          isOpen={isDetailOpen}
          onRequestClose={closeDetail}
          contentLabel="Detail Agenda"
          className="bg-white p-6 rounded-lg shadow-md mx-auto mt-20 max-w-3xl"
        >
          {selectedTodo && (
            <>
              <h2 className="text-lg font-semibold mb-4">Detail Agenda</h2>
              <p className="mb-4">
                <strong>Judul:</strong> {selectedTodo.title}
              </p>
              <ul className="mb-4">
                <strong>Daftar Agenda:</strong>
                {selectedTodo.lists.map((list) => (
                  <li key={list.id} className="mt-2">
                    <span>{list.content}</span>
                    <br />
                    <small className="text-gray-500">
                      {list.time ? `🕒 ${list.time}` : ""}
                    </small>
                  </li>
                ))}
              </ul>

              <p className="mb-4">
                <strong>Catatan:</strong>{" "}
                {selectedTodo.lists[0].note || "Tidak ada catatan."}
              </p>

              <div className="flex items-center pb-10">
                <button
                  onClick={closeDetail}
                  className="bg-white hover:bg-gray-200 text-black border border-gray-300 p-2 rounded-md w-20 ml-auto"
                >
                  Tutup
                </button>

                <button
                  onClick={() => {
                    closeDetail();
                    openModal(selectedTodo);
                  }}
                  className="bg-green-500 hover:bg-green-800 text-white p-2 rounded-md w-20 ml-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    deleteTask(selectedTodo._id);
                    closeDetail();
                  }}
                  className="bg-red-600 hover:bg-red-800 text-white p-2 rounded-md w-20 ml-2"
                >
                  Hapus
                </button>
              </div>
            </>
          )}
        </Modal>
      </div>
    </>
  );
}
