import { Dialog, Transition, Listbox } from "@headlessui/react";
import { Fragment, useState } from "react";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import InputField from "../../utils/InputField.jsx";
import BACKEND_BASE_URL from "../../config.js";

export default function Share({ open, setOpen, title, docId, setFiles }) {
  const [user, setUser] = useState("");
  const [permission, setPermission] = useState("View");

  function closeModal() {
    setOpen(false);
  }

  function shareFile() {
    fetch(BACKEND_BASE_URL + `/api/docs/users/add/${docId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwtKey"),
      },
      body: JSON.stringify({
        username: user,
        permission: permission === "View" ? "VIEW" : "EDIT",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUser("");
        setFiles((oldState) =>
          oldState.map((file) => {
            if (file.id === docId) {
              return { ...file, sharedWith: [...file.sharedWith, { username: user, permission: permission === "View" ? "VIEW" : "EDIT" }] };
            }
            return file;
          }),
        );
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
    // console.log(user, permission)
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/35 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-visible rounded-2xl border border-slate-200 bg-white p-6 text-left align-middle shadow-2xl transition-all">
                <Dialog.Title as="h3" className="font-['Product_sans'] text-xl font-semibold leading-6 text-slate-900">
                  Share &apos;{title}&apos;
                </Dialog.Title>
                <InputField value={user} setValue={setUser} label="User" type="text" />
                <div className="mt-4 mb-2">
                  <p className="text-sm font-semibold text-slate-600">Permission</p>
                </div>
                <Listbox as="div" className="relative" value={permission} onChange={setPermission}>
                  <Listbox.Button className="inline-flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-3 text-left shadow-sm transition hover:border-blue-200">
                    <span className="font-['Product_sans'] text-sm font-semibold text-slate-700">{permission}</span>
                    <ArrowDropDownRoundedIcon sx={{ color: "#475569", marginLeft: 1, fontSize: 28 }} />
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Listbox.Options className="absolute z-10 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 font-['Product_sans'] text-sm text-slate-700 shadow-xl">
                      <Listbox.Option value="View" className="cursor-pointer rounded-lg p-2 hover:bg-blue-50">
                        View
                      </Listbox.Option>
                      <Listbox.Option value="Edit" className="cursor-pointer rounded-lg p-2 hover:bg-blue-50">
                        Edit
                      </Listbox.Option>
                    </Listbox.Options>
                  </Transition>
                </Listbox>
                <div className="mt-6 flex w-full justify-end gap-3">
                  <button
                    type="button"
                    className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
                    onClick={shareFile}
                  >
                    Share
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
