import React from "react";
import TaskCard from "./TaskCard";



const BoardView = ({ tasks, status }) => {
  const filteredTasks = tasks.filter((task) => {
    if (status === "completed") return task.stage === "completed";
    if (status === "in-progress") return task.stage === "in progress"; // Assurez-vous que cela correspond exactement
    if (status === "todo") return task.stage === "todo";
    return true; // Return all tasks if no status matches
  });

  console.log("Filtered Tasks:", filteredTasks); // Pour le débogage

  return (
    <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10'>
      {filteredTasks.map((task, index) => (
        <TaskCard task={task} key={index} />
      ))}
    </div>
  );
};

export default BoardView;