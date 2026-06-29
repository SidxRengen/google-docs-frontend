import {useState} from 'react';
import docimg from '../assets/doc_image.png';
import {Transition} from '@headlessui/react';
import {useNavigate} from "react-router-dom";
import InputField from "../utils/InputField.jsx";
import BACKEND_BASE_URL from "../config";

export default function Sign({username, setUsername, setLoggedin}) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [signingIn, setSigningIn] = useState(true);
    const navigate = useNavigate();

    function handleSubmit(e) {
        if (signingIn) {
            fetch(BACKEND_BASE_URL + '/api/auth/login', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    "username": username, "password": password
                }), credentials: 'include',
            }).then(res => {
                if (res.status !== 200) {
                    alert('Username or Password is incorrect');
                    return;
                }
                return res.json()
            }).then(data => {
                console.log(data);
                localStorage.setItem('username', username);
                localStorage.setItem('jwtKey', data.token);
                setLoggedin(true);
                navigate('/view');
            }).catch(err => {
                console.log(err);
            })
        } else {
            fetch(BACKEND_BASE_URL + '/api/auth/register', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    username, email, password
                })
            }).then(res => {
                if (res.status !== 200) {
                    alert('Username or Password is incorrect');
                    return;
                }
                return res.json()
            }).then(data => {
                console.log(data);
                localStorage.setItem('username', username);
                localStorage.setItem('jwtKey', data.token);
                setLoggedin(true);
                navigate('/view');
            }).catch(err => {
                console.log(err);
            })
        }
    }

    return (<div className='flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8'>
        <div
            className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl md:grid-cols-[0.9fr_1.1fr]">
            <div className='flex min-h-72 flex-col justify-between bg-slate-900 p-8 text-white md:p-10'>
                <div>
                    <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
                        <img src={docimg} alt="Docs" width={38} height={38}/>
                    </div>
                    <h1 className='font-["Product_sans"] text-4xl font-semibold tracking-normal'>{signingIn ? 'Sign in' : 'Create account'}</h1>
                    <p className='mt-4 max-w-sm text-sm leading-6 text-slate-300'>Create, share, and edit documents with real-time collaboration.</p>
                </div>
                <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-slate-100">Workspace</p>
                    <p className="mt-1 text-sm text-slate-300">Continue to Docs</p>
                </div>
            </div>
            <div className='flex flex-col justify-center p-6 md:p-10'>
                <div className='mb-6'>
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">{signingIn ? 'Welcome back' : 'Get started'}</p>
                    <h2 className='mt-2 font-["Product_sans"] text-2xl font-semibold text-slate-900'>{signingIn ? 'Access your documents' : 'Set up your Docs account'}</h2>
                </div>
                <div className='flex w-full flex-col'>
                    <Transition show={!signingIn}
                                enter="transition-opacity duration-500"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-500"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                    >
                        <InputField value={email} setValue={setEmail} label='Email' type='email'/>
                    </Transition>
                    <div>
                        <InputField value={username} setValue={setUsername} label='Username' type='text'/>
                    </div>
                    <div>
                        <InputField value={password} setValue={setPassword} label='Password' type='password'/>
                    </div>
                    <Transition show={!signingIn}
                                enter="transition-opacity duration-500"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-500"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                    >
                        <InputField value={confirmPassword} setValue={setConfirmPassword} label='Confirm Password'
                                    type='password'/>
                    </Transition>
                </div>

                <div className='mt-8 flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
                    <button onClick={() => {
                        setSigningIn(!signingIn);
                    }}
                            className="rounded-full px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
                        {signingIn ? 'Create an account' : 'Already have an account'}
                    </button>
                    <button onClick={handleSubmit}
                            className="rounded-full bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800">
                        {signingIn ? 'Sign in' : 'Sign up'}
                    </button>
                </div>
            </div>
        </div>
    </div>)
}
