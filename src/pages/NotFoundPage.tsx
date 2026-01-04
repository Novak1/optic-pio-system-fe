import { Link } from "react-router-dom";
import { Button, Card } from "../components/ui";
import { useTranslation } from "../hooks/useTranslation";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <Card variant="elevated" className="text-center">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-blue-900 mb-2">404</h1>
          <p className="text-xl text-blue-700">{t("notFound.title")}</p>
        </div>
        <p className="text-gray-600 mb-6">
          {t("notFound.message")}
        </p>
        <Link to="/">
          <Button>{t("notFound.goHome")}</Button>
        </Link>
      </Card>
    </div>
  );
}
