import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useLogout } from "../../hooks/useAuth";
import { useTranslation } from "../../hooks/useTranslation";
import { Button, DarkModeToggle, LanguageSwitcher } from "../ui";
import { ROUTES } from "../../routes/routes";

export default function Header() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const logout = useLogout();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      // If logout fails (e.g., network error), still clear local state and redirect
      console.error("Logout error:", error);
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              Optic App
            </h1>
          </div>

          {/* User info, language switcher, dark mode toggle and logout */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("auth.loggedInAs", "Logged in as")}
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {user?.username}
              </p>
            </div>
            <LanguageSwitcher />
            <DarkModeToggle size="sm" />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              isLoading={logout.isPending}
            >
              {t("auth.logout")}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
