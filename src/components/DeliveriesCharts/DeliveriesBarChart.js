import React, { useState, useEffect } from "react";
import { Chart as ChartJs, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2';
import driverData from '../../data/drivers.json'
import hotelData from '../../data/hotels.json'
import tripsData from '../../data/trips.json'
import Stack from "react-bootstrap/Stack";
import Form from 'react-bootstrap/Form';


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
        data.driver_name = data.first_name + ' ' + data.last_name;
        data.start_date_standard = new Date(start_date.getTime() - (start_date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
        data.delivery_date_standard = new Date(deliv_date.getTime() - (deliv_date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
    })

    console.log("full", fullDataset);

    // Filter by Driver & Hotel setup 
    // let unfilteredHotels = Object.values(topDrivers[0]).map(x => x.name)
    // let filteredHotels = unfilteredHotels.filter((x, i, a) => a.indexOf(x) === i)

    // console.log("Hotel Names", filteredHotels)

    // Filtration
    const columns = [
        { accessor: 'driver_name', label: 'Driver Name' },
        { accessor: 'name', label: 'Hotel Name' },
        { accessor: 'rating', label: 'Rating' },
        { accessor: 'start_date_standard', label: 'Start Time' },
        { accessor: 'delivery_date_standard', label: 'End Time' }
    ]

    const filterRows = (rows, filters) => {
        if (filters === '') return rows;

        return rows.filter(row => {
            // console.log(Object.keys(filters));
            return Object.keys(filters).every(accessor => {
                const value = row[accessor]
                // console.log("v: " + value, typeof value);
                const searchValue = filters[accessor]
                // console.log("sV: " + searchValue, typeof searchValue)

                if (typeof value === 'string') {
                    console.log("naona string")
                    return value.toLowerCase().includes(searchValue.toLowerCase())
                }

                if (typeof value === 'boolean') {
                    return (searchValue === 'true' && value) || (searchValue === 'false' && !value)
                }

                if (typeof value === 'number') {
                    console.log("naona no")
                    let sValue = Number(searchValue)
                    return value === sValue
                }

                return false;
            })
        })
    }


    const handleSearch = (value, accessor) => {
        if (value) {
            setFilters(prevFilters => ({
                ...prevFilters,
                [accessor]: value,
            }))
        } else {
            setFilters(prevFilters => {
                const updatedFilters = { ...prevFilters }
                delete updatedFilters[accessor]

                return updatedFilters
            })
        }
    }

    const [filters, setFilters] = useState({});

    const filtered = filterRows(fullDataset, filters);
    let columnHotel = Object.values(columns[1])[0];
    let columnDriver = Object.values(columns[0])[0];

    let unfilteredHotels = fullDataset.map(item => Object.values(item)[0])
    let hotelNames = unfilteredHotels.filter((x, i, a) => a.indexOf(x) === i)
    console.log("filt", hotelNames)

    let unfilteredDrivers = fullDataset.map(item => Object.values(item)[10])
    let driverNames = unfilteredDrivers.filter((x, i, a) => a.indexOf(x) === i)
    console.log("filtDere", driverNames)

    const tripsCount = filtered.reduce((obj, entry) => {
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
        <Stack className="container" id="TopN">
            <div className=" stack-element container">
                <Form.Control
                    key="hotel-name-search"
                    type="search"
                    placeholder="Filter by Hotel"
                    value={filters[columnHotel]}
                    onChange={e => handleSearch(e.target.value, columnHotel)}
                />
                <Form.Select 
                    aria-label="select-hotels"
                    onChange={e => handleSearch(e.target.value, columnHotel)}    
                >
                    <option value="">Choose Hotel</option>
                    {
                        hotelNames.map(item => {
                            return (
                                <option value={item}>{item}</option>
                            )
                        })
                    }
                </Form.Select>
                <Form.Control
                    key="driver-name-search"
                    type="search"
                    placeholder="Filter by Driver"
                    value={filters[columnDriver]}
                    onChange={e => handleSearch(e.target.value, columnDriver)}
                />
                <Form.Select 
                    aria-label="select-hotels"
                    onChange={e => handleSearch(e.target.value, columnDriver)}    
                >
                    <option value="">Choose Driver</option>
                    {
                        driverNames.map(item => {
                            return (
                                <option value={item}>{item}</option>
                            )
                        })
                    }
                </Form.Select>
            </div>
        <div className="container chart" id="DeliveriesChart">
            <Bar
                data={data}
                options={options}
                height={400}
                width={600}
            />
        </div>
        </Stack>
    )
}

export default BarChart