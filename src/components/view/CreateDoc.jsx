import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import InputField from "../../utils/InputField.jsx";
import BACKEND_BASE_URL from "../../config.js";

export default function CreateDoc({ open, setOpen, files, setFiles }) {
  const [title, setTitle] = useState("");

  function closeModal() {
    setOpen(false);
    setTitle("");
  }

  function createFile() {
    fetch(BACKEND_BASE_URL + "/api/docs/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwtKey"),
      },
      body: JSON.stringify({
        title: title,
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setFiles((oldState) => [data, ...oldState]);
      })
      .catch((err) => {
        console.log(err);
      });
    setOpen(false);
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-left align-middle shadow-2xl transition-all">
                <Dialog.Title as="h3" className="font-['Product_sans'] text-xl font-semibold leading-6 text-slate-900">
                  Create Document
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-slate-500">Start with a title. You can rename it later.</p>
                  <InputField value={title} setValue={setTitle} label="Title" type="text" />
                </div>
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
                    onClick={createFile}
                  >
                    Create
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
