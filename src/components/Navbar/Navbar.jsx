import docsIcon from "../../assets/doc_image.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";

import Popover from "@mui/material/Popover";

export default function NavBar({ title, signedin, setsignedin, usernames, showBackButton = false }) {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur md:px-8">
        <div className="flex min-w-0 items-center gap-3 text-slate-900">
          {showBackButton && (
            <button
              type="button"
              aria-label="Back to home"
              onClick={() => navigate("/view")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <ArrowBackRoundedIcon />
            </button>
          )}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
            <img src={docsIcon} alt="Docs" width={32} height={32} />
          </div>
          <h1 className="truncate font-['Product_sans'] text-xl font-semibold text-slate-700 md:text-2xl">
            {title}
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          {usernames && (
            <>
              <button
                aria-describedby={id}
                onClick={handleClick}
                className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                <GroupsRoundedIcon sx={{ fontSize: 19 }} />
                <span className="hidden sm:inline">Active</span>
                {usernames.length}
              </button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <div className="flex min-w-48 flex-col gap-2 p-4">
                  {usernames.map((user, index) => {
                    return (
                      <p key={index} className='rounded-lg bg-slate-50 px-3 py-2 font-["Product_sans"] text-sm font-semibold text-slate-700'>
                        {user}
                      </p>
                    );
                  })}
                </div>
              </Popover>
            </>
          )}
          <button
            onClick={() => {
              setsignedin(true);

              localStorage.removeItem("username");
              localStorage.removeItem("jwtKey");
              navigate("/");
            }}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
          >
            <LogoutRoundedIcon sx={{ fontSize: 18 }} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
          <p className="hidden max-w-32 truncate rounded-full bg-slate-100 px-3 py-2 font-['Product_sans'] text-sm font-semibold text-slate-700 md:block">{username}</p>
        </div>
      </div>
    </>
  );
}
