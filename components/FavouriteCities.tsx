import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import { APIURL } from '../const/const';
import { GlobalContext } from '../context';
import { WeatherResponse } from '../types';

type Props = {
    cities: string[]
    setCities: React.Dispatch<React.SetStateAction<string[]>>
    setCity: React.Dispatch<React.SetStateAction<string>>
    data: WeatherResponse
    setData: React.Dispatch<React.SetStateAction<WeatherResponse>>
    fetchCities: (city: string) => Promise<void>
};

export default function FavouriteCities({ cities, setCities, setCity, data, setData, fetchCities }: Props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { user } = useContext(GlobalContext);

    const handleClick = (city: string) => () => {
        setCity(city);
        fetchCities(city);
    } 
        
    const handleDelete = (city: string) => async () => {
        try {
            await (await axios.delete(`${APIURL}/user/cities?token=${user?.token}&city=${city}`)).data;
            setCities(cities.filter(c => c !== city))
        }
        catch {
            setData({ ...data, code: 0, message: "There was an error while removing city" });
        }
    };

    useEffect(() => {
        setIsLoggedIn(Boolean(user))
    }, [user])

    if (!isLoggedIn || cities.length === 0) return null;

    return (
        <Card>
            <Card.Header>
                <Card.Title>Check weather in your favourite cities</Card.Title>
            </Card.Header>
            <Card.Body>
                {cities.map((city, index) => (
                    <Card.Text key={index}>
                        <span className="mx-2">{city}</span>
                        <Button className="mx-2" onClick={handleClick(city)} variant="primary">Check weather</Button>
                        <Button onClick={handleDelete(city)} variant="danger">Remove</Button>
                    </Card.Text>
                ))}
            </Card.Body>
        </Card>
    )
};