import {
  ChevronFirst,
  ChevronLast,
  LogOutIcon,
  User2Icon
} from "lucide-react";
import { createContext, useContext, useState } from "react";
import { formatUser } from "../../utils/formatUser";
import { useSignOut } from "../../core/services/auth";
import logoImage from "../../assets/getsemani-logo-v3-name.webp";

const SidebarContext = createContext();

export function Sidebar({ children, user }) {
  const [expanded, setExpanded] = useState(true);
  const { signOut } = useSignOut();

  const handleLogoutClick = async () => {
    await signOut();
  }

  return (
    <aside className={`h-screen p-0 flex transition-all`}>
      <nav className="h-full flex flex-col bg-sidebar border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src={logoImage}
            className={`overflow-hidden transition-all ${expanded ? "max-w-32" : "max-w-0 p-0"}`}
            alt="Getsemani Logo"
          />
          <button
            onClick={() => setExpanded((expanded) => !expanded)}
            className="p-2 rounded-lg bg-secondary hover:bg-primary"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <User2Icon className="w-10 h-10 bg-secondary-container p-0.5 rounded-md text-primary" />

          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "max-w-52 ml-3" : "max-w-0"}
            `}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-secondary">{user?.nombre} {user?.papellido}</h4>
              <span className="text-xs text-tertiary">
                {/* Usuario: {user?.email.split('@')[0]} */}
                Usuario: {formatUser(user?.email)}
              </span>
            </div>

            <button type="button" onClick={handleLogoutClick} className="ml-2">
              <LogOutIcon
              size={20}
              className="text-primary transition-all hover:text-secondary"
            />
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert, onClick }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      onClick={onClick}
      className={`relative flex items-center py-2 px-2 my-1 font-medium rounded-md cursor-pointer
    transition-colors group
    ${
      active
        ? "bg-linear-to-tr from-on-primary-container to-on-tertiary-container text-on-primary"
        : "hover: bg-primary text-primary-container/80"
    }
    ${onClick ? 'cursor-pointer' : ''}
    `}
    >
      <span className="text-on-primary">{icon}</span>
      <span
        className={`overflow-hidden transition-all ${expanded ? "max-w-52 ml-3" : "max-w-0"}`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-on-primary ${expanded ? "" : "top-2"}`}
        />
      )}

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6
        bg-tertiary text-on-primary text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
