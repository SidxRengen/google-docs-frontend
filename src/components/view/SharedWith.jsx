import { Fragment } from "react";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import BACKEND_BASE_URL from "../../config.js";

export default function SharedWith({ open, setOpen, shares, docId, setFiles, isViewer }) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
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
                  Shared With
                </Dialog.Title>
                <div className="mt-4 flex flex-wrap gap-3">
                  {shares.map((share) => {
                    return (
                      <div key={share.username} className="flex min-w-36 flex-col rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="mb-2 w-fit rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">{share.permission}</p>
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-slate-700">{share.username}</p>
                          {!isViewer && (
                            <button
                              onClick={() => {
                                fetch(BACKEND_BASE_URL + `/api/docs/users/remove/${docId}`, {
                                  method: "DELETE",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: localStorage.getItem("jwtKey"),
                                  },
                                  body: JSON.stringify({
                                    username: share.username,
                                    permission: share.permission,
                                  }),
                                })
                                  .then((data) => {
                                    setFiles((oldState) =>
                                      oldState.map((file) => {
                                        if (file.id === docId) {
                                          return {
                                            ...file,
                                            sharedWith: file.sharedWith.filter((s) => s.username !== share.username),
                                          };
                                        }
                                        return file;
                                      }),
                                    );
                                  })
                                  .catch((err) => {
                                    console.log(err);
                                  });
                              }}
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-red-50 hover:text-red-600"
                            >
                              <ClearRoundedIcon sx={{ fontSize: "16px" }} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {shares.length === 0 && (
                    <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">This document has not been shared yet.</p>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
