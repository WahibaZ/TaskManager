import React from "react";
import { useGetTasksQuery } from "../redux/slices/apiSlice"; 
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { LuClipboardEdit } from "react-icons/lu";
import { FaNewspaper, FaUsers } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";


import clsx from "clsx";
import { Chart } from "../components/Chart";

const Dashboard = () => {
  const { data, isLoading, error } = useGetTasksQuery(); // Récupération des tâches

  // Vérifiez si les données sont en cours de chargement
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tasks: {error.message}</div>;

  // Assurez-vous d'extraire le tableau de tâches
  const tasks = data?.tasks || []; // Utilisez l'opérateur de coalescence pour définir une valeur par défaut

  // Vérifiez si tasks est bien un tableau
  if (!Array.isArray(tasks)) {
    console.error("Tasks is not an array:", tasks);
    return <div>No tasks available</div>; // Gérer le cas où tasks n'est pas un tableau
  }

  // Calculer les totaux des tâches
  const totalTasks = tasks.length || 0;
  const completedTasks = tasks.filter(task => task.stage === "completed").length || 0;
  const inProgressTasks = tasks.filter(task => task.stage === "in progress").length || 0;
  const todoTasks = tasks.filter(task => task.stage === "todo").length || 0;

  const stats = [
    {
      _id: "1",
      label: "TOTAL TASK",
      total: totalTasks,
      icon: <FaNewspaper />,
      bg: "bg-[#1d4ed8]",
    },
    {
      _id: "2",
      label: "COMPLETED TASK",
      total: completedTasks,
      icon: <MdAdminPanelSettings />,
      bg: "bg-[#0f766e]",
    },
    {
      _id: "3",
      label: "TASK IN PROGRESS",
      total: inProgressTasks,
      icon: <LuClipboardEdit />,
      bg: "bg-[#f59e0b]",
    },
    {
      _id: "4",
      label: "TODOS",
      total: todoTasks,
      icon: <FaArrowsToDot />,
      bg: "bg-[#be185d]",
    },
  ];

  const Card = ({ label, count, bg, icon }) => {
    return (
      <div className='w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between'>
        <div className='h-full flex flex-1 flex-col justify-between'>
          <p className='text-base text-gray-600'>{label}</p>
          <span className='text-2xl font-semibold'>{count}</span>
          <span className='text-sm text-gray-400'>{"Last month"}</span>
        </div>

        <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white", bg)}>
          {icon}
        </div>
      </div>
    );
  };

  return (
    <div className='h-full py-4'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
        {stats.map(({ icon, bg, label, total }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} />
        ))}
      </div>

      <div className='w-full bg-white my-16 p-4 rounded shadow-sm'>
        <h4 className='text-xl text-gray-600 font-semibold'>Chart by Priority</h4>
        <Chart />
      </div>

      <div className='w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8'>
        
      </div>
    </div>
  );
};

export default Dashboard;
