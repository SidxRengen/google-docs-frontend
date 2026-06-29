import {useId} from "react";

export default function InputField({label, value, setValue, type}) {
    const id = useId();
    return (
        <div className="relative">
            <input id={id} type={type} value={value}
                   onChange={(e) => setValue(e.target.value)}
                   className="peer mt-4 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                   placeholder=' '/>
            <label htmlFor={id}
                   className="absolute start-3 top-2 z-10 origin-[0] -translate-y-4 scale-75 rounded bg-white px-1.5 text-sm text-slate-500 duration-200 peer-placeholder-shown:top-7 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-700">
                {label}
            </label>
        </div>
    )
}
