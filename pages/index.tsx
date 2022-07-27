import React from "react";
import axios from "axios";
// Components
import { Button, Card, Container } from "react-bootstrap";
import { Header, Head } from "../components";
// Const
import { APIURL } from "../const/const";
// Types
import { WeatherResponse } from "../types";

type Props = {
    data: WeatherResponse
};

export default function Home({ data }: Props) {
    const { code, message, current, location } = data;
    console.log(current, location)

    if (code === 0) return (
        <div>
            <Head title="Home" />
            <Header />
            <main className="p-5">
                <Container>
                    <h1>There's been an error. Please try again</h1>
                    <p>{message}</p>
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
                    <Card>
                        <Card.Header>
                            <Card.Title>{location.name} - {location.country}</Card.Title>
                            <Card.Subtitle>Current Weather</Card.Subtitle>
                        </Card.Header>
                        <Card.Body className="d-flex flex-column align-items-center">
                            <Card.Img className="w-25 mx-auto" src={current.condition.icon} />
                            <Card.Text><b>Condition:</b> {current.condition.text}</Card.Text>
                            <Card.Text><b>Temperature:</b> {current.temp_c}°C</Card.Text>
                            <Card.Text><b>Feels like</b>: {current.feelslike_c}°C</Card.Text>
                            <Card.Text><b>Humidity:</b> {current.humidity}%</Card.Text>
                            <Card.Text><b>Wind:</b> {current.wind_kph} KM/H</Card.Text>
                            <Card.Text><b>Wind direction</b>: {current.wind_dir}</Card.Text>
                            <Card.Text><b>Pressure:</b> {current.pressure_mb}</Card.Text>
                            <Card.Text><b>Visibility:</b> {current.vis_km} KM</Card.Text>
                        </Card.Body>
                    </Card>
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
            revalidate: 60 
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