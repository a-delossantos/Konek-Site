import { LoginForm } from "@/components/LoginForm/LoginForm";
import styles from "./page.module.css";

export const metadata = {
    title: "Konek - Login",
    description: "Konek Social Media",
};

export default function Login() {
    return <LoginForm />;
}
