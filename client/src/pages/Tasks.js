import React, { useState, useEffect } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useLocation } from "react-router-dom"; // Importer useLocation
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import { useGetTasksQuery } from "../redux/slices/apiSlice";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const statusFromUrl = params.get("status") || ""; // Récupérer le statut

  const { data, error, isLoading } = useGetTasksQuery();
  
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(statusFromUrl); // Initialiser avec le paramètre d'URL

  useEffect(() => {
    setStatus(statusFromUrl); // Mettre à jour le statut en fonction de l'URL
  }, [statusFromUrl]); // Surveiller statusFromUrl

  const handleTabChange = (index) => {
    setSelected(index);
    const newStatus = index === 0 ? "todo" : index === 1 ? "in-progress" : "completed"; // Assurez-vous d'utiliser "in-progress"
    setStatus(newStatus);
    window.history.pushState({}, '', `?status=${newStatus}`);
    console.log("Updated status:", newStatus); // Debugging line
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const tasks = data?.status ? data.tasks : [];

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `${status.charAt(0).toUpperCase() + status.slice(1)} Tasks` : "Tasks"} />
        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label='Create Task'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={handleTabChange}>
        {!status && (
          <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
            <TaskTitle label='To Do' className={TASK_TYPE.todo} />
            <TaskTitle label='In Progress' className={TASK_TYPE["in progress"]} />
            <TaskTitle label='Completed' className={TASK_TYPE.completed} />
          </div>
        )}

        {selected !== 1 ? (
          <BoardView tasks={tasks} status={status} />
        ) : (
          <div className='w-full'>
            <Table tasks={tasks} />
          </div>
        )}
      </Tabs>

      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
