import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GlobalContext } from '../context';
// Components
import { Container, Nav, Navbar } from 'react-bootstrap';

export default function Header() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { user, setUser } = useContext(GlobalContext);

    const handleLogout = () => {
        localStorage.clear();
        setUser(null)
        router.push('/login')
    };

    useEffect(() => {
        setIsLoggedIn(Boolean(user))
    }, [user])

    return (
        <header>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/">WallyWeatherApp</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {isLoggedIn ?
                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                                :
                                <>
                                    <Nav.Link href="/login">Login</Nav.Link>
                                    <Nav.Link href="/register">Register</Nav.Link>
                                </>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
};