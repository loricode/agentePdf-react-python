import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export const UserIcon = () => {
  return <FontAwesomeIcon icon={faUser} />;
}

export const Navbar = () => {

    return (
        <nav className="w-full px-5 py-2 flex items-center justify-between
            bg-violet-100/60 backdrop-blur-md
            border-b border-violet-300/30
            shadow-[0_4px_20px_rgba(124,58,237,0.15)]">

  <div className="text-xl font-semibold text-violet-900">
    Agent
  </div>

  <div className="flex items-center gap-3">
     <button className="w-10 h-10 flex justify-center items-center rounded-full
           bg-violet-200/50
           shadow-[inset_4px_4px_10px_rgba(124,58,237,0.25),inset_-4px_-4px_10px_rgba(255,255,255,0.8)]
           text-violet-600 text-2xl
           transition
           hover:shadow-[4px_4px_15px_rgba(124,58,237,0.3),-4px_-4px_15px_rgba(255,255,255,0.8)]
           hover:bg-violet-200/70
                 ">
    <UserIcon />
  </button>
  </div>

</nav>
)
}