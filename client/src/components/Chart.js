import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetTasksQuery } from "../redux/slices/apiSlice"; 

const processTaskData = (tasks) => {
  const priorityCount = {};
  
  tasks.forEach((task) => {
    const priority = task.priority;
    if (priorityCount[priority]) {
      priorityCount[priority] += 1;
    } else {
      priorityCount[priority] = 1;
    }
  });

  return Object.keys(priorityCount).map((key) => ({
    name: key,
    total: priorityCount[key],
  }));
};

export const Chart = () => {
  const { data, error, isLoading } = useGetTasksQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>An error occurred: {error.message}</p>;

  // Transformer les données pour le graphique
  const chartData = processTaskData(data?.tasks || []);

  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <BarChart width={150} height={40} data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="total" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};
