"use client";

import { useBoardStore } from "@/store/BoardStore";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const types = [
  {
    id: "todo",
    name: "ToDo",
    description: "A new task to be completed",
    color: "bg-yellow-500",
  },
  {
    id: "inprogress",
    name: "In Progress",
    description: "The work is being done on this item.",
    color: "bg-blue-400",
  },
  {
    id: "done",
    name: "Done",
    description: "This item has been finished.",
    color: "bg-green-600",
  },
  {
    id:"backlog",
    name: 'Backlog',
    description:'Items that are yet to be worked upon.',
    color: 'bg-red-500'

  },
];

function TaskTypeRadioGroup() {
  const [newTaskType, setNewTaskType] = useBoardStore((state) => [
    state.newTaskType,
    state.setNewTaskType,
  ]);

  return (
    <div className="w-full py-5">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup value={newTaskType} onChange={setNewTaskType}>
          <div className="space-y-2">
            {types.map((type) => (
              <RadioGroup.Option
                key={type.id}
                value={type.id}
                className={({ active, checked }) =>
                  `${
                    active
                      ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                      : ""
                  }
                  ${
                    checked
                      ? `${type.color} bg-opacity-75 text-white`
                      : "bg-white"
                  } relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium ${
                              checked ? "text-white" : "text-gray-900"
                            } `}
                          >
                            {type.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? "text-white" : "text-gray-500"
                            }`}
                          >
                            <span>{type.description}</span>
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckCircleIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

export default TaskTypeRadioGroup;
