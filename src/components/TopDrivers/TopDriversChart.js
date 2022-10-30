import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
// import Dropdown from 'react-bootstrap/Dropdown';
import Stack from 'react-bootstrap/Stack';
import { Chart as ChartJs, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2';
import driverData from '../../data/drivers.json'
import hotelData from '../../data/hotels.json'
import tripsData from '../../data/trips.json'


ChartJs.register(
    ArcElement,
    Title,
    Tooltip,
    Legend
)

const TopDriversChart = () => {
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
        const fullName = data.first_name + ' ' + data.last_name;
        data.full_name = fullName;
    })

    console.log('ddere mzima', fullDataset);

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

    console.log("Filter by Hotel", filtered)

    let groups = filtered.reduce(function (r, o) {
        var k = o.full_name + o.driver_id;
        if (r[k]) {
            if (o.rating) (r[k].totalRating += o.rating) && ++r[k].Average;
        } else {
            r[k] = o;
            r[k].Average = 1; // taking 'Average' attribute as an items counter(on the first phase)
        }
        return r;
    }, {});

    // getting "average of rating"    
    var result = Object.keys(groups).map(function (k) {
        groups[k].Average = Math.round(groups[k].rating / groups[k].Average);
        return groups[k];
    });

    const topN = (obj, num = 1) => {
        const reqObj = {}
        if (num > Object.keys(obj).length) {
            return false;
        };
        Object.keys(obj).sort((a, b) => obj[b] - obj[a]).forEach((key, ind) => {
            if (ind < num) {
                reqObj[key] = obj[key];
            }
        });
        return reqObj;
    };

    let topDrivers = []
    let noOfDrivers = 10
    topDrivers.push(topN(result, noOfDrivers))

    console.log("Res", result)
    console.log("Top", topDrivers)

    let unfilteredHotels = fullDataset.map(item => Object.values(item)[0])
    let filteredHotels = unfilteredHotels.filter((x, i, a) => a.indexOf(x) === i)

    console.log("Hotel Names", filteredHotels)

    console.log(Object.values(topDrivers[0]).map(x => x.full_name))

    const data = {
        labels: Object.values(topDrivers[0]).map(x => x.full_name),
        datasets: [{
            label: 'Top Drivers Rating',
            data: Object.values(topDrivers[0]).map(y => y.Average),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)',
                'rgba(150, 89, 207, 0.2)',
                'rgba(125, 150, 55, 0.2)',
                'rgba(67, 187, 200, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)',
                'rgba(150, 89, 207)',
                'rgba(125, 150, 55',
                'rgba(67, 187, 200)'
            ],
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
                text: `Top ${noOfDrivers} Drivers by Rating`,
                font: {
                    size: 20
                }
            }
        }
    }

    let columnHotel = Object.values(columns[1])[0]
    console.log('hotelKey', columnHotel)

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
                        filteredHotels.map(item => {
                            return (
                                <option value={item}>{item}</option>
                            )
                        })
                    }
                </Form.Select>
            </div>
            <div className="chart container">
                <Doughnut
                    data={data}
                    options={options}
                    height={400}
                    width={600}
                />
            </div>

        </Stack>
    )
}

export default TopDriversChart