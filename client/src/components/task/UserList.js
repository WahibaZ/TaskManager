import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { BsChevronExpand } from "react-icons/bs";
import clsx from "clsx";
import { getInitials } from "../../utils";
import { MdCheck } from "react-icons/md";
import { useGetTeamListQuery } from "../../redux/slices/apiSlice";

const UserList = ({ setTeam, team }) => {
  const { data, error, isLoading } = useGetTeamListQuery(); // Fetch users from the API
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleChange = (selected) => {
    console.log("Selected users:", selected); // Check the value of selected

    // Ensure selected only contains valid user objects
    const validUsers = selected.filter((user) => user && user._id);
    console.log("Valid users:", validUsers);

    // Set the state with valid user objects
    setSelectedUsers(validUsers);
    setTeam(validUsers.map((user) => user._id)); // Extract user IDs only
  };

  useEffect(() => {
    console.log("Fetched data:", data); // Debugging the fetched data
    console.log("Current team:", team); // Debugging the current team

    if (data && team.length < 1) {
      setSelectedUsers([data[0]]); // Select the first user by default if no users are selected
    } else {
      // Filter team to include only valid user objects if available
      const updatedTeam = team.map((id) => data.find((user) => user._id === id)).filter(Boolean);
      setSelectedUsers(updatedTeam); 
    }

    console.log("Selected users after update:", selectedUsers); // Debugging selected users after update
  }, [data, team]);

  if (isLoading) return <p>Loading...</p>;
  if (error || !data) return <p>Error fetching users or no users available.</p>;

  return (
    <div>
      <p className='text-gray-700'>Assign Task To: </p>
      <Listbox value={selectedUsers} onChange={handleChange} multiple>
        <div className='relative mt-1'>
          <Listbox.Button className='relative w-full cursor-default rounded bg-white pl-3 pr-10 text-left px-3 py-2.5 border border-gray-300 sm:text-sm'>
            <span className='block truncate'>
              {selectedUsers?.filter(Boolean).map((user) => user?.name || "Unnamed").join(", ")}
            </span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              <BsChevronExpand className='h-5 w-5 text-gray-400' aria-hidden='true' />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
              {data.map((user) => (
                <Listbox.Option
                  key={user._id}
                  className={({ active }) => 
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={user}
                >
                  {({ selected }) => (
                    <>
                      <div className={clsx("flex items-center gap-2 truncate", selected ? "font-medium" : "font-normal")}>
                        <div className='w-6 h-6 rounded-full text-white flex items-center justify-center bg-violet-600'>
                          <span className='text-center text-[10px]'>{getInitials(user.name)}</span>
                        </div>
                        <span>{user.name}</span>
                      </div>
                      {selected ? (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
                          <MdCheck className='h-5 w-5' aria-hidden='true' />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default UserList;
