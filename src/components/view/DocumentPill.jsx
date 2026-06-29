import {Fragment, useState} from 'react'
import {Menu, Transition} from '@headlessui/react'
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import ShareIcon from '@mui/icons-material/Share';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import Rename from './Rename';
import Delete from './Delete';
import Share from './Share';
import {useNavigate} from "react-router-dom";
import SharedWith from "./SharedWith.jsx";

export default function DocumentPill({file, files, setFiles}) {
  const [rename, setRename] = useState(false);
  const [deleteDoc, setDeleteDoc] = useState(false);
  const [share, setShare] = useState(false);
  const [sharedWith, setSharedWith] = useState(false);
  const username = localStorage.getItem('username');
  const [isOwner] = useState(file.owner === username);
  const [isEditor] = useState(file.sharedWith.some(shared => shared.username === username && shared.permission === 'EDIT'));

  const navigate = useNavigate();

  return (<div
      className="mb-3 flex w-full max-w-6xl cursor-pointer flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md md:flex-row md:items-center md:justify-between md:px-5"
      onClick={(e) => {
        if (e.target.closest('button') || e.target.closest('div[role="dialog"]')) e.stopPropagation(); else navigate(`/edit/${file.id}`, {state: file.title});
        // Router.push(`/edit/${file._id}`);
      }}
  >
    <div className="flex min-w-0 basis-7/12 items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
        <DescriptionRoundedIcon sx={{ fontSize: 22 }} />
      </div>
      <div className="min-w-0">
        <h1 className="truncate font-['Product_sans'] text-lg font-semibold text-slate-800">{file.title}</h1>
        <p className="mt-1 text-xs text-slate-500 md:hidden">Owner: {file.owner}</p>
      </div>
    </div>
    <p className="hidden basis-2/12 truncate text-center font-['Product_sans'] text-sm font-medium text-slate-600 md:block">{file.owner}</p>
    <div
        className="flex basis-2/12 justify-between font-['Product_sans'] text-sm text-slate-600 md:justify-center">
      <span className="md:hidden">Shared</span>
      <button onClick={() => {
        setSharedWith(file.sharedWith.length > 0);
      }}
              className='inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-slate-100 px-3 font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700'>{file.sharedWith.length}</button>
    </div>
    <Rename open={rename} setOpen={setRename} file={file} files={files} setFiles={setFiles}/>
    <Delete open={deleteDoc} setOpen={setDeleteDoc} file={file} files={files} setFiles={setFiles}/>
    <Share open={share} setOpen={setShare} title={file.title} docId={file.id} setFiles={setFiles}/>
    <SharedWith open={sharedWith} setOpen={setSharedWith} shares={file.sharedWith} docId={file.id}
                setFiles={setFiles} isViewer={!isOwner && !isEditor}/>

    <Menu as='div' className="relative inline-block text-right md:basis-1/12 md:text-center"
          onClick={(e) => e.stopPropagation()}
    >
      <Menu.Button type="button"
                   className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
        <MoreVertRoundedIcon />
      </Menu.Button>
      <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white p-2 text-left font-['Product_sans'] shadow-xl focus:outline-none">
          <div className="py-1">
            {isOwner && <Menu.Item>
              <div
                  onClick={() => setDeleteDoc(true)}
                  className='block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700'>
                <DeleteIcon sx={{color: '#5f6368', marginRight: 1}}/>
                Delete
              </div>
            </Menu.Item>}
            {(isEditor || isOwner) && <Menu.Item>
              <div
                  onClick={() => setRename(true)}
                  className='block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700'
              >
                <DriveFileRenameOutlineRoundedIcon sx={{color: '#5f6368', marginRight: 1}}/>
                Rename
              </div>
            </Menu.Item>}
            {(isEditor || isOwner) && <Menu.Item>
              <div
                  onClick={() => setShare(true)}
                  className='block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700'
              >
                <ShareIcon sx={{color: '#5f6368', marginRight: 1}}/>
                Share
              </div>
            </Menu.Item>}
            {!isOwner && !isEditor && <p className='p-2 text-center text-gray-500 hover:cursor-default'>
              Viewers have no control
            </p>}
          </div>

        </Menu.Items>
      </Transition>
    </Menu>


  </div>)
}
