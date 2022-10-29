import React, { useState, useEffect } from "react";
import { Chart as ChartJs, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2';
import driverData from '../../data/drivers.json'
import hotelData from '../../data/hotels.json'
import tripsData from '../../data/trips.json'


ChartJs.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const BarChart = () => {
    const [drivers, setDrivers] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [deliveries, setDeliveries] = useState([]);

    useEffect(() => {
        setDrivers(driverData);
        setHotels(hotelData);
        setDeliveries(tripsData);
    }, [drivers, hotels, deliveries])

    let driverDeliveries = deliveries.map(item => ({
        ...drivers.find(({ uuid }) => item.driver_id === uuid),
        ...item
    }));

    let fullDataset = driverDeliveries.map(item => ({
        ...hotels.find(({ uuid }) => item.hotel_id === uuid),
        ...item
    }));

    fullDataset.forEach(data => {
        const start_date = new Date(data.start_time);
        const deliv_date = new Date(data.delivery_time);
        data.start_date_standard = new Date(start_date.getTime() - (start_date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
        data.delivery_date_standard = new Date(deliv_date.getTime() - (deliv_date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
    })

    console.log("full", fullDataset);

    const tripsCount = fullDataset.reduce((obj, entry) => {
        obj[entry.delivery_date_standard] = (obj[entry.delivery_date_standard] || 0) + 1;
        return obj;
    }, {});

    const sortedTripsCount = Object.keys(tripsCount)
        .sort()
        .reduce((acc, key) => {
            acc[key] = tripsCount[key];

            return acc;
        }, {});

    console.log(Object.values(sortedTripsCount));

    const data = {
        // labels: Object.keys(sortedTripsCount),
        datasets: [{
            label: '# of Deliveries',
            data: sortedTripsCount,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    }

    var options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Deliveries Over the Past Month',
                font: {
                    size: 20
                }
            }
        }
    }

    return (
        <div className="container chart" id="DeliveriesChart">
            <Bar
                data={data}
                options={options}
                height={400}
                width={600}
            />
        </div>
    )
}

export default BarChart