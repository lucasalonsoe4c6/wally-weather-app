import { useRouter } from "next/router";
import { useContext } from "react";
import { Button } from "react-bootstrap";
import { GlobalContext } from "../context";

export default function Home() {
    const router = useRouter();
    const { setUser } = useContext(GlobalContext);

    const handleClick = () => {
        localStorage.clear();
        setUser(null)
        router.push('/login')
    }
    return (
        <div>
            <h1>Home</h1>
            <Button onClick={handleClick}>Logout</Button>
        </div>
    )
};