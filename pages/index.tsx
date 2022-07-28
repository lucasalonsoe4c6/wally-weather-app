import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
// Components
import { Button, Card, Container, Form, FormGroup, Spinner } from "react-bootstrap";
import { Header, Head, FavouriteCities } from "../components";
// Const
import { APIURL } from "../const/const";
// Types
import { WeatherResponse } from "../types";
import { GlobalContext } from "../context";

type Props = {
    data: WeatherResponse
};

export default function Home(props: Props) {
    const [city, setCity] = useState<string>('New York')
    const [data, setData] = useState<WeatherResponse>(props.data);
    const [cities, setCities] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const { user } = useContext(GlobalContext);

    const { code, message, current, location } = data;

    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value);

    const fetchCities = async (newCity: string) => {
        setLoading(true);
        try {
            const response: WeatherResponse = await (await axios.post(`${APIURL}/weather/current`, { city: newCity })).data;
            setLoading(false);
            if (response.code === 1) setData(response);
            if (response.code === 0) setData({ ...data, code: 0, message: '' })
        }
        catch {
            setLoading(false);
            setData({
                ...data,
                code: 0,
                message: "Unexpected error"
            });
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchCities(city);
    };

    const handleReload = () => window?.location.reload();

    const handleAdd = async () => {
        try {
            await (await axios.post(`${APIURL}/user/cities`, { token: user?.token, email: user?.email, city })).data;
            setCities([...cities, city]);
        }
        catch {
            setData({ ...data, code: 0, message: "There was an error while saving city" });
        }
    };

    useEffect(() => {
        setIsLoggedIn(Boolean(user))
        if (user) {
            (async () => {
                try {
                    const response = await (await axios.get(`${APIURL}/user/cities?token=${user?.token}&email=${user.email}`)).data;
                    if (response.code === 0) setData({ ...data, code: 0, message: response.message });
                    setCities(response.cities);
                }
                catch {
                    setData(data => ({ ...data, code: 0, message: "There was an error while fetching cities" }));
                }
            })();
        }
    }, [user]);


    if (code === 0) return (
        <div>
            <Head title="Home" />
            <Header />
            <main className="p-5">
                <Container>
                    <h1>There&apos;s been an error. Please try again</h1>
                    <p>{message}</p>
                    <Button type="button" variant="primary" onClick={handleReload}>Refresh page</Button>
                </Container>
            </main>
        </div>
    );

    return (
        <div>
            <Head title="Home" />
            <Header />
            <main className="p-5">
                <Container>
                    <Card className="mb-4">
                        <Card.Header>
                            <Card.Title>Check weather in any city</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <FormGroup className="mb-2">
                                    <Form.Label>Enter a city</Form.Label>
                                    <Form.Control type="text" placeholder="City" value={city} onChange={handleCityChange} />
                                </FormGroup>
                                <Button type="submit" variant="primary">Check weather</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    <Card className="mb-4">
                        {loading ?
                            <Card.Body className="d-flex align-items-center justify-content-center">
                                <Spinner animation="border" />
                            </Card.Body>
                            :
                            <>
                                <Card.Header>
                                    <Card.Title>{location.name} - {location.country}</Card.Title>
                                    <Card.Subtitle className="mb-2">Current Weather</Card.Subtitle>
                                    {isLoggedIn &&
                                        <Button type="button" onClick={handleAdd} data-testid="add-fav-btn">Add to favourites</Button>
                                    }
                                </Card.Header>
                                <Card.Body className="d-flex flex-column align-items-center justify-content-start">
                                    <Card.Img className="weather-icon" src={current.condition.icon} />
                                    <Card.Text><b>Condition:</b> {current.condition.text}</Card.Text>
                                    <Card.Text><b>Temperature:</b> {current.temp_c}°C</Card.Text>
                                    <Card.Text><b>Feels like</b>: {current.feelslike_c}°C</Card.Text>
                                    <Card.Text><b>Humidity:</b> {current.humidity}%</Card.Text>
                                    <Card.Text><b>Wind:</b> {current.wind_kph} KM/H</Card.Text>
                                    <Card.Text><b>Wind direction</b>: {current.wind_dir}</Card.Text>
                                    <Card.Text><b>Pressure:</b> {current.pressure_mb}</Card.Text>
                                    <Card.Text><b>Visibility:</b> {current.vis_km} KM</Card.Text>
                                </Card.Body>
                            </>}
                    </Card>
                    <FavouriteCities
                        cities={cities}
                        setCities={setCities}
                        setCity={setCity}
                        data={data}
                        setData={setData}
                        fetchCities={fetchCities}
                    />
                </Container>
            </main>
        </div>
    )
};

export async function getStaticProps() {
    try {
        const data = await (await axios.post(`${APIURL}/weather/current`, { city: 'New York' })).data;

        return {
            props: {
                data
            },
            revalidate: 60 * 10
        }
    }
    catch (err) {
        return {
            props: {
                data: {
                    code: 0,
                    message: "Unexpected error"
                },
            }
        }
    }
};