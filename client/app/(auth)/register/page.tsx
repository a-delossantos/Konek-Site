import { RegisterForm } from "@/components/RegisterForm/RegisterForm";
import styles from "./page.module.css";

export const metadata = {
    title: "Konek - Register",
    description: "Konek Social Media",
};

export default function Register() {
    return <RegisterForm />;
}
