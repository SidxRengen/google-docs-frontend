import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import BACKEND_BASE_URL from "../../config.js";

export default function Delete({ open, setOpen, file, files, setFiles }) {
  function closeModal() {
    setOpen(false);
  }
  function deleteFile() {
    fetch(BACKEND_BASE_URL + `/api/docs/delete/${file.id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("jwtKey"),
      },
    })
      .then((res) => res.text())
      .then((data) => {
        setFiles((oldState) => oldState.filter((f) => f.id !== file.id));
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
                  Delete document?
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-slate-500">&apos;{file.title}&apos; will be deleted permanently.</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-slate-500">If this file is shared, it will be removed from all shared folders.</p>
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
                    className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
                    onClick={deleteFile}
                  >
                    Delete
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
