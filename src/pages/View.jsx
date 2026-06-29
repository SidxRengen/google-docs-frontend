import { useState, Fragment, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import DocumentPill from "../components/view/DocumentPill";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CreateDoc from "../components/view/CreateDoc";
import NavBar from "../components/Navbar/Navbar.jsx";
import loadingGif from "../assets/loading.gif";
import { useNavigate } from "react-router-dom";
import BACKEND_BASE_URL from "../config.js";

export default function View() {
  const [selected, setSelected] = useState("owned by anyone");
  const [docs, setDocs] = useState([]);
  const [create, setCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const filteredDocs = docs.filter((file) => {
    if (selected === "owned by me") return file.owner === username;
    if (selected === "shared with me") return file.sharedWith.some((shared) => shared.username === username);
    return true;
  });

  useEffect(() => {
    fetch(BACKEND_BASE_URL + "/api/docs/all", {
      headers: {
        Authorization: localStorage.getItem("jwtKey"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDocs(data);
        console.log(data);
        setLoading(false);
      })
      .catch(() => {
        navigate("/");
      });
  }, []);
  return (
    <>
      {loading && (
        <div className="flex h-screen w-screen items-center justify-center bg-slate-100">
          <img src={loadingGif} className="m-auto" />
        </div>
      )}
      {!loading && (
        <>
          <NavBar title="Docs" signedin={!loading} setsignedin={setLoading} />
          <div className="flex min-h-screen flex-col items-center bg-slate-100 px-4 py-8">
            <div className="mb-6 flex w-full max-w-6xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Dashboard</p>
                <h1 className="mt-1 font-['Product_sans'] text-3xl font-semibold text-slate-900">Recent documents</h1>
                <p className="mt-2 text-sm text-slate-500">{filteredDocs.length} document{filteredDocs.length === 1 ? "" : "s"} visible</p>
              </div>
              <Listbox as="div" value={selected} onChange={setSelected}>
                <Listbox.Button className="inline-flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-blue-200 md:w-56">
                  <span className="font-['Product_sans'] text-sm font-semibold capitalize text-slate-700">{selected}</span>
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
                  <Listbox.Options className="absolute z-10 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 font-['Product_sans'] text-sm text-slate-700 shadow-xl">
                    <Listbox.Option value="owned by anyone" className="cursor-pointer rounded-lg p-2 hover:bg-blue-50">
                      Owned by anyone
                    </Listbox.Option>
                    <Listbox.Option value="owned by me" className="cursor-pointer rounded-lg p-2 hover:bg-blue-50">
                      Owned by me
                    </Listbox.Option>
                    <Listbox.Option value="shared with me" className="cursor-pointer rounded-lg p-2 hover:bg-blue-50">
                      Shared with me
                    </Listbox.Option>
                  </Listbox.Options>
                </Transition>
              </Listbox>
            </div>

            <div className="hidden w-full max-w-6xl items-center rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:flex">
              <h1 className="basis-7/12 truncate">Title</h1>
              <p className="basis-2/12 truncate text-center">Owner</p>
              <p className="basis-2/12 truncate text-center">Shared</p>
              <div className="basis-1/12" />
            </div>

            {filteredDocs.map((file) => {
              return <DocumentPill key={file.id} file={file} files={docs} setFiles={setDocs} />;
            })}
            {filteredDocs.length === 0 && (
              <div className="mt-8 flex w-full max-w-6xl flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <DescriptionRoundedIcon />
                </div>
                <h1 className="font-['Product_sans'] text-xl font-semibold text-slate-800">No documents found</h1>
                <p className="mt-2 max-w-sm text-sm text-slate-500">Create a document or change the filter to see more files.</p>
              </div>
            )}
            <button
              onClick={() => setCreate(true)}
              aria-label="Create document"
              className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800 hover:shadow-xl"
            >
              <AddRoundedIcon sx={{ fontSize: 32 }} />
            </button>
            <CreateDoc open={create} setOpen={setCreate} files={docs} setFiles={setDocs} />
          </div>
        </>
      )}
    </>
  );
}
